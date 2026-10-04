import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, SlidersHorizontal, Volume2, ArrowUpRight, Sparkles, Plus, Check, RefreshCw, Send } from 'lucide-react';
import { enhancePrompt, extractCorePrompt } from '../../src/utils/promptEnhancer';
import { analyzePrompt, getScoreColor } from '../../src/utils/promptScorer';
import type { LLMTarget, PromptTone, PromptFramework } from '../../src/types';

export interface FloatingCapsuleProps {
  embedded?: boolean;
  onApply?: (text: string) => void;
  className?: string;
  defaultModel?: LLMTarget;
  initialExpanded?: boolean;
  initialPrompt?: string;
}

interface TargetAnchor {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  mode: 'button' | 'chatbox';
  isButton?: boolean;
}

/** Check if an element is currently visible in the DOM and viewport */
const isElementVisible = (el: HTMLElement | null): boolean => {
  if (!el || !el.isConnected) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom >= 0 && rect.top <= window.innerHeight;
};

// --- GEMINI: Locate the Model Button (Flash v / Pro v) - Images 1 & 4 ---
const findGeminiMicButton = (scope: Element): HTMLElement | null => {
  const selectors = [
    'button[aria-label*="microphone" i]',
    'button[aria-label*="mic" i]',
    'button[aria-label*="voice" i]',
    'button[aria-label*="dictat" i]',
    'button[data-test-id*="mic" i]',
    'button[data-test-id*="voice" i]',
  ];
  for (const sel of selectors) {
    const el = scope.querySelector(sel) as HTMLElement;
    if (el && isElementVisible(el)) return el;
  }
  return null;
};

const findGeminiModelButton = (): HTMLElement | null => {
  const composer =
    document.querySelector('.input-area-container') ||
    document.querySelector('.input-area') ||
    document.querySelector('rich-textarea')?.closest('.input-area-container, .input-area, form, div[class*="input"]') ||
    document.querySelector('chat-window') ||
    document.body;

  // 1. Check buttons or elements with model/mode test IDs or attributes
  const selectors = [
    'button[data-test-id*="model" i]',
    'button[data-test-id*="mode" i]',
    'bard-mode-switcher button',
    'bard-mode-switcher',
    '[data-test-id="bard-mode-menu-button"]',
    'button[aria-label*="model" i]',
    'button[aria-label*="mode" i]',
    'button[aria-label*="Flash" i]',
    'button[aria-label*="Pro" i]',
    'button[aria-label*="Gemini" i]',
    'button.mat-mdc-menu-trigger',
  ];
  for (const sel of selectors) {
    const el = composer.querySelector(sel) as HTMLElement;
    if (el && isElementVisible(el)) return el;
  }

  // 2. Search for buttons containing model names (Flash, Pro, Ultra, Gemini, etc.)
  const buttons = Array.from(composer.querySelectorAll('button, div[role="button"]')) as HTMLElement[];
  for (const btn of buttons) {
    const text = btn.textContent?.trim() || '';
    if (
      /^(Flash|Pro|Ultra|Gemini|Advanced|1\.5|2\.0|2\.5)\b/i.test(text) ||
      /\b(Flash|Pro|Ultra)\b/i.test(text)
    ) {
      if (isElementVisible(btn)) return btn;
    }
  }

  // 3. Dropdown/menu button inside composer (chevron / menu trigger)
  for (const btn of buttons) {
    const hasMenu =
      btn.getAttribute('aria-haspopup') === 'menu' ||
      btn.getAttribute('aria-haspopup') === 'true';
    if (hasMenu && isElementVisible(btn)) {
      return btn;
    }
  }

  // 4. Element immediately before the mic button in Gemini (Images 1 & 4 show [Flash v] [mic])
  const micBtn = findGeminiMicButton(composer);
  if (micBtn) {
    let prev = micBtn.previousElementSibling as HTMLElement | null;
    while (prev) {
      if (prev.matches('button, [role="button"]') && isElementVisible(prev)) {
        return prev;
      }
      const childBtn = prev.querySelector('button, [role="button"]') as HTMLElement | null;
      if (childBtn && isElementVisible(childBtn)) {
        return childBtn;
      }
      prev = prev.previousElementSibling as HTMLElement | null;
    }
    return micBtn;
  }

  return null;
};

// --- CLAUDE: Locate Model Text (e.g. "Sonnet 5 Medium") or Right Action Buttons ---
const findClaudeModelElement = (scope: Element): HTMLElement | null => {
  // 1. Check buttons or elements with model test IDs or aria attributes
  const attrSelectors = [
    'button[data-testid*="model" i]',
    'button[aria-label*="model" i]',
    'button[aria-label*="Sonnet" i]',
    'button[aria-label*="Opus" i]',
    'button[aria-label*="Haiku" i]',
    '[data-testid*="model-selector" i]',
    '[data-testid*="model-switcher" i]',
  ];
  for (const sel of attrSelectors) {
    const el = scope.querySelector(sel) as HTMLElement;
    if (el && isElementVisible(el) && !el.closest('div[contenteditable="true"], .ProseMirror, textarea, [role="textbox"]')) {
      return el;
    }
  }

  // 2. Search leaf/compact elements containing model text ("Sonnet", "Opus", "Haiku")
  // Exclude editable prompt text area so we never match user-typed words
  const elements = Array.from(
    scope.querySelectorAll('button, [role="button"], span, p, div')
  ) as HTMLElement[];

  for (const el of elements) {
    if (el.closest('div[contenteditable="true"], .ProseMirror, textarea, [role="textbox"]')) {
      continue;
    }
    const text = el.textContent?.trim() || '';
    if (/\b(Sonnet|Opus|Haiku)\b/i.test(text)) {
      if (isElementVisible(el)) {
        const rect = el.getBoundingClientRect();
        // Model button or pill is compact (width between 15 and 260px, height between 14 and 60px)
        if (rect.width >= 15 && rect.width <= 260 && rect.height >= 14 && rect.height <= 60) {
          const btn = el.closest('button, [role="button"]') as HTMLElement | null;
          if (btn && isElementVisible(btn)) return btn;
          return el;
        }
      }
    }
  }

  return null;
};

