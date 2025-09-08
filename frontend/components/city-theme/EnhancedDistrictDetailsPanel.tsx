'use client';

import React, { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building2, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Shield,
  Database,
  Code} from 'lucide-react';

// Dynamic Avatar Component with Animated Icons
interface DynamicAvatarProps {
  agentType: 'code' | 'security' | 'data' | 'monitoring';
  status: 'idle' | 'thinking' | 'working' | 'completed' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const DynamicAvatar: React.FC<DynamicAvatarProps> = memo(({ agentType, status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-full h-full" />;
      case 'security': return <Shield className="w-full h-full" />;
      case 'data': return <Database className="w-full h-full" />;
      case 'monitoring': return <Activity className="w-full h-full" />;
      default: return <Building2 className="w-full h-full" />;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'working': return 'from-blue-500 to-cyan-500';
      case 'thinking': return 'from-yellow-500 to-orange-500';
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'error': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${getStatusColors(status)} flex items-center justify-center text-white shadow-lg`}
      animate={status === 'working' || status === 'thinking' ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 20px rgba(59, 130, 246, 0.3)',
          '0 0 30px rgba(59, 130, 246, 0.5)',
          '0 0 20px rgba(59, 130, 246, 0.3)'
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {getAgentIcon(agentType)}
    </motion.div>
  );
});

DynamicAvatar.displayName = 'DynamicAvatar';

// Optimized Building Card Component
interface BuildingCardProps {
  building: {
    id: string;
    name: string;
    type: 'skyscraper' | 'tower' | 'center' | 'fortress';
    status: 'active' | 'idle' | 'processing';
    task_count: number;
    completion_rate: number;
    tasks: Array<{
      id: string;
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      priority: 'low' | 'medium' | 'high' | 'critical';
      progress: number;
      estimated_time: string;
    }>;
  };
  index: number;
  onBuildingClick: (buildingId: string) => void;
}

const BuildingCard: React.FC<BuildingCardProps> = memo(({ building, index, onBuildingClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing': return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'idle': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'skyscraper': return <Building2 className="w-4 h-4" />;
      case 'tower': return <Activity className="w-4 h-4" />;
      case 'center': return <BarChart3 className="w-4 h-4" />;
      case 'fortress': return <Shield className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all duration-300 border border-gray-700/50 ${
        isHovered ? 'scale-105 shadow-lg border-blue-400/50' : 'scale-100'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        y: -2,
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onBuildingClick(building.id)}
      role="button"
      tabIndex={0}
      aria-label={`Building ${building.name} with ${building.task_count} tasks`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getBuildingIcon(building.type)}
          <h4 className="text-white font-medium text-sm">{building.name}</h4>
        </div>
        {getStatusIcon(building.status)}
      </div>
      
      <div className="text-gray-400 text-xs mb-2">
        {building.task_count} tasks • {building.completion_rate}% complete
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${building.completion_rate}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
        />
      </div>

      {/* Task Indicators */}
      <div className="flex space-x-1">
        {building.tasks.slice(0, 5).map((task, taskIndex) => (
          <motion.div
            key={task.id}
            className={`w-2 h-2 rounded-full ${
              task.status === 'completed' ? 'bg-green-400' :
              task.status === 'in_progress' ? 'bg-blue-400' :
              task.status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (index * 0.1) + (taskIndex * 0.05) }}
          />
        ))}
        {building.tasks.length > 5 && (
          <span className="text-gray-500 text-xs">+{building.tasks.length - 5}</span>
        )}
      </div>
    </motion.div>
  );
});

BuildingCard.displayName = 'BuildingCard';

