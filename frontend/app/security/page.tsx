'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  User, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Users,
  Activity
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'access_denied' | 'suspicious_activity' | 'permission_change';
  user: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'settings'>('overview');
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      user: 'admin@amrikyy.com',
      ip: '192.168.1.100',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'success',
      details: 'Successful login with 2FA'
    },
    {
      id: '2',
      type: 'access_denied',
      user: 'guest@amrikyy.com',
      ip: '192.168.1.101',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'failed',
      details: 'Attempted to access admin panel without permission'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      user: 'unknown',
      ip: '10.0.0.50',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'warning',
      details: 'Multiple failed login attempts detected'
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@amrikyy.com',
      role: 'admin',
      lastLogin: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'active',
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      id: '2',
      name: 'Developer User',
      email: 'dev@amrikyy.com',
      role: 'developer',
      lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'active',
      permissions: ['read', 'write']
    },
    {
      id: '3',
      name: 'Viewer User',
      email: 'viewer@amrikyy.com',
      role: 'viewer',
      lastLogin: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'inactive',
      permissions: ['read']
    }
  ]);

  const [securityStats] = useState({
    totalUsers: users.length,
    activeSessions: 2,
    failedLogins: 5,
    securityAlerts: 1,
    lastAudit: new Date().toISOString()
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-900/50 text-red-400 border-red-500';
      case 'developer': return 'bg-blue-900/50 text-blue-400 border-blue-500';
      case 'viewer': return 'bg-green-900/50 text-green-400 border-green-500';
      default: return 'bg-gray-900/50 text-gray-400 border-gray-500';
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
              <h1 className="text-4xl font-bold text-white mb-2">Security Center</h1>
              <p className="text-gray-400">Manage users, permissions, and security events</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/50 text-green-400 rounded-lg">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Secure</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {[
            { label: 'Total Users', value: securityStats.totalUsers, icon: Users },
            { label: 'Active Sessions', value: securityStats.activeSessions, icon: Activity },
            { label: 'Failed Logins', value: securityStats.failedLogins, icon: AlertTriangle },
            { label: 'Security Alerts', value: securityStats.securityAlerts, icon: Shield },
            { label: 'Last Audit', value: new Date(securityStats.lastAudit).toLocaleDateString(), icon: Clock }
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
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'events', label: 'Events', icon: Activity },
              { id: 'settings', label: 'Settings', icon: Settings }
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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Events */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Security Events</h3>
                <div className="space-y-4">
                  {securityEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg">
                      {getStatusIcon(event.status)}
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{event.details}</p>
                        <p className="text-gray-400 text-xs">
                          {event.user} • {event.ip} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Activity */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">User Activity</h3>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.name}</p>
                          <p className="text-gray-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">User Management</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add User
                </button>
              </div>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">
                          Last login: {new Date(user.lastLogin).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Security Events</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600">
                    Filter
                  </button>
                  <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600">
                    Export
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
                    {getStatusIcon(event.status)}
                    <div className="flex-1">
                      <p className="text-white font-medium">{event.details}</p>
                      <p className="text-gray-400 text-sm">
                        {event.user} • {event.ip} • {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      event.status === 'success' ? 'bg-green-900/50 text-green-400' :
                      event.status === 'failed' ? 'bg-red-900/50 text-red-400' :
                      'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-gray-400 text-sm">Require 2FA for all users</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                      Enabled
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Session Timeout</p>
                      <p className="text-gray-400 text-sm">Auto-logout after inactivity</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                      30 min
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">IP Whitelist</p>
                      <p className="text-gray-400 text-sm">Restrict access by IP</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm">
                      Disabled
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Audit Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Audit Logging</p>
                      <p className="text-gray-400 text-sm">Log all security events</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                      Enabled
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Log Retention</p>
                      <p className="text-gray-400 text-sm">How long to keep logs</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                      90 days
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Real-time Alerts</p>
                      <p className="text-gray-400 text-sm">Notify on security events</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                      Enabled
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
