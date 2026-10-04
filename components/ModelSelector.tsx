import React from 'react';
import type { LLMTarget } from '../src/types';
import { TARGET_MODELS } from '../src/utils/promptEnhancer';

interface ModelSelectorProps {
  selected: LLMTarget;
  onSelect: (model: LLMTarget) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
      {TARGET_MODELS.map((model) => {
        const isSelected = selected === model.id;
        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors border flex items-center space-x-1.5 ${
              isSelected
                ? 'bg-white border-white text-zinc-950 font-semibold shadow-xs'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isSelected ? 'bg-emerald-500' : 'bg-zinc-600'
              }`}
            />
            <span>{model.name}</span>
          </button>
        );
      })}
    </div>
  );
};
