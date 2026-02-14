"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenLine, Zap } from "lucide-react";

export const WriteLeftSidebar = () => {
  return (
    <aside className="w-72 border-r border-brand-border bg-brand-bg flex flex-col h-full overflow-y-auto">
      <div className="p-8 space-y-10">
        {/* Title Section */}
        <div>
          <h1 className="font-serif italic text-3xl text-brand-dark leading-tight tracking-tight">
            The Ink of Tomorrow
          </h1>
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30">Summary</h3>
          <p className="text-[13px] text-brand-dark/80 leading-relaxed font-sans">
            A young archivist discovers a book that writes history before it happens.
          </p>
        </div>

        {/* World Settings */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30">World Settings</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-md border-brand-border bg-white text-brand-dark/70 px-3 py-1 text-[11px] font-medium">Victorian</Badge>
            <Badge variant="outline" className="rounded-md border-brand-border bg-white text-brand-dark/70 px-3 py-1 text-[11px] font-medium">Low Magic</Badge>
          </div>
        </div>

        {/* Characters */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30">Characters</h3>
          <ul className="space-y-3">
            {['Elara', 'The Shadow Binder', 'Sir Arthur'].map(char => (
              <li key={char} className="flex items-center gap-3 text-[13px] text-brand-dark/80 font-medium font-sans">
                <span className="size-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                {char}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 space-y-4">
          <Button variant="outline" className="w-full justify-start gap-3 h-12 text-xs font-bold bg-white border-brand-border shadow-sm hover:bg-white/80 transition-all">
            <PenLine className="w-4 h-4 text-brand-blue" />
            Generate Next Paragraph
          </Button>
          <Button variant="ghost" className="w-full justify-start h-8 px-0 text-[11px] font-bold text-brand-dark/40 hover:text-brand-blue transition-colors uppercase tracking-widest">
            Auto-Complete Chapter
          </Button>
        </div>
      </div>
    </aside>
  );
};
