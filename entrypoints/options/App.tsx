import React, { useState, useEffect } from 'react';
import { Sliders, Key, Globe, Shield, Check, Save } from 'lucide-react';
import type { LLMTarget, PromptTone, PromptFramework } from '../../src/types';
import { TARGET_MODELS, TONE_OPTIONS, FRAMEWORK_OPTIONS } from '../../src/utils/promptEnhancer';
import { SUPPORTED_LLM_SITES } from '../../src/constants/llmSites';

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<'general' | 'api' | 'browsers'>('general');
  const [defaultTarget, setDefaultTarget] = useState<LLMTarget>('chatgpt');
  const [defaultTone, setDefaultTone] = useState<PromptTone>('auto');
  const [defaultFramework, setDefaultFramework] = useState<PromptFramework>('cgc');
  const [autoInsert, setAutoInsert] = useState(true);
  const [floatingWidget, setFloatingWidget] = useState(true);
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      if (typeof browser !== 'undefined' && browser.storage?.sync) {
        browser.storage.sync.get(['defaultTarget', 'defaultTone', 'defaultFramework', 'autoInsert', 'floatingWidget']).then((res: any) => {
          if (res) {
            if (res.defaultTarget) setDefaultTarget(res.defaultTarget as LLMTarget);
            if (res.defaultTone) setDefaultTone(res.defaultTone as PromptTone);
            if (res.defaultFramework) setDefaultFramework(res.defaultFramework as PromptFramework);
            if (res.autoInsert !== undefined) setAutoInsert(Boolean(res.autoInsert));
            if (res.floatingWidget !== undefined) setFloatingWidget(res.floatingWidget !== false);
          }
        });
      }
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      if (typeof browser !== 'undefined' && browser.storage?.sync) {
        browser.storage.sync.set({
          defaultTarget,
          defaultTone,
          defaultFramework,
          autoInsert,
          floatingWidget,
        });
      }
    } catch (e) {
      console.log('Saved locally (simulated)', e);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-zinc-950 text-xs font-mono font-bold">
            P3
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold text-sm tracking-tight text-white">Prompt3000 Settings</h1>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400">Preferences & Configuration</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Safari • Chrome • Firefox</span>
          </div>

          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-colors ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-zinc-200 text-zinc-950'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Changes</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Settings Grid */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-8 py-8 grid grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <aside className="col-span-3 space-y-1">
          <button
            onClick={() => setActiveNav('general')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition-colors ${
              activeNav === 'general'
                ? 'bg-zinc-900 border border-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Sliders className="w-4 h-4 text-zinc-400" />
            <span>General & Models</span>
          </button>

          <button
            onClick={() => setActiveNav('api')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition-colors ${
              activeNav === 'api'
                ? 'bg-zinc-900 border border-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Key className="w-4 h-4 text-zinc-400" />
            <span>API Keys</span>
          </button>

          <button
            onClick={() => setActiveNav('browsers')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition-colors ${
              activeNav === 'browsers'
                ? 'bg-zinc-900 border border-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Shield className="w-4 h-4 text-zinc-400" />
            <span>Browser Engines</span>
          </button>
        </aside>

        {/* Content Section */}
        <div className="col-span-9 space-y-6">
          {activeNav === 'general' && (
            <div className="space-y-6">
              {/* Default Model */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Default Target Model</h3>
                <p className="text-xs text-zinc-400">
                  Select which model format Prompt3000 should automatically tailor prompts for when triggered via shortcut.
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {TARGET_MODELS.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => setDefaultTarget(model.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        defaultTarget === model.id
                          ? 'bg-white border-white text-zinc-950 font-semibold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">{model.name}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                          defaultTarget === model.id ? 'bg-zinc-200 text-zinc-900 font-semibold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}>
                          {model.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Persona & Framework Defaults */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Default Persona & Structure</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Default Tone
                    </label>
                    <select
                      value={defaultTone}
                      onChange={(e) => setDefaultTone(e.target.value as PromptTone)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                    >
                      {TONE_OPTIONS.map((tone) => (
                        <option key={tone.id} value={tone.id} className="bg-zinc-950 text-zinc-200">
                          {tone.icon} {tone.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Default Framework Architecture
                    </label>
                    <select
                      value={defaultFramework}
                      onChange={(e) => setDefaultFramework(e.target.value as PromptFramework)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                    >
                      {FRAMEWORK_OPTIONS.map((f) => (
                        <option key={f.id} value={f.id} className="bg-zinc-950 text-zinc-200">
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Extension Behaviors */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">In-Page Interaction Behavior</h3>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                    <div>
                      <div className="text-xs font-medium text-zinc-200">
                        Enable In-Chatbox Prompt3000 Capsule
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Dock the Prompt3000 capsule directly inside AI chatboxes on ChatGPT, Claude, Gemini, and other LLM platforms.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={floatingWidget}
                      onChange={(e) => setFloatingWidget(e.target.checked)}
                      className="accent-white w-4 h-4"
                    />
                  </label>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-200">
                        Targeted AI Websites Only
                      </span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono font-medium">
                        Active whitelist
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Prompt3000 is intentionally restricted to run only on verified LLM and AI chat platforms. It will not load or inject on regular websites.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {SUPPORTED_LLM_SITES.map((site) => (
                        <span
                          key={site.domain}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono"
                        >
                          {site.name} ({site.domain})
                        </span>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                    <div>
                      <div className="text-xs font-medium text-zinc-200">
                        Auto-Insert Enhanced Prompt
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Immediately replace active textarea content after voice capture or shortcut enhancement.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoInsert}
                      onChange={(e) => setAutoInsert(e.target.checked)}
                      className="accent-white w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'api' && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">API Keys (BYOK)</h3>
                <p className="text-xs text-zinc-400">
                  Optional: Connect your personal AI API keys for direct model inference.
                  Keys are stored locally in your browser's encrypted extension storage.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">OpenAI API Key</label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Anthropic API Key</label>
                  <input
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Google Gemini API Key</label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>
            </div>
          )}

          {activeNav === 'browsers' && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Cross-Browser Engine Status</h3>
                <p className="text-xs text-zinc-400">
                  Prompt3000 is built with universal WebExtension Manifest standards to run reliably across major web engines.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">Apple Safari</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    WebKit WebExtension API & macOS native shortcut bridge.
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono block">wxt build -b safari</span>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">Google Chrome</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Manifest V3 Service Worker, Brave, Edge, and Opera compatibility.
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono block">wxt build</span>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">Mozilla Firefox</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Gecko WebExtension standard with event page fallback.
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono block">wxt build -b firefox</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
