"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, MousePointer2, MessageSquare, Quote, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const WriteRightSidebar = () => {
  return (
    <aside className="w-80 border-l border-brand-border bg-brand-bg flex flex-col h-full overflow-y-auto">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/40 flex items-center gap-2">
            Inspiration
            <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          </h3>
        </div>

        {/* Plot Card */}
        <Card className="p-5 bg-white border-brand-border/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest">
            <Lightbulb className="w-3.5 h-3.5" />
            Plot
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-brand-dark tracking-tight">Plot Twist</div>
            <p className="text-[12px] text-brand-dark/60 leading-relaxed font-serif italic">
              "The book suddenly slams shut on its own, trapping her finger."
            </p>
          </div>
        </Card>

        {/* Description Card */}
        <Card className="p-5 bg-white border-brand-border/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest">
            <MousePointer2 className="w-3.5 h-3.5" />
            Description
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-brand-dark tracking-tight">Atmosphere</div>
            <p className="text-[12px] text-brand-dark/60 leading-relaxed font-serif italic">
              "The smell of ozone and old paper filled the air, sharp and metallic."
            </p>
          </div>
        </Card>

        {/* Dialogue Card - Selected Style */}
        <Card className="p-5 bg-brand-blue/[0.03] border-brand-blue/20 shadow-[0_4px_12px_rgba(59,130,246,0.05)] space-y-4 relative group cursor-pointer hover:bg-brand-blue/[0.05] transition-all">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest">
            <MessageSquare className="w-3.5 h-3.5" />
            Dialogue
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-brand-dark tracking-tight">Character</div>
            <p className="text-[12px] text-brand-dark/60 leading-relaxed font-serif italic">
              "You shouldn't be reading that, a voice echoed from the dark corner."
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-brand-blue group-hover:translate-x-1 transition-transform">
            <Zap className="w-3 h-3 fill-current" />
            CLICK TO INSERT
          </div>
        </Card>

        {/* Detected Concepts */}
        <div className="pt-6 space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30">Detected Concepts</h3>
          <div className="flex flex-wrap gap-2.5">
            {['Library', 'Ancient Tome', 'Rain'].map(tag => (
              <Badge key={tag} variant="outline" className="rounded-md border-brand-border bg-white text-brand-dark/60 px-3 py-1 text-[11px] font-medium transition-colors hover:border-brand-blue/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
