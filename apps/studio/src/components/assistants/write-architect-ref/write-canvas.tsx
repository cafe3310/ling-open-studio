"use client";

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Segment {
  id: string;
  content: string;
  status: 'raw' | 'processing' | 'completed';
  summary?: string;
  entities?: string[];
}

export const WriteCanvas = () => {
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: '1',
      content: 'The rain had not stopped for three days. It drummed against the stained glass windows of the library, a rhythmic accompaniment to the silence that filled the room.',
      status: 'completed',
      summary: 'Persistent rain drums against library windows, echoing the interior silence.',
      entities: ['Library', 'Rain', 'Stained Glass']
    },
    {
      id: '2',
      content: 'Elara traced the spine of the ancient tome. "They say the ink never dries," she whispered, though there was no one to hear her. The candle flickered, casting long, dancing shadows against the shelves.',
      status: 'processing'
    },
    {
      id: '3',
      content: '"You shouldn\'t be reading that," a voice echoed from the dark corner.',
      status: 'raw'
    }
  ]);

  return (
    <main className="flex-1 bg-white relative overflow-y-auto">
      {/* Action Indicators (Top Right) */}
      <div className="fixed top-20 right-8 z-30">
         <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur border border-brand-border/50 rounded-full shadow-sm">
            <div className="size-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-brand-dark/40 uppercase tracking-widest">Preprocessing...</span>
         </div>
      </div>

      <div className="max-w-[1000px] mx-auto py-24 px-12 lg:px-20 grid grid-cols-[1fr_280px] gap-16">
        {/* Left Column: Editor Canvas */}
        <div className="space-y-12">
          {segments.map((segment) => (
            <div key={segment.id} className="relative group">
              <p className={cn(
                "font-mono text-[15px] leading-[1.9] antialiased transition-colors duration-700 outline-none",
                segment.status === 'raw' && "text-brand-dark",
                segment.status === 'processing' && "text-amber-600/50",
                segment.status === 'completed' && "text-indigo-900/70"
              )}
              contentEditable
              suppressContentEditableWarning
              >
                {segment.content}
                {segment.status === 'raw' && (
                  <span className="inline-block w-0.5 h-4 bg-brand-blue ml-1 animate-pulse align-middle" />
                )}
                {segment.status === 'raw' && (
                  <span className="text-brand-dark/20 font-mono pointer-events-none">
                    {" "}but the book seemed to breathe...
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Preprocessing Insights (Margin) */}
        <div className="space-y-12 pt-1 border-l border-brand-border/30 pl-8">
          {segments.map((segment) => (
            <div key={`insight-${segment.id}`} className="min-h-[1.9em] flex flex-col justify-start">
              {segment.status === 'completed' ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-700">
                  {/* Summary */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand-dark/20 uppercase tracking-widest">Summary</span>
                    <p className="text-[11px] font-medium leading-relaxed text-brand-dark/40 italic font-sans">
                      {segment.summary}
                    </p>
                  </div>
                  
                  {/* Entities */}
                  <div className="flex flex-wrap gap-1.5">
                    {segment.entities?.map(entity => (
                      <Badge 
                        key={entity} 
                        variant="secondary" 
                        className="bg-indigo-50/50 text-indigo-900/40 border-none text-[9px] font-bold px-2 py-0 h-4 rounded-sm uppercase tracking-tighter"
                      >
                        {entity}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : segment.status === 'processing' ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="size-1 bg-amber-500/40 rounded-full animate-bounce" />
                  <span className="text-[9px] font-bold text-amber-600/30 uppercase tracking-widest italic">Analyzing...</span>
                </div>
              ) : (
                <div className="h-4" /> // Spacer for raw/empty segments
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
