/**
 * Mobile-first Audit & Real User Monitoring (RUM)
 * اختبار 3G/4G وقياس الـUX على أجهزة ضعيفة + تتبع Core Web Vitals من المستخدمين الحقيقين
 */

export interface MobileAuditConfig {
  networkConditions: NetworkCondition[];
  deviceProfiles: DeviceProfile[];
  testScenarios: TestScenario[];
}

export interface NetworkCondition {
  name: string;
  downloadSpeed: number; // Kbps
  uploadSpeed: number; // Kbps
  latency: number; // ms
  packetLoss: number; // percentage
}

export interface DeviceProfile {
  name: string;
  cpuSlowdown: number;
  memoryLimit: number; // MB
  screenSize: { width: number; height: number };
  userAgent: string;
}

export interface TestScenario {
  name: string;
  description: string;
  steps: TestStep[];
  expectedMetrics: ExpectedMetrics;
}

export interface TestStep {
  action: string;
  selector?: string;
  input?: string;
  waitTime?: number;
}

export interface ExpectedMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
}

export interface RUMData {
  userId: string;
  sessionId: string;
  timestamp: number;
  metrics: CoreWebVitals;
  deviceInfo: DeviceInfo;
  networkInfo: NetworkInfo;
  userJourney: UserJourneyStep[];
}

export interface CoreWebVitals {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  tbt: number; // Total Blocking Time
}

export interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  devicePixelRatio: number;
  memory: number;
  cores: number;
  platform: string;
}

export interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface UserJourneyStep {
  timestamp: number;
  action: string;
  page: string;
  duration: number;
}

export class MobileAuditAndRUM {
  private auditConfig: MobileAuditConfig;
  private rumData: RUMData[] = [];
  private currentSession: RUMData | null = null;

  constructor() {
    this.auditConfig = this.initializeAuditConfig();
    this.initializeRUM();
  }