const findClaudeRightSideButton = (composer: Element): HTMLElement | null => {
  const composerRect = composer.getBoundingClientRect();
  const allButtons = Array.from(composer.querySelectorAll('button, [role="button"]')) as HTMLElement[];
  const visibleButtons = allButtons.filter((b) => isElementVisible(b));

  // Right-side controls (mic, waveform, send, model trigger) sit on the right half (> 35% of width)
  const rightButtons = visibleButtons.filter((b) => {
    const r = b.getBoundingClientRect();
    return r.left > composerRect.left + composerRect.width * 0.35;
  });

  if (rightButtons.length > 0) {
    // Sort from left to right: pick the leftmost button in the right cluster to dock beside it!
    rightButtons.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    return rightButtons[0] || null;
  }

  return null;
};

const findClaudeTargetElement = (): HTMLElement | null => {
  const claudeInput = document.querySelector(
    'div[contenteditable="true"].ProseMirror, fieldset div[contenteditable="true"], div[contenteditable="true"]'
  );
  const composer =
    claudeInput?.closest('fieldset') ||
    claudeInput?.closest('form') ||
    claudeInput?.closest('div[class*="composer"]') ||
    document.querySelector('fieldset') ||
    document.querySelector('form') ||
    document.body;

  // Priority 1: Model text/pill (e.g. "Sonnet 5 Medium", "Sonnet 3.7", "Opus", "Haiku")
  const modelEl = findClaudeModelElement(composer) || (composer !== document.body ? findClaudeModelElement(document.body) : null);
  if (modelEl) return modelEl;

  // Priority 2: Leftmost button in right-side controls (mic, waveform, or send button)
  const rightBtn = findClaudeRightSideButton(composer) || (composer !== document.body ? findClaudeRightSideButton(document.body) : null);
  if (rightBtn) return rightBtn;

  return null;
};

// --- CHATGPT: Locate the Think Button (or Action Buttons) ---
const findChatGPTThinkButton = (): HTMLElement | null => {
  const chatgptInput = document.querySelector('#prompt-textarea');
  const composer =
    chatgptInput?.closest('form') ||
    chatgptInput?.closest('div[class*="composer" i]') ||
    chatgptInput?.closest('div[class*="stretch" i]') ||
    chatgptInput?.closest('main') ||
    document.querySelector('form') ||
    document.body;

  const buttons = Array.from(composer.querySelectorAll('button')) as HTMLElement[];

  // 1. Search for button with text "Think" or "Thinking" or "Reason"
  for (const btn of buttons) {
    if (!isElementVisible(btn)) continue;
    const text = btn.textContent?.trim() || '';
    if (/\b(think|thinking|reason|reasoning)\b/i.test(text)) {
      return btn;
    }
  }

  // 2. Search for aria-label or data-testid containing "think" or "reason"
  for (const btn of buttons) {
    if (!isElementVisible(btn)) continue;
    const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
    const testId = (btn.getAttribute('data-testid') || '').toLowerCase();
    if (
      aria.includes('think') ||
      aria.includes('reason') ||
      testId.includes('think') ||
      testId.includes('reason')
    ) {
      return btn;
    }
  }

  // 3. Check buttons with brain icon SVG
  for (const btn of buttons) {
    if (!isElementVisible(btn)) continue;
    const svg = btn.querySelector('svg');
    if (svg) {
      const svgContent = (svg.innerHTML + ' ' + (svg.getAttribute('class') || '')).toLowerCase();
      if (svgContent.includes('brain') || svgContent.includes('think')) {
        return btn;
      }
    }
  }

  // Global search for Think button if not found within composer
  if (composer !== document.body) {
    const allButtons = Array.from(document.body.querySelectorAll('button')) as HTMLElement[];
    for (const btn of allButtons) {
      if (!isElementVisible(btn)) continue;
      const text = btn.textContent?.trim() || '';
      const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
      const testId = (btn.getAttribute('data-testid') || '').toLowerCase();
      if (
        /\b(think|thinking|reason|reasoning)\b/i.test(text) ||
        aria.includes('think') ||
        aria.includes('reason') ||
        testId.includes('think') ||
        testId.includes('reason')
      ) {
        return btn;
      }
    }
  }

  // 4. Fallback if Think is not present on current model (e.g. GPT-4o):
  // Anchor to dictation button (mic), voice mode button, or send button
  const fallbackSelectors = [
    'button[data-testid="composer-speech-button"]',
    'button[aria-label*="voice" i]',
    'button[aria-label*="dictat" i]',
    'button[aria-label*="mic" i]',
    'button[aria-label*="speech" i]',
    'button[data-testid="composer-voice-mode-button"]',
    'button[data-testid="send-button"]',
    'button[aria-label*="send" i]',
  ];
  for (const sel of fallbackSelectors) {
    const el = composer.querySelector(sel) as HTMLElement;
    if (el && isElementVisible(el)) return el;
  }

  if (composer !== document.body) {
    for (const sel of fallbackSelectors) {
      const el = document.body.querySelector(sel) as HTMLElement;
      if (el && isElementVisible(el)) return el;
    }
  }

  return null;
};

// --- Generic detection for Perplexity, DeepSeek, Copilot, Grok, Mistral, Poe, Phind, v0, etc. ---
const findGenericActionButton = (): HTMLElement | null => {
  const inputEl = document.querySelector(
    '#prompt-textarea, textarea[data-id], #chat-input, textarea, div[contenteditable="true"], [role="textbox"]'
  );
  const composer =
    inputEl?.closest('form') ||
    inputEl?.closest('fieldset') ||
    inputEl?.closest('div[class*="composer" i]') ||
    inputEl?.closest('div[class*="input" i]') ||
    inputEl?.closest('div[class*="chat" i]') ||
    inputEl?.parentElement ||
    document.body;

  // 1. Explicit send, submit, voice, or action buttons
  const selectors = [
    'button[data-testid*="send" i]',
    'button[aria-label*="send" i]',
    'button[aria-label*="submit" i]',
    'button[type="submit"]',
    'button[aria-label*="voice" i]',
    'button[aria-label*="mic" i]',
    'button[class*="send" i]',
    'button[class*="submit" i]',
    '[role="button"][aria-label*="send" i]',
    '[role="button"][aria-label*="submit" i]',
  ];
  for (const sel of selectors) {
    const el = composer.querySelector(sel) as HTMLElement;
    if (el && isElementVisible(el)) return el;
  }

  // 2. Locate right-side buttons cluster in composer
  const composerRect = composer.getBoundingClientRect();
  const allButtons = Array.from(composer.querySelectorAll('button, [role="button"]')) as HTMLElement[];
  const visibleButtons = allButtons.filter((b) => isElementVisible(b));
  const rightButtons = visibleButtons.filter((b) => {
    const r = b.getBoundingClientRect();
    return r.left > composerRect.left + composerRect.width * 0.35;
  });

  if (rightButtons.length > 0) {
    rightButtons.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    return rightButtons[0] || null;
  }

  return null;
};

