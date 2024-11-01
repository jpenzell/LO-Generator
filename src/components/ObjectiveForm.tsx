import React, { useState } from 'react';
import { X, Wand2, Loader } from 'lucide-react';
import { bloomsVerbs } from '../data/bloomsData';
import { Objective } from '../types';
import { generateObjectivesFromContent } from '../services/aiService';
import AISuggestions from './AISuggestions';

interface ObjectiveFormProps {
  onSubmit: (objectives: Objective[]) => void;
  onCancel: () => void;
  courseName: string;
  content?: string;
}

function ObjectiveForm({ onSubmit, onCancel, courseName, content }: ObjectiveFormProps) {
  const [formData, setFormData] = useState({
    type: 'terminal' as 'terminal' | 'enabling',
    level: '',
    verb: '',
    task: '',
    condition: '',
    criteria: '',
  });

  const [aiState, setAiState] = useState({
    loading: false,
    error: null as string | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newObjective: Objective = {
      id: crypto.randomUUID(),
      type: formData.type,
      level: formData.level,
      verb: formData.verb,
      task: formData.task,
      condition: formData.condition,
      criteria: formData.criteria,
      timestamp: new Date().toISOString(),
    };
    onSubmit([newObjective]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateObjectives = async () => {
    if (!content) {
      setAiState(prev => ({
        ...prev,
        error: 'Please upload course content first',
      }));
      return;
    }

    setAiState({ loading: true, error: null });
    
    try {
      const objectives = await generateObjectivesFromContent(content, courseName);
      onSubmit(objectives);
      onCancel(); // Close form after successful generation
    } catch (error) {
      setAiState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to generate objectives',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Create New Objective</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      {content && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGenerateObjectives}
            disabled={aiState.loading}
            className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              aiState.loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {aiState.loading ? (
              <>
                <Loader className="animate-spin" size={16} />
                Generating Objectives...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Generate Objectives from Content
              </>
            )}
          </button>
          {aiState.error && (
            <p className="mt-2 text-sm text-red-600">{aiState.error}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objective Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={aiState.loading}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="terminal">Terminal</option>
            <option value="enabling">Enabling</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bloom's Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            disabled={aiState.loading}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a level</option>
            {Object.keys(bloomsVerbs).map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action Verb
          </label>
          <select
            name="verb"
            value={formData.verb}
            onChange={handleChange}
            required
            disabled={aiState.loading}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a verb</option>
            {formData.level && bloomsVerbs[formData.level as keyof typeof bloomsVerbs].map(verb => (
              <option key={verb} value={verb}>
                {verb}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task/Content
          </label>
          <input
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
            required
            disabled={aiState.loading}
            placeholder="What should the learner be able to do?"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            disabled={aiState.loading}
            placeholder="Under what conditions should the learner perform?"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Success Criteria
          </label>
          <input
            type="text"
            name="criteria"
            value={formData.criteria}
            onChange={handleChange}
            required
            disabled={aiState.loading}
            placeholder="How will success be measured?"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={aiState.loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={aiState.loading}
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
            aiState.loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Create Objective
        </button>
      </div>
    </form>
  );
}

export default ObjectiveForm;