'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface BackendWebSocketMessage {
  type: string;
  data?: any;
  payload?: Record<string, number>;
  timestamp: string;
  agent_id?: string;
  task_id?: string;
  // Superposition state fields
  superposition_state?: {
    probabilities: Record<string, number>;
    confidence: number;
    recommendations: string[];
    primaryAnomaly: string | null;
    anomalyLevel: 'critical' | 'warning' | null;
    entangledMetrics: string[];
    // Quantum Cognition fields
    confirmed_root_cause?: string | null;
    confirmed_details?: string | null;
    confirmed_severity?: string | null;
    all_confirmed_causes?: Array<{
      cause: string;
      details: string;
      severity: string;
      duration: number;
    }>;
    investigation_confidence?: number;
    total_investigation_time?: number;
    investigation_timestamp?: string;
    // Quantum Optimization fields
    optimal_solution?: {
      action: string;
      description: string;
      cost: number;
      performance_gain: number;
      risk: number;
      implementation_time: number;
      reversibility: string;
      dependencies: string[];
      utility_score: number;
      analysis: {
        total_options_analyzed: number;
        utility_score_range: {
          highest: number;
          lowest: number;
          average: number;
        };
        alternatives_considered: Array<{
          action: string;
          utility_score: number;
          performance_gain: number;
          cost: number;
        }>;
      };
    } | null;
  };
  message?: string;
}

interface BackendWebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: BackendWebSocketMessage | null;
  connectionStatus: {
    connected: boolean;
    readyState: number | undefined;
    reconnectAttempts: number;
  };
}

interface UseBackendWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  onConnectionChange?: (connected: boolean) => void;
}

export function useBackendWebSocket(options: UseBackendWebSocketOptions = {}) {
  const {
    url = 'ws://localhost:8001/monitoring/ws',
    autoConnect = true,
    onConnectionChange
  } = options;

  const [state, setState] = useState<BackendWebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
    connectionStatus: {
      connected: false,
      readyState: undefined,
      reconnectAttempts: 0
    }
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Backend WebSocket connected');
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          connectionStatus: {
            ...prev.connectionStatus,
            connected: true,
            readyState: ws.readyState,
            reconnectAttempts: 0
          }
        }));
        reconnectAttemptsRef.current = 0;
        onConnectionChange?.(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: BackendWebSocketMessage = JSON.parse(event.data);
          console.log('📨 Backend WebSocket message received:', message);
          
          setState(prev => ({
            ...prev,
            lastMessage: message
          }));
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 Backend WebSocket disconnected:', event.code, event.reason);
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          connectionStatus: {
            ...prev.connectionStatus,
            connected: false,
            readyState: ws.readyState
          }
        }));
        onConnectionChange?.(false);

        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          
          console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Backend WebSocket error:', error);
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: 'WebSocket connection error',
          connectionStatus: {
            ...prev.connectionStatus,
            connected: false,
            readyState: ws.readyState,
            reconnectAttempts: reconnectAttemptsRef.current
          }
        }));
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to create connection'
      }));
    }
  }, [url, onConnectionChange]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      connectionStatus: {
        ...prev.connectionStatus,
        connected: false,
        readyState: undefined,
        reconnectAttempts: 0
      }
    }));
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
        wsRef.current.send(messageStr);
        console.log('📤 Backend WebSocket message sent:', message);
      } catch (error) {
        console.error('❌ Failed to send WebSocket message:', error);
      }
    } else {
      console.warn('⚠️ Backend WebSocket not connected, message not sent:', message);
    }
  }, []);

  const sendPing = useCallback(() => {
    sendMessage({ type: 'ping', timestamp: new Date().toISOString() });
  }, [sendMessage]);

  const subscribeToUpdates = useCallback((subscriptionType: string) => {
    sendMessage({ 
      type: 'subscribe', 
      data: { subscription_type: subscriptionType },
      timestamp: new Date().toISOString() 
    });
  }, [sendMessage]);

  // Update connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current) {
        setState(prev => ({
          ...prev,
          connectionStatus: {
            ...prev.connectionStatus,
            readyState: wsRef.current?.readyState,
            reconnectAttempts: reconnectAttemptsRef.current
          }
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    sendPing,
    subscribeToUpdates
  };
}
