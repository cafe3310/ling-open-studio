import React from 'react';
import { MessageSquare, Code, PenTool, Layout, Box, HardDrive, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { APP_CONFIG } from "@/lib/config";

export type Tab = 'chat' | 'web' | 'write' | 'writeV2' | 'filesystem';

interface TopNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
  const allNavItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'chat', label: 'Model Chat', icon: MessageSquare },
    { id: 'web', label: 'Model Web', icon: Code },
    { id: 'write', label: 'Write (Ref)', icon: PenTool },
    { id: 'writeV2', label: 'Model Write', icon: PenTool },
    { id: 'filesystem', label: 'Agent Filesystem', icon: HardDrive },
  ];

  // Filter based on configuration
  const navItems = allNavItems.filter(item => APP_CONFIG.features.tabs[item.id]);

  return (
    <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-6 shrink-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-white">
          <Box className="w-5 h-5" />
        </div>
        <span className="font-serif font-bold text-lg tracking-tight text-brand-dark">Ling OpenStudio</span>
      </div>

      <nav className="flex items-center gap-1 bg-brand-bg p-1 rounded-lg border border-brand-border">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-all duration-200 font-medium",
              activeTab === item.id
                ? "bg-white text-brand-dark shadow-sm"
                : "text-brand-gray hover:text-brand-dark hover:bg-white/50"
            )}
          >
            <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-brand-blue" : "text-gray-400")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center">
        <a
          href="https://huggingface.co/inclusionAI"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-border bg-white hover:border-brand-blue/30 hover:bg-brand-blue/[0.02] transition-all duration-300"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brand-blue" />
          <span className="text-xs font-medium text-brand-gray group-hover:text-brand-dark transition-colors">
            Ling Series Models
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue opacity-40 group-hover:opacity-100 transition-opacity"></div>
        </a>
      </div>
    </header>
  );
}
