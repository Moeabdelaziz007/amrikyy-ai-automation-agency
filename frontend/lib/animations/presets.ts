'use client';

import { Variants } from 'framer-motion';

export interface AnimationPreset {
  name: string;
  description: string;
  variants: Variants;
  transition?: any;
  usage: string;
  category: 'entrance' | 'exit' | 'hover' | 'stagger' | 'loading' | 'gesture';
  tags: string[];
}

export const animationPresets: Record<string, AnimationPreset> = {
  // Entrance Animations
  fadeInUp: {
    name: 'Fade In Up',
    description: 'Smooth entrance animation with upward movement',
    variants: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 }
    },
    transition: { duration: 0.5, ease: 'easeOut' },
    usage: 'motion.div variants={animationPresets.fadeInUp.variants}',
    category: 'entrance',
    tags: ['smooth', 'upward', 'fade']
  },

  scaleIn: {
    name: 'Scale In',
    description: 'Element scales in from center with bounce effect',
    variants: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    transition: { duration: 0.4, ease: 'backOut' },
    usage: 'motion.div variants={animationPresets.scaleIn.variants}',
    category: 'entrance',
    tags: ['scale', 'bounce', 'center']
  },

  slideInLeft: {
    name: 'Slide In Left',
    description: 'Element slides in from the left side',
    variants: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 }
    },
    transition: { duration: 0.5, ease: 'easeOut' },
    usage: 'motion.div variants={animationPresets.slideInLeft.variants}',
    category: 'entrance',
    tags: ['slide', 'left', 'horizontal']
  },

  slideInRight: {
    name: 'Slide In Right',
    description: 'Element slides in from the right side',
    variants: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    },
    transition: { duration: 0.5, ease: 'easeOut' },
    usage: 'motion.div variants={animationPresets.slideInRight.variants}',
    category: 'entrance',
    tags: ['slide', 'right', 'horizontal']
  },

  rotateIn: {
    name: 'Rotate In',
    description: 'Element rotates in with scale effect',
    variants: {
      initial: { opacity: 0, rotate: -180, scale: 0.5 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: 180, scale: 0.5 }
    },
    transition: { duration: 0.6, ease: 'easeOut' },
    usage: 'motion.div variants={animationPresets.rotateIn.variants}',
    category: 'entrance',
    tags: ['rotate', 'scale', 'dramatic']
  },

  // Hover Animations
  hoverLift: {
    name: 'Hover Lift',
    description: 'Element lifts up on hover with shadow',
    variants: {
      initial: { y: 0, boxShadow: '0 0 0px rgba(0,0,0,0)' },
      animate: { y: 0, boxShadow: '0 0 0px rgba(0,0,0,0)' },
      hover: { 
        y: -8, 
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        transition: { duration: 0.2 }
      }
    },
    transition: { duration: 0.2 },
    usage: 'motion.div variants={animationPresets.hoverLift.variants} whileHover="hover"',
    category: 'hover',
    tags: ['lift', 'shadow', 'interactive']
  },

  hoverScale: {
    name: 'Hover Scale',
    description: 'Element scales up slightly on hover',
    variants: {
      initial: { scale: 1 },
      animate: { scale: 1 },
      hover: { 
        scale: 1.05,
        transition: { duration: 0.2 }
      }
    },
    transition: { duration: 0.2 },
    usage: 'motion.div variants={animationPresets.hoverScale.variants} whileHover="hover"',
    category: 'hover',
    tags: ['scale', 'subtle', 'interactive']
  },

  hoverGlow: {
    name: 'Hover Glow',
    description: 'Element glows on hover with color change',
    variants: {
      initial: { 
        boxShadow: '0 0 0px rgba(0, 255, 65, 0)',
        borderColor: 'rgba(0, 255, 65, 0.3)'
      },
      animate: { 
        boxShadow: '0 0 0px rgba(0, 255, 65, 0)',
        borderColor: 'rgba(0, 255, 65, 0.3)'
      },
      hover: { 
        boxShadow: '0 0 20px rgba(0, 255, 65, 0.6)',
        borderColor: 'rgba(0, 255, 65, 0.8)',
        transition: { duration: 0.3 }
      }
    },
    transition: { duration: 0.3 },
    usage: 'motion.div variants={animationPresets.hoverGlow.variants} whileHover="hover"',
    category: 'hover',
    tags: ['glow', 'neon', 'color']
  },

  // Stagger Animations
  staggerChildren: {
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
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    usage: 'motion.div variants={animationPresets.staggerChildren.variants}',
    category: 'stagger',
    tags: ['sequence', 'children', 'timing']
  },

  staggerFade: {
    name: 'Stagger Fade',
    description: 'Children fade in with staggered timing',
    variants: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.1
        }
      },
      exit: { opacity: 0, y: -20 }
    },
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    usage: 'motion.div variants={animationPresets.staggerFade.variants}',
    category: 'stagger',
    tags: ['fade', 'stagger', 'vertical']
  },

  // Loading Animations
  pulseLoading: {
    name: 'Pulse Loading',
    description: 'Continuous pulse animation for loading states',
    variants: {
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
    },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    usage: 'motion.div variants={animationPresets.pulseLoading.variants}',
    category: 'loading',
    tags: ['pulse', 'loading', 'infinite']
  },

  spinLoading: {
    name: 'Spin Loading',
    description: 'Continuous rotation for loading indicators',
    variants: {
      initial: { rotate: 0 },
      animate: { 
        rotate: 360,
        transition: { 
          duration: 1, 
          repeat: Infinity,
          ease: 'linear'
        }
      }
    },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    usage: 'motion.div variants={animationPresets.spinLoading.variants}',
    category: 'loading',
    tags: ['spin', 'rotate', 'loading']
  },

  bounceLoading: {
    name: 'Bounce Loading',
    description: 'Bouncing animation for loading states',
    variants: {
      initial: { y: 0 },
      animate: { 
        y: [-20, 0, -20],
        transition: { 
          duration: 0.6, 
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    usage: 'motion.div variants={animationPresets.bounceLoading.variants}',
    category: 'loading',
    tags: ['bounce', 'vertical', 'loading']
  },

  // Gesture Animations
  tapScale: {
    name: 'Tap Scale',
    description: 'Element scales down on tap/click',
    variants: {
      initial: { scale: 1 },
      animate: { scale: 1 },
      tap: { 
        scale: 0.95,
        transition: { duration: 0.1 }
      }
    },
    transition: { duration: 0.1 },
    usage: 'motion.div variants={animationPresets.tapScale.variants} whileTap="tap"',
    category: 'gesture',
    tags: ['tap', 'click', 'feedback']
  },

  dragSpring: {
    name: 'Drag Spring',
    description: 'Spring animation for draggable elements',
    variants: {
      initial: { x: 0, y: 0 },
      animate: { x: 0, y: 0 },
      drag: { 
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }
    },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
    usage: 'motion.div variants={animationPresets.dragSpring.variants} drag dragConstraints={{}}',
    category: 'gesture',
    tags: ['drag', 'spring', 'interactive']
  },

  // Exit Animations
  fadeOut: {
    name: 'Fade Out',
    description: 'Smooth fade out animation',
    variants: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    transition: { duration: 0.3, ease: 'easeIn' },
    usage: 'motion.div variants={animationPresets.fadeOut.variants}',
    category: 'exit',
    tags: ['fade', 'smooth', 'exit']
  },

  slideOutDown: {
    name: 'Slide Out Down',
    description: 'Element slides out downward',
    variants: {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 }
    },
    transition: { duration: 0.3, ease: 'easeIn' },
    usage: 'motion.div variants={animationPresets.slideOutDown.variants}',
    category: 'exit',
    tags: ['slide', 'down', 'exit']
  },

  scaleOut: {
    name: 'Scale Out',
    description: 'Element scales out to nothing',
    variants: {
      initial: { opacity: 1, scale: 1 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 }
    },
    transition: { duration: 0.2, ease: 'easeIn' },
    usage: 'motion.div variants={animationPresets.scaleOut.variants}',
    category: 'exit',
    tags: ['scale', 'shrink', 'exit']
  }
};

// Helper function to get presets by category
export const getPresetsByCategory = (category: AnimationPreset['category']): AnimationPreset[] => {
  return Object.values(animationPresets).filter(preset => preset.category === category);
};

// Helper function to get presets by tags
export const getPresetsByTags = (tags: string[]): AnimationPreset[] => {
  return Object.values(animationPresets).filter(preset => 
    tags.some(tag => preset.tags.includes(tag))
  );
};

// Helper function to create custom preset
export const createCustomPreset = (
  name: string,
  description: string,
  variants: Variants,
  category: AnimationPreset['category'],
  tags: string[] = []
): AnimationPreset => {
  return {
    name,
    description,
    variants,
    usage: `motion.div variants={customPreset.variants}`,
    category,
    tags
  };
};

// Common transition presets
export const transitionPresets = {
  smooth: { duration: 0.5, ease: 'easeOut' },
  fast: { duration: 0.2, ease: 'easeOut' },
  slow: { duration: 0.8, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 },
  elastic: { type: 'spring', stiffness: 200, damping: 20 }
};
