'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  bundleSize: number; // Estimated bundle size
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0;
      
      // Estimate bundle size from performance entries
      const resourceEntries = performance.getEntriesByType('resource');
      const bundleSize = resourceEntries
        .filter(entry => entry.name.includes('_next/static'))
        .reduce((total, entry) => total + ((entry as any).transferSize || 0), 0);

      setMetrics({
        fcp: Math.round(fcp),
        lcp: Math.round(lcp),
        fid: 0, // Would need user interaction to measure
        cls: 0, // Would need layout shift observer
        ttfb: Math.round(navigation.responseStart - navigation.requestStart),
        bundleSize: Math.round(bundleSize / 1024) // Convert to KB
      });
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Show metrics after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      window.removeEventListener('load', measurePerformance);
      clearTimeout(timer);
    };
  }, []);

  if (!metrics || !isVisible) return null;

  const getScoreColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-neon-green/20 rounded-lg p-4 text-xs text-gray-300 max-w-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-neon-green font-semibold">Performance</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-300"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })}>
            {metrics.fcp}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}>
            {metrics.lcp}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor(metrics.ttfb, { good: 800, poor: 1800 })}>
            {metrics.ttfb}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Bundle:</span>
          <span className={getScoreColor(metrics.bundleSize, { good: 500, poor: 1000 })}>
            {metrics.bundleSize}KB
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          {metrics.bundleSize < 500 ? '🚀 Excellent' : 
           metrics.bundleSize < 1000 ? '✅ Good' : '⚠️ Needs optimization'}
        </div>
      </div>
    </div>
  );
}
