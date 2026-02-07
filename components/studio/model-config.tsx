import React from 'react';
import { Sliders, Cpu, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MODEL_CONFIG } from '@/lib/model';
import { useModelStore } from '@/lib/store';
import { useThread } from '@assistant-ui/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModelConfig() {
  const { 
    modelId, 
    systemPrompt, 
    temperature, 
    enabledTools,
    toolParadigm,
    setModelId, 
    setSystemPrompt, 
    setTemperature,
    setEnabledTools,
    setToolParadigm
  } = useModelStore();

  const messages = useThread((state) => state.messages);
  const isStarted = messages.length > 0;

  const toggleTool = (tool: string) => {
    if (enabledTools.includes(tool)) {
      setEnabledTools(enabledTools.filter((t) => t !== tool));
    } else {
      setEnabledTools([...enabledTools, tool]);
    }
  };

  const modelOptions = Object.entries(MODEL_CONFIG.models).map(([key, def]) => ({
    key,
    label: def.displayName
  }));

  return (
    <TooltipProvider>
      <aside className="h-full bg-brand-bg/30 backdrop-blur-sm flex flex-col border-l border-brand-border z-10 w-72 shrink-0 p-6 overflow-y-auto">
        <h2 className="font-serif text-lg font-semibold text-brand-dark mb-4 tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-brand-dark" />
          Model Config
        </h2>

        <div className="space-y-6 mt-2 pb-12">
          {/* Model Selection */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gray">
                Model Selection
              </h3>
              {isStarted && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-brand-gray cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Model cannot be changed once a conversation has started.</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="relative">
              <select
                className={cn(
                  "flex h-10 w-full appearance-none rounded-lg border border-brand-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans pr-8 text-brand-dark",
                  isStarted && "opacity-50 cursor-not-allowed bg-brand-bg/50"
                )}
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                disabled={isStarted}
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
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gray">
                System Prompt
              </h3>
              {isStarted && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-brand-gray cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">System prompt cannot be changed once a conversation has started.</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <textarea
              className={cn(
                "w-full h-32 rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans resize-none",
                isStarted && "opacity-50 cursor-not-allowed bg-brand-bg/50"
              )}
              placeholder="You are a helpful assistant..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={isStarted}
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gray">
                Temperature
              </h3>
              <span className="text-xs font-mono text-brand-dark">{temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.4"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-brand-blue h-1 bg-brand-border rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-gray mt-1 uppercase tracking-tighter">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Tool Calling */}
          <div className="pt-4 border-t border-brand-border">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gray">
                Tool Calling
              </h3>
            </div>
            
            <div className="space-y-3">
              <label className={cn(
                "flex items-center gap-2 cursor-pointer group",
                isStarted && "opacity-50 cursor-not-allowed"
              )}>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-brand-border text-brand-blue focus:ring-brand-blue/50"
                  checked={enabledTools.includes('vfs')}
                  onChange={() => toggleTool('vfs')}
                  disabled={isStarted}
                />
                <span className="text-sm text-brand-dark group-hover:text-brand-blue transition-colors">VFS (File System)</span>
              </label>

              <label className={cn(
                "flex items-center gap-2 cursor-pointer group",
                isStarted && "opacity-50 cursor-not-allowed"
              )}>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-brand-border text-brand-blue focus:ring-brand-blue/50"
                  checked={enabledTools.includes('js')}
                  onChange={() => toggleTool('js')}
                  disabled={isStarted}
                />
                <span className="text-sm text-brand-dark group-hover:text-brand-blue transition-colors">JS (Browser Execution)</span>
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-[10px] uppercase font-bold text-brand-gray mb-1.5 ml-0.5">Paradigm</label>
              <div className="relative">
                <select
                  className={cn(
                    "flex h-9 w-full appearance-none rounded-lg border border-brand-border bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue/50 transition-all font-sans pr-8 text-brand-dark",
                    isStarted && "opacity-50 cursor-not-allowed bg-brand-bg/50"
                  )}
                  value={toolParadigm}
                  onChange={(e) => setToolParadigm(e.target.value as any)}
                  disabled={isStarted}
                >
                  <option value="json">JSON (Strict)</option>
                  <option value="xml">XML (Tags)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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
                <span className="font-mono text-brand-dark">--ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-brand-gray">Tokens/sec</span>
                <span className="font-mono text-brand-dark">--</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
