'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Users, Zap, Clock, Target, BarChart3 } from 'lucide-react';
import { HoverGlow, StaggeredContainer } from '../ui/MicroInteraction';

interface AnalyticsData {
  totalAgents: number;
  activeAgents: number;
  completedTasks: number;
  successRate: number;
  avgResponseTime: number;
  uptime: number;
  monthlyGrowth: number;
  userSatisfaction: number;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalAgents: 0,
    activeAgents: 0,
    completedTasks: 0,
    successRate: 0,
    avgResponseTime: 0,
    uptime: 0,
    monthlyGrowth: 0,
    userSatisfaction: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setAnalytics({
        totalAgents: 12,
        activeAgents: 8,
        completedTasks: 1247,
        successRate: 94.2,
        avgResponseTime: 1.3,
        uptime: 99.8,
        monthlyGrowth: 23.5,
        userSatisfaction: 4.7,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      title: 'Total Agents',
      value: analytics.totalAgents,
      icon: <Users className="w-6 h-6" />,
      color: 'from-neon-green to-cyber-blue',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Active Agents',
      value: analytics.activeAgents,
      icon: <Activity className="w-6 h-6" />,
      color: 'from-cyber-blue to-electric-purple',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Completed Tasks',
      value: analytics.completedTasks.toLocaleString(),
      icon: <Target className="w-6 h-6" />,
      color: 'from-electric-purple to-warning-orange',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Success Rate',
      value: `${analytics.successRate}%`,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-warning-orange to-neon-green',
      trend: '+2.1%',
      trendUp: true,
    },
    {
      title: 'Avg Response Time',
      value: `${analytics.avgResponseTime}s`,
      icon: <Clock className="w-6 h-6" />,
      color: 'from-neon-green to-cyber-blue',
      trend: '-0.3s',
      trendUp: true,
    },
    {
      title: 'System Uptime',
      value: `${analytics.uptime}%`,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-cyber-blue to-electric-purple',
      trend: '+0.2%',
      trendUp: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border border-neon-green/20 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-help="analytics">
      {/* Main Metrics Grid with Staggered Animations */}
      <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15}>
        {metrics.map((metric, index) => (
          <HoverGlow key={metric.title}>
            <motion.div
              className="bg-card border border-neon-green/20 rounded-lg p-6 hover:border-neon-green/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 30px rgba(0, 255, 65, 0.2)',
                y: -8
              }}
            >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center text-white`}>
                {metric.icon}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                metric.trendUp ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{metric.trend}</span>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.title}</div>
            </motion.div>
          </HoverGlow>
        ))}
      </StaggeredContainer>

      {/* Performance Chart Placeholder */}
      <motion.div
        className="bg-card border border-neon-green/20 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Performance Overview</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-lg text-sm hover:bg-neon-green/30 transition-colors">
              24H
            </button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              7D
            </button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              30D
            </button>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Performance chart will be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">Real-time data visualization</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-card border border-neon-green/20 rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">CPU Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full">
                  <div className="w-3/4 h-2 bg-neon-green rounded-full"></div>
                </div>
                <span className="text-sm text-neon-green">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Memory Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full">
                  <div className="w-1/2 h-2 bg-cyber-blue rounded-full"></div>
                </div>
                <span className="text-sm text-cyber-blue">50%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Network I/O</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full">
                  <div className="w-2/3 h-2 bg-electric-purple rounded-full"></div>
                </div>
                <span className="text-sm text-electric-purple">65%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-card border border-neon-green/20 rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
              <span className="text-sm text-gray-300">Content Agent completed task</span>
              <span className="text-xs text-gray-500 ml-auto">2m ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-cyber-blue rounded-full"></div>
              <span className="text-sm text-gray-300">Code Agent started new project</span>
              <span className="text-xs text-gray-500 ml-auto">5m ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-electric-purple rounded-full"></div>
              <span className="text-sm text-gray-300">Research Agent finished analysis</span>
              <span className="text-xs text-gray-500 ml-auto">8m ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning-orange rounded-full"></div>
              <span className="text-sm text-gray-300">Design Agent uploaded assets</span>
              <span className="text-xs text-gray-500 ml-auto">12m ago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
