'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Settings,
  Download
} from 'lucide-react';

interface IDEAgentTask {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  files_modified: string[];
  quality_score: number;
  created_at: string;
}

export default function IDEAgentInterface() {
  const [taskDescription, setTaskDescription] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<IDEAgentTask | null>(null);
  const [taskHistory, setTaskHistory] = useState<IDEAgentTask[]>([]);
  const [mode, setMode] = useState<'autonomous' | 'guided'>('autonomous');

  const handleStartTask = async () => {
    if (!taskDescription.trim()) return;

    setIsRunning(true);
    
    try {
      const response = await fetch('/api/ide-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_description: taskDescription,
          user_id: 'current_user', // In real app, get from auth
          mode: mode,
          project_path: '/Users/cryptojoker710/Desktop/Stayx My Team Hub /frontend'
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        const newTask: IDEAgentTask = {
          id: data.task_id,
          description: taskDescription,
          status: 'running',
          progress: data.progress || 0,
          files_modified: data.files_modified || [],
          quality_score: data.quality_score || 0,
          created_at: new Date().toISOString()
        };
        
        setCurrentTask(newTask);
        setTaskHistory(prev => [newTask, ...prev]);
        
        // Start polling for updates
        pollTaskStatus(data.task_id);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error starting IDE Agent task:', error);
      setIsRunning(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/ide-agent?task_id=${taskId}&user_id=current_user`);
        const data = await response.json();
        
        if (data.status === 'completed' || data.status === 'error') {
          setIsRunning(false);
          clearInterval(interval);
          
          setCurrentTask(prev => prev ? {
            ...prev,
            status: data.status,
            progress: 100,
            files_modified: data.files_modified || prev.files_modified,
            quality_score: data.quality_score || prev.quality_score
          } : null);
          
          setTaskHistory(prev => prev.map(task => 
            task.id === taskId 
              ? { ...task, status: data.status, progress: 100 }
              : task
          ));
        } else {
          setCurrentTask(prev => prev ? {
            ...prev,
            progress: data.progress || prev.progress,
            files_modified: data.files_modified || prev.files_modified,
            quality_score: data.quality_score || prev.quality_score
          } : null);
        }
      } catch (error) {
        console.error('Error polling task status:', error);
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'running': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-carbon-black to-medium-gray border border-neon-green/20 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyber-blue to-electric-purple rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">IDE Agent</h3>
            <p className="text-sm text-gray-400">Autonomous code generation & modification</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMode(mode === 'autonomous' ? 'guided' : 'autonomous')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              mode === 'autonomous' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {mode === 'autonomous' ? 'Autonomous' : 'Guided'}
          </button>
          <button className="p-2 hover:bg-neon-green/10 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Task Input */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Describe the task you want the IDE Agent to perform... (e.g., 'Add user authentication to the login page', 'Optimize the database queries', 'Fix the responsive design issues')"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none resize-none"
              rows={3}
              disabled={isRunning}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleStartTask}
              disabled={isRunning || !taskDescription.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isRunning || !taskDescription.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-neon-green to-cyber-blue text-white hover:opacity-90'
              }`}
            >
              {isRunning ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            {isRunning && (
              <button
                onClick={() => setIsRunning(false)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Current Task Status */}
      {currentTask && (
        <motion.div
          className="mb-6 p-4 bg-gray-800/50 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(currentTask.status)}
              <span className={`font-medium ${getStatusColor(currentTask.status)}`}>
                {currentTask.status.charAt(0).toUpperCase() + currentTask.status.slice(1)}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Quality Score: {currentTask.quality_score}%
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{currentTask.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-neon-green to-cyber-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentTask.progress}%` }}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{currentTask.description}</p>
          
          {currentTask.files_modified.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-2">Files Modified:</div>
              <div className="flex flex-wrap gap-2">
                {currentTask.files_modified.map((file, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs rounded"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Task History */}
      {taskHistory.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Recent Tasks</h4>
          <div className="space-y-3">
            {taskHistory.slice(0, 5).map((task) => (
              <motion.div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <p className="text-sm text-gray-300">{task.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-400">
                    {task.quality_score}%
                  </div>
                  <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
