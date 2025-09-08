// IDE Agent API - Integration with Quantum Brain MVP
import { NextRequest, NextResponse } from 'next/server';

interface IDEAgentRequest {
  task_description: string;
  project_path?: string;
  user_id: string;
  mode?: 'autonomous' | 'guided';
}

interface IDEAgentResponse {
  status: 'success' | 'error' | 'running';
  task_id: string;
  message: string;
  progress?: number;
  files_modified?: string[];
  code_changes?: string;
  quality_score?: number;
}

// Quantum Brain MVP Python API URL
const QUANTUM_BRAIN_API_URL = process.env.QUANTUM_BRAIN_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest): Promise<NextResponse<IDEAgentResponse>> {
  try {
    const body: IDEAgentRequest = await request.json();
    const { task_description, project_path, user_id, mode = 'autonomous' } = body;

    // Validate required fields
    if (!task_description || !user_id) {
      return NextResponse.json({
        status: 'error',
        task_id: '',
        message: 'Task description and user ID are required'
      }, { status: 400 });
    }

    // Call Quantum Brain MVP IDE Agent
    const quantumResponse = await fetch(`${QUANTUM_BRAIN_API_URL}/api/ide-agent/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QUANTUM_BRAIN_API_KEY || 'dev-key'}`
      },
      body: JSON.stringify({
        task_description,
        project_path: project_path || '/Users/cryptojoker710/Desktop/Stayx My Team Hub /frontend',
        user_id,
        mode,
        timestamp: new Date().toISOString()
      })
    });

    if (!quantumResponse.ok) {
      throw new Error(`Quantum Brain API error: ${quantumResponse.status}`);
    }

    const quantumData = await quantumResponse.json();

    // Transform response to our format
    const response: IDEAgentResponse = {
      status: quantumData.status || 'success',
      task_id: quantumData.task_id || `task_${Date.now()}`,
      message: quantumData.message || 'Task executed successfully',
      progress: quantumData.progress || 100,
      files_modified: quantumData.files_modified || [],
      code_changes: quantumData.code_changes || '',
      quality_score: quantumData.quality_score || 95
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('IDE Agent API Error:', error);
    
    return NextResponse.json({
      status: 'error',
      task_id: '',
      message: `Error executing IDE Agent task: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

// GET endpoint for task status
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');
    const user_id = searchParams.get('user_id');

    if (!task_id || !user_id) {
      return NextResponse.json({
        status: 'error',
        message: 'Task ID and User ID are required'
      }, { status: 400 });
    }

    // Get task status from Quantum Brain MVP
    const statusResponse = await fetch(`${QUANTUM_BRAIN_API_URL}/api/ide-agent/status/${task_id}?user_id=${user_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.QUANTUM_BRAIN_API_KEY || 'dev-key'}`
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();

    return NextResponse.json({
      status: statusData.status || 'unknown',
      progress: statusData.progress || 0,
      message: statusData.message || 'Task status retrieved',
      files_modified: statusData.files_modified || [],
      quality_score: statusData.quality_score || 0
    });

  } catch (error) {
    console.error('IDE Agent Status Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: `Error checking task status: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
