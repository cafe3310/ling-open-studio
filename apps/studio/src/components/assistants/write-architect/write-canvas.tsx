"use client";

import React, { useRef, useEffect } from "react";
import { useWriteStore, TextSegment } from "./store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const WriteCanvas = () => {
  const { 
    segments, activeSegmentId, setActiveSegment, splitSegment, 
    updateSegment, metadata, knowledgeBase, upsertEntry, setInspirations,
    inspirations, activeInspirationIds
  } = useWriteStore();
  
  return (
    <main className="flex-1 bg-white relative overflow-y-auto">
      <div className="max-w-[1200px] mx-auto min-h-full py-24 px-12 lg:px-20 grid grid-cols-[1fr_280px] gap-16">
        {/* Left Column: Editor Canvas */}
        <div className="space-y-1">
          {segments.map((segment) => (
            <SegmentEditor 
              key={segment.id} 
              segment={segment} 
              isActive={activeSegmentId === segment.id}
              knowledgeBase={knowledgeBase}
              upsertEntry={upsertEntry}
              setInspirations={setInspirations}
              inspirations={inspirations}
              activeInspirationIds={activeInspirationIds}
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

const SegmentEditor = ({ 
  segment, isActive, knowledgeBase, upsertEntry, setInspirations,
  inspirations, activeInspirationIds
}: { 
  segment: TextSegment; 
  isActive: boolean;
  knowledgeBase: any;
  upsertEntry: (e: any) => void;
  setInspirations: (ins: any[]) => void;
  inspirations: any[];
  activeInspirationIds: string[];
}) => {
  const { 
    segments, setActiveSegment, splitSegment, updateSegment, deleteSegment, 
    runtime, setGhostText, setPredicting, metadata 
  } = useWriteStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const predictTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const triggerPrediction = async (content: string) => {
    if (content.trim().length < 5) return;
    
    setPredicting(true);
    setGhostText(null);
    useWriteStore.getState().updateGraphStatus('PhantomWeaver', { status: 'running' });

    // Get active inspirations content
    const activeInspContent = inspirations
      .filter(i => activeInspirationIds.includes(i.id))
      .map(i => i.content)
      .join("; ");

    try {
      const response = await fetch("/api/chat/write/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefixContext: content,
          storySummary: metadata.summary,
          activeInspirationContent: activeInspContent
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (isActive) { // Only set if we are still on the same segment
          setGhostText(result.ghostText);
          useWriteStore.getState().updateGraphStatus('PhantomWeaver', { 
            status: 'success', 
            lastResult: result.ghostText 
          });
        }
      }
    } catch (error) {
      console.error("Failed to predict:", error);
      useWriteStore.getState().updateGraphStatus('PhantomWeaver', { status: 'error' });
    } finally {
      setPredicting(false);
    }
  };

  const triggerPreprocessing = async () => {
    if (segment.content.trim() === "") return;
    
    // Only precompute if it's not already completed/processing
    if (segment.status === "raw") {
      updateSegment(segment.id, { status: "processing" });
      
      const { updateGraphStatus } = useWriteStore.getState();
      updateGraphStatus('SegmentPreprocessor', { status: 'running' });
      updateGraphStatus('LoreKeeper', { status: 'running' });
      updateGraphStatus('MuseWhisper', { status: 'running' });

      // Get all existing names to avoid duplicates
      const existingNames = [
        ...knowledgeBase.worldSettings.map((e: any) => e.name),
        ...knowledgeBase.characters.map((e: any) => e.name),
        ...knowledgeBase.concepts.map((e: any) => e.name),
      ];

      // Collect history summaries for the Muse
      const historySummaries = segments
        .filter(s => s.status === "completed" && s.preprocessed?.summary)
        .map(s => s.preprocessed!.summary)
        .join(" ");

      try {
        const response = await fetch("/api/chat/write/precompute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            segmentId: segment.id,
            content: segment.content,
            storySummary: metadata.summary,
            historySummaries: historySummaries,
            existingEntityNames: existingNames,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Update segment state
          updateSegment(segment.id, {
            status: "completed",
            preprocessed: {
              summary: result.summary,
              extractedEntities: result.extractedEntities,
            }
          });

          // Update Monitor
          updateGraphStatus('SegmentPreprocessor', { status: 'success', lastResult: result.summary });
          updateGraphStatus('LoreKeeper', { status: 'success' });
          updateGraphStatus('MuseWhisper', { status: 'success' });

          // Inject new entries discovered by AI
          if (result.newEntries && result.newEntries.length > 0) {
            result.newEntries.forEach((entry: any) => {
              upsertEntry({
                ...entry,
                type: 'auto',
                isApproved: false,
                lastDetectedAt: Date.now()
              });
            });
          }

          // Update inspirations with unique IDs
          if (result.inspirations) {
            const sanitizedInspirations = result.inspirations.map((ins: any) => ({
              ...ins,
              id: ins.id || uuidv4()
            }));
            setInspirations(sanitizedInspirations);
          }
        } else {
          updateSegment(segment.id, { status: "raw" }); // Rollback on error
          updateGraphStatus('SegmentPreprocessor', { status: 'error' });
          updateGraphStatus('LoreKeeper', { status: 'error' });
          updateGraphStatus('MuseWhisper', { status: 'error' });
        }
      } catch (error) {
        console.error("Failed to precompute segment:", error);
        updateSegment(segment.id, { status: "raw" }); // Rollback on error
        updateGraphStatus('SegmentPreprocessor', { status: 'error' });
        updateGraphStatus('LoreKeeper', { status: 'error' });
        updateGraphStatus('MuseWhisper', { status: 'error' });
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
      setGhostText(null);
    } else if (e.key === "Tab" && runtime.ghostText) {
      e.preventDefault();
      
      // Smart merging: find overlap between segment end and ghost start
      const currentContent = segment.content.trimEnd();
      const ghost = runtime.ghostText.trimStart();
      
      // Simple overlap detection (last 10 chars vs start of ghost)
      let mergedContent = segment.content;
      let overlapFound = false;
      
      for (let len = Math.min(currentContent.length, ghost.length, 20); len > 0; len--) {
        const tail = currentContent.slice(-len);
        if (ghost.startsWith(tail)) {
          mergedContent = currentContent + ghost.slice(len);
          overlapFound = true;
          break;
        }
      }

      if (!overlapFound) {
        mergedContent = segment.content + (segment.content.endsWith(" ") ? "" : " ") + runtime.ghostText;
      }

      updateSegment(segment.id, { content: mergedContent });
      setGhostText(null);
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

    // Clear ghost text on change
    setGhostText(null);

    // Debounce prediction (500ms) - only if cursor is likely at the end
    if (predictTimerRef.current) clearTimeout(predictTimerRef.current);
    predictTimerRef.current = setTimeout(() => {
      if (isActive) {
        triggerPrediction(newContent);
      }
    }, 500);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    
    if (start !== end) {
      useWriteStore.getState().setSelection({
        segmentId: segment.id,
        text: segment.content.substring(start, end),
        start,
        end
      });
    } else {
      useWriteStore.getState().setSelection(null);
    }
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
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        onFocus={() => setActiveSegment(segment.id)}
        onBlur={() => {
          // Note: Don't unset activeSegment here to keep the highlight during preprocessing
          triggerPreprocessing();
          setGhostText(null);
          setPredicting(false);
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
      {isActive && (runtime.isPredicting || runtime.ghostText) && (
        <div className="mt-2 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {runtime.isPredicting ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse fill-amber-500/20" />
              <span className="text-[10px] font-mono font-bold text-amber-600/40 uppercase tracking-widest italic">
                ...Predicting
              </span>
            </div>
          ) : runtime.ghostText ? (
            <div className="flex items-center gap-3 group/ghost">
              <span className="text-[12px] font-mono text-brand-dark/30 italic leading-relaxed">
                "{runtime.ghostText}"
              </span>
              <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-brand-blue/5 border border-brand-blue/10 rounded text-[9px] font-bold text-brand-blue/60 uppercase tracking-tight">
                Press Tab to Accept
              </div>
            </div>
          ) : null}
        </div>
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
