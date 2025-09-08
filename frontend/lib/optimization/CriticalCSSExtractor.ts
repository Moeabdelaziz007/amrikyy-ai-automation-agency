/**
 * Critical CSS Extraction System
 * inline الـCSS الأساسي لتسريع الـLCP أكتر
 */

export interface CriticalCSS {
  aboveFold: string;
  belowFold: string;
  mediaQueries: string;
  fonts: string;
}

export class CriticalCSSExtractor {
  private criticalCSS: CriticalCSS = {
    aboveFold: '',
    belowFold: '',
    mediaQueries: '',
    fonts: ''
  };

  constructor() {
    this.extractCriticalCSS();
  }

  /**
   * استخراج الـCSS الحرج للصفحة
   */
  private extractCriticalCSS(): void {
    // CSS الحرج للـabove-the-fold content
    this.criticalCSS.aboveFold = `
      /* Critical Above-the-Fold CSS */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      html {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #ffffff;
        background: #0a0a0a;
      }
      
      body {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
        min-height: 100vh;
        overflow-x: hidden;
      }
      
      /* Header Styles */
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        padding: 1rem 0;
      }
      
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: #00ff88;
        text-decoration: none;
      }
      
      /* Navigation */
      .nav {
        display: flex;
        gap: 2rem;
        list-style: none;
      }
      
      .nav a {
        color: #ffffff;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }
      
      .nav a:hover {
        color: #00ff88;
      }
      
      /* Hero Section */
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem 1rem;
        position: relative;
      }
      
      .hero-content h1 {
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .hero-content p {
        font-size: 1.25rem;
        color: #cccccc;
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }
      
      /* Buttons */
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
        color: #000000;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 255, 136, 0.3);
      }
      
      .btn-secondary {
        background: transparent;
        color: #ffffff;
        border: 2px solid #00ff88;
      }
      
      .btn-secondary:hover {
        background: #00ff88;
        color: #000000;
      }
      
      /* Loading States */
      .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #00ff88;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .hero-content h1 {
          font-size: 2.5rem;
        }
        
        .hero-content p {
          font-size: 1.1rem;
        }
        
        .nav {
          display: none;
        }
      }
    `;

    // CSS للـbelow-the-fold content
    this.criticalCSS.belowFold = `
      /* Below-the-Fold CSS */
      .section {
        padding: 4rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .section h2 {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 3rem;
        color: #ffffff;
      }
      
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .card {
        background: rgba(26, 26, 26, 0.8);
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 1rem;
        padding: 2rem;
        transition: all 0.3s ease;
      }
      
      .card:hover {
        transform: translateY(-5px);
        border-color: #00ff88;
        box-shadow: 0 20px 40px rgba(0, 255, 136, 0.1);
      }
      
      .card h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #00ff88;
      }
      
      .card p {
        color: #cccccc;
        line-height: 1.6;
      }
      
      /* Footer */
      .footer {
        background: rgba(10, 10, 10, 0.95);
        border-top: 1px solid rgba(0, 255, 136, 0.2);
        padding: 2rem 1rem;
        text-align: center;
        color: #cccccc;
      }
      
      /* Animations */
      .fade-in {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
      }
      
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .slide-in-left {
        opacity: 0;
        transform: translateX(-50px);
        animation: slideInLeft 0.6s ease forwards;
      }
      
      @keyframes slideInLeft {
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;

    // Media Queries
    this.criticalCSS.mediaQueries = `
      /* Media Queries */
      @media (max-width: 1200px) {
        .section {
          padding: 3rem 1rem;
        }
        
        .hero-content h1 {
          font-size: 3rem;
        }
      }
      
      @media (max-width: 768px) {
        .hero {
          padding: 1rem;
        }
        
        .hero-content h1 {
          font-size: 2.5rem;
        }
        
        .hero-content p {
          font-size: 1.1rem;
        }
        
        .section {
          padding: 2rem 1rem;
        }
        
        .section h2 {
          font-size: 2rem;
        }
        
        .grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .card {
          padding: 1.5rem;
        }
      }
      
      @media (max-width: 480px) {
        .hero-content h1 {
          font-size: 2rem;
        }
        
        .hero-content p {
          font-size: 1rem;
        }
        
        .btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
        }
      }
      
