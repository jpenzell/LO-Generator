import React from 'react';
import { BookOpen, Target, List, Brain, Scale, CheckSquare } from 'lucide-react';

function ObjectiveGuidance() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Learning Objectives Guide</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="text-green-600" />
            <h4 className="font-medium text-gray-800">Terminal vs. Enabling</h4>
          </div>
          <p className="text-sm text-gray-600">
            Terminal objectives are final outcomes, while enabling objectives are the stepping stones needed to reach them. Think of terminal objectives as your destination and enabling objectives as the path to get there.
          </p>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-700">
              <strong>Tip:</strong> Start with your terminal objective and work backwards to identify the necessary enabling objectives.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" />
            <h4 className="font-medium text-gray-800">Bloom's Taxonomy</h4>
          </div>
          <p className="text-sm text-gray-600">
            Progress from lower-order thinking (remember, understand) to higher-order thinking (analyze, evaluate, create). Match verbs to the appropriate cognitive level.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Tip:</strong> Use higher-level verbs for terminal objectives and supporting levels for enabling objectives.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="text-purple-600" />
            <h4 className="font-medium text-gray-800">SMART Criteria</h4>
          </div>
          <p className="text-sm text-gray-600">
            Ensure objectives are Specific, Measurable, Achievable, Relevant, and Time-bound. Each component should be clearly defined.
          </p>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-purple-700">
              <strong>Tip:</strong> Include specific conditions and measurable criteria in each objective.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="text-indigo-600" />
          <h4 className="font-medium text-gray-800">Best Practices</h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600">•</span>
            Focus on observable behaviors and measurable outcomes
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600">•</span>
            Include clear conditions for performance
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600">•</span>
            Specify measurable success criteria
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600">•</span>
            Align with overall learning goals
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600">•</span>
            Use action verbs that match cognitive level
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600">•</span>
            Ensure objectives build progressively
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ObjectiveGuidance;