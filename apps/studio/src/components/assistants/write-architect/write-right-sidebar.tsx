"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import { useWriteStore } from "./store";
import { WriterActions } from "./actions/WriterActions";
import { InspirationCard } from "./inspirations/InspirationCard";

export const WriteRightSidebar = () => {
  const { inspirations, activeInspirationIds, toggleInspiration } = useWriteStore();

  return (
    <aside className="w-80 border-l border-brand-border bg-brand-bg flex flex-col h-full overflow-hidden shrink-0">
      <div className="p-8 flex flex-col h-full space-y-12 overflow-y-auto">
        
        {/* Actions Section */}
        <WriterActions />

        {/* Inspiration Cards Section */}
        <section className="space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
              <Lightbulb className="w-3 h-3" />
              Inspirations
            </h3>
            {activeInspirationIds.length > 0 && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20 animate-in fade-in zoom-in duration-300">
                <span className="size-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-tight">Active</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            {inspirations.length > 0 ? (
              inspirations.map((card) => (
                <InspirationCard 
                  key={card.id}
                  card={card}
                  isActive={activeInspirationIds.includes(card.id)}
                  onClick={() => toggleInspiration(card.id)}
                />
              ))
            ) : (
              <div className="p-8 border border-dashed border-brand-border/60 rounded-xl flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                <Lightbulb className="w-5 h-5 text-brand-dark/20" />
                <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest italic leading-relaxed">
                  Finish a paragraph to <br /> generate inspirations
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
};
