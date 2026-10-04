import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Power } from 'lucide-react';

export const App: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  // Load current setting from storage
  useEffect(() => {
    try {
      if (typeof browser !== 'undefined' && browser.storage?.sync) {
        browser.storage.sync.get('floatingWidget').then((res) => {
          if (res && res.floatingWidget !== undefined) {
            setIsEnabled(res.floatingWidget !== false);
          }
        });
      }
    } catch {}
  }, []);

  const togglePill = () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);

    // Persist setting to storage
    try {
      if (typeof browser !== 'undefined' && browser.storage?.sync) {
        browser.storage.sync.set({ floatingWidget: nextState }).catch(() => {});
      }
    } catch {}

    // Broadcast instant update to all open tabs
    try {
      if (typeof browser !== 'undefined' && browser.tabs?.query) {
        browser.tabs
          .query({})
          .then((tabs) => {
            for (const tab of tabs) {
              if (tab.id) {
                browser.tabs
                  .sendMessage(tab.id, {
                    type: 'TOGGLE_FLOATING_WIDGET',
                    enabled: nextState,
                  })
                  .catch(() => {});
              }
            }
          })
          .catch(() => {});
      }
    } catch {}
  };

  const openOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof browser !== 'undefined' && browser.runtime?.openOptionsPage) {
        browser.runtime.openOptionsPage();
      } else if (typeof window !== 'undefined' && (window as any).chrome?.runtime?.openOptionsPage) {
        (window as any).chrome.runtime.openOptionsPage();
      }
    } catch {}
  };

  return (
    <div className="w-[250px] bg-[#09090b] text-zinc-100 flex flex-col antialiased select-none font-sans p-1.5">
      <div
        role="switch"
        aria-checked={isEnabled}
        tabIndex={0}
        onClick={togglePill}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePill();
          }
        }}
        className="group relative flex items-center justify-between p-1.5 rounded-lg transition-all duration-150 hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer"
      >
        <div className="flex items-center min-w-0 pr-2">
          {/* Animated Power Glyph */}
          <div
            className={`relative flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-all duration-200 ${
              isEnabled
                ? 'bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-zinc-800/60 text-zinc-500'
            }`}
          >
            <Power className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-105" />
          </div>

          <div className="ml-2 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-zinc-100 tracking-tight">
                Enable Extension
              </span>
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  isEnabled
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                    : 'bg-zinc-600'
                }`}
              />
            </div>
            <p className="text-[10px] text-zinc-400 font-normal leading-tight mt-0.5 truncate">
              {isEnabled ? 'Extension is active' : 'Turn on to activate'}
            </p>
          </div>
        </div>

        {/* Tactile Switch */}
        <div
          className={`relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full p-0.5 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isEnabled
              ? 'bg-emerald-500 shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.15),0_0_8px_rgba(16,185,129,0.35)]'
              : 'bg-zinc-800 border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-active:scale-x-110 ${
              isEnabled ? 'translate-x-3.5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>

      {/* Subtle Divider & Utility Bar */}
      <div className="h-px bg-white/[0.06] my-1 mx-0.5" />

      <div className="flex items-center justify-between px-1 py-0.5 text-[10px]">
        <div className="flex items-center space-x-1 text-zinc-500 select-none">
          <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/[0.06] text-zinc-300 font-medium">
            ⌘⇧E
          </kbd>
          <span className="text-[9px] text-zinc-500 font-medium">Enhance</span>
        </div>

        <button
          type="button"
          onClick={openOptions}
          className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200 transition-colors py-0.5 px-1.5 rounded hover:bg-white/[0.06]"
          title="Open Preferences"
        >
          <SlidersHorizontal className="w-2.5 h-2.5 text-zinc-400" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
