import OpenAI from 'openai';
import { AISuggestion, Objective, ContentAnalysis } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateObjectivesFromContent(content: string): Promise<Objective[]> {
  try {
    if (!content.trim()) {
      throw new Error('Content cannot be empty');
    }

    const prompt = `Analyze this content and generate appropriate learning objectives. Create both terminal and enabling objectives. Terminal objectives should be high-level outcomes, while enabling objectives should be specific steps to achieve the terminal objectives. Format as JSON array with objects containing:
    {
      type: "terminal" or "enabling",
      level: Bloom's level,
      verb: appropriate action verb,
      task: specific learning task,
      condition: learning conditions,
      criteria: measurable success criteria,
      parentId: null for terminal, terminal objective's id for enabling
    }
    
    Content to analyze: ${content.slice(0, 6000)}`; // Limit content length to avoid token limits

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000, // Limit response size
    });

    if (!response.choices[0].message.content) {
      throw new Error('No response received from AI service');
    }

    try {
      const objectives = JSON.parse(response.choices[0].message.content);
      if (!Array.isArray(objectives)) {
        throw new Error('Invalid response format');
      }

      return objectives.map((obj: any) => ({
        ...obj,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }));
    } catch (parseError) {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Failed to generate objectives:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate objectives: ${error.message}`);
    }
    throw new Error('Failed to generate objectives');
  }
}

export async function validateObjective(objective: Objective): Promise<string[]> {
  try {
    const prompt = `Analyze this learning objective and provide specific improvement suggestions:
    Type: ${objective.type}
    Level: ${objective.level}
    Verb: ${objective.verb}
    Task: ${objective.task}
    Condition: ${objective.condition}
    Criteria: ${objective.criteria}

    Consider:
    1. SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
    2. Appropriate use of Bloom's taxonomy verbs
    3. Clarity and precision of language
    4. Measurability of success criteria
    5. Alignment with objective type (terminal vs enabling)
    
    Return an array of specific, actionable suggestions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0].message.content) {
      return ['No suggestions available'];
    }

    try {
      const suggestions = JSON.parse(response.choices[0].message.content);
      if (!Array.isArray(suggestions)) {
        return ['Invalid suggestions format'];
      }
      return suggestions;
    } catch (parseError) {
      return ['Failed to parse suggestions'];
    }
  } catch (error) {
    console.error('Validation error:', error);
    return ['Failed to validate objective'];
  }
}

export async function analyzeObjectiveAlignment(objectives: Objective[]): Promise<{
  alignmentIssues: string[];
  improvements: string[];
}> {
  try {
    const prompt = `Analyze these learning objectives for alignment and completeness:
    ${objectives.map(obj => `
      Type: ${obj.type}
      Level: ${obj.level}
      Verb: ${obj.verb}
      Task: ${obj.task}
      Condition: ${obj.condition}
      Criteria: ${obj.criteria}
      ${obj.parentId ? `Parent ID: ${obj.parentId}` : ''}
    `).join('\n')}

    Evaluate:
    1. Do enabling objectives properly support their terminal objectives?
    2. Are there any gaps in the learning progression?
    3. Is there appropriate coverage of all necessary skills/knowledge?
    4. Are the objectives properly sequenced?
    
    Return JSON with:
    {
      "alignmentIssues": [array of specific alignment problems],
      "improvements": [array of suggested improvements]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0].message.content) {
      return {
        alignmentIssues: ['No analysis available'],
        improvements: []
      };
    }

    try {
      const result = JSON.parse(response.choices[0].message.content);
      return {
        alignmentIssues: result.alignmentIssues || [],
        improvements: result.improvements || []
      };
    } catch (parseError) {
      return {
        alignmentIssues: ['Failed to parse analysis'],
        improvements: []
      };
    }
  } catch (error) {
    console.error('Alignment analysis error:', error);
    return {
      alignmentIssues: ['Failed to analyze alignment'],
      improvements: []
    };
  }
}

export async function getDetailedFeedback(objective: Objective): Promise<{
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
}> {
  try {
    const prompt = `Provide detailed feedback for this learning objective:
    Type: ${objective.type}
    Level: ${objective.level}
    Verb: ${objective.verb}
    Task: ${objective.task}
    Condition: ${objective.condition}
    Criteria: ${objective.criteria}

    Return JSON with:
    {
      "strengths": [specific strong points],
      "weaknesses": [areas needing improvement],
      "suggestions": [
        {
          "type": "suggested type if needs change",
          "level": "suggested level if needs change",
          "verb": "suggested verb if needs change",
          "task": "suggested task if needs change",
          "condition": "suggested condition if needs change",
          "criteria": "suggested criteria if needs change"
        }
      ],
      "examples": [example revisions]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0].message.content) {
      return {
        strengths: [],
        weaknesses: ['No feedback available'],
        suggestions: [],
        examples: []
      };
    }

    try {
      const feedback = JSON.parse(response.choices[0].message.content);
      return {
        strengths: feedback.strengths || [],
        weaknesses: feedback.weaknesses || [],
        suggestions: feedback.suggestions || [],
        examples: feedback.examples || []
      };
    } catch (parseError) {
      return {
        strengths: [],
        weaknesses: ['Failed to parse feedback'],
        suggestions: [],
        examples: []
      };
    }
  } catch (error) {
    console.error('Detailed feedback error:', error);
    return {
      strengths: [],
      weaknesses: ['Failed to get detailed feedback'],
      suggestions: [],
      examples: []
    };
  }
}