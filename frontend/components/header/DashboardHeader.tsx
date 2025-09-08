'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Code, 
  BarChart3, 
  Settings, 
  Bell, 
  User,
  Search,
  Menu,
  X
} from 'lucide-react';
import { QuickThemeToggle } from '../theme/ThemeToggle';
import { ClickFeedback, HoverGlow } from '../ui/MicroInteraction';
import AmrikyyLogo from '../branding/AmrikyyLogo';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  active?: boolean;
  badge?: string;
}

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '/', active: true },
    { id: 'content', label: 'Content Agent', icon: FileText, href: '/content-agent', badge: 'New' },
    { id: 'code', label: 'Code Agent', icon: Code, href: '/code-agent' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' }
  ];

  return (
    <motion.header 
      className="bg-carbon-black border-b border-neon-green/20 backdrop-blur-lg sticky top-0 z-40"
      data-help="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HoverGlow>
              <AmrikyyLogo size="md" variant="full" animated={true} />
            </HoverGlow>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {navItems.map((item, index) => (
              <ClickFeedback key={item.id}>
                <motion.button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                    item.active 
                      ? 'bg-neon-green text-black font-semibold' 
                      : 'text-neon-green hover:bg-neon-green/20 border border-neon-green/30'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </motion.button>
              </ClickFeedback>
            ))}
          </motion.nav>

          {/* Right Side Actions */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Search */}
            <ClickFeedback>
              <button className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors" data-help="search">
                <Search className="w-5 h-5 text-gray-400 hover:text-neon-green" />
              </button>
            </ClickFeedback>

            {/* Notifications */}
            <ClickFeedback>
              <button className="relative p-2 hover:bg-neon-green/10 rounded-lg transition-colors" data-help="notifications">
                <Bell className="w-5 h-5 text-gray-400 hover:text-neon-green" />
                {notifications > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {notifications}
                  </motion.span>
                )}
              </button>
            </ClickFeedback>

            {/* Quick Theme Toggle */}
            <QuickThemeToggle />

            {/* User Profile */}
            <ClickFeedback>
              <button className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors">
                <User className="w-5 h-5 text-gray-400 hover:text-neon-green" />
              </button>
            </ClickFeedback>

            {/* Mobile Menu Toggle */}
            <ClickFeedback>
              <button 
                className="md:hidden p-2 hover:bg-neon-green/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-400 hover:text-neon-green" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-400 hover:text-neon-green" />
                )}
              </button>
            </ClickFeedback>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden mt-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <ClickFeedback key={item.id}>
                <motion.button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active 
                      ? 'bg-neon-green text-black font-semibold' 
                      : 'text-neon-green hover:bg-neon-green/20 border border-neon-green/30'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              </ClickFeedback>
            ))}
          </div>
        </motion.div>

        {/* Live Clock */}
        <motion.div 
          className="hidden lg:flex items-center justify-end mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-sm text-gray-400 font-mono">
            {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
