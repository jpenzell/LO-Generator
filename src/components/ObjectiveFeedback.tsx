import React, { useState } from 'react';
import { Objective } from '../types';
import { CheckCircle2, AlertCircle, Lightbulb, BookOpen, XCircle } from 'lucide-react';

interface ObjectiveFeedbackProps {
  feedback: {
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
  };
  objective: Objective;
  onApplyFeedback: (updatedObjective: Objective) => void;
  onClose: () => void;
}

function ObjectiveFeedback({ feedback, objective, onApplyFeedback, onClose }: ObjectiveFeedbackProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [editedObjective, setEditedObjective] = useState<Objective>(objective);

  const handleApplySuggestion = (suggestion: typeof feedback.suggestions[0], index: number) => {
    setSelectedSuggestion(index);
    setEditedObjective({
      ...objective,
      type: (suggestion.type?.toLowerCase() as 'terminal' | 'enabling') || objective.type,
      level: suggestion.level?.toLowerCase() || objective.level,
      verb: suggestion.verb || objective.verb,
      task: suggestion.task || objective.task,
      condition: suggestion.condition || objective.condition,
      criteria: suggestion.criteria || objective.criteria
    });
  };

  const handleSaveChanges = () => {
    onApplyFeedback(editedObjective);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Objective Feedback</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <XCircle size={20} />
        </button>
      </div>

      {feedback.strengths && feedback.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="flex items-center gap-2 text-green-700 font-medium mb-2">
            <CheckCircle2 size={18} />
            Strengths
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.weaknesses && feedback.weaknesses.length > 0 && (
        <div className="mb-4">
          <h4 className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
            <AlertCircle size={18} />
            Areas for Improvement
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {feedback.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="flex items-center gap-2 text-indigo-700 font-medium mb-2">
            <Lightbulb size={18} />
            Suggested Improvements
          </h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4">
                  {suggestion.type && (
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2">{suggestion.type}</span>
                    </div>
                  )}
                  {suggestion.level && (
                    <div>
                      <span className="font-medium text-gray-700">Level:</span>
                      <span className="ml-2">{suggestion.level}</span>
                    </div>
                  )}
                  {suggestion.verb && (
                    <div>
                      <span className="font-medium text-gray-700">Verb:</span>
                      <span className="ml-2">{suggestion.verb}</span>
                    </div>
                  )}
                </div>
                {suggestion.task && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-700">Task:</span>
                    <p className="mt-1">{suggestion.task}</p>
                  </div>
                )}
                {suggestion.condition && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-700">Condition:</span>
                    <p className="mt-1">{suggestion.condition}</p>
                  </div>
                )}
                {suggestion.criteria && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-700">Criteria:</span>
                    <p className="mt-1">{suggestion.criteria}</p>
                  </div>
                )}
                <button
                  onClick={() => handleApplySuggestion(suggestion, index)}
                  className={`mt-3 px-3 py-1 rounded-md text-xs font-medium ${
                    selectedSuggestion === index
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  Apply this suggestion
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.examples && feedback.examples.length > 0 && (
        <div className="mb-6">
          <h4 className="flex items-center gap-2 text-blue-700 font-medium mb-2">
            <BookOpen size={18} />
            Example Objectives
          </h4>
          <div className="space-y-2">
            {feedback.examples.map((example, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <span className="text-sm text-gray-700">{example}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        {selectedSuggestion !== null && (
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Apply Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default ObjectiveFeedback;