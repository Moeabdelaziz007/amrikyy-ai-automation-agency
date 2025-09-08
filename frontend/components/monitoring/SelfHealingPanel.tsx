'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Server
} from 'lucide-react';
import { SystemHealth, HealingActivity } from '../../types';

// Memoized component for better performance
const ComponentStatus = React.memo(({ icon: Icon, name, status, value }: { 
  icon: React.ElementType, 
  name: string, 
  status: string, 
  value?: string | undefined
}) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-blue-400" />
      <span className="text-sm font-medium text-white">{name}</span>
    </div>
    <div className="flex items-center space-x-2">
      {value && <span className="text-sm text-gray-300">{value}</span>}
      <span className={`text-sm font-medium ${
        status === 'healthy' ? 'text-green-500' :
        status === 'warning' ? 'text-yellow-500' :
        status === 'critical' ? 'text-red-500' : 'text-gray-500'
      }`}>
        {status}
      </span>
    </div>
  </div>
));

ComponentStatus.displayName = 'ComponentStatus';

const SelfHealingPanel: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
          status: 'healthy',
          uptime: 99.9,
    cpu_usage: 45,
    memory_usage: 62,
    network_latency: 12,
    database_status: 'connected',
    server_status: 'running',
    last_healing: new Date().toISOString(),
    auto_fixes_count: 23
  });

  const [recentActivities, setRecentActivities] = useState<HealingActivity[]>([
            {
              id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      component: 'Database',
      issue: 'Connection timeout',
      action: 'Restarted connection pool',
      status: 'success',
      duration: 2.3
            },
            {
              id: '2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      component: 'API Server',
      issue: 'High memory usage',
      action: 'Cleared cache and restarted service',
      status: 'success',
      duration: 8.7
            },
            {
              id: '3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      component: 'Network',
      issue: 'Packet loss detected',
      action: 'Switched to backup connection',
      status: 'success',
      duration: 1.2
    }
  ]);

  const [isHealing, setIsHealing] = useState(false);

  // Memoized status colors and icons
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  }, []);

  // Optimized healing trigger
  const triggerHealing = useCallback(async () => {
    setIsHealing(true);
    
    // Simulate healing process
    setTimeout(() => {
      const newActivity: HealingActivity = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        component: 'System',
        issue: 'Performance optimization',
        action: 'Automated system tuning',
        status: 'success',
        duration: Math.random() * 10 + 1
      };
      
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      setSystemHealth(prev => ({
        ...prev,
        auto_fixes_count: prev.auto_fixes_count + 1,
        last_healing: new Date().toISOString()
      }));
      setIsHealing(false);
    }, 3000);
  }, []);

  // Memoized component statuses with proper typing
  const componentStatuses = useMemo(() => [
    { icon: Cpu, name: 'CPU', status: 'healthy' as const, value: `${systemHealth.cpu_usage.toFixed(1)}%` },
    { icon: HardDrive, name: 'Memory', status: 'healthy' as const, value: `${systemHealth.memory_usage.toFixed(1)}%` },
    { icon: Wifi, name: 'Network', status: 'healthy' as const, value: `${systemHealth.network_latency.toFixed(1)}ms` },
    { icon: Database, name: 'Database', status: systemHealth.database_status, value: 'connected' },
    { icon: Server, name: 'Server', status: systemHealth.server_status, value: 'running' }
  ], [systemHealth]);

  // Optimized real-time updates with throttling
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        cpu_usage: Math.max(10, Math.min(90, prev.cpu_usage + (Math.random() - 0.5) * 10)),
        memory_usage: Math.max(20, Math.min(85, prev.memory_usage + (Math.random() - 0.5) * 5)),
        network_latency: Math.max(5, Math.min(50, prev.network_latency + (Math.random() - 0.5) * 5))
      }));
    }, 10000); // Reduced frequency from 5s to 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-green-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Self-Healing System</h2>
            <p className="text-gray-400">Automated system monitoring and recovery</p>
          </div>
        </div>
          <button
          onClick={triggerHealing}
          disabled={isHealing}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isHealing
              ? 'bg-yellow-500/20 text-yellow-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
          }`}
        >
          {isHealing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span>Healing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Trigger Healing</span>
            </div>
          )}
          </button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-xl border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-400 font-medium">System Status</span>
            {getStatusIcon(systemHealth.status)}
          </div>
          <div className="text-2xl font-bold text-white capitalize">{systemHealth.status}</div>
          <div className="text-sm text-gray-400">All systems operational</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-400 font-medium">Uptime</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{systemHealth.uptime}%</div>
          <div className="text-sm text-gray-400">Last 30 days</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-400 font-medium">Auto Fixes</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{systemHealth.auto_fixes_count}</div>
          <div className="text-sm text-gray-400">Issues resolved</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-4 rounded-xl border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-400 font-medium">Last Healing</span>
            <Activity className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {new Date(systemHealth.last_healing).toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-400">Today</div>
        </div>
      </div>

      {/* Component Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Component Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {componentStatuses.map((component, index) => (
            <ComponentStatus key={index} {...component} />
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Recent Healing Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 
                  activity.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <div className="text-sm font-medium text-white">
                    {activity.component} - {activity.issue}
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.action} • {activity.duration.toFixed(1)}s
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </div>
              </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelfHealingPanel;