"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const WriteCanvas = () => {
  return (
    <main className="flex-1 bg-white relative overflow-y-auto">
      <div className="max-w-[800px] mx-auto py-24 px-12 lg:px-20">
        <article className="prose prose-slate max-w-none">
          <p className="font-serif text-[20px] leading-[1.8] text-brand-dark/90 mb-10 antialiased">
            The rain had not stopped for three days. It drummed against the stained glass windows of the library, a rhythmic accompaniment to the silence that filled the room.
          </p>
          <p className="font-serif text-[20px] leading-[1.8] text-brand-dark/90 mb-10 antialiased">
            Elara traced the spine of the ancient tome. "They say the ink never dries," she whispered, though there was no one to hear her. The candle flickered, casting long, dancing shadows against the shelves.
          </p>
          <p className="font-serif text-[20px] leading-[1.8] text-brand-dark/90 mb-10 antialiased font-medium italic">
            "You shouldn't be reading that," a voice echoed from the dark corner.
          </p>
        </article>
      </div>

      {/* Floating AI Assist Action */}
      <div className="fixed bottom-10 right-[360px] z-20">
        <Button className="rounded-full h-12 px-8 gap-3 bg-brand-blue hover:bg-brand-blue/90 shadow-[0_8px_24px_rgba(59,130,246,0.3)] hover:scale-105 transition-all">
          <Sparkles className="w-4 h-4 fill-white" />
          <span className="font-bold text-xs uppercase tracking-widest">AI Assist</span>
        </Button>
      </div>
    </main>
  );
};
