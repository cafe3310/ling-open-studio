"use client";

import React, { useState } from "react";
import { Play, Code, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useModelStore } from "@/lib/store";
import { createClientTools } from "@/lib/tools/client-executor";
import { ToolCtxJson } from "@/lib/tools/ctx-json";
import { ToolCtxXml } from "@/lib/tools/ctx-xml";
import { vfsTools } from "@/lib/tools/tools-vfs";
import { jsTools } from "@/lib/tools/tools-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useThreadRuntime, useMessage, useThread } from "@assistant-ui/react";

const ALL_TOOLS = [...vfsTools, ...jsTools];

export const ToolCallRenderer = () => {
  const { toolParadigm } = useModelStore();
  const runtime = useThreadRuntime();

  // 1. Get running status and current message info
  const isRunning = useMessage((m) => m.status?.type === "running");
  const role = useMessage((m) => m.role);
  const messageId = useMessage((m) => m.id);

  // Access full thread messages to check for existing results
  const threadMessages = useThread((t) => t.messages);
  const threadId = useThread((t) => t.threadId) || "global";

  // Determine mount points based on context
  const mounts = React.useMemo(() => ({
    "/": `/workspace/sessions/${threadId}/`,
    "/system": "/system/"
  }), [threadId]);

  const tools = React.useMemo(() => createClientTools(mounts), [mounts]);

  // 2. Safely extract content using a selector
  const content = useMessage((m) => {
    const c = m.content;
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

  const strategy = toolParadigm === "xml" ? ToolCtxXml : ToolCtxJson;
  const parsedResponse = !isRunning ? strategy.parseResponse(content) : null;
  const toolCalls = parsedResponse?.calls || null;

  // Determine if this block has already been executed by checking thread history
  // and extract the result data if found.
  const executionInfo = React.useMemo(() => {
    if (!toolCalls) return { isExecuted: false, results: {} as Record<string, any> };

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

  // Sync local status with history check
  React.useEffect(() => {
    if (isAlreadyExecuted) {
      if (status !== "success") setStatus("success");
    } else {
      if (status === "success") setStatus("idle");
    }
  }, [isAlreadyExecuted, status]);

  const [errorMessage, setErrorMessage] = useState("");

  // Safety check: Assistant messages only
  if (role !== "assistant" || !content) return null;

  if (isRunning || !toolCalls || toolCalls.length === 0) return null;

  const handleExecute = async () => {
    console.log("[ToolCallRenderer] Starting execution for tool calls:", toolCalls.length);
    setStatus("running");
    try {
      const results = await Promise.all(toolCalls.map(async (call) => {
        const executor = tools[call.toolName as ClientToolName];
        if (!executor) {
          console.error(`[ToolCallRenderer] Executor not found for: ${call.toolName}`);
          return { id: call.callId, result: `Error: Tool ${call.toolName} not found on client.` };
        }

        console.log(`[ToolCallRenderer] Running ${call.toolName} (${call.callId})...`);
        const result = await executor(call.args);
        return { id: call.callId, result };
      }));

      console.log("[ToolCallRenderer] All executions finished. Results:", results);
      setStatus("success");

      // Back-fill results to the thread as a User message
      const formattedResults = results.map(r => strategy.formatToolResult(r.id, r.result)).join("\n\n");

      console.log("[ToolCallRenderer] Calling runtime.append with string...");
      runtime.append(formattedResults);

    } catch (e: any) {
      console.error("[ToolCallRenderer] FATAL ERROR during execution/append:", e);
      setStatus("error");
      setErrorMessage(e.message);
    }
  };

  const showResults = status === "success" && Object.keys(executionInfo.results).length > 0;

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
                    {typeof executionInfo.results[call.callId] === "object"
                      ? JSON.stringify(executionInfo.results[call.callId], null, 2)
                      : String(executionInfo.results[call.callId])}
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
