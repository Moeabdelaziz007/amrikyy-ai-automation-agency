/**
 * Meta-Learning Loop System
 * يتعلم من كل bug fix ويحدّث الpatterns بشكل مستمر
 */

export interface LearningPattern {
  id: string;
  language: string;
  errorType: string;
  pattern: string;
  confidence: number;
  successRate: number;
  usageCount: number;
  lastUpdated: Date;
  examples: LearningExample[];
}

export interface LearningExample {
  id: string;
  originalCode: string;
  fixedCode: string;
  error: string;
  language: string;
  context: string;
  success: boolean;
  userFeedback?: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

export interface MetaLearningMetrics {
  totalFixes: number;
  successRate: number;
  averageConfidence: number;
  patternsLearned: number;
  languagesSupported: number;
  improvementRate: number;
}

export class MetaLearningEngine {
  private patterns: Map<string, LearningPattern> = new Map();
  private examples: LearningExample[] = [];
  private metrics: MetaLearningMetrics = {
    totalFixes: 0,
    successRate: 0,
    averageConfidence: 0,
    patternsLearned: 0,
    languagesSupported: 0,
    improvementRate: 0
  };

  constructor() {
    this.initializePatterns();
    this.loadLearningData();
  }

  /**
   * يتعلم من كل fix جديد ويحدّث الpatterns
   */
  async learnFromFix(example: LearningExample): Promise<void> {
    try {
      // إضافة المثال للتعلم
      this.examples.push(example);
      
      // تحديث الpatterns الموجودة
      await this.updateExistingPatterns(example);
      
      // إنشاء patterns جديدة إذا لزم الأمر
      await this.createNewPatterns(example);
      
      // تحديث الmetrics
      this.updateMetrics();
      
      // حفظ البيانات للاستخدام المستقبلي
      await this.saveLearningData();
      
      console.log(`Meta-Learning: Learned from ${example.id}`);
    } catch (error) {
      console.error('Meta-Learning Error:', error);
    }
  }

  /**
   * تحديث الpatterns الموجودة بناءً على التعلم الجديد
   */
  private async updateExistingPatterns(example: LearningExample): Promise<void> {
    const relevantPatterns = this.findRelevantPatterns(example);
    
    for (const pattern of relevantPatterns) {
      // تحديث معدل النجاح
      if (example.success) {
        pattern.successRate = (pattern.successRate * pattern.usageCount + 1) / (pattern.usageCount + 1);
      } else {
        pattern.successRate = (pattern.successRate * pattern.usageCount) / (pattern.usageCount + 1);
      }
      
      // تحديث عدد الاستخدامات
      pattern.usageCount++;
      
      // تحديث الثقة بناءً على النجاح
      if (example.success) {
        pattern.confidence = Math.min(1.0, pattern.confidence + 0.05);
      } else {
        pattern.confidence = Math.max(0.1, pattern.confidence - 0.1);
      }
      
      // إضافة المثال للpattern
      pattern.examples.push(example);
      
      // الاحتفاظ بآخر 10 أمثلة فقط
      if (pattern.examples.length > 10) {
        pattern.examples = pattern.examples.slice(-10);
      }
      
      pattern.lastUpdated = new Date();
    }
  }

  /**
   * إنشاء patterns جديدة من الأمثلة الجديدة
   */
  private async createNewPatterns(example: LearningExample): Promise<void> {
    const errorType = this.extractErrorType(example.error);
    const patternKey = `${example.language}-${errorType}`;
    
    if (!this.patterns.has(patternKey)) {
      const newPattern: LearningPattern = {
        id: patternKey,
        language: example.language,
        errorType,
        pattern: this.generatePatternFromExample(example),
        confidence: example.success ? 0.8 : 0.3,
        successRate: example.success ? 1.0 : 0.0,
        usageCount: 1,
        lastUpdated: new Date(),
        examples: [example]
      };
      
      this.patterns.set(patternKey, newPattern);
      console.log(`Meta-Learning: Created new pattern for ${patternKey}`);
    }
  }

