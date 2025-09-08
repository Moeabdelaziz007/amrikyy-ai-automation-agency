'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  Database, 
  Activity,
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  Target,
  Sparkles,
  Navigation
} from 'lucide-react';

// Building Component for City Districts
interface BuildingProps {
  building: {
    id: string;
    name: string;
    type: 'skyscraper' | 'tower' | 'center' | 'fortress';
    height: number;
    status: 'active' | 'idle' | 'processing';
    task_count: number;
    completion_rate: number;
  };
  index: number;
  onBuildingClick: (buildingId: string) => void;
}

const Building: React.FC<BuildingProps> = ({ building, index, onBuildingClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'skyscraper': return <Building2 className="w-4 h-4" />;
      case 'tower': return <Activity className="w-4 h-4" />;
      case 'center': return <Database className="w-4 h-4" />;
      case 'fortress': return <Shield className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'processing': return 'bg-blue-400';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getHeightClass = (height: number) => {
    if (height >= 20) return 'h-20';
    if (height >= 16) return 'h-16';
    if (height >= 12) return 'h-12';
    return 'h-8';
  };

  return (
    <motion.div
      className={`${getHeightClass(building.height)} bg-white/20 rounded-lg flex flex-col items-center justify-end p-2 cursor-pointer transition-all duration-300 ${
        building.status === 'active' ? 'bg-white/30 shadow-lg' : 'bg-white/10'
      } ${isHovered ? 'scale-105 shadow-xl' : 'scale-100'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onBuildingClick(building.id)}
    >
      {/* Building Icon */}
      <motion.div
        className="text-white mb-2"
        animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {getBuildingIcon(building.type)}
      </motion.div>

      {/* Building Info */}
      <div className="text-white text-xs font-medium text-center">
        <div className="truncate max-w-full">{building.name}</div>
        <div className="flex items-center justify-center space-x-1 mt-1">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(building.status)}`} />
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
    </motion.div>
  );
};

// Agent District Component
interface DistrictProps {
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
    };
    buildings: Array<{
      id: string;
      name: string;
      type: 'skyscraper' | 'tower' | 'center' | 'fortress';
      height: number;
      status: 'active' | 'idle' | 'processing';
      task_count: number;
      completion_rate: number;
    }>;
    position: { x: number; y: number };
    color: string;
    gradient: string;
  };
  onAgentClick: (agentId: string) => void;
  onBuildingClick: (buildingId: string) => void;
}

const AgentDistrict: React.FC<DistrictProps> = ({ 
  district, 
  onAgentClick, 
  onBuildingClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getDistrictIcon = (type: string) => {
    switch (type) {
      case 'code': return <Building2 className="w-8 h-8" />;
      case 'security': return <Shield className="w-8 h-8" />;
      case 'data': return <Database className="w-8 h-8" />;
      case 'monitoring': return <Activity className="w-8 h-8" />;
      default: return <Building2 className="w-8 h-8" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'text-gray-400';
      case 'thinking': return 'text-yellow-400';
      case 'working': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <Play className="w-4 h-4" />;
      case 'thinking': return <Clock className="w-4 h-4 animate-pulse" />;
      case 'working': return <Zap className="w-4 h-4 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <RotateCcw className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className={`relative ${district.gradient} rounded-2xl border-2 border-opacity-30 p-6 transition-all duration-300 ${
        isHovered ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* District Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* District Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${district.color}`}
            animate={isHovered ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getDistrictIcon(district.type)}
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">{district.name}</h3>
            <p className="text-white/80 text-sm">{district.agent.title}</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                district.agent.status === 'idle' ? 'bg-gray-400' :
                district.agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' :
                district.agent.status === 'working' ? 'bg-blue-400 animate-pulse' :
                district.agent.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className={`text-xs font-medium ${getStatusColor(district.agent.status)}`}>
                {district.agent.status.charAt(0).toUpperCase() + district.agent.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* District Stats */}
        <div className="text-right">
          <div className="text-white font-bold text-lg">
            {district.buildings.reduce((sum, building) => sum + building.task_count, 0)}
          </div>
          <div className="text-white/60 text-xs">Active Tasks</div>
        </div>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {district.buildings.map((building, index) => (
          <Building
            key={building.id}
            building={building}
            index={index}
            onBuildingClick={onBuildingClick}
          />
        ))}
      </div>

      {/* Agent Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm font-medium">Agent Progress</span>
          <span className="text-white text-sm font-bold">{district.agent.progress}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${district.agent.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-4 h-4 text-white/60" />
          <span className="text-white/80 text-sm font-medium">Current Task</span>
        </div>
        <p className="text-white/90 text-sm bg-white/10 rounded-lg p-3">
          {district.agent.current_task}
        </p>
      </div>

      {/* Capabilities */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-white/60" />
          <span className="text-white/80 text-sm font-medium">Capabilities</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {district.agent.capabilities.slice(0, 3).map((capability, index) => (
            <motion.span
              key={index}
              className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {capability}
            </motion.span>
          ))}
          {district.agent.capabilities.length > 3 && (
            <span className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full">
              +{district.agent.capabilities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.button
          onClick={() => onAgentClick(district.agent.id)}
          className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            district.agent.status === 'working' 
              ? 'bg-white/20 cursor-not-allowed' 
              : 'bg-white/30 hover:bg-white/40'
          }`}
          whileHover={district.agent.status !== 'working' ? { scale: 1.05 } : {}}
          whileTap={district.agent.status !== 'working' ? { scale: 0.95 } : {}}
          disabled={district.agent.status === 'working'}
        >
          {getStatusIcon(district.agent.status)}
          <span>
            {district.agent.status === 'working' ? 'Working...' : 'Activate Agent'}
          </span>
        </motion.button>

        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Navigation className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-white/20"
          >
            <div className="space-y-3">
              <div>
                <h4 className="text-white/80 text-sm font-medium mb-2">District Overview</h4>
                <p className="text-white/70 text-sm">
                  {district.type === 'code' && 'A bustling tech district filled with coding skyscrapers and development centers.'}
                  {district.type === 'security' && 'A fortified district protected by security towers and monitoring fortresses.'}
                  {district.type === 'data' && 'An analytics hub with data processing centers and insight towers.'}
                  {district.type === 'monitoring' && 'A control center with observation towers and health monitoring facilities.'}
                </p>
              </div>
              <div>
                <h4 className="text-white/80 text-sm font-medium mb-2">Building Statistics</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-white/70">
                    <div>Total Buildings: {district.buildings.length}</div>
                    <div>Active Buildings: {district.buildings.filter(b => b.status === 'active').length}</div>
                  </div>
                  <div className="text-white/70">
                    <div>Avg Completion: {Math.round(district.buildings.reduce((sum, b) => sum + b.completion_rate, 0) / district.buildings.length)}%</div>
                    <div>Total Tasks: {district.buildings.reduce((sum, b) => sum + b.task_count, 0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AgentDistrict;
