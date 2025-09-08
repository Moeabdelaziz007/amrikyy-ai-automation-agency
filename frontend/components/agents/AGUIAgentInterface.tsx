'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Activity, 
  Cpu,
  Database,
  Wifi,
  Server,
  Shield,
  Play,
  RotateCcw
} from 'lucide-react';
import { useWebSocket, useAgentWebSocket } from '@/lib/hooks/useWebSocket';

// AG-UI inspired real-time agent interface
interface AgentEvent {
  id: string;
  type: 'status' | 'progress' | 'tool_call' | 'user_input' | 'completion';
  timestamp: string;
  data: any;
  agent_id: string;
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'thinking' | 'working' | 'completed' | 'error';
  progress: number;
  current_task: string;
  capabilities: string[];
  last_activity: string;
}

const AGUIAgentInterface: React.FC = () => {
  const { isConnected, sendMessage } = useWebSocket();
  const { agentStatus: agent1Status, agentEvents: agent1Events, triggerAgent: triggerAgent1 } = useAgentWebSocket('agent-1');
  const { agentStatus: agent2Status, agentEvents: agent2Events, triggerAgent: triggerAgent2 } = useAgentWebSocket('agent-2');

  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: 'agent-1',
      name: 'Code Generator',
      status: 'idle',
      progress: 0,
      current_task: 'Ready to assist',
      capabilities: ['Code Generation', 'Bug Fixing', 'Code Review'],
      last_activity: new Date().toISOString()
    },
    {
      id: 'agent-2', 
      name: 'System Monitor',
      status: 'working',
      progress: 75,
      current_task: 'Monitoring system health',
      capabilities: ['Health Monitoring', 'Auto-healing', 'Performance Analysis'],
      last_activity: new Date().toISOString()
    }
  ]);

  const [events, setEvents] = useState<AgentEvent[]>([]);

  // Update agents with real-time data from WebSocket
  useEffect(() => {
    if (agent1Status) {
      setAgents(prev => prev.map(agent => 
        agent.id === 'agent-1' 
          ? { ...agent, ...agent1Status, last_activity: new Date().toISOString() }
          : agent
      ));
    }
  }, [agent1Status]);

  useEffect(() => {
    if (agent2Status) {
      setAgents(prev => prev.map(agent => 
        agent.id === 'agent-2' 
          ? { ...agent, ...agent2Status, last_activity: new Date().toISOString() }
          : agent
      ));
    }
  }, [agent2Status]);

  // Combine events from both agents
  useEffect(() => {
    const allEvents = [...agent1Events, ...agent2Events]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    setEvents(allEvents.map(event => ({
      id: event.id,
      type: event.type as any,
      timestamp: event.timestamp,
      data: event.data,
      agent_id: event.agent_id
    })));
  }, [agent1Events, agent2Events]);

  const triggerAgent = useCallback((agentId: string) => {
    const command = {
      action: 'start_task',
      task: 'Generate React component',
      priority: 'high'
    };

    if (agentId === 'agent-1') {
      triggerAgent1(command);
    } else if (agentId === 'agent-2') {
      triggerAgent2(command);
    }

    // Also send via WebSocket
    sendMessage({
      type: 'agent_command',
      agent_id: agentId,
      command,
      timestamp: new Date().toISOString()
    });

    // Update local state immediately
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'working', progress: 0, current_task: 'Generating code...' }
        : agent
    ));
  }, [triggerAgent1, triggerAgent2, sendMessage]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <Bot className="w-5 h-5" />;
      case 'thinking': return <Activity className="w-5 h-5 animate-pulse" />;
      case 'working': return <Zap className="w-5 h-5 animate-spin" />;
      case 'completed': return <Shield className="w-5 h-5" />;
      case 'error': return <RotateCcw className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with AG-UI branding */}
      <motion.div 
        className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AG-UI Agent Hub</h2>
            <p className="text-gray-400">Real-time AI agent orchestration</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </motion.div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <p className={`text-sm ${getStatusColor(agent.status)}`}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => triggerAgent(agent.id)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{agent.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Current Task */}
            <div className="mb-4">
              <p className="text-sm text-gray-300">{agent.current_task}</p>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((capability, capIndex) => (
                <span
                  key={capIndex}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {capability}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time Events Stream */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          Real-time Events Stream
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="text-sm text-white">
                    {event.type} • {event.agent_id}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {JSON.stringify(event.data).slice(0, 50)}...
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Cpu, label: 'CPU Usage', value: '45%', color: 'text-green-400' },
          { icon: Database, label: 'Memory', value: '62%', color: 'text-yellow-400' },
          { icon: Wifi, label: 'Network', value: '12ms', color: 'text-blue-400' },
          { icon: Server, label: 'Uptime', value: '99.9%', color: 'text-green-400' }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
              <div className="text-right">
                <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AGUIAgentInterface;
