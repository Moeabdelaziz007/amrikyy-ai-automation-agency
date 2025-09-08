/**
 * VSCode Extension for AI Bug Fixer
 * Extension ecosystem للـ IDEs
 */

// package.json for VSCode Extension
export const vscodeExtensionManifest = {
  "name": "ai-bug-fixer",
  "displayName": "AI Bug Fixer",
  "description": "AI-powered bug detection and fixing for multiple languages",
  "version": "1.0.0",
  "publisher": "amrikyy-team",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": ["Linters", "Other"],
  "activationEvents": [
    "onLanguage:javascript",
    "onLanguage:typescript",
    "onLanguage:python",
    "onLanguage:java",
    "onCommand:ai-bug-fixer.fixCode"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "ai-bug-fixer.fixCode",
        "title": "Fix Code with AI",
        "category": "AI Bug Fixer"
      },
      {
        "command": "ai-bug-fixer.analyzeCode",
        "title": "Analyze Code",
        "category": "AI Bug Fixer"
      },
      {
        "command": "ai-bug-fixer.explainFix",
        "title": "Explain Fix",
        "category": "AI Bug Fixer"
      }
    ],
    "keybindings": [
      {
        "command": "ai-bug-fixer.fixCode",
        "key": "ctrl+shift+f",
        "mac": "cmd+shift+f",
        "when": "editorTextFocus"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "ai-bug-fixer.fixCode",
          "group": "ai-bug-fixer",
          "when": "editorHasSelection"
        },
        {
          "command": "ai-bug-fixer.analyzeCode",
          "group": "ai-bug-fixer"
        }
      ],
      "commandPalette": [
        {
          "command": "ai-bug-fixer.fixCode"
        },
        {
          "command": "ai-bug-fixer.analyzeCode"
        },
        {
          "command": "ai-bug-fixer.explainFix"
        }
      ]
    },
    "configuration": {
      "title": "AI Bug Fixer",
      "properties": {
        "ai-bug-fixer.apiUrl": {
          "type": "string",
          "default": "http://localhost:3000/api/bug-fixer",
          "description": "API URL for AI Bug Fixer service"
        },
        "ai-bug-fixer.autoFix": {
          "type": "boolean",
          "default": false,
          "description": "Automatically fix bugs when detected"
        },
        "ai-bug-fixer.showExplanations": {
          "type": "boolean",
          "default": true,
          "description": "Show detailed explanations for fixes"
        },
        "ai-bug-fixer.languages": {
          "type": "array",
          "default": ["javascript", "typescript", "python"],
          "description": "Supported programming languages"
        }
      }
    }
  }
};

// Extension Main Code
export class VSCodeExtension {
  private context: any;
  private apiUrl: string;

  constructor(context: any) {
    this.context = context;
    this.apiUrl = this.getConfiguration('apiUrl');
    // this.outputChannel = this.createOutputChannel();
  }

  /**
   * تسجيل الأوامر
   */
  registerCommands(): void {
    // أمر إصلاح الكود
    this.context.subscriptions.push(
      this.context.commands.registerCommand('ai-bug-fixer.fixCode', () => {
        this.fixCode();
      })
    );

    // أمر تحليل الكود
    this.context.subscriptions.push(
      this.context.commands.registerCommand('ai-bug-fixer.analyzeCode', () => {
        this.analyzeCode();
      })
    );

    // أمر شرح الإصلاح
    this.context.subscriptions.push(
      this.context.commands.registerCommand('ai-bug-fixer.explainFix', () => {
        this.explainFix();
      })
    );
  }

