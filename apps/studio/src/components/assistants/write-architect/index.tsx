"use client";

import React from "react";
import { WriteCanvas } from "./write-canvas";

export const WriteArchitectAssistantV2 = () => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-white relative">
      {/* Left Sidebar - Placeholder */}
      <aside className="w-72 border-r border-brand-border bg-brand-bg flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-8 flex flex-col h-full items-center justify-center text-center">
          <span className="text-[10px] font-bold text-brand-dark/20 uppercase tracking-[0.2em] italic">
            暂时未开发: Left Sidebar (Knowledge Base)
          </span>
        </div>
      </aside>

      {/* Middle Canvas */}
      <WriteCanvas />

      {/* Right Sidebar - Placeholder */}
      <aside className="w-80 border-l border-brand-border bg-brand-bg flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-8 flex flex-col h-full items-center justify-center text-center">
          <span className="text-[10px] font-bold text-brand-dark/20 uppercase tracking-[0.2em] italic">
            暂时未开发: Right Sidebar (Actions & Inspirations)
          </span>
        </div>
      </aside>
    </div>
  );
};
