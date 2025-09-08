/**
 * Font Performance Optimization
 * Implements efficient font loading strategies
 */

// System font stack for maximum performance
export const systemFontStack = `
  -apple-system, 
  BlinkMacSystemFont, 
  "Segoe UI", 
  Roboto, 
  "Helvetica Neue", 
  Arial, 
  "Noto Sans", 
  sans-serif, 
  "Apple Color Emoji", 
  "Segoe UI Emoji", 
  "Segoe UI Symbol", 
  "Noto Color Emoji"
`;

// Font loading optimization
export const optimizeFontLoading = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const preloadFont = (href: string, as: string = 'font') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  // Preload Inter font (if using custom fonts)
  preloadFont('/fonts/inter-var.woff2');

  // Font display optimization
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('/fonts/inter-var.woff2') format('woff2');
    }
    
    /* Fallback to system fonts during loading */
    body {
      font-family: ${systemFontStack};
    }
    
    /* Apply custom font when loaded */
    .font-inter {
      font-family: 'Inter', ${systemFontStack};
    }
  `;
  document.head.appendChild(style);
};

// Font loading performance monitoring
export const monitorFontLoading = () => {
  if (typeof window === 'undefined') return;

  // Monitor font loading performance
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('All fonts loaded');
      
      // Measure font loading time
      const fontLoadTime = performance.now();
      console.log(`Font loading time: ${fontLoadTime}ms`);
      
      // Send metrics to analytics
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'font_loading_time', {
          value: Math.round(fontLoadTime),
          event_category: 'performance'
        });
      }
    });
  }
};

// Critical font subset loading
export const loadCriticalFontSubset = () => {
  if (typeof window === 'undefined') return;

  // Load only essential characters for above-the-fold content
  const criticalChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-';
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = `/fonts/inter-subset.woff2?text=${encodeURIComponent(criticalChars)}`;
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};
