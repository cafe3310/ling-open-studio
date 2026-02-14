"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, MessageSquare, Zap, Sparkles, ChevronRight, PenTool, RotateCcw, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const WriteRightSidebar = () => {
  const [activeInspirations, setActiveInspirations] = useState<string[]>([]);

  const toggleInspiration = (id: string) => {
    setActiveInspirations(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-80 border-l border-brand-border bg-brand-bg flex flex-col h-full overflow-hidden">
      <div className="p-8 flex flex-col h-full space-y-12 overflow-y-auto">
        
        {/* Continuation & Actions Section - More integrated design */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
            <PenTool className="w-3 h-3" />
            Writer Actions
          </h3>
          
          <div className="space-y-3">
            <Button className="w-full h-12 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-widest gap-3 rounded-xl shadow-[0_4px_12px_rgba(59,130,246,0.15)] transition-all active:scale-[0.98]">
              <Sparkles className="w-4 h-4 fill-white" />
              Continue Writing
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" className="h-10 text-[10px] font-bold text-brand-dark/40 border border-brand-border/40 hover:bg-white hover:text-brand-blue gap-2 rounded-lg transition-all">
                <RotateCcw className="w-3 h-3" />
                REWRITE
              </Button>
              <Button variant="ghost" className="h-10 text-[10px] font-bold text-brand-dark/40 border border-brand-border/40 hover:bg-white hover:text-brand-blue gap-2 rounded-lg transition-all">
                <Maximize2 className="w-3 h-3" />
                EXPAND
              </Button>
            </div>
            
            <p className="text-[9px] text-center text-brand-dark/20 font-medium uppercase tracking-tight">
              Select text on canvas for context-aware actions
            </p>
          </div>
        </section>

        {/* Inspiration Cards Section */}
        <section className="space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
              <Lightbulb className="w-3 h-3" />
              Inspirations
            </h3>
            {activeInspirations.length > 0 && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
                <span className="size-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-tight">Active</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            <InspirationCard 
              id="plot-1"
              type="Plot"
              icon={<RotateCcw className="w-3 h-3" />}
              title="Unexpected Twist"
              content="The book suddenly slams shut on its own, trapping her finger."
              isActive={activeInspirations.includes('plot-1')}
              onClick={() => toggleInspiration('plot-1')}
            />

            <InspirationCard 
              id="desc-1"
              type="Atmosphere"
              icon={<Sparkles className="w-3 h-3" />}
              title="Sensory Detail"
              content="The smell of ozone and old paper filled the air, sharp and metallic."
              isActive={activeInspirations.includes('desc-1')}
              onClick={() => toggleInspiration('desc-1')}
            />

            <InspirationCard 
              id="diag-1"
              type="Dialogue"
              icon={<MessageSquare className="w-3 h-3" />}
              title="Ethereal Voice"
              content="You shouldn't be reading that, a voice echoed from the dark corner."
              isActive={activeInspirations.includes('diag-1')}
              onClick={() => toggleInspiration('diag-1')}
            />
          </div>
        </section>
      </div>
    </aside>
  );
};

const InspirationCard = ({ 
  id, type, icon, title, content, isActive, onClick 
}: { 
  id: string, type: string, icon: React.ReactNode, title: string, content: string, isActive: boolean, onClick: () => void 
}) => {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-5 cursor-pointer border transition-all duration-300 relative group overflow-hidden rounded-xl",
        isActive 
          ? "bg-brand-blue/[0.04] border-brand-blue/30 shadow-[0_4px_16px_rgba(59,130,246,0.08)] scale-[1.02]" 
          : "bg-white border-brand-border/50 shadow-sm hover:shadow-md hover:border-brand-blue/20"
      )}
    >
      {isActive && (
        <div className="absolute top-0 right-0 p-2">
          <Zap className="w-3 h-3 text-brand-blue fill-brand-blue" />
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest">
          {icon}
          {type}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold text-brand-dark tracking-tight flex items-center justify-between">
            {title}
            <ChevronRight className={cn("w-3 h-3 opacity-0 group-hover:opacity-40 transition-all", isActive && "opacity-40 rotate-90")} />
          </div>
          <p className={cn(
            "text-[12px] leading-relaxed font-serif italic transition-colors",
            isActive ? "text-brand-dark" : "text-brand-dark/60"
          )}>
            "{content}"
          </p>
        </div>
        
        {isActive && (
          <div className="pt-2">
             <Badge variant="secondary" className="bg-brand-blue/10 text-brand-blue border-none text-[9px] font-bold px-2 py-0">GUIDING GENERATION</Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
