'use client';

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

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

interface SystemStatus {
  status: string;
  active_connections: number;
  connection_info: Array<{
    client_id: string;
    connected_at: string;
    last_activity: string;
  }>;
  timestamp: string;
  features: string[];
}

interface AgentStatus {
  agent_id: string;
  status: 'idle' | 'working' | 'error' | 'offline';
  current_task?: string;
  performance_metrics: {
    cpu_usage: number;
    memory_usage: number;
    tasks_completed: number;
    error_rate: number;
  };
  last_updated: string;
}

interface TaskStatus {
  task_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  agent_id?: string;
  progress: number;
  estimated_completion?: string;
  created_at: string;
  updated_at: string;
}

interface BackendStore {
  // Connection state
  isConnected: boolean;
  lastConnected: string | null;
  connectionError: string | null;
  
  // System data
  systemStatus: SystemStatus | null;
  agents: Record<string, AgentStatus>;
  tasks: Record<string, TaskStatus>;
  
  // Message history
  messageHistory: BackendWebSocketMessage[];
  
  // Superposition state (replaces entanglement)
  superpositionState: {
    probabilities: Record<string, number>;
    confidence: number;
    recommendations: string[];
    primaryAnomaly: string | null;
    anomalyLevel: 'critical' | 'warning' | null;
    entangledMetrics: string[];
    // Quantum Cognition fields
    confirmed_root_cause: string | null;
    confirmed_details: string | null;
    confirmed_severity: string | null;
    all_confirmed_causes: Array<{
      cause: string;
      details: string;
      severity: string;
      duration: number;
    }>;
    investigation_confidence: number;
    total_investigation_time: number;
    investigation_timestamp: string;
    // Quantum Optimization fields
    optimal_solution: {
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
  } | null;
  currentMetrics: Record<string, number>;
  
  // Actions
  setConnectionStatus: (connected: boolean, error?: string) => void;
  updateSystemStatus: (status: SystemStatus) => void;
  updateAgentStatus: (agent: AgentStatus) => void;
  updateTaskStatus: (task: TaskStatus) => void;
  addMessage: (message: BackendWebSocketMessage) => void;
  clearHistory: () => void;
  updateSuperpositionState: (state: any) => void;
  updateCurrentMetrics: (metrics: Record<string, number>) => void;
}

export const useBackendStore = create<BackendStore>()(
  devtools(
    subscribeWithSelector(
      (set) => ({
      // Initial state
      isConnected: false,
      lastConnected: null,
      connectionError: null,
      systemStatus: null,
      agents: {},
      tasks: {},
      messageHistory: [],
      
      // Superposition state
      superpositionState: null,
      currentMetrics: {},

      // Actions
      setConnectionStatus: (connected: boolean, error?: string) => {
        set((state) => ({
          isConnected: connected,
          lastConnected: connected ? new Date().toISOString() : state.lastConnected,
          connectionError: error || null
        }));
      },

      updateSystemStatus: (status: SystemStatus) => {
        set(() => ({
          systemStatus: status
        }));
      },

      updateAgentStatus: (agent: AgentStatus) => {
        set((state) => ({
          agents: {
            ...state.agents,
            [agent.agent_id]: agent
          }
        }));
      },

      updateTaskStatus: (task: TaskStatus) => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [task.task_id]: task
          }
        }));
      },

      addMessage: (message: BackendWebSocketMessage) => {
        set((state) => ({
          messageHistory: [message, ...state.messageHistory.slice(0, 99)], // Keep last 100 messages
        }));
      },

      clearHistory: () => {
        set(() => ({
          messageHistory: []
        }));
      },

      updateSuperpositionState: (state: any) => {
        set({ superpositionState: state });
      },

      updateCurrentMetrics: (metrics: Record<string, number>) => {
        set({ currentMetrics: metrics });
      }
      })
    ),
    {
      name: 'backend-store'
    }
  )
);
