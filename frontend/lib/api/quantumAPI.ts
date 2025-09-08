/**
 * Quantum Command Center - Frontend API Integration
 * Connects frontend components to backend API endpoints
 */

import { apiService, ApiResponse } from '../api/apiService';

export interface QuantumSystem {
  name: string;
  status: string;
  qubits: number;
  queue_length: number;
  avg_wait_time: string;
}

export interface HPCCluster {
  name: string;
  status: string;
  nodes: number;
  cpu_utilization: number;
  memory_utilization: number;
}

export interface QuantumJob {
  job_id: string;
  status: string;
  progress: number;
  quantum_qubits: number;
  hpc_utilization: number;
  error_message?: string;
}

export interface SystemMetrics {
  quantum_metrics: {
    total_jobs: number;
    success_rate: number;
    avg_execution_time: string;
    queue_wait_time: string;
  };
  hpc_metrics: {
    total_jobs: number;
    success_rate: number;
    avg_execution_time: string;
    resource_utilization: number;
  };
  system_metrics: {
    api_response_time: string;
    database_connections: number;
    memory_usage: string;
    cpu_usage: string;
  };
}

export interface RemediationStatus {
  self_healing: {
    enabled: boolean;
    last_check: string;
    issues_detected: number;
    issues_resolved: number;
    success_rate: number;
  };
  remediation_actions: Array<{
    action_id: string;
    type: string;
    status: string;
    timestamp: string;
  }>;
  recommendations: string[];
}

class QuantumCommandCenterAPI {
  // Quantum Systems Management
  async getQuantumSystems(): Promise<ApiResponse<{ quantum_systems: Record<string, QuantumSystem> }>> {
    return apiService.getQuantumData();
  }

  async getHPCClusters(): Promise<ApiResponse<{ hpc_clusters: Record<string, HPCCluster> }>> {
    return apiService.request('/api/hpc-data');
  }

  // Job Management
  async submitQuantumJob(data: {
    quantum_provider: string;
    hpc_cluster: string;
    job_type: string;
    parameters: Record<string, any>;
  }): Promise<ApiResponse<QuantumJob>> {
    return apiService.request('/api/submit-job', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJobStatus(jobId: string): Promise<ApiResponse<QuantumJob>> {
    return apiService.request(`/api/job-status/${jobId}`);
  }

  // System Health & Monitoring
  async getSystemHealth(): Promise<ApiResponse<{
    quantum_systems: Record<string, string>;
    hpc_clusters: Record<string, string>;
    api_status: string;
    last_updated: string;
  }>> {
    return apiService.request('/api/system-health');
  }

  async getMonitoringMetrics(): Promise<ApiResponse<SystemMetrics>> {
    return apiService.request('/api/monitoring/metrics');
  }

  async getRemediationStatus(): Promise<ApiResponse<RemediationStatus>> {
    return apiService.request('/api/remediation/status');
  }

  // Real-time Updates (WebSocket simulation)
  async startRealTimeUpdates(callback: (data: any) => void): Promise<void> {
    // Simulate real-time updates with polling
    const pollInterval = setInterval(async () => {
      try {
        const [health, metrics, remediation] = await Promise.all([
          this.getSystemHealth(),
          this.getMonitoringMetrics(),
          this.getRemediationStatus(),
        ]);

        callback({
          health: health.data,
          metrics: metrics.data,
          remediation: remediation.data,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    }, 5000); // Update every 5 seconds

    // Return cleanup function
    return () => clearInterval(pollInterval);
  }

  // Utility Methods
  async testConnection(): Promise<boolean> {
    try {
      const response = await apiService.healthCheck();
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async verifyAuthentication(): Promise<boolean> {
    try {
      const response = await apiService.verifyApiKey();
      return response.data?.valid === true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const quantumAPI = new QuantumCommandCenterAPI();

// Export for React hooks
export const useQuantumAPI = () => {
  return {
    quantumAPI,
    testConnection: () => quantumAPI.testConnection(),
    verifyAuth: () => quantumAPI.verifyAuthentication(),
  };
};
