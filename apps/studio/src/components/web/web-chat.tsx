"use client";

import React from 'react';
import { Thread } from "@/components/assistants/web-architect/thread";
import { Sparkles, Terminal } from 'lucide-react';

const WEB_SUGGESTIONS = [
  {
    title: "Startup Landing Page",
    label: "with hero and features",
    prompt: "Create a modern landing page for a tech startup. Include a hero section with a call to action and a features grid.",
  },
  {
    title: "Coffee Shop Website",
    label: "warm and inviting style",
    prompt: "Generate a beautiful website for a local coffee shop called 'Bean & Leaf'. Use a warm color palette and include a menu section.",
  },
  {
    title: "Personal Portfolio",
    label: "minimalist dark theme",
    prompt: "Build a minimalist personal portfolio website with a dark theme. Include sections for projects, skills, and a contact form.",
  },
  {
    title: "E-commerce Product Page",
    label: "clean and functional",
    prompt: "Design a clean product detail page for an e-commerce site. Include an image gallery, price, and add-to-cart button.",
  },
];

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
        <Thread suggestions={WEB_SUGGESTIONS} />
      </div>
    </aside>
  );
};