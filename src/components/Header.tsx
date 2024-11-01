import React from 'react';
import { BookOpen } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Objectives Generator</h1>
              <p className="text-sm text-gray-600">Create effective, measurable learning objectives</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;