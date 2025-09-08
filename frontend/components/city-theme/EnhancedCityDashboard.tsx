'use client';

import React, { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { 
  Building2, 
  Activity, 
  Shield, 
  Database,
  MapPin,
  Users,
  TrendingUp
} from 'lucide-react';

// Import Enhanced Components
import DistrictDetailsPanel from './DistrictDetailsPanel';
import { EnhancedBuilding, BuildingStatusIndicator } from './EnhancedBuilding';
import { AgentMovement, EnhancedAgentPath, MovementTracker } from './RealTimeMovement';
import { DynamicSkyline, CityAnalytics } from './CityAnalytics';

// Enhanced City Theme Types
interface EnhancedCityDistrict {
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
    performance: {
      efficiency: number;
      accuracy: number;
      speed: number;
    };
    stats: {
      tasks_completed: number;
      success_rate: number;
      uptime: number;
    };
  };
  buildings: Array<{
    id: string;
    name: string;
    type: 'skyscraper' | 'tower' | 'center' | 'fortress';
    height: number;
    status: 'active' | 'idle' | 'processing';
    task_count: number;
    completion_rate: number;
    difficulty: 'low' | 'medium' | 'high' | 'critical';
    tasks: Array<{
      id: string;
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      priority: 'low' | 'medium' | 'high' | 'critical';
      progress: number;
      estimated_time: string;
    }>;
    analytics: {
      efficiency: number;
      workload: number;
      uptime: number;
      last_activity: string;
    };
  }>;
  position: { x: number; y: number };
  color: string;
  gradient: string;
  analytics: {
    total_tasks: number;
    active_tasks: number;
    completed_today: number;
    efficiency_score: number;
    workload_score: number;
    workload_distribution: Array<{
      building_id: string;
      building_name: string;
      task_count: number;
      percentage: number;
    }>;
  };
}

interface AgentPath {
  id: string;
  from: string;
  to: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  task: string;
  agent: string;
  timestamp: string;
  estimatedTime: string;
}

interface AgentMovement {
  id: string;
  agentId: string;
  agentName: string;
  fromDistrict: string;
  toDistrict: string;
  status: 'moving' | 'arrived' | 'departing';
  progress: number;
  task: string;
  estimatedTime: string;
}

