'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'service';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  description: string;
  lastSync: string;
  config: any;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'paused';
  trigger: string;
  actions: string[];
  lastRun: string;
  nextRun: string;
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'automation'>('integrations');
  
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'GitHub API',
      type: 'api',
      status: 'connected',
      description: 'Connect to GitHub repositories and manage code',
      lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      config: { endpoint: 'https://api.github.com', auth: 'oauth' }
    },
    {
      id: '2',
      name: 'Slack Webhook',
      type: 'webhook',
      status: 'connected',
      description: 'Send notifications to Slack channels',
      lastSync: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      config: { url: 'https://hooks.slack.com/services/...', channel: '#dev' }
    },
    {
      id: '3',
      name: 'PostgreSQL Database',
      type: 'database',
      status: 'error',
      description: 'Connect to production database',
      lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      config: { host: 'localhost', port: 5432, database: 'production' }
    },
    {
      id: '4',
      name: 'AWS S3',
      type: 'service',
      status: 'pending',
      description: 'File storage and backup service',
      lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      config: { bucket: 'amrikyy-backups', region: 'us-east-1' }
    }
  ]);

  const [automations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Auto Deploy on Push',
      description: 'Automatically deploy when code is pushed to main branch',
      status: 'active',
      trigger: 'GitHub push to main',
      actions: ['Run tests', 'Build app', 'Deploy to production'],
      lastRun: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      nextRun: new Date(Date.now() + 1000 * 60 * 30).toISOString()
    },
    {
      id: '2',
      name: 'Security Scan',
      description: 'Run security scans on new code commits',
      status: 'active',
      trigger: 'New commit',
      actions: ['Run security scan', 'Send report', 'Block if issues found'],
      lastRun: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      nextRun: new Date(Date.now() + 1000 * 60 * 40).toISOString()
    },
    {
      id: '3',
      name: 'Backup Database',
      description: 'Daily backup of production database',
      status: 'paused',
      trigger: 'Daily at 2 AM',
      actions: ['Create backup', 'Upload to S3', 'Send confirmation'],
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString()
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-gray-400';
      case 'error': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'webhook': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'database': return <Settings className="w-5 h-5 text-green-400" />;
      case 'service': return <ExternalLink className="w-5 h-5 text-orange-400" />;
      default: return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

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
              <h1 className="text-4xl font-bold text-white mb-2">Integrations & Automation</h1>
              <p className="text-gray-400">Connect external services and automate workflows</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Integration</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Integrations', value: integrations.length, icon: Globe },
            { label: 'Connected', value: integrations.filter(i => i.status === 'connected').length, icon: CheckCircle },
            { label: 'Active Automations', value: automations.filter(a => a.status === 'active').length, icon: Zap },
            { label: 'Last Sync', value: '5 min ago', icon: Clock }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-blue-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            {[
              { id: 'integrations', label: 'Integrations', icon: Globe },
              { id: 'automation', label: 'Automation', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getTypeIcon(integration.type)}
                      <div>
                        <h3 className="text-xl font-semibold text-white">{integration.name}</h3>
                        <p className="text-gray-400">{integration.description}</p>
                        <p className="text-gray-500 text-sm">
                          Last sync: {new Date(integration.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration.status)}
                        <span className={`text-sm font-medium ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-6">
              {automations.map((automation, index) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Zap className="w-6 h-6 text-blue-400" />
                      <div>
                        <h3 className="text-xl font-semibold text-white">{automation.name}</h3>
                        <p className="text-gray-400">{automation.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        automation.status === 'active' ? 'bg-green-900/50 text-green-400' :
                        automation.status === 'inactive' ? 'bg-gray-900/50 text-gray-400' :
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {automation.status}
                      </div>
                      <div className="flex space-x-2">
                        {automation.status === 'active' ? (
                          <button className="p-2 text-yellow-400 hover:text-yellow-300">
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-2 text-green-400 hover:text-green-300">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Trigger</h4>
                      <p className="text-gray-400 text-sm">{automation.trigger}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Last Run</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(automation.lastRun).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Next Run</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(automation.nextRun).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-white font-medium mb-2">Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {automation.actions.map((action, actionIndex) => (
                        <span
                          key={actionIndex}
                          className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full text-sm"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
