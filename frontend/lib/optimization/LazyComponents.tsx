/**
 * Optimized Component Loading System
 * Implements dynamic imports and code splitting for better performance
 */

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
  </div>
);

// Heavy components - lazy loaded
export const BugFixerInterface = lazy(() => import('../../components/bug-fixer/BugFixerInterface'));
export const SecurityPanel = lazy(() => import('../../components/security/SecurityPanel'));
export const GamifiedOnboarding = lazy(() => import('../../components/onboarding/GamifiedOnboarding'));
export const AnalyticsDashboard = lazy(() => import('../../components/dashboard/AnalyticsDashboard'));
export const ActivityFeed = lazy(() => import('../../components/activity/ActivityFeed'));

// Animation components - lazy loaded
export const FloatingParticles = lazy(() => import('../../components/animations/FloatingParticles'));
export const HeroAnimation = lazy(() => import('../../components/animations/HeroAnimation'));
export const ParticleField = lazy(() => import('../../components/background/ParticleField'));

// UI components - lazy loaded
export const PerformanceMonitor = lazy(() => 
  import('../../components/ui/PerformanceMonitor').then(module => ({ default: module.PerformanceMonitor }))
);
export const GlobalHelpOverlay = lazy(() => import('../../components/help/GlobalHelpOverlay'));

// Wrapper component for lazy loading with animations
export function LazyComponentWrapper({ 
  children, 
  fallback = <LoadingFallback />,
  className = ''
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        {children}
      </motion.div>
    </Suspense>
  );
}

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used
  import('../../components/ui/PerformanceMonitor');
  import('../../components/theme/ThemeToggle');
};

// Preload on user interaction
export const preloadOnInteraction = () => {
  // Preload when user hovers over navigation items
  const navItems = document.querySelectorAll('[data-preload]');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const component = item.getAttribute('data-preload');
      if (component) {
        switch (component) {
          case 'bug-fixer':
            import('../../components/bug-fixer/BugFixerInterface');
            break;
          case 'security':
            import('../../components/security/SecurityPanel');
            break;
          case 'analytics':
            import('../../components/dashboard/AnalyticsDashboard');
            break;
        }
      }
    });
  });
};