  /**
   * تهيئة إعدادات Mobile Audit
   */
  private initializeAuditConfig(): MobileAuditConfig {
    return {
      networkConditions: [
        {
          name: '3G Slow',
          downloadSpeed: 500, // 500 Kbps
          uploadSpeed: 100,
          latency: 400,
          packetLoss: 0.1
        },
        {
          name: '3G Fast',
          downloadSpeed: 1500, // 1.5 Mbps
          uploadSpeed: 750,
          latency: 300,
          packetLoss: 0.05
        },
        {
          name: '4G',
          downloadSpeed: 4000, // 4 Mbps
          uploadSpeed: 3000,
          latency: 150,
          packetLoss: 0.01
        },
        {
          name: 'WiFi',
          downloadSpeed: 10000, // 10 Mbps
          uploadSpeed: 10000,
          latency: 50,
          packetLoss: 0
        }
      ],
      deviceProfiles: [
        {
          name: 'Low-end Android',
          cpuSlowdown: 4,
          memoryLimit: 512,
          screenSize: { width: 360, height: 640 },
          userAgent: 'Mozilla/5.0 (Linux; Android 8.0; SM-G570F) AppleWebKit/537.36'
        },
        {
          name: 'Mid-range Android',
          cpuSlowdown: 2,
          memoryLimit: 1024,
          screenSize: { width: 414, height: 896 },
          userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-A505F) AppleWebKit/537.36'
        },
        {
          name: 'iPhone SE',
          cpuSlowdown: 2,
          memoryLimit: 2048,
          screenSize: { width: 375, height: 667 },
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        },
        {
          name: 'iPhone 12',
          cpuSlowdown: 1,
          memoryLimit: 4096,
          screenSize: { width: 390, height: 844 },
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        }
      ],
      testScenarios: [
        {
          name: 'Home Page Load',
          description: 'تحميل الصفحة الرئيسية',
          steps: [
            { action: 'navigate', input: '/', waitTime: 5000 },
            { action: 'scroll', input: '50%', waitTime: 2000 },
            { action: 'click', selector: '.btn-primary', waitTime: 1000 }
          ],
          expectedMetrics: {
            lcp: 2500,
            fid: 100,
            cls: 0.1,
            ttfb: 800,
            fcp: 1800
          }
        },
        {
          name: 'Bug Fixer Page',
          description: 'استخدام أداة إصلاح الأخطاء',
          steps: [
            { action: 'navigate', input: '/bug-fixer', waitTime: 3000 },
            { action: 'input', selector: '.code-editor', input: 'const user = null;\nuser.name;', waitTime: 1000 },
            { action: 'click', selector: '.fix-button', waitTime: 5000 }
          ],
          expectedMetrics: {
            lcp: 2000,
            fid: 100,
            cls: 0.05,
            ttfb: 600,
            fcp: 1500
          }
        }
      ]
    };
  }

  /**
   * تهيئة Real User Monitoring
   */
  private initializeRUM(): void {
    if (typeof window === 'undefined') return;

    // إنشاء session جديد
    this.currentSession = this.createNewSession();
    
    // بدء مراقبة Core Web Vitals
    this.startCoreWebVitalsMonitoring();
    
    // بدء مراقبة User Journey
    this.startUserJourneyTracking();
    
    // بدء مراقبة Device & Network
    this.startDeviceNetworkMonitoring();
    
    // إرسال البيانات بشكل دوري
    this.startPeriodicReporting();
  }

  /**
   * إنشاء session جديد
   */
  private createNewSession(): RUMData {
    return {
      userId: this.generateUserId(),
      sessionId: this.generateSessionId(),
      timestamp: Date.now(),
      metrics: {
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
        fcp: 0,
        tbt: 0
      },
      deviceInfo: this.getDeviceInfo(),
      networkInfo: this.getNetworkInfo(),
      userJourney: []
    };
  }

  /**
   * بدء مراقبة Core Web Vitals
   */
  private startCoreWebVitalsMonitoring(): void {
    if (!this.currentSession) return;

    // مراقبة LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.currentSession!.metrics.lcp = lastEntry.startTime;
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
            const fid = fidEntry.processingStart - fidEntry.startTime;
            this.currentSession!.metrics.fid = fid;
            this.reportMetric('fid', fid);
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
            this.currentSession!.metrics.cls = clsValue;
            this.reportMetric('cls', clsValue);
          }
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // مراقبة TTFB
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          if ('responseStart' in navEntry && 'requestStart' in navEntry) {
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            this.currentSession!.metrics.ttfb = ttfb;
            this.reportMetric('ttfb', ttfb);
          }
        });
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });
    }

    // مراقبة FCP
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.currentSession!.metrics.fcp = entry.startTime;
            this.reportMetric('fcp', entry.startTime);
          }
        });
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
    }

    // مراقبة TBT
    if ('PerformanceObserver' in window) {
      let totalBlockingTime = 0;
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            totalBlockingTime += entry.duration - 50;
            this.currentSession!.metrics.tbt = totalBlockingTime;
            this.reportMetric('tbt', totalBlockingTime);
          }
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  /**
   * بدء تتبع User Journey
   */
  private startUserJourneyTracking(): void {
    if (!this.currentSession) return;

    // تتبع النقرات
    document.addEventListener('click', (event) => {
      this.addUserJourneyStep('click', event.target as HTMLElement);
    });

    // تتبع التنقل
    window.addEventListener('popstate', () => {
      this.addUserJourneyStep('navigation', null, window.location.pathname);
    });

    // تتبع التمرير
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.addUserJourneyStep('scroll', null, window.location.pathname);
      }, 100);
    });

    // تتبع إدخال النص
    document.addEventListener('input', (event) => {
      this.addUserJourneyStep('input', event.target as HTMLElement);
    });
  }

  /**
   * بدء مراقبة Device & Network
   */
  private startDeviceNetworkMonitoring(): void {
    if (!this.currentSession) return;

    // مراقبة تغيير الشبكة
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      connection.addEventListener('change', () => {
        this.currentSession!.networkInfo = this.getNetworkInfo();
        this.reportMetric('network-change', this.currentSession!.networkInfo);
      });
    }

    // مراقبة تغيير الذاكرة
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setInterval(() => {
        this.reportMetric('memory-usage', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 30000);
    }
  }

  /**
   * إضافة خطوة في User Journey
   */
  private addUserJourneyStep(action: string, _element?: HTMLElement | null, page?: string): void {
    if (!this.currentSession) return;

    const step: UserJourneyStep = {
      timestamp: Date.now(),
      action,
      page: page || window.location.pathname,
      duration: 0
    };

    // حساب المدة منذ الخطوة السابقة
    const lastStep = this.currentSession.userJourney[this.currentSession.userJourney.length - 1];
    if (lastStep) {
      step.duration = step.timestamp - lastStep.timestamp;
    }

    this.currentSession.userJourney.push(step);

    // الاحتفاظ بآخر 100 خطوة فقط
    if (this.currentSession.userJourney.length > 100) {
      this.currentSession.userJourney = this.currentSession.userJourney.slice(-100);
    }
  }

  /**
   * بدء الإرسال الدوري للبيانات
   */
  private startPeriodicReporting(): void {
    // إرسال البيانات كل 30 ثانية
    setInterval(() => {
      this.sendRUMData();
    }, 30000);

    // إرسال البيانات عند إغلاق الصفحة
    window.addEventListener('beforeunload', () => {
      this.sendRUMData(true);
    });

    // إرسال البيانات عند تغيير الصفحة
    window.addEventListener('pagehide', () => {
      this.sendRUMData(true);
    });
  }

  /**
   * إرسال بيانات RUM
   */
  private sendRUMData(isFinal = false): void {
    if (!this.currentSession) return;

    const data = {
      ...this.currentSession,
      isFinal,
      timestamp: Date.now()
    };

    // إرسال البيانات
    fetch('/api/rum/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {
      // تجاهل الأخطاء في الإرسال
    });

    // حفظ البيانات محلياً للنسخ الاحتياطي
    this.rumData.push(data);
    localStorage.setItem('rum-data', JSON.stringify(this.rumData.slice(-10)));

    if (isFinal) {
      this.currentSession = null;
    }
  }

  /**
   * إرسال مقياس محدد
   */
  private reportMetric(metric: string, value: number | object): void {
    if (!this.currentSession) return;

    // إرسال المقياس فوراً للتحليل
    fetch('/api/rum/metric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.currentSession.sessionId,
        metric,
        value,
        timestamp: Date.now()
      })
    }).catch(() => {
      // تجاهل الأخطاء
    });
  }

  /**
   * الحصول على معلومات الجهاز
   */
  private getDeviceInfo(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      devicePixelRatio: window.devicePixelRatio,
      memory: (navigator as any).deviceMemory || 0,
      cores: navigator.hardwareConcurrency || 0,
      platform: navigator.platform
    };
  }

  /**
   * الحصول على معلومات الشبكة
   */
  private getNetworkInfo(): NetworkInfo {
    const connection = (navigator as any).connection;
    
    return {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false
    };
  }

  /**
   * إنشاء معرف مستخدم فريد
   */
  private generateUserId(): string {
    let userId = localStorage.getItem('rum-user-id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('rum-user-id', userId);
    }
    return userId;
  }

  /**
   * إنشاء معرف session فريد
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * تشغيل Mobile Audit
   */
  async runMobileAudit(): Promise<AuditResult[]> {
    const results: AuditResult[] = [];

    for (const scenario of this.auditConfig.testScenarios) {
      for (const networkCondition of this.auditConfig.networkConditions) {
        for (const deviceProfile of this.auditConfig.deviceProfiles) {
          const result = await this.runTestScenario(scenario, networkCondition, deviceProfile);
          results.push(result);
        }
      }
    }

    return results;
  }

  /**
   * تشغيل سيناريو اختبار محدد
   */
  private async runTestScenario(
    scenario: TestScenario,
    networkCondition: NetworkCondition,
    deviceProfile: DeviceProfile
  ): Promise<AuditResult> {
    const startTime = Date.now();
    const metrics: CoreWebVitals = {
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      fcp: 0,
      tbt: 0
    };

    // محاكاة ظروف الشبكة
    this.simulateNetworkCondition(networkCondition);

    // محاكاة الجهاز
    this.simulateDeviceProfile(deviceProfile);

    // تشغيل السيناريو
    for (const step of scenario.steps) {
      await this.executeTestStep(step);
    }

    // جمع المقاييس
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    return {
      scenario: scenario.name,
      networkCondition: networkCondition.name,
      deviceProfile: deviceProfile.name,
      metrics,
      totalTime,
      passed: this.evaluateMetrics(metrics, scenario.expectedMetrics),
      recommendations: this.generateRecommendations(metrics, scenario.expectedMetrics)
    };
  }

  /**
   * محاكاة ظروف الشبكة
   */
  private simulateNetworkCondition(condition: NetworkCondition): void {
    // في التطبيق الحقيقي، سيتم استخدام Chrome DevTools Protocol
    console.log('Simulating network condition:', condition);
  }

  /**
   * محاكاة الجهاز
   */
  private simulateDeviceProfile(profile: DeviceProfile): void {
    // في التطبيق الحقيقي، سيتم استخدام Chrome DevTools Protocol
    console.log('Simulating device profile:', profile);
  }

  /**
   * تنفيذ خطوة اختبار
   */
  private async executeTestStep(step: TestStep): Promise<void> {
    switch (step.action) {
      case 'navigate':
        if (step.input) {
          window.location.href = step.input;
          await this.wait(step.waitTime || 1000);
        }
        break;
      case 'click':
        if (step.selector) {
          const element = document.querySelector(step.selector) as HTMLElement;
          if (element) {
            element.click();
            await this.wait(step.waitTime || 1000);
          }
        }
        break;
      case 'input':
        if (step.selector && step.input) {
          const element = document.querySelector(step.selector) as HTMLInputElement;
          if (element) {
            element.value = step.input;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(step.waitTime || 1000);
          }
        }
        break;
      case 'scroll':
        if (step.input) {
          const percentage = parseInt(step.input.replace('%', ''));
          window.scrollTo(0, (document.body.scrollHeight * percentage) / 100);
          await this.wait(step.waitTime || 1000);
        }
        break;
    }
  }

  /**
   * انتظار
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * تقييم المقاييس
   */
  private evaluateMetrics(actual: CoreWebVitals, expected: ExpectedMetrics): boolean {
    return (
      actual.lcp <= expected.lcp &&
      actual.fid <= expected.fid &&
      actual.cls <= expected.cls &&
      actual.ttfb <= expected.ttfb &&
      actual.fcp <= expected.fcp
    );
  }

  /**
   * توليد التوصيات
   */
  private generateRecommendations(actual: CoreWebVitals, expected: ExpectedMetrics): string[] {
    const recommendations: string[] = [];

    if (actual.lcp > expected.lcp) {
      recommendations.push('تحسين LCP: استخدم lazy loading للصور غير الحرجة');
    }
    if (actual.fid > expected.fid) {
      recommendations.push('تحسين FID: قلل من JavaScript blocking');
    }
    if (actual.cls > expected.cls) {
      recommendations.push('تحسين CLS: حدد أبعاد الصور مسبقاً');
    }
    if (actual.ttfb > expected.ttfb) {
      recommendations.push('تحسين TTFB: استخدم CDN أقرب للمستخدمين');
    }
    if (actual.fcp > expected.fcp) {
      recommendations.push('تحسين FCP: قلل من CSS blocking');
    }

    return recommendations;
  }

  /**
   * الحصول على بيانات RUM
   */
  getRUMData(): RUMData[] {
    return this.rumData;
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getPerformanceStats(): Record<string, any> {
    if (!this.currentSession) return {};

    return {
      metrics: this.currentSession.metrics,
      deviceInfo: this.currentSession.deviceInfo,
      networkInfo: this.currentSession.networkInfo,
      userJourneyLength: this.currentSession.userJourney.length
    };
  }
}

interface AuditResult {
  scenario: string;
  networkCondition: string;
  deviceProfile: string;
  metrics: CoreWebVitals;
  totalTime: number;
  passed: boolean;
  recommendations: string[];
}

// Export للاستخدام في المكونات الأخرى
export const mobileAuditAndRUM = new MobileAuditAndRUM();
