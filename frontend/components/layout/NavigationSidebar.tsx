'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Settings, 
  Zap, 
  Shield, 
  Globe, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Bug
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  active?: boolean;
}

export default function NavigationSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      active: true,
    },
    {
      id: 'bug-fixer',
      label: 'AI Bug Fixer',
      icon: <Bug className="w-5 h-5" />,
      href: '/bug-fixer',
      badge: 3,
    },
    // {
    //   id: 'analytics',
    //   label: 'Analytics',
    //   icon: <BarChart3 className="w-5 h-5" />,
    //   href: '/analytics',
    // },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: <Activity className="w-5 h-5" />,
      href: '/monitoring',
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="w-5 h-5" />,
      href: '/security',
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <Globe className="w-5 h-5" />,
      href: '/integrations',
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: <Zap className="w-5 h-5" />,
      href: '/automation',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings',
    },
  ];

  return (
    <motion.aside 
      className={`bg-gradient-to-b from-carbon-black to-medium-gray border-r border-neon-green/20 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neon-green/20">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-bold text-neon-green">Axon AI</h2>
                <p className="text-xs text-gray-400">Enterprise Platform</p>
              </motion.div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <motion.div
            className="p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:border-neon-green focus:outline-none transition-colors"
              />
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                onClick={() => setActiveItem(item.id)}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!isCollapsed && (
                  <motion.div
                    className="flex-1 flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </motion.a>
            ))}
          </div>
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <motion.div
            className="p-4 border-t border-neon-green/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="w-full flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-neon-green to-cyber-blue text-black rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              <span className="text-sm">New Agent</span>
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-neon-green/20">
          {!isCollapsed ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-xs text-gray-500 mb-2">System Status</div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">All Systems Operational</span>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
