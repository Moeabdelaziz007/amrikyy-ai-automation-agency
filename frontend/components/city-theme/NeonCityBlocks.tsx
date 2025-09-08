'use client';

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Activity, 
  CheckCircle,Clock,BarChart3,
  Shield,Eye,
  EyeOff
} from 'lucide-react';

// City Block Building Component
interface CityBlockBuildingProps {
  building: {
    id: string;
    name: string;
    type: 'skyscraper' | 'tower' | 'center' | 'fortress';
    height: number;
    status: 'active' | 'idle' | 'processing';
    task_count: number;
    completion_rate: number;
    difficulty: 'low' | 'medium' | 'high' | 'critical';
    tasks: Array<{
      id: string;
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      priority: 'low' | 'medium' | 'high' | 'critical';
      progress: number;
      estimated_time: string;
    }>;
    analytics: {
      efficiency: number;
      workload: number;
      uptime: number;
      last_activity: string;
    };
  };
  index: number;
  onBuildingClick: (buildingId: string) => void;
  onTaskHover: (taskId: string | null) => void;
}

const CityBlockBuilding: React.FC<CityBlockBuildingProps> = memo(({ 
  building, 
  index, 
  onBuildingClick, 
  onTaskHover 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'skyscraper': return <Building2 className="w-4 h-4" />;
      case 'tower': return <Activity className="w-4 h-4" />;
      case 'center': return <BarChart3 className="w-4 h-4" />;
      case 'fortress': return <Shield className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'active': return {
        bg: 'bg-green-400/20',
        border: 'border-green-400/50',
        glow: 'shadow-green-400/50',
        icon: 'text-green-400',
        neon: 'rgba(34, 197, 94, 0.3)'
      };
      case 'processing': return {
        bg: 'bg-blue-400/20',
        border: 'border-blue-400/50',
        glow: 'shadow-blue-400/50',
        icon: 'text-blue-400',
        neon: 'rgba(59, 130, 246, 0.3)'
      };
      case 'idle': return {
        bg: 'bg-gray-400/20',
        border: 'border-gray-400/50',
        glow: 'shadow-gray-400/50',
        icon: 'text-gray-400',
        neon: 'rgba(156, 163, 175, 0.3)'
      };
      default: return {
        bg: 'bg-gray-400/20',
        border: 'border-gray-400/50',
        glow: 'shadow-gray-400/50',
        icon: 'text-gray-400',
        neon: 'rgba(156, 163, 175, 0.3)'
      };
    }
  };

  const getDifficultyHeight = (difficulty: string, baseHeight: number) => {
    switch (difficulty) {
      case 'critical': return baseHeight * 1.5;
      case 'high': return baseHeight * 1.3;
      case 'medium': return baseHeight * 1.1;
      case 'low': return baseHeight * 0.9;
      default: return baseHeight;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'processing': return <Activity className="w-3 h-3 animate-pulse" />;
      case 'idle': return <Clock className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const statusColors = getStatusColors(building.status);
  const dynamicHeight = getDifficultyHeight(building.difficulty, building.height);

  return (
    <div className="relative">
      <motion.div
        className={`${statusColors.bg} ${statusColors.border} rounded-lg flex flex-col items-center justify-end p-2 cursor-pointer transition-all duration-300 border ${
          isHovered ? `scale-110 ${statusColors.glow} shadow-lg` : 'scale-100'
        }`}
        style={{ 
          height: `${Math.max(dynamicHeight, 20)}px`,
          minHeight: '20px'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          y: -2,
          boxShadow: `0 0 20px ${statusColors.neon}`
        }}
        onHoverStart={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        onClick={() => onBuildingClick(building.id)}
        role="button"
        tabIndex={0}
        aria-label={`Building ${building.name} with ${building.task_count} tasks`}
      >
        {/* Building Icon */}
        <motion.div
          className={`${statusColors.icon} mb-2`}
          animate={isHovered ? { scale: 1.3, rotate: [0, 5, -5, 0] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getBuildingIcon(building.type)}
        </motion.div>

        {/* Building Info */}
        <div className="text-white text-xs font-medium text-center">
          <div className="truncate max-w-full">{building.name}</div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {getStatusIcon(building.status)}
            <span className="text-white/60">{building.task_count}</span>
          </div>
        </div>

        {/* Completion Rate Indicator */}
        <div className="w-full mt-2">
          <div className="w-full bg-white/20 rounded-full h-1">
            <motion.div 
              className="bg-white h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${building.completion_rate}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Activity Indicator */}
        {building.status === 'processing' && (
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Neon Glow Effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                `0 0 10px ${statusColors.neon}`,
                `0 0 20px ${statusColors.neon}`,
                `0 0 10px ${statusColors.neon}`
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Enhanced Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl border border-gray-700 min-w-64">
              {/* Building Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getBuildingIcon(building.type)}
                  <h3 className="font-semibold text-sm">{building.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(building.status)}
                  <span className="text-xs text-gray-400 capitalize">{building.status}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{building.task_count}</div>
                  <div className="text-gray-400 text-xs">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{building.completion_rate}%</div>
                  <div className="text-gray-400 text-xs">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{building.analytics.efficiency}%</div>
                  <div className="text-gray-400 text-xs">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{building.analytics.uptime}%</div>
                  <div className="text-gray-400 text-xs">Uptime</div>
                </div>
              </div>

              {/* Active Tasks */}
              <div className="mb-3">
                <h4 className="text-white font-medium text-xs mb-2">Active Tasks</h4>
                <div className="space-y-1">
                  {building.tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-gray-800/50 rounded text-xs"
                      onMouseEnter={() => onTaskHover(task.id)}
                      onMouseLeave={() => onTaskHover(null)}
                    >
                      <span className="text-white truncate">{task.name}</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-400' :
                          task.status === 'in_progress' ? 'bg-blue-400' :
                          task.status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                        }`} />
                        <span className="text-gray-400">{task.progress}%</span>
                      </div>
                    </div>
                  ))}
                  {building.tasks.length > 3 && (
                    <div className="text-center text-gray-400 text-xs">
                      +{building.tasks.length - 3} more tasks
                    </div>
                  )}
                </div>
              </div>

              {/* Last Activity */}
              <div className="text-center text-gray-400 text-xs">
                Last activity: {new Date(building.analytics.last_activity).toLocaleTimeString()}
              </div>

              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CityBlockBuilding.displayName = 'CityBlockBuilding';

// City Block Grid Component
interface CityBlockGridProps {
  buildings: Array<{
    id: string;
    name: string;
    type: 'skyscraper' | 'tower' | 'center' | 'fortress';
    height: number;
    status: 'active' | 'idle' | 'processing';
    task_count: number;
    completion_rate: number;
    difficulty: 'low' | 'medium' | 'high' | 'critical';
    tasks: Array<{
      id: string;
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      priority: 'low' | 'medium' | 'high' | 'critical';
      progress: number;
      estimated_time: string;
    }>;
    analytics: {
      efficiency: number;
      workload: number;
      uptime: number;
      last_activity: string;
    };
  }>;
  onBuildingClick: (buildingId: string) => void;
  onTaskHover: (taskId: string | null) => void;
}

const CityBlockGrid: React.FC<CityBlockGridProps> = memo(({ 
  buildings, 
  onBuildingClick, 
  onTaskHover 
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {buildings.map((building, index) => (
        <CityBlockBuilding
          key={building.id}
          building={building}
          index={index}
          onBuildingClick={onBuildingClick}
          onTaskHover={onTaskHover}
        />
      ))}
    </div>
  );
});

CityBlockGrid.displayName = 'CityBlockGrid';

// Neon City Block Overview Component
interface NeonCityBlockOverviewProps {
  buildings: Array<{
    id: string;
    name: string;
    type: 'skyscraper' | 'tower' | 'center' | 'fortress';
    height: number;
    status: 'active' | 'idle' | 'processing';
    task_count: number;
    completion_rate: number;
    difficulty: 'low' | 'medium' | 'high' | 'critical';
    tasks: Array<{
      id: string;
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      priority: 'low' | 'medium' | 'high' | 'critical';
      progress: number;
      estimated_time: string;
    }>;
    analytics: {
      efficiency: number;
      workload: number;
      uptime: number;
      last_activity: string;
    };
  }>;
  onBuildingClick: (buildingId: string) => void;
  onTaskHover: (taskId: string | null) => void;
}

const NeonCityBlockOverview: React.FC<NeonCityBlockOverviewProps> = memo(({ 
  buildings, 
  onBuildingClick, 
  onTaskHover 
}) => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  const activeCount = buildings.filter(b => b.status === 'active').length;
  const processingCount = buildings.filter(b => b.status === 'processing').length;
  const idleCount = buildings.filter(b => b.status === 'idle').length;

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-blue-400" />
          City Block Overview
        </h3>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            showAnalytics 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700/70'
          }`}
        >
          {showAnalytics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </span>
        </button>
      </div>

      {/* Building Status Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { 
            label: 'Active', 
            count: activeCount, 
            color: 'text-green-400', 
            bg: 'bg-green-400/20',
            icon: CheckCircle 
          },
          { 
            label: 'Processing', 
            count: processingCount, 
            color: 'text-blue-400', 
            bg: 'bg-blue-400/20',
            icon: Activity 
          },
          { 
            label: 'Idle', 
            count: idleCount, 
            color: 'text-gray-400', 
            bg: 'bg-gray-400/20',
            icon: Clock 
          }
        ].map((status, index) => (
          <motion.div
            key={status.label}
            className={`${status.bg} rounded-lg p-3 text-center border border-gray-700/50`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            <status.icon className={`w-6 h-6 ${status.color} mx-auto mb-2`} />
            <div className={`${status.color} font-bold text-lg`}>{status.count}</div>
            <div className="text-gray-400 text-xs">{status.label}</div>
          </motion.div>
        ))}
      </div>

      {/* City Block Grid */}
      <CityBlockGrid
        buildings={buildings}
        onBuildingClick={onBuildingClick}
        onTaskHover={onTaskHover}
      />

      {/* Analytics Overlay */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-white font-semibold text-sm mb-3">Building Analytics</h4>
            <div className="space-y-2">
              {buildings.map((building, index) => (
                <motion.div
                  key={building.id}
                  className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium">{building.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      building.status === 'active' ? 'bg-green-400' :
                      building.status === 'processing' ? 'bg-blue-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span>{building.task_count} tasks</span>
                    <span>{building.completion_rate}% complete</span>
                    <span>{building.analytics.efficiency}% efficiency</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

NeonCityBlockOverview.displayName = 'NeonCityBlockOverview';

export { CityBlockBuilding, CityBlockGrid, NeonCityBlockOverview };
