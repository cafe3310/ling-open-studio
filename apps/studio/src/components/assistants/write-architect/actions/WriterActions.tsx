"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, PenTool, RotateCcw, Maximize2, Loader2 } from "lucide-react";
import { useWriteStore } from "../store";

export const WriterActions = () => {
  const { 
    metadata, segments, knowledgeBase, inspirations, 
    activeInspirationIds, runtime, selection, setGenerating, addSegment, 
    updateSegment, updateGraphStatus, setSelection
  } = useWriteStore();
  const { isGenerating } = runtime;

  const prepareContext = () => {
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

    return { historySummaries, recentText, approvedLore, activeInspirations };
  };

  const handleContinueWriting = async () => {
    if (isGenerating) return;
    setGenerating(true);
    updateGraphStatus('NarrativeFlow', { status: 'running', progress: 0 });

    const context = prepareContext();
    const newSegmentId = addSegment("");
    let fullContent = "";

    try {
      const response = await fetch("/api/chat/write/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "continue",
          storySummary: metadata.summary,
          ...context
        }),
      });

      if (!response.ok || !response.body) throw new Error("Failed to generate");
      await processStream(response.body, (text) => {
        fullContent += text;
        updateSegment(newSegmentId, { content: fullContent });
        updateGraphStatus('NarrativeFlow', { progress: fullContent.length });
      });
      updateGraphStatus('NarrativeFlow', { status: 'success', lastResult: 'New content generated.' });
    } catch (error) {
      console.error("Generation error:", error);
      updateGraphStatus('NarrativeFlow', { status: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectionAction = async (task: 'rewrite' | 'expand') => {
    if (isGenerating || !selection) return; 
    
    setGenerating(true);
    const graphName = task === 'rewrite' ? 'ContentRewriter' : 'NarrativeFlow'; // Placeholder for expand
    updateGraphStatus(graphName, { status: 'running', progress: 0 });

    const context = prepareContext();
    const targetSegment = segments.find(s => s.id === selection.segmentId);
    if (!targetSegment) return;

    let fullContent = "";
    const prefix = targetSegment.content.substring(0, selection.start);
    const suffix = targetSegment.content.substring(selection.end);

    try {
      const response = await fetch("/api/chat/write/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          selectedText: selection.text,
          storySummary: metadata.summary,
          ...context
        }),
      });

      if (!response.ok || !response.body) throw new Error("Failed to execute selection task");
      
      await processStream(response.body, (text) => {
        fullContent += text;
        // In-place update of the segment
        updateSegment(selection.segmentId, { content: prefix + fullContent + suffix });
        updateGraphStatus(graphName, { progress: fullContent.length });
      });

      updateGraphStatus(graphName, { status: 'success', lastResult: `${task} completed.` });
      // Clear selection after completion
      setSelection(null);
    } catch (error) {
      console.error(`${task} error:`, error);
      updateGraphStatus(graphName, { status: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const processStream = async (body: ReadableStream<Uint8Array>, onText: (text: string) => void) => {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onText(decoder.decode(value, { stream: true }));
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
          <Button 
            onClick={() => handleSelectionAction('rewrite')}
            disabled={isGenerating || !selection}
            variant="ghost" 
            className="h-10 text-[10px] font-bold text-brand-dark/40 border border-brand-border/40 hover:bg-white hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed gap-2 rounded-lg transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            REWRITE
          </Button>
          <Button 
            onClick={() => handleSelectionAction('expand')}
            disabled={isGenerating || !selection}
            variant="ghost" 
            className="h-10 text-[10px] font-bold text-brand-dark/40 border border-brand-border/40 hover:bg-white hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed gap-2 rounded-lg transition-all"
          >
            <Maximize2 className="w-3 h-3" />
            EXPAND
          </Button>
        </div>
        
        <p className="text-[9px] text-center text-brand-dark/20 font-medium uppercase tracking-tight">
          {selection ? `Selected: ${selection.text.length} chars` : "Select text on canvas for context-aware actions"}
        </p>
      </div>
    </section>
  );
};