/** Locate the target button to dock Prompt3000 at its left */
const findTargetElement = (): HTMLElement | null => {
  const host = window.location.hostname.toLowerCase();

  // 1. Google Gemini & AI Studio (Images 1 & 4): left of model button / mic
  if (host.includes('gemini') || host.includes('aistudio.google')) {
    return findGeminiModelButton();
  }

  // 2. Anthropic Claude: left of model text (Sonnet 5 Medium) or voice/send button
  if (host.includes('claude')) {
    return findClaudeTargetElement();
  }

  // 3. OpenAI ChatGPT (Image 5): left of think button / voice / send button
  if (host.includes('chatgpt') || host.includes('chat.openai')) {
    return findChatGPTThinkButton();
  }

  // 4. All other AI platforms (Perplexity, DeepSeek, Grok, Copilot, Mistral, Poe, Phind, etc.)
  return findGenericActionButton();
};

/** Dynamically locate the chatbox container as fallback */
const findChatbox = (): HTMLElement | null => {
  // 1. OpenAI ChatGPT (#prompt-textarea)
  const chatgptInput = document.querySelector('#prompt-textarea');
  if (chatgptInput) {
    const form = chatgptInput.closest('form');
    if (form) return form as HTMLElement;
    const composer = chatgptInput.closest('div[class*="composer"], div[class*="relative"]');
    if (composer) return composer as HTMLElement;
    return (chatgptInput.parentElement?.parentElement || chatgptInput) as HTMLElement;
  }

  // 2. Anthropic Claude (contenteditable in composer or fieldset)
  const claudeInput = document.querySelector(
    'div[contenteditable="true"].ProseMirror, fieldset div[contenteditable="true"], div[contenteditable="true"]'
  );
  if (claudeInput) {
    const composer =
      claudeInput.closest('fieldset') ||
      claudeInput.closest('form') ||
      claudeInput.closest('div[class*="composer"]') ||
      claudeInput.parentElement;
    if (composer) return composer as HTMLElement;
  }

  // 3. Google Gemini (rich-textarea or input area)
  const geminiInput = document.querySelector('rich-textarea, .rich-textarea');
  if (geminiInput) {
    const container =
      geminiInput.closest('.input-area-container') ||
      geminiInput.closest('.input-area') ||
      geminiInput.parentElement;
    if (container) return container as HTMLElement;
  }

  // 4. Any AI platform with textarea or contenteditable (Perplexity, DeepSeek, Copilot, Grok, Mistral, Poe, Phind, v0, etc.)
  const anyInput = document.querySelector(
    'textarea[data-id], #chat-input, textarea, div[contenteditable="true"], [role="textbox"]'
  );
  if (anyInput) {
    const container =
      anyInput.closest('form') ||
      anyInput.closest('fieldset') ||
      anyInput.closest('div[class*="composer" i]') ||
      anyInput.closest('div[class*="input" i]') ||
      anyInput.closest('div[class*="chat" i]') ||
      anyInput.parentElement;
    if (container) return container as HTMLElement;
  }

  return null;
};

/** Reliably locate the host chatbox input element across all AI platforms */
const findChatboxInput = (): HTMLElement | null => {
  const host = window.location.hostname.toLowerCase();

  // 1. Google Gemini & AI Studio
  if (host.includes('gemini') || host.includes('aistudio.google')) {
    const geminiSelectors = [
      'rich-textarea div[contenteditable="true"]',
      'rich-textarea .ql-editor',
      'rich-textarea [role="textbox"]',
      'rich-textarea p',
      '.input-area-container div[contenteditable="true"]',
      '.input-area div[contenteditable="true"]',
      'rich-textarea',
    ];
    for (const sel of geminiSelectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el && isElementVisible(el) && !el.closest('prompt3000-capsule-root')) {
        return el;
      }
    }
  }

  // 2. Anthropic Claude
  if (host.includes('claude')) {
    const claudeSelectors = [
      'div[contenteditable="true"].ProseMirror',
      'fieldset div[contenteditable="true"]',
      'div[contenteditable="true"]',
    ];
    for (const sel of claudeSelectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el && isElementVisible(el) && !el.closest('prompt3000-capsule-root')) {
        return el;
      }
    }
  }

  // 3. OpenAI ChatGPT
  if (host.includes('chatgpt') || host.includes('chat.openai')) {
    const gptSelectors = [
      '#prompt-textarea',
      'textarea[data-id]',
      'form textarea',
      'div[contenteditable="true"][data-placeholder]',
    ];
    for (const sel of gptSelectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el && isElementVisible(el) && !el.closest('prompt3000-capsule-root')) {
        return el;
      }
    }
  }

  // 4. Currently focused element if it's an editable text area outside Prompt3000
  const active = document.activeElement;
  if (
    active &&
    active !== document.body &&
    !active.closest('prompt3000-capsule-root') &&
    (active.tagName === 'TEXTAREA' ||
      active.getAttribute('contenteditable') === 'true' ||
      (active.tagName === 'INPUT' && (active as HTMLInputElement).type === 'text')) &&
    isElementVisible(active as HTMLElement)
  ) {
    return active as HTMLElement;
  }

  // 5. General fallback ordered by specificity
  const generalSelectors = [
    '#prompt-textarea',
    'rich-textarea div[contenteditable="true"]',
    'rich-textarea .ql-editor',
    'rich-textarea [role="textbox"]',
    'rich-textarea p',
    'rich-textarea',
    'div[contenteditable="true"].ProseMirror',
    'fieldset div[contenteditable="true"]',
    '#chat-input',
    'textarea[data-id]',
    'textarea[placeholder*="Ask" i]',
    'textarea[placeholder*="message" i]',
    'div[class*="composer" i] textarea',
    'div[class*="composer" i] div[contenteditable="true"]',
    'div[class*="input" i] textarea',
    'div[class*="input" i] div[contenteditable="true"]',
    'form textarea',
    'form div[contenteditable="true"]',
    'textarea',
    'div[contenteditable="true"]',
    '[role="textbox"]',
  ];

  for (const sel of generalSelectors) {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el && isElementVisible(el) && !el.closest('prompt3000-capsule-root')) {
      return el;
    }
  }

  return null;
};

