/**
 * Target LLM websites where Prompt3000 should be active.
 * Used for content script injection match patterns and in-page model detection.
 */
export const LLM_SITE_MATCHES: string[] = [
  // OpenAI ChatGPT
  '*://chatgpt.com/*',
  '*://*.chatgpt.com/*',
  '*://chat.openai.com/*',

  // Anthropic Claude
  '*://claude.ai/*',
  '*://*.claude.ai/*',

  // Google Gemini & AI Studio
  '*://gemini.google.com/*',
  '*://aistudio.google.com/*',

  // Perplexity AI
  '*://perplexity.ai/*',
  '*://*.perplexity.ai/*',

  // DeepSeek
  '*://deepseek.com/*',
  '*://*.deepseek.com/*',

  // Microsoft Copilot
  '*://copilot.microsoft.com/*',
  '*://*.copilot.microsoft.com/*',

  // Mistral AI
  '*://chat.mistral.ai/*',
  '*://*.mistral.ai/*',

  // Grok / xAI
  '*://grok.com/*',
  '*://*.grok.com/*',
  '*://x.com/i/grok*',

  // Poe
  '*://poe.com/*',
  '*://*.poe.com/*',

  // Phind
  '*://phind.com/*',
  '*://*.phind.com/*',

  // Hugging Face Chat
  '*://huggingface.co/chat/*',
  '*://*.huggingface.co/chat/*',

  // v0 by Vercel
  '*://v0.dev/*',
  '*://*.v0.dev/*',
];

export interface LLMSiteInfo {
  name: string;
  domain: string;
  targetId: 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'deepseek' | 'generic';
}

export const SUPPORTED_LLM_SITES: LLMSiteInfo[] = [
  { name: 'ChatGPT', domain: 'chatgpt.com', targetId: 'chatgpt' },
  { name: 'Claude', domain: 'claude.ai', targetId: 'claude' },
  { name: 'Google Gemini', domain: 'gemini.google.com', targetId: 'gemini' },
  { name: 'Google AI Studio', domain: 'aistudio.google.com', targetId: 'gemini' },
  { name: 'Perplexity', domain: 'perplexity.ai', targetId: 'perplexity' },
  { name: 'DeepSeek', domain: 'chat.deepseek.com', targetId: 'deepseek' },
  { name: 'Microsoft Copilot', domain: 'copilot.microsoft.com', targetId: 'chatgpt' },
  { name: 'Mistral Le Chat', domain: 'chat.mistral.ai', targetId: 'generic' },
  { name: 'Grok', domain: 'grok.com', targetId: 'generic' },
  { name: 'Poe', domain: 'poe.com', targetId: 'generic' },
  { name: 'Phind', domain: 'phind.com', targetId: 'generic' },
  { name: 'HuggingChat', domain: 'huggingface.co', targetId: 'generic' },
  { name: 'v0', domain: 'v0.dev', targetId: 'coder' as any },
];