  /**
   * إصلاح الكود المحدد
   */
  private async fixCode(): Promise<void> {
    const editor = this.context.window.activeTextEditor;
    if (!editor) {
      this.context.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    
    if (!selectedText) {
      this.context.window.showWarningMessage('No code selected');
      return;
    }

    try {
      this.context.window.showInformationMessage('🔧 Fixing code with AI...');
      
      const language = this.detectLanguage(editor.document.languageId);
      const result = await this.callBugFixerAPI(selectedText, language);
      
      if (result.success) {
        // تطبيق الإصلاح
        await editor.edit((editBuilder: any) => {
          editBuilder.replace(selection, result.fixedCode);
        });
        
        this.context.window.showInformationMessage('✅ Code fixed successfully!');
        
        // عرض الشرح إذا كان مفعلاً
        if (this.getConfiguration('showExplanations')) {
          this.showExplanation(result.explanation);
        }
      } else {
        this.context.window.showErrorMessage('❌ Failed to fix code');
      }
    } catch (error) {
      this.context.window.showErrorMessage(`Error: ${(error as Error).message}`);
    }
  }

  /**
   * تحليل الكود
   */
  private async analyzeCode(): Promise<void> {
    const editor = this.context.window.activeTextEditor;
    if (!editor) {
      this.context.window.showWarningMessage('No active editor found');
      return;
    }

    const document = editor.document;
    const language = this.detectLanguage(document.languageId);
    
    try {
      this.context.window.showInformationMessage('🔍 Analyzing code...');
      
      const analysis = await this.analyzeCodeWithAI(document.getText(), language);
      
      // عرض النتائج في panel
      this.showAnalysisResults(analysis);
      
    } catch (error) {
      this.context.window.showErrorMessage(`Analysis error: ${(error as Error).message}`);
    }
  }

  /**
   * شرح الإصلاح
   */
  private async explainFix(): Promise<void> {
    const editor = this.context.window.activeTextEditor;
    if (!editor) return;

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    
    if (!selectedText) {
      this.context.window.showWarningMessage('No code selected');
      return;
    }

    try {
      const language = this.detectLanguage(editor.document.languageId);
      const explanation = await this.getExplanation(selectedText, language);
      
      this.showExplanation(explanation);
      
    } catch (error) {
      this.context.window.showErrorMessage(`Explanation error: ${(error as Error).message}`);
    }
  }

  /**
   * استدعاء API إصلاح الأخطاء
   */
  private async callBugFixerAPI(code: string, language: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/fix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        preferences: {
          style: 'conservative',
          includeComments: true,
          includeTests: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * تحليل الكود مع AI
   */
  private async analyzeCodeWithAI(_code: string, _language: string): Promise<any> {
    // تحليل محلي للكود
    const analysis = {
      language: _language,
      lines: _code.split('\n').length,
      complexity: this.calculateComplexity(_code),
      potentialIssues: this.findPotentialIssues(_code, _language),
      suggestions: this.generateSuggestions(_code, _language)
    };

    return analysis;
  }

  /**
   * الحصول على الشرح
   */
  private async getExplanation(_code: string, _language: string): Promise<any> {
    // في التطبيق الحقيقي، سيتم استدعاء ExplainabilityEngine
    return {
      reasoning: [
        {
          step: 1,
          title: "تحليل الكود",
          description: "تم تحليل الكود وتحديد المشاكل المحتملة",
          confidence: 0.9
        }
      ],
      alternatives: [],
      educationalValue: {
        concept: "Code Analysis",
        explanation: "This code analysis helps understand potential issues",
        bestPractices: ["Use proper error handling", "Follow naming conventions"]
      }
    };
  }

  /**
   * عرض نتائج التحليل
   */
  private showAnalysisResults(analysis: any): void {
    const panel = this.context.window.createWebviewPanel(
      'ai-bug-fixer-analysis',
      'AI Code Analysis',
      this.context.ViewColumn.Two,
      { enableScripts: true }
    );

    panel.webview.html = this.getAnalysisWebviewContent(analysis);
  }

  /**
   * عرض الشرح
   */
  private showExplanation(explanation: any): void {
    const panel = this.context.window.createWebviewPanel(
      'ai-bug-fixer-explanation',
      'AI Fix Explanation',
      this.context.ViewColumn.Two,
      { enableScripts: true }
    );

    panel.webview.html = this.getExplanationWebviewContent(explanation);
  }

  /**
   * محتوى webview للتحليل
   */
  private getAnalysisWebviewContent(analysis: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Code Analysis</title>
        <style>
          body { font-family: var(--vscode-font-family); padding: 20px; }
          .metric { margin: 10px 0; padding: 10px; background: var(--vscode-editor-background); border-radius: 5px; }
          .issue { color: var(--vscode-errorForeground); margin: 5px 0; }
          .suggestion { color: var(--vscode-textLink-foreground); margin: 5px 0; }
        </style>
      </head>
      <body>
        <h2>🔍 AI Code Analysis Results</h2>
        
        <div class="metric">
          <strong>Language:</strong> ${analysis.language}
        </div>
        
        <div class="metric">
          <strong>Lines of Code:</strong> ${analysis.lines}
        </div>
        
        <div class="metric">
          <strong>Complexity:</strong> ${analysis.complexity}
        </div>
        
        <h3>🚨 Potential Issues</h3>
        ${analysis.potentialIssues.map((issue: string) => `<div class="issue">• ${issue}</div>`).join('')}
        
        <h3>💡 Suggestions</h3>
        ${analysis.suggestions.map((suggestion: string) => `<div class="suggestion">• ${suggestion}</div>`).join('')}
      </body>
      </html>
    `;
  }

  /**
   * محتوى webview للشرح
   */
  private getExplanationWebviewContent(explanation: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Fix Explanation</title>
        <style>
          body { font-family: var(--vscode-font-family); padding: 20px; }
          .step { margin: 15px 0; padding: 15px; background: var(--vscode-editor-background); border-radius: 5px; }
          .step-title { font-weight: bold; color: var(--vscode-textLink-foreground); }
          .confidence { color: var(--vscode-textPreformat-foreground); font-size: 0.9em; }
        </style>
      </head>
      <body>
        <h2>📖 AI Fix Explanation</h2>
        
        ${explanation.reasoning.map((step: any) => `
          <div class="step">
            <div class="step-title">Step ${step.step}: ${step.title}</div>
            <div>${step.description}</div>
            <div class="confidence">Confidence: ${(step.confidence * 100).toFixed(1)}%</div>
          </div>
        `).join('')}
        
        <h3>🎓 Educational Value</h3>
        <div class="step">
          <div class="step-title">${explanation.educationalValue.concept}</div>
          <div>${explanation.educationalValue.explanation}</div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * اكتشاف اللغة
   */
  private detectLanguage(_languageId: string): string {
    const languageMap: Record<string, string> = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'csharp': 'csharp'
    };

    return languageMap[_languageId] || 'javascript';
  }

  /**
   * حساب التعقيد
   */
  private calculateComplexity(_code: string): number {
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', '&&', '||', '?'];
    let complexity = 1;

    for (const keyword of complexityKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = _code.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  /**
   * إيجاد المشاكل المحتملة
   */
  private findPotentialIssues(_code: string, _language: string): string[] {
    const issues: string[] = [];

    // فحص null references
    if (_code.includes('.') && !_code.includes('?.') && !_code.includes('if')) {
      issues.push('Potential null reference - consider using optional chaining');
    }

    // فحص error handling
    if (_code.includes('throw') && !_code.includes('try')) {
      issues.push('Missing try-catch block for error handling');
    }

    // فحص async/await
    if (_code.includes('async') && _code.includes('Promise.all')) {
      issues.push('Consider using Promise.allSettled for better error handling');
    }

    return issues;
  }

  /**
   * توليد الاقتراحات
   */
  private generateSuggestions(_code: string, _language: string): string[] {
    const suggestions: string[] = [];

    suggestions.push('Add proper error handling');
    suggestions.push('Use TypeScript for better type safety');
    suggestions.push('Add unit tests for critical functions');
    suggestions.push('Consider using ESLint for code quality');

    return suggestions;
  }

  /**
   * الحصول على الإعدادات
   */
  private getConfiguration(key: string): any {
    return this.context.workspace.getConfiguration('ai-bug-fixer').get(key);
  }

  /**
   * إنشاء قناة الإخراج
   */
  // private createOutputChannel(): any {
  //   return this.context.window.createOutputChannel('AI Bug Fixer');
  // }
}

// JetBrains Plugin Configuration
export const jetbrainsPluginManifest = {
  "id": "com.amrikyy.aibugfixer",
  "name": "AI Bug Fixer",
  "version": "1.0.0",
  "vendor": "Amrikyy Team",
  "description": "AI-powered bug detection and fixing",
  "change-notes": "Initial release with AI bug fixing capabilities",
  "idea-version": {
    "since-build": "223",
    "until-build": "233.*"
  },
  "depends": [
    "com.intellij.modules.platform",
    "com.intellij.modules.java"
  ],
  "extensions": [
    {
      "id": "com.amrikyy.aibugfixer.AIBugFixerExtension",
      "points": [
        "com.intellij.codeInsight.intention.IntentionAction"
      ]
    }
  ],
  "actions": [
    {
      "id": "FixCodeAction",
      "class": "com.amrikyy.aibugfixer.FixCodeAction",
      "text": "Fix Code with AI",
      "description": "Fix code using AI analysis",
      "icon": "icons/fix.png"
    }
  ]
};