// Enhanced City District Component
const EnhancedCityDistrict: React.FC<{ 
  district: EnhancedCityDistrict; 
  onDistrictClick: (districtId: string) => void;
  onBuildingClick: (buildingId: string) => void;
  onTaskHover: (taskId: string | null) => void;
}> = ({ district, onDistrictClick, onBuildingClick, onTaskHover }) => {
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

  const getDistrictHealthColor = () => {
    const efficiency = district.analytics.efficiency_score;
    if (efficiency >= 90) return 'border-green-500/50 bg-green-600/10';
    if (efficiency >= 70) return 'border-yellow-500/50 bg-yellow-600/10';
    return 'border-red-500/50 bg-red-600/10';
  };

  return (
    <motion.div
      className={`relative ${district.gradient} ${getDistrictHealthColor()} rounded-2xl border-2 border-opacity-30 p-6 cursor-pointer transition-all duration-300 ${
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
      onClick={() => onDistrictClick(district.id)}
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
          <div className="text-white/60 text-xs mt-1">
            {district.analytics.efficiency_score}% Efficiency
          </div>
        </div>
      </div>

      {/* Enhanced Buildings Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {district.buildings.map((building, index) => (
          <EnhancedBuilding
            key={building.id}
            building={building}
            index={index}
            onBuildingClick={onBuildingClick}
            onTaskHover={onTaskHover}
          />
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

// Enhanced City Dashboard Component
const EnhancedCityDashboard: React.FC = () => {
  const [districts] = useState<EnhancedCityDistrict[]>([
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
        capabilities: ['React Development', 'Node.js', 'TypeScript', 'API Design'],
        performance: { efficiency: 95, accuracy: 98, speed: 88 },
        stats: { tasks_completed: 247, success_rate: 96, uptime: 99.8 }
      },
      buildings: [
        { 
          id: 'b1', 
          name: 'React Tower', 
          type: 'skyscraper', 
          height: 20, 
          status: 'active', 
          task_count: 5, 
          completion_rate: 95,
          difficulty: 'high',
          tasks: [
            { id: 't1', name: 'Component Optimization', status: 'in_progress', priority: 'high', progress: 75, estimated_time: '2h' },
            { id: 't2', name: 'State Management', status: 'pending', priority: 'medium', progress: 0, estimated_time: '1h' }
          ],
          analytics: { efficiency: 92, workload: 85, uptime: 99, last_activity: new Date().toISOString() }
        },
        { 
          id: 'b2', 
          name: 'Node Center', 
          type: 'center', 
          height: 16, 
          status: 'idle', 
          task_count: 2, 
          completion_rate: 88,
          difficulty: 'medium',
          tasks: [
            { id: 't3', name: 'API Development', status: 'completed', priority: 'high', progress: 100, estimated_time: '3h' }
          ],
          analytics: { efficiency: 88, workload: 60, uptime: 98, last_activity: new Date().toISOString() }
        },
        { 
          id: 'b3', 
          name: 'TypeScript Plaza', 
          type: 'tower', 
          height: 18, 
          status: 'processing', 
          task_count: 3, 
          completion_rate: 92,
          difficulty: 'medium',
          tasks: [
            { id: 't4', name: 'Type Definitions', status: 'in_progress', priority: 'medium', progress: 60, estimated_time: '1.5h' }
          ],
          analytics: { efficiency: 90, workload: 70, uptime: 99, last_activity: new Date().toISOString() }
        }
      ],
      position: { x: 1, y: 1 },
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20',
      analytics: {
        total_tasks: 10,
        active_tasks: 7,
        completed_today: 3,
        efficiency_score: 90,
        workload_score: 85,
        workload_distribution: [
          { building_id: 'b1', building_name: 'React Tower', task_count: 5, percentage: 50 },
          { building_id: 'b2', building_name: 'Node Center', task_count: 2, percentage: 20 },
          { building_id: 'b3', building_name: 'TypeScript Plaza', task_count: 3, percentage: 30 }
        ]
      }
    },
    // Add other districts with similar structure...
  ]);

  const [agentPaths] = useState<AgentPath[]>([]);
  const [agentMovements, setAgentMovements] = useState<AgentMovement[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [cityStats, setCityStats] = useState({
    totalDistricts: 4,
    totalBuildings: 12,
    totalTasks: 0,
    activeAgents: 0,
    systemHealth: 0,
    efficiency: 0,
    averageWorkload: 0,
    peakActivity: '14:00'
  });

  // Update city stats
  useEffect(() => {
    const totalTasks = districts.reduce((sum, district) => 
      sum + district.buildings.reduce((buildingSum, building) => buildingSum + building.task_count, 0), 0
    );
    const activeAgents = districts.filter(d => d.agent.status === 'working' || d.agent.status === 'thinking').length;
    const avgEfficiency = districts.reduce((sum, district) => sum + district.analytics.efficiency_score, 0) / districts.length;
    const avgWorkload = districts.reduce((sum, district) => 
      sum + district.buildings.reduce((buildingSum, building) => buildingSum + building.analytics.workload, 0) / district.buildings.length, 0
    ) / districts.length;

    setCityStats({
      totalDistricts: districts.length,
      totalBuildings: districts.reduce((sum, district) => sum + district.buildings.length, 0),
      totalTasks,
      activeAgents,
      systemHealth: Math.round(avgEfficiency),
      efficiency: Math.round(avgEfficiency),
      averageWorkload: Math.round(avgWorkload),
      peakActivity: '14:00'
    });
  }, [districts]);

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrict(districtId);
  };

  const handleBuildingClick = (buildingId: string) => {
    console.log('Building clicked:', buildingId);
  };

  const handleTaskHover = (taskId: string | null) => {
    console.log('Task hovered:', taskId);
  };

  const handleMovementComplete = (agentId: string) => {
    setAgentMovements(prev => prev.filter(movement => movement.agentId !== agentId));
  };

  const selectedDistrictData = districts.find(d => d.id === selectedDistrict);

  return (
    <div className="space-y-6">
      {/* City Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
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
            <EnhancedCityDistrict
              key={district.id}
              district={district}
              onDistrictClick={handleDistrictClick}
              onBuildingClick={handleBuildingClick}
              onTaskHover={handleTaskHover}
            />
          ))}
        </div>

        {/* Agent Paths */}
        <div className="absolute inset-0 pointer-events-none">
          {agentPaths.map((path) => (
            <EnhancedAgentPath
              key={path.id}
              path={path}
              districts={districts.map(d => ({ id: d.id, position: d.position, name: d.name }))}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Components Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Skyline */}
        <DynamicSkyline
          districts={districts}
          showAnalytics={showAnalytics}
          onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        />

        {/* Building Status Indicator */}
        <BuildingStatusIndicator
          buildings={districts.flatMap(d => d.buildings.map(b => ({
            id: b.id,
            name: b.name,
            status: b.status,
            task_count: b.task_count
          })))}
        />
      </div>

      {/* Movement Tracker */}
      <MovementTracker
        movements={agentMovements}
        onMovementComplete={handleMovementComplete}
      />

      {/* City Analytics */}
      <CityAnalytics
        cityStats={cityStats}
        districtTrends={districts.map(d => ({
          districtId: d.id,
          districtName: d.name,
          trend: 'up' as const,
          change: Math.floor(Math.random() * 20) - 10,
          efficiency: d.analytics.efficiency_score
        }))}
      />

      {/* District Details Panel */}
      {selectedDistrictData && (
        <DistrictDetailsPanel
          district={selectedDistrictData}
          isOpen={!!selectedDistrict}
          onClose={() => setSelectedDistrict(null)}
          onTaskClick={(taskId) => console.log('Task clicked:', taskId)}
          onBuildingClick={handleBuildingClick}
        />
      )}
    </div>
  );
};

export default EnhancedCityDashboard;
