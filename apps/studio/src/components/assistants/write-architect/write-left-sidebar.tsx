"use client";

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles, BookOpen, Globe, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WriteLeftSidebar = () => {
  const [summary, setSummary] = useState("A young archivist discovers a book that writes history before it happens.");

  return (
    <aside className="w-72 border-r border-brand-border bg-brand-bg flex flex-col h-full overflow-hidden">
      <div className="p-8 flex flex-col h-full space-y-10 overflow-y-auto">
        {/* Title Section */}
        <div>
          <h1 className="font-serif italic text-3xl text-brand-dark leading-tight tracking-tight">
            The Ink of Tomorrow
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
              Summary
            </h3>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <div className="group relative cursor-pointer p-4 bg-white border border-brand-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all">
                <p className="text-[13px] text-brand-dark/80 leading-relaxed font-sans line-clamp-4 italic">
                  "{summary}"
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
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
                  Provide a brief summary or a detailed plot outline. This helps the AI maintain consistency across chapters.
                </p>
                <Textarea 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[300px] font-mono text-sm bg-brand-bg/30 border-brand-border focus-visible:ring-brand-blue/30"
                  placeholder="Type your story outline here..."
                />
                <div className="flex justify-end">
                  <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-widest px-6">
                    Update Context
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Knowledge Base Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Knowledge Base
            </h3>
            <Button variant="ghost" size="icon" className="size-6 text-brand-dark/30 hover:text-brand-blue hover:bg-brand-blue/5">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-8">
            {/* World Settings */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-brand-dark/40">World Settings</div>
              <div className="flex flex-wrap gap-2">
                <EntryDialog 
                  title="Victorian" 
                  initialContent="Set in a late 19th-century aesthetic with cobblestone streets and gaslight."
                  suggestions={["Steam-powered carriages", "Strict social etiquette", "Heavy fog"]}
                >
                  <Badge variant="outline" className="rounded-md border-brand-border bg-white text-brand-dark/70 px-3 py-1 text-[11px] font-medium hover:border-brand-blue/30 cursor-pointer transition-colors">Victorian</Badge>
                </EntryDialog>
                
                <EntryDialog 
                  title="Low Magic" 
                  initialContent="Magic is rare, forgotten, and often viewed with superstition or fear."
                  suggestions={["Ritual-based", "Costly components", "Hidden artifacts"]}
                >
                  <Badge variant="outline" className="rounded-md border-brand-border bg-white text-brand-dark/70 px-3 py-1 text-[11px] font-medium hover:border-brand-blue/30 cursor-pointer transition-colors">Low Magic</Badge>
                </EntryDialog>
              </div>
            </div>

            {/* Key Concepts */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-brand-dark/40">Key Concepts</div>
              <div className="flex flex-wrap gap-2">
                <EntryDialog 
                  title="The Unwritten Book" 
                  initialContent="An artifact that reveals future events by appearing as blank pages until blood is spilled."
                  suggestions={["Bound in human skin", "Whispers to the owner", "Indestructible"]}
                >
                  <Badge variant="outline" className="rounded-md border-brand-border bg-white text-brand-dark/70 px-3 py-1 text-[11px] font-medium hover:border-brand-blue/30 cursor-pointer transition-colors">The Unwritten Book</Badge>
                </EntryDialog>

                <EntryDialog 
                  title="Blood Ink" 
                  type="auto"
                  initialContent="A rumored substance that makes prophecies permanent."
                  suggestions={["Requires sacrifice", "Tarnishes the soul"]}
                >
                  <Badge variant="outline" className="rounded-md border-brand-blue/10 bg-brand-blue/[0.02] text-brand-blue/60 px-3 py-1 text-[11px] font-medium border-dashed flex items-center gap-1.5 cursor-pointer hover:bg-brand-blue/[0.05] transition-all">
                    <Sparkles className="w-3 h-3" />
                    Blood Ink?
                  </Badge>
                </EntryDialog>
              </div>
            </div>

            {/* Characters */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-brand-dark/40">Characters</div>
              <ul className="space-y-2">
                <CharacterItem name="Elara" type="manual" content="A young, curious archivist with a photographic memory." suggestions={["Wears brass spectacles", "Fear of the dark"]} />
                <CharacterItem name="Sir Arthur" type="manual" content="A disgraced knight seeking redemption." suggestions={["Scarred left eye", "Carries a broken blade"]} />
                <CharacterItem name="The Shadow Binder" type="auto" content="A mysterious figure lurking in the library's restricted section." suggestions={["Cloak of living smoke", "Voice like grinding stone"]} />
              </ul>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

const EntryDialog = ({ title, initialContent, suggestions, children, type = "manual" }: { title: string, initialContent: string, suggestions: string[], children: React.ReactNode, type?: "manual" | "auto" }) => {
  const [content, setContent] = useState(initialContent);
  const [isAuto, setIsAuto] = useState(type === "auto");

  const addSuggestion = (s: string) => {
    setContent(prev => prev + (prev.endsWith('.') ? ' ' : '. ') + s + '.');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[750px] bg-white border-brand-border overflow-hidden p-0">
        <div className="flex h-[500px]">
          {/* Left Side: Editor */}
          <div className="flex-1 p-6 flex flex-col space-y-4 border-r border-brand-border">
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle className="font-serif text-xl flex items-center gap-3">
                {title}
                {isAuto && <Badge className="bg-brand-blue/10 text-brand-blue text-[9px] font-bold border-none uppercase">Auto-detected</Badge>}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 flex flex-col space-y-2">
               <label className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">Definition</label>
               <Textarea 
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 className="flex-1 font-mono text-[13px] leading-relaxed bg-brand-bg/20 border-brand-border p-4 resize-none focus-visible:ring-brand-blue/20"
                 placeholder={`Describe ${title.toLowerCase()}...`}
               />
            </div>
            <div className="flex justify-between items-center pt-2">
              {isAuto ? (
                <Button 
                  onClick={() => setIsAuto(false)}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-widest px-6 gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve Entry
                </Button>
              ) : (
                <Button className="bg-brand-dark text-white font-bold text-xs uppercase tracking-widest px-6">
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          {/* Right Side: AI Insights */}
          <div className="w-64 bg-brand-bg/50 p-6 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/40 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              AI Suggestions
            </h3>
            <div className="space-y-3">
              {suggestions.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => addSuggestion(s)}
                  className="p-3 bg-white border border-brand-border/40 rounded-xl text-[11px] text-brand-dark/70 italic leading-relaxed cursor-pointer hover:border-brand-blue/30 hover:text-brand-blue transition-all group relative"
                >
                  "{s}"
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
              ))}
              {isAuto && (
                 <div className="pt-4 p-4 border border-dashed border-brand-blue/20 rounded-xl bg-brand-blue/[0.02]">
                    <p className="text-[10px] text-brand-blue/60 font-medium leading-relaxed italic">
                      Approve this entry to unlock more detailed AI character traits and plot connections.
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

const CharacterItem = ({ name, type, content, suggestions }: { name: string, type: "manual" | "auto", content: string, suggestions: string[] }) => {
  return (
    <EntryDialog title={name} type={type} initialContent={content} suggestions={suggestions}>
      <li className={cn(
        "flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer group",
        type === 'manual' 
          ? "bg-white border-brand-border/50 hover:border-brand-blue/30" 
          : "bg-transparent border-dashed border-brand-border/80 hover:bg-brand-blue/[0.02] hover:border-brand-blue/20"
      )}>
        <div className="flex items-center gap-3 text-[12px] font-medium font-sans">
          <span className={cn(
            "size-1.5 rounded-full",
            type === 'manual' ? "bg-brand-blue shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "bg-brand-dark/20"
          )} />
          <span className={type === 'auto' ? "text-brand-dark/40 italic" : "text-brand-dark/80"}>
            {name}
          </span>
        </div>
        {type === 'auto' && (
          <Button variant="ghost" size="icon" className="size-5 opacity-0 group-hover:opacity-100 text-brand-blue hover:bg-brand-blue/10 rounded-full transition-all">
            <Plus className="w-3 h-3" />
          </Button>
        )}
      </li>
    </EntryDialog>
  );
};
