/**
 * CDN Optimization System
 * توزيع عالمي يقلّل الـTTFB للمستخدمين البعيدين
 */

export interface CDNConfig {
  provider: 'cloudflare' | 'aws-cloudfront' | 'vercel' | 'custom';
  regions: string[];
  edgeLocations: EdgeLocation[];
  cacheStrategy: CacheStrategy;
  compression: CompressionConfig;
  imageOptimization: ImageOptimizationConfig;
}

export interface EdgeLocation {
  region: string;
  country: string;
  city: string;
  latency: number;
  capacity: number;
}

export interface CacheStrategy {
  staticAssets: CacheRule;
  apiResponses: CacheRule;
  images: CacheRule;
  fonts: CacheRule;
}

export interface CacheRule {
  ttl: number; // Time to live in seconds
  staleWhileRevalidate: number;
  maxAge: number;
  headers: Record<string, string>;
}

export interface CompressionConfig {
  enabled: boolean;
  algorithms: ('gzip' | 'brotli' | 'zstd')[];
  minSize: number;
  quality: number;
}

export interface ImageOptimizationConfig {
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  quality: number;
  sizes: number[];
  lazyLoading: boolean;
}

export class CDNOptimizer {
  private config: CDNConfig;
  private performanceMetrics: Map<string, number> = new Map();

  constructor() {
    this.config = this.initializeCDNConfig();
    this.setupPerformanceMonitoring();
  }

