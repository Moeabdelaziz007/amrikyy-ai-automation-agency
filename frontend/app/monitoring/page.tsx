'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import SelfHealingPanel from '@/components/monitoring/SelfHealingPanel';
import MCPHandshake from '@/components/animations/MCPHandshake';
import SuperpositionPanel from '@/components/monitoring/SuperpositionPanel';
import OptimizationPanel from '@/components/monitoring/OptimizationPanel';
import { useBackendStore } from '@/lib/stores/backendStore';
import { useBackendWebSocket } from '@/lib/hooks/useBackendWebSocket';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function MonitoringPage() {
  // Superposition state from live store
  const { 
    isConnected,
    superpositionState, 
    currentMetrics,
    messageHistory,
    updateSuperpositionState,
    updateCurrentMetrics,
    addMessage
  } = useBackendStore();

  // Live WebSocket connection
  const { isConnecting, lastMessage, subscribeToUpdates } = useBackendWebSocket({
    onConnectionChange: (connected) => {
      if (connected) {
        // Subscribe to system updates when connected
        subscribeToUpdates('system_status');
        subscribeToUpdates('agent_updates');
        subscribeToUpdates('task_updates');
      }
    }
  });

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      addMessage(lastMessage);
      
      // Handle superposition state from backend
      if (lastMessage.type === 'system_status' || lastMessage.type === 'superposition_anomaly') {
        if (lastMessage.payload) {
          updateCurrentMetrics(lastMessage.payload);
        }
        
        if (lastMessage.superposition_state) {
          updateSuperpositionState(lastMessage.superposition_state);
        }
      }
    }
  }, [lastMessage, addMessage, updateCurrentMetrics, updateSuperpositionState]);

  // Convert live metrics from backend to UI format
  const metrics: SystemMetric[] = [
    {
      id: 'cpu_usage',
      name: 'CPU Usage',
      value: Math.round(currentMetrics.cpu_usage || 0),
      unit: '%',
      status: (currentMetrics.cpu_usage || 0) > 90 ? 'critical' : (currentMetrics.cpu_usage || 0) > 75 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'memory_usage',
      name: 'Memory Usage',
      value: Math.round(currentMetrics.memory_usage || 0),
      unit: '%',
      status: (currentMetrics.memory_usage || 0) > 85 ? 'critical' : (currentMetrics.memory_usage || 0) > 70 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'disk_usage',
      name: 'Disk Usage',
      value: Math.round(currentMetrics.disk_usage || 0),
      unit: '%',
      status: (currentMetrics.disk_usage || 0) > 90 ? 'critical' : (currentMetrics.disk_usage || 0) > 80 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'network_io',
      name: 'Network I/O',
      value: Math.round(currentMetrics.network_io || 0),
      unit: 'MB/s',
      status: (currentMetrics.network_io || 0) > 1000 ? 'critical' : (currentMetrics.network_io || 0) > 800 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'active_users',
      name: 'Active Users',
      value: Math.round(currentMetrics.active_users || 0),
      unit: 'users',
      status: (currentMetrics.active_users || 0) > 10000 ? 'critical' : (currentMetrics.active_users || 0) > 8000 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'api_latency_p99',
      name: 'API Latency P99',
      value: Math.round(currentMetrics.api_latency_p99 || 0),
      unit: 'ms',
      status: (currentMetrics.api_latency_p99 || 0) > 1000 ? 'critical' : (currentMetrics.api_latency_p99 || 0) > 500 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    }
  ];

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'High memory usage detected on server-02',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      resolved: true
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  // Check if a metric is in superposition state (causally linked to an anomaly)
  const isMetricInSuperposition = (metricId: string) => {
    return superpositionState?.entangledMetrics?.includes(metricId) || false;
  };

  // Get superposition styling for a metric
  const getSuperpositionStyling = (metricId: string) => {
    if (!isMetricInSuperposition(metricId)) {
      return {};
    }
    
    const isPrimaryAnomaly = metricId === superpositionState?.primaryAnomaly;
    const baseStyle = {
      borderColor: isPrimaryAnomaly ? '#ef4444' : '#06b6d4', // red for primary, cyan for entangled
      boxShadow: isPrimaryAnomaly 
        ? '0 0 20px rgba(239, 68, 68, 0.5)' 
        : '0 0 15px rgba(6, 182, 212, 0.4)',
      animation: 'pulse 2s infinite'
    };
    
    return baseStyle;
  };

  return (
    <div>
      {isConnecting && (
        <MCPHandshake onComplete={() => {}} />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">System Monitoring</h1>
                <p className="text-gray-400">Real-time system health and performance monitoring</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className="text-sm font-medium">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {isConnecting && (
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-900/50 text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Connecting...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Live Data Display */}
          {!isConnecting && messageHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 bg-green-900/20 border border-green-400/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-green-400">Live Data Flow Active</h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">
                  ✅ Backend WebSocket connection established
                </p>
                <p className="text-gray-300 text-sm">
                  📨 Messages received: {messageHistory.length}
                </p>
                <p className="text-gray-300 text-sm">
                  🔗 Connection status: <span className={`font-semibold ${
                    isConnected ? 'text-green-400' : 'text-red-400'
                  }`}>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
                </p>
                {messageHistory[0] && (
                  <div className="mt-4 p-3 bg-black/40 rounded-lg border border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">Latest Message:</p>
                    <p className="text-cyan-300 font-mono text-sm">
                      {messageHistory[0].type}: {JSON.stringify(messageHistory[0].payload || messageHistory[0].data, null, 2)}
                    </p>
                    {messageHistory[0].superposition_state && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Superposition State:</p>
                        <div className="text-xs text-purple-300">
                          <p>Confidence: {Math.round((messageHistory[0].superposition_state.confidence || 0) * 100)}%</p>
                          <p>Causes: {Object.keys(messageHistory[0].superposition_state.probabilities || {}).length}</p>
                          {messageHistory[0].superposition_state.recommendations?.length > 0 && (
                            <p>Recommendations: {messageHistory[0].superposition_state.recommendations.length}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Quantum Superposition Analysis */}
          <SuperpositionPanel className="mb-8" />

          {/* Quantum Optimization Panel */}
          {superpositionState?.optimal_solution && (
            <OptimizationPanel 
              className="mb-8"
              optimalSolution={superpositionState.optimal_solution}
              confirmedRootCause={superpositionState.confirmed_root_cause || ''}
              onExecute={() => {
                console.log('Executing optimal solution:', superpositionState.optimal_solution?.action);
                // TODO: Implement actual execution logic
              }}
            />
          )}

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300"
                style={getSuperpositionStyling(metric.id)}
              >
                {/* Superposition Indicator */}
                {isMetricInSuperposition(metric.id) && (
                  <div className="absolute top-2 right-2">
                    <div className={`w-3 h-3 rounded-full ${
                      metric.id === superpositionState?.primaryAnomaly ? 'bg-red-400' : 'bg-cyan-400'
                    } animate-pulse`} />
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(metric.status)}
                    <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
                    {isMetricInSuperposition(metric.id) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-900/50 text-cyan-300 border border-cyan-400/30">
                        {metric.id === superpositionState?.primaryAnomaly ? 'ANOMALY' : 'SUPERPOSITION'}
                      </span>
                    )}
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">{metric.value}</span>
                    <span className="text-gray-400">{metric.unit}</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.status === 'healthy' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    Updated {new Date(metric.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Self-Healing Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <SelfHealingPanel />
            </motion.div>

            {/* Alerts Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">System Alerts</h2>
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">{alerts.length} alerts</span>
                </div>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'error' ? 'border-red-500 bg-red-900/20' :
                      alert.type === 'warning' ? 'border-yellow-500 bg-yellow-900/20' :
                      'border-blue-500 bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{alert.message}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {alert.resolved && (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}