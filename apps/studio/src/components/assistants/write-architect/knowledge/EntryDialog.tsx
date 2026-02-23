"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, Plus, Trash2 } from "lucide-react";
import { KnowledgeEntry, useWriteStore } from "../store";

interface EntryDialogProps {
  entry: KnowledgeEntry;
  children: React.ReactNode;
}

export const EntryDialog = ({ entry, children }: EntryDialogProps) => {
  const { approveEntry, upsertEntry, deleteEntry } = useWriteStore();
  const [definition, setDefinition] = useState(entry.definition);
  const [isOpen, setIsOpen] = useState(false);

  // Sync local state when entry changes
  useEffect(() => {
    setDefinition(entry.definition);
  }, [entry.definition]);

  const handleSave = () => {
    upsertEntry({ ...entry, definition });
    setIsOpen(false);
  };

  const handleApprove = () => {
    approveEntry(entry.id, entry.category);
  };

  const addSuggestion = (suggestion: string) => {
    setDefinition((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return suggestion + ".";
      const separator = trimmed.endsWith(".") || trimmed.endsWith("!") || trimmed.endsWith("?") ? " " : ". ";
      return trimmed + separator + suggestion + ".";
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[750px] bg-white border-brand-border overflow-hidden p-0 gap-0">
        <div className="flex h-[500px]">
          {/* Left Side: Editor */}
          <div className="flex-1 p-6 flex flex-col space-y-4 border-r border-brand-border">
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle className="font-serif text-xl flex items-center gap-3">
                {entry.name}
                {!entry.isApproved && (
                  <Badge className="bg-brand-blue/10 text-brand-blue text-[9px] font-bold border-none uppercase">
                    Auto-detected
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">
                Definition
              </label>
              <Textarea
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                className="flex-1 font-mono text-[13px] leading-relaxed bg-brand-bg/20 border-brand-border p-4 resize-none focus-visible:ring-brand-blue/20"
                placeholder={`Define ${entry.name.toLowerCase()}...`}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  deleteEntry(entry.id, entry.category);
                  setIsOpen(false);
                }}
                className="text-red-500/50 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="flex gap-3">
                {!entry.isApproved ? (
                  <Button
                    onClick={handleApprove}
                    className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-widest px-6 gap-2 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Entry
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="bg-brand-dark text-white hover:bg-brand-dark/90 font-bold text-xs uppercase tracking-widest px-6 shadow-sm"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: AI Insights */}
          <div className="w-64 bg-brand-bg/50 p-6 space-y-6 overflow-y-auto">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/40 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-brand-blue" />
              AI Suggestions
            </h3>
            <div className="space-y-3">
              {entry.suggestions.length > 0 ? (
                entry.suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => addSuggestion(s)}
                    className="p-3 bg-white border border-brand-border/40 rounded-xl text-[11px] text-brand-dark/70 italic leading-relaxed cursor-pointer hover:border-brand-blue/30 hover:text-brand-blue transition-all group relative shadow-sm"
                  >
                    "{s}"
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-brand-dark/30 italic">
                  No suggestions available for this entry yet.
                </p>
              )}
              
              {!entry.isApproved && (
                <div className="pt-4 p-4 border border-dashed border-brand-blue/20 rounded-xl bg-brand-blue/[0.02]">
                  <p className="text-[10px] text-brand-blue/60 font-medium leading-relaxed italic">
                    Approve this entry to unlock more detailed AI traits and plot connections.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
