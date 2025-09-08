'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Activity,
  Database,
  FileText,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { HoverGlow, ClickFeedback, StaggeredContainer } from '../ui/MicroInteraction';

interface RBACRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isActive: boolean;
  createdAt: Date;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
  details?: string;
}

interface SecurityStats {
  totalUsers: number;
  activeSessions: number;
  failedLogins: number;
  securityAlerts: number;
  lastAudit: Date;
  rbacRoles: number;
  permissions: number;
}

export default function SecurityPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rbac' | 'audit'>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [rbacRoles, setRbacRoles] = useState<RBACRole[]>([]);
  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    totalUsers: 0,
    activeSessions: 0,
    failedLogins: 0,
    securityAlerts: 0,
    lastAudit: new Date(),
    rbacRoles: 0,
    permissions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'warning'>('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockAuditLogs: AuditLog[] = [
      {
        id: '1',
        userId: 'user-1',
        userName: 'admin@axon.com',
        action: 'LOGIN',
        resource: 'Authentication',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        status: 'success',
        details: 'Successful login with 2FA'
      },
      {
        id: '2',
        userId: 'user-2',
        userName: 'developer@axon.com',
        action: 'CREATE_AGENT',
        resource: 'Agent Management',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'success',
        details: 'Created new Content Agent'
      },
      {
        id: '3',
        userId: 'user-3',
        userName: 'guest@axon.com',
        action: 'ACCESS_DENIED',
        resource: 'Admin Panel',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Linux; Android 10)',
        status: 'failed',
        details: 'Insufficient permissions for admin access'
      },
      {
        id: '4',
        userId: 'user-4',
        userName: 'analyst@axon.com',
        action: 'DATA_EXPORT',
        resource: 'Analytics',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        status: 'success',
        details: 'Exported analytics data'
      },
      {
        id: '5',
        userId: 'user-5',
        userName: 'unknown@axon.com',
        action: 'BRUTE_FORCE',
        resource: 'Authentication',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'warning',
        details: 'Multiple failed login attempts detected'
      }
    ];

    const mockRbacRoles: RBACRole[] = [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system access with all permissions',
        permissions: ['READ', 'WRITE', 'DELETE', 'ADMIN', 'AUDIT', 'USER_MANAGEMENT'],
        userCount: 3,
        isActive: true,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'developer',
        name: 'Developer',
        description: 'Agent development and testing permissions',
        permissions: ['READ', 'WRITE', 'CREATE_AGENT', 'TEST_AGENT', 'VIEW_LOGS'],
        userCount: 8,
        isActive: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'analyst',
        name: 'Data Analyst',
        description: 'Analytics and reporting permissions',
        permissions: ['READ', 'ANALYTICS', 'EXPORT_DATA', 'VIEW_REPORTS'],
        userCount: 5,
        isActive: true,
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to dashboard and reports',
        permissions: ['READ', 'VIEW_DASHBOARD', 'VIEW_REPORTS'],
        userCount: 12,
        isActive: true,
        createdAt: new Date('2024-02-15')
      },
      {
        id: 'guest',
        name: 'Guest',
        description: 'Limited access for temporary users',
        permissions: ['READ'],
        userCount: 2,
        isActive: false,
        createdAt: new Date('2024-03-01')
      }
    ];

    setAuditLogs(mockAuditLogs);
    setRbacRoles(mockRbacRoles);
    setSecurityStats({
      totalUsers: 30,
      activeSessions: 15,
      failedLogins: 3,
      securityAlerts: 1,
      lastAudit: new Date(),
      rbacRoles: mockRbacRoles.length,
      permissions: mockRbacRoles.reduce((acc, role) => acc + role.permissions.length, 0)
    });
    setIsLoading(false);
  }, []);

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-neon-green/20 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-neon-green/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-carbon-black to-medium-gray p-6 border-b border-neon-green/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-cyber-blue rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Security Panel</h3>
              <p className="text-sm text-gray-400">RBAC Roles & Audit Logs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ClickFeedback>
              <button className="p-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </ClickFeedback>
            <ClickFeedback>
              <button className="p-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </ClickFeedback>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neon-green/20">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'rbac', label: 'RBAC Roles', icon: Users },
          { id: 'audit', label: 'Audit Logs', icon: FileText }
        ].map((tab) => (
          <ClickFeedback key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-neon-green border-b-2 border-neon-green bg-neon-green/10'
                  : 'text-gray-400 hover:text-white hover:bg-neon-green/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          </ClickFeedback>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.1}>
                <HoverGlow>
                  <div className="bg-gradient-to-r from-neon-green/20 to-cyber-blue/20 p-4 rounded-lg border border-neon-green/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Users</p>
                        <p className="text-2xl font-bold text-white">{securityStats.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-neon-green" />
                    </div>
                  </div>
                </HoverGlow>

                <HoverGlow>
                  <div className="bg-gradient-to-r from-cyber-blue/20 to-electric-purple/20 p-4 rounded-lg border border-cyber-blue/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active Sessions</p>
                        <p className="text-2xl font-bold text-white">{securityStats.activeSessions}</p>
                      </div>
                      <Activity className="w-8 h-8 text-cyber-blue" />
                    </div>
                  </div>
                </HoverGlow>

                <HoverGlow>
                  <div className="bg-gradient-to-r from-electric-purple/20 to-warning-orange/20 p-4 rounded-lg border border-electric-purple/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Failed Logins</p>
                        <p className="text-2xl font-bold text-white">{securityStats.failedLogins}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-electric-purple" />
                    </div>
                  </div>
                </HoverGlow>

                <HoverGlow>
                  <div className="bg-gradient-to-r from-warning-orange/20 to-neon-green/20 p-4 rounded-lg border border-warning-orange/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Security Alerts</p>
                        <p className="text-2xl font-bold text-white">{securityStats.securityAlerts}</p>
                      </div>
                      <Shield className="w-8 h-8 text-warning-orange" />
                    </div>
                  </div>
                </HoverGlow>
              </StaggeredContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <HoverGlow>
                  <div className="bg-gradient-to-r from-carbon-black to-medium-gray p-6 rounded-lg border border-neon-green/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Database className="w-5 h-5 text-neon-green mr-2" />
                      RBAC Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Roles</span>
                        <span className="text-white font-semibold">{securityStats.rbacRoles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Permissions</span>
                        <span className="text-white font-semibold">{securityStats.permissions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Audit</span>
                        <span className="text-white font-semibold">{formatTimestamp(securityStats.lastAudit)}</span>
                      </div>
                    </div>
                  </div>
                </HoverGlow>

                <HoverGlow>
                  <div className="bg-gradient-to-r from-carbon-black to-medium-gray p-6 rounded-lg border border-neon-green/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Eye className="w-5 h-5 text-neon-green mr-2" />
                      Recent Activity
                    </h4>
                    <div className="space-y-3">
                      {auditLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status).split(' ')[0]}`} />
                            <span className="text-sm text-gray-300">{log.action}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </HoverGlow>
              </div>
            </motion.div>
          )}

          {activeTab === 'rbac' && (
            <motion.div
              key="rbac"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StaggeredContainer className="space-y-4" staggerDelay={0.1}>
                {rbacRoles.map((role) => (
                  <HoverGlow key={role.id}>
                    <div className="bg-gradient-to-r from-carbon-black to-medium-gray p-6 rounded-lg border border-neon-green/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${role.isActive ? 'bg-neon-green' : 'bg-gray-500'}`} />
                          <h4 className="text-lg font-semibold text-white">{role.name}</h4>
                          <span className="text-sm text-gray-400">({role.userCount} users)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            role.isActive ? 'bg-green-400/20 text-green-400' : 'bg-gray-400/20 text-gray-400'
                          }`}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">{role.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded-full border border-neon-green/30"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </HoverGlow>
                ))}
              </StaggeredContainer>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filter */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search audit logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-carbon-black border border-neon-green/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 bg-carbon-black border border-neon-green/30 rounded-lg text-white focus:border-neon-green focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warning</option>
                </select>
                <ClickFeedback>
                  <button className="px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </ClickFeedback>
              </div>

              {/* Audit Logs Table */}
              <div className="bg-gradient-to-r from-carbon-black to-medium-gray rounded-lg border border-neon-green/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neon-green/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Resource</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neon-green/20">
                      {filteredAuditLogs.map((log, index) => (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-neon-green/5 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-cyber-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {log.userName.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-white">{log.userName}</div>
                                <div className="text-sm text-gray-400">{log.userId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-300">{log.action}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-300">{log.resource}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                              {getStatusIcon(log.status)}
                              <span className="ml-1">{log.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {log.ipAddress}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
