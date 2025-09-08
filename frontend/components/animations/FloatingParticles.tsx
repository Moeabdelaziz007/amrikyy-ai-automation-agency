// components/animations/FloatingParticles.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  color: string;
  opacity: number;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  sizeRange?: [number, number];
  speedRange?: [number, number];
  opacityRange?: [number, number];
  className?: string;
}

export default function FloatingParticles({
  count = 20,
  colors = ['bg-neon-green', 'bg-cyber-blue', 'bg-electric-purple', 'bg-warning-orange'],
  sizeRange = [1, 4],
  speedRange = [3, 8],
  opacityRange = [0.2, 0.6],
  className = ''
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        speed: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)] || 'bg-neon-green',
        opacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0]
      });
    }
    
    setParticles(newParticles);
    setIsVisible(true);
  }, [count, colors, sizeRange, speedRange, opacityRange]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.color} rounded-full`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { 
            opacity: [0, particle.opacity, 0.1, particle.opacity],
            scale: [0, 1, 0.8, 1],
            y: [0, -30, -60, -30, 0],
            x: [0, 15, -15, 0]
          } : { opacity: 0, scale: 0 }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Additional floating elements */}
      {[...Array(Math.floor(count / 4))].map((_, i) => (
        <motion.div
          key={`element-${i}`}
          className="absolute w-1 h-1 bg-neon-green rounded-full opacity-40"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 25}%`,
          }}
          animate={isVisible ? {
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1]
          } : { y: 0, opacity: 0.4, scale: 1 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
