'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Settings, User, Activity, Zap, Shield, Globe } from 'lucide-react';
import { QuickThemeToggle } from '../theme/ThemeToggle';

interface DashboardHeaderProps {
  activeAgents: number;
  totalTasks: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
  lastUpdate: Date;
}

export default function DashboardHeader({ 
  activeAgents, 
  totalTasks, 
  systemStatus, 
  lastUpdate 
}: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <Shield className="w-4 h-4" />;
      case 'warning': return <Activity className="w-4 h-4" />;
      case 'critical': return <Zap className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <motion.header 
      className="bg-gradient-to-r from-carbon-black via-medium-gray to-carbon-black border-b border-neon-green/20 backdrop-blur-lg"
      data-help="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-black">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-green to-cyber-blue bg-clip-text text-transparent">
                Axon AI Hub
              </h1>
              <p className="text-sm text-gray-400">Enterprise AI Agent Platform</p>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div 
            className="flex items-center space-x-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* System Status Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor(systemStatus)}`}>
              {getStatusIcon(systemStatus)}
              <span className="text-sm font-medium capitalize">{systemStatus}</span>
            </div>

            {/* Live Stats */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-neon-green">{activeAgents}</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-cyber-blue">{totalTasks}</div>
                <div className="text-xs text-gray-400">Tasks</div>
              </div>
            </div>

            {/* Time */}
            <div className="text-right">
              <div className="text-sm font-mono text-neon-green">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-400">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Search */}
            <button className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors" data-help="search">
              <Search className="w-5 h-5 text-gray-400 hover:text-neon-green" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-neon-green/10 rounded-lg transition-colors" data-help="notifications">
              <Bell className="w-5 h-5 text-gray-400 hover:text-neon-green" />
              {notifications > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  {notifications}
                </motion.span>
              )}
            </button>

            {/* Quick Theme Toggle */}
            <QuickThemeToggle />

            {/* Settings */}
            <button className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-400 hover:text-neon-green" />
            </button>

            {/* User Profile */}
            <button className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-400 hover:text-neon-green" />
            </button>
          </motion.div>
        </div>

        {/* Status Bar */}
        <motion.div 
          className="mt-4 flex items-center justify-between text-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">All systems operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">API endpoints healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Database connected</span>
            </div>
          </div>
          
          <div className="text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
