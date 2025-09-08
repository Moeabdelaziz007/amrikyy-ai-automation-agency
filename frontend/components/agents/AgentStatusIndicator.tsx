'use client';

import { motion } from 'framer-motion';

interface AgentStatusIndicatorProps {
  status: 'online' | 'offline' | 'processing' | 'error' | 'idle';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export default function AgentStatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = false,
  animated = true 
}: AgentStatusIndicatorProps) {
  
  const getStatusStyles = () => {
    const baseClasses = 'rounded-full';
    
    switch(status) {
      case 'online':
        return `${baseClasses} bg-green-500 border-green-400`;
      case 'offline':
        return `${baseClasses} bg-gray-600 border-gray-500`;
      case 'processing':
        return `${baseClasses} bg-yellow-500 border-yellow-400`;
      case 'error':
        return `${baseClasses} bg-red-500 border-red-400`;
      case 'idle':
        return `${baseClasses} bg-blue-500 border-blue-400`;
      default:
        return `${baseClasses} bg-gray-600 border-gray-500`;
    }
  };

  const getSizeClasses = () => {
    switch(size) {
      case 'sm':
        return 'w-2 h-2';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  const getStatusLabel = () => {
    switch(status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'processing': return 'Processing';
      case 'error': return 'Error';
      case 'idle': return 'Idle';
      default: return 'Unknown';
    }
  };

  const getPulseAnimation = () => {
    if (!animated) return {};
    
    switch(status) {
      case 'online':
        return {
          animate: { 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          },
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'processing':
        return {
          animate: { 
            scale: [1, 1.3, 1],
            opacity: [1, 0.5, 1]
          },
          transition: { 
            duration: 1, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'error':
        return {
          animate: { 
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1]
          },
          transition: { 
            duration: 0.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className={`${getSizeClasses()} ${getStatusStyles()} border-2`}
        {...getPulseAnimation()}
      />
      {showLabel && (
        <span className="text-sm text-gray-300 font-medium">
          {getStatusLabel()}
        </span>
      )}
    </div>
  );
}

// Enhanced StatusIndicator with more features
export function EnhancedAgentStatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = false,
  animated = true,
  showProgress = false,
  progress = 0
}: AgentStatusIndicatorProps & { 
  showProgress?: boolean; 
  progress?: number; 
}) {
  
  const getStatusColor = () => {
    switch(status) {
      case 'online': return '#10b981';
      case 'offline': return '#6b7280';
      case 'processing': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'idle': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return 'w-2 h-2';
      case 'lg': return 'w-4 h-4';
      default: return 'w-3 h-3';
    }
  };

  const getStatusLabel = () => {
    switch(status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'processing': return 'Processing';
      case 'error': return 'Error';
      case 'idle': return 'Idle';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        {/* Main indicator */}
        <motion.div
          className={`${getSizeClasses()} rounded-full border-2`}
          style={{ 
            backgroundColor: getStatusColor(),
            borderColor: getStatusColor()
          }}
          animate={animated ? {
            scale: status === 'processing' ? [1, 1.2, 1] : 1,
            opacity: status === 'processing' ? [1, 0.7, 1] : 1
          } : {}}
          transition={animated ? {
            duration: status === 'processing' ? 1 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
        
        {/* Progress ring for processing status */}
        {showProgress && status === 'processing' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: getStatusColor(),
              borderRightColor: getStatusColor()
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
        
        {/* Pulse effect for online status */}
        {animated && status === 'online' && (
          <motion.div
            className={`absolute inset-0 ${getSizeClasses()} rounded-full`}
            style={{ backgroundColor: getStatusColor() }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </div>
      
      {showLabel && (
        <span className="text-sm text-gray-300 font-medium">
          {getStatusLabel()}
        </span>
      )}
      
      {/* Progress percentage */}
      {showProgress && status === 'processing' && (
        <span className="text-xs text-gray-400">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

// Status indicator with tooltip
export function StatusIndicatorWithTooltip({ 
  status, 
  size = 'md',
  tooltip = true
}: AgentStatusIndicatorProps & { tooltip?: boolean }) {
  
  const getStatusInfo = () => {
    switch(status) {
      case 'online':
        return {
          color: '#10b981',
          label: 'Online',
          description: 'Agent is active and ready'
        };
      case 'offline':
        return {
          color: '#6b7280',
          label: 'Offline',
          description: 'Agent is not running'
        };
      case 'processing':
        return {
          color: '#f59e0b',
          label: 'Processing',
          description: 'Agent is executing a task'
        };
      case 'error':
        return {
          color: '#ef4444',
          label: 'Error',
          description: 'Agent encountered an error'
        };
      case 'idle':
        return {
          color: '#3b82f6',
          label: 'Idle',
          description: 'Agent is waiting for tasks'
        };
      default:
        return {
          color: '#6b7280',
          label: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return 'w-2 h-2';
      case 'lg': return 'w-4 h-4';
      default: return 'w-3 h-3';
    }
  };

  return (
    <div className="relative group">
      <motion.div
        className={`${getSizeClasses()} rounded-full border-2`}
        style={{ 
          backgroundColor: statusInfo.color,
          borderColor: statusInfo.color
        }}
        animate={status === 'processing' ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-carbon-black border border-neon-green/30 rounded-lg px-3 py-2 text-sm text-white shadow-lg">
            <div className="font-medium">{statusInfo.label}</div>
            <div className="text-xs text-gray-400">{statusInfo.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}
