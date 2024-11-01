import React from 'react';
import { AISuggestion } from '../types';
import { Lightbulb, Loader } from 'lucide-react';

interface AISuggestionsProps {
  suggestion: AISuggestion | null;
  loading: boolean;
  error: string | null;
  onApplySuggestion: (suggestion: AISuggestion) => void;
}

function AISuggestions({ suggestion, loading, error, onApplySuggestion }: AISuggestionsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
        <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Generating AI suggestions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (!suggestion) return null;

  return (
    <div className="bg-indigo-50 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="text-indigo-600 w-5 h-5" />
        <h4 className="font-medium text-indigo-900">AI Suggestion</h4>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Verb:</span> {suggestion.verb}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Task:</span> {suggestion.task}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Condition:</span> {suggestion.condition}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Criteria:</span> {suggestion.criteria}
        </p>
      </div>

      <button
        onClick={() => onApplySuggestion(suggestion)}
        className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Apply Suggestion
      </button>
    </div>
  );
}

export default AISuggestions;