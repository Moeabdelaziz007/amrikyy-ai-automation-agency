'use client';

import React, { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { 
  Building2, 
  Activity, 
  Shield, 
  Database,
  MapPin,
  Navigation,
  Users,
  TrendingUp
} from 'lucide-react';

// City Theme Types
interface CityDistrict {
  id: string;
  name: string;
  type: 'code' | 'security' | 'data' | 'monitoring';
  agent: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    status: 'idle' | 'thinking' | 'working' | 'completed' | 'error';
    progress: number;
    current_task: string;
    capabilities: string[];
  };
  buildings: Building[];
  position: { x: number; y: number };
  color: string;
  gradient: string;
}

interface Building {
  id: string;
  name: string;
  type: 'skyscraper' | 'tower' | 'center' | 'fortress';
  height: number;
  status: 'active' | 'idle' | 'processing';
  task_count: number;
  completion_rate: number;
}

interface AgentPath {
  id: string;
  from: string;
  to: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
}

// City District Component
const CityDistrict: React.FC<{ district: CityDistrict; onAgentClick: (agentId: string) => void }> = ({ 
  district, 
  onAgentClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDistrictIcon = (type: string) => {
    switch (type) {
      case 'code': return <Building2 className="w-8 h-8" />;
      case 'security': return <Shield className="w-8 h-8" />;
      case 'data': return <Database className="w-8 h-8" />;
      case 'monitoring': return <Activity className="w-8 h-8" />;
      default: return <Building2 className="w-8 h-8" />;
    }
  };

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

  return (
    <motion.div
      className={`relative ${district.gradient} rounded-2xl border-2 border-opacity-30 p-6 cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'
      }`}
      style={{
        gridColumn: `${district.position.x}`,
        gridRow: `${district.position.y}`
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onAgentClick(district.agent.id)}
    >
      {/* District Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* District Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${district.color}`}
            animate={isHovered ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getDistrictIcon(district.type)}
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">{district.name}</h3>
            <p className="text-white/80 text-sm">{district.agent.title}</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                district.agent.status === 'idle' ? 'bg-gray-400' :
                district.agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' :
                district.agent.status === 'working' ? 'bg-blue-400 animate-pulse' :
                district.agent.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className={`text-xs font-medium ${getStatusColor(district.agent.status)}`}>
                {district.agent.status.charAt(0).toUpperCase() + district.agent.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* District Stats */}
        <div className="text-right">
          <div className="text-white font-bold text-lg">
            {district.buildings.reduce((sum, building) => sum + building.task_count, 0)}
          </div>
          <div className="text-white/60 text-xs">Active Tasks</div>
        </div>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {district.buildings.map((building, index) => (
          <motion.div
            key={building.id}
            className={`h-${building.height} bg-white/20 rounded-lg flex items-end justify-center p-2 ${
              building.status === 'active' ? 'bg-white/30' : 'bg-white/10'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-white text-xs font-medium text-center">
              <div>{building.name}</div>
              <div className="text-white/60">{building.task_count}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm font-medium">Agent Progress</span>
          <span className="text-white text-sm font-bold">{district.agent.progress}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${district.agent.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-white/60" />
          <span className="text-white/80 text-sm font-medium">Current Task</span>
        </div>
        <p className="text-white/90 text-sm bg-white/10 rounded-lg p-3">
          {district.agent.current_task}
        </p>
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-2">
        {district.agent.capabilities.slice(0, 3).map((capability, index) => (
          <motion.span
            key={capability}
            className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {capability}
          </motion.span>
        ))}
        {district.agent.capabilities.length > 3 && (
          <span className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full">
            +{district.agent.capabilities.length - 3} more
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Agent Path Visualization Component
const AgentPath: React.FC<{ path: AgentPath; districts: CityDistrict[] }> = ({ path, districts }) => {
  const fromDistrict = districts.find(d => d.id === path.from);
  const toDistrict = districts.find(d => d.id === path.to);

  if (!fromDistrict || !toDistrict) return null;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${Math.min(fromDistrict.position.x, toDistrict.position.x) * 25}%`,
        top: `${Math.min(fromDistrict.position.y, toDistrict.position.y) * 25}%`,
        width: `${Math.abs(toDistrict.position.x - fromDistrict.position.x) * 25}%`,
        height: `${Math.abs(toDistrict.position.y - fromDistrict.position.y) * 25}%`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`w-full h-1 rounded-full ${
          path.status === 'active' ? 'bg-blue-400' : 
          path.status === 'completed' ? 'bg-green-400' : 'bg-gray-400'
        }`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: path.progress / 100 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Moving indicator */}
      <motion.div
        className={`w-3 h-3 rounded-full ${
          path.status === 'active' ? 'bg-blue-400' : 
          path.status === 'completed' ? 'bg-green-400' : 'bg-gray-400'
        }`}
        animate={{
          x: path.progress,
          y: path.progress
        }}
        transition={{ duration: 2, repeat: path.status === 'active' ? Infinity : 0 }}
      />
    </motion.div>
  );
};

// Main City Dashboard Component
const CityDashboard: React.FC = () => {
  const [districts, setDistricts] = useState<CityDistrict[]>([
    {
      id: 'code-district',
      name: 'Code District',
      type: 'code',
      agent: {
        id: 'agent-1',
        name: 'Alex',
        title: 'Senior Code Architect',
        avatar: '👨‍💻',
        status: 'idle',
        progress: 0,
        current_task: 'Ready to assist with your next project',
        capabilities: ['React Development', 'Node.js', 'TypeScript', 'API Design']
      },
      buildings: [
        { id: 'b1', name: 'React Tower', type: 'skyscraper', height: 20, status: 'active', task_count: 5, completion_rate: 95 },
        { id: 'b2', name: 'Node Center', type: 'center', height: 16, status: 'idle', task_count: 2, completion_rate: 88 },
        { id: 'b3', name: 'TypeScript Plaza', type: 'tower', height: 18, status: 'processing', task_count: 3, completion_rate: 92 }
      ],
      position: { x: 1, y: 1 },
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30'
    },
    {
      id: 'security-district',
      name: 'Security District',
      type: 'security',
      agent: {
        id: 'agent-2',
        name: 'Marcus',
        title: 'Security Guardian',
        avatar: '🛡️',
        status: 'idle',
        progress: 0,
        current_task: 'Standing guard, ready to protect your systems',
        capabilities: ['Threat Detection', 'Security Auditing', 'Access Control', 'Encryption']
      },
      buildings: [
        { id: 'b4', name: 'Security Fortress', type: 'fortress', height: 22, status: 'active', task_count: 8, completion_rate: 99 },
        { id: 'b5', name: 'Threat Tower', type: 'tower', height: 19, status: 'idle', task_count: 1, completion_rate: 97 },
        { id: 'b6', name: 'Crypto Center', type: 'center', height: 17, status: 'processing', task_count: 4, completion_rate: 98 }
      ],
      position: { x: 2, y: 1 },
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30'
    },
    {
      id: 'data-district',
      name: 'Data District',
      type: 'data',
      agent: {
        id: 'agent-3',
        name: 'Luna',
        title: 'Data Intelligence Analyst',
        avatar: '🌙',
        status: 'thinking',
        progress: 45,
        current_task: 'Processing user behavior data to identify optimization opportunities',
        capabilities: ['Data Analysis', 'Machine Learning', 'Predictive Modeling', 'Data Visualization']
      },
      buildings: [
        { id: 'b7', name: 'Analytics Tower', type: 'skyscraper', height: 24, status: 'active', task_count: 12, completion_rate: 94 },
        { id: 'b8', name: 'ML Center', type: 'center', height: 20, status: 'processing', task_count: 6, completion_rate: 89 },
        { id: 'b9', name: 'Insight Plaza', type: 'tower', height: 18, status: 'idle', task_count: 3, completion_rate: 96 }
      ],
      position: { x: 1, y: 2 },
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30'
    },
    {
      id: 'monitoring-district',
      name: 'Monitoring District',
      type: 'monitoring',
      agent: {
        id: 'agent-4',
        name: 'Sofia',
        title: 'AI System Monitor',
        avatar: '👩‍🔬',
        status: 'working',
        progress: 75,
        current_task: 'Analyzing system performance metrics and optimizing database queries',
        capabilities: ['System Monitoring', 'Predictive Analytics', 'Auto-healing', 'Performance Optimization']
      },
      buildings: [
        { id: 'b10', name: 'Control Tower', type: 'tower', height: 26, status: 'active', task_count: 15, completion_rate: 98 },
        { id: 'b11', name: 'Health Center', type: 'center', height: 21, status: 'processing', task_count: 7, completion_rate: 95 },
        { id: 'b12', name: 'Alert Plaza', type: 'tower', height: 19, status: 'idle', task_count: 2, completion_rate: 99 }
      ],
      position: { x: 2, y: 2 },
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30'
    }
  ]);

  const [agentPaths] = useState<AgentPath[]>([
    {
      id: 'path-1',
      from: 'code-district',
      to: 'data-district',
      status: 'active',
      progress: 60
    },
    {
      id: 'path-2',
      from: 'security-district',
      to: 'monitoring-district',
      status: 'completed',
      progress: 100
    }
  ]);

  const [cityStats, setCityStats] = useState({
    totalTasks: 0,
    activeAgents: 0,
    systemHealth: 0,
    efficiency: 0
  });

  // Update city stats
  useEffect(() => {
    const totalTasks = districts.reduce((sum, district) => 
      sum + district.buildings.reduce((buildingSum, building) => buildingSum + building.task_count, 0), 0
    );
    const activeAgents = districts.filter(d => d.agent.status === 'working' || d.agent.status === 'thinking').length;
    const avgCompletionRate = districts.reduce((sum, district) => 
      sum + district.buildings.reduce((buildingSum, building) => buildingSum + building.completion_rate, 0) / district.buildings.length, 0
    ) / districts.length;

    setCityStats({
      totalTasks,
      activeAgents,
      systemHealth: Math.round(avgCompletionRate),
      efficiency: Math.round((activeAgents / districts.length) * 100)
    });
  }, [districts]);

  const handleAgentClick = (agentId: string) => {
    setDistricts(prev => prev.map(district => 
      district.agent.id === agentId 
        ? { 
            ...district, 
            agent: {
              ...district.agent,
              status: 'working', 
              progress: 0, 
              current_task: 'Processing your request...' 
            }
          }
        : district
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* City Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">🏙️ AI City Command Center</h1>
              <p className="text-gray-400">Navigate through districts to interact with AI agents</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/50 text-green-400 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">All Systems Online</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* City Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Tasks', value: cityStats.totalTasks, icon: Building2, color: 'text-blue-400' },
            { label: 'Active Agents', value: cityStats.activeAgents, icon: Users, color: 'text-green-400' },
            { label: 'System Health', value: `${cityStats.systemHealth}%`, icon: Activity, color: 'text-purple-400' },
            { label: 'Efficiency', value: `${cityStats.efficiency}%`, icon: TrendingUp, color: 'text-orange-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* City Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-8">
            {districts.map((district) => (
              <CityDistrict
                key={district.id}
                district={district}
                onAgentClick={handleAgentClick}
              />
            ))}
          </div>

          {/* Agent Paths */}
          <div className="absolute inset-0 pointer-events-none">
            {agentPaths.map((path) => (
              <AgentPath
                key={path.id}
                path={path}
                districts={districts}
              />
            ))}
          </div>
        </div>

        {/* City Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Navigation className="w-5 h-5 mr-2 text-blue-400" />
            City Navigation Guide
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-medium mb-2">District Types</h4>
              <div className="space-y-2">
                {[
                  { type: 'Code District', desc: 'Development and programming tasks', icon: Building2 },
                  { type: 'Security District', desc: 'Security monitoring and protection', icon: Shield },
                  { type: 'Data District', desc: 'Analytics and data processing', icon: Database },
                  { type: 'Monitoring District', desc: 'System health and performance', icon: Activity }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <item.icon className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-white font-medium">{item.type}</span>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Building Status</h4>
              <div className="space-y-2">
                {[
                  { status: 'Active', desc: 'Currently processing tasks', color: 'bg-green-400' },
                  { status: 'Processing', desc: 'Working on assigned tasks', color: 'bg-blue-400' },
                  { status: 'Idle', desc: 'Ready for new tasks', color: 'bg-gray-400' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <div>
                      <span className="text-white font-medium">{item.status}</span>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CityDashboard;
