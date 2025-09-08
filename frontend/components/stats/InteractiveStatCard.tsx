'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { HoverGlow } from '../ui/MicroInteraction';

interface IconProps {
  name: string;
  bgColor: string;
  iconColor: string;
}

interface InteractiveStatCardProps {
  title: string;
  value: string | number;
  trend?: string | undefined;
  trendValue?: number;
  icon: IconProps;
  description?: string | undefined;
  delay?: number;
  onClick?: (() => void) | undefined;
}

export default function InteractiveStatCard({ 
  title, 
  value, 
  trend, 
  trendValue = 0,
  icon, 
  description,
  delay = 0,
  onClick 
}: InteractiveStatCardProps) {
  const [hovered, setHovered] = useState(false);
  
  const getTrendIcon = () => {
    if (trendValue > 0) return <TrendingUp className="w-4 h-4" />;
    if (trendValue < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trendValue > 0) return 'text-green-400';
    if (trendValue < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <HoverGlow>
      <motion.div 
        className={`bg-card border border-neon-green/20 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
          hovered ? 'border-neon-green/40 shadow-lg' : ''
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ 
          scale: 1.02,
          y: -4,
          boxShadow: '0 10px 30px rgba(0, 255, 65, 0.2)'
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-300">{title}</h3>
          <motion.div 
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${icon.bgColor}`}
            animate={hovered ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className={`text-xl ${icon.iconColor}`}>
              {icon.name}
            </span>
          </motion.div>
        </div>
        
        {/* Value */}
        <motion.div 
          className="text-3xl font-bold mb-2 text-white"
          animate={hovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.div>
        
        {/* Trend */}
        {trend && (
          <div className={`text-sm flex items-center ${getTrendColor()}`}>
            <motion.div
              animate={hovered ? { scale: 1.2 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {getTrendIcon()}
            </motion.div>
            <span className="ml-1">{trend}</span>
          </div>
        )}
        
        {/* Description */}
        {description && (
          <motion.p 
            className="text-xs text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {description}
          </motion.p>
        )}
        
        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-cyber-blue/5 rounded-lg opacity-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Corner Accent */}
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 bg-neon-green rounded-full"
          animate={{ 
            scale: hovered ? 1.5 : 0,
            opacity: hovered ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </HoverGlow>
  );
}

// Enhanced StatCard with animation presets
export function AnimatedStatCard({ 
  title, 
  value, 
  trend, 
  trendValue = 0,
  icon, 
  description,
  animationPreset = 'fadeInUp',
  delay = 0,
  onClick 
}: InteractiveStatCardProps & { animationPreset?: string }) {
  
  const getAnimationVariants = () => {
    switch(animationPreset) {
      case 'scaleIn':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        };
      case 'slideInLeft':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 }
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 }
        };
    }
  };
  
  return (
    <motion.div
      variants={getAnimationVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <InteractiveStatCard
        title={title}
        value={value}
        trend={trend}
        trendValue={trendValue}
        icon={icon}
        description={description}
        onClick={onClick}
      />
    </motion.div>
  );
}
