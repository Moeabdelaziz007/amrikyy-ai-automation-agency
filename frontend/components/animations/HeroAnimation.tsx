// components/animations/HeroAnimation.tsx
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
}

export default function HeroAnimation() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = [];
    const colors = ['bg-neon-green', 'bg-cyber-blue', 'bg-electric-purple', 'bg-warning-orange'];
    
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2, // 2-6px
        speed: Math.random() * 3 + 2, // 2-5s
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)] || 'bg-neon-green'
      });
    }
    
    setParticles(newParticles);
    setIsVisible(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.color} rounded-full opacity-30`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { 
            opacity: [0, 0.3, 0.1, 0.3],
            scale: [0, 1, 0.8, 1],
            y: [0, -20, -40, -20, 0],
            x: [0, 10, -10, 0]
          } : { opacity: 0, scale: 0 }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ff41" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Animated Lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-20"
          style={{
            top: `${20 + i * 20}%`,
            left: '0%',
            width: '100%',
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={isVisible ? { 
            x: ['0%', '100%', '0%'],
            opacity: [0, 0.2, 0]
          } : { x: '-100%', opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Floating Orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, rgba(0, 255, 65, 0.3) 0%, transparent 70%)`,
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={isVisible ? {
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 360]
          } : { scale: 1, opacity: 0.1, rotate: 0 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Pulsing Dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 bg-neon-green rounded-full opacity-40"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={isVisible ? {
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4]
          } : { scale: 1, opacity: 0.4 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Animated Text Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-neon-green/10 via-cyber-blue/10 to-electric-purple/10 blur-3xl animate-pulse"></div>
        </div>
      </motion.div>
      
      {/* Scanning Lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`scan-${i}`}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-30"
          style={{
            top: `${25 + i * 25}%`,
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={isVisible ? { 
            x: ['0%', '100%'],
            opacity: [0, 0.3, 0]
          } : { x: '-100%', opacity: 0 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
