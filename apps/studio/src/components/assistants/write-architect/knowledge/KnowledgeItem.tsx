"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus } from "lucide-react";
import { KnowledgeEntry } from "../store";
import { EntryDialog } from "./EntryDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface KnowledgeItemProps {
  entry: KnowledgeEntry;
}

export const KnowledgeItem = ({ entry }: KnowledgeItemProps) => {
  return (
    <EntryDialog entry={entry}>
      <li className={cn(
        "flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer group",
        entry.type === 'manual' 
          ? "bg-white border-brand-border/50 hover:border-brand-blue/30 shadow-sm" 
          : "bg-transparent border-dashed border-brand-border/80 hover:bg-brand-blue/[0.02] hover:border-brand-blue/20"
      )}>
        <div className="flex items-center gap-3 text-[12px] font-medium font-sans flex-1 overflow-hidden">
          <span className={cn(
            "size-1.5 rounded-full shrink-0",
            entry.type === 'manual' ? "bg-brand-blue shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "bg-brand-dark/20"
          )} />
          <span className={cn(
            "truncate",
            entry.type === 'auto' ? "text-brand-dark/40 italic" : "text-brand-dark/80"
          )}>
            {entry.name}
          </span>
          {entry.type === 'auto' && (
            <Sparkles className="w-3 h-3 text-brand-blue/40" />
          )}
        </div>
        
        {entry.type === 'auto' && (
          <div className="size-5 flex items-center justify-center text-brand-blue opacity-0 group-hover:opacity-100 transition-all rounded-full bg-brand-blue/10">
            <Plus className="w-3 h-3" />
          </div>
        )}
      </li>
    </EntryDialog>
  );
};
