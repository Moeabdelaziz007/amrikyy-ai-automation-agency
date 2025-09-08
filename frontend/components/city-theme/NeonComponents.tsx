'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2,Activity,Play,Users,BarChart3,Target
} from 'lucide-react';

// Enhanced Neon Header Component
interface NeonHeaderProps {
  activeTab: string;
  onTabChange: (tab: 'overview' | 'agents' | 'analytics' | 'movements') => void;
  cityStats: {
    totalTasks: number;
    activeAgents: number;
    systemHealth: number;
    efficiency: number;
  };
}

const NeonHeader: React.FC<NeonHeaderProps> = ({ activeTab, onTabChange, cityStats }) => {
  const tabs = [
    { id: 'overview', label: 'City Overview', icon: Building2 },
    { id: 'agents', label: 'Agent Districts', icon: Users },
    { id: 'analytics', label: 'City Analytics', icon: BarChart3 },
    { id: 'movements', label: 'Live Movements', icon: Activity }
  ];

  return (
    <motion.div
      className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
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
            <Building2 className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              🏙️ <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Neon City Command Center
              </span>
            </h1>
            <p className="text-gray-400 text-sm">Navigate through cyberpunk districts to interact with AI agents</p>
          </div>
        </div>

        {/* City Stats */}
        <div className="flex items-center space-x-4">
          {[
            { label: 'Tasks', value: cityStats.totalTasks, color: 'text-blue-400' },
            { label: 'Agents', value: cityStats.activeAgents, color: 'text-green-400' },
            { label: 'Health', value: `${cityStats.systemHealth}%`, color: 'text-purple-400' },
            { label: 'Efficiency', value: `${cityStats.efficiency}%`, color: 'text-orange-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className={`${stat.color} font-bold text-xl`}>{stat.value}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Neon Tabs */}
      <div className="flex border-b border-gray-700/50">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id as 'overview' | 'agents' | 'analytics' | 'movements')}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-all duration-300 relative ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: activeTab === tab.id 
                ? '0 0 20px rgba(59, 130, 246, 0.5)' 
                : '0 0 10px rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
            
            {/* Active Tab Glow Effect */}
            {activeTab === tab.id && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-t-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Enhanced Agent Status with Halo Effect
interface NeonAgentStatusProps {
  agent: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    status: 'idle' | 'thinking' | 'working' | 'completed' | 'error';
    progress: number;
    current_task: string;
    capabilities: string[];
  };
  onTrigger: (agentId: string) => void;
}

const NeonAgentStatus: React.FC<NeonAgentStatusProps> = ({ agent, onTrigger }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'working': return {
        primary: 'from-blue-500 to-cyan-500',
        glow: 'shadow-blue-400/50',
        text: 'text-blue-400',
        halo: 'rgba(59, 130, 246, 0.3)'
      };
      case 'thinking': return {
        primary: 'from-yellow-500 to-orange-500',
        glow: 'shadow-yellow-400/50',
        text: 'text-yellow-400',
        halo: 'rgba(251, 191, 36, 0.3)'
      };
      case 'completed': return {
        primary: 'from-green-500 to-emerald-500',
        glow: 'shadow-green-400/50',
        text: 'text-green-400',
        halo: 'rgba(34, 197, 94, 0.3)'
      };
      case 'error': return {
        primary: 'from-red-500 to-pink-500',
        glow: 'shadow-red-400/50',
        text: 'text-red-400',
        halo: 'rgba(239, 68, 68, 0.3)'
      };
      default: return {
        primary: 'from-gray-500 to-gray-600',
        glow: 'shadow-gray-400/50',
        text: 'text-gray-400',
        halo: 'rgba(156, 163, 175, 0.3)'
      };
    }
  };

  const statusColors = getStatusColors(agent.status);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 0 30px ${statusColors.halo}`
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Agent Header with Halo Effect */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div
            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${statusColors.primary} flex items-center justify-center text-white text-2xl font-bold ${statusColors.glow} shadow-lg`}
            animate={isHovered ? { 
              scale: [1, 1.1, 1],
              boxShadow: [
                `0 0 20px ${statusColors.halo}`,
                `0 0 40px ${statusColors.halo}`,
                `0 0 20px ${statusColors.halo}`
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Halo Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  `0 0 20px ${statusColors.halo}`,
                  `0 0 40px ${statusColors.halo}`,
                  `0 0 20px ${statusColors.halo}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {agent.avatar}
          </motion.div>
          
          <div>
            <h3 className="text-xl font-bold text-white">{agent.name}</h3>
            <p className="text-gray-400 text-sm">{agent.title}</p>
            <div className="flex items-center space-x-2 mt-1">
              <motion.div 
                className={`w-2 h-2 rounded-full ${
                  agent.status === 'working' ? 'bg-blue-400 animate-pulse' :
                  agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' :
                  agent.status === 'completed' ? 'bg-green-400' : 'bg-gray-400'
                }`}
                animate={agent.status === 'working' || agent.status === 'thinking' ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className={`text-xs font-medium ${statusColors.text}`}>
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={() => onTrigger(agent.id)}
          className={`px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
            agent.status === 'working' 
              ? 'bg-gray-600/50 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
          whileHover={agent.status !== 'working' ? { scale: 1.05 } : {}}
          whileTap={agent.status !== 'working' ? { scale: 0.95 } : {}}
          disabled={agent.status === 'working'}
        >
          {agent.status === 'working' ? (
            <Activity className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Animated Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm font-medium">Progress</span>
          <span className="text-white text-sm font-bold">{agent.progress}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <motion.div 
            className={`h-full bg-gradient-to-r ${statusColors.primary} rounded-full relative`}
            initial={{ width: 0 }}
            animate={{ width: `${agent.progress}%` }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            {/* Flowing Gradient Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm font-medium">Current Task</span>
        </div>
        <p className="text-gray-300 text-sm bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
          {agent.current_task}
        </p>
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-2">
        {agent.capabilities.slice(0, 3).map((capability, index) => (
          <motion.span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 text-xs rounded-full font-medium border border-gray-600/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
            }}
          >
            {capability}
          </motion.span>
        ))}
        {agent.capabilities.length > 3 && (
          <span className="px-3 py-1 bg-gray-700/30 text-gray-500 text-xs rounded-full">
            +{agent.capabilities.length - 3} more
          </span>
        )}
      </div>
    </motion.div>
  );
};

export { NeonHeader, NeonAgentStatus };
