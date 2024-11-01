export interface Objective {
  id: string;
  type: 'terminal' | 'enabling';
  level: string;
  verb: string;
  task: string;
  condition: string;
  criteria: string;
  timestamp: string;
  parentId?: string; // For enabling objectives to link to their terminal objective
}

export interface AISuggestion {
  verb: string;
  task: string;
  condition: string;
  criteria: string;
}

export interface ContentAnalysis {
  objectives: Objective[];
  gaps: string[];
  suggestions: string[];
  coverage: {
    [objectiveId: string]: {
      covered: boolean;
      locations: string[];
      suggestions?: string[];
    };
  };
}