  /**
   * إيجاد الpatterns ذات الصلة بالمثال الجديد
   */
  private findRelevantPatterns(example: LearningExample): LearningPattern[] {
    const relevantPatterns: LearningPattern[] = [];
    
    for (const pattern of this.patterns.values()) {
      if (pattern.language === example.language) {
        // تحقق من التشابه في نوع الخطأ
        if (this.isErrorTypeSimilar(pattern.errorType, example.error)) {
          relevantPatterns.push(pattern);
        }
      }
    }
    
    return relevantPatterns;
  }

  /**
   * استخراج نوع الخطأ من رسالة الخطأ
   */
  private extractErrorType(error: string): string {
    const errorPatterns = {
      'null-reference': /Cannot read property|Cannot read properties|is null|is undefined/i,
      'type-mismatch': /Type.*is not assignable|incompatible types/i,
      'syntax-error': /SyntaxError|Unexpected token|Parse error/i,
      'undefined-variable': /is not defined|Cannot find name/i,
      'missing-property': /Property.*does not exist|has no property/i
    };
    
    for (const [type, pattern] of Object.entries(errorPatterns)) {
      if (pattern.test(error)) {
        return type;
      }
    }
    
    return 'unknown';
  }

  /**
   * إنشاء pattern جديد من المثال
   */
  private generatePatternFromExample(example: LearningExample): string {
    // تحليل الكود الأصلي والمُصحح لاستخراج الpattern
    const originalLines = example.originalCode.split('\n');
    const fixedLines = example.fixedCode.split('\n');
    
    // البحث عن الاختلافات الرئيسية
    const differences = this.findCodeDifferences(originalLines, fixedLines);
    
    // إنشاء regex pattern من الاختلافات
    return this.createRegexPattern(differences);
  }

  /**
   * إيجاد الاختلافات بين الكود الأصلي والمُصحح
   */
  private findCodeDifferences(original: string[], fixed: string[]): string[] {
    const differences: string[] = [];
    
    for (let i = 0; i < Math.min(original.length, fixed.length); i++) {
      if (original[i] !== fixed[i]) {
        differences.push(fixed[i] || '');
      }
    }
    
    return differences;
  }

  /**
   * إنشاء regex pattern من الاختلافات
   */
  private createRegexPattern(differences: string[]): string {
    if (differences.length === 0) return '';
    
    // تحليل الاختلافات المشتركة
    const commonPatterns = this.extractCommonPatterns(differences);
    
    // إنشاء regex pattern
    return commonPatterns.join('|');
  }

  /**
   * استخراج الpatterns المشتركة من الاختلافات
   */
  private extractCommonPatterns(differences: string[]): string[] {
    const patterns: string[] = [];
    
    for (const diff of differences) {
      // البحث عن patterns شائعة مثل optional chaining
      if (diff.includes('?.') && !diff.includes('?.') === false) {
        patterns.push('optional-chaining');
      }
      
      // البحث عن type assertions
      if (diff.includes('as ') || diff.includes(':')) {
        patterns.push('type-assertion');
      }
      
      // البحث عن null checks
      if (diff.includes('if (') && diff.includes('!== null')) {
        patterns.push('null-check');
      }
    }
    
    return patterns;
  }

  /**
   * تحديث الmetrics العامة
   */
  private updateMetrics(): void {
    this.metrics.totalFixes = this.examples.length;
    
    const successfulFixes = this.examples.filter(e => e.success).length;
    this.metrics.successRate = successfulFixes / this.examples.length;
    
    const totalConfidence = Array.from(this.patterns.values())
      .reduce((sum, p) => sum + p.confidence, 0);
    this.metrics.averageConfidence = totalConfidence / this.patterns.size;
    
    this.metrics.patternsLearned = this.patterns.size;
    
    const languages = new Set(Array.from(this.patterns.values()).map(p => p.language));
    this.metrics.languagesSupported = languages.size;
    
    // حساب معدل التحسن
    this.metrics.improvementRate = this.calculateImprovementRate();
  }

  /**
   * حساب معدل التحسن في الأداء
   */
  private calculateImprovementRate(): number {
    if (this.examples.length < 10) return 0;
    
    const recentExamples = this.examples.slice(-10);
    const olderExamples = this.examples.slice(-20, -10);
    
    const recentSuccessRate = recentExamples.filter(e => e.success).length / recentExamples.length;
    const olderSuccessRate = olderExamples.filter(e => e.success).length / olderExamples.length;
    
    return recentSuccessRate - olderSuccessRate;
  }

