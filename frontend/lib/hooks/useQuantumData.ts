/**
 * React Hook for Quantum Command Center API
 * Provides real-time data and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { quantumAPI, QuantumJob, SystemMetrics, RemediationStatus } from './quantumAPI';

export interface QuantumSystemData {
  quantum_systems: Record<string, any>;
  hpc_clusters: Record<string, any>;
  system_health: any;
  metrics: SystemMetrics | null;
  remediation: RemediationStatus | null;
  jobs: QuantumJob[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export const useQuantumData = () => {
  const [data, setData] = useState<QuantumSystemData>({
    quantum_systems: {},
    hpc_clusters: {},
    system_health: null,
    metrics: null,
    remediation: null,
    jobs: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Test connection and authentication
  const checkConnection = useCallback(async () => {
    try {
      const connected = await quantumAPI.testConnection();
      const authenticated = await quantumAPI.verifyAuthentication();
      
      setIsConnected(connected);
      setIsAuthenticated(authenticated);
      
      return { connected, authenticated };
    } catch (error) {
      setIsConnected(false);
      setIsAuthenticated(false);
      return { connected: false, authenticated: false };
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [quantumResponse, hpcResponse, healthResponse, metricsResponse, remediationResponse] = await Promise.all([
        quantumAPI.getQuantumSystems(),
        quantumAPI.getHPCClusters(),
        quantumAPI.getSystemHealth(),
        quantumAPI.getMonitoringMetrics(),
        quantumAPI.getRemediationStatus(),
      ]);

      setData(prev => ({
        ...prev,
        quantum_systems: quantumResponse.data?.quantum_systems || {},
        hpc_clusters: hpcResponse.data?.hpc_clusters || {},
        system_health: healthResponse.data,
        metrics: metricsResponse.data,
        remediation: remediationResponse.data,
        loading: false,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      }));
    }
  }, []);

  // Submit quantum job
  const submitJob = useCallback(async (jobData: {
    quantum_provider: string;
    hpc_cluster: string;
    job_type: string;
    parameters: Record<string, any>;
  }) => {
    try {
      const response = await quantumAPI.submitQuantumJob(jobData);
      if (response.data) {
        setData(prev => ({
          ...prev,
          jobs: [...prev.jobs, response.data!],
        }));
      }
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Get job status
  const getJobStatus = useCallback(async (jobId: string) => {
    try {
      const response = await quantumAPI.getJobStatus(jobId);
      if (response.data) {
        setData(prev => ({
          ...prev,
          jobs: prev.jobs.map(job => 
            job.job_id === jobId ? response.data! : job
          ),
        }));
      }
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Initialize data fetching
  useEffect(() => {
    const initialize = async () => {
      await checkConnection();
      await fetchAllData();
    };

    initialize();
  }, [checkConnection, fetchAllData]);

  // Set up real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const cleanup = quantumAPI.startRealTimeUpdates((updateData) => {
      setData(prev => ({
        ...prev,
        system_health: updateData.health,
        metrics: updateData.metrics,
        remediation: updateData.remediation,
        lastUpdated: updateData.timestamp,
      }));
    });

    return cleanup;
  }, [isConnected]);

  return {
    data,
    isConnected,
    isAuthenticated,
    checkConnection,
    fetchAllData,
    submitJob,
    getJobStatus,
  };
};

// Hook for specific quantum systems
export const useQuantumSystems = () => {
  const { data, isConnected } = useQuantumData();
  
  return {
    systems: data.quantum_systems,
    loading: data.loading,
    error: data.error,
    isConnected,
  };
};

// Hook for HPC clusters
export const useHPCClusters = () => {
  const { data, isConnected } = useQuantumData();
  
  return {
    clusters: data.hpc_clusters,
    loading: data.loading,
    error: data.error,
    isConnected,
  };
};

// Hook for monitoring metrics
export const useMonitoringMetrics = () => {
  const { data, isConnected } = useQuantumData();
  
  return {
    metrics: data.metrics,
    loading: data.loading,
    error: data.error,
    isConnected,
    lastUpdated: data.lastUpdated,
  };
};

// Hook for remediation status
export const useRemediationStatus = () => {
  const { data, isConnected } = useQuantumData();
  
  return {
    remediation: data.remediation,
    loading: data.loading,
    error: data.error,
    isConnected,
  };
};
