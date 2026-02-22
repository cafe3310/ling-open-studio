"use client";

import React, { useRef, useEffect } from "react";
import { useWriteStore, TextSegment } from "./store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const WriteCanvas = () => {
  const { segments, activeSegmentId, setActiveSegment, splitSegment, updateSegment } = useWriteStore();
  
  return (
    <main className="flex-1 bg-white relative overflow-y-auto">
      {/* Action Indicators (Top Right) */}
      <div className="fixed top-20 right-8 z-30">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur border border-brand-border/50 rounded-full shadow-sm">
          <div className="size-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-brand-dark/40 uppercase tracking-widest">
            Preprocessing... (Dev Placeholder)
          </span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto min-h-full py-24 px-12 lg:px-20 grid grid-cols-[1fr_280px] gap-16">
        {/* Left Column: Editor Canvas */}
        <div className="space-y-1">
          {segments.map((segment) => (
            <SegmentEditor 
              key={segment.id} 
              segment={segment} 
              isActive={activeSegmentId === segment.id}
            />
          ))}
        </div>

        {/* Right Column: Preprocessing Insights (Margin) */}
        <div className="space-y-1 pt-1 border-l border-brand-border/30 pl-8">
          {segments.map((segment) => (
            <InsightMargin key={`insight-${segment.id}`} segment={segment} isActive={activeSegmentId === segment.id} />
          ))}
        </div>
      </div>
    </main>
  );
};

const SegmentEditor = ({ segment, isActive }: { segment: TextSegment; isActive: boolean }) => {
  const { segments, setActiveSegment, splitSegment, updateSegment, deleteSegment } = useWriteStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [segment.content]);

  // Focus management
  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  const triggerPreprocessing = async () => {
    if (segment.content.trim() === "") return;
    
    // Only precompute if it's not already completed/processing
    if (segment.status === "raw") {
      updateSegment(segment.id, { status: "processing" });
      
      try {
        const response = await fetch("/api/chat/write/precompute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            segmentId: segment.id,
            content: segment.content,
            storySummary: useWriteStore.getState().metadata.summary,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          updateSegment(segment.id, {
            status: "completed",
            preprocessed: {
              summary: result.summary,
              extractedEntities: result.extractedEntities,
            }
          });
        } else {
          updateSegment(segment.id, { status: "raw" }); // Rollback on error
        }
      } catch (error) {
        console.error("Failed to precompute segment:", error);
        updateSegment(segment.id, { status: "raw" }); // Rollback on error
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const cursorPosition = e.currentTarget.selectionStart;
    const isAtStart = cursorPosition === 0;
    const isAtEnd = cursorPosition === segment.content.length;
    
    const currentIndex = segments.findIndex(s => s.id === segment.id);
    const prevSegment = segments[currentIndex - 1];
    const nextSegment = segments[currentIndex + 1];

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const contentBefore = segment.content.substring(0, cursorPosition);
      const contentAfter = segment.content.substring(cursorPosition);
      
      splitSegment(segment.id, contentBefore, contentAfter);
      triggerPreprocessing();
    } else if (e.key === "Backspace" && segment.content === "") {
      if (segments.length > 1) {
        e.preventDefault();
        const focusTarget = prevSegment || nextSegment;
        deleteSegment(segment.id);
        if (focusTarget) setActiveSegment(focusTarget.id);
      }
    } else if (e.key === "ArrowUp") {
      if (prevSegment) {
        e.preventDefault();
        setActiveSegment(prevSegment.id);
      }
    } else if (e.key === "ArrowDown") {
      if (nextSegment) {
        e.preventDefault();
        setActiveSegment(nextSegment.id);
      }
    } else if (e.key === "ArrowLeft" && isAtStart) {
      if (prevSegment) {
        e.preventDefault();
        setActiveSegment(prevSegment.id);
      }
    } else if (e.key === "ArrowRight" && isAtEnd) {
      if (nextSegment) {
        e.preventDefault();
        setActiveSegment(nextSegment.id);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    updateSegment(segment.id, { content: newContent, status: "raw" });

    // Debounce preprocessing (2s)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      triggerPreprocessing();
    }, 2000);
  };

  return (
    <div 
      onClick={() => setActiveSegment(segment.id)}
      className={cn(
        "relative group px-2 py-1 rounded-sm transition-all duration-200 cursor-text",
        isActive ? "bg-brand-blue/[0.03] ring-1 ring-brand-blue/5 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.05)]" : "hover:bg-brand-dark/[0.01]"
      )}
    >
      <textarea
        ref={textareaRef}
        value={segment.content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setActiveSegment(segment.id)}
        onBlur={() => {
          // Note: Don't unset activeSegment here to keep the highlight during preprocessing
          triggerPreprocessing();
        }}
        className={cn(
          "w-full resize-none overflow-hidden bg-transparent border-none focus:ring-0 p-0 font-mono text-[15px] leading-[1.9] antialiased transition-colors duration-700 outline-none block h-auto",
          segment.status === 'raw' && "text-brand-dark",
          segment.status === 'processing' && "text-amber-600/50",
          segment.status === 'completed' && "text-indigo-900/70"
        )}
        placeholder={(isActive || (segments.length === 1 && segment.content === "")) ? "Once upon a time..." : ""}
        rows={1}
      />
      {segment.status === 'raw' && isActive && (
        <span className="absolute bottom-1 right-2 text-[10px] text-brand-dark/10 font-mono pointer-events-none">
          {/* TODO: Placeholder for Ghost Text (PhantomWeaver) */}
          暂时未开发: Ghost Text
        </span>
      )}
    </div>
  );
};

const InsightMargin = ({ segment, isActive }: { segment: TextSegment; isActive: boolean }) => {
  return (
    <div className={cn(
      "flex flex-col justify-start px-2 py-1 rounded-sm transition-all duration-200 min-h-[1.9em]",
      isActive && "bg-brand-blue/[0.03]"
    )}>
      {segment.status === 'completed' ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-700">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-brand-dark/20 uppercase tracking-widest">Summary</span>
            <p className="text-[11px] font-medium leading-relaxed text-brand-dark/40 italic font-sans">
              {segment.preprocessed?.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {segment.preprocessed?.extractedEntities.map(entity => (
              <Badge 
                key={entity} 
                variant="secondary" 
                className="bg-indigo-50/50 text-indigo-900/40 border-none text-[9px] font-bold px-2 py-0 h-4 rounded-sm uppercase tracking-tighter"
              >
                {entity}
              </Badge>
            ))}
          </div>
        </div>
      ) : segment.status === 'processing' ? (
        <div className="flex items-center gap-2 py-2">
          <div className="size-1 bg-amber-500/40 rounded-full animate-bounce" />
          <span className="text-[9px] font-bold text-amber-600/30 uppercase tracking-widest italic">Analyzing...</span>
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );
};
