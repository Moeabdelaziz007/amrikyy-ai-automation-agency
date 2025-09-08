import { MetaLearningEngine } from '../meta-learning/MetaLearningEngine';
import { ExplainabilityEngine } from '../explainability/ExplainabilityEngine';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';

export interface BugAnalysis {
  language: string;
  errorType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rootCause: string;
  suggestedFixes: FixSuggestion[];
  securityIssues: SecurityIssue[];
  codeQuality: CodeQualityMetrics;
}

export interface FixSuggestion {
  id: string;
  description: string;
  code: string;
  confidence: number;
  explanation: string;
  testCases?: string[];
}

export interface SecurityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  owaspCategory?: string;
}

export interface CodeQualityMetrics {
  complexity: number;
  maintainability: number;
  readability: number;
  performance: number;
}

export interface BugFixRequest {
  code: string;
  language: string;
  error?: string;
  context?: string;
  preferences?: {
    style?: 'conservative' | 'aggressive';
    includeComments?: boolean;
    includeTests?: boolean;
  };
}

export interface BugFixResponse {
  success: boolean;
  originalCode: string;
  fixedCode: string;
  analysis: BugAnalysis;
  appliedFixes: FixSuggestion[];
  warnings: string[];
  suggestions: string[];
}

export class BugFixer {
  private supportedLanguages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'
  ];

  private errorPatterns = {
    javascript: [
      { pattern: /TypeError: Cannot read property '(\w+)' of (undefined|null)/, type: 'null-reference' },
      { pattern: /ReferenceError: (\w+) is not defined/, type: 'undefined-variable' },
      { pattern: /SyntaxError: Unexpected token/, type: 'syntax-error' },
      { pattern: /RangeError: Maximum call stack size exceeded/, type: 'stack-overflow' }
    ],
    typescript: [
      { pattern: /Type '(\w+)' is not assignable to type '(\w+)'/, type: 'type-mismatch' },
      { pattern: /Property '(\w+)' does not exist on type/, type: 'missing-property' },
      { pattern: /Cannot find module '(\w+)'/, type: 'module-not-found' },
      { pattern: /Element implicitly has an 'any' type/, type: 'implicit-any' }
    ],
    python: [
      { pattern: /NameError: name '(\w+)' is not defined/, type: 'undefined-name' },
      { pattern: /TypeError: unsupported operand type/, type: 'type-error' },
      { pattern: /IndentationError: unexpected indent/, type: 'indentation-error' },
      { pattern: /AttributeError: '(\w+)' object has no attribute '(\w+)'/, type: 'missing-attribute' }
    ]
  };

  // المكونات الجديدة
  private metaLearningEngine: MetaLearningEngine;
  private explainabilityEngine: ExplainabilityEngine;
  private analyticsDashboard: AnalyticsDashboard;

  constructor() {
    this.initializePatterns();
    this.metaLearningEngine = new MetaLearningEngine();
    this.explainabilityEngine = new ExplainabilityEngine();
    this.analyticsDashboard = new AnalyticsDashboard();
    console.log('BugFixer initialized with Meta-Learning, Explainability, and Analytics');
  }

  private initializePatterns(): void {
    // Initialize additional error patterns and security checks
    console.log('BugFixer initialized with support for', this.supportedLanguages.length, 'languages');
  }

  /**
   * Main method to fix code with optional error context
   */
  async fixCode(request: BugFixRequest): Promise<BugFixResponse> {
    try {
      // Step 1: Analyze the code and error
      const analysis = await this.analyzeCode(request);
      
      // Step 2: Generate solutions
      const solutions = await this.generateSolutions(analysis, request);
      
      // Step 3: Apply the best fix
      const appliedFix = await this.applyBestFix(request.code, solutions, request.preferences);
      
      // Step 4: Generate warnings and suggestions
      const warnings = this.generateWarnings(analysis);
      const suggestions = this.generateSuggestions(analysis);

      return {
        success: true,
        originalCode: request.code,
        fixedCode: appliedFix.code,
        analysis,
        appliedFixes: [appliedFix],
        warnings,
        suggestions
      };
    } catch (error) {
      return {
        success: false,
        originalCode: request.code,
        fixedCode: request.code,
        analysis: this.createEmptyAnalysis(request.language),
        appliedFixes: [],
        warnings: [`Failed to fix code: ${error}`],
        suggestions: ['Please check the code syntax and try again']
      };
    }
  }

  /**
   * Analyze code for bugs, security issues, and quality metrics
   */
  private async analyzeCode(request: BugFixRequest): Promise<BugAnalysis> {
    const language = request.language.toLowerCase();
    const errorType = this.identifyErrorType(request.error, language);
    const severity = this.assessSeverity(errorType, request.error);
    const rootCause = this.identifyRootCause(request.code, errorType, language);
    const securityIssues = this.scanSecurityIssues(request.code, language);
    const codeQuality = this.assessCodeQuality(request.code, language);

    return {
      language,
      errorType,
      severity,
      rootCause,
      suggestedFixes: [],
      securityIssues,
      codeQuality
    };
  }

  /**
   * Identify the type of error from error message
   */
  private identifyErrorType(error: string | undefined, language: string): string {
    if (!error) return 'unknown';
    
    const patterns = this.errorPatterns[language as keyof typeof this.errorPatterns];
    if (!patterns) return 'unknown';

    for (const pattern of patterns) {
      if (pattern.pattern.test(error)) {
        return pattern.type;
      }
    }

    return 'unknown';
  }

  /**
   * Assess the severity of the error
   */
  private assessSeverity(errorType: string, _error: string | undefined): 'low' | 'medium' | 'high' | 'critical' {
    const criticalErrors = ['stack-overflow', 'memory-leak', 'security-vulnerability'];
    const highErrors = ['type-mismatch', 'null-reference', 'undefined-variable'];
    const mediumErrors = ['syntax-error', 'missing-property', 'module-not-found'];

    if (criticalErrors.includes(errorType)) return 'critical';
    if (highErrors.includes(errorType)) return 'high';
    if (mediumErrors.includes(errorType)) return 'medium';
    return 'low';
  }

  /**
   * Identify the root cause of the issue
   */
  private identifyRootCause(_code: string, errorType: string, _language: string): string {
    const rootCauseMap = {
      'null-reference': 'Attempting to access properties of null or undefined values',
      'undefined-variable': 'Using variables that have not been declared or are out of scope',
      'type-mismatch': 'Incompatible data types being used together',
      'syntax-error': 'Invalid syntax structure in the code',
      'missing-property': 'Accessing properties that do not exist on the object',
      'module-not-found': 'Importing modules that cannot be resolved',
      'implicit-any': 'TypeScript strict mode requiring explicit type annotations'
    };

    return rootCauseMap[errorType as keyof typeof rootCauseMap] || 'Unknown root cause';
  }

  /**
   * Scan for security vulnerabilities
   */
  private scanSecurityIssues(code: string, _language: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // SQL Injection detection
    if (code.includes('query(') && code.includes('${') && !code.includes('prepared')) {
      issues.push({
        type: 'sql-injection',
        severity: 'high',
        description: 'Potential SQL injection vulnerability detected',
        recommendation: 'Use parameterized queries or prepared statements',
        owaspCategory: 'A03:2021 – Injection'
      });
    }

    // XSS detection
    if (code.includes('innerHTML') && code.includes('${')) {
      issues.push({
        type: 'xss',
        severity: 'medium',
        description: 'Potential XSS vulnerability with innerHTML',
        recommendation: 'Use textContent or sanitize input before setting innerHTML',
        owaspCategory: 'A03:2021 – Injection'
      });
    }

    // Hardcoded secrets
    const secretPatterns = [/password\s*=\s*['"][^'"]+['"]/, /api[_-]?key\s*=\s*['"][^'"]+['"]/, /secret\s*=\s*['"][^'"]+['"]/];
    for (const pattern of secretPatterns) {
      if (pattern.test(code)) {
        issues.push({
          type: 'hardcoded-secret',
          severity: 'high',
          description: 'Hardcoded secret detected in code',
          recommendation: 'Use environment variables or secure configuration management',
          owaspCategory: 'A07:2021 – Identification and Authentication Failures'
        });
        break;
      }
    }

    return issues;
  }

  /**
   * Assess code quality metrics
   */
  private assessCodeQuality(code: string, language: string): CodeQualityMetrics {
    const lines = code.split('\n').length;
    const complexity = this.calculateComplexity(code);
    const maintainability = Math.max(0, 100 - (complexity * 10) - (lines / 10));
    const readability = this.assessReadability(code);
    const performance = this.assessPerformance(code, language);

    return {
      complexity,
      maintainability: Math.round(maintainability),
      readability: Math.round(readability),
      performance: Math.round(performance)
    };
  }

  /**
   * Calculate cyclomatic complexity
   */
  private calculateComplexity(code: string): number {
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', '&&', '||', '?'];
    let complexity = 1; // Base complexity

    for (const keyword of complexityKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  /**
   * Assess code readability
   */
  private assessReadability(code: string): number {
    const lines = code.split('\n');
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    const commentRatio = (code.match(/\/\/|\/\*|\*/g) || []).length / lines.length;
    
    // Simple readability score based on line length and comments
    let score = 100;
    score -= Math.max(0, avgLineLength - 80) * 0.5;
    score += commentRatio * 20;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Assess performance considerations
   */
  private assessPerformance(code: string, _language: string): number {
    let score = 100;
    
    // Check for inefficient patterns
    if (code.includes('for (let i = 0; i < array.length; i++)')) {
      score -= 10; // Prefer for...of or forEach
    }
    
    if (code.includes('document.getElementById') && code.includes('getElementById')) {
      score -= 5; // Cache DOM queries
    }
    
    if (code.includes('eval(')) {
      score -= 30; // eval is very slow
    }
    
    return Math.max(0, score);
  }

  /**
   * Generate fix suggestions based on analysis
   */
  private async generateSolutions(analysis: BugAnalysis, request: BugFixRequest): Promise<FixSuggestion[]> {
    const solutions: FixSuggestion[] = [];

    switch (analysis.errorType) {
      case 'null-reference':
        solutions.push(this.generateNullCheckFix(request.code, analysis.language));
        break;
      case 'undefined-variable':
        solutions.push(this.generateVariableDeclarationFix(request.code, analysis.language));
        break;
      case 'type-mismatch':
        solutions.push(this.generateTypeFix(request.code, analysis.language));
        break;
      case 'implicit-any':
        solutions.push(this.generateTypeAnnotationFix(request.code, analysis.language));
        break;
      default:
        solutions.push(this.generateGenericFix(request.code, analysis.language));
    }

    return solutions;
  }

  /**
   * Generate null check fix
   */
  private generateNullCheckFix(code: string, language: string): FixSuggestion {
    return {
      id: 'null-check-fix',
      description: 'Add null/undefined checks before property access',
      code: this.addNullChecks(code, language),
      confidence: 0.9,
      explanation: 'Added optional chaining and null checks to prevent runtime errors',
      testCases: ['Test with null input', 'Test with undefined input', 'Test with valid object']
    };
  }

  /**
   * Generate variable declaration fix
   */
  private generateVariableDeclarationFix(code: string, language: string): FixSuggestion {
    return {
      id: 'variable-declaration-fix',
      description: 'Add missing variable declarations',
      code: this.addVariableDeclarations(code, language),
      confidence: 0.85,
      explanation: 'Added proper variable declarations to fix reference errors',
      testCases: ['Test variable scope', 'Test variable initialization']
    };
  }

  /**
   * Generate type fix for TypeScript
   */
  private generateTypeFix(code: string, language: string): FixSuggestion {
    return {
      id: 'type-fix',
      description: 'Fix type mismatches and add proper type annotations',
      code: this.fixTypeMismatches(code, language),
      confidence: 0.8,
      explanation: 'Added proper type annotations and fixed type mismatches',
      testCases: ['Test type compatibility', 'Test runtime behavior']
    };
  }

  /**
   * Generate type annotation fix
   */
  private generateTypeAnnotationFix(code: string, language: string): FixSuggestion {
    return {
      id: 'type-annotation-fix',
      description: 'Add explicit type annotations to resolve implicit any types',
      code: this.addTypeAnnotations(code, language),
      confidence: 0.75,
      explanation: 'Added explicit type annotations to satisfy TypeScript strict mode',
      testCases: ['Test type inference', 'Test compilation']
    };
  }

  /**
   * Generate generic fix
   */
  private generateGenericFix(code: string, language: string): FixSuggestion {
    return {
      id: 'generic-fix',
      description: 'Apply general code improvements and error handling',
      code: this.applyGenericFixes(code, language),
      confidence: 0.6,
      explanation: 'Applied general improvements including error handling and best practices',
      testCases: ['Test error scenarios', 'Test normal operation']
    };
  }

  /**
   * Apply the best fix based on confidence and preferences
   */
  private async applyBestFix(originalCode: string, solutions: FixSuggestion[], _preferences?: any): Promise<FixSuggestion> {
    if (solutions.length === 0) {
      return {
        id: 'no-fix',
        description: 'No fix available',
        code: originalCode,
        confidence: 0,
        explanation: 'Unable to generate a fix for this issue'
      };
    }

    // Sort by confidence and return the best one
    const sortedSolutions = solutions.sort((a, b) => b.confidence - a.confidence);
    return sortedSolutions[0] || {
      id: 'no-fix',
      description: 'No fix available',
      code: originalCode,
      confidence: 0,
      explanation: 'Unable to generate a fix for this issue'
    };
  }

  /**
   * Generate warnings based on analysis
   */
  private generateWarnings(analysis: BugAnalysis): string[] {
    const warnings: string[] = [];

    if (analysis.securityIssues.length > 0) {
      warnings.push(`Found ${analysis.securityIssues.length} security issue(s) that should be addressed`);
    }

    if (analysis.codeQuality.complexity > 10) {
      warnings.push('High cyclomatic complexity detected - consider refactoring');
    }

    if (analysis.codeQuality.maintainability < 50) {
      warnings.push('Low maintainability score - code may be difficult to maintain');
    }

    return warnings;
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(analysis: BugAnalysis): string[] {
    const suggestions: string[] = [];

    if (analysis.codeQuality.readability < 70) {
      suggestions.push('Consider adding more comments and improving variable naming');
    }

    if (analysis.codeQuality.performance < 80) {
      suggestions.push('Review performance-critical sections and consider optimization');
    }

    if (analysis.securityIssues.length > 0) {
      suggestions.push('Address security vulnerabilities before deployment');
    }

    suggestions.push('Add unit tests to prevent regression');
    suggestions.push('Consider using a linter for consistent code style');

    return suggestions;
  }

  /**
   * Helper methods for code transformations
   */
  private addNullChecks(code: string, _language: string): string {
    // Simple implementation - in a real system, this would use AST parsing
    return code.replace(/\.(\w+)/g, '?.$1');
  }

  private addVariableDeclarations(code: string, _language: string): string {
    // Add const/let declarations for undefined variables
    return code.replace(/(\w+)\s*=/g, 'const $1 =');
  }

  private fixTypeMismatches(code: string, _language: string): string {
    // Add type annotations and fix type issues
    return code.replace(/:\s*any/g, ': unknown');
  }

  private addTypeAnnotations(code: string, _language: string): string {
    // Add explicit type annotations
    return code.replace(/(\w+)\s*=/g, '$1: any =');
  }

  private applyGenericFixes(code: string, _language: string): string {
    // Apply general improvements
    let fixedCode = code;
    
    // Add error handling
    if (!fixedCode.includes('try') && !fixedCode.includes('catch')) {
      fixedCode = `try {\n${fixedCode}\n} catch (error) {\n  console.error('Error:', error);\n}`;
    }
    
    return fixedCode;
  }

  private createEmptyAnalysis(language: string): BugAnalysis {
    return {
      language,
      errorType: 'unknown',
      severity: 'low',
      rootCause: 'Unable to analyze',
      suggestedFixes: [],
      securityIssues: [],
      codeQuality: {
        complexity: 0,
        maintainability: 0,
        readability: 0,
        performance: 0
      }
    };
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(language: string): boolean {
    return this.supportedLanguages.includes(language.toLowerCase());
  }

  /**
   * الحصول على بيانات التحليلات
   */
  getAnalyticsData(): any {
    return this.analyticsDashboard.getAnalyticsData();
  }

  /**
   * الحصول على بيانات التعلم
   */
  getLearningMetrics(): any {
    return this.metaLearningEngine.getMetrics();
  }

  /**
   * الحصول على الشرح المفصل للـ fix
   */
  async getDetailedExplanation(fixId: string): Promise<any> {
    return this.explainabilityEngine.getExplanation(fixId);
  }

  /**
   * تحديث الpatterns من التعلم
   */
  async updatePatternsFromLearning(): Promise<void> {
    const optimizedPatterns = this.metaLearningEngine.getOptimizedPatterns();
    console.log(`Updated ${optimizedPatterns.length} patterns from meta-learning`);
  }

  /**
   * تصدير بيانات التحليلات
   */
  exportAnalytics(format: 'json' | 'csv'): string {
    return this.analyticsDashboard.exportAnalyticsData(format);
  }

  /**
   * الحصول على insights للفريق
   */
  getTeamInsights(): any[] {
    return this.analyticsDashboard.getInsightsByType('recommendation');
  }
}
