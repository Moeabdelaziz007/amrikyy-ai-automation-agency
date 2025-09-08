'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  MessageCircle,
  Brain,
  Sparkles,
  ArrowRight,
  Shield,
  Palette,
  Users,
  BarChart3,
  Search
} from 'lucide-react';
import { ClickFeedback, HoverGlow } from '../ui/MicroInteraction';

interface ContextualSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  target: string;
  icon: React.ComponentType<any>;
  category: 'navigation' | 'features' | 'security' | 'themes' | 'agents' | 'analytics';
  priority: 'high' | 'medium' | 'low';
  conditions: string[];
}

interface LanguageConfig {
  code: 'en' | 'ar' | 'es';
  name: string;
  flag: string;
  rtl: boolean;
}

export default function ContextualAIHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'faq' | 'tour' | 'settings'>('suggestions');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'es'>('en');
  const [faqQuery, setFaqQuery] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [isLoadingFAQ, setIsLoadingFAQ] = useState(false);
  const [contextualSuggestions, setContextualSuggestions] = useState<ContextualSuggestion[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const languages: LanguageConfig[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false }
  ];

  const translations = {
    en: {
      title: 'AI Help Center',
      suggestions: 'Smart Suggestions',
      faq: 'AI FAQ',
      tour: 'Interactive Tour',
      settings: 'Settings',
      askQuestion: 'Ask a question...',
      searchFAQ: 'Search FAQ',
      language: 'Language',
      contextualHelp: 'Contextual Help',
      smartSuggestions: 'Based on your current location and actions',
      noSuggestions: 'No suggestions available',
      tryDifferentPage: 'Try navigating to different sections',
      askAI: 'Ask AI',
      poweredBy: 'Powered by AI',
      recentQuestions: 'Recent Questions',
      popularTopics: 'Popular Topics'
    },
    ar: {
      title: 'مركز المساعدة الذكي',
      suggestions: 'اقتراحات ذكية',
      faq: 'الأسئلة الشائعة الذكية',
      tour: 'جولة تفاعلية',
      settings: 'الإعدادات',
      askQuestion: 'اسأل سؤال...',
      searchFAQ: 'البحث في الأسئلة',
      language: 'اللغة',
      contextualHelp: 'مساعدة سياقية',
      smartSuggestions: 'بناءً على موقعك الحالي وأفعالك',
      noSuggestions: 'لا توجد اقتراحات متاحة',
      tryDifferentPage: 'جرب التنقل إلى أقسام مختلفة',
      askAI: 'اسأل الذكي',
      poweredBy: 'مدعوم بالذكاء الاصطناعي',
      recentQuestions: 'الأسئلة الأخيرة',
      popularTopics: 'المواضيع الشائعة'
    },
    es: {
      title: 'Centro de Ayuda IA',
      suggestions: 'Sugerencias Inteligentes',
      faq: 'FAQ IA',
      tour: 'Tour Interactivo',
      settings: 'Configuración',
      askQuestion: 'Haz una pregunta...',
      searchFAQ: 'Buscar FAQ',
      language: 'Idioma',
      contextualHelp: 'Ayuda Contextual',
      smartSuggestions: 'Basado en tu ubicación y acciones actuales',
      noSuggestions: 'No hay sugerencias disponibles',
      tryDifferentPage: 'Intenta navegar a diferentes secciones',
      askAI: 'Preguntar IA',
      poweredBy: 'Impulsado por IA',
      recentQuestions: 'Preguntas Recientes',
      popularTopics: 'Temas Populares'
    }
  };

  const currentTranslations = translations[currentLanguage];

  // Contextual suggestions based on current page/element
  const generateContextualSuggestions = (): ContextualSuggestion[] => {
    const suggestions: ContextualSuggestion[] = [
      {
        id: 'security_logs',
        title: currentLanguage === 'ar' ? 'عرض سجلات التدقيق' : currentLanguage === 'es' ? 'Ver Registros de Auditoría' : 'View Audit Logs',
        description: currentLanguage === 'ar' ? 'تحقق من سجلات الأمان والأنشطة الأخيرة' : currentLanguage === 'es' ? 'Revisa los registros de seguridad y actividades recientes' : 'Check security logs and recent activities',
        action: currentLanguage === 'ar' ? 'اضغط هنا' : currentLanguage === 'es' ? 'Haz clic aquí' : 'Click here',
        target: '[data-help="security-panel"]',
        icon: Shield,
        category: 'security',
        priority: 'high',
        conditions: ['security-panel-visible']
      },
      {
        id: 'theme_customization',
        title: currentLanguage === 'ar' ? 'تخصيص المظهر' : currentLanguage === 'es' ? 'Personalizar Tema' : 'Customize Theme',
        description: currentLanguage === 'ar' ? 'غير الألوان والمظهر حسب تفضيلاتك' : currentLanguage === 'es' ? 'Cambia colores y apariencia según tus preferencias' : 'Change colors and appearance to your preferences',
        action: currentLanguage === 'ar' ? 'اضغط هنا' : currentLanguage === 'es' ? 'Haz clic aquí' : 'Click here',
        target: '[data-help="theme-toggle"]',
        icon: Palette,
        category: 'themes',
        priority: 'medium',
        conditions: ['theme-settings-available']
      },
      {
        id: 'agent_interaction',
        title: currentLanguage === 'ar' ? 'تفاعل مع الوكلاء' : currentLanguage === 'es' ? 'Interactuar con Agentes' : 'Interact with Agents',
        description: currentLanguage === 'ar' ? 'استكشف قدرات الوكلاء الذكيين' : currentLanguage === 'es' ? 'Explora las capacidades de los agentes inteligentes' : 'Explore intelligent agent capabilities',
        action: currentLanguage === 'ar' ? 'اضغط هنا' : currentLanguage === 'es' ? 'Haz clic aquí' : 'Click here',
        target: '[data-help="agent-card"]',
        icon: Users,
        category: 'agents',
        priority: 'high',
        conditions: ['agents-visible']
      },
      {
        id: 'analytics_dashboard',
        title: currentLanguage === 'ar' ? 'لوحة التحليلات' : currentLanguage === 'es' ? 'Panel de Análisis' : 'Analytics Dashboard',
        description: currentLanguage === 'ar' ? 'راقب الأداء والإحصائيات' : currentLanguage === 'es' ? 'Monitorea rendimiento y estadísticas' : 'Monitor performance and statistics',
        action: currentLanguage === 'ar' ? 'اضغط هنا' : currentLanguage === 'es' ? 'Haz clic aquí' : 'Click here',
        target: '[data-help="analytics"]',
        icon: BarChart3,
        category: 'analytics',
        priority: 'medium',
        conditions: ['analytics-visible']
      },
      {
        id: 'global_search',
        title: currentLanguage === 'ar' ? 'البحث الشامل' : currentLanguage === 'es' ? 'Búsqueda Global' : 'Global Search',
        description: currentLanguage === 'ar' ? 'ابحث في جميع أنحاء المنصة' : currentLanguage === 'es' ? 'Busca en toda la plataforma' : 'Search across the entire platform',
        action: currentLanguage === 'ar' ? 'اضغط هنا' : currentLanguage === 'es' ? 'Haz clic aquí' : 'Click here',
        target: '[data-help="search"]',
        icon: Search,
        category: 'navigation',
        priority: 'low',
        conditions: ['search-available']
      }
    ];

    return suggestions;
  };

  // LLM-powered FAQ system
  const handleFAQQuery = async () => {
    if (!faqQuery.trim()) return;

    setIsLoadingFAQ(true);
    
    // Simulate LLM API call
    setTimeout(() => {
      const mockAnswers: Record<string, Record<string, string>> = {
        en: {
          'how to use agents': 'To use AI agents, click on any agent card in the dashboard. Each agent has specific capabilities like content creation, code generation, or data analysis. Click "Run Agent" to start a task.',
          'security settings': 'Access security settings through the Security Panel. You can manage RBAC roles, view audit logs, and configure access controls. Click the security panel toggle to open it.',
          'theme customization': 'Customize your theme using the theme toggle in the header. You can switch between light/dark modes and choose from different color schemes like Bitcoin Space or Cyberpunk.',
          'analytics dashboard': 'The analytics dashboard shows real-time metrics, system health, and performance data. It includes CPU usage, memory consumption, and network I/O statistics.',
          'agent capabilities': 'Each agent has unique capabilities. Content Agent creates blogs and articles, Code Agent generates code, Data Agent analyzes data, Research Agent conducts research, and Design Agent creates prototypes.'
        },
        ar: {
          'كيفية استخدام الوكلاء': 'لاستخدام الوكلاء الذكيين، اضغط على أي بطاقة وكيل في لوحة التحكم. كل وكيل له قدرات محددة مثل إنشاء المحتوى أو توليد الكود أو تحليل البيانات. اضغط "تشغيل الوكيل" لبدء مهمة.',
          'إعدادات الأمان': 'الوصول إلى إعدادات الأمان من خلال لوحة الأمان. يمكنك إدارة أدوار RBAC وعرض سجلات التدقيق وتكوين ضوابط الوصول. اضغط على تبديل لوحة الأمان لفتحها.',
          'تخصيص المظهر': 'خصص مظهرك باستخدام تبديل المظهر في الرأس. يمكنك التبديل بين الوضع الفاتح/الداكن واختيار من مخططات ألوان مختلفة مثل Bitcoin Space أو Cyberpunk.',
          'لوحة التحليلات': 'تعرض لوحة التحليلات المقاييس في الوقت الفعلي وصحة النظام وبيانات الأداء. تتضمن استخدام المعالج واستهلاك الذاكرة وإحصائيات شبكة I/O.',
          'قدرات الوكلاء': 'كل وكيل له قدرات فريدة. وكيل المحتوى ينشئ المدونات والمقالات، وكيل الكود يولد الكود، وكيل البيانات يحلل البيانات، وكيل البحث يجري البحوث، ووكيل التصميم ينشئ النماذج الأولية.'
        },
        es: {
          'cómo usar agentes': 'Para usar agentes IA, haz clic en cualquier tarjeta de agente en el panel. Cada agente tiene capacidades específicas como creación de contenido, generación de código o análisis de datos. Haz clic en "Ejecutar Agente" para iniciar una tarea.',
          'configuración de seguridad': 'Accede a la configuración de seguridad a través del Panel de Seguridad. Puedes gestionar roles RBAC, ver registros de auditoría y configurar controles de acceso. Haz clic en el toggle del panel de seguridad para abrirlo.',
          'personalización de tema': 'Personaliza tu tema usando el toggle de tema en el encabezado. Puedes cambiar entre modos claro/oscuro y elegir entre diferentes esquemas de color como Bitcoin Space o Cyberpunk.',
          'panel de análisis': 'El panel de análisis muestra métricas en tiempo real, salud del sistema y datos de rendimiento. Incluye uso de CPU, consumo de memoria y estadísticas de red I/O.',
          'capacidades de agentes': 'Cada agente tiene capacidades únicas. El Agente de Contenido crea blogs y artículos, el Agente de Código genera código, el Agente de Datos analiza datos, el Agente de Investigación realiza investigaciones y el Agente de Diseño crea prototipos.'
        }
      };

      const query = faqQuery.toLowerCase();
      const answers = mockAnswers[currentLanguage];
      const answer = answers?.[query] || 
        (currentLanguage === 'ar' ? 'عذراً، لم أجد إجابة لهذا السؤال. جرب صياغة السؤال بطريقة مختلفة.' :
         currentLanguage === 'es' ? 'Lo siento, no encontré una respuesta para esta pregunta. Intenta reformular la pregunta de manera diferente.' :
         'Sorry, I couldn\'t find an answer to this question. Try rephrasing your question differently.');

      setFaqAnswer(answer);
      setIsLoadingFAQ(false);
    }, 1500);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        setIsOpen(prev => !prev);
      } else if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Generate contextual suggestions
  useEffect(() => {
    setContextualSuggestions(generateContextualSuggestions());
  }, [currentLanguage]);

  const handleSuggestionClick = (suggestion: ContextualSuggestion) => {
    const element = document.querySelector(suggestion.target) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
      // Add visual highlight
      element.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.5)';
      setTimeout(() => {
        element.style.boxShadow = '';
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-neon-green to-cyber-blue rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === overlayRef.current && setIsOpen(false)}
          >
            <motion.div
              className={`bg-card border border-neon-green/20 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
                currentLanguage === 'ar' ? 'text-right' : ''
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neon-green/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentTranslations.title}</h2>
                    <p className="text-sm text-gray-400">{currentTranslations.poweredBy}</p>
                  </div>
                </div>
                <ClickFeedback>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-neon-green" />
                  </button>
                </ClickFeedback>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-neon-green/20">
                {(['suggestions', 'faq', 'tour', 'settings'] as const).map((tab) => (
                  <ClickFeedback key={tab}>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-neon-green border-b-2 border-neon-green bg-neon-green/5'
                          : 'text-gray-400 hover:text-white hover:bg-neon-green/5'
                      }`}
                    >
                      {currentTranslations[tab]}
                    </button>
                  </ClickFeedback>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'suggestions' && (
                    <motion.div
                      key="suggestions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {currentTranslations.contextualHelp}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {currentTranslations.smartSuggestions}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {contextualSuggestions.map((suggestion, index) => (
                          <HoverGlow key={suggestion.id}>
                            <motion.div
                              className="p-4 bg-gradient-to-r from-carbon-black to-medium-gray rounded-lg border border-neon-green/20 hover:border-neon-green/40 transition-all duration-200 cursor-pointer"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
                                  <suggestion.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white">{suggestion.title}</h4>
                                  <p className="text-sm text-gray-300">{suggestion.description}</p>
                                </div>
                                <div className="flex items-center space-x-2 text-neon-green">
                                  <span className="text-sm font-medium">{suggestion.action}</span>
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </motion.div>
                          </HoverGlow>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'faq' && (
                    <motion.div
                      key="faq"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {currentTranslations.askAI}
                        </h3>
                        
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={faqQuery}
                              onChange={(e) => setFaqQuery(e.target.value)}
                              placeholder={currentTranslations.askQuestion}
                              className="w-full px-4 py-3 bg-gray-800 border border-neon-green/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none"
                              onKeyPress={(e) => e.key === 'Enter' && handleFAQQuery()}
                            />
                          </div>
                          <ClickFeedback>
                            <button
                              onClick={handleFAQQuery}
                              disabled={isLoadingFAQ || !faqQuery.trim()}
                              className="px-6 py-3 bg-gradient-to-r from-neon-green to-cyber-blue text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
                            >
                              {isLoadingFAQ ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Sparkles className="w-4 h-4" />
                                </motion.div>
                              ) : (
                                <MessageCircle className="w-4 h-4" />
                              )}
                              <span>{currentTranslations.askAI}</span>
                            </button>
                          </ClickFeedback>
                        </div>
                      </div>

                      {faqAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gradient-to-r from-carbon-black to-medium-gray rounded-lg border border-neon-green/20"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center flex-shrink-0">
                              <Brain className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-2">AI Response:</h4>
                              <p className="text-gray-300 leading-relaxed">{faqAnswer}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="mt-6">
                        <h4 className="font-semibold text-white mb-3">{currentTranslations.popularTopics}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            currentLanguage === 'ar' ? 'كيفية استخدام الوكلاء' : currentLanguage === 'es' ? 'Cómo usar agentes' : 'How to use agents',
                            currentLanguage === 'ar' ? 'إعدادات الأمان' : currentLanguage === 'es' ? 'Configuración de seguridad' : 'Security settings',
                            currentLanguage === 'ar' ? 'تخصيص المظهر' : currentLanguage === 'es' ? 'Personalización de tema' : 'Theme customization',
                            currentLanguage === 'ar' ? 'لوحة التحليلات' : currentLanguage === 'es' ? 'Panel de análisis' : 'Analytics dashboard'
                          ].map((topic, index) => (
                            <ClickFeedback key={index}>
                              <button
                                onClick={() => {
                                  setFaqQuery(topic);
                                  handleFAQQuery();
                                }}
                                className="w-full p-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
                              >
                                {topic}
                              </button>
                            </ClickFeedback>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            {currentTranslations.language}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {languages.map((lang) => (
                              <ClickFeedback key={lang.code}>
                                <button
                                  onClick={() => setCurrentLanguage(lang.code)}
                                  className={`p-3 rounded-lg border transition-all ${
                                    currentLanguage === lang.code
                                      ? 'border-neon-green bg-neon-green/10 text-neon-green'
                                      : 'border-gray-600 hover:border-neon-green/50 text-gray-300 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                  </div>
                                </button>
                              </ClickFeedback>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
