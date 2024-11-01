import React, { useState } from 'react';
import { Upload, X, FileText, Loader, AlertCircle, Sparkles } from 'lucide-react';
import { extractTextFromFile } from '../utils/fileUtils';
import { generateObjectivesFromContent } from '../services/aiService';
import { Objective } from '../types';

interface CourseUploaderProps {
  onClose: () => void;
  onCourseSelect: (course: string) => void;
  onObjectivesGenerated: (objectives: Objective[]) => void;
}

function CourseUploader({ onClose, onCourseSelect, onObjectivesGenerated }: CourseUploaderProps) {
  const [courseName, setCourseName] = useState('');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const acceptedFileTypes = {
    'text/plain': '.txt',
    'text/markdown': '.md',
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/msword': '.doc',
    'text/html': '.html'
  };

  const acceptedFileTypesString = Object.values(acceptedFileTypes).join(',');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setContent('');
    setSelectedFile(file);

    try {
      const extractedText = await extractTextFromFile(file);
      if (!extractedText.trim()) {
        throw new Error('No text content could be extracted from the file.');
      }
      setContent(extractedText);
      
      if (!courseName) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setCourseName(fileName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateObjectives = async () => {
    if (!content || !courseName || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const objectives = await generateObjectivesFromContent(content, courseName);
      onObjectivesGenerated(objectives);
      onCourseSelect(courseName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate objectives');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upload Course Content</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
          title="Close uploader"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Content
          </label>
          <div className="flex items-center justify-center w-full">
            <label className={`w-full flex flex-col items-center px-4 py-6 bg-white text-gray-400 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isProcessing ? (
                <>
                  <Loader className="w-8 h-8 mb-2 animate-spin" />
                  <span className="text-sm text-gray-500">Processing file...</span>
                </>
              ) : selectedFile ? (
                <>
                  <FileText className="w-8 h-8 mb-2 text-indigo-600" />
                  <span className="text-sm text-gray-500">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400 mt-1">Click to change file</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm text-gray-500 text-center">
                    <span className="font-medium">Click to upload</span> or drag and drop
                    <br />
                    Supported formats: TXT, PDF, DOC, DOCX, HTML
                  </span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept={acceptedFileTypesString}
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>

        {content && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Content Preview</h4>
            <div className="bg-white rounded-lg p-4 max-h-60 overflow-y-auto">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{content}</pre>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={generateObjectives}
            disabled={isGenerating || !content || !courseName}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 ${
              isGenerating || !content || !courseName
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin" size={16} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Objectives
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseUploader;