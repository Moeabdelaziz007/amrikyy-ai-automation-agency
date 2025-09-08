'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  CheckCircle, 
  Lock, 
  Zap,
  Shield,
  Palette,
  BarChart3,
  Bot,
  Sparkles
} from 'lucide-react';
import { ClickFeedback, HoverGlow } from '../ui/MicroInteraction';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'onboarding' | 'exploration' | 'mastery' | 'special';
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  badge?: Badge | undefined;
  achievement?: Achievement | undefined;
  points: number;
  completed: boolean;
  completedAt?: Date;
}

export default function GamifiedOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);

  const badges: Badge[] = [
    {
      id: 'welcome',
      name: 'Welcome Explorer',
      description: 'Completed the welcome tour',
      icon: Star,
      color: 'text-yellow-400',
      unlocked: false,
      requirement: 'Complete welcome step'
    },
    {
      id: 'security',
      name: 'Security Guardian',
      description: 'Unlocked the Security Center',
      icon: Shield,
      color: 'text-green-400',
      unlocked: false,
      requirement: 'Explore security panel'
    },
    {
      id: 'theme',
      name: 'Style Master',
      description: 'Customized your theme',
      icon: Palette,
      color: 'text-purple-400',
      unlocked: false,
      requirement: 'Change theme settings'
    },
    {
      id: 'agents',
      name: 'Agent Commander',
      description: 'Interacted with AI agents',
      icon: Bot,
      color: 'text-blue-400',
      unlocked: false,
      requirement: 'Explore agent cards'
    },
    {
      id: 'analytics',
      name: 'Data Analyst',
      description: 'Viewed analytics dashboard',
      icon: BarChart3,
      color: 'text-cyan-400',
      unlocked: false,
      requirement: 'Check analytics section'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first onboarding step',
      icon: Target,
      points: 50,
      unlocked: false,
      category: 'onboarding'
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Complete 3 onboarding steps',
      icon: Star,
      points: 100,
      unlocked: false,
      category: 'exploration'
    },
    {
      id: 'master',
      title: 'Master',
      description: 'Complete all onboarding steps',
      icon: Trophy,
      points: 200,
      unlocked: false,
      category: 'mastery'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete onboarding in under 5 minutes',
      icon: Zap,
      points: 150,
      unlocked: false,
      category: 'special'
    }
  ];

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Axon Quantum!',
      description: 'Let\'s explore your AI-powered command center together.',
      target: 'body',
      badge: badges[0],
      achievement: achievements[0],
      points: 50,
      completed: false
    },
    {
      id: 'header',
      title: 'Command Center',
      description: 'This is your main navigation hub with real-time status.',
      target: '[data-help="header"]',
      points: 25,
      completed: false
    },
    {
      id: 'security',
      title: 'Security Center',
      description: 'Manage RBAC roles and view audit logs here.',
      target: '[data-help="security-panel"]',
      badge: badges[1],
      achievement: achievements[1],
      points: 75,
      completed: false
    },
    {
      id: 'theme',
      title: 'Theme Customization',
      description: 'Personalize your dashboard appearance.',
      target: '[data-help="theme-toggle"]',
      badge: badges[2],
      points: 30,
      completed: false
    },
    {
      id: 'agents',
      title: 'AI Agents',
      description: 'Your intelligent workforce ready to assist.',
      target: '[data-help="agent-card"]',
      badge: badges[3],
      points: 60,
      completed: false
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Monitor performance and system health.',
      target: '[data-help="analytics"]',
      badge: badges[4],
      points: 40,
      completed: false
    },
    {
      id: 'search',
      title: 'Global Search',
      description: 'Find anything across your platform.',
      target: '[data-help="search"]',
      points: 20,
      completed: false
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Stay updated with system alerts.',
      target: '[data-help="notifications"]',
      achievement: achievements[2],
      points: 35,
      completed: false
    }
  ];

  const startOnboarding = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setTotalPoints(0);
    setLevel(1);
  };

  const completeStep = (stepIndex: number) => {
    const step = onboardingSteps[stepIndex];
    if (!step) return;
    
    if (!step.completed) {
      step.completed = true;
      step.completedAt = new Date();
      
      // Award points
      setTotalPoints(prev => prev + step.points);
      
      // Check for level up
      const newLevel = Math.floor(totalPoints / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }
      
      // Unlock badge
      if (step.badge) {
        step.badge.unlocked = true;
        step.badge.unlockedAt = new Date();
        setUnlockedBadge(step.badge);
        setShowAchievement(true);
        
        // Hide achievement after 3 seconds
        setTimeout(() => {
          setShowAchievement(false);
          setUnlockedBadge(null);
        }, 3000);
      }
      
      // Check achievements
      achievements.forEach(achievement => {
        if (!achievement.unlocked) {
          let shouldUnlock = false;
          
          switch (achievement.id) {
            case 'first_steps':
              shouldUnlock = stepIndex === 0;
              break;
            case 'explorer':
              shouldUnlock = onboardingSteps.filter(s => s.completed).length >= 3;
              break;
            case 'master':
              shouldUnlock = onboardingSteps.every(s => s.completed);
              break;
          }
          
          if (shouldUnlock) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date();
            setTotalPoints(prev => prev + achievement.points);
          }
        }
      });
    }
  };

  const nextStep = () => {
    completeStep(currentStep);
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
      // Unlock master achievement
      const masterAchievement = achievements.find(a => a.id === 'master');
      if (masterAchievement && !masterAchievement.unlocked) {
        masterAchievement.unlocked = true;
        masterAchievement.unlockedAt = new Date();
        setTotalPoints(prev => prev + masterAchievement.points);
      }
    }
  };

  const progressPercentage = (onboardingSteps.filter(s => s.completed).length / onboardingSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && unlockedBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-card border border-neon-green/30 rounded-lg p-4 shadow-2xl max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h4 className="text-lg font-bold text-white">🎉 Badge Unlocked!</h4>
                <p className="text-sm text-gray-300">{unlockedBadge.name}</p>
                <p className="text-xs text-gray-400">{unlockedBadge.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Controls */}
      <div className="bg-card border border-neon-green/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Target className="w-5 h-5 text-neon-green mr-2" />
            Gamified Onboarding
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">Level {level}</div>
              <div className="text-xs text-gray-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyber-blue">{totalPoints}</div>
              <div className="text-xs text-gray-400">Points</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Onboarding Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-neon-green to-cyber-blue h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-3">
          <ClickFeedback>
            <button
              onClick={startOnboarding}
              disabled={isPlaying}
              className="flex items-center space-x-2 px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPlaying ? 'Onboarding Active' : 'Start Tour'}</span>
            </button>
          </ClickFeedback>

          {isPlaying && (
            <ClickFeedback>
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue/20 text-cyber-blue rounded-lg hover:bg-cyber-blue/30 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Step</span>
              </button>
            </ClickFeedback>
          )}
        </div>

        {/* Current Step Info */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gradient-to-r from-carbon-black to-medium-gray rounded-lg border border-neon-green/20"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentStep + 1}</span>
              </div>
              <div>
                <h4 className="font-semibold text-white">{onboardingSteps[currentStep]?.title || 'Step'}</h4>
                <p className="text-sm text-gray-300">{onboardingSteps[currentStep]?.description || 'Description'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  +{onboardingSteps[currentStep]?.points || 0} points
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Badges Grid */}
      <div className="bg-card border border-neon-green/20 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Award className="w-5 h-5 text-neon-green mr-2" />
          Badges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <HoverGlow key={badge.id}>
              <motion.div
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  badge.unlocked 
                    ? 'bg-gradient-to-r from-carbon-black to-medium-gray border-neon-green/40' 
                    : 'bg-gray-800 border-gray-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    badge.unlocked ? 'bg-gradient-to-r from-neon-green to-cyber-blue' : 'bg-gray-600'
                  }`}>
                    {badge.unlocked ? (
                      <badge.icon className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {badge.name}
                    </h4>
                    <p className={`text-sm ${badge.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                      {badge.description}
                    </p>
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Unlocked {badge.unlockedAt.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </HoverGlow>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-neon-green/20 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 text-neon-green mr-2" />
          Achievements
        </h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <HoverGlow key={achievement.id}>
              <motion.div
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-carbon-black to-medium-gray border-neon-green/40' 
                    : 'bg-gray-800 border-gray-600'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    achievement.unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gray-600'
                  }`}>
                    {achievement.unlocked ? (
                      <achievement.icon className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                    +{achievement.points}
                  </div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </motion.div>
            </HoverGlow>
          ))}
        </div>
      </div>
    </div>
  );
}
