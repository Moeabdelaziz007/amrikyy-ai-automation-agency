'use client';

import React, { useState} from 'react';
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
  BarChart3} from 'lucide-react';

// District Details Panel Component
interface DistrictDetailsPanelProps {
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

const DistrictDetailsPanel: React.FC<DistrictDetailsPanelProps> = ({
  district,
  isOpen,
  onClose,
  onTaskClick,
  onBuildingClick
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'analytics'>('overview');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing': return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'idle': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress': return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
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
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-2xl h-full bg-gray-900/95 backdrop-blur-xl border-l border-gray-700 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  district.type === 'code' ? 'bg-blue-500' :
                  district.type === 'security' ? 'bg-green-500' :
                  district.type === 'data' ? 'bg-orange-500' : 'bg-purple-500'
                }`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{district.name}</h2>
                  <p className="text-gray-400 text-sm">{district.agent.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'overview', label: 'Overview', icon: Building2 },
                { id: 'tasks', label: 'Tasks', icon: Target },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Agent Status */}
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Agent Status</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                        district.agent.status === 'working' ? 'bg-blue-500' :
                        district.agent.status === 'thinking' ? 'bg-yellow-500' :
                        district.agent.status === 'completed' ? 'bg-green-500' :
                        district.agent.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                      }`}>
                        {district.agent.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{district.agent.name}</h4>
                        <p className="text-gray-400 text-sm">{district.agent.current_task}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${
                            district.agent.status === 'working' ? 'bg-blue-400 animate-pulse' :
                            district.agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' :
                            district.agent.status === 'completed' ? 'bg-green-400' :
                            district.agent.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                          }`} />
                          <span className="text-sm text-gray-400 capitalize">{district.agent.status}</span>
                        </div>
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
                      ].map((metric) => (
                        <div key={metric.label} className="text-center">
                          <metric.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-white font-bold text-lg">{metric.value}%</div>
                          <div className="text-gray-400 text-xs">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buildings Overview */}
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Buildings Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {district.buildings.map((building) => (
                        <motion.div
                          key={building.id}
                          className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/70 transition-colors"
                          onClick={() => onBuildingClick(building.id)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium text-sm">{building.name}</h4>
                            {getStatusIcon(building.status)}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {building.task_count} tasks • {building.completion_rate}% complete
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-4">
                  {district.buildings.map((building) => (
                    <div key={building.id} className="bg-gray-800/50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{building.name}</h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(building.status)}
                          <span className="text-sm text-gray-400">{building.task_count} tasks</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {building.tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/70 transition-colors"
                            onClick={() => onTaskClick(task.id)}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium text-sm">{task.name}</h4>
                              <div className="flex items-center space-x-2">
                                {getTaskStatusIcon(task.status)}
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{task.estimated_time}</span>
                              <span>{task.progress}% complete</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
                              <motion.div 
                                className="bg-blue-400 h-1 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Analytics Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Total Tasks', value: district.analytics.total_tasks, icon: Target },
                      { label: 'Active Tasks', value: district.analytics.active_tasks, icon: Activity },
                      { label: 'Completed Today', value: district.analytics.completed_today, icon: CheckCircle },
                      { label: 'Efficiency Score', value: `${district.analytics.efficiency_score}%`, icon: TrendingUp }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-white font-bold text-lg">{stat.value}</div>
                        <div className="text-gray-400 text-xs">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Workload Distribution */}
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Workload Distribution</h3>
                    <div className="space-y-3">
                      {district.analytics.workload_distribution.map((item, index) => (
                        <div key={item.building_id} className="flex items-center space-x-4">
                          <div className="w-24 text-white text-sm font-medium">{item.building_name}</div>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                          </div>
                          <div className="w-16 text-gray-400 text-sm text-right">
                            {item.task_count} ({item.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DistrictDetailsPanel;
