"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  MousePointer2, 
  MessageSquare, 
  Quote, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Wand2, 
  PenLine, 
  ChevronRight, 
  Minimize2, 
  Maximize2, 
  Type 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InspirationCard {
  id: string;
  type: 'plot' | 'desc' | 'dialogue';
  title: string;
  content: string;
  icon: any;
}

export const WriteRightSidebar = () => {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const [hasSelection, setHasSelection] = useState(false); // Simulated for UI states

  const inspirations: InspirationCard[] = [
    {
      id: 'i1',
      type: 'plot',
      title: 'Plot Twist',
      content: 'The book suddenly slams shut on its own, trapping her finger.',
      icon: Lightbulb
    },
    {
      id: 'i2',
      type: 'desc',
      title: 'Atmosphere',
      content: 'The smell of ozone and old paper filled the air, sharp and metallic.',
      icon: MousePointer2
    },
    {
      id: 'i3',
      type: 'dialogue',
      title: 'Character',
      content: '"You shouldn\'t be reading that," a voice echoed from the dark corner.',
      icon: MessageSquare
    }
  ];

  const toggleActive = (id: string) => {
    const newIds = new Set(activeIds);
    if (newIds.has(id)) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    setActiveIds(newIds);
  };

  return (
    <aside className="w-80 border-l border-brand-border bg-brand-bg flex flex-col h-full overflow-y-auto">
      <div className="p-8 space-y-10 pb-20">
        
        {/* TOP: ACTIVE ACTIONS */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
            AI Writer Actions
          </h3>
          
          <div className="space-y-3">
            {/* Global Actions */}
            <Button className="w-full justify-between h-12 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-widest px-5 shadow-sm group">
              <div className="flex items-center gap-3">
                <PenLine className="w-4 h-4" />
                Continue Writing
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Selection Specific Actions */}
            <div className="pt-2 space-y-2.5">
              <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-tighter ml-1">
                Selection Tools {!hasSelection && "— Select text to enable"}
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  disabled={!hasSelection}
                  variant="outline" 
                  className="h-10 text-[10px] font-bold uppercase border-brand-border/50 bg-white hover:bg-slate-50 gap-2"
                >
                  <Wand2 className="w-3 h-3 text-brand-blue" />
                  Rewrite
                </Button>
                <Button 
                  disabled={!hasSelection}
                  variant="outline" 
                  className="h-10 text-[10px] font-bold uppercase border-brand-border/50 bg-white hover:bg-slate-50 gap-2"
                >
                  <Type className="w-3 h-3 text-brand-blue" />
                  Fix Grammar
                </Button>
                <Button 
                  disabled={!hasSelection}
                  variant="outline" 
                  className="h-10 text-[10px] font-bold uppercase border-brand-border/50 bg-white hover:bg-slate-50 gap-2"
                >
                  <Maximize2 className="w-3 h-3 text-brand-blue" />
                  Expand
                </Button>
                <Button 
                  disabled={!hasSelection}
                  variant="outline" 
                  className="h-10 text-[10px] font-bold uppercase border-brand-border/50 bg-white hover:bg-slate-50 gap-2"
                >
                  <Minimize2 className="w-3 h-3 text-brand-blue" />
                  Shorten
                </Button>
              </div>
              
              <div 
                onClick={() => setHasSelection(!hasSelection)}
                className="mt-2 p-3 border border-dashed border-brand-border/50 rounded-lg cursor-pointer hover:bg-white/50 transition-all text-center"
              >
                <p className="text-[9px] text-brand-dark/20 font-medium uppercase tracking-widest">
                  {hasSelection ? "Deselect (Preview Disabled State)" : "Mock Selection (Preview Active State)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-brand-border/50 w-full" />

        {/* BOTTOM: INSPIRATION CARDS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/40 flex items-center gap-2">
              Live Inspiration
              {activeIds.size > 0 ? (
                <span className="flex items-center gap-1 text-brand-blue animate-pulse">
                  <Wand2 className="size-2.5" />
                  <span className="text-[9px] lowercase">influencing output...</span>
                </span>
              ) : (
                <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              )}
            </h3>
          </div>

          <div className="space-y-4">
            {inspirations.map((item) => {
              const isActive = activeIds.has(item.id);
              const Icon = item.icon;

              return (
                <Card 
                  key={item.id}
                  onClick={() => !isActive && toggleActive(item.id)}
                  className={cn(
                    "p-5 transition-all duration-300 cursor-pointer relative group overflow-hidden",
                    isActive 
                      ? "bg-white border-brand-blue shadow-[0_8px_20px_rgba(59,130,246,0.12)] border-2 translate-x-[-4px]" 
                      : "bg-white border-brand-border/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-brand-blue/20"
                  )}
                >
                  {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue" />}

                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive ? "text-brand-blue" : "text-brand-dark/40"
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                      {item.title}
                    </div>
                    {isActive && (
                      <Badge variant="secondary" className="bg-brand-blue/10 text-brand-blue text-[9px] font-bold px-1.5 py-0 border-none uppercase tracking-tighter">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className={cn(
                      "text-[12px] leading-relaxed font-serif italic transition-colors",
                      isActive ? "text-brand-dark font-medium" : "text-brand-dark/60"
                    )}>
                      "{item.content}"
                    </p>
                    
                    {isActive ? (
                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-[9px] font-bold text-brand-blue flex items-center gap-1 uppercase tracking-widest">
                          <CheckCircle2 className="size-3" />
                          Guiding
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActive(item.id);
                          }}
                          className="text-[9px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                        >
                          <XCircle className="size-3" />
                          Off
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-brand-blue/40 group-hover:text-brand-blue transition-all opacity-0 group-hover:opacity-100">
                        <Zap className="w-3 h-3 fill-current" />
                        ACTIVATE
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
