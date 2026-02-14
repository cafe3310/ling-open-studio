import React from 'react';
import { LayoutTemplate, Sparkles, Zap, Moon, Palette, Wind, LayoutGrid, LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useModelStore } from "@/lib/store";
import { designs, techStacks } from "@/assistants/web-architect/prompts";

export const WebConfig: React.FC = () => {
  const { designId, setDesignId, techStackId, setTechStackId } = useModelStore();

  const getIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case 'Layout': return LayoutTemplate;
      case 'Feather': return Sparkles;
      case 'Box': return Palette;
      case 'Wind': return Wind;
      case 'Zap': return Zap;
      case 'Grid': return LayoutGrid;
      default: return Palette;
    }
  };

  return (
    <aside className="w-72 border-l border-brand-border bg-white flex flex-col h-full overflow-y-auto hide-scrollbar">
      <div className="p-6">
        <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2 mb-6 uppercase tracking-wider">
          <LayoutTemplate className="w-4 h-4 text-brand-blue" />
          Generation Settings
        </h2>

        <div className="space-y-8">
          {/* Design Aesthetic */}
          <section>
            <h3 className="text-[11px] font-bold text-brand-gray uppercase tracking-widest mb-4">Design Aesthetic</h3>
            <div className="grid grid-cols-2 gap-2">
              {designs.map((style) => {
                const Icon = getIcon(style.icon);
                return (
                  <button
                    key={style.id}
                    onClick={() => setDesignId(style.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 gap-2 group",
                      style.id === designId 
                        ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue/20" 
                        : "border-slate-100 hover:border-slate-200 text-brand-gray hover:text-brand-dark bg-slate-50/50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", style.id === designId ? "text-brand-blue" : "text-slate-400 group-hover:text-brand-dark")} />
                    <span className="text-[10px] font-medium">{style.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <Separator className="bg-slate-100" />

          {/* Tech Stack */}
          <section>
            <h3 className="text-[11px] font-bold text-brand-gray uppercase tracking-widest mb-4">Tech Stack</h3>
            <div className="space-y-2">
              <div className="relative">
                <select 
                  value={techStackId}
                  onChange={(e) => setTechStackId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-brand-dark appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer"
                >
                  {techStacks.map(ts => (
                    <option key={ts.id} value={ts.id}>{ts.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 px-1 leading-normal italic">
                * Selected stack will be used by the Agent.
              </p>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};
