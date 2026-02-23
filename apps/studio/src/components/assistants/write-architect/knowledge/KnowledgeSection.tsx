"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeEntry, EntryCategory, useWriteStore } from "../store";
import { KnowledgeItem } from "./KnowledgeItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface KnowledgeSectionProps {
  title: string;
  category: EntryCategory;
  entries: KnowledgeEntry[];
  icon: React.ReactNode;
}

export const KnowledgeSection = ({ title, category, entries, icon }: KnowledgeSectionProps) => {
  const { upsertEntry } = useWriteStore();
  const [newName, setNewName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    upsertEntry({
      name: newName.trim(),
      category,
      type: 'manual',
      isApproved: true,
      definition: "",
      suggestions: []
    });
    setNewName("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/40 flex items-center gap-2">
          {icon}
          {title}
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="size-6 text-brand-dark/30 hover:text-brand-blue hover:bg-brand-blue/5">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-white border-brand-border">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Add New {title}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter ${title.toLowerCase()} name...`}
                className="font-sans border-brand-border focus-visible:ring-brand-blue/30"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-widest px-6"
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-2">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <KnowledgeItem key={entry.id} entry={entry} />
          ))
        ) : (
          <li className="text-[11px] text-brand-dark/20 italic p-2 border border-dashed border-brand-border/40 rounded-lg">
            No entries yet.
          </li>
        )}
      </ul>
    </div>
  );
};
