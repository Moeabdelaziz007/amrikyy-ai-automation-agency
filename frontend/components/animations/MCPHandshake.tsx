'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MCPHandshakeProps {
  onComplete: () => void;
}

const MCPHandshake: React.FC<MCPHandshakeProps> = ({ onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const terminalLines = [
    '> Initializing Quantum Brain Interface...',
    '> Establishing secure connection...',
    '> Handshake protocol activated...',
    '> MCP (Model Context Protocol) engaged...',
    '> Neural pathways synchronized...',
    '> Connection established successfully!',
    '> Welcome to the Quantum Realm...'
  ];

  useEffect(() => {
    const typeText = (text: string, callback: () => void) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setCurrentText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(callback, 500);
        }
      }, 50);
    };

    const startTyping = () => {
      if (currentLine < terminalLines.length) {
        const line = terminalLines[currentLine];
        if (line) {
          typeText(line, () => {
            setCurrentLine(prev => prev + 1);
            setCurrentText('');
          });
        }
      } else {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    };

    const timer = setTimeout(startTyping, 1000);
    return () => clearTimeout(timer);
  }, [currentLine, terminalLines, onComplete]);

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const timer = setTimeout(() => {
        const typeText = (text: string, callback: () => void) => {
          let index = 0;
          const interval = setInterval(() => {
            if (index < text.length) {
              setCurrentText(text.slice(0, index + 1));
              index++;
            } else {
              clearInterval(interval);
              setTimeout(callback, 500);
            }
          }, 50);
        };

        const line = terminalLines[currentLine];
        if (line) {
          typeText(line, () => {
            setCurrentLine(prev => prev + 1);
            setCurrentText('');
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentLine, terminalLines]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`grid-h-${i}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.1, scaleX: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="absolute h-px w-full bg-cyan-400"
              style={{ top: `${i * 5}%` }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`grid-v-${i}`}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.1, scaleY: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="absolute w-px h-full bg-cyan-400"
              style={{ left: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Central Geometric Shape */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: isComplete ? 1.2 : 1, 
              rotate: 360,
              opacity: isComplete ? 0.3 : 1
            }}
            transition={{ 
              scale: { duration: 0.5 },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              opacity: { duration: 1 }
            }}
            className="relative"
          >
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-2 border-cyan-400 rounded-full"
            />
            
            {/* Inner Hexagon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 w-24 h-24 border-2 border-cyan-300 rounded-full"
            />
            
            {/* Center Dot */}
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-4 h-4 bg-cyan-400 rounded-full m-auto"
            />
          </motion.div>
        </div>

        {/* Terminal Text Area */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-black/60 border border-cyan-400/30 rounded-lg p-6 font-mono text-sm"
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cyan-400/20">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-cyan-400 text-xs">Quantum Brain Terminal</span>
            </div>

            {/* Terminal Content */}
            <div className="space-y-1">
              {terminalLines.slice(0, currentLine).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-cyan-300"
                >
                  {line}
                </motion.div>
              ))}
              
              {/* Current Line Being Typed */}
              {currentLine < terminalLines.length && (
                <div className="text-cyan-300 flex items-center">
                  <span>{currentText}</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1 text-cyan-400"
                  >
                    |
                  </motion.span>
                </div>
              )}

              {/* Success Message */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-green-400 font-bold mt-4"
                >
                  ✓ Connection established! Welcome to the Quantum Realm.
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating Particles */}
        {typeof window !== 'undefined' && Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ 
              opacity: 0, 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080) 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default MCPHandshake;
