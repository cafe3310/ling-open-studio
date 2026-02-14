"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const WriteCanvas = () => {
  const [content, setContent] = useState(
    `The rain had not stopped for three days. It drummed against the stained glass windows of the library, a rhythmic accompaniment to the silence that filled the room.\n\n` +
    `Elara traced the spine of the ancient tome. "They say the ink never dries," she whispered, though there was no one to hear her. The candle flickered, casting long, dancing shadows against the shelves.\n\n` +
    `"You shouldn't be reading that," a voice echoed from the dark corner.`
  );

  const ghostText = " She turned slowly, her heart pounding against her ribs as she searched for the speaker in the gloom...";

  return (
    <main className="flex-1 bg-white relative overflow-y-auto font-mono">
      <div className="max-w-[800px] mx-auto py-24 px-12 lg:px-20">
        <div className="relative group cursor-text min-h-[50vh]">
          {/* Main Text Content */}
          <div className="text-[15px] leading-[1.8] text-brand-dark/90 whitespace-pre-wrap antialiased">
            {content}
            {/* Ghost Text */}
            <span 
              className="text-brand-dark/20 cursor-pointer hover:text-brand-blue/40 transition-colors inline italic"
              title="Click to accept suggestion"
              onClick={() => {
                setContent(prev => prev + ghostText);
              }}
            >
              {ghostText}
            </span>
            {/* Caret Blinker */}
            <span className="inline-block w-1.5 h-5 bg-brand-blue ml-0.5 align-middle animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
};
