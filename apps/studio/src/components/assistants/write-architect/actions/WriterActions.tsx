"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, PenTool, RotateCcw, Maximize2 } from "lucide-react";

export const WriterActions = () => {
  return (
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
  );
};
