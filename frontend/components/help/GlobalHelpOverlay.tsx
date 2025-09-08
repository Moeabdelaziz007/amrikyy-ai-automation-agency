'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Lightbulb,
  BookOpen,
  Zap,
  MousePointer,
  Keyboard,
  Eye,
  Settings,
  Shield,
  Palette,
  Users,
  BarChart3,
  Search,
  Bell
} from 'lucide-react';
import { ClickFeedback, HoverGlow } from '../ui/MicroInteraction';

interface HelpStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'focus' | 'none';
  icon: React.ComponentType<any>;
  category: 'navigation' | 'features' | 'security' | 'themes' | 'agents';
}

interface AnimationPreset {
  name: string;
  description: string;
  variants: {
    initial: any;
    animate: any;
    exit: any;
    hover?: any;
    tap?: any;
  };
  usage: string;
  category: 'entrance' | 'exit' | 'hover' | 'stagger' | 'loading';
}

export default function GlobalHelpOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const helpSteps: HelpStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Amrikyy AI Automation Agency',
      description: 'This is your AI-powered dashboard for managing and running intelligent agents. Let\'s take a quick tour!',
      target: 'body',
      position: 'top',
      action: 'none',
      icon: Lightbulb,
      category: 'navigation'
    },
    {
      id: 'header',
      title: 'Dashboard Header',
      description: 'Here you can see real-time system status, active agents, and quick access to notifications and settings.',
      target: '[data-help="header"]',
      position: 'bottom',
      action: 'hover',
      icon: BarChart3,
      category: 'navigation'
    },
    {
      id: 'theme-toggle',
      title: 'Theme Toggle',
      description: 'Click here to switch between light and dark themes, or access advanced theme settings.',
      target: '[data-help="theme-toggle"]',
      position: 'left',
      action: 'click',
      icon: Palette,
      category: 'themes'
    },
    {
      id: 'security-panel',
      title: 'Security Panel',
      description: 'Toggle the security panel to view RBAC roles, audit logs, and security metrics.',
      target: '[data-help="security-panel"]',
      position: 'top',
      action: 'click',
      icon: Shield,
      category: 'security'
    },
    {
      id: 'agent-cards',
      title: 'AI Agent Cards',
      description: 'Each card represents an AI agent. Hover over capabilities to see detailed explanations.',
      target: '[data-help="agent-card"]',
      position: 'top',
      action: 'hover',
      icon: Users,
      category: 'agents'
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'View comprehensive metrics, performance data, and system health indicators.',
      target: '[data-help="analytics"]',
      position: 'bottom',
      action: 'hover',
      icon: BarChart3,
      category: 'features'
    },
    {
      id: 'search',
      title: 'Global Search',
      description: 'Search for agents, capabilities, or any content across the platform.',
      target: '[data-help="search"]',
      position: 'bottom',
      action: 'focus',
      icon: Search,
      category: 'features'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Stay updated with system alerts, agent status changes, and important updates.',
      target: '[data-help="notifications"]',
      position: 'bottom',
      action: 'click',
      icon: Bell,
      category: 'features'
    }
  ];

  const animationPresets: AnimationPreset[] = [
    {
      name: 'Fade In Up',
      description: 'Smooth entrance animation with upward movement',
      variants: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 }
      },
      usage: 'motion.div variants={preset.variants}',
      category: 'entrance'
    },
    {
      name: 'Scale In',
      description: 'Element scales in from center with bounce effect',
      variants: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
      },
      usage: 'motion.div variants={preset.variants}',
      category: 'entrance'
    },
    {
      name: 'Slide In Left',
      description: 'Element slides in from the left side',
      variants: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 }
      },
      usage: 'motion.div variants={preset.variants}',
      category: 'entrance'
    },
    {
      name: 'Stagger Children',
      description: 'Children elements animate in sequence',
      variants: {
        initial: { opacity: 0 },
        animate: { 
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        },
        exit: { opacity: 0 }
      },
      usage: 'motion.div variants={preset.variants}',
      category: 'stagger'
    },
    {
      name: 'Hover Lift',
      description: 'Element lifts up on hover with shadow',
      variants: {
        initial: { y: 0, boxShadow: '0 0 0px rgba(0,0,0,0)' },
        animate: { y: 0, boxShadow: '0 0 0px rgba(0,0,0,0)' },
        exit: { y: 0, boxShadow: '0 0 0px rgba(0,0,0,0)' },
        hover: { 
          y: -8, 
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      },
      usage: 'motion.div variants={preset.variants} whileHover="hover"',
      category: 'hover'
    },
    {
      name: 'Pulse Loading',
      description: 'Continuous pulse animation for loading states',
      variants: {
        initial: { scale: 1, opacity: 0.7 },
        animate: { 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        },
        exit: { scale: 1, opacity: 0.7 }
      },
      usage: 'motion.div variants={preset.variants}',
      category: 'loading'
    }
  ];

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        setIsOpen(true);
        setShowOverlay(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowOverlay(false);
        setHighlightedElement(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Highlight target element
  useEffect(() => {
    if (showOverlay && currentStep < helpSteps.length) {
      const step = helpSteps[currentStep];
      if (step) {
        const element = document.querySelector(step.target) as HTMLElement;
        
        if (element) {
          setHighlightedElement(element);
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentStep, showOverlay]);

  const nextStep = () => {
    if (currentStep < helpSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startTour = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    setShowOverlay(true);
  };

  const stopTour = () => {
    setIsPlaying(false);
    setShowOverlay(false);
    setHighlightedElement(null);
  };

  const resetTour = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setShowOverlay(false);
    setHighlightedElement(null);
  };

  const currentStepData = helpSteps[currentStep];

  return (
    <>
      {/* Help Button */}
      <ClickFeedback>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-neon-green to-cyber-blue rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center group"
        >
          <HelpCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </ClickFeedback>

      {/* Help Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-neon-green/30 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-carbon-black to-medium-gray p-6 border-b border-neon-green/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Help & Onboarding</h2>
                      <p className="text-sm text-gray-400">Press CTRL+H anytime for quick help</p>
                    </div>
                  </div>
                  <ClickFeedback>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-neon-green/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-neon-green" />
                    </button>
                  </ClickFeedback>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Onboarding Tour */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Play className="w-5 h-5 text-neon-green mr-2" />
                      Interactive Tour
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Take a guided tour of the dashboard features and learn how to use each component.
                    </p>
                    
                    <div className="flex space-x-2">
                      <ClickFeedback>
                        <button
                          onClick={startTour}
                          disabled={isPlaying}
                          className="flex items-center space-x-2 px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors disabled:opacity-50"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start Tour</span>
                        </button>
                      </ClickFeedback>
                      
                      <ClickFeedback>
                        <button
                          onClick={stopTour}
                          disabled={!isPlaying}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Stop</span>
                        </button>
                      </ClickFeedback>
                      
                      <ClickFeedback>
                        <button
                          onClick={resetTour}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Reset</span>
                        </button>
                      </ClickFeedback>
                    </div>

                    {/* Tour Progress */}
                    {isPlaying && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Step {currentStep + 1} of {helpSteps.length}</span>
                          <span>{Math.round(((currentStep + 1) / helpSteps.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-neon-green to-cyber-blue h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / helpSteps.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Animation Presets */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Zap className="w-5 h-5 text-neon-green mr-2" />
                      Animation Presets
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Reusable animation presets for consistent UI interactions across components.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                      {animationPresets.map((preset) => (
                        <HoverGlow key={preset.name}>
                          <div className="p-3 bg-gradient-to-r from-carbon-black to-medium-gray rounded-lg border border-neon-green/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-white">{preset.name}</h4>
                              <span className="text-xs px-2 py-1 bg-neon-green/20 text-neon-green rounded-full">
                                {preset.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{preset.description}</p>
                            <code className="text-xs text-cyber-blue bg-carbon-black px-2 py-1 rounded">
                              {preset.usage}
                            </code>
                          </div>
                        </HoverGlow>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Help */}
                <div className="mt-6 pt-6 border-t border-neon-green/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 text-neon-green mr-2" />
                    Quick Help
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: Keyboard, text: 'CTRL+H - Open Help' },
                      { icon: MousePointer, text: 'Hover - See Tooltips' },
                      { icon: Eye, text: 'Click - Interact' },
                      { icon: Settings, text: 'Settings - Customize' }
                    ].map((item, index) => (
                      <HoverGlow key={index}>
                        <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-carbon-black to-medium-gray rounded-lg border border-neon-green/20">
                          <item.icon className="w-4 h-4 text-neon-green" />
                          <span className="text-sm text-gray-300">{item.text}</span>
                        </div>
                      </HoverGlow>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour Overlay */}
      <AnimatePresence>
        {showOverlay && currentStepData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
          >
            {/* Spotlight */}
            {highlightedElement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60"
                style={{
                  clipPath: `polygon(0% 0%, 0% 100%, ${highlightedElement.offsetLeft}px 100%, ${highlightedElement.offsetLeft}px ${highlightedElement.offsetTop}px, ${highlightedElement.offsetLeft + highlightedElement.offsetWidth}px ${highlightedElement.offsetTop}px, ${highlightedElement.offsetLeft + highlightedElement.offsetWidth}px ${highlightedElement.offsetTop + highlightedElement.offsetHeight}px, ${highlightedElement.offsetLeft}px ${highlightedElement.offsetTop + highlightedElement.offsetHeight}px, ${highlightedElement.offsetLeft}px 100%, 100% 100%, 100% 0%)`
                }}
              />
            )}

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bg-card border border-neon-green/30 rounded-lg shadow-2xl p-4 max-w-sm z-50 pointer-events-auto"
              style={{
                top: highlightedElement ? highlightedElement.offsetTop - 20 : '50%',
                left: highlightedElement ? highlightedElement.offsetLeft + highlightedElement.offsetWidth + 20 : '50%',
                transform: highlightedElement ? 'none' : 'translate(-50%, -50%)'
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center flex-shrink-0">
                  <currentStepData.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-1">{currentStepData.title}</h4>
                  <p className="text-sm text-gray-300 mb-3">{currentStepData.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <ClickFeedback>
                        <button
                          onClick={prevStep}
                          disabled={currentStep === 0}
                          className="p-1 bg-neon-green/20 text-neon-green rounded hover:bg-neon-green/30 transition-colors disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </ClickFeedback>
                      <ClickFeedback>
                        <button
                          onClick={nextStep}
                          disabled={currentStep === helpSteps.length - 1}
                          className="p-1 bg-neon-green/20 text-neon-green rounded hover:bg-neon-green/30 transition-colors disabled:opacity-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </ClickFeedback>
                    </div>
                    <ClickFeedback>
                      <button
                        onClick={stopTour}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Skip Tour
                      </button>
                    </ClickFeedback>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Export animation presets for easy reuse
export const animationPresets = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.4, ease: 'backOut' }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  staggerChildren: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  },
  hoverLift: {
    initial: { y: 0, boxShadow: '0 0 0px rgba(0,0,0,0)' },
    animate: { y: 0, boxShadow: '0 0 0px rgba(0,0,0,0)' },
    hover: { 
      y: -8, 
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      transition: { duration: 0.2 }
    }
  },
  pulseLoading: {
    initial: { scale: 1, opacity: 0.7 },
    animate: { 
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: { 
        duration: 1.5, 
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
};
