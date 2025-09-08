'use client';

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Building2, 
  Zap,
  Target,
  Clock,
  CheckCircle,Sparkles,Users
} from 'lucide-react';

// Neon Analytics Bar Component
interface NeonAnalyticsBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  index: number;
  showPercentage?: boolean;
}

const NeonAnalyticsBar: React.FC<NeonAnalyticsBarProps> = memo(({ 
  label, 
  value, 
  maxValue, 
  color, 
  index, 
  showPercentage = true 
}) => {
  const percentage = (value / maxValue) * 100;
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return {
        bg: 'from-blue-500 to-cyan-500',
        glow: 'shadow-blue-400/50',
        text: 'text-blue-400'
      };
      case 'green': return {
        bg: 'from-green-500 to-emerald-500',
        glow: 'shadow-green-400/50',
        text: 'text-green-400'
      };
      case 'purple': return {
        bg: 'from-purple-500 to-pink-500',
        glow: 'shadow-purple-400/50',
        text: 'text-purple-400'
      };
      case 'orange': return {
        bg: 'from-orange-500 to-red-500',
        glow: 'shadow-orange-400/50',
        text: 'text-orange-400'
      };
      case 'red': return {
        bg: 'from-red-500 to-pink-500',
        glow: 'shadow-red-400/50',
        text: 'text-red-400'
      };
      default: return {
        bg: 'from-gray-500 to-gray-600',
        glow: 'shadow-gray-400/50',
        text: 'text-gray-400'
      };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      className="flex items-center space-x-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="w-24 text-white text-sm font-medium">{label}</div>
      <div className="flex-1 bg-gray-700/50 rounded-full h-3 relative overflow-hidden">
        <motion.div 
          className={`h-full bg-gradient-to-r ${colorClasses.bg} rounded-full ${colorClasses.glow} shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay: 0.5 + index * 0.1, ease: 'easeInOut' }}
        >
          {/* Flowing Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: index * 0.2 }}
          />
        </motion.div>
      </div>
      <div className="w-16 text-right">
        <div className={`${colorClasses.text} font-bold text-sm`}>
          {showPercentage ? `${Math.round(percentage)}%` : value}
        </div>
      </div>
    </motion.div>
  );
});

NeonAnalyticsBar.displayName = 'NeonAnalyticsBar';

// Neon Chart Component
interface NeonChartProps {
  data: Array<{
    label: string;
    value: number;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }>;
  title: string;
  maxValue?: number;
}

const NeonChart: React.FC<NeonChartProps> = memo(({ data, title, maxValue }) => {
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
        {title}
      </h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <NeonAnalyticsBar
            key={item.label}
            label={item.label}
            value={item.value}
            maxValue={max}
            color={item.color}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
});

NeonChart.displayName = 'NeonChart';

// Neon Metrics Grid Component
interface NeonMetricsGridProps {
  metrics: Array<{
    label: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    trend?: 'up' | 'down' | 'stable';
    change?: number;
  }>;
}

const NeonMetricsGrid: React.FC<NeonMetricsGridProps> = memo(({ metrics }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      case 'orange': return 'text-orange-400';
      case 'red': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      case 'stable': return <Activity className="w-3 h-3 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <metric.icon className={`w-6 h-6 ${getColorClasses(metric.color)}`} />
            {getTrendIcon(metric.trend)}
          </div>
          <div className={`${getColorClasses(metric.color)} font-bold text-xl mb-1`}>
            {metric.value}
          </div>
          <div className="text-gray-400 text-xs">{metric.label}</div>
          {metric.change !== undefined && (
            <div className={`text-xs mt-1 ${
              metric.change > 0 ? 'text-green-400' : 
              metric.change < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
});

NeonMetricsGrid.displayName = 'NeonMetricsGrid';

// Neon Analytics Dashboard Component
interface NeonAnalyticsDashboardProps {
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
  workloadDistribution: Array<{
    building_id: string;
    building_name: string;
    task_count: number;
    percentage: number;
  }>;
}

const NeonAnalyticsDashboard: React.FC<NeonAnalyticsDashboardProps> = memo(({ 
  cityStats, 
  districtTrends, 
  workloadDistribution 
}) => {
  const [activeChart, setActiveChart] = useState<'workload' | 'trends' | 'efficiency'>('workload');

  const metrics = [
    { label: 'Total Districts', value: cityStats.totalDistricts, icon: Building2, color: 'blue' as const },
    { label: 'Total Buildings', value: cityStats.totalBuildings, icon: Activity, color: 'green' as const },
    { label: 'Total Tasks', value: cityStats.totalTasks, icon: Target, color: 'purple' as const },
    { label: 'Active Agents', value: cityStats.activeAgents, icon: Users, color: 'orange' as const },
    { label: 'System Health', value: `${cityStats.systemHealth}%`, icon: CheckCircle, color: 'green' as const },
    { label: 'Efficiency', value: `${cityStats.efficiency}%`, icon: TrendingUp, color: 'blue' as const },
    { label: 'Avg Workload', value: `${cityStats.averageWorkload}%`, icon: Zap, color: 'orange' as const },
    { label: 'Peak Activity', value: cityStats.peakActivity, icon: Clock, color: 'purple' as const }
  ];

  const workloadData = workloadDistribution.map((item, index) => ({
    label: item.building_name,
    value: item.percentage,
    color: ['blue', 'green', 'purple', 'orange'][index % 4] as 'blue' | 'green' | 'purple' | 'orange'
  }));

  const trendsData = districtTrends.map((trend, index) => ({
    label: trend.districtName,
    value: trend.efficiency,
    color: ['blue', 'green', 'purple', 'orange'][index % 4] as 'blue' | 'green' | 'purple' | 'orange'
  }));

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
              animate={{ 
                rotate: [0, 5, -5, 0],
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 30px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.5)'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Neon Analytics Dashboard
                </span>
              </h2>
              <p className="text-gray-400">Real-time city performance metrics</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <NeonMetricsGrid metrics={metrics} />

      {/* Chart Tabs */}
      <div className="flex border-b border-gray-700/50" role="tablist">
        {[
          { id: 'workload', label: 'Workload Distribution', icon: BarChart3 },
          { id: 'trends', label: 'District Trends', icon: TrendingUp },
          { id: 'efficiency', label: 'Efficiency Analysis', icon: Target }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveChart(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-all duration-300 ${
              activeChart === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
            role="tab"
            aria-selected={activeChart === tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Chart Content */}
      <AnimatePresence mode="wait">
        {activeChart === 'workload' && (
          <motion.div
            key="workload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NeonChart
              data={workloadData}
              title="Workload Distribution"
              maxValue={100}
            />
          </motion.div>
        )}

        {activeChart === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NeonChart
              data={trendsData}
              title="District Efficiency Trends"
              maxValue={100}
            />
          </motion.div>
        )}

        {activeChart === 'efficiency' && (
          <motion.div
            key="efficiency"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NeonChart
              data={[
                { label: 'Code District', value: 95, color: 'blue' },
                { label: 'Security District', value: 98, color: 'green' },
                { label: 'Data District', value: 89, color: 'purple' },
                { label: 'Monitoring District', value: 92, color: 'orange' }
              ]}
              title="District Efficiency Analysis"
              maxValue={100}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* District Performance Summary */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
          District Performance Summary
        </h3>
        
        <div className="space-y-3">
          {districtTrends.map((trend, index) => (
            <motion.div
              key={trend.districtId}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">{trend.districtName}</span>
                <div className={`w-2 h-2 rounded-full ${
                  trend.trend === 'up' ? 'bg-green-400' :
                  trend.trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-400">{trend.efficiency}% efficiency</span>
                <span className={`${
                  trend.change > 0 ? 'text-green-400' : 
                  trend.change < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {trend.change > 0 ? '+' : ''}{trend.change}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
});

NeonAnalyticsDashboard.displayName = 'NeonAnalyticsDashboard';

export { NeonAnalyticsBar, NeonChart, NeonMetricsGrid, NeonAnalyticsDashboard };
