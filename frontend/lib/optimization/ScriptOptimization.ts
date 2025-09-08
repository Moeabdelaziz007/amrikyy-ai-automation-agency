/**
 * Third-Party Script Optimization
 * Implements efficient loading strategies for external scripts
 */

// Critical resource preloading
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = '/fonts/inter-var.woff2';
  fontPreload.as = 'font';
  fontPreload.type = 'font/woff2';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);

  // Preload critical images
  const heroImagePreload = document.createElement('link');
  heroImagePreload.rel = 'preload';
  heroImagePreload.href = '/images/hero-bg.webp';
  heroImagePreload.as = 'image';
  document.head.appendChild(heroImagePreload);
};

// Defer non-critical scripts
export const deferNonCriticalScripts = () => {
  if (typeof window === 'undefined') return;

  // Defer analytics scripts
  const analyticsScript = document.createElement('script');
  analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
  analyticsScript.async = true;
  analyticsScript.defer = true;
  document.head.appendChild(analyticsScript);

  // Defer third-party widgets
  const widgetScript = document.createElement('script');
  widgetScript.src = 'https://widget.example.com/widget.js';
  widgetScript.async = true;
  widgetScript.defer = true;
  document.head.appendChild(widgetScript);
};

// Load scripts on user interaction
export const loadOnInteraction = () => {
  if (typeof window === 'undefined') return;

  let scriptsLoaded = false;
  
  const loadScripts = () => {
    if (scriptsLoaded) return;
    scriptsLoaded = true;

    // Load non-critical scripts after user interaction
    deferNonCriticalScripts();
  };

  // Load on first user interaction
  ['mousedown', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, loadScripts, { once: true });
  });

  // Load after 3 seconds if no interaction
  setTimeout(loadScripts, 3000);
};

// Resource hints for better performance
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;

  // DNS prefetch for external domains
  const domains = [
    'https://api.gemini.google.com',
    'https://api.serpapi.com',
    'https://fonts.googleapis.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical domains
  const criticalDomains = [
    'https://api.gemini.google.com',
    'https://fonts.gstatic.com'
  ];

  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};
