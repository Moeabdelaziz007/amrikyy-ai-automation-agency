'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Building2, 
  Zap,
  Target,
  Eye,
  EyeOff
} from 'lucide-react';

// Dynamic Skyline Component
interface SkylineProps {
  districts: Array<{
    id: string;
    name: string;
    type: string;
    buildings: Array<{
      id: string;
      name: string;
      height: number;
      task_count: number;
      difficulty: 'low' | 'medium' | 'high' | 'critical';
      status: 'active' | 'idle' | 'processing';
    }>;
    analytics: {
      total_tasks: number;
      active_tasks: number;
      efficiency_score: number;
      workload_score: number;
    };
  }>;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

const DynamicSkyline: React.FC<SkylineProps> = ({ 
  districts, 
  showAnalytics, 
  onToggleAnalytics 
}) => {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'active': return 'shadow-green-400/50';
      case 'processing': return 'shadow-blue-400/50';
      case 'idle': return 'shadow-gray-400/50';
      default: return 'shadow-gray-400/50';
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
          Dynamic City Skyline
        </h3>
        <button
          onClick={onToggleAnalytics}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
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

      {/* Skyline Visualization */}
      <div className="relative h-64 bg-gradient-to-t from-gray-900/50 to-transparent rounded-lg overflow-hidden border border-gray-600/30">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-gray-600/30" />
            ))}
          </div>
          <div className="grid grid-rows-8 h-full">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border-b border-gray-600/30" />
            ))}
          </div>
        </div>

        {/* Buildings */}
        {districts.map((district, districtIndex) => (
          <div key={district.id} className="absolute bottom-0" style={{ left: `${districtIndex * 25}%`, width: '25%', height: '100%' }}>
            <div className="flex items-end justify-center space-x-1 h-full px-2">
              {district.buildings.map((building, buildingIndex) => {
                const dynamicHeight = showAnalytics 
                  ? getDifficultyHeight(building.difficulty, building.height)
                  : building.height;
                
                return (
                  <motion.div
                    key={building.id}
                    className={`relative ${getDifficultyColor(building.difficulty)} rounded-t-lg cursor-pointer transition-all duration-300 ${
                      hoveredBuilding === building.id ? 'scale-110 shadow-lg' : 'scale-100'
                    } ${getStatusGlow(building.status)}`}
                    style={{ 
                      height: `${(dynamicHeight / 30) * 100}%`,
                      width: '20px',
                      minHeight: '20px'
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(dynamicHeight / 30) * 100}%` }}
                    transition={{ duration: 0.8, delay: districtIndex * 0.1 + buildingIndex * 0.05 }}
                    whileHover={{ y: -2 }}
                    onHoverStart={() => setHoveredBuilding(building.id)}
                    onHoverEnd={() => setHoveredBuilding(null)}
                  >
                    {/* Building Details Tooltip */}
                    <AnimatePresence>
                      {hoveredBuilding === building.id && (
                        <motion.div
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        >
                          <div className="bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl border border-gray-700 text-xs min-w-32">
                            <div className="font-semibold mb-1">{building.name}</div>
                            <div className="text-gray-300 mb-1">{building.task_count} tasks</div>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${getDifficultyColor(building.difficulty)}`} />
                              <span className="text-gray-400 capitalize">{building.difficulty}</span>
                            </div>
                            <div className="mt-1 text-gray-400 capitalize">{building.status}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Analytics Overlay */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center text-white">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Analytics Mode Active</h4>
                <p className="text-gray-400 text-sm">
                  Building heights represent task difficulty and workload
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* District Analytics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {districts.map((district, index) => (
          <motion.div
            key={district.id}
            className="bg-gray-700/50 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <h4 className="text-white font-semibold text-sm mb-3">{district.name}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Tasks</span>
                <span className="text-white">{district.analytics.total_tasks}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Active Tasks</span>
                <span className="text-white">{district.analytics.active_tasks}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Efficiency</span>
                <span className="text-white">{district.analytics.efficiency_score}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Workload</span>
                <span className="text-white">{district.analytics.workload_score}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
        <h4 className="text-white font-semibold text-sm mb-3">Legend</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-400">Critical Difficulty</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-400">High Difficulty</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-400">Medium Difficulty</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-400">Low Difficulty</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// City Analytics Dashboard Component
interface CityAnalyticsProps {
  cityStats: {
    totalDistricts: number;
    totalBuildings: number;
    totalTasks: number;
    activeAgents: number;
    systemHealth: number;
    efficiency: number;
    averageWorkload: number;
    peakActivity: string;
  };
  districtTrends: Array<{
    districtId: string;
    districtName: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    efficiency: number;
  }>;
}

const CityAnalytics: React.FC<CityAnalyticsProps> = ({ 
  cityStats, 
  districtTrends 
}) => {
  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
        City Analytics Overview
      </h3>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Districts', value: cityStats.totalDistricts, icon: Building2, color: 'text-blue-400' },
          { label: 'Total Buildings', value: cityStats.totalBuildings, icon: Activity, color: 'text-green-400' },
          { label: 'Total Tasks', value: cityStats.totalTasks, icon: Target, color: 'text-orange-400' },
          { label: 'Active Agents', value: cityStats.activeAgents, icon: Zap, color: 'text-purple-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-gray-700/50 rounded-lg p-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <div className={`${stat.color} font-bold text-lg`}>{stat.value}</div>
            <div className="text-gray-400 text-xs">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'System Health', value: `${cityStats.systemHealth}%`, color: 'text-green-400' },
          { label: 'Efficiency', value: `${cityStats.efficiency}%`, color: 'text-blue-400' },
          { label: 'Avg Workload', value: `${cityStats.averageWorkload}%`, color: 'text-orange-400' }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            className="bg-gray-700/50 rounded-lg p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
          >
            <div className={`${metric.color} font-bold text-xl mb-1`}>{metric.value}</div>
            <div className="text-gray-400 text-sm">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* District Trends */}
      <div className="bg-gray-700/30 rounded-lg p-4">
        <h4 className="text-white font-semibold text-sm mb-3">District Performance Trends</h4>
        <div className="space-y-2">
          {districtTrends.map((trend, index) => (
            <motion.div
              key={trend.districtId}
              className="flex items-center justify-between p-2 bg-gray-600/30 rounded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1 }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-medium">{trend.districtName}</span>
                <div className={`w-2 h-2 rounded-full ${
                  trend.trend === 'up' ? 'bg-green-400' :
                  trend.trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className={`${
                  trend.change > 0 ? 'text-green-400' : 
                  trend.change < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {trend.change > 0 ? '+' : ''}{trend.change}%
                </span>
                <span className="text-gray-400">{trend.efficiency}% efficiency</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export { DynamicSkyline, CityAnalytics };
