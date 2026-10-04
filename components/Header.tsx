import React from 'react';
import { Sliders, Mic, Layers, History } from 'lucide-react';

interface HeaderProps {
  activeTab: 'enhance' | 'history' | 'templates';
  onTabChange: (tab: 'enhance' | 'history' | 'templates') => void;
  onOpenOptions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onOpenOptions }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-3.5 py-2.5 flex flex-col space-y-2.5">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-zinc-950 text-[10px] font-mono font-bold tracking-tighter">
            P3
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-xs text-zinc-100 tracking-tight">
                Prompt3000
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">v1.0</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1.5">
          <kbd className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-medium">
            ⌘⇧Space
          </kbd>
          {onOpenOptions && (
            <button
              onClick={onOpenOptions}
              title="Extension Settings"
              className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex space-x-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
        <button
          onClick={() => onTabChange('enhance')}
          className={`flex-1 py-1 px-2 rounded-md text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'enhance'
              ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Mic className="w-3 h-3" />
          <span>Refine</span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`flex-1 py-1 px-2 rounded-md text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'history'
              ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <History className="w-3 h-3" />
          <span>History</span>
        </button>

        <button
          onClick={() => onTabChange('templates')}
          className={`flex-1 py-1 px-2 rounded-md text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'templates'
              ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Blueprints</span>
        </button>
      </nav>
    </header>
  );
};
