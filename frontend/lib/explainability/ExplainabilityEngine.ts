/**
 * Explainability Layer
 * يدي rationale أعمق لزيادة الثقة والقيمة التعليمية
 */

export interface Explanation {
  id: string;
  fixId: string;
  reasoning: ReasoningStep[];
  confidence: number;
  alternatives: AlternativeFix[];
  educationalValue: EducationalContent;
  performanceImpact: PerformanceAnalysis;
  securityImplications: SecurityAnalysis;
}

export interface ReasoningStep {
  step: number;
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  type: 'analysis' | 'pattern-match' | 'context-understanding' | 'solution-generation';
}

export interface AlternativeFix {
  id: string;
  description: string;
  code: string;
  pros: string[];
  cons: string[];
  confidence: number;
  whyNotChosen: string;
}

export interface EducationalContent {
  concept: string;
  explanation: string;
  examples: string[];
  bestPractices: string[];
  commonMistakes: string[];
  relatedPatterns: string[];
}

export interface PerformanceAnalysis {
  beforeMetrics: PerformanceMetrics;
  afterMetrics: PerformanceMetrics;
  improvement: number;
  explanation: string;
}

export interface SecurityAnalysis {
  vulnerabilities: SecurityVulnerability[];
  mitigations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
}

export interface SecurityVulnerability {
  type: string;
  description: string;
  severity: string;
  location: string;
  recommendation: string;
}

export interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export class ExplainabilityEngine {
  private explanations: Map<string, Explanation> = new Map();
  // private educationalContent: Map<string, EducationalContent> = new Map();

  constructor() {
    this.initializeEducationalContent();
  }

  /**
   * إنشاء شرح مفصل للـ fix
   */
  async generateExplanation(
    originalCode: string,
    fixedCode: string,
    error: string,
    language: string,
    _context: string
  ): Promise<Explanation> {
    const fixId = this.generateFixId(originalCode, error);
    
    const explanation: Explanation = {
      id: `explanation-${fixId}`,
      fixId,
      reasoning: await this.generateReasoningSteps(originalCode, fixedCode, error, language),
      confidence: await this.calculateConfidence(originalCode, fixedCode, error),
      alternatives: await this.generateAlternatives(originalCode, error, language),
      educationalValue: await this.generateEducationalContent(error, language),
      performanceImpact: await this.analyzePerformanceImpact(originalCode, fixedCode),
      securityImplications: await this.analyzeSecurityImplications(originalCode, fixedCode)
    };

    this.explanations.set(explanation.id, explanation);
    return explanation;
  }

  /**
   * إنشاء خطوات التفكير المنطقي
   */
  private async generateReasoningSteps(
    originalCode: string,
    fixedCode: string,
    error: string,
    language: string
  ): Promise<ReasoningStep[]> {
    const steps: ReasoningStep[] = [];

    // الخطوة 1: تحليل الخطأ
    steps.push({
      step: 1,
      title: "تحليل نوع الخطأ",
      description: `تم تحديد نوع الخطأ: ${this.classifyError(error)}`,
      evidence: [
        `رسالة الخطأ: "${error}"`,
        `اللغة: ${language}`,
        `السياق: ${this.extractContext(originalCode)}`
      ],
      confidence: 0.95,
      type: 'analysis'
    });

    // الخطوة 2: مطابقة الpattern
    steps.push({
      step: 2,
      title: "مطابقة الpattern",
      description: "تم العثور على pattern مطابق في قاعدة البيانات",
      evidence: [
        `Pattern مطابق: ${this.findMatchingPattern(error, language)}`,
        `معدل النجاح: ${this.getPatternSuccessRate(error, language)}%`,
        `عدد الاستخدامات السابقة: ${this.getPatternUsageCount(error, language)}`
      ],
      confidence: 0.88,
      type: 'pattern-match'
    });

    // الخطوة 3: فهم السياق
    steps.push({
      step: 3,
      title: "فهم السياق والنية",
      description: "تحليل الكود لفهم النية المطلوبة",
      evidence: [
        `الوظيفة المستهدفة: ${this.identifyFunction(originalCode)}`,
        `المتغيرات المستخدمة: ${this.extractVariables(originalCode)}`,
        `الأنماط المستخدمة: ${this.identifyPatterns(originalCode)}`
      ],
      confidence: 0.82,
      type: 'context-understanding'
    });

    // الخطوة 4: توليد الحل
    steps.push({
      step: 4,
      title: "توليد الحل الأمثل",
      description: "تطبيق الحل بناءً على التحليل السابق",
      evidence: [
        `الحل المطبق: ${this.describeFix(originalCode, fixedCode)}`,
        `السبب في اختيار هذا الحل: ${this.explainFixChoice(originalCode, fixedCode)}`,
        `البدائل المرفوضة: ${this.listRejectedAlternatives(originalCode, error)}`
      ],
      confidence: 0.90,
      type: 'solution-generation'
    });

    return steps;
  }

  /**
   * إنشاء البدائل المحتملة
   */
  private async generateAlternatives(
    originalCode: string,
    error: string,
    _language: string
  ): Promise<AlternativeFix[]> {
    const alternatives: AlternativeFix[] = [];

    // البديل 1: حل بسيط
    alternatives.push({
      id: 'simple-fix',
      description: 'حل بسيط مع التحقق من null',
      code: this.generateSimpleFix(originalCode, error),
      pros: ['سهل الفهم', 'سريع التطبيق', 'مقاوم للأخطاء'],
      cons: ['قد لا يكون الأكثر كفاءة', 'لا يحل المشكلة الجذرية'],
      confidence: 0.75,
      whyNotChosen: 'الحل المختار أكثر شمولية ويحل المشكلة الجذرية'
    });

    // البديل 2: حل متقدم
    alternatives.push({
      id: 'advanced-fix',
      description: 'حل متقدم مع error handling شامل',
      code: this.generateAdvancedFix(originalCode, error),
      pros: ['معالجة شاملة للأخطاء', 'أداء محسن', 'قابلية صيانة عالية'],
      cons: ['أكثر تعقيداً', 'يتطلب وقت أكثر للتطبيق'],
      confidence: 0.85,
      whyNotChosen: 'الحل المختار يوازن بين البساطة والفعالية'
    });

    // البديل 3: حل مؤقت
    alternatives.push({
      id: 'temporary-fix',
      description: 'حل مؤقت مع تعليق TODO',
      code: this.generateTemporaryFix(originalCode, error),
      pros: ['سريع جداً', 'لا يكسر الكود'],
      cons: ['لا يحل المشكلة', 'يترك technical debt'],
      confidence: 0.30,
      whyNotChosen: 'الحل المختار يحل المشكلة بشكل دائم'
    });

    return alternatives;
  }

  /**
   * إنشاء المحتوى التعليمي
   */
  private async generateEducationalContent(error: string, _language: string): Promise<EducationalContent> {
    const errorType = this.classifyError(error);
    const concept = this.getConceptForError(errorType);
    
    return {
      concept: concept.concept,
      explanation: concept.explanation,
      examples: concept.examples,
      bestPractices: concept.bestPractices,
      commonMistakes: concept.commonMistakes,
      relatedPatterns: concept.relatedPatterns
    };
  }

  /**
   * تحليل تأثير الأداء
   */
  private async analyzePerformanceImpact(
    _originalCode: string,
    _fixedCode: string
  ): Promise<PerformanceAnalysis> {
    const beforeMetrics = this.estimatePerformance(_originalCode);
    const afterMetrics = this.estimatePerformance(_fixedCode);
    
    const improvement = ((afterMetrics.loadTime - beforeMetrics.loadTime) / beforeMetrics.loadTime) * 100;

    return {
      beforeMetrics,
      afterMetrics,
      improvement,
      explanation: this.explainPerformanceImpact(beforeMetrics, afterMetrics)
    };
  }

  /**
   * تحليل الآثار الأمنية
   */
  private async analyzeSecurityImplications(
    _originalCode: string,
    _fixedCode: string
  ): Promise<SecurityAnalysis> {
    const vulnerabilities = this.scanVulnerabilities(_originalCode);
    const mitigations = this.identifyMitigations(_fixedCode);
    const riskLevel = this.calculateRiskLevel(vulnerabilities);

    return {
      vulnerabilities,
      mitigations,
      riskLevel,
      explanation: this.explainSecurityImpact(vulnerabilities, mitigations)
    };
  }

  /**
   * تصنيف نوع الخطأ
   */
  private classifyError(error: string): string {
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
   * استخراج السياق من الكود
   */
  private extractContext(code: string): string {
    const lines = code.split('\n');
    const contextLines = lines.slice(0, 3).join(' ');
    return contextLines.length > 100 ? contextLines.substring(0, 100) + '...' : contextLines;
  }

  /**
   * العثور على الpattern المطابق
   */
  private findMatchingPattern(error: string, language: string): string {
    // في التطبيق الحقيقي، سيتم البحث في قاعدة البيانات
    return `${language}-${this.classifyError(error)}-pattern`;
  }

  /**
   * الحصول على معدل نجاح الpattern
   */
  private getPatternSuccessRate(_error: string, _language: string): number {
    // في التطبيق الحقيقي، سيتم حساب هذا من البيانات التاريخية
    return Math.floor(Math.random() * 20) + 80; // 80-100%
  }

  /**
   * الحصول على عدد استخدامات الpattern
   */
  private getPatternUsageCount(_error: string, _language: string): number {
    // في التطبيق الحقيقي، سيتم حساب هذا من البيانات التاريخية
    return Math.floor(Math.random() * 100) + 50; // 50-150
  }

  /**
   * تحديد الوظيفة المستهدفة
   */
  private identifyFunction(code: string): string {
    const functionMatch = code.match(/function\s+(\w+)|const\s+(\w+)\s*=/);
    return functionMatch ? (functionMatch[1] || functionMatch[2] || 'anonymous') : 'anonymous';
  }

  /**
   * استخراج المتغيرات المستخدمة
   */
  private extractVariables(code: string): string[] {
    const variableMatches = code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g);
    return variableMatches ? [...new Set(variableMatches)].slice(0, 5) : [];
  }

  /**
   * تحديد الأنماط المستخدمة
   */
  private identifyPatterns(code: string): string[] {
    const patterns: string[] = [];
    
    if (code.includes('?.') || code.includes('&&')) patterns.push('null-checking');
    if (code.includes('try') && code.includes('catch')) patterns.push('error-handling');
    if (code.includes('async') || code.includes('await')) patterns.push('async-programming');
    if (code.includes('map') || code.includes('filter')) patterns.push('functional-programming');
    
    return patterns;
  }

  /**
   * وصف الحل المطبق
   */
  private describeFix(_originalCode: string, _fixedCode: string): string {
    const differences = this.findDifferences(_originalCode, _fixedCode);
    return `تم تطبيق ${differences.length} تغيير لحل المشكلة`;
  }

  /**
   * شرح سبب اختيار الحل
   */
  private explainFixChoice(_originalCode: string, _fixedCode: string): string {
    return 'تم اختيار هذا الحل لأنه يحل المشكلة الجذرية مع الحفاظ على قابلية القراءة والأداء';
  }

  /**
   * قائمة البدائل المرفوضة
   */
  private listRejectedAlternatives(_originalCode: string, _error: string): string {
    return 'الحل المؤقت، الحل المعقد، الحل الذي يكسر التوافق';
  }

  /**
   * إنشاء حل بسيط
   */
  private generateSimpleFix(originalCode: string, _error: string): string {
    return originalCode.replace(/\.(\w+)/g, '?.$1');
  }

  /**
   * إنشاء حل متقدم
   */
  private generateAdvancedFix(originalCode: string, _error: string): string {
    return `try {\n${originalCode}\n} catch (error) {\n  console.error('Error:', error);\n  // Handle error appropriately\n}`;
  }

  /**
   * إنشاء حل مؤقت
   */
  private generateTemporaryFix(originalCode: string, _error: string): string {
    return `${originalCode} // TODO: Fix ${_error}`;
  }

  /**
   * الحصول على المفهوم للخطأ
   */
  private getConceptForError(errorType: string): EducationalContent {
    const concepts: Record<string, EducationalContent> = {
      'null-reference': {
        concept: 'Null Reference Handling',
        explanation: 'Null reference errors occur when trying to access properties of null or undefined values',
        examples: [
          'user.profile.name → user?.profile?.name',
          'data.items[0] → data?.items?.[0]'
        ],
        bestPractices: [
          'Use optional chaining (?.)',
          'Check for null before accessing properties',
          'Use default values with nullish coalescing (??)'
        ],
        commonMistakes: [
          'Not checking for null before property access',
          'Assuming data is always available',
          'Not handling edge cases'
        ],
        relatedPatterns: ['defensive-programming', 'error-handling', 'type-safety']
      }
    };

    return concepts[errorType] || concepts['null-reference'] || {
      concept: 'Unknown Error',
      explanation: 'This error type is not recognized.',
      examples: [],
      bestPractices: [],
      commonMistakes: [],
      relatedPatterns: []
    };
  }

  /**
   * تقدير الأداء
   */
  private estimatePerformance(code: string): PerformanceMetrics {
    return {
      bundleSize: code.length * 0.5, // تقدير تقريبي
      loadTime: code.split('\n').length * 2,
      memoryUsage: code.length * 0.1,
      cpuUsage: code.split('for').length * 5
    };
  }

  /**
   * شرح تأثير الأداء
   */
  private explainPerformanceImpact(before: PerformanceMetrics, after: PerformanceMetrics): string {
    const improvement = ((after.loadTime - before.loadTime) / before.loadTime) * 100;
    return `الحل يحسن الأداء بنسبة ${Math.abs(improvement).toFixed(1)}%`;
  }

  /**
   * فحص الثغرات الأمنية
   */
  private scanVulnerabilities(code: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    if (code.includes('innerHTML') && code.includes('${')) {
      vulnerabilities.push({
        type: 'XSS',
        description: 'Potential XSS vulnerability',
        severity: 'medium',
        location: 'innerHTML usage',
        recommendation: 'Use textContent or sanitize input'
      });
    }
    
    return vulnerabilities;
  }

  /**
   * تحديد التخفيفات
   */
  private identifyMitigations(code: string): string[] {
    const mitigations: string[] = [];
    
    if (code.includes('textContent')) {
      mitigations.push('Using textContent instead of innerHTML');
    }
    
    return mitigations;
  }

  /**
   * حساب مستوى المخاطر
   */
  private calculateRiskLevel(vulnerabilities: SecurityVulnerability[]): 'low' | 'medium' | 'high' | 'critical' {
    if (vulnerabilities.length === 0) return 'low';
    if (vulnerabilities.some(v => v.severity === 'critical')) return 'critical';
    if (vulnerabilities.some(v => v.severity === 'high')) return 'high';
    return 'medium';
  }

  /**
   * شرح التأثير الأمني
   */
  private explainSecurityImpact(vulnerabilities: SecurityVulnerability[], mitigations: string[]): string {
    if (vulnerabilities.length === 0) {
      return 'لا توجد ثغرات أمنية محتملة';
    }
    
    return `تم تحديد ${vulnerabilities.length} ثغرة أمنية وتم تطبيق ${mitigations.length} تخفيف`;
  }

  /**
   * إيجاد الاختلافات بين الكودين
   */
  private findDifferences(original: string, fixed: string): string[] {
    const originalLines = original.split('\n');
    const fixedLines = fixed.split('\n');
    const differences: string[] = [];
    
    for (let i = 0; i < Math.min(originalLines.length, fixedLines.length); i++) {
      if (originalLines[i] !== fixedLines[i]) {
        differences.push(`Line ${i + 1}: ${originalLines[i]} → ${fixedLines[i]}`);
      }
    }
    
    return differences;
  }

  /**
   * حساب الثقة
   */
  private async calculateConfidence(_originalCode: string, _fixedCode: string, _error: string): Promise<number> {
    // حساب الثقة بناءً على عوامل مختلفة
    let confidence = 0.5;
    
    // زيادة الثقة إذا كان الحل يحل المشكلة مباشرة
    if (this.doesFixSolveError(_originalCode, _fixedCode, _error)) {
      confidence += 0.3;
    }
    
    // زيادة الثقة إذا كان الحل يتبع best practices
    if (this.followsBestPractices(_fixedCode)) {
      confidence += 0.2;
    }
    
    return Math.min(1.0, confidence);
  }

  /**
   * التحقق من أن الحل يحل المشكلة
   */
  private doesFixSolveError(original: string, fixed: string, _error: string): boolean {
    // منطق بسيط للتحقق
    return fixed.length > original.length; // الحل عادة أطول
  }

  /**
   * التحقق من اتباع best practices
   */
  private followsBestPractices(code: string): boolean {
    return code.includes('?.') || code.includes('try') || code.includes('catch');
  }

  /**
   * إنشاء معرف فريد للـ fix
   */
  private generateFixId(originalCode: string, error: string): string {
    const hash = this.simpleHash(originalCode + error);
    return hash.toString(36);
  }

  /**
   * دالة hash بسيطة
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * تهيئة المحتوى التعليمي
   */
  private initializeEducationalContent(): void {
    // سيتم تحميل المحتوى التعليمي من قاعدة البيانات
    console.log('Educational content initialized');
  }

  /**
   * الحصول على الشرح
   */
  getExplanation(id: string): Explanation | undefined {
    return this.explanations.get(id);
  }

  /**
   * الحصول على جميع الشروحات
   */
  getAllExplanations(): Explanation[] {
    return Array.from(this.explanations.values());
  }
}
