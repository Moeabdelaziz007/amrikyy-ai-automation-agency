// app/page.tsx - Professional Dashboard
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AgentCard from '../components/agents/AgentCard';
import StatCard from '../components/stats/StatCard';
import ProfessionalLayout from '../components/layout/ProfessionalLayout';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import { LazySection, LazyCard } from '../components/ui/LazyLoad';

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
        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
        
        {/* Dashboard Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-green via-cyber-blue to-electric-purple bg-clip-text text-transparent">
            AI Agent Dashboard
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Harness the power of advanced AI agents to automate your workflows and boost productivity
          </p>
        </motion.div>

        {/* Agent Grid with Lazy Loading */}
        <LazySection delay={200}>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
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
          </motion.div>
        </LazySection>

        {/* Enhanced Stats Section with Lazy Loading */}
        <LazySection delay={400}>
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
          <StatCard
            title="Active Agents"
            value={agents.length}
            trend="+12% this month"
            icon={<span className="text-xl">🤖</span>}
            color="bg-gradient-to-r from-neon-green to-cyber-blue"
            description="Total AI agents deployed"
          />
          
          <StatCard
            title="Running Tasks"
            value={agents.filter(a => a.status === 'active').length}
            trend="+8% this week"
            icon={<span className="text-xl">⚡</span>}
            color="bg-gradient-to-r from-cyber-blue to-electric-purple"
            description="Currently executing tasks"
          />
          
          <StatCard
            title="Success Rate"
            value={`${Math.round(agents.reduce((acc, a) => acc + (a.successRate || 0), 0) / agents.length)}%`}
            trend="+3% this month"
            icon={<span className="text-xl">📊</span>}
            color="bg-gradient-to-r from-electric-purple to-warning-orange"
            description="Overall performance metric"
          />
          
          <StatCard
            title="Total Capabilities"
            value={agents.reduce((acc, a) => acc + a.capabilities.length, 0)}
            trend="+15% this month"
            icon={<span className="text-xl">🔧</span>}
            color="bg-gradient-to-r from-warning-orange to-neon-green"
            description="Available agent features"
          />
          </motion.div>
        </LazySection>
      </div>
    </ProfessionalLayout>
  );
}
