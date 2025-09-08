'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Particle System Component
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  opacity?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 50,
  colors = ['#00f0ff', '#8b5cf6', '#06b6d4', '#3b82f6'],
  speed = 1,
  size = 2,
  opacity = 0.6
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * size + 1,
          opacity: Math.random() * opacity + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)] || '#00f0ff',
          life: Math.random() * 100,
          maxLife: 100
        });
      }
    };

    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update life
        particle.life -= 0.5;
        if (particle.life <= 0) {
          particle.life = particle.maxLife;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, colors, speed, size, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

// Neon Glow Effect Component
interface NeonGlowProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const NeonGlow: React.FC<NeonGlowProps> = ({ 
  children, 
  color = 'blue', 
  intensity = 'medium',
  className = ''
}) => {
  const getGlowColor = (color: string) => {
    switch (color) {
      case 'blue': return 'rgba(59, 130, 246, 0.5)';
      case 'green': return 'rgba(34, 197, 94, 0.5)';
      case 'purple': return 'rgba(147, 51, 234, 0.5)';
      case 'orange': return 'rgba(251, 146, 60, 0.5)';
      case 'red': return 'rgba(239, 68, 68, 0.5)';
      default: return 'rgba(59, 130, 246, 0.5)';
    }
  };

  const getIntensity = (intensity: string) => {
    switch (intensity) {
      case 'low': return '0 0 10px';
      case 'medium': return '0 0 20px';
      case 'high': return '0 0 30px';
      default: return '0 0 20px';
    }
  };

  return (
    <motion.div
      className={className}
      style={{
        boxShadow: `${getIntensity(intensity)} ${getGlowColor(color)}`
      }}
      animate={{
        boxShadow: [
          `${getIntensity(intensity)} ${getGlowColor(color)}`,
          `${getIntensity(intensity)} ${getGlowColor(color)}33`,
          `${getIntensity(intensity)} ${getGlowColor(color)}`
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

// Cyberpunk Background Component
interface CyberpunkBackgroundProps {
  children: React.ReactNode;
  showParticles?: boolean;
  particleCount?: number;
}

const CyberpunkBackground: React.FC<CyberpunkBackgroundProps> = ({ 
  children, 
  showParticles = true,
  particleCount = 30
}) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Particle System */}
      {showParticles && (
        <ParticleSystem
          particleCount={particleCount}
          colors={['#00f0ff', '#8b5cf6', '#06b6d4', '#3b82f6', '#f59e0b']}
          speed={0.5}
          size={1.5}
          opacity={0.4}
        />
      )}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-blue-400/20" />
          ))}
        </div>
        <div className="grid grid-rows-8 h-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border-b border-blue-400/20" />
          ))}
        </div>
      </div>

      {/* Neon Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            style={{
              top: `${20 + i * 20}%`,
              left: 0,
              right: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Neon Border Component
interface NeonBorderProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  thickness?: 'thin' | 'medium' | 'thick';
  className?: string;
}

const NeonBorder: React.FC<NeonBorderProps> = ({ 
  children, 
  color = 'blue', 
  thickness = 'medium',
  className = ''
}) => {
  const getBorderColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-400';
      case 'green': return 'border-green-400';
      case 'purple': return 'border-purple-400';
      case 'orange': return 'border-orange-400';
      case 'red': return 'border-red-400';
      default: return 'border-blue-400';
    }
  };

  const getThickness = (thickness: string) => {
    switch (thickness) {
      case 'thin': return 'border';
      case 'medium': return 'border-2';
      case 'thick': return 'border-4';
      default: return 'border-2';
    }
  };

  return (
    <motion.div
      className={`${getBorderColor(color)} ${getThickness(thickness)} ${className}`}
      animate={{
        boxShadow: [
          `0 0 10px ${color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 
            color === 'green' ? 'rgba(34, 197, 94, 0.5)' :
            color === 'purple' ? 'rgba(147, 51, 234, 0.5)' :
            color === 'orange' ? 'rgba(251, 146, 60, 0.5)' :
            'rgba(239, 68, 68, 0.5)'}`,
          `0 0 20px ${color === 'blue' ? 'rgba(59, 130, 246, 0.8)' : 
            color === 'green' ? 'rgba(34, 197, 94, 0.8)' :
            color === 'purple' ? 'rgba(147, 51, 234, 0.8)' :
            color === 'orange' ? 'rgba(251, 146, 60, 0.8)' :
            'rgba(239, 68, 68, 0.8)'}`,
          `0 0 10px ${color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 
            color === 'green' ? 'rgba(34, 197, 94, 0.5)' :
            color === 'purple' ? 'rgba(147, 51, 234, 0.5)' :
            color === 'orange' ? 'rgba(251, 146, 60, 0.5)' :
            'rgba(239, 68, 68, 0.5)'}`
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Backdrop Blur Component
interface EnhancedBackdropBlurProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const EnhancedBackdropBlur: React.FC<EnhancedBackdropBlurProps> = ({ 
  children, 
  intensity = 'medium',
  className = ''
}) => {
  const getIntensity = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'backdrop-blur-sm';
      case 'medium': return 'backdrop-blur-md';
      case 'high': return 'backdrop-blur-lg';
      default: return 'backdrop-blur-md';
    }
  };

  return (
    <div className={`${getIntensity(intensity)} ${className}`}>
      {children}
    </div>
  );
};

export { 
  ParticleSystem, 
  NeonGlow, 
  CyberpunkBackground, 
  NeonBorder, 
  EnhancedBackdropBlur 
};
