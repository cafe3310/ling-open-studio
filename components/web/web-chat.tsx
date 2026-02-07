"use client";

import React from 'react';
import { Thread } from "@/components/assistant-ui/thread";
import { Sparkles, Terminal } from 'lucide-react';

export const WebChat: React.FC = () => {
  return (
    <aside className="w-80 border-r border-brand-border bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-brand-border flex flex-col gap-2 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-brand-cyan" />
            Web Architect
          </h2>
          <div className="px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-[9px] font-bold text-brand-cyan uppercase tracking-tighter">
            Ready
          </div>
        </div>
        <p className="text-[10px] text-brand-gray font-medium italic">
          Describe what you want to build...
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative aui-compact">
        {/* We reuse the Thread component but inside a narrower container */}
        <style jsx global>{`
          .aui-compact .aui-thread-root {
            --thread-max-width: 100%;
          }
          .aui-compact .aui-thread-viewport {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .aui-compact .aui-thread-welcome-message h1 {
            font-size: 1.25rem;
          }
          .aui-compact .aui-thread-welcome-message p {
            font-size: 1rem;
          }
        `}</style>
        <Thread />
      </div>
    </aside>
  );
};
