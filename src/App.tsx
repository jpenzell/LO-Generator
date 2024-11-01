import React, { useState } from 'react';
import { BookOpen, Target, List, ArrowRight, Plus, Trash2, Save, Download, FolderOpen } from 'lucide-react';
import Header from './components/Header';
import ObjectiveForm from './components/ObjectiveForm';
import ObjectivesList from './components/ObjectivesList';
import CourseUploader from './components/CourseUploader';
import ObjectiveGuidance from './components/ObjectiveGuidance';
import { Objective } from './types';

function App() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<string>('');

  const handleAddObjective = (newObjectives: Objective[]) => {
    setObjectives(prev => [...prev, ...newObjectives]);
    setShowForm(false);
  };

  const handleDeleteObjective = (id: string) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  const handleUpdateObjective = (id: string, updates: Partial<Objective>) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    ));
  };

  const handleExport = () => {
    const data = JSON.stringify({
      course: currentCourse,
      objectives: objectives
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCourse || 'learning'}-objectives.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleObjectivesGenerated = (newObjectives: Objective[]) => {
    setObjectives(prev => [...prev, ...newObjectives]);
    setShowUploader(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Target className="text-indigo-600" />
                Learning Objectives
              </h2>
              {currentCourse && (
                <p className="text-sm text-gray-600 mt-1">Course: {currentCourse}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUploader(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FolderOpen size={18} />
                Upload Course Content
              </button>
              {objectives.length > 0 && (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download size={18} />
                  Export
                </button>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} />
                Add Objective
              </button>
            </div>
          </div>

          {!showForm && !showUploader && (
            <ObjectiveGuidance />
          )}

          {showUploader && (
            <CourseUploader 
              onClose={() => setShowUploader(false)}
              onCourseSelect={setCurrentCourse}
              onObjectivesGenerated={handleObjectivesGenerated}
            />
          )}

          {showForm && (
            <div className="mb-8">
              <ObjectiveForm 
                onSubmit={handleAddObjective} 
                onCancel={() => setShowForm(false)}
                courseName={currentCourse}
              />
            </div>
          )}

          <ObjectivesList 
            objectives={objectives} 
            onDelete={handleDeleteObjective}
            onUpdate={handleUpdateObjective}
          />

          {objectives.length === 0 && !showForm && !showUploader && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No objectives yet</h3>
              <p className="text-gray-500 mb-4">Start by uploading course content or adding objectives manually</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowUploader(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FolderOpen size={18} />
                  Upload Course Content
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={18} />
                  Add Manually
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;