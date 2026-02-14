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
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = 'idle' | 'running' | 'success' | 'error';

interface GraphStatus {
  name: string;
  codeName: string;
  status: Status;
  progress?: number; // Real-time output count (chars/tokens)
  lastResult?: string;
}

export const WriteStatusViewer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock states for demonstration
  const graphs: GraphStatus[] = [
    { name: '幻影编织者', codeName: 'PhantomWeaver', status: 'idle', lastResult: '...but the shadows didn\'t move' },
    { name: '片段预处理器', codeName: 'SegmentPreprocessor', status: 'running', progress: 150 },
    { name: '叙事流', codeName: 'NarrativeFlow', status: 'success', lastResult: 'New paragraph generated.' },
    { name: '知识守夜人', codeName: 'LoreKeeper', status: 'idle' },
    { name: '缪斯低语', codeName: 'MuseWhisper', status: 'idle' },
  ];

  const components = [
    { name: 'VFS Connection', status: 'success' },
    { name: 'Editor Kernel', status: 'success' },
    { name: 'Context Engine', status: 'running' },
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
                  <StatusIcon status={comp.status as Status} />
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
              {graphs.map(graph => (
                <div key={graph.codeName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-dark/80">{graph.codeName}</span>
                      <span className="text-[9px] text-brand-dark/30">({graph.name})</span>
                    </div>
                    <StatusIcon status={graph.status} progress={graph.progress} />
                  </div>
                  {graph.lastResult && (
                    <div className="p-2 bg-brand-bg rounded-lg border border-brand-border/30">
                      <p className="text-[10px] text-brand-dark/40 italic line-clamp-2 font-mono">
                        "{graph.lastResult}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const StatusIcon = ({ status, progress }: { status: Status, progress?: number }) => {
  switch (status) {
    case 'running':
      return (
        <div className="flex items-center gap-2">
          {progress !== undefined && (
            <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/50">
              {Math.floor(progress / 50) * 50}+
            </span>
          )}
          <CircleDashed className="w-3.5 h-3.5 text-amber-500 animate-spin" />
        </div>
      );
    case 'success':
      return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    case 'error':
      return <Activity className="w-3.5 h-3.5 text-red-500" />;
    default:
      return <Clock className="w-3.5 h-3.5 text-brand-dark/20" />;
  }
};