// Optimized Task Item Component
interface TaskItemProps {
  task: {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    progress: number;
    estimated_time: string;
  };
  index: number;
  onTaskClick: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = memo(({ task, index, onTaskClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress': return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/50';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/50';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  return (
    <motion.div
      className={`bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-all duration-200 border ${
        isHovered ? 'bg-gray-700/70 border-blue-400/50' : 'border-gray-600/50'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onTaskClick(task.id)}
      role="button"
      tabIndex={0}
      aria-label={`Task ${task.name} with ${task.progress}% progress`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-medium text-sm truncate flex-1">{task.name}</h4>
        <div className="flex items-center space-x-2">
          {getTaskStatusIcon(task.status)}
          <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>{task.estimated_time}</span>
        <span>{task.progress}% complete</span>
      </div>
      
      {/* Animated Progress Bar */}
      <div className="w-full bg-gray-600 rounded-full h-1">
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${task.progress}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
        />
      </div>
    </motion.div>
  );
});

TaskItem.displayName = 'TaskItem';

// Enhanced District Details Panel
interface EnhancedDistrictDetailsPanelProps {
  district: {
    id: string;
    name: string;
    type: 'code' | 'security' | 'data' | 'monitoring';
    agent: {
      id: string;
      name: string;
      title: string;
      avatar: string;
      status: 'idle' | 'thinking' | 'working' | 'completed' | 'error';
      progress: number;
      current_task: string;
      capabilities: string[];
      performance: {
        efficiency: number;
        accuracy: number;
        speed: number;
      };
      stats: {
        tasks_completed: number;
        success_rate: number;
        uptime: number;
      };
    };
    buildings: Array<{
      id: string;
      name: string;
      type: 'skyscraper' | 'tower' | 'center' | 'fortress';
      height: number;
      status: 'active' | 'idle' | 'processing';
      task_count: number;
      completion_rate: number;
      tasks: Array<{
        id: string;
        name: string;
        status: 'pending' | 'in_progress' | 'completed' | 'failed';
        priority: 'low' | 'medium' | 'high' | 'critical';
        progress: number;
        estimated_time: string;
      }>;
    }>;
    analytics: {
      total_tasks: number;
      active_tasks: number;
      completed_today: number;
      efficiency_score: number;
      workload_distribution: Array<{
        building_id: string;
        building_name: string;
        task_count: number;
        percentage: number;
      }>;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onTaskClick: (taskId: string) => void;
  onBuildingClick: (buildingId: string) => void;
}

const EnhancedDistrictDetailsPanel: React.FC<EnhancedDistrictDetailsPanelProps> = ({
  district,
  isOpen,
  onClose,
  onTaskClick,
  onBuildingClick
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'analytics'>('overview');

  const handleTabChange = useCallback((tab: 'overview' | 'tasks' | 'analytics') => {
    setActiveTab(tab);
  }, []);

  const handleTaskClick = useCallback((taskId: string) => {
    onTaskClick(taskId);
  }, [onTaskClick]);

  const handleBuildingClick = useCallback((buildingId: string) => {
    onBuildingClick(buildingId);
  }, [onBuildingClick]);

  const getDistrictIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-6 h-6" />;
      case 'security': return <Shield className="w-6 h-6" />;
      case 'data': return <Database className="w-6 h-6" />;
      case 'monitoring': return <Activity className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'text-blue-400';
      case 'thinking': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="district-panel-title"
        >
          {/* Enhanced Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Enhanced Panel */}
          <motion.div
            className="relative w-full max-w-2xl h-full bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    district.type === 'code' ? 'bg-blue-500' :
                    district.type === 'security' ? 'bg-green-500' :
                    district.type === 'data' ? 'bg-orange-500' : 'bg-purple-500'
                  }`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {getDistrictIcon(district.type)}
                </motion.div>
                <div>
                  <h2 id="district-panel-title" className="text-xl font-bold text-white">{district.name}</h2>
                  <p className="text-gray-400 text-sm">{district.agent.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <DynamicAvatar agentType={district.type} status={district.agent.status} size="sm" />
                    <span className="text-white text-sm font-medium">{district.agent.name}</span>
                    <span className={`text-xs ${getStatusColor(district.agent.status)}`}>
                      {district.agent.status.charAt(0).toUpperCase() + district.agent.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Enhanced Tabs */}
            <div className="flex border-b border-gray-700/50" role="tablist">
              {[
                { id: 'overview', label: 'Overview', icon: Building2 },
                { id: 'tasks', label: 'Tasks', icon: Target },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Enhanced Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    id="tabpanel-overview"
                    role="tabpanel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Agent Status */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-lg font-semibold text-white mb-4">Agent Status</h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <DynamicAvatar agentType={district.type} status={district.agent.status} size="lg" />
                        <div>
                          <h4 className="text-white font-semibold">{district.agent.name}</h4>
                          <p className="text-gray-400 text-sm">{district.agent.current_task}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>{district.agent.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${district.agent.progress}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Efficiency', value: district.agent.performance.efficiency, icon: TrendingUp },
                          { label: 'Accuracy', value: district.agent.performance.accuracy, icon: Target },
                          { label: 'Speed', value: district.agent.performance.speed, icon: Zap }
                        ].map((metric, index) => (
                          <motion.div
                            key={metric.label}
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                          >
                            <metric.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-white font-bold text-lg">{metric.value}%</div>
                            <div className="text-gray-400 text-xs">{metric.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Buildings Overview */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-lg font-semibold text-white mb-4">Buildings Overview</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {district.buildings.map((building, index) => (
                          <BuildingCard
                            key={building.id}
                            building={building}
                            index={index}
                            onBuildingClick={handleBuildingClick}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'tasks' && (
                  <motion.div
                    key="tasks"
                    id="tabpanel-tasks"
                    role="tabpanel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {district.buildings.map((building) => (
                      <div key={building.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{building.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">{building.task_count} tasks</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {building.tasks.map((task, taskIndex) => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              index={taskIndex}
                              onTaskClick={handleTaskClick}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    id="tabpanel-analytics"
                    role="tabpanel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Analytics Overview */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Total Tasks', value: district.analytics.total_tasks, icon: Target },
                        { label: 'Active Tasks', value: district.analytics.active_tasks, icon: Activity },
                        { label: 'Completed Today', value: district.analytics.completed_today, icon: CheckCircle },
                        { label: 'Efficiency Score', value: `${district.analytics.efficiency_score}%`, icon: TrendingUp }
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          className="bg-gray-800/50 rounded-lg p-4 text-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-white font-bold text-lg">{stat.value}</div>
                          <div className="text-gray-400 text-xs">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Workload Distribution */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-lg font-semibold text-white mb-4">Workload Distribution</h3>
                      <div className="space-y-3">
                        {district.analytics.workload_distribution.map((item, index) => (
                          <motion.div
                            key={item.building_id}
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <div className="w-24 text-white text-sm font-medium">{item.building_name}</div>
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <motion.div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 1.2, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                            <div className="w-16 text-gray-400 text-sm text-right">
                              {item.task_count} ({item.percentage}%)
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedDistrictDetailsPanel;