/** Extract text content from chatbox element */
const getChatboxValue = (el: HTMLElement | null): string => {
  if (!el) return '';
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    return el.value;
  }
  if (el.tagName.toLowerCase() === 'rich-textarea') {
    const editable = el.querySelector('div[contenteditable="true"], .ql-editor, [role="textbox"], p') as HTMLElement | null;
    if (editable) {
      const txt = editable.innerText !== undefined ? editable.innerText : editable.textContent || '';
      return (txt === '\n' || txt === '\r\n') ? '' : txt;
    }
  }
  const text = (el.innerText !== undefined ? el.innerText : el.textContent) || '';
  if (text === '\n' || text === '\r\n') return '';
  return text;
};

/** Programmatically set text content in chatbox element and dispatch change events */
const setChatboxValue = (el: HTMLElement | null, text: string) => {
  if (!el) return;

  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    el.focus();
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (nativeSetter) {
      nativeSetter.call(el, text);
    } else {
      el.value = text;
    }
    try {
      el.selectionStart = el.selectionEnd = text.length;
    } catch {}
    el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    return;
  }

  let editable: HTMLElement = el;
  if (el.tagName.toLowerCase() === 'rich-textarea') {
    editable = (el.querySelector('div[contenteditable="true"], .ql-editor, [role="textbox"]') as HTMLElement) || el;
  }

  editable.focus();

  try {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editable);
    selection?.removeAllRanges();
    selection?.addRange(range);

    const ok = document.execCommand('insertText', false, text);
    if (!ok) throw new Error('execCommand returned false');
  } catch {
    editable.innerText = text;
    editable.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'insertText',
        data: text,
      })
    );
  }

  editable.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  editable.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
};

/**
 * Hook to smoothly interpolate numeric score values over time with an ease-out cubic curve
 */
const useAnimatedScore = (targetScore: number, hasContent: boolean, duration: number = 550): number => {
  const [currentScore, setCurrentScore] = useState(hasContent ? targetScore : 0);
  const prevScoreRef = useRef(hasContent ? targetScore : 0);
  const prevHasContentRef = useRef(hasContent);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // When transitioning from empty to has content, count up smoothly from 0
    const start = !prevHasContentRef.current && hasContent ? 0 : prevScoreRef.current;
    prevHasContentRef.current = hasContent;

    const target = hasContent ? targetScore : 0;
    if (start === target) {
      setCurrentScore(target);
      return;
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic curve for organic Apple/Linear-grade motion
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(start + (target - start) * ease);
      setCurrentScore(val);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        prevScoreRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetScore, hasContent, duration]);

  return currentScore;
};

