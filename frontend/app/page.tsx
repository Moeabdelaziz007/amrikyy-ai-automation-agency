// app/page.tsx - Professional Dashboard
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AgentCard from '../components/agents/AgentCard';
import ProfessionalLayout from '../components/layout/ProfessionalLayout';
import SelfHealingPanel from '../components/monitoring/SelfHealingPanel';
import IDEAgentInterface from '../components/ide-agent/IDEAgentInterface';
import { LazySection, LazyCard } from '../components/ui/LazyLoad';
import { 
  Users, 
  Activity, 
  Target, 
  BarChart3, 
  TrendingUp
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'running' | 'error';
  type: 'content' | 'code' | 'research' | 'design' | 'data' | 'quantum';
  capabilities: string[];
  lastRun?: Date;
  successRate?: number;
}

export default function ProfessionalDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  // Mock agent data - replace with actual API call
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: 'content-agent',
        name: 'Content Creator',
        description: 'Generates high-quality content for blogs, social media, and marketing materials using advanced AI.',
        status: 'active',
        type: 'content',
        capabilities: ['Blog Writing', 'Social Media', 'SEO Optimization', 'Content Strategy'],
        lastRun: new Date(),
        successRate: 95
      },
      {
        id: 'code-agent',
        name: 'Code Generator',
        description: 'Creates, reviews, and optimizes code across multiple programming languages and frameworks.',
        status: 'active',
        type: 'code',
        capabilities: ['Code Generation', 'Code Review', 'Bug Fixing', 'Documentation'],
        lastRun: new Date(),
        successRate: 92
      },
      {
        id: 'research-agent',
        name: 'Research Assistant',
        description: 'Conducts comprehensive research, analyzes data, and provides insights on various topics.',
        status: 'running',
        type: 'research',
        capabilities: ['Data Analysis', 'Market Research', 'Trend Analysis', 'Report Generation'],
        lastRun: new Date(),
        successRate: 88
      },
      {
        id: 'design-agent',
        name: 'Design Creator',
        description: 'Generates visual designs, mockups, and creative assets for web and mobile applications.',
        status: 'active',
        type: 'design',
        capabilities: ['UI Design', 'Mockups', 'Graphics', 'Branding'],
        lastRun: new Date(),
        successRate: 90
      },
      {
        id: 'data-agent',
        name: 'Data Analyst',
        description: 'Processes and analyzes large datasets to extract meaningful insights and patterns.',
        status: 'active',
        type: 'data',
        capabilities: ['Data Processing', 'Statistical Analysis', 'Visualization', 'Predictive Modeling'],
        lastRun: new Date(),
        successRate: 94
      },
      {
        id: 'quantum-agent',
        name: 'Quantum Processor',
        description: 'Leverages quantum computing principles for advanced problem-solving and optimization.',
        status: 'active',
        type: 'quantum',
        capabilities: ['Quantum Algorithms', 'Optimization', 'Simulation', 'Cryptography'],
        lastRun: new Date(),
        successRate: 87
      }
    ];

    setTimeout(() => {
      setAgents(mockAgents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRunAgent = (agentId: string) => {
    setActiveAgent(agentId);
    // Simulate agent execution
    setTimeout(() => {
      setActiveAgent(null);
    }, 3000);
  };

  const handleViewDetails = (agentId: string) => {
    console.log('Viewing details for agent:', agentId);
    // Navigate to agent details page
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-carbon-black to-medium-gray flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-semibold text-neon-green">Loading AI Agents...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="space-y-8">
        {/* Clean Dashboard Header */}
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-green via-cyber-blue to-electric-purple bg-clip-text text-transparent">
            Amrikyy AI Automation Agency
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolutionary AI-powered automation platform for modern software development
          </p>
        </motion.div>

        {/* Key Metrics - Clean & Organized */}
        <LazySection delay={200}>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="bg-gradient-to-br from-carbon-black to-medium-gray border border-neon-green/20 rounded-xl p-6 hover:border-neon-green/40 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{agents.length}</div>
              <div className="text-sm text-gray-400">Total AI Agents</div>
              <div className="text-xs text-gray-500 mt-1">Deployed and ready</div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-carbon-black to-medium-gray border border-cyber-blue/20 rounded-xl p-6 hover:border-cyber-blue/40 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-electric-purple rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{agents.filter(a => a.status === 'active').length}</div>
              <div className="text-sm text-gray-400">Active Agents</div>
              <div className="text-xs text-gray-500 mt-1">Currently running</div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-carbon-black to-medium-gray border border-electric-purple/20 rounded-xl p-6 hover:border-electric-purple/40 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-electric-purple to-warning-orange rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+15%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{agents.reduce((acc, a) => acc + a.capabilities.length, 0)}</div>
              <div className="text-sm text-gray-400">Total Capabilities</div>
              <div className="text-xs text-gray-500 mt-1">Available features</div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-carbon-black to-medium-gray border border-warning-orange/20 rounded-xl p-6 hover:border-warning-orange/40 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-warning-orange to-neon-green rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+3%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{Math.round(agents.reduce((acc, a) => acc + (a.successRate || 0), 0) / agents.length)}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
              <div className="text-xs text-gray-500 mt-1">Overall performance</div>
            </motion.div>
          </motion.div>
        </LazySection>

        {/* IDE Agent Interface */}
        <LazySection delay={400}>
          <IDEAgentInterface />
        </LazySection>

        {/* Self-Healing System Panel */}
        <LazySection delay={500}>
          <SelfHealingPanel />
        </LazySection>

        {/* AI Agents Grid - Clean Cards */}
        <LazySection delay={600}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-neon-green" />
              AI Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <LazyCard key={agent.id} delay={index * 100}>
                <AgentCard
                  agent={agent}
                  isActive={activeAgent === agent.id}
                  onRunAgent={handleRunAgent}
                  onViewDetails={handleViewDetails}
                  animationDelay={0.2}
                  index={index}
                />
              </LazyCard>
            ))}
            </div>
          </motion.div>
        </LazySection>

        {/* Performance Chart - Proper Loading State */}
        <LazySection delay={800}>
          <motion.div 
            className="bg-gradient-to-br from-carbon-black to-medium-gray border border-neon-green/20 rounded-xl p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-neon-green" />
                Performance Overview
              </h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg text-sm font-medium hover:bg-neon-green/30 transition-colors">
                  Last 24 Hours
                </button>
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                  Last 7 Days
                </button>
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                  Last 30 Days
                </button>
              </div>
            </div>
            
            {/* Chart Placeholder - Proper Loading State */}
            <div className="h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-green/20 to-cyber-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-neon-green" />
                </div>
                <p className="text-gray-400 font-medium">Performance Analytics</p>
                <p className="text-sm text-gray-500 mt-2">Real-time data visualization coming soon</p>
              </div>
            </div>
          </motion.div>
        </LazySection>
      </div>
    </ProfessionalLayout>
  );
}
