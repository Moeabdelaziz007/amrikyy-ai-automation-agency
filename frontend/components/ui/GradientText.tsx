// components/ui/GradientText.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'cyber' | 'electric' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  className?: string;
  animate?: boolean;
  delay?: number;
}

export default function GradientText({
  children,
  variant = 'primary',
  size = 'md',
  weight = 'bold',
  className = '',
  animate = true,
  delay = 0
}: GradientTextProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-neon-green via-cyber-blue to-transparent bg-clip-text text-transparent';
      case 'secondary':
        return 'bg-gradient-to-r from-electric-purple via-deep-purple to-transparent bg-clip-text text-transparent';
      case 'cyber':
        return 'bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple bg-clip-text text-transparent';
      case 'electric':
        return 'bg-gradient-to-r from-electric-purple via-neon-green to-cyber-blue bg-clip-text text-transparent';
      case 'warning':
        return 'bg-gradient-to-r from-warning-orange via-neon-green to-cyber-blue bg-clip-text text-transparent';
      default:
        return 'bg-gradient-to-r from-neon-green via-cyber-blue to-transparent bg-clip-text text-transparent';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      case '3xl': return 'text-3xl';
      case '4xl': return 'text-4xl';
      case '5xl': return 'text-5xl';
      default: return 'text-base';
    }
  };

  const getWeightClasses = () => {
    switch (weight) {
      case 'normal': return 'font-normal';
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
      case 'extrabold': return 'font-extrabold';
      default: return 'font-bold';
    }
  };

  const baseClasses = `${getVariantClasses()} ${getSizeClasses()} ${getWeightClasses()} ${className}`;

  if (animate) {
    return (
      <motion.span
        className={baseClasses}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay }}
        whileHover={{ scale: 1.05 }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={baseClasses}>
      {children}
    </span>
  );
}
