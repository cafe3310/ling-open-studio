import React from 'react';
import { Sliders, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MODEL_CONFIG } from '@/app/lib/model';

export function ModelConfig() {
  const modelOptions = Object.entries(MODEL_CONFIG.models).map(([key, def]) => ({
    key,
    label: def.displayName
  }));

  return (
    <aside className="h-full bg-brand-bg/30 backdrop-blur-sm flex flex-col border-l border-brand-border z-10 w-72 shrink-0 p-6 overflow-y-auto">
      <h2 className="font-serif text-lg font-semibold text-brand-dark mb-4 tracking-tight flex items-center gap-2">
        <Sliders className="w-5 h-5 text-brand-dark" />
        Model Config
      </h2>

      <div className="space-y-6 mt-2">
        {/* Model Selection */}
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gray mb-2">
            Model Selection
          </h3>
          <div className="relative">
            <select
              className="flex h-10 w-full appearance-none rounded-lg border border-brand-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans pr-8 text-brand-dark"
              defaultValue="Ling_1T"
            >
              {modelOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gray mb-2">
            System Prompt
          </h3>
          <textarea
            className="w-full h-32 rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans resize-none"
            placeholder="You are a helpful assistant..."
            defaultValue="You are a helpful, harmless, and honest AI assistant created by InclusionAI."
          />
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gray">
              Temperature
            </h3>
            <span className="text-xs font-mono text-brand-dark">0.7</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.7"
            className="w-full accent-brand-blue h-1 bg-brand-border rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-brand-gray mt-1 uppercase tracking-tighter">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="pt-4 border-t border-brand-border">
          <div className="flex items-center gap-2 text-sm text-brand-dark mb-3 font-semibold">
            <Cpu className="w-4 h-4 text-brand-cyan" />
            <span>Performance Stats</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-brand-gray">Latency</span>
              <span className="font-mono text-brand-dark">45ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-gray">Tokens/sec</span>
              <span className="font-mono text-brand-dark">128</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
