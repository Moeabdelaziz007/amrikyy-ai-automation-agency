// Type definitions for monitoring components
export type MonitoringComponent =
  | { type: 'cpu'; usage: number; status: 'critical' | 'healthy' | 'warning' }
  | { type: 'memory'; usage: number; status: 'critical' | 'healthy' | 'warning' }
  | { type: 'network'; latency: number; status: 'critical' | 'healthy' | 'warning' }
  | { type: 'database'; connections: number; response_time: number; status: 'critical' | 'healthy' | 'warning' }
  | { type: 'other'; response_time: number; status: 'critical' | 'healthy' | 'warning' };

// System Health Interface
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  database_status: 'connected' | 'disconnected' | 'slow';
  server_status: 'running' | 'stopped' | 'maintenance';
  last_healing: string;
  auto_fixes_count: number;
}

// Healing Activity Interface
export interface HealingActivity {
  id: string;
  timestamp: string;
  component: string;
  issue: string;
  action: string;
  status: 'success' | 'failed' | 'pending';
  duration: number;
}

// IDE Agent Task Interface
export interface IDEAgentTask {
  id: string;
  user_id: string;
  task_description: string;
  code_context?: string;
  file_path?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  result?: string;
  quality_score?: number;
  created_at: string;
  updated_at: string;
}
