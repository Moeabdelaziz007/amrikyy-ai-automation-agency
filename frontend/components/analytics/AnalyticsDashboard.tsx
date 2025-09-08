'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Code, 
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Eye,
  Brain,
  Target
} from 'lucide-react';
import { ClickFeedback, HoverGlow } from '../ui/MicroInteraction';

interface AnalyticsData {
  totalFixes: number;
  successRate: number;
  averageConfidence: number;
  languagesBreakdown: Array<{
    language: string;
    totalFixes: number;
    successRate: number;
    averageConfidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  errorTypesBreakdown: Array<{
    errorType: string;
    frequency: number;
    successRate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  insights: Array<{
    id: string;
    type: 'trend' | 'anomaly' | 'recommendation' | 'achievement';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    actionable: boolean;
  }>;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'languages' | 'errors' | 'insights'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 60000); // تحديث كل دقيقة
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      // في التطبيق الحقيقي، سيتم استدعاء API
      const mockData: AnalyticsData = {
        totalFixes: 1247,
        successRate: 0.89,
        averageConfidence: 0.87,
        languagesBreakdown: [
          { language: 'JavaScript', totalFixes: 456, successRate: 0.92, averageConfidence: 0.89, trend: 'increasing' },
          { language: 'TypeScript', totalFixes: 389, successRate: 0.88, averageConfidence: 0.85, trend: 'stable' },
          { language: 'Python', totalFixes: 234, successRate: 0.91, averageConfidence: 0.87, trend: 'increasing' },
          { language: 'Java', totalFixes: 168, successRate: 0.86, averageConfidence: 0.83, trend: 'decreasing' }
        ],
        errorTypesBreakdown: [
          { errorType: 'Null Reference', frequency: 234, successRate: 0.94, trend: 'stable' },
          { errorType: 'Type Mismatch', frequency: 189, successRate: 0.87, trend: 'increasing' },
          { errorType: 'Syntax Error', frequency: 156, successRate: 0.96, trend: 'decreasing' },
          { errorType: 'Undefined Variable', frequency: 123, successRate: 0.89, trend: 'stable' }
        ],
        insights: [
          {
            id: '1',
            type: 'achievement',
            title: 'نمو في استخدام النظام',
            description: 'تم إصلاح 1247 خطأ هذا الشهر، بزيادة 15% عن الشهر الماضي',
            impact: 'high',
            actionable: false
          },
          {
            id: '2',
            type: 'recommendation',
            title: 'تحسين مطلوب في Java',
            description: 'يُنصح بتحسين الأداء في Java - معدل النجاح 86%',
            impact: 'medium',
            actionable: true
          },
          {
            id: '3',
            type: 'trend',
            title: 'زيادة في Type Mismatch',
            description: 'تم اكتشاف زيادة في أخطاء Type Mismatch بنسبة 12%',
            impact: 'medium',
            actionable: true
          }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'recommendation': return <Target className="w-5 h-5 text-blue-400" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'anomaly': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Eye className="w-5 h-5 text-gray-400" />;
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    if (!analyticsData) return;
    
    const data = format === 'json' 
      ? JSON.stringify(analyticsData, null, 2)
      : convertToCSV(analyticsData);
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: AnalyticsData): string => {
    const headers = ['Language', 'Total Fixes', 'Success Rate', 'Confidence', 'Trend'];
    const rows = data.languagesBreakdown.map(lang => [
      lang.language,
      lang.totalFixes,
      (lang.successRate * 100).toFixed(1),
      (lang.averageConfidence * 100).toFixed(1),
      lang.trend
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-carbon-black via-medium-gray to-carbon-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-neon-green animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">جاري تحميل بيانات التحليلات...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-carbon-black via-medium-gray to-carbon-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">خطأ في تحميل البيانات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-carbon-black via-medium-gray to-carbon-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <HoverGlow>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <BarChart3 className="w-10 h-10 text-neon-green mr-3" />
                Analytics Dashboard
              </h1>
            </HoverGlow>
            <p className="text-gray-300 text-lg">
              تحليلات شاملة لأداء نظام إصلاح الأخطاء
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-medium-gray border border-neon-green/30 rounded-lg px-3 py-2 text-white focus:border-neon-green focus:outline-none"
            >
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوم</option>
              <option value="90d">آخر 90 يوم</option>
            </select>
            
            {/* Export Buttons */}
            <ClickFeedback>
              <button
                onClick={() => exportData('json')}
                className="bg-neon-green text-black px-4 py-2 rounded-lg hover:bg-neon-green/80 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </button>
            </ClickFeedback>
            
            <ClickFeedback>
              <button
                onClick={() => exportData('csv')}
                className="bg-cyber-blue text-white px-4 py-2 rounded-lg hover:bg-cyber-blue/80 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </button>
            </ClickFeedback>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-card border border-neon-green/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">إجمالي الإصلاحات</p>
                <p className="text-3xl font-bold text-white">{analyticsData.totalFixes.toLocaleString()}</p>
              </div>
              <Code className="w-8 h-8 text-neon-green" />
            </div>
          </div>
          
          <div className="bg-card border border-neon-green/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">معدل النجاح</p>
                <p className="text-3xl font-bold text-white">{(analyticsData.successRate * 100).toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-card border border-neon-green/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">متوسط الثقة</p>
                <p className="text-3xl font-bold text-white">{(analyticsData.averageConfidence * 100).toFixed(1)}%</p>
              </div>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-neon-green/20 rounded-lg p-6"
        >
          <div className="flex space-x-2 border-b border-neon-green/20 mb-6">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'languages', label: 'اللغات', icon: Code },
              { id: 'errors', label: 'أنواع الأخطاء', icon: AlertTriangle },
              { id: 'insights', label: 'الرؤى', icon: Eye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? 'border-neon-green text-neon-green'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {selectedTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Languages Chart */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">أداء اللغات</h3>
                    <div className="space-y-3">
                      {analyticsData.languagesBreakdown.map((lang) => (
                        <div key={lang.language} className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
                          <div className="flex items-center">
                            <span className="text-white font-medium">{lang.language}</span>
                            {getTrendIcon(lang.trend)}
                          </div>
                          <div className="text-right">
                            <p className="text-white">{lang.totalFixes} إصلاح</p>
                            <p className="text-sm text-gray-400">{(lang.successRate * 100).toFixed(1)}% نجاح</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error Types Chart */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">أنواع الأخطاء</h3>
                    <div className="space-y-3">
                      {analyticsData.errorTypesBreakdown.map((error) => (
                        <div key={error.errorType} className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
                          <div className="flex items-center">
                            <span className="text-white font-medium">{error.errorType}</span>
                            {getTrendIcon(error.trend)}
                          </div>
                          <div className="text-right">
                            <p className="text-white">{error.frequency} تكرار</p>
                            <p className="text-sm text-gray-400">{(error.successRate * 100).toFixed(1)}% نجاح</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {analyticsData.insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`border rounded-lg p-4 ${getImpactColor(insight.impact)}`}
                  >
                    <div className="flex items-start">
                      {getInsightIcon(insight.type)}
                      <div className="ml-3 flex-1">
                        <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                        <p className="text-gray-300 mt-1">{insight.description}</p>
                        {insight.actionable && (
                          <button className="mt-2 text-neon-green hover:text-neon-green/80 text-sm">
                            عرض الإجراءات المطلوبة →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
