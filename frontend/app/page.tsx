'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  Play,
  Code,
  Star,
  TrendingUp,
  Settings,
  Clock,
  Target, 
  Sparkles,
  Building2
} from 'lucide-react';

// Import Enhanced City Theme Components
import { NeonHeader, NeonAgentStatus } from '@/components/city-theme/NeonComponents';
import { NeonCityBlockOverview } from '@/components/city-theme/NeonCityBlocks';
import { NeonAnalyticsDashboard } from '@/components/city-theme/NeonAnalytics';
import { CyberpunkBackground, NeonGlow } from '@/components/city-theme/CyberpunkEffects';
import EnhancedDistrictDetailsPanel from '@/components/city-theme/EnhancedDistrictDetailsPanel';

// Agent Persona Types
interface AgentPersona {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  color: string;
  gradient: string;
  capabilities: string[];
  personality: string;
  expertise: string[];
  status: 'idle' | 'thinking' | 'working' | 'completed' | 'error';
  progress: number;
  current_task: string;
  last_activity: string;
  performance: {
    efficiency: number;
    accuracy: number;
    speed: number;
  };
  stats: {
    tasks_completed: number;
    success_rate: number;
    uptime: number;
  };
}

// Enhanced Agent Card Component
const AgentCard = ({ agent, onTrigger }: { agent: AgentPersona; onTrigger: (id: string) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'text-gray-400';
      case 'thinking': return 'text-yellow-400';
      case 'working': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };


    return (
        <motion.div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        agent.gradient
      } ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Card Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
        <motion.div 
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg ${
                agent.color
              }`}
              animate={isHovered ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              {agent.avatar}
        </motion.div>

            <div>
              <h3 className="text-xl font-bold text-white">{agent.name}</h3>
              <p className="text-white/80 text-sm">{agent.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  agent.status === 'idle' ? 'bg-gray-400' :
                  agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' :
                  agent.status === 'working' ? 'bg-blue-400 animate-pulse' :
                  agent.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className={`text-xs font-medium ${getStatusColor(agent.status)}`}>
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            onClick={() => onTrigger(agent.id)}
            className={`px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
              agent.status === 'working' 
                ? 'bg-white/20 cursor-not-allowed' 
                : 'bg-white/30 hover:bg-white/40'
            }`}
            whileHover={agent.status !== 'working' ? { scale: 1.05 } : {}}
            whileTap={agent.status !== 'working' ? { scale: 0.95 } : {}}
            disabled={agent.status === 'working'}
          >
            {agent.status === 'working' ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Description */}
        <p className="text-white/90 text-sm mb-4 leading-relaxed">
          {agent.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm font-medium">Progress</span>
            <span className="text-white text-sm font-bold">{agent.progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${agent.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Current Task */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-white/60" />
            <span className="text-white/80 text-sm font-medium">Current Task</span>
          </div>
          <p className="text-white/90 text-sm bg-white/10 rounded-lg p-3">
            {agent.current_task}
          </p>
        </div>

        {/* Capabilities */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-white/60" />
            <span className="text-white/80 text-sm font-medium">Capabilities</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <motion.span
                key={index}
                className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {capability}
              </motion.span>
            ))}
            {agent.capabilities.length > 3 && (
              <span className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                +{agent.capabilities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Efficiency', value: agent.performance.efficiency, icon: TrendingUp },
            { label: 'Accuracy', value: agent.performance.accuracy, icon: Target },
            { label: 'Speed', value: agent.performance.speed, icon: Zap }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              className="bg-white/10 rounded-lg p-3 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <metric.icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">{metric.value}%</div>
              <div className="text-white/60 text-xs">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-xs text-white/60">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>{agent.stats.tasks_completed} tasks</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>{agent.stats.success_rate}% success</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{agent.stats.uptime}% uptime</span>
          </div>
        </div>

        {/* Expand Details Button */}
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          {showDetails ? 'Show Less' : 'Show More Details'}
        </motion.button>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-white/20"
            >
              <div className="space-y-3">
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-2">Personality</h4>
                  <p className="text-white/70 text-sm">{agent.personality}</p>
                </div>
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-2">Last Activity</h4>
                  <p className="text-white/70 text-sm">
                    {new Date(agent.last_activity).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Loading Page Component
const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Bot className="w-10 h-10 text-white" />
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Loading Text */}
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Amrikyy AI
        </motion.h1>
        
        <motion.p
          className="text-gray-400 text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          Initializing AI Agents...
        </motion.p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Classic Dashboard Component (Original Design)
const ClassicDashboard = () => {
  const [agents, setAgents] = useState<AgentPersona[]>([
    {
      id: 'agent-1',
      name: 'Alex',
      title: 'Senior Code Architect',
      description: 'Expert in full-stack development with a passion for clean, efficient code. Specializes in React, Node.js, and modern web technologies.',
      avatar: '👨‍💻',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30',
      capabilities: ['React Development', 'Node.js', 'TypeScript', 'API Design', 'Code Review', 'Architecture Planning'],
      personality: 'Methodical and detail-oriented, Alex approaches every project with precision and creativity. Known for writing maintainable code and mentoring junior developers.',
      expertise: ['Frontend Development', 'Backend Architecture', 'Database Design', 'DevOps', 'Code Optimization'],
      status: 'idle',
      progress: 0,
      current_task: 'Ready to assist with your next project',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 95, accuracy: 98, speed: 88 },
      stats: { tasks_completed: 247, success_rate: 96, uptime: 99.8 }
    },
    {
      id: 'agent-2',
      name: 'Sofia',
      title: 'AI System Monitor',
      description: 'Intelligent monitoring specialist with advanced analytics capabilities. Keeps systems running smoothly with predictive maintenance.',
      avatar: '👩‍🔬',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30',
      capabilities: ['System Monitoring', 'Predictive Analytics', 'Auto-healing', 'Performance Optimization', 'Alert Management', 'Health Checks'],
      personality: 'Analytical and proactive, Sofia anticipates issues before they occur. She\'s always watching, learning, and optimizing system performance.',
      expertise: ['System Administration', 'Machine Learning', 'Data Analysis', 'Infrastructure', 'Security Monitoring'],
      status: 'working',
      progress: 75,
      current_task: 'Analyzing system performance metrics and optimizing database queries',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 92, accuracy: 94, speed: 91 },
      stats: { tasks_completed: 189, success_rate: 98, uptime: 99.9 }
    },
    {
      id: 'agent-3',
      name: 'Marcus',
      title: 'Security Guardian',
      description: 'Cybersecurity expert focused on protecting systems and data. Implements robust security measures and threat detection.',
      avatar: '🛡️',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30',
      capabilities: ['Threat Detection', 'Security Auditing', 'Access Control', 'Encryption', 'Compliance', 'Incident Response'],
      personality: 'Vigilant and thorough, Marcus is always on guard against potential threats. He believes prevention is better than cure.',
      expertise: ['Cybersecurity', 'Network Security', 'Data Protection', 'Risk Assessment', 'Security Policies'],
      status: 'idle',
      progress: 0,
      current_task: 'Standing guard, ready to protect your systems',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 97, accuracy: 99, speed: 85 },
      stats: { tasks_completed: 156, success_rate: 99, uptime: 100 }
    },
    {
      id: 'agent-4',
      name: 'Luna',
      title: 'Data Intelligence Analyst',
      description: 'Advanced analytics specialist who transforms raw data into actionable insights. Expert in machine learning and data visualization.',
      avatar: '🌙',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30',
      capabilities: ['Data Analysis', 'Machine Learning', 'Predictive Modeling', 'Data Visualization', 'Statistical Analysis', 'Business Intelligence'],
      personality: 'Curious and insightful, Luna loves discovering patterns in data. She transforms complex information into clear, actionable insights.',
      expertise: ['Data Science', 'Machine Learning', 'Statistics', 'Python', 'R', 'SQL'],
      status: 'thinking',
      progress: 45,
      current_task: 'Processing user behavior data to identify optimization opportunities',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 89, accuracy: 96, speed: 82 },
      stats: { tasks_completed: 203, success_rate: 94, uptime: 98.5 }
    }
  ]);

  const [events, setEvents] = useState<Array<{
    id: string;
    type: string;
    timestamp: string;
    data: any;
    agent_id: string;
  }>>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (agents.length > 0) {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        if (randomAgent) {
      const newEvent = {
        id: `event-${Date.now()}`,
        type: 'status',
        timestamp: new Date().toISOString(),
        data: { 
          agent_id: randomAgent.id, 
          status: randomAgent.status, 
          progress: Math.floor(Math.random() * 100) 
        },
        agent_id: randomAgent.id
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      
      setAgents(prev => prev.map(agent => 
        agent.id === randomAgent.id 
          ? { 
              ...agent, 
              progress: Math.floor(Math.random() * 100), 
              last_activity: new Date().toISOString(),
              status: agent.status === 'working' ? 'working' : 'idle'
            }
          : agent
      ));
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [agents]);

  const triggerAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            status: 'working', 
            progress: 0, 
            current_task: 'Processing your request...' 
          }
        : agent
    ));
  };

  return (
    <>
      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onTrigger={triggerAgent}
          />
        ))}
      </div>

      {/* Real-time Events */}
        <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          Real-time Activity Feed
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="text-sm text-white">
                  {event.type} • Agent {event.agent_id}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
              <div className="text-xs text-gray-500">
                Progress: {event.data.progress}%
          </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

// Enhanced Neon City Dashboard Component
const NeonCityDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'analytics' | 'movements'>('overview');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const [agents, setAgents] = useState<AgentPersona[]>([
    {
      id: 'agent-1',
      name: 'Alex',
      title: 'Senior Code Architect',
      description: 'Expert in full-stack development with a passion for clean, efficient code. Specializes in React, Node.js, and modern web technologies.',
      avatar: '👨‍💻',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30',
      capabilities: ['React Development', 'Node.js', 'TypeScript', 'API Design', 'Code Review', 'Architecture Planning'],
      personality: 'Methodical and detail-oriented, Alex approaches every project with precision and creativity. Known for writing maintainable code and mentoring junior developers.',
      expertise: ['Frontend Development', 'Backend Architecture', 'Database Design', 'DevOps', 'Code Optimization'],
      status: 'idle',
      progress: 0,
      current_task: 'Ready to assist with your next project',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 95, accuracy: 98, speed: 88 },
      stats: { tasks_completed: 247, success_rate: 96, uptime: 99.8 }
    },
    {
      id: 'agent-2',
      name: 'Sofia',
      title: 'AI System Monitor',
      description: 'Intelligent monitoring specialist with advanced analytics capabilities. Keeps systems running smoothly with predictive maintenance.',
      avatar: '👩‍🔬',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30',
      capabilities: ['System Monitoring', 'Predictive Analytics', 'Auto-healing', 'Performance Optimization', 'Alert Management', 'Health Checks'],
      personality: 'Analytical and proactive, Sofia anticipates issues before they occur. She\'s always watching, learning, and optimizing system performance.',
      expertise: ['System Administration', 'Machine Learning', 'Data Analysis', 'Infrastructure', 'Security Monitoring'],
      status: 'working',
      progress: 75,
      current_task: 'Analyzing system performance metrics and optimizing database queries',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 92, accuracy: 94, speed: 91 },
      stats: { tasks_completed: 189, success_rate: 98, uptime: 99.9 }
    },
    {
      id: 'agent-3',
      name: 'Marcus',
      title: 'Security Guardian',
      description: 'Cybersecurity expert focused on protecting systems and data. Implements robust security measures and threat detection.',
      avatar: '🛡️',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30',
      capabilities: ['Threat Detection', 'Security Auditing', 'Access Control', 'Encryption', 'Compliance', 'Incident Response'],
      personality: 'Vigilant and thorough, Marcus is always on guard against potential threats. He believes prevention is better than cure.',
      expertise: ['Cybersecurity', 'Network Security', 'Data Protection', 'Risk Assessment', 'Security Policies'],
      status: 'idle',
      progress: 0,
      current_task: 'Standing guard, ready to protect your systems',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 97, accuracy: 99, speed: 85 },
      stats: { tasks_completed: 156, success_rate: 99, uptime: 100 }
    },
    {
      id: 'agent-4',
      name: 'Luna',
      title: 'Data Intelligence Analyst',
      description: 'Advanced analytics specialist who transforms raw data into actionable insights. Expert in machine learning and data visualization.',
      avatar: '🌙',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30',
      capabilities: ['Data Analysis', 'Machine Learning', 'Predictive Modeling', 'Data Visualization', 'Statistical Analysis', 'Business Intelligence'],
      personality: 'Curious and insightful, Luna loves discovering patterns in data. She transforms complex information into clear, actionable insights.',
      expertise: ['Data Science', 'Machine Learning', 'Statistics', 'Python', 'R', 'SQL'],
      status: 'thinking',
      progress: 45,
      current_task: 'Processing user behavior data to identify optimization opportunities',
      last_activity: new Date().toISOString(),
      performance: { efficiency: 89, accuracy: 96, speed: 82 },
      stats: { tasks_completed: 203, success_rate: 94, uptime: 98.5 }
    }
  ]);

  const [cityStats, setCityStats] = useState({
    totalTasks: 0,
    activeAgents: 0,
    systemHealth: 0,
    efficiency: 0
  });

  const [districtData] = useState({
    'code-district': {
      id: 'code-district',
      name: 'Code District',
      type: 'code' as const,
      agent: {
        id: 'agent-1',
        name: 'Alex',
        title: 'Senior Code Architect',
        avatar: '👨‍💻',
        status: 'idle' as const,
        progress: 0,
        current_task: 'Ready to assist with your next project',
        capabilities: ['React Development', 'Node.js', 'TypeScript', 'API Design'],
        performance: { efficiency: 95, accuracy: 98, speed: 88 },
        stats: { tasks_completed: 247, success_rate: 96, uptime: 99.8 }
      },
      buildings: [
        { 
          id: 'b1', 
          name: 'React Tower', 
          type: 'skyscraper' as const, 
          height: 20, 
          status: 'active' as const, 
          task_count: 5, 
          completion_rate: 95,
          difficulty: 'high' as const,
          tasks: [
            { id: 't1', name: 'Component Optimization', status: 'in_progress' as const, priority: 'high' as const, progress: 75, estimated_time: '2h' },
            { id: 't2', name: 'State Management', status: 'pending' as const, priority: 'medium' as const, progress: 0, estimated_time: '1h' }
          ],
          analytics: { efficiency: 92, workload: 85, uptime: 99, last_activity: new Date().toISOString() }
        }
      ],
      analytics: {
        total_tasks: 10,
        active_tasks: 7,
        completed_today: 3,
        efficiency_score: 90,
        workload_distribution: [
          { building_id: 'b1', building_name: 'React Tower', task_count: 5, percentage: 50 }
        ]
      }
    }
  });

  // Update city stats
  useEffect(() => {
    const totalTasks = agents.reduce((sum, agent) => sum + agent.stats.tasks_completed, 0);
    const activeAgents = agents.filter(agent => agent.status === 'working' || agent.status === 'thinking').length;
    const avgEfficiency = agents.reduce((sum, agent) => sum + agent.performance.efficiency, 0) / agents.length;

    setCityStats({
      totalTasks,
      activeAgents,
      systemHealth: Math.round(avgEfficiency),
      efficiency: Math.round(avgEfficiency)
    });
  }, [agents]);

  const handleTabChange = (tab: 'overview' | 'agents' | 'analytics' | 'movements') => {
    setActiveTab(tab);
  };

  const handleBuildingClick = (buildingId: string) => {
    console.log('Building clicked:', buildingId);
  };

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId);
  };

  const handleTaskHover = (taskId: string | null) => {
    console.log('Task hovered:', taskId);
  };

  const triggerAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            status: 'working', 
            progress: 0, 
            current_task: 'Processing your request...' 
          }
        : agent
    ));
  };

  return (
    <CyberpunkBackground showParticles={true} particleCount={40}>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto space-y-4 p-4">
          {/* Enhanced Neon Header */}
          <NeonHeader
            activeTab={activeTab}
            onTabChange={handleTabChange}
            cityStats={cityStats}
          />

        {/* Quick Actions */}
            <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'IDE Agent', href: '/ide-agent', icon: Code, color: 'bg-blue-600' },
            { label: 'Bug Fixer', href: '/bug-fixer', icon: Zap, color: 'bg-green-600' },
            { label: 'Monitoring', href: '/monitoring', icon: Activity, color: 'bg-purple-600' },
            { label: 'Settings', href: '/settings', icon: Settings, color: 'bg-orange-600' }
          ].map((action, index) => (
              <NeonGlow color="blue" intensity="medium">
            <motion.a
              key={action.label}
              href={action.href}
              className={`${action.color} rounded-xl p-6 text-white hover:opacity-90 transition-opacity`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{action.label}</h3>
                  <p className="text-sm opacity-80">Access tools</p>
                </div>
                <action.icon className="w-8 h-8" />
              </div>
              <ArrowRight className="w-4 h-4 mt-2" />
            </motion.a>
              </NeonGlow>
          ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* City Block Overview */}
                <NeonCityBlockOverview
                  buildings={districtData['code-district'].buildings}
                  onBuildingClick={handleBuildingClick}
                  onTaskHover={handleTaskHover}
                />
              </motion.div>
            )}

            {activeTab === 'agents' && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {agents.map((agent) => (
                  <NeonAgentStatus
              key={agent.id}
                  agent={agent}
              onTrigger={triggerAgent}
            />
            ))}
              </motion.div>
            )}

            {activeTab === 'analytics' && (
          <motion.div 
                key="analytics"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <NeonAnalyticsDashboard
                  cityStats={{
                    totalDistricts: 4,
                    totalBuildings: 12,
                    totalTasks: cityStats.totalTasks,
                    activeAgents: cityStats.activeAgents,
                    systemHealth: cityStats.systemHealth,
                    efficiency: cityStats.efficiency,
                    averageWorkload: 75,
                    peakActivity: '14:00'
                  }}
                  districtTrends={[
                    { districtId: 'code-district', districtName: 'Code District', trend: 'up', change: 5, efficiency: 95 },
                    { districtId: 'security-district', districtName: 'Security District', trend: 'up', change: 3, efficiency: 98 },
                    { districtId: 'data-district', districtName: 'Data District', trend: 'stable', change: 0, efficiency: 89 },
                    { districtId: 'monitoring-district', districtName: 'Monitoring District', trend: 'up', change: 7, efficiency: 92 }
                  ]}
                  workloadDistribution={[
                    { building_id: 'b1', building_name: 'React Tower', task_count: 5, percentage: 50 },
                    { building_id: 'b2', building_name: 'Node Center', task_count: 2, percentage: 20 },
                    { building_id: 'b3', building_name: 'TypeScript Plaza', task_count: 3, percentage: 30 }
                  ]}
                />
              </motion.div>
            )}

            {activeTab === 'movements' && (
              <motion.div
                key="movements"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <NeonGlow color="purple" intensity="medium">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Live Agent Movements</h3>
                    <p className="text-gray-400">Real-time agent movement visualization coming soon...</p>
                  </div>
                </NeonGlow>
              </motion.div>
            )}
          </AnimatePresence>

          {/* District Details Panel */}
          {selectedDistrict && districtData[selectedDistrict as keyof typeof districtData] && (
            <EnhancedDistrictDetailsPanel
              district={districtData[selectedDistrict as keyof typeof districtData]}
              isOpen={!!selectedDistrict}
              onClose={() => setSelectedDistrict(null)}
              onTaskClick={handleTaskClick}
              onBuildingClick={handleBuildingClick}
            />
          )}
              </div>
            </div>
    </CyberpunkBackground>
  );
};

// Main Dashboard Component with City Theme
const MainDashboard = () => {
  const [viewMode, setViewMode] = useState<'city' | 'classic'>('city');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">🏙️ AI City Command Center</h1>
              <p className="text-gray-400">Navigate through districts to interact with AI agents</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('city')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'city' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  <Building2 className="w-4 h-4 mr-2 inline" />
                  City View
                </button>
                <button
                  onClick={() => setViewMode('classic')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'classic' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  <Bot className="w-4 h-4 mr-2 inline" />
                  Classic View
                </button>
              </div>
              
              {/* Connection Status */}
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-900/50 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium">All Systems Online</span>
                </div>
            </div>
                </div>
              </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'IDE Agent', href: '/ide-agent', icon: Code, color: 'bg-blue-600' },
            { label: 'Bug Fixer', href: '/bug-fixer', icon: Zap, color: 'bg-green-600' },
            { label: 'Monitoring', href: '/monitoring', icon: Activity, color: 'bg-purple-600' },
            { label: 'Settings', href: '/settings', icon: Settings, color: 'bg-orange-600' }
          ].map((action, index) => (
            <motion.a
              key={action.label}
              href={action.href}
              className={`${action.color} rounded-xl p-6 text-white hover:opacity-90 transition-opacity`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{action.label}</h3>
                  <p className="text-sm opacity-80">Access tools</p>
            </div>
                <action.icon className="w-8 h-8" />
              </div>
              <ArrowRight className="w-4 h-4 mt-2" />
            </motion.a>
          ))}
          </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === 'city' ? (
            <motion.div
              key="city-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <NeonCityDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="classic-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ClassicDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main Page Component
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen">
      {isLoading ? <LoadingPage /> : <MainDashboard />}
    </div>
  );
}