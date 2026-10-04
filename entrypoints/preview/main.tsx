import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as PopupApp } from '../popup/App';
import { App as OptionsApp } from '../options/App';
import { FloatingCapsule } from '../content/FloatingCapsule';
import '../../src/globals.css';
import { Globe, Compass, Flame, Paperclip, ArrowUp, Brain, ChevronDown, Mic, AudioLines } from 'lucide-react';

const PreviewShowcase: React.FC = () => {
  const [activeView, setActiveView] = useState<'all' | 'popup' | 'options' | 'inpage'>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'inpage' || hash === 'popup' || hash === 'options') return hash as any;
    return 'all';
  });
  const [activeHost, setActiveHost] = useState<'gemini' | 'claude' | 'chatgpt'>('gemini');

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Top Banner */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-zinc-950 text-xs font-mono font-bold">
            P3
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-white">Prompt3000 Interface Showcase</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Extension Surfaces
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Live preview of in-page capsule, popup toolbar, and options dashboard</p>
          </div>
        </div>

        {/* Browser compatibility chips */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span>Safari</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Chrome</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
            <Flame className="w-3.5 h-3.5 text-zinc-400" />
            <span>Firefox</span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex space-x-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveView('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeView === 'all' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('popup')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeView === 'popup' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Popup
          </button>
          <button
            onClick={() => setActiveView('inpage')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeView === 'inpage' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Prompt Improver
          </button>
          <button
            onClick={() => setActiveView('options')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeView === 'options' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Options
          </button>
        </div>
      </header>

      {/* Showcase Body */}
      <main className="p-8 max-w-7xl mx-auto space-y-12">
        {activeView === 'all' && (
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left: Popup Preview */}
            <div className="col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>1. Extension Popup</span>
                  </h2>
                  <p className="text-xs text-zinc-400">Toolbar action popup with floating pill visibility toggler</p>
                </div>
                <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                  280 px
                </span>
              </div>

              {/* Mock Browser Frame */}
              <div className="rounded-xl border border-zinc-800 shadow-2xl overflow-hidden bg-zinc-950">
                <div className="bg-zinc-900/80 px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-medium">Prompt3000 Extension Action</span>
                  <span className="w-8" />
                </div>
                <PopupApp />
              </div>
            </div>

            {/* Right: In-Page AI Chat Playground & In-Chatbox Capsule Demo */}
            <div className="col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>2. In-Chatbox Capsule (Content Script)</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Seamlessly docked inside ChatGPT, Claude, and Gemini chatboxes with isolated Shadow DOM
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-medium">
                  Shadow Root
                </span>
              </div>

              {/* Simulated Host Page */}
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-6 min-h-[570px] flex flex-col justify-between overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-zinc-200">Host Chat Playground</span>
                    {/* Switcher between Gemini, Claude, ChatGPT */}
                    <div className="flex bg-zinc-900 rounded-md p-0.5 border border-zinc-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setActiveHost('gemini')}
                        className={`px-2 py-0.5 rounded font-medium transition-colors ${
                          activeHost === 'gemini'
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Gemini
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveHost('claude')}
                        className={`px-2 py-0.5 rounded font-medium transition-colors ${
                          activeHost === 'claude'
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Claude
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveHost('chatgpt')}
                        className={`px-2 py-0.5 rounded font-medium transition-colors ${
                          activeHost === 'chatgpt'
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        ChatGPT
                      </button>
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {activeHost === 'gemini' && 'Placed at left of Model button (Flash ˅)'}
                    {activeHost === 'claude' && 'Placed beside model text (Sonnet 5 Medium) left side'}
                    {activeHost === 'chatgpt' && 'Placed at left of Think button (🧠 Think)'}
                  </span>
                </div>

                {/* Simulated Chat Thread */}
                <div className="space-y-4 my-auto py-6 max-w-xl mx-auto w-full">
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed shadow-xs">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-white text-zinc-950 flex items-center justify-center text-[10px] font-mono font-bold">
                        AI
                      </div>
                      <span className="font-medium text-zinc-200">Assistant</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {activeHost === 'gemini' ? 'Gemini 2.5 Flash' : activeHost === 'claude' ? 'Claude 3.7 Sonnet' : 'ChatGPT o3'}
                      </span>
                    </div>
                    {activeHost === 'gemini' && 'Ready when you are. Ask Gemini anything!'}
                    {activeHost === 'claude' && 'How can I help you today?'}
                    {activeHost === 'chatgpt' && 'Ready when you are. Ask anything.'}
                  </div>

                  {/* Simulated Host Page Chatbox with Prompt3000 inside */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-medium text-zinc-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{activeHost.toUpperCase()} Composer</span>
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">Live Score & Clarifying Questions</span>
                    </div>

                    {/* Quick test prompt chips */}
                    <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 text-[10px] scrollbar-none">
                      <span className="text-zinc-500 font-mono text-[9px] uppercase pr-0.5">Test:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('prompt-textarea') as HTMLTextAreaElement | null;
                          if (el) {
                            el.value = 'hi';
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400 font-mono transition-colors"
                        title="Score: ~12/100 (Greeting)"
                      >
                        "hi"
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('prompt-textarea') as HTMLTextAreaElement | null;
                          if (el) {
                            el.value = 'i want to learn something';
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-400 font-mono transition-colors"
                        title='Score: ~12/100 ("i want to learn something" - Triggers Soya Extension prompt fix nudge)'
                      >
                        "i want to learn something"
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('prompt-textarea') as HTMLTextAreaElement | null;
                          if (el) {
                            el.value = 'explain me chapter 3';
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400 font-mono transition-colors"
                        title="Score: ~25/100 (Needs book & context)"
                      >
                        "explain me chapter 3"
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('prompt-textarea') as HTMLTextAreaElement | null;
                          if (el) {
                            el.value = 'explain me chapter 3 from the book Clean Code with 5 key takeaways and code examples';
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sky-400 font-mono transition-colors"
                        title="Score: ~68/100 (Strong)"
                      >
                        "Clean Code Ch.3 + Details"
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('prompt-textarea') as HTMLTextAreaElement | null;
                          if (el) {
                            el.value = '';
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 focus-within:border-zinc-700 transition-all">
                      <textarea
                        id="prompt-textarea"
                        placeholder={
                          activeHost === 'gemini'
                            ? 'Ask Gemini'
                            : activeHost === 'claude'
                            ? 'How can I help you today?'
                            : 'Ask anything'
                        }
                        rows={3}
                        defaultValue=""
                        className="w-full bg-transparent border-0 p-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                      />

                      {/* Inside-Chatbox Toolbar Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 mt-2">
                        {/* Host action buttons */}
                        <div className="flex items-center space-x-1 text-zinc-500">
                          <button
                            type="button"
                            title="Attach File"
                            className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                          </button>
                          {activeHost === 'claude' && (
                            <div className="flex items-center space-x-1 pl-1">
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px] font-medium">Chat</span>
                              <span className="px-2 py-0.5 rounded text-zinc-500 hover:text-zinc-300 text-[10px] font-medium cursor-pointer">Cowork</span>
                            </div>
                          )}
                          {activeHost !== 'claude' && (
                            <button
                              type="button"
                              title="Search Web"
                              className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Right side controls: Prompt3000 placed at left of target button! */}
                        <div className="flex items-center space-x-2">
                          {/* Prompt3000 Extension Capsule */}
                          <FloatingCapsule embedded={true} defaultModel={activeHost} />

                          {/* 1. GEMINI: Model Button (Flash v) + Mic */}
                          {activeHost === 'gemini' && (
                            <>
                              <button
                                type="button"
                                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                                title="Model: Flash"
                              >
                                <span>Flash</span>
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                              </button>
                              <button
                                type="button"
                                title="Microphone"
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                              >
                                <Mic className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* 2. CLAUDE: Model Text (Sonnet 5 Medium) */}
                          {activeHost === 'claude' && (
                            <div className="flex items-center space-x-1.5 text-xs select-none px-1">
                              <span className="text-zinc-200 font-medium">Sonnet 5</span>
                              <span className="text-zinc-400 font-normal">Medium</span>
                            </div>
                          )}

                          {/* 3. CHATGPT: Think Button + Mic + Voice */}
                          {activeHost === 'chatgpt' && (
                            <>
                              <button
                                type="button"
                                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                                title="Think"
                              >
                                <Brain className="w-3.5 h-3.5 text-zinc-300" />
                                <span>Think</span>
                              </button>
                              <button
                                type="button"
                                title="Voice Dictation"
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                              >
                                <Mic className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                title="Voice Mode"
                                className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-xs"
                              >
                                <AudioLines className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* Chatbox Send Button */}
                          <button
                            type="button"
                            title="Send prompt"
                            className="w-7 h-7 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-colors shadow-xs"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'popup' && (
          <div className="flex justify-center py-6">
            <div className="rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
              <PopupApp />
            </div>
          </div>
        )}

        {activeView === 'inpage' && (
          <div className="flex flex-col items-center justify-center pt-2 pb-12 space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-sm font-semibold text-zinc-100">In-Page Prompt Improver Modal</h2>
              <p className="text-xs text-zinc-400">
                Shown inside Claude, ChatGPT, or Gemini when clicking the pill or pressing ⌘⇧E
              </p>
            </div>
            <div className="relative pt-[480px] pb-6 px-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-2xl flex items-center justify-center">
              <FloatingCapsule
                embedded={true}
                defaultModel="claude"
                initialExpanded={true}
                initialPrompt="explain me chapter 3"
              />
            </div>
          </div>
        )}

        {activeView === 'options' && (
          <div className="rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
            <OptionsApp />
          </div>
        )}
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PreviewShowcase />
  </React.StrictMode>
);
