"use client";

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Globe, Plus } from "lucide-react";
import { useWriteStore } from './store';
import { cn } from "@/lib/utils";

export const WriteLeftSidebar = () => {
  const { metadata, updateMetadata } = useWriteStore();
  const [localSummary, setLocalSummary] = useState(metadata.summary);

  const handleUpdateSummary = () => {
    updateMetadata({ summary: localSummary });
  };

  return (
    <aside className="w-72 border-r border-brand-border bg-brand-bg flex flex-col h-full overflow-hidden shrink-0">
      <div className="p-8 flex flex-col h-full space-y-10 overflow-y-auto">
        {/* Title Section */}
        <div>
          <h1 className="font-serif italic text-3xl text-brand-dark leading-tight tracking-tight">
            {metadata.title}
          </h1>
          <p className="mt-2 text-[10px] font-medium text-brand-dark/40 font-sans uppercase tracking-wider">
            Powered by Ling Series Models
          </p>
        </div>

        {/* SUMMARY Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
              <BookOpen className="w-3 h-3" />
              Summary & Outline
            </h3>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <div className="group relative cursor-pointer p-4 bg-white border border-brand-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all min-h-[100px] flex flex-col">
                <p className={cn(
                  "text-[13px] leading-relaxed font-sans line-clamp-6 italic transition-colors",
                  metadata.summary ? "text-brand-dark/80" : "text-brand-dark/30"
                )}>
                  {metadata.summary ? `"${metadata.summary}"` : "Click to add story summary..."}
                </p>
                <div className="mt-auto pt-3 flex items-center gap-1.5 text-[10px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-3 h-3" />
                  EDIT OUTLINE
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white border-brand-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Story Summary & Outline</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-[12px] text-brand-dark/50 font-sans">
                  Provide a brief summary or a detailed plot outline. This helps the AI maintain consistency across segments.
                </p>
                <Textarea 
                  value={localSummary}
                  onChange={(e) => setLocalSummary(e.target.value)}
                  className="min-h-[300px] font-mono text-sm bg-brand-bg/30 border-brand-border focus-visible:ring-brand-blue/30 p-4 leading-relaxed"
                  placeholder="Type your story outline here..."
                />
                <div className="flex justify-end gap-3">
                  <DialogTrigger asChild>
                    <Button 
                      onClick={handleUpdateSummary}
                      className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-widest px-6"
                    >
                      Update Context
                    </Button>
                  </DialogTrigger>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Knowledge Base Section - Placeholder for now */}
        <section className="space-y-6">
          <div className="flex items-center justify-between opacity-50">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Knowledge Base
            </h3>
          </div>
          <div className="p-4 border border-dashed border-brand-border rounded-xl flex items-center justify-center text-center">
            <span className="text-[10px] font-bold text-brand-dark/20 uppercase tracking-[0.2em] italic">
              暂时未开发: Knowledge Base
            </span>
          </div>
        </section>
      </div>
    </aside>
  );
};
