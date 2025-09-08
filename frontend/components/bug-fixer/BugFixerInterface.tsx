'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, 
  Code, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Zap,
  Copy,
  Download,
  Play,
  RefreshCw
} from 'lucide-react';
import { ClickFeedback, HoverGlow } from '../ui/MicroInteraction';

interface BugFixResponse {
  success: boolean;
  originalCode: string;
  fixedCode: string;
  analysis: {
    language: string;
    errorType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    rootCause: string;
    securityIssues: Array<{
      type: string;
      severity: string;
      description: string;
      recommendation: string;
    }>;
    codeQuality: {
      complexity: number;
      maintainability: number;
      readability: number;
      performance: number;
    };
  };
  appliedFixes: Array<{
    id: string;
    description: string;
    confidence: number;
    explanation: string;
  }>;
  warnings: string[];
  suggestions: string[];
}

export default function BugFixerInterface() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [error, setError] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BugFixResponse | null>(null);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'fix' | 'analysis' | 'security'>('fix');

  useEffect(() => {
    fetchSupportedLanguages();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await fetch('/api/bug-fixer/languages');
      const data = await response.json();
      setSupportedLanguages(data.languages || []);
    } catch (error) {
      console.error('Failed to fetch supported languages:', error);
    }
  };

  const handleFixCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/bug-fixer/fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          error: error || undefined,
          context: context || undefined,
          preferences: {
            style: 'conservative',
            includeComments: true,
            includeTests: false
          }
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to fix code:', error);
      setResult({
        success: false,
        originalCode: code,
        fixedCode: code,
        analysis: {
          language,
          errorType: 'unknown',
          severity: 'low',
          rootCause: 'Failed to analyze code',
          securityIssues: [],
          codeQuality: { complexity: 0, maintainability: 0, readability: 0, performance: 0 }
        },
        appliedFixes: [],
        warnings: ['Failed to process request'],
        suggestions: ['Please check your input and try again']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-carbon-black via-medium-gray to-carbon-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <HoverGlow>
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Bug className="w-10 h-10 text-neon-green mr-3" />
              AI Bug Fixer
            </h1>
          </HoverGlow>
          <p className="text-gray-300 text-lg">
            Intelligent code analysis and automated bug fixing across multiple languages
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-neon-green/20 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Code className="w-5 h-5 text-neon-green mr-2" />
              Code Input
            </h2>

            <div className="space-y-4">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-medium-gray border border-neon-green/30 rounded-lg px-3 py-2 text-white focus:border-neon-green focus:outline-none"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang} className="bg-medium-gray">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code to Fix
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="w-full h-64 bg-medium-gray border border-neon-green/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-neon-green focus:outline-none resize-none"
                />
              </div>

              {/* Error Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Error Message (Optional)
                </label>
                <textarea
                  value={error}
                  onChange={(e) => setError(e.target.value)}
                  placeholder="Paste the error message here..."
                  className="w-full h-20 bg-medium-gray border border-neon-green/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-neon-green focus:outline-none resize-none"
                />
              </div>

              {/* Context */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe what the code should do..."
                  className="w-full h-20 bg-medium-gray border border-neon-green/30 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-green focus:outline-none resize-none"
                />
              </div>

              {/* Fix Button */}
              <ClickFeedback>
                <button
                  onClick={handleFixCode}
                  disabled={isLoading || !code.trim()}
                  className="w-full bg-gradient-to-r from-neon-green to-cyber-blue text-black font-bold py-3 px-6 rounded-lg hover:from-neon-green/80 hover:to-cyber-blue/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Fix Code
                    </>
                  )}
                </button>
              </ClickFeedback>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-neon-green/20 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-neon-green mr-2" />
              Analysis Results
            </h2>

            {!result ? (
              <div className="text-center text-gray-400 py-12">
                <Bug className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Submit code to see analysis results</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex space-x-2 border-b border-neon-green/20">
                  {[
                    { id: 'fix', label: 'Fixed Code', icon: Code },
                    { id: 'analysis', label: 'Analysis', icon: AlertTriangle },
                    { id: 'security', label: 'Security', icon: Shield }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-neon-green text-neon-green'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-1" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'fix' && (
                    <motion.div
                      key="fix"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {/* Success Status */}
                      <div className={`p-3 rounded-lg flex items-center ${
                        result.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 mr-2" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 mr-2" />
                        )}
                        {result.success ? 'Code fixed successfully!' : 'Failed to fix code'}
                      </div>

                      {/* Fixed Code */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-300">
                            Fixed Code
                          </label>
                          <div className="flex space-x-2">
                            <ClickFeedback>
                              <button
                                onClick={() => copyToClipboard(result.fixedCode)}
                                className="p-1 text-gray-400 hover:text-neon-green"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </ClickFeedback>
                            <ClickFeedback>
                              <button
                                onClick={() => downloadCode(result.fixedCode, 'fixed-code.txt')}
                                className="p-1 text-gray-400 hover:text-neon-green"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </ClickFeedback>
                          </div>
                        </div>
                        <pre className="bg-medium-gray border border-neon-green/30 rounded-lg p-4 text-white font-mono text-sm overflow-x-auto">
                          {result.fixedCode}
                        </pre>
                      </div>

                      {/* Applied Fixes */}
                      {result.appliedFixes.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Applied Fixes</h3>
                          {result.appliedFixes.map((fix, index) => (
                            <div key={index} className="bg-medium-gray border border-neon-green/20 rounded-lg p-3 mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-white">{fix.description}</span>
                                <span className="text-sm text-gray-400">
                                  {Math.round(fix.confidence * 100)}% confidence
                                </span>
                              </div>
                              <p className="text-sm text-gray-300">{fix.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'analysis' && (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {/* Error Analysis */}
                      <div className="bg-medium-gray border border-neon-green/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-3">Error Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-400">Error Type:</span>
                            <p className="text-white font-medium">{result.analysis.errorType}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Severity:</span>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(result.analysis.severity)}`}>
                              {result.analysis.severity}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-sm text-gray-400">Root Cause:</span>
                          <p className="text-white">{result.analysis.rootCause}</p>
                        </div>
                      </div>

                      {/* Code Quality Metrics */}
                      <div className="bg-medium-gray border border-neon-green/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-3">Code Quality</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-400">Complexity:</span>
                            <p className={`font-medium ${getQualityColor(100 - result.analysis.codeQuality.complexity * 10)}`}>
                              {result.analysis.codeQuality.complexity}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Maintainability:</span>
                            <p className={`font-medium ${getQualityColor(result.analysis.codeQuality.maintainability)}`}>
                              {result.analysis.codeQuality.maintainability}%
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Readability:</span>
                            <p className={`font-medium ${getQualityColor(result.analysis.codeQuality.readability)}`}>
                              {result.analysis.codeQuality.readability}%
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Performance:</span>
                            <p className={`font-medium ${getQualityColor(result.analysis.codeQuality.performance)}`}>
                              {result.analysis.codeQuality.performance}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Warnings */}
                      {result.warnings.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                            Warnings
                          </h3>
                          {result.warnings.map((warning, index) => (
                            <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-2">
                              <p className="text-yellow-400">{warning}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {result.suggestions.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                            <Zap className="w-5 h-5 text-neon-green mr-2" />
                            Suggestions
                          </h3>
                          {result.suggestions.map((suggestion, index) => (
                            <div key={index} className="bg-neon-green/10 border border-neon-green/20 rounded-lg p-3 mb-2">
                              <p className="text-neon-green">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {result.analysis.securityIssues.length === 0 ? (
                        <div className="text-center text-green-400 py-8">
                          <Shield className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg font-medium">No security issues detected!</p>
                          <p className="text-sm text-gray-400">Your code appears to be secure</p>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Shield className="w-5 h-5 text-red-500 mr-2" />
                            Security Issues ({result.analysis.securityIssues.length})
                          </h3>
                          {result.analysis.securityIssues.map((issue, index) => (
                            <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-red-400">{issue.type}</span>
                                <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(issue.severity)}`}>
                                  {issue.severity}
                                </span>
                              </div>
                              <p className="text-white mb-2">{issue.description}</p>
                              <div className="bg-medium-gray border border-red-500/20 rounded p-2">
                                <span className="text-sm text-gray-400">Recommendation:</span>
                                <p className="text-white text-sm">{issue.recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
