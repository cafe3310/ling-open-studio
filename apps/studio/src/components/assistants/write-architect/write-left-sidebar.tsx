"use client";

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PenLine, Settings2, Info, Plus, Check, UserPlus, BrainCircuit, Globe2, Sparkles } from "lucide-react";

interface Entry {
  id: string;
  name: string;
  content: string;
  isAuto?: boolean;
  aiSnippets?: string[]; // Granular findings available AFTER approval
  initialSnippet?: string; // The single definition to adopt for approval
}

const EntrySection = ({ 
  title, 
  icon: Icon, 
  entries, 
  onAdd, 
  onApprove,
  onUpdateContent
}: { 
  title: string; 
  icon: any; 
  entries: Entry[]; 
  onAdd: () => void;
  onApprove: (id: string) => void;
  onUpdateContent: (id: string, newContent: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between group/header">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
          <Icon className="w-3 h-3" />
          {title}
        </h3>
        <button 
          onClick={onAdd}
          className="opacity-0 group-hover/header:opacity-100 p-1 hover:bg-brand-blue/10 rounded text-brand-blue transition-all"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {entries.map(entry => (
          <Dialog key={entry.id}>
            <DialogTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "rounded-md border-brand-border cursor-pointer transition-all px-3 py-1 text-[11px] font-medium",
                  entry.isAuto 
                    ? "bg-white/20 text-brand-dark/30 border-dashed hover:border-brand-blue/30 hover:text-brand-blue/50 shadow-none" 
                    : "bg-white text-brand-dark/70 hover:border-brand-blue/50 hover:shadow-sm"
                )}
              >
                {entry.isAuto && <BrainCircuit className="w-2.5 h-2.5 mr-1.5 opacity-50" />}
                {entry.name}
              </Badge>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white border-brand-border p-8">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={cn("text-[10px] uppercase tracking-tighter font-bold", entry.isAuto ? "text-orange-500 border-orange-200" : "text-brand-blue border-brand-blue/20")}>
                    {entry.isAuto ? "New Discovery" : "Story Context Entry"}
                  </Badge>
                </div>
                <DialogTitle className="font-serif text-3xl italic text-brand-dark">{entry.name}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-8 grid grid-cols-5 gap-8">
                {/* LEFT: User Content */}
                <div className="col-span-3 space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
                    <PenLine className="w-3 h-3" />
                    Confirmed Definition
                  </label>
                  <div className="relative">
                    <Textarea 
                      value={entry.content}
                      onChange={(e) => onUpdateContent(entry.id, e.target.value)}
                      placeholder={entry.isAuto ? "Adopt the AI definition to start editing..." : "Describe this entry..."}
                      className="min-h-[240px] font-mono text-[13px] leading-relaxed border-brand-border/50 focus-visible:ring-brand-blue/20 p-4 bg-slate-50/30"
                    />
                    {entry.isAuto && !entry.content && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-[11px] text-brand-dark/20 uppercase tracking-widest font-bold">Unconfirmed Entry</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: AI Suggestions (Two-Stage) */}
                <div className="col-span-2 space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-blue/60 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    {entry.isAuto ? "Primary Discovery" : "AI Findings"}
                  </label>
                  
                  <div className="space-y-3">
                    {/* STAGE 1: The Initial Adoptable Definition */}
                    {entry.isAuto && entry.initialSnippet && (
                      <div 
                        onClick={() => {
                          onUpdateContent(entry.id, entry.initialSnippet!);
                          onApprove(entry.id);
                        }}
                        className="p-4 bg-brand-blue/5 border-2 border-brand-blue/30 rounded-xl text-[13px] text-brand-dark/80 font-serif italic cursor-pointer hover:bg-brand-blue/10 hover:border-brand-blue/50 transition-all shadow-sm group"
                      >
                        <p className="leading-relaxed mb-3">"{entry.initialSnippet}"</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue">
                          <Check className="w-3 h-3" />
                          ADOPT & APPROVE
                        </div>
                      </div>
                    )}

                    {/* STAGE 2: Secondary Findings (Hidden until approved) */}
                    {!entry.isAuto && entry.aiSnippets && entry.aiSnippets.length > 0 && (
                      entry.aiSnippets.map((snippet, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            const newContent = entry.content.trim() ? `${entry.content}\n${snippet}` : snippet;
                            onUpdateContent(entry.id, newContent);
                          }}
                          className="p-3 bg-brand-blue/[0.03] border border-brand-blue/10 rounded-lg text-[12px] text-brand-dark/70 italic font-serif cursor-pointer hover:bg-brand-blue/10 hover:border-brand-blue/30 transition-all group"
                        >
                          <p className="leading-relaxed">"{snippet}"</p>
                          <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-2.5 h-2.5" />
                            ADOPT SNIPPET
                          </div>
                        </div>
                      ))
                    )}

                    {!entry.isAuto && (!entry.aiSnippets || entry.aiSnippets.length === 0) && (
                      <div className="p-8 border border-dashed border-brand-border/50 rounded-lg flex flex-col items-center justify-center text-center">
                        <BrainCircuit className="size-6 text-brand-dark/10 mb-2" />
                        <p className="text-[10px] text-brand-dark/30">Analyzing text for further details...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center border-t pt-6">
                <Button variant="ghost" className="text-xs text-brand-dark/40 hover:text-red-500">
                  Discard
                </Button>
                <Button variant="outline" className="h-10 px-6 text-[11px] font-bold uppercase tracking-widest shadow-sm">
                  Done
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
        {entries.length === 0 && (
          <p className="text-[11px] text-brand-dark/20 italic font-sans py-1">No entries yet.</p>
        )}
      </div>
    </div>
  );
};

export const WriteLeftSidebar = () => {
  const [summary, setSummary] = useState("A young archivist discovers a book that writes history before it happens.");
  
  const [worldSettings, setWorldSettings] = useState<Entry[]>([
    { 
      id: 'w1', 
      name: 'Victorian', 
      content: 'Set in a late 19th-century inspired world with gaslight and cobblestones.',
      aiSnippets: ['Smells of coal smoke and rain.', 'Social hierarchy is strictly enforced.', 'Hidden steampunk technology.']
    },
    { 
      id: 'w2', 
      name: 'Low Magic', 
      content: '', 
      isAuto: true,
      initialSnippet: 'Magic is a rare, hidden, and dangerous force that requires significant personal sacrifice.',
      aiSnippets: ['Known as "The Static".', 'Causes physical scarring.']
    }
  ]);

  const [characters, setCharacters] = useState<Entry[]>([
    { 
      id: 'c1', 
      name: 'Elara', 
      content: 'The curious protagonist who works at the Royal Library.',
      aiSnippets: ['She has ink stains on her fingers.', 'Wears a heavy wool cloak.']
    },
    { 
      id: 'c2', 
      name: 'Sir Arthur', 
      content: '', 
      isAuto: true,
      initialSnippet: 'A disgraced knight who now guards the library archives with a heavy broadsword.',
      aiSnippets: ['Has a scar over his left eye.', 'Drinks only dark ale.']
    }
  ]);

  const [concepts, setConcepts] = useState<Entry[]>([
    { id: 'e1', name: 'The Eternal Ink', content: 'A mysterious substance that never dries and seems to move on the page.' }
  ]);

  const handleApprove = (list: Entry[], setList: any, id: string) => {
    setList(list.map(e => e.id === id ? { ...e, isAuto: false } : e));
  };

  const handleUpdateContent = (list: Entry[], setList: any, id: string, content: string) => {
    setList(list.map(e => e.id === id ? { ...e, content } : e));
  };

  return (
    <aside className="w-72 border-r border-brand-border bg-brand-bg flex flex-col h-full overflow-y-auto">
      <div className="p-8 space-y-10 pb-20">
        {/* Intro Section */}
        <div>
          <p className="text-[13px] font-sans font-medium text-brand-dark/60 leading-relaxed italic border-l-2 border-brand-blue pl-4 py-1">
            An advanced writing assistant powered by the <span className="text-brand-blue font-bold not-italic">Ling Family</span> LLMs of various sizes.
          </p>
        </div>

        {/* Summary with Modal */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30">Summary</h3>
          <Dialog>
            <DialogTrigger asChild>
              <div className="group cursor-pointer p-4 rounded-xl border border-transparent bg-white/40 hover:bg-white hover:border-brand-border/50 hover:shadow-sm transition-all">
                <p className="text-[13px] text-brand-dark/80 leading-relaxed font-sans line-clamp-3 group-hover:text-brand-dark transition-colors">
                  {summary}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-brand-blue uppercase tracking-widest">
                  <PenLine className="w-2.5 h-2.5" />
                  Edit Plot
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white border-brand-border p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-2xl italic text-brand-dark">Edit Story Summary & Plot</DialogTitle>
                <DialogDescription className="text-brand-dark/50 text-xs">
                  Provide context for the AI to understand your story direction.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Story Briefing
                  </label>
                  <Textarea 
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Describe your story here..."
                    className="min-h-[300px] font-mono text-[13px] leading-relaxed border-brand-border/50 focus-visible:ring-brand-blue/20 p-4"
                  />
                  <p className="text-[10px] text-brand-dark/30 italic">
                    Tip: You can provide a simple one-sentence hook or a detailed multi-paragraph plot outline. The AI will adapt to either.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-brand-blue hover:bg-brand-blue/90 h-9 px-6 text-xs font-bold uppercase tracking-widest">
                    Save Context
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* World Settings */}
        <EntrySection 
          title="World Settings" 
          icon={Globe2}
          entries={worldSettings}
          onAdd={() => {}}
          onApprove={(id) => handleApprove(worldSettings, setWorldSettings, id)}
          onUpdateContent={(id, content) => handleUpdateContent(worldSettings, setWorldSettings, id, content)}
        />

        {/* Concepts */}
        <EntrySection 
          title="Concepts" 
          icon={BrainCircuit}
          entries={concepts}
          onAdd={() => {}}
          onApprove={(id) => handleApprove(concepts, setConcepts, id)}
          onUpdateContent={(id, content) => handleUpdateContent(concepts, setConcepts, id, content)}
        />

        {/* Characters */}
        <EntrySection 
          title="Characters" 
          icon={UserPlus}
          entries={characters}
          onAdd={() => {}}
          onApprove={(id) => handleApprove(characters, setCharacters, id)}
          onUpdateContent={(id, content) => handleUpdateContent(characters, setCharacters, id, content)}
        />

        {/* Floating Context Guard - Just for visual flair */}
        <div className="pt-4 p-4 rounded-xl bg-brand-blue/[0.03] border border-brand-blue/10 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest">
            <Settings2 className="w-3 h-3" />
            Context Sync
          </div>
          <p className="text-[10px] text-brand-dark/40 leading-relaxed font-sans">
            AI is monitoring 3 characters and 2 world settings to maintain story consistency.
          </p>
        </div>
      </div>
    </aside>
  );
};