export const FloatingCapsule: React.FC<FloatingCapsuleProps> = ({
  embedded = false,
  onApply,
  className = '',
  defaultModel,
  initialExpanded = false,
  initialPrompt = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isClosing, setIsClosing] = useState(false);
  const [promptText, setPromptText] = useState(initialPrompt);
  const promptTextRef = useRef('');
  const enhanceCycleRef = useRef<number>(0);
  const [enhancedResult, setEnhancedResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetModel, setTargetModel] = useState<LLMTarget>(defaultModel || 'chatgpt');
  const [tone, setTone] = useState<PromptTone>('auto');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [widgetEnabled, setWidgetEnabled] = useState(true);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const isModalVisible = isExpanded || isClosing;

  // Real-time content detection & prompt analysis (evaluates enhancedResult when generated)
  const activePromptText = enhancedResult || promptText;
  const hasContent = Boolean(activePromptText.trim());
  const promptAnalysis = useMemo(() => analyzePrompt(activePromptText), [activePromptText]);
  const animatedScore = useAnimatedScore(promptAnalysis.score, hasContent, 550);

  // Keep promptTextRef in sync for live event listeners and callbacks
  useEffect(() => {
    promptTextRef.current = promptText;
  }, [promptText]);

  // Target anchor tracking state: dynamically docks to the left of target buttons
  const [targetAnchor, setTargetAnchor] = useState<TargetAnchor | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    if (isClosing || !isExpanded) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 160);
  };

  // Close the expanded studio modal when clicking outside or pressing Escape
  useEffect(() => {
    if (!isExpanded || isClosing) return;

    const handlePointerDown = (event: PointerEvent | MouseEvent) => {
      if (!modalRef.current) return;

      const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
      if (path.length > 0) {
        if (path.includes(modalRef.current)) {
          return;
        }
        if (pillRef.current && path.includes(pillRef.current)) {
          return;
        }
      } else {
        const target = event.target as Node | null;
        if (target) {
          if (modalRef.current.contains(target)) {
            return;
          }
          if (pillRef.current && pillRef.current.contains(target)) {
            return;
          }
          const rootNode = modalRef.current.getRootNode();
          if (rootNode instanceof ShadowRoot && target === rootNode.host) {
            return;
          }
        }
      }

      handleCloseModal();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('mousedown', handlePointerDown, true);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('mousedown', handlePointerDown, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isExpanded, isClosing]);

  // Check user settings for floating widget visibility & listen for dynamic changes
  useEffect(() => {
    try {
      if (typeof browser !== 'undefined' && browser.storage?.sync) {
        browser.storage.sync.get(['floatingWidget', 'defaultTone']).then((res: any) => {
          if (res && res.floatingWidget !== undefined) {
            setWidgetEnabled(res.floatingWidget !== false);
          }
          if (res && res.defaultTone) {
            setTone(res.defaultTone as PromptTone);
          }
        });
      }
    } catch {
      // Ignore if storage is not available
    }

    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === 'sync' || areaName === 'local') {
        if ('floatingWidget' in changes) {
          setWidgetEnabled(changes.floatingWidget.newValue !== false);
        }
        if ('defaultTone' in changes && changes.defaultTone.newValue) {
          setTone(changes.defaultTone.newValue);
        }
      }
    };

    if (typeof browser !== 'undefined' && browser.storage?.onChanged) {
      browser.storage.onChanged.addListener(handleStorageChange);
      return () => {
        browser.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  // Detect current site or accept prop to auto-set targetModel
  useEffect(() => {
    if (defaultModel) {
      setTargetModel(defaultModel);
      return;
    }
    const host = window.location.hostname.toLowerCase();
    if (host.includes('claude')) setTargetModel('claude');
    else if (host.includes('gemini') || host.includes('aistudio.google')) setTargetModel('gemini');
    else if (host.includes('perplexity')) setTargetModel('perplexity');
    else if (host.includes('deepseek')) setTargetModel('deepseek');
    else setTargetModel('chatgpt');
  }, [defaultModel]);

  // Live auto-tracking effect to position capsule at target button (or host chatbox)
  useEffect(() => {
    if (embedded) return;

    let rafId: number | null = null;

    const updateAnchorPosition = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;

        // 1. Try to anchor Soya pill to the specific target button (Gemini, Claude, ChatGPT)
        const targetBtn = findTargetElement();
        if (targetBtn) {
          const rect = targetBtn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setTargetAnchor({
              top: rect.top,
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
              mode: 'button',
            });
            return;
          }
        }

        // 2. Fallback: anchor Soya pill inside host chatbox container
        const chatbox = findChatbox();
        if (chatbox) {
          const rect = chatbox.getBoundingClientRect();
          if (rect.width > 50 && rect.height > 20) {
            setTargetAnchor({
              top: rect.top,
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
              mode: 'chatbox',
            });
            return;
          }
        }

        setTargetAnchor(null);
      });
    };

    updateAnchorPosition();

    window.addEventListener('resize', updateAnchorPosition);
    window.addEventListener('scroll', updateAnchorPosition, { capture: true, passive: true });
    document.addEventListener('input', updateAnchorPosition, { capture: true, passive: true });

    const observer = new MutationObserver(updateAnchorPosition);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'aria-expanded'],
    });

    const interval = setInterval(updateAnchorPosition, 250);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateAnchorPosition);
      window.removeEventListener('scroll', updateAnchorPosition, true);
      document.removeEventListener('input', updateAnchorPosition, true);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [embedded]);

  // Dynamically ensure host chatbox text wraps before reaching the Soya pill point in single-line mode
  useEffect(() => {
    if (embedded) return;

    let appliedInput: HTMLElement | null = null;
    let appliedPadding = '';

    const cleanupClearance = () => {
      if (appliedInput) {
        const orig = appliedInput.getAttribute('data-prompt3000-orig-pr');
        if (orig !== null) {
          if (orig) {
            appliedInput.style.paddingRight = orig;
          } else {
            appliedInput.style.removeProperty('padding-right');
          }
          appliedInput.removeAttribute('data-prompt3000-orig-pr');
        } else {
          appliedInput.style.removeProperty('padding-right');
        }
        appliedInput = null;
        appliedPadding = '';
      }
    };

    const updateClearance = () => {
      if (!widgetEnabled || !targetAnchor) {
        cleanupClearance();
        return;
      }

      const inputEl = findChatboxInput();
      if (!inputEl) {
        cleanupClearance();
        return;
      }

      const inputRect = inputEl.getBoundingClientRect();
      if (inputRect.width <= 0 || inputRect.height <= 0) {
        cleanupClearance();
        return;
      }

      // Check if targetAnchor (button) is vertically aligned on the same single line as inputEl
      // In single-line mode, inputEl height is compact (typically <= 56px) and button is on the same row.
      // In multiline mode, the input box is taller (> 60px) and buttons sit in the toolbar below the text area.
      const isButtonMode = targetAnchor.mode === 'button';
      const isVerticallyAligned =
        targetAnchor.top < inputRect.bottom - 4 &&
        targetAnchor.bottom > inputRect.top + 4;
      const isSingleLine = isButtonMode && inputRect.height <= 56 && isVerticallyAligned;

      if (!isSingleLine) {
        // In multiline mode, Soya sits on the bottom toolbar row beside Think (below the text area).
        // No extra padding is needed, allowing full width for multiline editing.
        cleanupClearance();
        return;
      }

      // Single-line mode: Pill is docked to the left of the button on the same line as the text.
      // Add pill width + gap to native padding so text wraps right at the pill point.
      let pillWidth = 115;
      if (pillRef.current) {
        const w = pillRef.current.offsetWidth;
        if (w > 20) pillWidth = w;
      } else {
        pillWidth = hasContent ? 115 : 65;
      }

      // Store original padding if not yet recorded
      if (!inputEl.hasAttribute('data-prompt3000-orig-pr')) {
        const computedPR = window.getComputedStyle(inputEl).paddingRight || '';
        inputEl.setAttribute('data-prompt3000-orig-pr', computedPR);
      }

      const origPRVal = parseFloat(inputEl.getAttribute('data-prompt3000-orig-pr') || '0') || 0;
      const targetPR = `${Math.round(origPRVal + pillWidth + 8)}px`;

      if (appliedInput === inputEl && appliedPadding === targetPR) {
        return;
      }

      appliedInput = inputEl;
      appliedPadding = targetPR;
      inputEl.style.paddingRight = targetPR;
    };

    updateClearance();

    window.addEventListener('input', updateClearance, { capture: true, passive: true });
    window.addEventListener('resize', updateClearance, { capture: true, passive: true });

    return () => {
      window.removeEventListener('input', updateClearance, true);
      window.removeEventListener('resize', updateClearance, true);
      cleanupClearance();
    };
  }, [embedded, widgetEnabled, targetAnchor, hasContent]);

  // Real-time two-way auto-sync between host chatbox and Prompt3000
  useEffect(() => {
    let lastKnownChatbox: HTMLElement | null = null;
    let observer: MutationObserver | null = null;

    const syncFromChatbox = () => {
      const inputEl = findChatboxInput();
      if (!inputEl) return;

      const currentVal = getChatboxValue(inputEl);
      if (currentVal !== promptTextRef.current) {
        promptTextRef.current = currentVal;
        setPromptText(currentVal);
        if (enhancedResult && currentVal !== enhancedResult) {
          setEnhancedResult('');
        }
      }

      // If chatbox element changed or newly mounted, attach MutationObserver to it
      if (inputEl !== lastKnownChatbox) {
        lastKnownChatbox = inputEl;
        observer?.disconnect();
        observer = new MutationObserver(() => {
          const newVal = getChatboxValue(inputEl);
          if (newVal !== promptTextRef.current) {
            promptTextRef.current = newVal;
            setPromptText(newVal);
            if (enhancedResult && newVal !== enhancedResult) {
              setEnhancedResult('');
            }
          }
        });
        observer.observe(inputEl, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    };

    // Initial sync immediately
    syncFromChatbox();

    // Listen to user keyboard, input, paste, and focus events across the page
    window.addEventListener('input', syncFromChatbox, { capture: true, passive: true });
    window.addEventListener('keyup', syncFromChatbox, { capture: true, passive: true });
    window.addEventListener('change', syncFromChatbox, { capture: true, passive: true });
    window.addEventListener('paste', syncFromChatbox, { capture: true, passive: true });
    window.addEventListener('focusin', syncFromChatbox, { capture: true, passive: true });

    // Lightweight polling interval (200ms) to ensure continuous sync during voice dictation or silent DOM changes
    const syncInterval = setInterval(syncFromChatbox, 200);

    return () => {
      observer?.disconnect();
      window.removeEventListener('input', syncFromChatbox, true);
      window.removeEventListener('keyup', syncFromChatbox, true);
      window.removeEventListener('change', syncFromChatbox, true);
      window.removeEventListener('paste', syncFromChatbox, true);
      window.removeEventListener('focusin', syncFromChatbox, true);
      clearInterval(syncInterval);
    };
  }, []);

  // Listen for keyboard commands from background service worker
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message?.type === 'TRIGGER_ENHANCE') {
        handleQuickEnhance();
      } else if (message?.type === 'TOGGLE_FLOATING_WIDGET') {
        setWidgetEnabled(message.enabled !== false);
      }
    };

    if (typeof browser !== 'undefined' && browser.runtime?.onMessage) {
      browser.runtime.onMessage.addListener(messageListener);
      return () => {
        browser.runtime.onMessage.removeListener(messageListener);
      };
    }
  }, [targetModel, tone]);

  const handleOpenModal = () => {
    if (isClosing) return;
    const inputEl = findChatboxInput();
    if (inputEl) {
      const current = getChatboxValue(inputEl);
      promptTextRef.current = current;
      setPromptText(current);
    }
    setIsExpanded(true);
  };

  const handlePromptChange = (newText: string) => {
    promptTextRef.current = newText;
    setPromptText(newText);
    if (enhancedResult && newText !== enhancedResult) {
      setEnhancedResult('');
    }
    const chatboxEl = findChatboxInput();
    if (chatboxEl) {
      setChatboxValue(chatboxEl, newText);
    }
  };

  const handleClearPrompt = () => {
    promptTextRef.current = '';
    setPromptText('');
    const chatboxEl = findChatboxInput();
    if (chatboxEl) {
      setChatboxValue(chatboxEl, '');
    }
    setEnhancedResult('');
    setStatusMessage('Cleared chatbox');
    setTimeout(() => setStatusMessage(null), 1500);
  };

  const handleAddDetail = (textToAppend: string) => {
    setEnhancedResult('');
    const base = promptTextRef.current.trim();
    const core = extractCorePrompt(base);
    let nextText = '';
    if (!core) {
      nextText = textToAppend;
    } else if (core.endsWith('.') || core.endsWith('?') || core.endsWith('!')) {
      nextText = `${core} ${textToAppend}`;
    } else {
      nextText = `${core}. ${textToAppend}`;
    }

    promptTextRef.current = nextText;
    setPromptText(nextText);
    const chatboxEl = findChatboxInput();
    if (chatboxEl) {
      setChatboxValue(chatboxEl, nextText);
    }
    setStatusMessage('Detail synced to chatbox');
    setTimeout(() => setStatusMessage(null), 1800);
  };

  const handleQuickEnhance = () => {
    let text = promptTextRef.current.trim();
    const chatboxEl = findChatboxInput();
    if (!text && chatboxEl) {
      text = getChatboxValue(chatboxEl).trim();
    }

    if (!text) {
      handleOpenModal();
      setStatusMessage('Enter or dictate a draft prompt first');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setIsProcessing(true);
    handleOpenModal();

    setTimeout(() => {
      const coreText = extractCorePrompt(text);

      // Cycle frameworks across repeated enhance clicks for variety:
      // CGC (Master Prompt) -> Step-by-Step (Chain of Thought) -> Persona + Guardrails
      const frameworks: PromptFramework[] = ['cgc', 'stepbystep', 'persona_constraints'];
      const activeFramework = frameworks[enhanceCycleRef.current % frameworks.length];
      enhanceCycleRef.current += 1;

      const res = enhancePrompt(coreText, targetModel, tone, activeFramework);
      const upgradedPrompt = res.enhancedPrompt;

      // Immediately place the upgraded prompt directly inside the chatbox!
      const activeChatbox = findChatboxInput() || chatboxEl;
      if (activeChatbox) {
        setChatboxValue(activeChatbox, upgradedPrompt);
        promptTextRef.current = upgradedPrompt;
        setPromptText(upgradedPrompt);
        setStatusMessage('Upgraded prompt placed in chatbox');
      } else {
        try {
          navigator.clipboard.writeText(upgradedPrompt);
        } catch {}
        setStatusMessage('Upgraded prompt copied to clipboard');
      }

      if (onApply) {
        onApply(upgradedPrompt);
      }

      setEnhancedResult(upgradedPrompt);
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(null), 2500);
    }, 350);
  };

  const handleApplyToPage = () => {
    if (!enhancedResult) return;
    const chatboxEl = findChatboxInput();
    if (chatboxEl) {
      setChatboxValue(chatboxEl, enhancedResult);
      promptTextRef.current = enhancedResult;
      setPromptText(enhancedResult);
      setStatusMessage('Re-inserted into chatbox');
    } else {
      try {
        navigator.clipboard.writeText(enhancedResult);
      } catch {}
      setStatusMessage('Copied to clipboard');
    }

    if (onApply) {
      onApply(enhancedResult);
    }

    setTimeout(() => {
      setStatusMessage(null);
      handleCloseModal();
    }, 1200);
  };

  if (!widgetEnabled) return null;

  const renderPill = () => {
    const scoreVal = promptAnalysis.score;
    const hasContent = Boolean(promptText.trim());

    return (
      <div
        ref={pillRef}
        className={`flex items-center p-0.5 rounded-md backdrop-blur-md border shadow-sm transition-all duration-200 select-none ${
          isModalVisible
            ? 'bg-zinc-900/95 border-zinc-700 shadow-[0_0_14px_rgba(255,255,255,0.1)] ring-1 ring-zinc-700/60'
            : 'bg-zinc-950/95 border-zinc-800 hover:border-zinc-700 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]'
        } ${!isModalVisible ? 'animate-pill-reappear active:scale-95' : ''}`}
      >
        {/* Studio toggle button */}
        <button
          type="button"
          onClick={isModalVisible ? handleCloseModal : handleOpenModal}
          className={`flex items-center space-x-1.5 px-2 py-0.5 rounded transition-all duration-150 group cursor-pointer ${
            isModalVisible
              ? 'bg-zinc-800/90 text-white'
              : 'text-zinc-200 hover:text-white hover:bg-zinc-900/80 active:scale-[0.96]'
          }`}
          title={
            isModalVisible
              ? 'Close Soya'
              : hasContent
              ? `Prompt Score: ${scoreVal}/100 (${promptAnalysis.ratingLabel}) - Click to improve`
              : 'Soya - Type to score prompt'
          }
        >
          {hasContent ? (
            /* Score text appears dynamically when user types something into the chat */
            <div className="flex items-center space-x-1.5 animate-pill-bloom">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: getScoreColor(animatedScore),
                  boxShadow: `0 0 6px ${getScoreColor(animatedScore)}99`,
                }}
              />

              <span className="text-[10px] font-medium tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                Soya
              </span>

              <span className="text-[10px] font-mono tracking-tight pl-0.5 flex items-baseline select-none">
                <span
                  style={{ color: getScoreColor(animatedScore) }}
                  className="font-bold font-mono transition-colors duration-300"
                >
                  {animatedScore}
                </span>
                <span className="text-zinc-500 font-normal">/100</span>
              </span>
            </div>
          ) : (
            /* Default state when nothing has been typed yet */
            <div className="flex items-center space-x-1.5 transition-all duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-white transition-transform duration-200 group-hover:scale-125 shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
              <span className="text-[10px] font-medium tracking-tight">Soya</span>
            </div>
          )}
        </button>
      </div>
    );
  };

  const getFriendlyAssessment = (score: number, nudgeMsg?: string) => {
    if (score >= 80) {
      return {
        status: 'Great Prompt',
        badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
        hint: nudgeMsg || 'Detailed and clear! Ready to produce high-quality, targeted answers.',
      };
    }
    if (score >= 50) {
      return {
        status: 'Good Start',
        badge: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
        hint: nudgeMsg || 'Clear objective! Add a bit more background context below for deeper results.',
      };
    }
    if (score >= 25) {
      return {
        status: 'Needs Context',
        badge: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        hint: nudgeMsg || 'Tell the AI your background level and goals to avoid generic answers.',
      };
    }
    return {
      status: 'Brief Draft',
      badge: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
      hint: nudgeMsg || 'Add more details or click Enhance to automatically expand this prompt.',
    };
  };

  const renderStudioModal = (
    isEmbeddedMode: boolean,
    originPlacement: 'bottom-right' | 'top-right' = 'bottom-right'
  ) => {
    const animationClass = isClosing ? 'animate-modal-close' : 'animate-modal-open';
    const originClass = originPlacement === 'top-right' ? 'origin-top-right' : 'origin-bottom-right';
    const assessment = getFriendlyAssessment(animatedScore, promptAnalysis.nudgeMessage);

    return (
      <div
        ref={modalRef}
        className={`w-[380px] max-w-[calc(100vw-24px)] max-h-[min(580px,calc(100vh-40px))] overflow-y-auto rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/90 shadow-2xl p-3.5 space-y-3 text-zinc-200 scrollbar-thin ${animationClass} ${originClass} ${
          isEmbeddedMode ? 'absolute bottom-full right-0 mb-2.5 z-50' : ''
        }`}
      >
        {/* Integrated Top Status Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/70 animate-modal-stagger-1">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="flex items-center space-x-1.5 shrink-0">
              <span
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: hasContent ? getScoreColor(animatedScore) : '#10b981',
                  boxShadow: `0 0 6px ${hasContent ? getScoreColor(animatedScore) : '#10b981'}88`,
                }}
              />
              <span className="text-xs font-semibold tracking-tight text-zinc-100">Soya</span>
            </div>

            <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase tracking-wider shrink-0">
              {targetModel}
            </span>

            {hasContent && promptAnalysis.intentLabel && (
              <span
                className="text-[9px] font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-800/80 truncate max-w-[130px]"
                title={`Detected intent: ${promptAnalysis.intentLabel}`}
              >
                {promptAnalysis.intentLabel}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            {hasContent && (
              <button
                type="button"
                onClick={handleClearPrompt}
                className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors px-1.5 py-0.5 rounded hover:bg-zinc-800/80 cursor-pointer"
                title="Clear chatbox prompt"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseModal}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer active:scale-90"
              title="Close (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Toast / Banner */}
        {statusMessage && (
          <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 font-medium flex items-center space-x-2 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{statusMessage}</span>
          </div>
        )}

        {/* Dynamic Content: Empty State vs Active Score & Suggestions */}
        {!hasContent ? (
          /* Empty State Banner */
          <div className="py-6 px-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-center space-y-2.5 my-1 transition-all animate-modal-stagger-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-zinc-100">Draft a prompt in the chatbox</div>
              <p className="text-[11px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Soya evaluates your prompt in real time and offers 1-click additions to get 3x better AI answers.
              </p>
            </div>
          </div>
        ) : (
          /* Active State: Score Card + Checklist + Suggestions */
          <div className="space-y-2.5 animate-modal-stagger-2">
            {/* Friendly Score Card */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-3 shadow-xs">
              {/* Score display & assessment status */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-2">
                  <span
                    className="text-2xl font-bold font-mono leading-none transition-colors duration-300 tracking-tight"
                    style={{ color: getScoreColor(animatedScore) }}
                  >
                    {animatedScore}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 leading-none">/100</span>

                  <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border ${assessment.badge}`}>
                    {assessment.status}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Quality Score
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-zinc-800/90 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(6, animatedScore)}%`,
                    backgroundColor: getScoreColor(animatedScore),
                    boxShadow: `0 0 8px ${getScoreColor(animatedScore)}66`,
                  }}
                />
              </div>

              {/* Encouraging Tip */}
              <p className="text-[11px] text-zinc-300 leading-snug">
                {assessment.hint}
              </p>

              {/* Friendly 3-Point Checklist */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60 text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    if (promptAnalysis.criteria.clarity < 15) {
                      handleAddDetail('Specifically explain:');
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border font-medium transition-all ${
                    promptAnalysis.criteria.clarity >= 15
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 cursor-default'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer active:scale-95'
                  }`}
                  title={promptAnalysis.criteria.clarity >= 15 ? 'Objective is clear' : 'Click to add objective goal'}
                >
                  {promptAnalysis.criteria.clarity >= 15 ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-zinc-500" />}
                  <span>Objective</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (promptAnalysis.criteria.context < 15) {
                      handleAddDetail('Background context:');
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border font-medium transition-all ${
                    promptAnalysis.criteria.context >= 15
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 cursor-default'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer active:scale-95'
                  }`}
                  title={promptAnalysis.criteria.context >= 15 ? 'Context provided' : 'Click to add background context'}
                >
                  {promptAnalysis.criteria.context >= 15 ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-zinc-500" />}
                  <span>Context</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (promptAnalysis.criteria.constraints < 12) {
                      handleAddDetail('Format: concise bullet points with key takeaways.');
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border font-medium transition-all ${
                    promptAnalysis.criteria.constraints >= 12
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 cursor-default'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer active:scale-95'
                  }`}
                  title={promptAnalysis.criteria.constraints >= 12 ? 'Format specified' : 'Click to add format constraints'}
                >
                  {promptAnalysis.criteria.constraints >= 12 ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-zinc-500" />}
                  <span>Format / Rules</span>
                </button>
              </div>
            </div>

            {/* Suggested Improvements (1-Click Additions) */}
            {promptAnalysis.clarifyingQuestions.length > 0 && (
              <div className="space-y-1.5 pt-0.5 animate-modal-stagger-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Suggested Additions</span>
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-0.5 scrollbar-thin">
                  {promptAnalysis.clarifyingQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 hover:border-zinc-700/80 transition-all"
                    >
                      <p className="text-[11px] font-medium text-zinc-200 leading-snug">
                        {q.question}
                      </p>

                      {/* 1-Click Suggestion Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {q.quickOptions.map((opt, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => handleAddDetail(opt.insertText)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/60 hover:border-zinc-500 text-[11px] font-medium transition-all duration-150 active:scale-95 text-left flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                            title={opt.insertText}
                          >
                            <Plus className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Optional Custom Answer Input */}
                      <div className="flex items-center space-x-1.5 pt-0.5">
                        <input
                          type="text"
                          value={customInputs[q.id] || ''}
                          onChange={(e) =>
                            setCustomInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (customInputs[q.id] || '').trim();
                              if (val) {
                                handleAddDetail(val);
                                setCustomInputs((prev) => ({ ...prev, [q.id]: '' }));
                              }
                            }
                          }}
                          placeholder={q.placeholder || 'Type custom detail...'}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = (customInputs[q.id] || '').trim();
                            if (val) {
                              handleAddDetail(val);
                              setCustomInputs((prev) => ({ ...prev, [q.id]: '' }));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-medium text-zinc-200 border border-zinc-700 transition-all active:scale-95 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary CTA & Enhanced Output Preview */}
        <div className="space-y-2 pt-1 animate-modal-stagger-4">
          <button
            type="button"
            onClick={handleQuickEnhance}
            disabled={isProcessing}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Refining prompt...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                <span>{enhancedResult ? 'Enhance Prompt (Next Upgrade)' : 'Enhance Prompt'}</span>
                <span className="text-[10px] font-mono font-medium text-zinc-600 bg-zinc-200/80 px-1.5 py-0.5 rounded ml-1">⌘⇧E</span>
              </>
            )}
          </button>

          {/* Enhanced Result Preview Card */}
          {enhancedResult && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-emerald-500/30 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Upgraded Prompt In Chatbox</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(enhancedResult);
                    setStatusMessage('Copied to clipboard');
                    setTimeout(() => setStatusMessage(null), 1500);
                  }}
                  className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Copy
                </button>
              </div>

              <div className="text-[11px] font-mono text-zinc-200 max-h-24 overflow-y-auto whitespace-pre-wrap leading-relaxed p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                {enhancedResult}
              </div>

              <button
                type="button"
                onClick={handleApplyToPage}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Synced to Chatbox (Click to Re-apply)</span>
              </button>
            </div>
          )}

        </div>
      </div>
    );
  };

  // 1. EMBEDDED MODE: Rendered directly inside the chatbox container
  if (embedded) {
    return (
      <div className={`relative inline-flex items-center font-sans antialiased text-zinc-100 text-xs ${className}`}>
        {isModalVisible && renderStudioModal(true, 'bottom-right')}
        {renderPill()}
      </div>
    );
  }

  // 2. LIVE CONTENT SCRIPT MODE: Docks to target position
  const getPillPlacement = (): React.CSSProperties => {
    if (!targetAnchor) {
      return {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 999998,
      };
    }

    if (targetAnchor.mode === 'button') {
      return {
        position: 'fixed',
        top: `${targetAnchor.top + targetAnchor.height / 2}px`,
        left: `${Math.max(12, targetAnchor.left - 6)}px`,
        transform: 'translate(-100%, -50%)',
        zIndex: 999998,
      };
    }

    // Fallback inside chatbox
    return {
      position: 'fixed',
      bottom: `${Math.max(8, window.innerHeight - targetAnchor.bottom + 6)}px`,
      right: `${Math.max(8, window.innerWidth - targetAnchor.right + 48)}px`,
      zIndex: 999998,
    };
  };

  const getModalPlacement = (): { style: React.CSSProperties; originPlacement: 'bottom-right' | 'top-right' } => {
    if (!targetAnchor) {
      return {
        style: {
          position: 'fixed',
          bottom: '56px',
          right: '16px',
          zIndex: 999999,
        },
        originPlacement: 'bottom-right',
      };
    }

    const modalWidth = 380;
    const availableBelow = window.innerHeight - targetAnchor.bottom;
    const availableAbove = targetAnchor.top;
    const rightPos = Math.max(
      8,
      Math.min(window.innerWidth - modalWidth - 8, window.innerWidth - targetAnchor.right)
    );

    const placeAbove = availableAbove >= 220 || availableAbove >= availableBelow;

    if (placeAbove) {
      const maxHeight = Math.max(220, Math.min(540, availableAbove - 16));
      return {
        style: {
          position: 'fixed',
          bottom: `${Math.max(8, window.innerHeight - targetAnchor.top + 6)}px`,
          right: `${rightPos}px`,
          maxHeight: `${maxHeight}px`,
          zIndex: 999999,
        },
        originPlacement: 'bottom-right',
      };
    }

    const maxHeight = Math.max(220, Math.min(540, availableBelow - 16));
    return {
      style: {
        position: 'fixed',
        top: `${targetAnchor.bottom + 6}px`,
        right: `${rightPos}px`,
        maxHeight: `${maxHeight}px`,
        zIndex: 999999,
      },
      originPlacement: 'top-right',
    };
  };

  const modalPlacement = isModalVisible ? getModalPlacement() : null;

  return (
    <>
      <div
        style={getPillPlacement()}
        className={`font-sans antialiased text-zinc-100 text-xs ${className}`}
      >
        {renderPill()}
      </div>
      {isModalVisible && modalPlacement && (
        <div
          style={modalPlacement.style}
          className={`font-sans antialiased text-zinc-100 text-xs ${className}`}
        >
          {renderStudioModal(false, modalPlacement.originPlacement)}
        </div>
      )}
    </>
  );
};
