"use client";

import React, { useState } from 'react';
import {
  ChevronDown,
  Activity,
  Database,
  Cpu,
  CheckCircle2,
  CircleDashed,
  Clock,
  Terminal,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWriteStore, GraphStatus } from "./store";

const GRAPH_LABELS: Record<string, string> = {
  'PhantomWeaver': '幻影编织者',
  'SegmentPreprocessor': '片段预处理器',
  'NarrativeFlow': '叙事流',
  'LoreKeeper': '知识守夜人',
  'MuseWhisper': '缪斯低语',
  'ContentRewriter': '改写与扩写',
};

export const WriteStatusViewer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { runtime } = useWriteStore();
  const { graphStates } = runtime;

  const components = [
    { name: 'VFS Connection', status: 'success' },
    { name: 'Editor Kernel', status: 'success' },
    { name: 'Context Engine', status: 'success' },
  ];

  return (
    <div className={cn(
      "fixed bottom-6 left-6 z-50 transition-all duration-300 ease-in-out border border-brand-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col",
      isExpanded ? "w-80 bg-white h-auto max-h-[500px]" : "w-12 h-12 bg-brand-dark hover:bg-brand-dark/90"
    )}>
      {/* Header / Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center shrink-0 transition-colors",
          isExpanded ? "h-12 px-4 border-b border-brand-border/30 bg-brand-bg/50" : "h-full justify-center text-white"
        )}
      >
        {isExpanded ? (
          <>
            <Activity className="w-4 h-4 text-brand-blue mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 flex-1 text-left">
              System Monitor
            </span>
            <ChevronDown className="w-4 h-4 text-brand-dark/30" />
          </>
        ) : (
          <Terminal className="w-5 h-5" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Components Status */}
          <section className="space-y-3">
            <h4 className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-[0.2em] flex items-center gap-2">
              <Database className="w-3 h-3" />
              Components
            </h4>
            <div className="space-y-2">
              {components.map(comp => (
                <div key={comp.name} className="flex items-center justify-between text-[11px]">
                  <span className="text-brand-dark/70 font-medium">{comp.name}</span>
                  <StatusIcon status={comp.status as any} />
                </div>
              ))}
            </div>
          </section>

          {/* Reasoning Graphs Status */}
          <section className="space-y-3">
            <h4 className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-[0.2em] flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              Reasoning Graphs
            </h4>
            <div className="space-y-4">
              {Object.keys(GRAPH_LABELS).map((codeName) => {
                const state = graphStates[codeName] || { status: 'idle' };
                return (
                  <div key={codeName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-dark/80">{codeName}</span>
                        <span className="text-[9px] text-brand-dark/30">({GRAPH_LABELS[codeName]})</span>
                      </div>
                      <StatusIcon status={state.status} progress={state.progress} />
                    </div>
                    {state.lastResult && (
                      <div className="p-2 bg-brand-bg rounded-lg border border-brand-border/30">
                        <p className="text-[10px] text-brand-dark/40 italic line-clamp-2 font-mono">
                          "{state.lastResult}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const StatusIcon = ({ status, progress }: { status: GraphStatus, progress?: number }) => {
  switch (status) {
    case 'running':
      return (
        <div className="flex items-center gap-2">
          {progress !== undefined && progress > 0 && (
            <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/50">
              {progress > 1000 ? `${(progress/1000).toFixed(1)}k` : progress}
            </span>
          )}
          <CircleDashed className="w-3.5 h-3.5 text-amber-500 animate-spin" />
        </div>
      );
    case 'success':
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    case 'error':
      return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
    default:
      return <Clock className="w-3.5 h-3.5 text-slate-300" />;
  }
};
