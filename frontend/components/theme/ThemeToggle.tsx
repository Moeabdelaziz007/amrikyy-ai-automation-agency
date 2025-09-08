'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Check,
  ChevronDown,
  Zap,
  Droplets,
  Sparkles
} from 'lucide-react';
import { ClickFeedback } from '../ui/MicroInteraction';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'axon-quantum' | 'bitcoin-space' | 'cyberpunk' | 'minimal';

interface ThemeConfig {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

const themeConfigs: Record<ColorScheme, ThemeConfig> = {
  'axon-quantum': {
    name: 'Axon Quantum',
    description: 'Futuristic quantum theme with neon accents',
    icon: Zap,
    colors: {
      primary: '#00ff41',
      secondary: '#0066ff',
      accent: '#8b5cf6',
      background: '#0a0a0a'
    }
  },
  'bitcoin-space': {
    name: 'Bitcoin Space',
    description: 'Cryptocurrency-inspired dark theme',
    icon: Droplets,
    colors: {
      primary: '#f7931a',
      secondary: '#00ff41',
      accent: '#8b5cf6',
      background: '#0a0a0a'
    }
  },
  'cyberpunk': {
    name: 'Cyberpunk',
    description: 'High-tech neon cyberpunk aesthetic',
    icon: Sparkles,
    colors: {
      primary: '#ff0080',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#000000'
    }
  },
  'minimal': {
    name: 'Minimal',
    description: 'Clean and minimal design',
    icon: Monitor,
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff'
    }
  }
};

export default function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');
  const [currentColorScheme, setCurrentColorScheme] = useState<ColorScheme>('axon-quantum');
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    if (savedColorScheme) {
      setCurrentColorScheme(savedColorScheme);
    }
    
    applyTheme(savedTheme || 'dark', savedColorScheme || 'axon-quantum');
  }, []);

  const applyTheme = (theme: Theme, colorScheme: ColorScheme) => {
    const root = document.documentElement;
    const config = themeConfigs[colorScheme];
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'axon-quantum', 'bitcoin-space', 'cyberpunk', 'minimal');
    
    // Apply new theme
    root.classList.add(theme);
    root.classList.add(colorScheme);
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-background', config.colors.background);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', config.colors.background);
    }
  };

  const handleThemeChange = (theme: Theme) => {
    setIsAnimating(true);
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme with animation
    setTimeout(() => {
      applyTheme(theme, currentColorScheme);
      setIsAnimating(false);
    }, 150);
  };

  const handleColorSchemeChange = (colorScheme: ColorScheme) => {
    setIsAnimating(true);
    setCurrentColorScheme(colorScheme);
    localStorage.setItem('colorScheme', colorScheme);
    
    // Apply color scheme with animation
    setTimeout(() => {
      applyTheme(currentTheme, colorScheme);
      setIsAnimating(false);
    }, 150);
  };

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Moon;
    }
  };

  const getThemeLabel = (theme: Theme) => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'Dark';
    }
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <ClickFeedback>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg border border-neon-green/30 hover:bg-neon-green/30 transition-all duration-200"
        >
          <motion.div
            animate={{ rotate: isAnimating ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {React.createElement(getThemeIcon(currentTheme), { className: "w-4 h-4" })}
          </motion.div>
          <span className="text-sm font-medium">{getThemeLabel(currentTheme)}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      </ClickFeedback>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-card border border-neon-green/20 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-neon-green/20">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-neon-green" />
                <h3 className="text-lg font-semibold text-white">Theme Settings</h3>
              </div>
              <p className="text-sm text-gray-400 mt-1">Customize your dashboard appearance</p>
            </div>

            {/* Theme Mode Selection */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Theme Mode</h4>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
                  <ClickFeedback key={theme}>
                    <button
                      onClick={() => handleThemeChange(theme)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                        currentTheme === theme
                          ? 'border-neon-green bg-neon-green/20 text-neon-green'
                          : 'border-neon-green/30 hover:border-neon-green/50 text-gray-400 hover:text-white'
                      }`}
                    >
                      {React.createElement(getThemeIcon(theme), { className: "w-5 h-5 mb-1" })}
                      <span className="text-xs font-medium">{getThemeLabel(theme)}</span>
                      {currentTheme === theme && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1"
                        >
                          <Check className="w-3 h-3 text-neon-green" />
                        </motion.div>
                      )}
                    </button>
                  </ClickFeedback>
                ))}
              </div>
            </div>

            {/* Color Scheme Selection */}
            <div className="p-4 border-t border-neon-green/20">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Color Scheme</h4>
              <div className="space-y-2">
                {Object.entries(themeConfigs).map(([key, config]) => (
                  <ClickFeedback key={key}>
                    <button
                      onClick={() => handleColorSchemeChange(key as ColorScheme)}
                      className={`w-full flex items-center p-3 rounded-lg border transition-all duration-200 ${
                        currentColorScheme === key
                          ? 'border-neon-green bg-neon-green/20'
                          : 'border-neon-green/30 hover:border-neon-green/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: config.colors.primary + '20' }}>
                          <config.icon className="w-4 h-4" style={{ color: config.colors.primary }} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-white">{config.name}</div>
                          <div className="text-xs text-gray-400">{config.description}</div>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.primary }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.secondary }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.colors.accent }} />
                        </div>
                        {currentColorScheme === key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-4 h-4 text-neon-green" />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  </ClickFeedback>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 border-t border-neon-green/20 bg-gradient-to-r from-carbon-black to-medium-gray">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Preview</h4>
              <div className="flex space-x-2">
                <div className="flex-1 h-8 rounded" style={{ backgroundColor: themeConfigs[currentColorScheme].colors.primary }} />
                <div className="flex-1 h-8 rounded" style={{ backgroundColor: themeConfigs[currentColorScheme].colors.secondary }} />
                <div className="flex-1 h-8 rounded" style={{ backgroundColor: themeConfigs[currentColorScheme].colors.accent }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Animation Overlay */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border border-neon-green/30 rounded-lg p-6 flex items-center space-x-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full"
              />
              <span className="text-white font-medium">Applying theme...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick theme toggle for header
export function QuickThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  return (
    <ClickFeedback>
      <button
        onClick={toggleTheme}
        className="p-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors"
      >
        <motion.div
          animate={{ rotate: currentTheme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {currentTheme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </motion.div>
      </button>
    </ClickFeedback>
  );
}
