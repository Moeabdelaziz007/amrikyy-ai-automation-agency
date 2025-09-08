'use client';

import React, { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  MapPin, 
  ArrowRight, 
  Zap, 
  CheckCircle, 
  Clock,
  Target,
  Play} from 'lucide-react';

// Agent Path Visualization Component
interface AgentPathProps {
  path: {
    id: string;
    from: string;
    to: string;
    status: 'active' | 'completed' | 'pending';
    progress: number;
    task: string;
    agent: string;
    timestamp: string;
  };
  districts: Array<{
    id: string;
    position: { x: number; y: number };
    name: string;
  }>;
}

const AgentPath: React.FC<AgentPathProps> = ({ path, districts }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const fromDistrict = districts.find(d => d.id === path.from);
  const toDistrict = districts.find(d => d.id === path.to);

  if (!fromDistrict || !toDistrict) return null;

  const getPathColor = (status: string) => {
    switch (status) {
      case 'active': return 'stroke-blue-400';
      case 'completed': return 'stroke-green-400';
      case 'pending': return 'stroke-gray-400';
      default: return 'stroke-gray-400';
    }
  };

  const getPathWidth = (status: string) => {
    switch (status) {
      case 'active': return 3;
      case 'completed': return 2;
      case 'pending': return 1;
      default: return 1;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${Math.min(fromDistrict.position.x, toDistrict.position.x) * 25}%`,
        top: `${Math.min(fromDistrict.position.y, toDistrict.position.y) * 25}%`,
        width: `${Math.abs(toDistrict.position.x - fromDistrict.position.x) * 25}%`,
        height: `${Math.abs(toDistrict.position.y - fromDistrict.position.y) * 25}%`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Path Line */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      >
        <motion.line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="currentColor"
          strokeWidth={getPathWidth(path.status)}
          className={getPathColor(path.status)}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: path.progress / 100 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>

      {/* Moving Agent Indicator */}
      <motion.div
        className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white ${
          path.status === 'active' ? 'bg-blue-400' : 
          path.status === 'completed' ? 'bg-green-400' : 'bg-gray-400'
        }`}
        animate={{
          x: `${path.progress}%`,
          y: `${path.progress}%`
        }}
        transition={{ 
          duration: 2, 
          repeat: path.status === 'active' ? Infinity : 0,
          ease: "easeInOut"
        }}
        style={{ zIndex: 2 }}
      >
        {getStatusIcon(path.status)}
      </motion.div>

      {/* Path Info Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bg-gray-900/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg border border-gray-700"
            style={{
              left: `${path.progress}%`,
              top: `${path.progress}%`,
              transform: 'translate(-50%, -100%)',
              zIndex: 10
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="text-sm">
              <div className="font-medium">{path.agent}</div>
              <div className="text-gray-300 text-xs">{path.task}</div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${
                  path.status === 'active' ? 'bg-blue-400' : 
                  path.status === 'completed' ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-gray-400">
                  {path.status.charAt(0).toUpperCase() + path.status.slice(1)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// City Navigation Component
interface CityNavigationProps {
  districts: Array<{
    id: string;
    name: string;
    type: string;
    position: { x: number; y: number };
  }>;
  paths: Array<{
    id: string;
    from: string;
    to: string;
    status: string;
    progress: number;
    task: string;
    agent: string;
  }>;
  onDistrictSelect: (districtId: string) => void;
  onPathSelect: (pathId: string) => void;
}

const CityNavigation: React.FC<CityNavigationProps> = ({ 
  districts, 
  paths, 
  onDistrictSelect, 
  onPathSelect 
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedPath(null);
    onDistrictSelect(districtId);
  };

  const handlePathClick = (pathId: string) => {
    setSelectedPath(pathId);
    setSelectedDistrict(null);
    onPathSelect(pathId);
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Navigation className="w-5 h-5 mr-2 text-blue-400" />
        City Navigation
      </h3>

      {/* District Navigation */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Districts</h4>
        <div className="grid grid-cols-2 gap-2">
          {districts.map((district) => (
            <motion.button
              key={district.id}
              onClick={() => handleDistrictClick(district.id)}
              className={`p-3 rounded-lg text-left transition-all duration-200 ${
                selectedDistrict === district.id 
                  ? 'bg-blue-500/20 border border-blue-500/50' 
                  : 'bg-gray-700/50 hover:bg-gray-700/70'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-white text-sm font-medium">{district.name}</div>
                  <div className="text-gray-400 text-xs">{district.type}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Paths */}
      <div>
        <h4 className="text-white font-medium mb-3">Active Paths</h4>
        <div className="space-y-2">
          {paths.map((path) => (
            <motion.button
              key={path.id}
              onClick={() => handlePathClick(path.id)}
              className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                selectedPath === path.id 
                  ? 'bg-blue-500/20 border border-blue-500/50' 
                  : 'bg-gray-700/50 hover:bg-gray-700/70'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-white text-sm font-medium">{path.agent}</div>
                    <div className="text-gray-400 text-xs">{path.task}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    path.status === 'active' ? 'bg-blue-400' : 
                    path.status === 'completed' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-xs text-gray-400">{path.progress}%</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Agent Movement Controller
interface AgentMovementControllerProps {
  agents: Array<{
    id: string;
    name: string;
    status: string;
    current_task: string;
  }>;
  onAgentMove: (agentId: string, targetDistrict: string) => void;
}

const AgentMovementController: React.FC<AgentMovementControllerProps> = ({ 
  agents, 
  onAgentMove 
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [targetDistrict, setTargetDistrict] = useState<string | null>(null);

  const districts = [
    { id: 'code-district', name: 'Code District' },
    { id: 'security-district', name: 'Security District' },
    { id: 'data-district', name: 'Data District' },
    { id: 'monitoring-district', name: 'Monitoring District' }
  ];

  const handleMoveAgent = () => {
    if (selectedAgent && targetDistrict) {
      onAgentMove(selectedAgent, targetDistrict);
      setSelectedAgent(null);
      setTargetDistrict(null);
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-blue-400" />
        Agent Movement Control
      </h3>

      {/* Agent Selection */}
      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Select Agent</label>
        <select
          value={selectedAgent || ''}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Choose an agent...</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} - {agent.status}
            </option>
          ))}
        </select>
      </div>

      {/* Target District Selection */}
      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Target District</label>
        <select
          value={targetDistrict || ''}
          onChange={(e) => setTargetDistrict(e.target.value)}
          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Choose a district...</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Move Button */}
      <motion.button
        onClick={handleMoveAgent}
        disabled={!selectedAgent || !targetDistrict}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          selectedAgent && targetDistrict
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={selectedAgent && targetDistrict ? { scale: 1.02 } : {}}
        whileTap={selectedAgent && targetDistrict ? { scale: 0.98 } : {}}
      >
        <Play className="w-4 h-4" />
        <span>Move Agent</span>
      </motion.button>

      {/* Current Agent Status */}
      {selectedAgent && (
        <motion.div
          className="mt-4 p-3 bg-gray-700/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-white text-sm">
            <div className="font-medium">
              {agents.find(a => a.id === selectedAgent)?.name}
            </div>
            <div className="text-gray-400 text-xs">
              {agents.find(a => a.id === selectedAgent)?.current_task}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export { AgentPath, CityNavigation, AgentMovementController };
