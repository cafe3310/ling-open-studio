"use client";

import React, { useState } from "react";
import { Play, Code, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useModelStore } from "@/lib/store";
import { createClientTools } from "@/lib/tools/client-executor";
import { getToolContextStrategy } from "@/lib/tools/registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAui, useAuiState } from "@assistant-ui/react";

// Global cache to track local executions for silent/auto tools
// This prevents infinite loops when tools don't append to thread history.
const localExecutionCache = new Set<string>();

export const ToolCallRenderer = ({ 
  forcedParadigm,
  silent,
  autoApprove,
  hideDetails
}: { 
  forcedParadigm?: string;
  silent?: boolean;
  autoApprove?: boolean;
  hideDetails?: boolean;
}) => {
  const { toolParadigm: storeParadigm } = useModelStore();
  const aui = useAui();

  const toolParadigm = forcedParadigm || storeParadigm;
  const strategy = getToolContextStrategy(toolParadigm);

  // 1. Get running status and current message info from unified state
  const isRunning = useAuiState((s) => s.message.status?.type === "running");
  const role = useAuiState((s) => s.message.role);
  const messageId = useAuiState((s) => s.message.id);

  // Access full thread messages to check for existing results
  const threadMessages = useAuiState((s) => s.thread.messages);
  const threadId = useAuiState((s) => s.threads.mainThreadId) || "global";

  // Determine mount points based on context
  const mounts = React.useMemo(() => ({
    "/": `/workspace/sessions/${threadId}/`,
    "/system": "/system/"
  }), [threadId]);

  const tools = React.useMemo(() => createClientTools(mounts), [mounts]);

  // 2. Safely extract content using a selector
  const content = useAuiState((s) => {
    const c = s.message.content;
    if (!c) return "";
    if (typeof c === "string") return c;
    if (Array.isArray(c)) {
      return c
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text || "")
        .join("\n");
    }
    return "";
  });

  const parsedResponse = !isRunning ? strategy.parseResponse(content) : null;
  const toolCalls = parsedResponse?.calls || null;

  // Determine if this block has already been executed by checking thread history
  // OR our local session cache.
  const executionInfo = React.useMemo(() => {
    if (!toolCalls) return { isExecuted: false, results: {} as Record<string, any> };

    // Check local cache first (for silent mode)
    if (localExecutionCache.has(messageId)) {
      return { isExecuted: true, results: {} };
    }

    const currentIndex = threadMessages.findIndex(m => m.id === messageId);
    if (currentIndex === -1) return { isExecuted: false, results: {} };

    const subsequentMessages = threadMessages.slice(currentIndex + 1);
    const results: Record<string, any> = {};

    const allFound = toolCalls.every(call => {
      // Use parseResult to find tool result in any subsequent user message
      for (const msg of subsequentMessages) {
        if (msg.role !== "user") continue;
        const msgText = Array.isArray(msg.content)
          ? msg.content.map((p: any) => p.text).join("")
          : String(msg.content);

        const parsed = strategy.parseResult(msgText);
        if (parsed) {
          const match = parsed.results.find(r => r.callId === call.callId);
          if (match) {
            results[call.callId] = match.result;
            return true;
          }
        }
      }
      return false;
    });

    return { isExecuted: allFound, results };
  }, [toolCalls, threadMessages, messageId, strategy]);

  const isAlreadyExecuted = executionInfo.isExecuted;
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [localResults, setLocalResults] = useState<Record<string, any>>({});

  // Sync local status with history check
  React.useEffect(() => {
    if (isAlreadyExecuted && status !== "success") {
      setStatus("success");
    }
  }, [isAlreadyExecuted, status]);

  const [errorMessage, setErrorMessage] = useState("");

  const handleExecute = React.useCallback(async () => {
    if (!toolCalls || toolCalls.length === 0) return;

    console.log("[ToolCallRenderer] Starting execution for tool calls:", toolCalls.length);
    setStatus("running");
    try {
      const results = await Promise.all(toolCalls.map(async (call) => {
        const executor = (tools as any)[call.toolName];
        if (!executor) {
          console.error(`[ToolCallRenderer] Executor not found for: ${call.toolName}`);
          return { id: call.callId, result: `Error: Tool ${call.toolName} not found on client.` };
        }

        console.log(`[ToolCallRenderer] Running ${call.toolName} (${call.callId})...`);
        const result = await executor(call.args);
        return { id: call.callId, result };
      }));

      console.log("[ToolCallRenderer] All executions finished. Results:", results);
      
      // Update local results first to ensure immediate UI feedback
      const newLocalResults: Record<string, any> = {};
      results.forEach(r => {
        newLocalResults[r.id] = r.result;
      });
      setLocalResults(newLocalResults);
      setStatus("success");
      
      // Mark as executed locally to prevent loops in silent mode
      localExecutionCache.add(messageId);

      // Only back-fill results to the thread if NOT in silent mode
      // WebArchitect uses silent=true to prevent unnecessary feedback loops
      if (!silent) {
        const formattedResults = results.map(r => strategy.formatToolResult(r.id, r.result)).join("\n\n");
        console.log("[ToolCallRenderer] Appending results to thread...");
        aui.thread().append(formattedResults);
      } else {
        console.log("[ToolCallRenderer] Silent execution complete. Not appending message.");
      }

    } catch (e: any) {
      console.error("[ToolCallRenderer] FATAL ERROR during execution:", e);
      setStatus("error");
      setErrorMessage(e.message);
    }
  }, [toolCalls, tools, aui, strategy, silent, messageId]);

  // Merge results from thread history and local execution state
  const mergedResults = React.useMemo(() => {
    return { ...executionInfo.results, ...localResults };
  }, [executionInfo.results, localResults]);

  // 3. Auto-execution logic
  React.useEffect(() => {
    if (autoApprove && !isRunning && toolCalls && toolCalls.length > 0 && !isAlreadyExecuted && status === "idle") {
      const timer = setTimeout(() => {
        handleExecute();
      }, 300); // Small delay for visual feedback
      return () => clearTimeout(timer);
    }
  }, [autoApprove, isRunning, toolCalls, isAlreadyExecuted, status, handleExecute]);

  // Safety check: Assistant messages only
  if (role !== "assistant" || !content) return null;

  if (isRunning || !toolCalls || toolCalls.length === 0) return null;


  const showResults = status === "success" && Object.keys(mergedResults).length > 0;

  if (hideDetails) {
    return (
      <div className="my-2 flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-border/30 bg-brand-bg/5 w-fit">
        <div className="flex items-center gap-1.5">
          {status === "running" ? (
            <Loader2 className="w-3 h-3 animate-spin text-brand-blue" />
          ) : status === "success" ? (
            <CheckCircle2 className="w-3 h-3 text-green-600" />
          ) : status === "error" ? (
            <XCircle className="w-3 h-3 text-red-600" />
          ) : (
            <Code className="w-3 h-3 text-brand-blue" />
          )}
          <span className="text-[11px] font-bold uppercase tracking-tight text-brand-dark/60">
            {toolCalls.map(c => c.toolName).join(", ")}
          </span>
        </div>
        {status === "idle" && (
          <button 
            onClick={handleExecute}
            className="ml-1 p-0.5 hover:bg-brand-bg/10 rounded transition-colors"
          >
            <Play className="w-3 h-3 text-brand-blue fill-current" />
          </button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      "my-4 border-brand-border/50 bg-brand-bg/5 overflow-hidden transition-all duration-300",
      showResults ? "max-w-4xl" : "max-w-xl"
    )}>
      <div className="bg-brand-bg/10 px-4 py-2 border-b border-brand-border/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-brand-blue" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/70">
            {showResults ? "Tool Transaction" : "Tool Call Request"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status === "running" && <Loader2 className="w-3 h-3 animate-spin text-brand-blue" />}
          {status === "success" && <CheckCircle2 className="w-3 h-3 text-green-600" />}
          {status === "error" && <XCircle className="w-3 h-3 text-red-600" />}
        </div>
      </div>

      <div className="p-4">
        <div className={cn(
          "grid gap-4",
          showResults ? "grid-cols-2" : "grid-cols-1"
        )}>
          {/* LEFT COLUMN: REQUESTS */}
          <div className="space-y-3">
            {showResults && (
              <div className="text-[10px] uppercase font-bold text-brand-gray/60 mb-1">Request</div>
            )}
            {toolCalls.map((call, idx) => (
              <div key={idx} className="bg-white/80 rounded p-2 border border-brand-border/20 shadow-sm">
                <div className="text-[10px] font-mono font-bold text-brand-blue mb-1 uppercase tracking-tighter">
                  {call.toolName}
                </div>
                <pre
                  className="text-[11px] font-mono text-brand-dark/80 whitespace-pre-wrap break-all bg-brand-bg/5 p-1.5 rounded">
                  {JSON.stringify(call.args, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          {showResults && (
            <div className="space-y-3 border-l border-brand-border/20 pl-4">
              <div className="text-[10px] uppercase font-bold text-brand-gray/60 mb-1">Result</div>
              {toolCalls.map((call, idx) => (
                <div key={idx} className="bg-green-50/50 rounded p-2 border border-green-100/50 shadow-sm min-h-[60px]">
                  <div className="text-[10px] font-mono font-bold text-green-700 mb-1 uppercase tracking-tighter">
                    Output
                  </div>
                  <pre
                    className="text-[11px] font-mono text-brand-dark/90 whitespace-pre-wrap break-all bg-white/50 p-1.5 rounded">
                    {typeof mergedResults[call.callId] === "object"
                      ? JSON.stringify(mergedResults[call.callId], null, 2)
                      : String(mergedResults[call.callId])}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {status === "error" && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {errorMessage}
          </div>
        )}

        {status !== "success" && (
          <div className="flex justify-end pt-3 mt-1 border-t border-brand-border/10">
            <Button
              size="sm"
              disabled={status === "running"}
              onClick={handleExecute}
              className="h-8 px-3 text-xs gap-1.5 transition-all"
            >
              {status === "running" ? (
                <>Executing...</>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  Run Tool Call
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
