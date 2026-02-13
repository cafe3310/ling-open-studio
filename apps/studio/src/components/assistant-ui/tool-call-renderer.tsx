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
}: { 
  forcedParadigm?: string;
  silent?: boolean;
}) => {
  const { toolParadigm: storeParadigm } = useModelStore();
  const aui = useAui();

  const toolParadigm = forcedParadigm || storeParadigm;
  const strategy = getToolContextStrategy(toolParadigm);

  const isRunning = useAuiState((s) => s.message.status?.type === "running");
  const role = useAuiState((s) => s.message.role);
  const messageId = useAuiState((s) => s.message.id);
  const threadMessages = useAuiState((s) => s.thread.messages);
  const threadId = useAuiState((s) => s.threads.mainThreadId) || "global";

  const mounts = React.useMemo(() => ({
    "/": `/workspace/sessions/${threadId}/`,
    "/system": "/system/"
  }), [threadId]);

  const tools = React.useMemo(() => createClientTools(mounts), [mounts]);

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

  const executionInfo = React.useMemo(() => {
    if (!toolCalls) return { isExecuted: false, results: {} as Record<string, any> };
    if (localExecutionCache.has(messageId)) return { isExecuted: true, results: {} };

    const currentIndex = threadMessages.findIndex(m => m.id === messageId);
    if (currentIndex === -1) return { isExecuted: false, results: {} };

    const subsequentMessages = threadMessages.slice(currentIndex + 1);
    const results: Record<string, any> = {};

    const allFound = toolCalls.every(call => {
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

  React.useEffect(() => {
    if (isAlreadyExecuted && status !== "success") {
      setStatus("success");
    }
  }, [isAlreadyExecuted, status]);

  const [errorMessage, setErrorMessage] = useState("");

  const handleExecute = React.useCallback(async () => {
    if (!toolCalls || toolCalls.length === 0) return;

    setStatus("running");
    try {
      const results = await Promise.all(toolCalls.map(async (call) => {
        const executor = (tools as any)[call.toolName];
        if (!executor) return { id: call.callId, result: `Error: Tool ${call.toolName} not found.` };
        const result = await executor(call.args);
        return { id: call.callId, result };
      }));

      setStatus("success");
      localExecutionCache.add(messageId);

      if (!silent) {
        const formattedResults = results.map(r => strategy.formatToolResult(r.id, r.result)).join("\n\n");
        aui.thread().append(formattedResults);
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMessage(e.message);
    }
  }, [toolCalls, tools, aui, strategy, silent, messageId]);

  // For Model Web automation: if silent mode is on, auto-execute.
  React.useEffect(() => {
    if (silent && !isRunning && toolCalls && toolCalls.length > 0 && !isAlreadyExecuted && status === "idle") {
      handleExecute();
    }
  }, [silent, isRunning, toolCalls, isAlreadyExecuted, status, handleExecute]);

  if (role !== "assistant" || !content || isRunning || !toolCalls || toolCalls.length === 0) return null;

  const showResults = status === "success" && Object.keys(executionInfo.results).length > 0;

  return (
    <Card className="my-4 border-brand-border/30 bg-brand-bg/5 overflow-hidden max-w-2xl">
      <div className="bg-brand-bg/10 px-4 py-2 border-b border-brand-border/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-brand-blue/60" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50">
            Tool Execution
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status === "running" && <Loader2 className="w-3 h-3 animate-spin text-brand-blue" />}
          {status === "success" && <CheckCircle2 className="w-3 h-3 text-green-600" />}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {toolCalls.map((call, idx) => (
          <div key={idx} className="bg-white/50 rounded p-2 border border-brand-border/10">
            <div className="text-[9px] font-mono font-bold text-brand-blue/60 mb-1 uppercase">
              {call.toolName}
            </div>
            {showResults && executionInfo.results[call.callId] && (
              <pre className="text-[10px] font-mono text-green-700/80 mt-2 p-1.5 bg-green-50/30 rounded border border-green-100/30">
                {String(executionInfo.results[call.callId])}
              </pre>
            )}
          </div>
        ))}
        
        {!isAlreadyExecuted && status !== "running" && (
          <Button size="sm" onClick={handleExecute} className="w-full h-8 text-[11px] uppercase tracking-widest">
            Run Tool Call
          </Button>
        )}
      </div>
    </Card>
  );
};