  /**
   * تهيئة إعدادات CDN
   */
  private initializeCDNConfig(): CDNConfig {
    return {
      provider: 'cloudflare',
      regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1', 'me-central-1'],
      edgeLocations: [
        { region: 'us-east-1', country: 'US', city: 'New York', latency: 50, capacity: 1000 },
        { region: 'eu-west-1', country: 'UK', city: 'London', latency: 45, capacity: 800 },
        { region: 'ap-southeast-1', country: 'SG', city: 'Singapore', latency: 60, capacity: 600 },
        { region: 'me-central-1', country: 'AE', city: 'Dubai', latency: 55, capacity: 500 }
      ],
      cacheStrategy: {
        staticAssets: {
          ttl: 31536000, // 1 year
          staleWhileRevalidate: 86400, // 1 day
          maxAge: 31536000,
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'CDN-Cache-Control': 'max-age=31536000'
          }
        },
        apiResponses: {
          ttl: 300, // 5 minutes
          staleWhileRevalidate: 60, // 1 minute
          maxAge: 300,
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
            'CDN-Cache-Control': 'max-age=300'
          }
        },
        images: {
          ttl: 2592000, // 30 days
          staleWhileRevalidate: 86400, // 1 day
          maxAge: 2592000,
          headers: {
            'Cache-Control': 'public, max-age=2592000',
            'CDN-Cache-Control': 'max-age=2592000'
          }
        },
        fonts: {
          ttl: 31536000, // 1 year
          staleWhileRevalidate: 86400, // 1 day
          maxAge: 31536000,
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'CDN-Cache-Control': 'max-age=31536000'
          }
        }
      },
      compression: {
        enabled: true,
        algorithms: ['brotli', 'gzip'],
        minSize: 1024, // 1KB
        quality: 6
      },
      imageOptimization: {
        formats: ['avif', 'webp', 'jpeg'],
        quality: 85,
        sizes: [320, 640, 768, 1024, 1200, 1920],
        lazyLoading: true
      }
    };
  }

  /**
   * إعداد مراقبة الأداء
   */
  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined') {
      // مراقبة Core Web Vitals
      this.monitorCoreWebVitals();
      
      // مراقبة CDN performance
      this.monitorCDNPerformance();
      
      // مراقبة cache hit ratio
      this.monitorCachePerformance();
    }
  }

  /**
   * مراقبة Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // مراقبة LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.performanceMetrics.set('lcp', lastEntry.startTime);
          
          // إرسال البيانات للتحليل
          this.reportMetric('lcp', lastEntry.startTime);
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // مراقبة FID
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          if ('processingStart' in fidEntry) {
            this.performanceMetrics.set('fid', fidEntry.processingStart - fidEntry.startTime);
            this.reportMetric('fid', fidEntry.processingStart - fidEntry.startTime);
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    }

    // مراقبة CLS
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.performanceMetrics.set('cls', clsValue);
            this.reportMetric('cls', clsValue);
          }
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * مراقبة أداء CDN
   */
  private monitorCDNPerformance(): void {
    // مراقبة TTFB
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          if ('responseStart' in navEntry && 'requestStart' in navEntry) {
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            this.performanceMetrics.set('ttfb', ttfb);
            this.reportMetric('ttfb', ttfb);
          }
        });
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });
    }

    // مراقبة Resource Timing
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('cdn') || entry.name.includes('static')) {
            const resourceEntry = entry as PerformanceResourceTiming;
            if ('responseEnd' in resourceEntry && 'requestStart' in resourceEntry) {
              const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
              this.performanceMetrics.set(`resource-${entry.name}`, loadTime);
              this.reportMetric('resource-load', loadTime, { resource: entry.name });
            }
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * مراقبة أداء Cache
   */
  private monitorCachePerformance(): void {
    // مراقبة Service Worker cache
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_METRICS') {
          const { hitRatio, missRatio, totalRequests } = event.data;
          this.performanceMetrics.set('cache-hit-ratio', hitRatio);
          this.performanceMetrics.set('cache-miss-ratio', missRatio);
          this.performanceMetrics.set('cache-total-requests', totalRequests);
          
          this.reportMetric('cache-performance', {
            hitRatio,
            missRatio,
            totalRequests
          });
        }
      });
    }
  }

  /**
   * إرسال المقاييس للتحليل
   */
  private reportMetric(metric: string, value: number | object, metadata?: any): void {
    // في التطبيق الحقيقي، سيتم إرسال البيانات لخدمة التحليلات
    console.log('CDN Metric:', { metric, value, metadata, timestamp: Date.now() });
    
    // إرسال للـAPI
    fetch('/api/analytics/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric,
        value,
        metadata,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      })
    }).catch(() => {
      // تجاهل الأخطاء في الإرسال
    });
  }

  /**
   * تحسين الصور للـCDN
   */
  optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}): string {
    const { width, height, quality = 85, format = 'webp' } = options;
    
    // إنشاء URL محسن للـCDN
    const cdnUrl = this.getCDNUrl();
    const optimizedUrl = new URL(src, cdnUrl);
    
    // إضافة معاملات التحسين
    if (width) optimizedUrl.searchParams.set('w', width.toString());
    if (height) optimizedUrl.searchParams.set('h', height.toString());
    optimizedUrl.searchParams.set('q', quality.toString());
    optimizedUrl.searchParams.set('f', format);
    
    // إضافة تحسينات إضافية
    optimizedUrl.searchParams.set('auto', 'compress');
    optimizedUrl.searchParams.set('sharp', '1');
    
    return optimizedUrl.toString();
  }

  /**
   * الحصول على URL الـCDN
   */
  private getCDNUrl(): string {
    const cdnUrls: Record<string, string> = {
      cloudflare: 'https://cdn.stayx-team.com',
      'aws-cloudfront': 'https://d1234567890.cloudfront.net',
      vercel: 'https://stayx-team.vercel.app',
      custom: 'https://cdn.stayx-team.com'
    };
    
    return cdnUrls[this.config.provider] || cdnUrls.custom || 'https://cdn.stayx-team.com';
  }

  /**
   * تحسين تحميل الموارد
   */
  optimizeResourceLoading(): void {
    if (typeof window === 'undefined') return;

    // Preload critical resources
    this.preloadCriticalResources();
    
    // Prefetch likely resources
    this.prefetchLikelyResources();
    
    // Optimize third-party scripts
    this.optimizeThirdPartyScripts();
  }

  /**
   * Preload الموارد الحرجة
   */
  private preloadCriticalResources(): void {
    const criticalResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
      { href: '/images/hero-bg.webp', as: 'image' },
      { href: '/_next/static/css/app.css', as: 'style' },
      { href: '/_next/static/js/app.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.as === 'font') link.crossOrigin = 'anonymous';
      
      document.head.appendChild(link);
    });
  }

  /**
   * Prefetch الموارد المحتملة
   */
  private prefetchLikelyResources(): void {
    const likelyResources = [
      '/bug-fixer',
      '/analytics',
      '/api/bug-fixer/languages',
      '/images/grid-pattern.webp'
    ];

    // Prefetch بعد تحميل الصفحة
    window.addEventListener('load', () => {
      setTimeout(() => {
        likelyResources.forEach(resource => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = resource;
          document.head.appendChild(link);
        });
      }, 2000);
    });
  }

  /**
   * تحسين scripts الطرف الثالث
   */
  private optimizeThirdPartyScripts(): void {
    // تحميل scripts غير الحرجة بعد تحميل الصفحة
    const thirdPartyScripts = [
      'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
      'https://widget.example.com/widget.js'
    ];

    window.addEventListener('load', () => {
      setTimeout(() => {
        thirdPartyScripts.forEach(src => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        });
      }, 3000);
    });
  }

  /**
   * تحسين الـDNS
   */
  optimizeDNS(): void {
    const domains = [
      'cdn.stayx-team.com',
      'api.stayx-team.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];

    domains.forEach(domain => {
      // DNS prefetch
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'dns-prefetch';
      prefetchLink.href = `//${domain}`;
      document.head.appendChild(prefetchLink);

      // Preconnect للدومينات الحرجة
      if (domain.includes('cdn') || domain.includes('api')) {
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = `https://${domain}`;
        preconnectLink.crossOrigin = 'anonymous';
        document.head.appendChild(preconnectLink);
      }
    });
  }

  /**
   * تحسين الـHTTP/2
   */
  optimizeHTTP2(): void {
    // Server Push للموارد الحرجة
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/images/hero-bg.webp',
      '/_next/static/css/app.css'
    ];

    // إرسال طلب Server Push
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'SERVER_PUSH',
          resources: criticalResources
        });
      });
    }
  }

  /**
   * تحسين الـCompression
   */
  optimizeCompression(): void {
    const { compression } = this.config;
    
    if (!compression.enabled) return;

    // إضافة headers للضغط
    // const compressionHeaders = {
    //   'Accept-Encoding': compression.algorithms.join(', '),
    //   'Vary': 'Accept-Encoding'
    // };

    // تطبيق الضغط على الموارد
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'COMPRESSION_CONFIG',
          config: compression
        });
      });
    }
  }

  /**
   * تحسين الـEdge Computing
   */
  optimizeEdgeComputing(): void {
    // تشغيل JavaScript على الـEdge
    const edgeFunctions = [
      'image-optimization',
      'geo-routing',
      'a-b-testing',
      'personalization'
    ];

    // إرسال إعدادات Edge Functions
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'EDGE_FUNCTIONS',
          functions: edgeFunctions
        });
      });
    }
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getPerformanceStats(): Record<string, number> {
    return Object.fromEntries(this.performanceMetrics);
  }

  /**
   * تحسين شامل للـCDN
   */
  optimizeAll(): void {
    this.optimizeResourceLoading();
    this.optimizeDNS();
    this.optimizeHTTP2();
    this.optimizeCompression();
    this.optimizeEdgeComputing();
  }

  /**
   * تحديث إعدادات CDN
   */
  updateConfig(newConfig: Partial<CDNConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // إعادة تطبيق التحسينات
    this.optimizeAll();
  }

  /**
   * الحصول على التوصيات
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const stats = this.getPerformanceStats();
    
    // تحليل LCP
    if (stats.lcp && stats.lcp > 2500) {
      recommendations.push('تحسين LCP: استخدم lazy loading للصور غير الحرجة');
    }
    
    // تحليل TTFB
    if (stats.ttfb && stats.ttfb > 800) {
      recommendations.push('تحسين TTFB: استخدم CDN أقرب للمستخدمين');
    }
    
    // تحليل Cache Hit Ratio
    const hitRatio = stats['cache-hit-ratio'] || 0;
    if (hitRatio < 0.8) {
      recommendations.push('تحسين Cache: زيادة TTL للموارد الثابتة');
    }
    
    return recommendations;
  }
}

// Export للاستخدام في المكونات الأخرى
export const cdnOptimizer = new CDNOptimizer();
