"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, PenTool, RotateCcw, Maximize2, Loader2 } from "lucide-react";
import { useWriteStore } from "../store";
import { readDataStream } from "@assistant-ui/react-ai-sdk";

export const WriterActions = () => {
  const { 
    metadata, segments, knowledgeBase, inspirations, 
    activeInspirationIds, runtime, setGenerating, addSegment, 
    updateSegment, updateGraphStatus 
  } = useWriteStore();
  const { isGenerating } = runtime;

  const handleContinueWriting = async () => {
    if (isGenerating) return;

    setGenerating(true);
    updateGraphStatus('NarrativeFlow', { status: 'running', progress: 0 });

    // 1. Prepare Context
    const historySummaries = segments
      .filter(s => s.status === "completed" && s.preprocessed?.summary)
      .map(s => s.preprocessed!.summary)
      .join(" ");
    
    const recentText = segments
      .slice(-2)
      .map(s => s.content)
      .join("\n\n");

    const approvedLore = [
      ...knowledgeBase.worldSettings,
      ...knowledgeBase.characters,
      ...knowledgeBase.concepts
    ]
      .filter(e => e.isApproved)
      .map(e => `${e.name}: ${e.definition}`)
      .join("\n");

    const activeInspirations = inspirations
      .filter(i => activeInspirationIds.includes(i.id))
      .map(i => i.content)
      .join("\n");

    // 2. Create new segment for streaming
    const newSegmentId = addSegment("");
    let fullContent = "";

    try {
      const response = await fetch("/api/chat/write/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storySummary: metadata.summary,
          historySummaries,
          recentText,
          activeLore: approvedLore,
          activeInspirations
        }),
      });

      if (!response.ok || !response.body) throw new Error("Failed to generate");

      // 3. Process Stream
      await readDataStream(response.body, {
        onText: (text) => {
          fullContent += text;
          updateSegment(newSegmentId, { content: fullContent });
          updateGraphStatus('NarrativeFlow', { progress: fullContent.length });
        },
      });

      updateGraphStatus('NarrativeFlow', { status: 'success', lastResult: 'New content generated.' });
    } catch (error) {
      console.error("Generation error:", error);
      updateGraphStatus('NarrativeFlow', { status: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="space-y-6">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 flex items-center gap-2">
        <PenTool className="w-3 h-3" />
        Writer Actions
      </h3>
      
      <div className="space-y-3">
        <Button 
          onClick={handleContinueWriting}
          disabled={isGenerating}
          className="w-full h-12 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-brand-blue/50 text-white font-bold text-xs uppercase tracking-widest gap-3 rounded-xl shadow-[0_4px_12px_rgba(59,130,246,0.15)] transition-all active:scale-[0.98]"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 fill-white" />
          )}
          {isGenerating ? "Generating..." : "Continue Writing"}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button disabled variant="ghost" className="h-10 text-[10px] font-bold text-brand-dark/40 border border-brand-border/40 hover:bg-white hover:text-brand-blue gap-2 rounded-lg transition-all opacity-50 cursor-not-allowed">
            <RotateCcw className="w-3 h-3" />
            REWRITE
          </Button>
          <Button disabled variant="ghost" className="h-10 text-[10px] font-bold text-brand-dark/40 border border-brand-border/40 hover:bg-white hover:text-brand-blue gap-2 rounded-lg transition-all opacity-50 cursor-not-allowed">
            <Maximize2 className="w-3 h-3" />
            EXPAND
          </Button>
        </div>
        
        <p className="text-[9px] text-center text-brand-dark/20 font-medium uppercase tracking-tight">
          Select text on canvas for context-aware actions
        </p>
      </div>
    </section>
  );
};
