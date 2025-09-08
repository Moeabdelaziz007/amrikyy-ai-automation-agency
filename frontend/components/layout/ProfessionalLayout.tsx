'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationSidebar from './NavigationSidebar';
import { PerformanceMonitor } from '../ui/PerformanceMonitor';
import SecurityPanel from '../security/SecurityPanel';
import ThemeToggle from '../theme/ThemeToggle';
import ContextualAIHelp from '../help/ContextualAIHelp';
import DashboardHeader from '../header/DashboardHeader';
import ParticleField from '../background/ParticleField';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ProfessionalLayout({ children }: LayoutProps) {
  const [sidebarOpen] = useState(true);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-carbon-black via-medium-gray to-carbon-black">
      {/* Particle Field Background */}
      <ParticleField />
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
      
      {/* Navigation Sidebar */}
      <NavigationSidebar />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Dashboard Header */}
        <DashboardHeader />
        
        {/* Main Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Security Panel Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSecurityPanel(!showSecurityPanel)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-green/20 to-cyber-blue/20 text-neon-green rounded-lg border border-neon-green/30 hover:bg-neon-green/30 transition-all duration-200"
                  data-help="security-panel"
                >
                  <span className="text-sm font-medium">
                    {showSecurityPanel ? 'Hide Security Panel' : 'Show Security Panel'}
                  </span>
                </button>
                <ThemeToggle />
              </div>
            </div>

            {/* Security Panel */}
            {showSecurityPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <SecurityPanel />
              </motion.div>
            )}

            {/* Main Dashboard Content */}
            {children}
          </motion.div>
        </main>
      </div>
      
            {/* Contextual AI Help */}
            <ContextualAIHelp />
    </div>
  );
}