  /**
   * الحصول على الpatterns المُحسنة للاستخدام
   */
  getOptimizedPatterns(): LearningPattern[] {
    return Array.from(this.patterns.values())
      .filter(p => p.confidence > 0.5 && p.successRate > 0.7)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * الحصول على الmetrics الحالية
   */
  getMetrics(): MetaLearningMetrics {
    return { ...this.metrics };
  }

  /**
   * تحليل الأداء حسب اللغة
   */
  getLanguageAnalytics(): Record<string, any> {
    const analytics: Record<string, any> = {};
    
    for (const pattern of this.patterns.values()) {
      if (!analytics[pattern.language]) {
        analytics[pattern.language] = {
          patterns: 0,
          successRate: 0,
          averageConfidence: 0,
          commonErrors: new Map()
        };
      }
      
      analytics[pattern.language].patterns++;
      analytics[pattern.language].successRate += pattern.successRate;
      analytics[pattern.language].averageConfidence += pattern.confidence;
      
      // تتبع الأخطاء الشائعة
      const errorCount = analytics[pattern.language].commonErrors.get(pattern.errorType) || 0;
      analytics[pattern.language].commonErrors.set(pattern.errorType, errorCount + 1);
    }
    
    // حساب المتوسطات
    for (const lang in analytics) {
      analytics[lang].successRate /= analytics[lang].patterns;
      analytics[lang].averageConfidence /= analytics[lang].patterns;
    }
    
    return analytics;
  }

  /**
   * تهيئة الpatterns الأساسية
   */
  private initializePatterns(): void {
    const basicPatterns = [
      {
        id: 'javascript-null-reference',
        language: 'javascript',
        errorType: 'null-reference',
        pattern: 'Cannot read property.*of (null|undefined)',
        confidence: 0.9,
        successRate: 0.95,
        usageCount: 100,
        lastUpdated: new Date(),
        examples: []
      },
      {
        id: 'typescript-type-mismatch',
        language: 'typescript',
        errorType: 'type-mismatch',
        pattern: 'Type.*is not assignable to type',
        confidence: 0.85,
        successRate: 0.90,
        usageCount: 80,
        lastUpdated: new Date(),
        examples: []
      }
    ];
    
    for (const pattern of basicPatterns) {
      this.patterns.set(pattern.id, pattern);
    }
  }

  /**
   * تحقق من تشابه نوع الخطأ
   */
  private isErrorTypeSimilar(patternType: string, error: string): boolean {
    const similarityMap: Record<string, RegExp[]> = {
      'null-reference': [/Cannot read property/i, /is null/i, /is undefined/i],
      'type-mismatch': [/Type.*not assignable/i, /incompatible types/i],
      'syntax-error': [/SyntaxError/i, /Unexpected token/i],
      'undefined-variable': [/is not defined/i, /Cannot find name/i]
    };
    
    const patterns = similarityMap[patternType] || [];
    return patterns.some(pattern => pattern.test(error));
  }

  /**
   * حفظ بيانات التعلم
   */
  private async saveLearningData(): Promise<void> {
    try {
      const data = {
        patterns: Array.from(this.patterns.entries()),
        examples: this.examples.slice(-1000), // الاحتفاظ بآخر 1000 مثال
        metrics: this.metrics,
        timestamp: new Date()
      };
      
      // في التطبيق الحقيقي، سيتم حفظ البيانات في قاعدة بيانات
      if (typeof window !== 'undefined') {
        localStorage.setItem('meta-learning-data', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving learning data:', error);
    }
  }

  /**
   * تحميل بيانات التعلم المحفوظة
   */
  private loadLearningData(): void {
    try {
      if (typeof window === 'undefined') return;
      
      const data = localStorage.getItem('meta-learning-data');
      if (data) {
        const parsed = JSON.parse(data);
        
        this.patterns = new Map(parsed.patterns);
        this.examples = parsed.examples || [];
        this.metrics = parsed.metrics || this.metrics;
        
        console.log('Meta-Learning: Loaded existing data');
      }
    } catch (error) {
      console.error('Error loading learning data:', error);
    }
  }
}
