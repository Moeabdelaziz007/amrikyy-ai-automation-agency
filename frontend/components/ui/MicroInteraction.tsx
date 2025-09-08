'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'hover' | 'click' | 'focus' | 'load';
  intensity?: 'subtle' | 'medium' | 'strong';
  delay?: number;
  className?: string;
}

export default function MicroInteraction({ 
  children, 
  type = 'hover', 
  intensity = 'medium',
  delay = 0,
  className = '' 
}: MicroInteractionProps) {
  const [isActive, setIsActive] = useState(false);

  const getAnimationProps = () => {
    const baseProps = {
      transition: { duration: 0.2, delay, ease: "easeOut" }
    };

    switch (type) {
      case 'hover':
        return {
          whileHover: intensity === 'subtle' 
            ? { scale: 1.02, y: -2 }
            : intensity === 'medium'
            ? { scale: 1.05, y: -4 }
            : { scale: 1.1, y: -6 },
          whileTap: { scale: 0.98 },
          ...baseProps
        };
      
      case 'click':
        return {
          whileTap: intensity === 'subtle'
            ? { scale: 0.98 }
            : intensity === 'medium'
            ? { scale: 0.95 }
            : { scale: 0.9 },
          ...baseProps
        };
      
      case 'focus':
        return {
          whileFocus: { scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)" },
          ...baseProps
        };
      
      case 'load':
        return {
          initial: { opacity: 0, y: 20, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.5, delay, ease: "easeOut" }
        };
      
      default:
        return baseProps;
    }
  };

  return (
    <motion.div
      className={className}
      {...getAnimationProps()}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {children}
      
      {/* Subtle glow effect for hover */}
      {type === 'hover' && isActive && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'linear-gradient(45deg, rgba(0, 255, 65, 0.1), transparent)',
            filter: 'blur(8px)'
          }}
        />
      )}
    </motion.div>
  );
}

// Specialized micro-interaction components
export function HoverGlow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <MicroInteraction type="hover" intensity="subtle" className={`relative ${className}`}>
      {children}
    </MicroInteraction>
  );
}

export function ClickFeedback({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <MicroInteraction type="click" intensity="medium" className={className}>
      {children}
    </MicroInteraction>
  );
}

export function FocusRing({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <MicroInteraction type="focus" intensity="subtle" className={className}>
      {children}
    </MicroInteraction>
  );
}

export function LoadAnimation({ children, delay = 0, className = '' }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
}) {
  return (
    <MicroInteraction type="load" delay={delay} className={className}>
      {children}
    </MicroInteraction>
  );
}

// Staggered animation container
interface StaggeredContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredContainer({ children, staggerDelay = 0.1, className = '' }: StaggeredContainerProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <LoadAnimation key={index} delay={index * staggerDelay}>
          {child}
        </LoadAnimation>
      ))}
    </div>
  );
}
