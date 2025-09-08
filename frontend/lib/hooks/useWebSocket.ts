'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AGUIConnection, RealTimeAgentManager, AGUIEvent } from '@/lib/ag-ui/RealTimeManager';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: AGUIEvent | null;
  connectionStatus: {
    connected: boolean;
    readyState: number | undefined;
    reconnectAttempts: number;
  };
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = 'ws://localhost:3001/ws',
    autoConnect = true
  } = options;

  const [state, setState] = useState<WebSocketState>({
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

  const connectionRef = useRef<AGUIConnection | null>(null);
  const agentManagerRef = useRef<RealTimeAgentManager | null>(null);

  const connect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.disconnect();
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Create connection
      connectionRef.current = new AGUIConnection(url);
      agentManagerRef.current = new RealTimeAgentManager(url);

      // Set up event handlers
      connectionRef.current.on('connected', () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null
        }));
      });

      connectionRef.current.on('disconnected', () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false
        }));
      });

      connectionRef.current.on('error', (error: any) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: error?.message || 'Connection error'
        }));
      });

      connectionRef.current.on('message', (message: AGUIEvent) => {
        setState(prev => ({
          ...prev,
          lastMessage: message
        }));
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to create connection'
      }));
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.disconnect();
      connectionRef.current = null;
    }
    if (agentManagerRef.current) {
      agentManagerRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false
    }));
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (connectionRef.current) {
      connectionRef.current.send(message);
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }, []);

  const sendAgentCommand = useCallback((agentId: string, command: any) => {
    if (agentManagerRef.current) {
      agentManagerRef.current.sendAgentCommand(agentId, command);
    }
  }, []);

  // Update connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionRef.current) {
        const status = connectionRef.current.getConnectionStatus();
        setState(prev => ({
          ...prev,
          connectionStatus: status
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
    sendAgentCommand,
    agentManager: agentManagerRef.current
  };
}

// Hook for agent-specific WebSocket functionality
export function useAgentWebSocket(agentId: string) {
  const { sendAgentCommand, lastMessage, isConnected } = useWebSocket();
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [agentEvents, setAgentEvents] = useState<AGUIEvent[]>([]);

  useEffect(() => {
    if (lastMessage && lastMessage.agent_id === agentId) {
      setAgentEvents(prev => [lastMessage, ...prev.slice(0, 9)]);
      
      if (lastMessage.type === 'agent_status') {
        setAgentStatus(lastMessage.data);
      }
    }
  }, [lastMessage, agentId]);

  const triggerAgent = useCallback((command: any) => {
    sendAgentCommand(agentId, command);
  }, [agentId, sendAgentCommand]);

  return {
    agentStatus,
    agentEvents,
    isConnected,
    triggerAgent
  };
}
