'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string | undefined;
}

export default function Tooltip({ 
  children, 
  content, 
  position = 'top', 
  delay = 300,
  className = '' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-neon-green';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-neon-green';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-neon-green';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-neon-green';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-neon-green';
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${getPositionClasses()}`}
            initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="bg-carbon-black border border-neon-green/30 rounded-lg px-3 py-2 text-sm text-white shadow-lg backdrop-blur-sm max-w-xs">
              <div className="relative">
                {content}
                {/* Arrow */}
                <div className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()}`}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Capability-specific tooltip with predefined explanations
interface CapabilityTooltipProps {
  children: React.ReactNode;
  capability: string;
  className?: string;
}

const capabilityExplanations: Record<string, string> = {
  'Blog Writing': 'AI-powered content creation for blogs, articles, and long-form content with SEO optimization',
  'Social Media': 'Automated social media content generation and scheduling across multiple platforms',
  'SEO Optimization': 'Search engine optimization strategies and keyword research for better visibility',
  'Content Strategy': 'Strategic content planning and editorial calendar management',
  'Code Generation': 'Automated code creation in multiple programming languages',
  'Code Review': 'Automated code analysis and quality assessment with suggestions',
  'Bug Fixing': 'Intelligent bug detection and automated fixing solutions',
  'Documentation': 'Technical documentation generation and maintenance',
  'Data Mining': 'Extraction and processing of data from various sources',
  'Analysis': 'Advanced data analysis and insights generation',
  'UI/UX': 'User interface and experience design with modern design principles',
  'Graphics': 'Visual design and graphic creation for digital assets',
  'ETL': 'Extract, Transform, Load processes for data pipeline management',
  'ML': 'Machine learning model development and training',
  'Quantum-ML': 'Quantum computing enhanced machine learning algorithms',
  'Optimization': 'Performance optimization and efficiency improvements',
  'Research': 'Comprehensive research and information gathering',
  'Writing': 'Professional writing and content creation services',
  'Editing': 'Content editing and proofreading with style improvements',
  'Python': 'Python development and scripting capabilities',
  'JavaScript': 'JavaScript and modern web development technologies',
  'React': 'React.js development and component architecture',
  'Node.js': 'Server-side JavaScript development with Node.js',
  'Database': 'Database design, management, and optimization',
  'API': 'RESTful API development and integration services',
  'Testing': 'Automated testing and quality assurance processes',
  'Deployment': 'Application deployment and DevOps automation',
  'Security': 'Security analysis and vulnerability assessment',
  'Performance': 'Performance monitoring and optimization strategies',
  'Scalability': 'Scalable architecture design and implementation'
};

export function CapabilityTooltip({ children, capability, className }: CapabilityTooltipProps) {
  const explanation = capabilityExplanations[capability] || `${capability} capability for enhanced productivity and automation`;
  
  return (
    <Tooltip 
      content={explanation} 
      position="top" 
      delay={200}
      className={className}
    >
      {children}
    </Tooltip>
  );
}
