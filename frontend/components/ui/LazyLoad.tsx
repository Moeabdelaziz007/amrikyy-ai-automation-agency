'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LazyLoadProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  className?: string;
  delay?: number;
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  className = '',
  delay = 0
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            setHasLoaded(true);
          }, delay);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return (
    <div ref={elementRef} className={className}>
      {!hasLoaded && fallback && (
        <div className="min-h-[200px] flex items-center justify-center">
          {fallback}
        </div>
      )}
      
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

// Specialized lazy loading components for different use cases
export function LazySection({ children, ...props }: LazyLoadProps) {
  return (
    <LazyLoad
      {...props}
      fallback={
        <div className="min-h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg animate-pulse" />
      }
    >
      {children}
    </LazyLoad>
  );
}

export function LazyCard({ children, ...props }: LazyLoadProps) {
  return (
    <LazyLoad
      {...props}
      fallback={
        <div className="min-h-[300px] bg-card border border-neon-green/20 rounded-lg animate-pulse" />
      }
    >
      {children}
    </LazyLoad>
  );
}

export function LazyImage({ children, ...props }: LazyLoadProps) {
  return (
    <LazyLoad
      {...props}
      fallback={
        <div className="min-h-[200px] bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg animate-pulse" />
      }
    >
      {children}
    </LazyLoad>
  );
}
