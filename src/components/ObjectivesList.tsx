import React, { useState } from 'react';
import { Trash2, MessageCircle, Loader, CheckCircle2, Sparkles } from 'lucide-react';
import { Objective } from '../types';
import ObjectiveFeedback from './ObjectiveFeedback';
import { getDetailedFeedback, analyzeObjectiveAlignment } from '../services/aiService';

interface ObjectivesListProps {
  objectives: Objective[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Objective>) => void;
}

function ObjectivesList({ objectives, onDelete, onUpdate }: ObjectivesListProps) {
  const [detailedFeedback, setDetailedFeedback] = useState<Record<string, {
    strengths: string[];
    weaknesses: string[];
    suggestions: Array<{
      type?: string;
      level?: string;
      verb?: string;
      task?: string;
      condition?: string;
      criteria?: string;
    }>;
    examples: string[];
  }>>({});

  const [alignmentAnalysis, setAlignmentAnalysis] = useState<{
    alignmentIssues: string[];
    improvements: string[];
  } | null>(null);

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [applyingImprovements, setApplyingImprovements] = useState(false);

  const handleGetDetailedFeedback = async (objective: Objective) => {
    if (loading[objective.id]) return;

    setLoading(prev => ({ ...prev, [objective.id]: true }));
    try {
      const feedback = await getDetailedFeedback(objective);
      setDetailedFeedback(prev => ({
        ...prev,
        [objective.id]: feedback
      }));
      setSelectedObjective(objective.id);
    } catch (error) {
      console.error('Failed to get detailed feedback:', error);
    } finally {
      setLoading(prev => ({ ...prev, [objective.id]: false }));
    }
  };

  const handleAnalyzeAlignment = async () => {
    if (objectives.length < 2) return;
    
    try {
      const analysis = await analyzeObjectiveAlignment(objectives);
      setAlignmentAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze alignment:', error);
    }
  };

  const handleApplyFeedback = (objectiveId: string, updatedObjective: Objective) => {
    onUpdate(objectiveId, updatedObjective);
    setSelectedObjective(null);
  };

  const handleApplyAllImprovements = async () => {
    if (!alignmentAnalysis?.improvements.length) return;
    
    setApplyingImprovements(true);
    try {
      // Process each improvement suggestion
      alignmentAnalysis.improvements.forEach((improvement, index) => {
        // Find the relevant objective based on the improvement suggestion
        const targetObjective = objectives[index % objectives.length];
        if (targetObjective) {
          // Apply the improvement as an update
          onUpdate(targetObjective.id, {
            // Keep existing properties but update the task to include the improvement
            ...targetObjective,
            task: improvement.includes('task:') 
              ? improvement.split('task:')[1].trim()
              : targetObjective.task,
            // Update timestamp to reflect the change
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Clear the analysis after applying improvements
      setAlignmentAnalysis(null);
    } catch (error) {
      console.error('Failed to apply improvements:', error);
    } finally {
      setApplyingImprovements(false);
    }
  };

  if (objectives.length === 0) return null;

  return (
    <div className="space-y-6">
      {objectives.length >= 2 && (
        <button
          onClick={handleAnalyzeAlignment}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <CheckCircle2 size={18} />
          Analyze Objective Alignment
        </button>
      )}

      {alignmentAnalysis && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Alignment Analysis</h4>
            {alignmentAnalysis.improvements.length > 0 && (
              <button
                onClick={handleApplyAllImprovements}
                disabled={applyingImprovements}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  applyingImprovements
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {applyingImprovements ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Applying Improvements...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Apply All Improvements
                  </>
                )}
              </button>
            )}
          </div>
          
          {alignmentAnalysis.alignmentIssues.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Issues</h5>
              <ul className="list-disc list-inside space-y-1">
                {alignmentAnalysis.alignmentIssues.map((issue, index) => (
                  <li key={index} className="text-sm text-gray-600">{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {alignmentAnalysis.improvements.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Suggested Improvements</h5>
              <ul className="list-disc list-inside space-y-1">
                {alignmentAnalysis.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-gray-600">{improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {objectives.map((objective) => (
        <div
          key={objective.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full">
                  {objective.level.charAt(0).toUpperCase() + objective.level.slice(1)}
                </span>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                  {objective.type}
                </span>
                <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                  {objective.verb}
                </span>
              </div>
              
              <p className="text-gray-900 font-medium mb-2">
                {objective.verb} {objective.task}
              </p>
              
              {objective.condition && (
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Condition:</span> {objective.condition}
                </p>
              )}
              
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Success Criteria:</span> {objective.criteria}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleGetDetailedFeedback(objective)}
                disabled={loading[objective.id]}
                className={`p-2 rounded-lg transition-colors ${
                  loading[objective.id] 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-indigo-500 hover:bg-gray-100'
                }`}
              >
                {loading[objective.id] ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <MessageCircle size={18} />
                )}
              </button>
              <button
                onClick={() => onDelete(objective.id)}
                disabled={loading[objective.id]}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {selectedObjective === objective.id && detailedFeedback[objective.id] && (
            <div className="mt-4">
              <ObjectiveFeedback
                feedback={detailedFeedback[objective.id]}
                objective={objective}
                onApplyFeedback={(updatedObj) => handleApplyFeedback(objective.id, updatedObj)}
                onClose={() => setSelectedObjective(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ObjectivesList;