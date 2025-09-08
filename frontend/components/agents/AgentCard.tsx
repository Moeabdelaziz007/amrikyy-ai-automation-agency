// components/agents/AgentCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CapabilityTooltip } from '../ui/Tooltip';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'running' | 'error';
  type: 'content' | 'code' | 'research' | 'design' | 'data' | 'quantum';
  capabilities: string[];
  lastRun?: Date;
  successRate?: number;
}

interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  onRunAgent: (agentId: string) => void;
  onViewDetails: (agentId: string) => void;
  animationDelay?: number;
  index?: number;
}

export default function AgentCard({ agent, isActive, onRunAgent, onViewDetails, animationDelay = 0, index = 0 }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-neon-green';
      case 'running': return 'bg-cyber-blue';
      case 'error': return 'bg-danger-red';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ACTIVE';
      case 'running': return 'RUNNING';
      case 'error': return 'ERROR';
      default: return 'INACTIVE';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return '📝';
      case 'code': return '💻';
      case 'research': return '🔍';
      case 'design': return '🎨';
      case 'data': return '📊';
      case 'quantum': return '⚛️';
      default: return '🤖';
    }
  };

  return (
    <motion.div 
      className="bg-card border border-neon-green rounded-lg p-6 relative overflow-hidden cursor-pointer group"
      data-help="agent-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6,
        delay: animationDelay + (index * 0.1),
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 transition-opacity duration-300"
           style={{ opacity: isHovered ? 1 : 0 }} />
      
      {/* Enhanced Status Indicator with Pulsing */}
      <div className="absolute top-4 right-4">
        <motion.div 
          className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} shadow-lg`}
          animate={agent.status === 'active' || agent.status === 'running' ? {
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              '0 0 10px rgba(0, 255, 65, 0.5)',
              '0 0 20px rgba(0, 255, 65, 0.8)',
              '0 0 10px rgba(0, 255, 65, 0.5)'
            ]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Pulsing Ring for Active Agents */}
        {agent.status === 'active' && (
          <motion.div
            className="absolute inset-0 w-3 h-3 rounded-full border-2 border-neon-green"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      {/* Enhanced Agent Type Icon with Hover Effects */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="text-3xl relative"
            whileHover={{ 
              scale: 1.2,
              rotate: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            {getTypeIcon(agent.type)}
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 text-3xl opacity-0"
              animate={isHovered ? {
                opacity: [0, 0.5, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getTypeIcon(agent.type)}
            </motion.div>
          </motion.div>
          <motion.h3 
            className="text-xl font-bold text-neon-green"
            whileHover={{ 
              scale: 1.05,
              color: "#00ff41"
            }}
            transition={{ duration: 0.2 }}
          >
            {agent.name}
          </motion.h3>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed">{agent.description}</p>
      
      {/* Enhanced Capabilities with Hover Effects */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Capabilities:</h4>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <CapabilityTooltip key={index} capability={capability}>
              <motion.span 
                className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded-full border border-neon-green/30 cursor-pointer hover:bg-neon-green/30 hover:border-neon-green/60 transition-all duration-200"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(0, 255, 65, 0.3)",
                  borderColor: "rgba(0, 255, 65, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: animationDelay + (index * 0.15),
                  ease: "easeOut"
                }}
              >
                {capability}
              </motion.span>
            </CapabilityTooltip>
          ))}
          {agent.capabilities.length > 3 && (
            <motion.span 
              className="text-xs text-gray-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              +{agent.capabilities.length - 3} more
            </motion.span>
          )}
        </div>
      </div>
      
      {/* Enhanced Stats with Hover Effects */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="text-center cursor-pointer"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(0, 102, 255, 0.1)"
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="text-lg font-bold text-cyber-blue"
            whileHover={{ 
              scale: 1.1,
              color: "#0066ff"
            }}
            transition={{ duration: 0.2 }}
          >
            {agent.successRate || 0}%
          </motion.div>
          <div className="text-xs text-gray-400">Success Rate</div>
        </motion.div>
        <motion.div 
          className="text-center cursor-pointer"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(139, 92, 246, 0.1)"
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="text-lg font-bold text-electric-purple"
            whileHover={{ 
              scale: 1.1,
              color: "#8b5cf6"
            }}
            transition={{ duration: 0.2 }}
          >
            {agent.lastRun ? new Date(agent.lastRun).toLocaleDateString() : 'Never'}
          </motion.div>
          <div className="text-xs text-gray-400">Last Run</div>
        </motion.div>
      </div>
      
      {/* Enhanced Action Buttons with Advanced Hover Effects */}
      <div className="flex space-x-3">
        <motion.button 
          className="flex-1 bg-gradient-to-r from-neon-green to-cyber-blue text-black font-bold py-2 px-4 rounded relative overflow-hidden group"
          onClick={() => onRunAgent(agent.id)}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Button Background Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyber-blue to-neon-green opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">Run Agent</span>
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.button>
        
        <motion.button 
          className="flex-1 border border-neon-green text-neon-green py-2 px-4 rounded relative overflow-hidden group"
          onClick={() => onViewDetails(agent.id)}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(0, 255, 65, 0.1)",
            borderColor: "rgba(0, 255, 65, 0.6)",
            boxShadow: "0 0 15px rgba(0, 255, 65, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span className="relative z-10">View Details</span>
          {/* Border Glow Effect */}
          <motion.div
            className="absolute inset-0 border border-neon-green rounded opacity-0"
            whileHover={{ 
              opacity: 1,
              scale: 1.05
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
      
      {/* Enhanced Active Badge with Pulsing Effects */}
      {isActive && (
        <motion.div 
          className="absolute top-2 right-2 bg-gradient-to-r from-neon-green to-cyber-blue text-black text-xs px-3 py-1 rounded-full font-bold shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            delay: 0.2,
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 5px rgba(0, 0, 0, 0.5)',
                '0 0 10px rgba(0, 0, 0, 0.8)',
                '0 0 5px rgba(0, 0, 0, 0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {getStatusText(agent.status)}
          </motion.span>
          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-neon-green rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
      
      {/* Enhanced Hover Effect Border with Advanced Animations */}
      <motion.div 
        className="absolute inset-0 border-2 border-transparent rounded-lg"
        animate={isHovered ? {
          borderColor: 'rgba(0, 255, 65, 0.5)',
          boxShadow: '0 0 30px rgba(0, 255, 65, 0.3)'
        } : {
          borderColor: 'transparent',
          boxShadow: 'none'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Animated Corner Accents */}
      {isHovered && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          />
        </>
      )}
      
      {/* Floating Particles on Hover */}
      {isHovered && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-green rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
