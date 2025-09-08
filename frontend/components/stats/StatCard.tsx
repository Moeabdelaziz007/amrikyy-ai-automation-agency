// components/stats/StatCard.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  icon, 
  color, 
  description,
  isLoading = false,
  onClick 
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTrendColor = (trend: string) => {
    if (trend.includes('+') || trend.includes('▲') || trend.includes('↑')) {
      return 'text-success-green';
    } else if (trend.includes('-') || trend.includes('▼') || trend.includes('↓')) {
      return 'text-danger-red';
    } else {
      return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend.includes('+') || trend.includes('▲') || trend.includes('↑')) {
      return '↗';
    } else if (trend.includes('-') || trend.includes('▼') || trend.includes('↓')) {
      return '↘';
    } else {
      return '→';
    }
  };

  return (
    <motion.div 
      className={`bg-card border border-neon-green rounded-lg p-6 relative overflow-hidden cursor-pointer transition-all duration-300 ${
        onClick ? 'hover:border-neon-green hover:shadow-neon' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={onClick ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 transition-opacity duration-300"
           style={{ opacity: isHovered ? 1 : 0 }} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-medium text-gray-300">{title}</h3>
        <motion.div 
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} shadow-lg`}
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
      </div>
      
      {/* Value */}
      <div className="text-3xl font-bold mb-2 relative z-10">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading...</span>
          </div>
        ) : (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.span>
        )}
      </div>
      
      {/* Trend */}
      <div className="text-sm relative z-10">
        <span className={`flex items-center ${getTrendColor(trend)}`}>
          <motion.span 
            className="mr-1 text-lg"
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {getTrendIcon(trend)}
          </motion.span>
          {trend}
        </span>
      </div>
      
      {/* Description */}
      {description && (
        <div className="mt-3 text-xs text-gray-500 relative z-10">
          {description}
        </div>
      )}
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent rounded-lg transition-all duration-300"
           style={{ 
             borderColor: isHovered ? 'rgba(0, 255, 65, 0.5)' : 'transparent',
             boxShadow: isHovered ? '0 0 30px rgba(0, 255, 65, 0.3)' : 'none'
           }} />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
}
