import React, { useState } from 'react';
import type { PromptResult } from '../src/types';
import { Copy, Check, ArrowUpRight, Bookmark, RefreshCw } from 'lucide-react';

interface PromptResultCardProps {
  result: PromptResult;
  onInsertTab?: (text: string) => void;
  onRegenerate?: () => void;
}

export const PromptResultCard: React.FC<PromptResultCardProps> = ({
  result,
  onInsertTab,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.enhancedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const wordCount = result.enhancedPrompt.trim().split(/\s+/).length;
  const charCount = result.enhancedPrompt.length;

  return (
    <div className="bg-zinc-900 rounded-lg p-3.5 space-y-2.5 relative border border-zinc-800 shadow-xs text-zinc-100">
      {/* Header with metadata and actions */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
            Refined Prompt
          </span>
          <span className="text-zinc-500 text-[11px] font-mono">
            {wordCount} words • {charCount} chars
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              title="Regenerate"
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setSaved(!saved)}
            title="Save blueprint"
            className={`p-1 rounded transition-colors ${
              saved ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prompt preview container */}
      <div className="relative group">
        <pre className="text-xs font-mono bg-zinc-950 p-3 rounded-lg text-zinc-200 leading-relaxed overflow-x-auto max-h-52 border border-zinc-800 whitespace-pre-wrap selection:bg-white selection:text-zinc-950">
          {result.enhancedPrompt}
        </pre>
      </div>

      {/* Action Footer */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors border ${
            copied
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>

        <button
          onClick={() => onInsertTab?.(result.enhancedPrompt)}
          className="flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 shadow-xs transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Insert in Tab</span>
        </button>
      </div>
    </div>
  );
};
