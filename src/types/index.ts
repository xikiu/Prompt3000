export type LLMTarget = 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'deepseek' | 'generic';

export type PromptTone =
  | 'auto'
  | 'academic'
  | 'coder'
  | 'concise'
  | 'creative'
  | 'socratic'
  | 'executive'
  | 'architect';

export type PromptFramework = 'cgc' | 'fewshot' | 'stepbystep' | 'persona_constraints';

export interface PromptResult {
  id: string;
  originalText: string;
  enhancedPrompt: string;
  targetModel: LLMTarget;
  tone: PromptTone;
  framework: PromptFramework;
  timestamp: number;
  tags: string[];
  isFavorite?: boolean;
}

export interface UserSettings {
  defaultTarget: LLMTarget;
  defaultTone: PromptTone;
  defaultFramework: PromptFramework;
  speechEngine: 'browser-native' | 'whisper-api' | 'webgpu';
  autoInsert: boolean;
  floatingWidgetEnabled: boolean;
  hotkeyVoice: string;
  hotkeyEnhance: string;
  openaiKey?: string;
  anthropicKey?: string;
  geminiKey?: string;
}

export type PromptRating = 'incomplete' | 'weak' | 'developing' | 'strong' | 'master';

export type PromptIntentType =
  | 'greeting'
  | 'too_vague'
  | 'academic_explanation'
  | 'learning_education'
  | 'coding_debugging'
  | 'writing_content'
  | 'analysis_comparison'
  | 'creative_ideation'
  | 'system_architecture'
  | 'transformation_translation'
  | 'career_interview'
  | 'business_strategy'
  | 'marketing_copywriting'
  | 'product_ux'
  | 'finance_investment'
  | 'legal_contracts'
  | 'health_fitness'
  | 'travel_planning'
  | 'entity_biography'
  | 'general_request';

export interface PromptScoreCriteria {
  clarity: number; // 0 - 25
  context: number; // 0 - 30
  constraints: number; // 0 - 25
  depth: number; // 0 - 20
}

export interface PromptQuickOption {
  label: string;
  insertText: string;
  category?: string;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  purpose: string;
  placeholder?: string;
  quickOptions: PromptQuickOption[];
}

export interface PromptAnalysis {
  score: number; // 0 - 100
  scoreColor: string; // Dynamic HSL color from Red (0) to Green (100)
  rating: PromptRating;
  ratingLabel: string;
  ringColor: string;
  badgeBg: string;
  intentType: PromptIntentType;
  intentLabel: string;
  intentDescription: string;
  subjectOrTopic: string;
  criteria: PromptScoreCriteria;
  strengths: string[];
  missingElements: string[];
  clarifyingQuestions: ClarifyingQuestion[];
  quickTips: string[];
  isVague?: boolean;
  nudgeHeadline?: string;
  nudgeMessage?: string;
}