      /* High DPI Displays */
      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .hero-content h1 {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      }
      
      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Dark Mode Support */
      @media (prefers-color-scheme: dark) {
        html {
          color-scheme: dark;
        }
      }
    `;

    // Font Loading
    this.criticalCSS.fonts = `
      /* Font Loading */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('/fonts/inter-var.woff2') format('woff2');
      }
      
      /* Font Loading Optimization */
      .font-loading {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .font-loaded {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `;
  }

  /**
   * الحصول على الـCSS الحرج للـabove-the-fold
   */
  getAboveFoldCSS(): string {
    return this.criticalCSS.aboveFold;
  }

  /**
   * الحصول على الـCSS الحرج للـbelow-the-fold
   */
  getBelowFoldCSS(): string {
    return this.criticalCSS.belowFold;
  }

  /**
   * الحصول على Media Queries
   */
  getMediaQueries(): string {
    return this.criticalCSS.mediaQueries;
  }

  /**
   * الحصول على Font CSS
   */
  getFontCSS(): string {
    return this.criticalCSS.fonts;
  }

  /**
   * الحصول على جميع الـCSS الحرج
   */
  getAllCriticalCSS(): string {
    return `
      ${this.criticalCSS.fonts}
      ${this.criticalCSS.aboveFold}
      ${this.criticalCSS.mediaQueries}
    `;
  }

  /**
   * تحسين الـCSS للصفحة المحددة
   */
  optimizeForPage(pageType: 'home' | 'bug-fixer' | 'analytics'): string {
    const baseCSS = this.getAllCriticalCSS();
    
    switch (pageType) {
      case 'home':
        return baseCSS + this.getHomePageCSS();
      case 'bug-fixer':
        return baseCSS + this.getBugFixerCSS();
      case 'analytics':
        return baseCSS + this.getAnalyticsCSS();
      default:
        return baseCSS;
    }
  }

  /**
   * CSS خاص بصفحة الرئيسية
   */
  private getHomePageCSS(): string {
    return `
      /* Home Page Specific CSS */
      .hero-animation {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: -1;
      }
      
      .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: #00ff88;
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
    `;
  }

  /**
   * CSS خاص بصفحة Bug Fixer
   */
  private getBugFixerCSS(): string {
    return `
      /* Bug Fixer Page Specific CSS */
      .code-editor {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 0.5rem;
        padding: 1rem;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #ffffff;
        min-height: 300px;
        resize: vertical;
      }
      
      .code-editor:focus {
        outline: none;
        border-color: #00ff88;
        box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.2);
      }
      
      .fix-result {
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid #00ff88;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-top: 1rem;
      }
      
      .fix-result.success {
        background: rgba(0, 255, 136, 0.1);
        border-color: #00ff88;
      }
      
      .fix-result.error {
        background: rgba(255, 0, 0, 0.1);
        border-color: #ff0000;
      }
    `;
  }

  /**
   * CSS خاص بصفحة Analytics
   */
  private getAnalyticsCSS(): string {
    return `
      /* Analytics Page Specific CSS */
      .chart-container {
        background: rgba(26, 26, 26, 0.8);
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 1rem;
        padding: 2rem;
        margin: 1rem 0;
      }
      
      .metric-card {
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 106, 0.1) 100%);
        border: 1px solid rgba(0, 255, 136, 0.3);
        border-radius: 0.5rem;
        padding: 1.5rem;
        text-align: center;
      }
      
      .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #00ff88;
        margin-bottom: 0.5rem;
      }
      
      .metric-label {
        color: #cccccc;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .trend-up {
        color: #00ff88;
      }
      
      .trend-down {
        color: #ff6b6b;
      }
      
      .trend-stable {
        color: #ffd93d;
      }
    `;
  }

  /**
   * إنشاء CSS محسن للطباعة
   */
  getPrintCSS(): string {
    return `
      @media print {
        * {
          background: white !important;
          color: black !important;
          box-shadow: none !important;
        }
        
        .header,
        .footer,
        .btn,
        .nav {
          display: none !important;
        }
        
        .hero {
          min-height: auto;
          padding: 2rem 0;
        }
        
        .section {
          padding: 1rem 0;
        }
        
        .card {
          border: 1px solid #ccc;
          break-inside: avoid;
        }
      }
    `;
  }

  /**
   * تحسين الـCSS للأداء
   */
  optimizeCSS(css: string): string {
    return css
      // إزالة التعليقات
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // إزالة المسافات الزائدة
      .replace(/\s+/g, ' ')
      // إزالة المسافات حول الرموز الخاصة
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      // إزالة المسافات في نهاية الأسطر
      .replace(/\s*$/gm, '')
      // إزالة الأسطر الفارغة
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  /**
   * إنشاء CSS مع تحسين الأداء
   */
  getOptimizedCSS(pageType?: string): string {
    const css = pageType ? this.optimizeForPage(pageType as any) : this.getAllCriticalCSS();
    return this.optimizeCSS(css);
  }
}

// Export for use in other modules
export const criticalCSSExtractor = new CriticalCSSExtractor();
