'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Loader2, 
  AlertCircle, 
  Code, 
  FileText, 
  BarChart3, 
  Bot,
  Zap,
  Database,
  Eye,
  Settings
} from 'lucide-react';
import { ClickFeedback, HoverGlow } from '../ui/MicroInteraction';
import AgentStatusIndicator from '../agents/AgentStatusIndicator';

interface Activity {
  id: string;
  type: 'execution' | 'creation' | 'analysis' | 'deployment' | 'error' | 'completion';
  agent: string;
  agentType: 'content' | 'code' | 'data' | 'research' | 'design' | 'quantum';
  time: string;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  details?: string;
  progress?: number;
  timestamp: Date;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'execution',
        agent: 'Code Generator',
        agentType: 'code',
        time: '2m ago',
        status: 'completed',
        details: 'Generated React component with TypeScript',
        timestamp: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        id: '2',
        type: 'creation',
        agent: 'Content Creator',
        agentType: 'content',
        time: '15m ago',
        status: 'processing',
        details: 'Creating blog post about AI trends',
        progress: 75,
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '3',
        type: 'analysis',
        agent: 'Data Analyzer',
        agentType: 'data',
        time: '1h ago',
        status: 'completed',
        details: 'Analyzed user engagement metrics',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: '4',
        type: 'deployment',
        agent: 'DevOps Agent',
        agentType: 'code',
        time: '2h ago',
        status: 'failed',
        details: 'Deployment failed due to configuration error',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '5',
        type: 'completion',
        agent: 'Research Agent',
        agentType: 'research',
        time: '3h ago',
        status: 'completed',
        details: 'Completed market research analysis',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ];

    setActivities(mockActivities);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActivities(prev => {
        const updated = [...prev];
        const processingIndex = updated.findIndex(a => a.status === 'processing');
        
        if (processingIndex !== -1 && updated[processingIndex]?.progress !== undefined) {
          updated[processingIndex].progress = Math.min(100, (updated[processingIndex].progress || 0) + Math.random() * 10);
          
          if (updated[processingIndex].progress >= 100) {
            updated[processingIndex].status = 'completed';
            delete updated[processingIndex].progress;
          }
        }
        
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.status === filter
  );

  return (
    <div className="bg-card border border-neon-green/20 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Database className="w-5 h-5 text-neon-green mr-2" />
          Recent Activities
        </h3>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {(['all', 'completed', 'processing', 'failed'] as const).map((filterType) => (
            <ClickFeedback key={filterType}>
              <button
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filter === filterType
                    ? 'bg-neon-green text-black'
                    : 'text-gray-400 hover:text-white hover:bg-neon-green/20'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            </ClickFeedback>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ActivityItem activity={activity} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No activities found</p>
        </motion.div>
      )}
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getActivityIcon = (_type: string, agentType: string) => {
    switch (agentType) {
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'data':
        return <BarChart3 className="w-4 h-4" />;
      case 'research':
        return <Eye className="w-4 h-4" />;
      case 'design':
        return <Settings className="w-4 h-4" />;
      case 'quantum':
        return <Zap className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/30';
      case 'processing':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <HoverGlow>
      <motion.div 
        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${getStatusColor(activity.status)}`}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center space-x-3">
          {/* Agent Icon */}
          <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center text-white">
            {getActivityIcon(activity.type, activity.agentType)}
          </div>
          
          {/* Activity Details */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-white">
                {activity.agent} {activity.type}
              </p>
              <AgentStatusIndicator status={activity.status as any} size="sm" />
            </div>
            <p className="text-sm text-gray-400">{activity.time}</p>
            {activity.details && (
              <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
            )}
            
            {/* Progress Bar for Processing */}
            {activity.status === 'processing' && activity.progress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(activity.progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    className="bg-gradient-to-r from-neon-green to-cyber-blue h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${activity.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Icon */}
        <div className="flex items-center space-x-2">
          {getStatusIcon(activity.status)}
        </div>
      </motion.div>
    </HoverGlow>
  );
}
