'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Server
} from 'lucide-react';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  auto_fixes: number;
  errors_detected: number;
  performance_score: number;
  components: {
    cpu: { usage: number; status: 'healthy' | 'warning' | 'critical' };
    memory: { usage: number; status: 'healthy' | 'warning' | 'critical' };
    network: { latency: number; status: 'healthy' | 'warning' | 'critical' };
    database: { connections: number; status: 'healthy' | 'warning' | 'critical' };
    server: { response_time: number; status: 'healthy' | 'warning' | 'critical' };
  };
  recent_activities: Array<{
    id: string;
    type: 'fix' | 'warning' | 'error' | 'optimization';
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export default function SelfHealingPanel() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoHealingEnabled, setAutoHealingEnabled] = useState(true);

  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        const response = await fetch('/api/system-health');
        if (response.ok) {
          const data = await response.json();
          setSystemHealth(data);
        }
      } catch (error) {
        console.error('Error fetching system health:', error);
        // Fallback mock data for demo
        setSystemHealth({
          status: 'healthy',
          uptime: 99.9,
          auto_fixes: 12,
          errors_detected: 3,
          performance_score: 94,
          components: {
            cpu: { usage: 45, status: 'healthy' },
            memory: { usage: 62, status: 'healthy' },
            network: { latency: 12, status: 'healthy' },
            database: { connections: 8, status: 'healthy' },
            server: { response_time: 150, status: 'healthy' }
          },
          recent_activities: [
            {
              id: '1',
              type: 'fix',
              message: 'Automatically resolved memory leak in user session handling',
              timestamp: '2 minutes ago',
              severity: 'medium'
            },
            {
              id: '2',
              type: 'optimization',
              message: 'Optimized database query performance by 23%',
              timestamp: '5 minutes ago',
              severity: 'low'
            },
            {
              id: '3',
              type: 'warning',
              message: 'High CPU usage detected in background tasks',
              timestamp: '8 minutes ago',
              severity: 'high'
            }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemHealth();
    
    // Update every 5 seconds
    const interval = setInterval(fetchSystemHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fix': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'optimization': return <Zap className="w-4 h-4 text-blue-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-carbon-black to-medium-gray border border-neon-green/20 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!systemHealth) {
    return (
      <div className="bg-gradient-to-br from-carbon-black to-medium-gray border border-red-500/20 rounded-xl p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-400 mb-2">System Health Unavailable</h3>
          <p className="text-gray-400">Unable to connect to self-healing system</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-carbon-black to-medium-gray border border-neon-green/20 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Self-Healing System</h3>
            <p className="text-sm text-gray-400">Autonomous system monitoring & recovery</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoHealingEnabled(!autoHealingEnabled)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              autoHealingEnabled 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {autoHealingEnabled ? 'Enabled' : 'Disabled'}
          </button>
          <button className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="text-center p-4 bg-gray-800/50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className={`text-2xl font-bold mb-1 ${getStatusColor(systemHealth.status)}`}>
            {systemHealth.uptime}%
          </div>
          <div className="text-sm text-gray-400">System Uptime</div>
        </motion.div>

        <motion.div
          className="text-center p-4 bg-gray-800/50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {systemHealth.auto_fixes}
          </div>
          <div className="text-sm text-gray-400">Auto Fixes</div>
        </motion.div>

        <motion.div
          className="text-center p-4 bg-gray-800/50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {systemHealth.errors_detected}
          </div>
          <div className="text-sm text-gray-400">Errors Detected</div>
        </motion.div>

        <motion.div
          className="text-center p-4 bg-gray-800/50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {systemHealth.performance_score}
          </div>
          <div className="text-sm text-gray-400">Performance Score</div>
        </motion.div>
      </div>

      {/* Component Status */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">Component Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(systemHealth.components).map(([key, component]) => (
            <motion.div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center space-x-3">
                {key === 'cpu' && <Cpu className="w-4 h-4 text-cyber-blue" />}
                {key === 'memory' && <HardDrive className="w-4 h-4 text-electric-purple" />}
                {key === 'network' && <Wifi className="w-4 h-4 text-warning-orange" />}
                {key === 'database' && <Database className="w-4 h-4 text-neon-green" />}
                {key === 'server' && <Server className="w-4 h-4 text-red-400" />}
                <span className="text-sm text-gray-300 capitalize">{key}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {key === 'cpu' || key === 'memory' ? `${component.usage}%` : 
                   key === 'network' ? `${component.latency}ms` :
                   key === 'database' ? `${component.connections} conn` :
                   `${component.response_time}ms`}
                </span>
                <div className={getStatusColor(component.status)}>
                  {getStatusIcon(component.status)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Recent Activities</h4>
        <div className="space-y-3">
          {systemHealth.recent_activities.map((activity) => (
            <motion.div
              key={activity.id}
              className="flex items-start space-x-3 p-3 bg-gray-800/20 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                activity.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                activity.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {activity.severity}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
