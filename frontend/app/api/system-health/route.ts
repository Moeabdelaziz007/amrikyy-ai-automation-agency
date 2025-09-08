import { NextRequest, NextResponse } from 'next/server';

// System Health Interface
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  database_status: 'connected' | 'disconnected' | 'slow';
  server_status: 'running' | 'stopped' | 'maintenance';
  last_healing: string;
  auto_fixes_count: number;
  timestamp: string;
}

interface HealingAction {
  id: string;
  component: string;
  issue: string;
  action: string;
  status: 'success' | 'failed' | 'pending';
  duration: number;
  timestamp: string;
}

// Mock system health data
let mockSystemHealth: SystemHealth = {
  status: 'healthy',
  uptime: 99.9,
  cpu_usage: 45,
  memory_usage: 62,
  network_latency: 12,
  database_status: 'connected',
  server_status: 'running',
  last_healing: new Date().toISOString(),
  auto_fixes_count: 23,
  timestamp: new Date().toISOString()
};

let healingHistory: HealingAction[] = [
  {
    id: '1',
    component: 'Database',
    issue: 'Connection timeout',
    action: 'Restarted connection pool',
    status: 'success',
    duration: 2.3,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    component: 'API Server',
    issue: 'High memory usage',
    action: 'Cleared cache and restarted service',
    status: 'success',
    duration: 8.7,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    component: 'Network',
    issue: 'Packet loss detected',
    action: 'Switched to backup connection',
    status: 'success',
    duration: 1.2,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

// GET - Retrieve system health status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const component = searchParams.get('component');
    const history = searchParams.get('history');

    // Simulate real-time data updates
    mockSystemHealth = {
      ...mockSystemHealth,
      cpu_usage: Math.max(10, Math.min(90, mockSystemHealth.cpu_usage + (Math.random() - 0.5) * 10)),
      memory_usage: Math.max(20, Math.min(85, mockSystemHealth.memory_usage + (Math.random() - 0.5) * 5)),
      network_latency: Math.max(5, Math.min(50, mockSystemHealth.network_latency + (Math.random() - 0.5) * 5)),
      timestamp: new Date().toISOString()
    };

    // Determine overall system status based on metrics
    if (mockSystemHealth.cpu_usage > 80 || mockSystemHealth.memory_usage > 85) {
      mockSystemHealth.status = 'warning';
    } else if (mockSystemHealth.cpu_usage > 95 || mockSystemHealth.memory_usage > 95) {
      mockSystemHealth.status = 'critical';
    } else {
      mockSystemHealth.status = 'healthy';
    }

    if (history === 'true') {
      return NextResponse.json({
        success: true,
        healing_history: healingHistory,
        total: healingHistory.length
      });
    }

    if (component) {
      // Return specific component status
      const componentData = {
        cpu: { usage: mockSystemHealth.cpu_usage, status: mockSystemHealth.cpu_usage > 80 ? 'warning' : 'healthy' },
        memory: { usage: mockSystemHealth.memory_usage, status: mockSystemHealth.memory_usage > 85 ? 'warning' : 'healthy' },
        network: { latency: mockSystemHealth.network_latency, status: mockSystemHealth.network_latency > 30 ? 'warning' : 'healthy' },
        database: { status: mockSystemHealth.database_status },
        server: { status: mockSystemHealth.server_status }
      };

      return NextResponse.json({
        success: true,
        component: component,
        data: componentData[component as keyof typeof componentData] || null
      });
    }

    return NextResponse.json({
      success: true,
      system_health: mockSystemHealth,
      message: 'System health retrieved successfully'
    });

  } catch (error) {
    console.error('System Health API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Trigger healing action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { component, issue, action } = body;

    // Simulate healing process
    const healingAction: HealingAction = {
      id: `healing_${Date.now()}`,
      component: component || 'System',
      issue: issue || 'Performance optimization',
      action: action || 'Automated system tuning',
      status: 'pending',
      duration: 0,
      timestamp: new Date().toISOString()
    };

    // Add to history
    healingHistory.unshift(healingAction);
    
    // Keep only last 50 entries
    if (healingHistory.length > 50) {
      healingHistory = healingHistory.slice(0, 50);
    }

    // Simulate healing process completion
    setTimeout(() => {
      const index = healingHistory.findIndex(h => h.id === healingAction.id);
      if (index !== -1) {
        healingHistory[index] = {
          ...healingAction,
          status: Math.random() > 0.1 ? 'success' : 'failed', // 90% success rate
          duration: Math.random() * 10 + 1
        };
      }
      
      // Update system health
      mockSystemHealth = {
        ...mockSystemHealth,
        auto_fixes_count: mockSystemHealth.auto_fixes_count + 1,
        last_healing: new Date().toISOString(),
        status: 'healthy' // Assume healing improves status
      };
    }, 2000);

    return NextResponse.json({
      success: true,
      healing_action: healingAction,
      message: 'Healing action triggered successfully'
    });

  } catch (error) {
    console.error('System Health API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update system health metrics
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cpu_usage, memory_usage, network_latency, database_status, server_status } = body;

    // Update system health metrics
    mockSystemHealth = {
      ...mockSystemHealth,
      cpu_usage: cpu_usage !== undefined ? cpu_usage : mockSystemHealth.cpu_usage,
      memory_usage: memory_usage !== undefined ? memory_usage : mockSystemHealth.memory_usage,
      network_latency: network_latency !== undefined ? network_latency : mockSystemHealth.network_latency,
      database_status: database_status || mockSystemHealth.database_status,
      server_status: server_status || mockSystemHealth.server_status,
      timestamp: new Date().toISOString()
    };

    // Determine overall status
    if (mockSystemHealth.cpu_usage > 80 || mockSystemHealth.memory_usage > 85) {
      mockSystemHealth.status = 'warning';
    } else if (mockSystemHealth.cpu_usage > 95 || mockSystemHealth.memory_usage > 95) {
      mockSystemHealth.status = 'critical';
    } else {
      mockSystemHealth.status = 'healthy';
    }

    return NextResponse.json({
      success: true,
      system_health: mockSystemHealth,
      message: 'System health updated successfully'
    });

  } catch (error) {
    console.error('System Health API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}