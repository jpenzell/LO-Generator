export const bloomsVerbs = {
  remember: [
    'define', 'describe', 'identify', 'label', 'list', 'match', 'name', 'recall',
    'recognize', 'state', 'arrange', 'duplicate', 'memorize', 'order', 'relate',
    'repeat', 'reproduce', 'select'
  ],
  understand: [
    'classify', 'compare', 'explain', 'illustrate', 'interpret', 'outline',
    'summarize', 'translate', 'convert', 'defend', 'distinguish', 'estimate',
    'extend', 'generalize', 'give examples', 'infer', 'paraphrase', 'predict',
    'rewrite', 'discuss'
  ],
  apply: [
    'apply', 'demonstrate', 'implement', 'modify', 'operate', 'practice',
    'solve', 'use', 'calculate', 'change', 'choose', 'complete', 'compute',
    'construct', 'determine', 'develop', 'experiment', 'illustrate', 'manipulate',
    'prepare', 'produce', 'relate', 'show', 'sketch'
  ],
  analyze: [
    'analyze', 'categorize', 'compare', 'contrast', 'differentiate', 'examine',
    'investigate', 'organize', 'appraise', 'break down', 'calculate', 'criticize',
    'diagram', 'discriminate', 'distinguish', 'experiment', 'identify', 'illustrate',
    'infer', 'outline', 'point out', 'relate', 'select', 'separate', 'subdivide', 'test'
  ],
  evaluate: [
    'appraise', 'argue', 'critique', 'defend', 'evaluate', 'judge', 'justify',
    'support', 'assess', 'choose', 'compare', 'conclude', 'contrast', 'criticize',
    'decide', 'discriminate', 'estimate', 'explain', 'interpret', 'measure', 'rate',
    'recommend', 'revise', 'score', 'select', 'summarize', 'value'
  ],
  create: [
    'compose', 'construct', 'create', 'design', 'develop', 'formulate', 'plan',
    'produce', 'arrange', 'assemble', 'categorize', 'collect', 'combine',
    'compile', 'devise', 'explain', 'generate', 'manage', 'modify', 'organize',
    'perform', 'prepare', 'propose', 'rearrange', 'reconstruct', 'relate',
    'reorganize', 'revise', 'rewrite', 'set up', 'summarize', 'synthesize', 'tell', 'write'
  ]
};

export const objectiveTypes = {
  terminal: {
    description: 'Terminal objectives are the final learning outcomes that learners should achieve by the end of the instruction.',
    examples: [
      'By the end of this course, learners will be able to develop a complete project management plan.',
      'Learners will successfully troubleshoot and repair common network issues.'
    ]
  },
  enabling: {
    description: 'Enabling objectives are the smaller, intermediate learning steps needed to achieve the terminal objective.',
    examples: [
      'Define the key components of a project management plan',
      'Identify common network troubleshooting tools'
    ]
  }
};