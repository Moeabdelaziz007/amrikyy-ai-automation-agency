'use client';

import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  animated?: boolean;
}

export default function AmrikyyLogo({ 
  size = 'md', 
  variant = 'full', 
  className = '',
  animated = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const NeuralNetworkIcon = () => (
    <div className="relative">
      {/* Neural Network Nodes */}
      <div className="relative w-full h-full">
        {/* Node 1 */}
        <motion.div
          className="absolute top-1 left-1 w-3 h-3 bg-neon-green rounded-full"
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Node 2 */}
        <motion.div
          className="absolute top-1 right-1 w-3 h-3 bg-neon-green rounded-full"
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Node 3 */}
        <motion.div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-neon-green rounded-full"
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
          {/* Line 1-2 */}
          <motion.line
            x1="12"
            y1="12"
            x2="36"
            y2="12"
            stroke="#00FF41"
            strokeWidth="1"
            opacity="0.6"
            animate={animated ? {
              pathLength: [0, 1, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Line 1-3 */}
          <motion.line
            x1="12"
            y1="12"
            x2="24"
            y2="36"
            stroke="#00FF41"
            strokeWidth="1"
            opacity="0.6"
            animate={animated ? {
              pathLength: [0, 1, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Line 2-3 */}
          <motion.line
            x1="36"
            y1="12"
            x2="24"
            y2="36"
            stroke="#00FF41"
            strokeWidth="1"
            opacity="0.6"
            animate={animated ? {
              pathLength: [0, 1, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </svg>
      </div>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <NeuralNetworkIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center ${className}`}>
        <span className={`font-bold bg-gradient-to-r from-neon-green to-cyber-blue bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Amrikyy AI
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={sizeClasses[size]}>
        <NeuralNetworkIcon />
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={`font-bold bg-gradient-to-r from-neon-green to-cyber-blue bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Amrikyy AI
        </span>
        <span className={`text-gray-400 text-xs ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm'}`}>
          Agency
        </span>
      </div>
    </div>
  );
}

// Alternative Logo Variants
export function AmrikyyLogoModern({ size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'} bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center`}>
        <Brain className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-white ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
          Amrikyy AI
        </span>
        <span className={`text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          Agency
        </span>
      </div>
    </div>
  );
}

export function AmrikyyLogoMinimal({ size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'} bg-neon-green rounded-full flex items-center justify-center`}>
        <Zap className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} text-black`} />
      </div>
      <span className={`font-bold text-neon-green ${size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-xl'}`}>
        Amrikyy AI
      </span>
    </div>
  );
}

// Logo with Tagline
export function AmrikyyLogoWithTagline({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <AmrikyyLogo size="lg" />
      <p className="text-gray-400 text-sm text-center max-w-xs">
        Empowering businesses with intelligent AI solutions
      </p>
    </div>
  );
}
