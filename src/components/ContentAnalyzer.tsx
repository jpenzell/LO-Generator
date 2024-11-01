import React, { useState } from 'react';
import { Upload, FileText, Loader, AlertCircle } from 'lucide-react';
import { analyzeContent } from '../services/aiService';
import { Objective, ContentAnalysis } from '../types';

interface ContentAnalyzerProps {
  objectives: Objective[];
}

function ContentAnalyzer({ objectives }: ContentAnalyzerProps) {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setContent(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!content || objectives.length === 0) {
      setError('Please provide both content and objectives to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeContent(content, objectives);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Analysis</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Training Content
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-400 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm text-gray-500">Upload a text or markdown file</span>
            <input type="file" className="hidden" accept=".txt,.md" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {content && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Content Preview</h4>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Analyze Content
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{content}</pre>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Coverage Analysis</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {Object.entries(analysis.coverage).map(([objectiveId, coverage]) => {
                const objective = objectives.find(obj => obj.id === objectiveId);
                return (
                  <div key={objectiveId} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${coverage.covered ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {objective?.task}
                      </span>
                    </div>
                    {coverage.locations.length > 0 && (
                      <ul className="ml-4 text-sm text-gray-600">
                        {coverage.locations.map((location, idx) => (
                          <li key={idx}>• {location}</li>
                        ))}
                      </ul>
                    )}
                    {coverage.suggestions?.map((suggestion, idx) => (
                      <p key={idx} className="ml-4 text-sm text-yellow-700 mt-1">
                        Suggestion: {suggestion}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {analysis.gaps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Content Gaps</h4>
              <ul className="bg-yellow-50 rounded-lg p-4 space-y-2">
                {analysis.gaps.map((gap, idx) => (
                  <li key={idx} className="text-sm text-yellow-700">• {gap}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Improvement Suggestions</h4>
              <ul className="bg-indigo-50 rounded-lg p-4 space-y-2">
                {analysis.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-indigo-700">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ContentAnalyzer;