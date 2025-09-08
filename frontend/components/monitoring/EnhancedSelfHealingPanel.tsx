'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Server,
  Eye,
  EyeOff
} from 'lucide-react';
import { SystemHealth, HealingActivity } from '../../types';

// Enhanced Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = memo(({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top': return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom': return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left': return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right': return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default: return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${getPositionClasses(position)}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl border border-gray-700 text-sm max-w-xs">
              {content}
              <div className={`absolute w-0 h-0 ${
                position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900' :
                position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900' :
                position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900' :
                'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Tooltip.displayName = 'Tooltip';

// Enhanced Component Status with Dynamic Status Calculation
interface ComponentStatusProps {
  icon: React.ElementType;
  name: string;
  value: number;
  unit: string;
  threshold: { warning: number; critical: number };
  details: string;
}

const ComponentStatus: React.FC<ComponentStatusProps> = memo(({ 
  icon: Icon, 
  name, 
  value, 
  unit, 
  threshold, 
  details 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic status calculation
  const status = useMemo(() => {
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning) return 'warning';
    return 'healthy';
  }, [value, threshold]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  }, []);

  const getBackgroundColor = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  }, []);

  return (
    <Tooltip content={details} position="top">
      <motion.div
        className={`${getBackgroundColor(status)} rounded-lg p-4 border transition-all duration-300 cursor-pointer ${
          isHovered ? 'scale-105 shadow-lg' : 'scale-100'
        }`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -2,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
        }}
        role="button"
        tabIndex={0}
        aria-label={`${name} component status: ${status} at ${value}${unit}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${getStatusColor(status)}`} aria-hidden="true" />
            <span className="text-sm font-medium text-white">{name}</span>
          </div>
          <div className={`${getStatusColor(status)}`}>
            {getStatusIcon(status)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">{value.toFixed(1)}{unit}</span>
          <span className={`text-xs font-medium ${getStatusColor(status)} capitalize`}>
            {status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-gray-700/50 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full ${
              status === 'healthy' ? 'bg-green-400' :
              status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / threshold.critical) * 100, 100)}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>
    </Tooltip>
  );
});

ComponentStatus.displayName = 'ComponentStatus';

// Enhanced Activity Item Component
interface ActivityItemProps {
  activity: HealingActivity;
  index: number;
}

const ActivityItem: React.FC<ActivityItemProps> = memo(({ activity, index }) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  }, []);

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      role="listitem"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-3 h-3 rounded-full ${
          activity.status === 'success' ? 'bg-green-400' : 
          activity.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
        }`} aria-hidden="true" />
        <div>
          <div className="text-sm font-medium text-white">
            {activity.component} - {activity.issue}
          </div>
          <div className="text-xs text-gray-400">
            {activity.action} • {activity.duration.toFixed(1)}s
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className={`${getStatusColor(activity.status)}`}>
          {getStatusIcon(activity.status)}
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${getStatusColor(activity.status)} capitalize`}>
            {activity.status}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(activity.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ActivityItem.displayName = 'ActivityItem';

// Enhanced Self-Healing Panel
const EnhancedSelfHealingPanel: React.FC = () => {
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
  const [showAllActivities, setShowAllActivities] = useState(false);

  // Dynamic system status calculation
  const systemStatus = useMemo(() => {
    const criticalCount = [
      systemHealth.cpu_usage >= 90,
      systemHealth.memory_usage >= 90,
      systemHealth.network_latency >= 100
    ].filter(Boolean).length;

    const warningCount = [
      systemHealth.cpu_usage >= 80,
      systemHealth.memory_usage >= 80,
      systemHealth.network_latency >= 50
    ].filter(Boolean).length;

    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  }, [systemHealth]);

  // Memoized component statuses with dynamic calculations
  const componentStatuses = useMemo(() => [
    { 
      icon: Cpu, 
      name: 'CPU', 
      value: systemHealth.cpu_usage, 
      unit: '%', 
      threshold: { warning: 80, critical: 90 },
      details: `CPU Usage: ${systemHealth.cpu_usage.toFixed(1)}%\nProcesses: 127 active\nLoad Average: 1.2, 1.5, 1.8`
    },
    { 
      icon: HardDrive, 
      name: 'Memory', 
      value: systemHealth.memory_usage, 
      unit: '%', 
      threshold: { warning: 80, critical: 90 },
      details: `Memory Usage: ${systemHealth.memory_usage.toFixed(1)}%\nAvailable: ${(100 - systemHealth.memory_usage).toFixed(1)}%\nSwap Usage: 2.1%`
    },
    { 
      icon: Wifi, 
      name: 'Network', 
      value: systemHealth.network_latency, 
      unit: 'ms', 
      threshold: { warning: 50, critical: 100 },
      details: `Network Latency: ${systemHealth.network_latency.toFixed(1)}ms\nBandwidth: 1.2 Gbps\nPacket Loss: 0.01%`
    },
    { 
      icon: Database, 
      name: 'Database', 
      value: systemHealth.database_status === 'connected' ? 95 : 0, 
      unit: '%', 
      threshold: { warning: 80, critical: 90 },
      details: `Database Status: ${systemHealth.database_status}\nConnections: 45/100\nQuery Time: 12ms avg`
    },
    { 
      icon: Server, 
      name: 'Server', 
      value: systemHealth.server_status === 'running' ? 98 : 0, 
      unit: '%', 
      threshold: { warning: 80, critical: 90 },
      details: `Server Status: ${systemHealth.server_status}\nUptime: 15 days\nResponse Time: 45ms avg`
    }
  ], [systemHealth]);

  // Enhanced healing trigger with better feedback
  const triggerHealing = useCallback(async () => {
    if (isHealing) return;
    
    setIsHealing(true);
    
    // Simulate healing process with progress updates
    const healingSteps = [
      { step: 'Analyzing system health...', duration: 1000 },
      { step: 'Identifying optimization opportunities...', duration: 1000 },
      { step: 'Applying automated fixes...', duration: 1000 }
    ];

    for (const { duration } of healingSteps) {
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    
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
      last_healing: new Date().toISOString(),
      cpu_usage: Math.max(10, prev.cpu_usage - Math.random() * 10),
      memory_usage: Math.max(20, prev.memory_usage - Math.random() * 5),
      network_latency: Math.max(5, prev.network_latency - Math.random() * 5)
    }));
    setIsHealing(false);
  }, [isHealing]);

  // Enhanced real-time updates with better simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        cpu_usage: Math.max(10, Math.min(95, prev.cpu_usage + (Math.random() - 0.5) * 8)),
        memory_usage: Math.max(20, Math.min(90, prev.memory_usage + (Math.random() - 0.5) * 4)),
        network_latency: Math.max(5, Math.min(120, prev.network_latency + (Math.random() - 0.5) * 6))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="w-6 h-6 text-red-400" />;
      default: return <Activity className="w-6 h-6 text-gray-400" />;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }, []);

  const getStatusGradient = useCallback((status: string) => {
    switch (status) {
      case 'healthy': return 'from-green-500/10 to-green-600/10 border-green-500/20';
      case 'warning': return 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20';
      case 'critical': return 'from-red-500/10 to-red-600/10 border-red-500/20';
      default: return 'from-gray-500/10 to-gray-600/10 border-gray-500/20';
    }
  }, []);

  const displayedActivities = useMemo(() => 
    showAllActivities ? recentActivities : recentActivities.slice(0, 5),
    [recentActivities, showAllActivities]
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Shield className="w-10 h-10 text-green-400" aria-hidden="true" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white">Self-Healing System</h2>
            <p className="text-gray-400">Automated system monitoring and recovery</p>
          </div>
        </div>
        
        <motion.button
          onClick={triggerHealing}
          disabled={isHealing}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            isHealing
              ? 'bg-yellow-500/20 text-yellow-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
          }`}
          whileHover={!isHealing ? { scale: 1.05 } : {}}
          whileTap={!isHealing ? { scale: 0.95 } : {}}
          aria-label={isHealing ? "Healing in progress" : "Trigger system healing"}
        >
          {isHealing ? (
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Healing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Trigger Healing</span>
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Enhanced System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'System Status', 
            value: systemStatus, 
            icon: getStatusIcon(systemStatus),
            gradient: getStatusGradient(systemStatus),
            description: 'Overall system health',
            color: getStatusColor(systemStatus)
          },
          { 
            label: 'Uptime', 
            value: `${systemHealth.uptime}%`, 
            icon: Clock,
            gradient: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
            description: 'Last 30 days',
            color: 'text-blue-400'
          },
          { 
            label: 'Auto Fixes', 
            value: systemHealth.auto_fixes_count.toString(), 
            icon: Zap,
            gradient: 'from-purple-500/10 to-purple-600/10 border-purple-500/20',
            description: 'Issues resolved',
            color: 'text-purple-400'
          },
          { 
            label: 'Last Healing', 
            value: new Date(systemHealth.last_healing).toLocaleTimeString(), 
            icon: Activity,
            gradient: 'from-orange-500/10 to-orange-600/10 border-orange-500/20',
            description: 'Today',
            color: 'text-orange-400'
          }
        ].map((card, index) => (
          <motion.div
            key={card.label}
            className={`bg-gradient-to-br ${card.gradient} p-6 rounded-xl border backdrop-blur-sm`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${card.color}`}>{card.label}</span>
              {typeof card.icon === 'function' ? React.createElement(card.icon, { className: `w-6 h-6 ${card.color}`, 'aria-hidden': true }) : card.icon}
            </div>
            <motion.div 
              className="text-2xl font-bold text-white capitalize"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {card.value}
            </motion.div>
            <div className="text-sm text-gray-400">{card.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Component Status */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-400" />
          Component Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {componentStatuses.map((component, index) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <ComponentStatus {...component} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Recent Activities */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-green-400" />
            Recent Healing Activities
          </h3>
          <button
            onClick={() => setShowAllActivities(!showAllActivities)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors"
            aria-label={showAllActivities ? "Show fewer activities" : "Show all activities"}
          >
            {showAllActivities ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm text-gray-400">
              {showAllActivities ? 'Show Less' : 'Show All'}
            </span>
          </button>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {displayedActivities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedSelfHealingPanel;
