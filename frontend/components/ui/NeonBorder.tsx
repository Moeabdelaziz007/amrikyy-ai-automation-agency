// components/ui/NeonBorder.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface NeonBorderProps {
  children: ReactNode;
  variant?: 'neon-green' | 'cyber-blue' | 'electric-purple' | 'warning-orange' | 'danger-red';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function NeonBorder({
  children,
  variant = 'neon-green',
  intensity = 'medium',
  animated = true,
  className = '',
  onClick
}: NeonBorderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'neon-green':
        return {
          border: 'border-neon-green',
          shadow: 'shadow-neon',
          glow: 'shadow-neon-lg',
          bg: 'bg-neon-green/5'
        };
      case 'cyber-blue':
        return {
          border: 'border-cyber-blue',
          shadow: 'shadow-blue',
          glow: 'shadow-blue',
          bg: 'bg-cyber-blue/5'
        };
      case 'electric-purple':
        return {
          border: 'border-electric-purple',
          shadow: 'shadow-purple',
          glow: 'shadow-purple',
          bg: 'bg-electric-purple/5'
        };
      case 'warning-orange':
        return {
          border: 'border-warning-orange',
          shadow: 'shadow-orange',
          glow: 'shadow-orange',
          bg: 'bg-warning-orange/5'
        };
      case 'danger-red':
        return {
          border: 'border-danger-red',
          shadow: 'shadow-red',
          glow: 'shadow-red',
          bg: 'bg-danger-red/5'
        };
      default:
        return {
          border: 'border-neon-green',
          shadow: 'shadow-neon',
          glow: 'shadow-neon-lg',
          bg: 'bg-neon-green/5'
        };
    }
  };

  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return 'opacity-30';
      case 'medium':
        return 'opacity-50';
      case 'high':
        return 'opacity-70';
      default:
        return 'opacity-50';
    }
  };

  const variantClasses = getVariantClasses();
  const intensityClasses = getIntensityClasses();

  const baseClasses = `${variantClasses.border} ${variantClasses.shadow} ${intensityClasses} ${className}`;

  if (animated) {
    return (
      <motion.div
        className={`relative ${baseClasses} transition-all duration-300 cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Glow */}
        <div 
          className={`absolute inset-0 ${variantClasses.bg} rounded-lg transition-opacity duration-300`}
          style={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Animated Border */}
        <motion.div
          className={`absolute inset-0 ${variantClasses.border} rounded-lg`}
          animate={isHovered ? {
            boxShadow: [
              `0 0 20px rgba(0, 255, 65, 0.3)`,
              `0 0 40px rgba(0, 255, 65, 0.6)`,
              `0 0 20px rgba(0, 255, 65, 0.3)`
            ]
          } : {
            boxShadow: `0 0 20px rgba(0, 255, 65, 0.3)`
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    );
  }

  return (
    <div 
      className={`relative ${baseClasses} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 ${variantClasses.bg} rounded-lg transition-opacity duration-300`}
        style={{ opacity: isHovered ? 1 : 0 }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
