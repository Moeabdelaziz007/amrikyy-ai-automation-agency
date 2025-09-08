'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Users, 
  Play,
  BarChart3,
  Target,
  Brain,
  Loader2
} from 'lucide-react';

interface OptimizationPanelProps {
  className?: string;
  optimalSolution: {
    action: string;
    description: string;
    cost: number;
    performance_gain: number;
    risk: number;
    implementation_time: number;
    reversibility: string;
    dependencies: string[];
    utility_score: number;
    analysis: {
      total_options_analyzed: number;
      utility_score_range: {
        highest: number;
        lowest: number;
        average: number;
      };
      alternatives_considered: Array<{
        action: string;
        utility_score: number;
        performance_gain: number;
        cost: number;
      }>;
    };
  };
  confirmedRootCause: string;
  onExecute?: () => void;
}

export default function OptimizationPanel({ 
  className = '', 
  optimalSolution, 
  confirmedRootCause,
  onExecute 
}: OptimizationPanelProps) {
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
    duration: number;
  }>({ status: null, message: '', duration: 0 });
  
  const getRiskColor = (risk: number) => {
    if (risk > 60) return 'text-red-400';
    if (risk > 30) return 'text-yellow-400';
    return 'text-green-400';
  };const getReversibilityColor = (reversibility: string) => {
    switch (reversibility) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getReversibilityIcon = (reversibility: string) => {
    switch (reversibility) {
      case 'high': return <CheckCircle2 className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionResult({ status: null, message: '', duration: 0 });
    
    try {
      const startTime = Date.now();
      
      // Make API call to remediation endpoint
      const response = await fetch('http://localhost:8001/remediation/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: optimalSolution.action,
          target: confirmedRootCause,
          parameters: {}
        })
      });
      
      const result = await response.json();
      const duration = (Date.now() - startTime) / 1000;
      
      if (response.ok && result.status === 'success') {
        setExecutionResult({
          status: 'success',
          message: result.details,
          duration: duration
        });
        
        // Call the original onExecute callback if provided
        if (onExecute) {
          onExecute();
        }
      } else {
        setExecutionResult({
          status: 'error',
          message: result.details || 'Failed to execute remediation action',
          duration: duration
        });
      }
    } catch (error) {
      const duration = (Date.now() - Date.now()) / 1000;
      setExecutionResult({
        status: 'error',
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: duration
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Quantum Optimization</h3>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-900/30">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Optimal Solution Found
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-900/30">
          <BarChart3 className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">
            Utility Score: {optimalSolution.utility_score}
          </span>
        </div>
      </div>

      {/* Root Cause Context */}
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-blue-400">Confirmed Root Cause</h4>
        </div>
        <p className="text-gray-300 text-sm">
          <span className="font-medium">{confirmedRootCause.replace(/_/g, ' ')}</span>
        </p>
      </div>

      {/* Optimal Solution Details */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Recommended Optimal Action
        </h4>
        
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-lg font-semibold text-green-400">
              {optimalSolution.action.replace(/_/g, ' ')}
            </h5>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">OPTIMAL</span>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">{optimalSolution.description}</p>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Performance Gain</span>
              </div>
              <span className="text-lg font-semibold text-green-400">
                {optimalSolution.performance_gain}%
              </span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Cost</span>
              </div>
              <span className="text-lg font-semibold text-blue-400">
                {optimalSolution.cost}
              </span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Risk</span>
              </div>
              <span className={`text-lg font-semibold ${getRiskColor(optimalSolution.risk)}`}>
                {optimalSolution.risk}%
              </span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Time</span>
              </div>
              <span className="text-lg font-semibold text-purple-400">
                {optimalSolution.implementation_time}m
              </span>
            </div>
          </div>
          
          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getReversibilityIcon(optimalSolution.reversibility)}
                <span className="text-sm text-gray-400">Reversibility</span>
              </div>
              <span className={`text-sm font-medium ${getReversibilityColor(optimalSolution.reversibility)}`}>
                {optimalSolution.reversibility.toUpperCase()}
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Dependencies</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {optimalSolution.dependencies.map((dep, index) => (
                  <span key={index} className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">
                    {dep.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Optimization Analysis
        </h4>
        
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {optimalSolution.analysis.total_options_analyzed}
              </div>
              <div className="text-sm text-gray-400">Options Analyzed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {optimalSolution.analysis.utility_score_range.highest.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Best Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {optimalSolution.analysis.utility_score_range.average.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Average Score</div>
            </div>
          </div>
          
          {optimalSolution.analysis.alternatives_considered.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-300 mb-2">Alternative Solutions Considered:</h5>
              <div className="space-y-2">
                {optimalSolution.analysis.alternatives_considered.map((alt, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-600/50 rounded">
                    <span className="text-sm text-gray-300">{alt.action.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-blue-400">+{alt.performance_gain}%</span>
                      <span className="text-red-400">-{alt.cost}</span>
                      <span className="text-yellow-400">Score: {alt.utility_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution Result */}
      {executionResult.status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg border ${
            executionResult.status === 'success' 
              ? 'bg-green-900/20 border-green-400/30' 
              : 'bg-red-900/20 border-red-400/30'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            {executionResult.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <h4 className={`font-semibold ${
              executionResult.status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {executionResult.status === 'success' ? 'Remediation Executed Successfully' : 'Remediation Failed'}
            </h4>
          </div>
          <p className="text-gray-300 text-sm mb-2">{executionResult.message}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Execution completed in {executionResult.duration.toFixed(2)}s</span>
          </div>
        </motion.div>
      )}

      {/* Execute Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: isExecuting ? 1 : 1.05 }}
          whileTap={{ scale: isExecuting ? 1 : 0.95 }}
          onClick={handleExecute}
          disabled={isExecuting}
          className={`flex items-center gap-3 px-8 py-4 font-semibold rounded-lg shadow-lg transition-all duration-300 ${
            isExecuting 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white'
          }`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Execute Optimal Solution</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
