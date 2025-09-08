'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  ArrowRight, 
  Zap, 
  CheckCircle, 
  Clock,
  Sparkles} from 'lucide-react';

// Real-time Agent Movement Component
interface AgentMovementProps {
  agentId: string;
  agentName: string;
  fromDistrict: string;
  toDistrict: string;
  status: 'moving' | 'arrived' | 'departing';
  progress: number;
  task: string;
  estimatedTime: string;
  onMovementComplete: (agentId: string) => void;
}

const AgentMovement: React.FC<AgentMovementProps> = ({
  agentId,
  agentName,
  fromDistrict,
  toDistrict,
  status,
  progress,
  task,
  estimatedTime,
  onMovementComplete
}) => {
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    if (status === 'moving') {
      const interval = setInterval(() => {
        setCurrentPosition(prev => {
          const newPosition = prev + 2;
          if (newPosition >= 100) {
            onMovementComplete(agentId);
            return 100;
          }
          return newPosition;
        });
      }, 100);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [status, agentId, onMovementComplete]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'moving': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'arrived': return <CheckCircle className="w-4 h-4" />;
      case 'departing': return <ArrowRight className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'text-blue-400';
      case 'arrived': return 'text-green-400';
      case 'departing': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            status === 'moving' ? 'bg-blue-500' :
            status === 'arrived' ? 'bg-green-500' : 'bg-yellow-500'
          }`}>
            {getStatusIcon(status)}
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">{agentName}</h4>
            <p className="text-gray-400 text-xs">{task}</p>
          </div>
        </div>
        <div className={`text-xs font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      {/* Movement Path */}
      <div className="relative mb-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{fromDistrict}</span>
          <span>{toDistrict}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
          {/* Background Path */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full" />
          
          {/* Active Path */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Moving Agent Indicator */}
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
            style={{ left: `${currentPosition}%` }}
            animate={status === 'moving' ? {
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0.7)',
                '0 0 0 10px rgba(59, 130, 246, 0)',
                '0 0 0 0 rgba(59, 130, 246, 0)'
              ]
            } : {}}
            transition={{ 
              duration: 1.5,
              repeat: status === 'moving' ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Progress: {Math.round(progress)}%</span>
        <span>ETA: {estimatedTime}</span>
      </div>
    </motion.div>
  );
};

// Enhanced Path Visualization Component
interface EnhancedAgentPathProps {
  path: {
    id: string;
    from: string;
    to: string;
    status: 'active' | 'completed' | 'pending';
    progress: number;
    task: string;
    agent: string;
    timestamp: string;
    estimatedTime: string;
  };
  districts: Array<{
    id: string;
    position: { x: number; y: number };
    name: string;
  }>;
}

const EnhancedAgentPath: React.FC<EnhancedAgentPathProps> = ({ 
  path, 
  districts 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  
  const fromDistrict = districts.find(d => d.id === path.from);
  const toDistrict = districts.find(d => d.id === path.to);

  if (!fromDistrict || !toDistrict) return null;

  const getPathColor = (status: string) => {
    switch (status) {
      case 'active': return {
        stroke: 'stroke-blue-400',
        fill: 'fill-blue-400/20',
        glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
      };
      case 'completed': return {
        stroke: 'stroke-green-400',
        fill: 'fill-green-400/20',
        glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'
      };
      case 'pending': return {
        stroke: 'stroke-gray-400',
        fill: 'fill-gray-400/20',
        glow: 'drop-shadow-[0_0_8px_rgba(156,163,175,0.5)]'
      };
      default: return {
        stroke: 'stroke-gray-400',
        fill: 'fill-gray-400/20',
        glow: 'drop-shadow-[0_0_8px_rgba(156,163,175,0.5)]'
      };
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

  const pathColors = getPathColor(path.status);

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
      onHoverStart={() => {
        setIsHovered(true);
        setShowParticles(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowParticles(false);
      }}
    >
      {/* Path Line with Glow Effect */}
      <svg
        className={`absolute inset-0 w-full h-full ${pathColors.glow}`}
        style={{ zIndex: 1 }}
      >
        {/* Background Path */}
        <motion.line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="currentColor"
          strokeWidth="4"
          className="stroke-gray-600/30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Active Path */}
        <motion.line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="currentColor"
          strokeWidth="3"
          className={pathColors.stroke}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: path.progress / 100 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Animated Pulse Line */}
        {path.status === 'active' && (
          <motion.line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-blue-300"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>

      {/* Moving Agent Indicator */}
      <motion.div
        className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white ${
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

      {/* Particle Effects */}
      <AnimatePresence>
        {showParticles && path.status === 'active' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${path.progress}%`,
                  top: `${path.progress}%`
                }}
                initial={{ 
                  scale: 0, 
                  opacity: 1,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [1, 0],
                  x: (Math.random() - 0.5) * 20,
                  y: (Math.random() - 0.5) * 20
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Path Info Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl border border-gray-700"
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
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(path.status)}
                <span className="font-medium">{path.agent}</span>
              </div>
              <div className="text-gray-300 text-xs mb-2">{path.task}</div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Progress: {Math.round(path.progress)}%</span>
                <span>ETA: {path.estimatedTime}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(path.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Real-time Movement Tracker Component
interface MovementTrackerProps {
  movements: Array<{
    id: string;
    agentId: string;
    agentName: string;
    fromDistrict: string;
    toDistrict: string;
    status: 'moving' | 'arrived' | 'departing';
    progress: number;
    task: string;
    estimatedTime: string;
  }>;
  onMovementComplete: (agentId: string) => void;
}

const MovementTracker: React.FC<MovementTrackerProps> = ({ 
  movements, 
  onMovementComplete 
}) => {
  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Navigation className="w-5 h-5 mr-2 text-blue-400" />
        Real-time Agent Movements
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {movements.map((movement) => (
            <AgentMovement
              key={movement.id}
              agentId={movement.agentId}
              agentName={movement.agentName}
              fromDistrict={movement.fromDistrict}
              toDistrict={movement.toDistrict}
              status={movement.status}
              progress={movement.progress}
              task={movement.task}
              estimatedTime={movement.estimatedTime}
              onMovementComplete={onMovementComplete}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export { AgentMovement, EnhancedAgentPath, MovementTracker };
