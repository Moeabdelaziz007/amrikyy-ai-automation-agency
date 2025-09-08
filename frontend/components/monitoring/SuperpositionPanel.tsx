'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBackendStore } from '@/lib/stores/backendStore';
import { useMonitoringMetrics, useRemediationStatus } from '@/lib/hooks/useQuantumData';
import { 
  Brain, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  Target,
  Search,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface SuperpositionPanelProps {
  className?: string;
}

export default function SuperpositionPanel({ className = '' }: SuperpositionPanelProps) {
  const { superpositionState } = useBackendStore();

  if (!superpositionState || Object.keys(superpositionState.probabilities).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Quantum Superposition Analysis</h3>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-400">System operating within normal parameters</p>
          <p className="text-sm text-gray-500 mt-1">No anomalies detected</p>
        </div>
      </motion.div>
    );
  }

  const { 
    probabilities, 
    confidence, 
    recommendations, 
    confirmed_root_cause,
    confirmed_details,
    confirmed_severity,
    all_confirmed_causes,
    total_investigation_time
  } = superpositionState;
  const sortedCauses = Object.entries(probabilities).sort(([,a], [,b]) => b - a);

  // Determine investigation status
  const isInvestigating = !confirmed_root_cause && Object.keys(probabilities).length > 0;
  const investigationComplete = confirmed_root_cause !== null;

  const getInvestigationStatus = (causeName: string) => {
    if (!isInvestigating) {
      if (confirmed_root_cause === causeName) {
        return { status: 'confirmed', icon: CheckCircle2, color: 'text-green-400' };
      } else if (all_confirmed_causes?.some(c => c.cause === causeName)) {
        return { status: 'confirmed-secondary', icon: CheckCircle2, color: 'text-blue-400' };
      } else {
        return { status: 'cleared', icon: XCircle, color: 'text-gray-400' };
      }
    }
    return { status: 'investigating', icon: Search, color: 'text-yellow-400' };
  };

  const getConfidenceColor = (conf: number) => {
    if (conf > 0.7) return 'text-green-400';
    if (conf > 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (conf: number) => {
    if (conf > 0.7) return 'bg-green-900/30';
    if (conf > 0.4) return 'bg-yellow-900/30';
    return 'bg-red-900/30';
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
          <Brain className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Quantum Superposition Analysis</h3>
          {isInvestigating && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-900/30">
              <Search className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-medium text-yellow-400">Investigating...</span>
            </div>
          )}
          {investigationComplete && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-900/30">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Confirmed</span>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getConfidenceBg(confidence)}`}>
          <Target className="w-4 h-4" />
          <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
            {Math.round(confidence * 100)}% Confidence
          </span>
        </div>
      </div>

      {/* Confirmed Root Cause */}
      {confirmed_root_cause && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-900/20 border border-green-400/30 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-green-400">
              Root Cause Confirmed
            </h4>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              confirmed_severity === 'critical' ? 'bg-red-900/50 text-red-300' :
              confirmed_severity === 'high' ? 'bg-orange-900/50 text-orange-300' :
              confirmed_severity === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
              'bg-gray-900/50 text-gray-300'
            }`}>
              {confirmed_severity?.toUpperCase()}
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-2">
            <span className="font-medium">{confirmed_root_cause.replace(/_/g, ' ')}</span>
          </p>
          <p className="text-gray-400 text-sm">{confirmed_details}</p>
          {total_investigation_time > 0 && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Investigation completed in {total_investigation_time.toFixed(2)}s</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Root Cause Probabilities */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          {isInvestigating ? 'Investigating Potential Causes' : 'Root Cause Analysis Results'}
        </h4>
        <div className="space-y-3">
          {sortedCauses.map(([cause, probability], index) => {
            const investigationStatus = getInvestigationStatus(cause);
            const StatusIcon = investigationStatus.icon;
            
            return (
              <motion.div
                key={cause}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-700/50 rounded-lg p-3 border ${
                  investigationStatus.status === 'confirmed' ? 'border-green-400/50 bg-green-900/20' :
                  investigationStatus.status === 'confirmed-secondary' ? 'border-blue-400/50 bg-blue-900/20' :
                  investigationStatus.status === 'cleared' ? 'border-gray-500/50 bg-gray-800/50' :
                  'border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${investigationStatus.color} ${
                      investigationStatus.status === 'investigating' ? 'animate-pulse' : ''
                    }`} />
                    <span className="text-white font-medium capitalize">
                      {cause.replace(/_/g, ' ')}
                    </span>
                    {investigationStatus.status === 'investigating' && (
                      <span className="text-xs text-yellow-400 animate-pulse">Verifying...</span>
                    )}
                    {investigationStatus.status === 'confirmed' && (
                      <span className="text-xs text-green-400">✓ Confirmed</span>
                    )}
                    {investigationStatus.status === 'confirmed-secondary' && (
                      <span className="text-xs text-blue-400">✓ Found</span>
                    )}
                    {investigationStatus.status === 'cleared' && (
                      <span className="text-xs text-gray-400">✗ Cleared</span>
                    )}
                  </div>
                  <span className={`font-semibold ${
                    investigationStatus.status === 'confirmed' ? 'text-green-400' :
                    investigationStatus.status === 'confirmed-secondary' ? 'text-blue-400' :
                    investigationStatus.status === 'cleared' ? 'text-gray-400' :
                    'text-blue-400'
                  }`}>
                    {Math.round(probability * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${probability * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${
                      investigationStatus.status === 'confirmed' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      investigationStatus.status === 'confirmed-secondary' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                      investigationStatus.status === 'cleared' ? 'bg-gradient-to-r from-gray-500 to-gray-400' :
                      'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quantum Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Quantum Recommendations
          </h4>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-400/30 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-green-300 text-sm">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
