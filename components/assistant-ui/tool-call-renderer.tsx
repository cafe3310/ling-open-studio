"use client";

import React, { useState } from "react";
import { Play, Code, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useModelStore } from "@/lib/store";
import { clientTools, ClientToolName } from "@/lib/tools/client-executor";
import { ToolCtxJson } from "@/lib/tools/ctx-json";
import { ToolCtxXml } from "@/lib/tools/ctx-xml";
import { vfsTools } from "@/lib/tools/tools-vfs";
import { jsTools } from "@/lib/tools/tools-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAssistantRuntime, useMessage } from "@assistant-ui/react";

const ALL_TOOLS = [...vfsTools, ...jsTools];

export const ToolCallRenderer = () => {
  const { toolParadigm } = useModelStore();
  const runtime = useAssistantRuntime();
  
  // Directly get the message state
  const message = useMessage();
  const isRunning = message.status.type === 'running';
  
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  // Safety check: Assistant messages only
  if (message.role !== 'assistant' || !message.content) return null;

  // Extract full text content from parts
  const content = message.content
    .filter((c: any) => c.type === 'text')
    .map((c: any) => c.text || "")
    .join("\n");

  const strategy = toolParadigm === 'xml' ? ToolCtxXml : ToolCtxJson;
  
  // Only parse when finished
  const toolCalls = !isRunning ? strategy.parseResponse(content, ALL_TOOLS) : null;

  if (isRunning || !toolCalls || toolCalls.length === 0) return null;

  const handleExecute = async () => {
    setStatus('running');
    try {
      const results = await Promise.all(toolCalls.map(async (call) => {
        const executor = clientTools[call.toolName as ClientToolName];
        if (!executor) return { id: call.callId, result: `Error: Tool ${call.toolName} not found on client.` };
        
        const result = await executor(call.args);
        return { id: call.callId, result };
      }));

      setStatus('success');

      // Back-fill results to the thread as a User message
      const formattedResults = results.map(r => strategy.formatToolResult(r.id, r.result)).join("\n\n");
      
      runtime.append({
        role: "user",
        content: formattedResults
      });

    } catch (e: any) {
      setStatus('error');
      setErrorMessage(e.message);
    }
  };

  return (
    <Card className="my-4 border-brand-border/50 bg-brand-bg/10 overflow-hidden">
      <div className="bg-brand-bg/20 px-4 py-2 border-b border-brand-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-brand-blue" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/70">
            Tool Call Request
          </span>
        </div>
        <div className="flex items-center gap-2">
           {status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-brand-blue" />}
           {status === 'success' && <CheckCircle2 className="w-3 h-3 text-green-600" />}
           {status === 'error' && <XCircle className="w-3 h-3 text-red-600" />}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {toolCalls.map((call, idx) => (
          <div key={idx} className="bg-white/50 rounded p-2 border border-brand-border/20">
            <div className="text-[10px] font-mono font-bold text-brand-blue mb-1 uppercase tracking-tighter">
              {call.toolName}
            </div>
            <pre className="text-[11px] font-mono text-brand-dark/80 whitespace-pre-wrap break-all bg-brand-bg/5 p-1.5 rounded">
              {JSON.stringify(call.args, null, 2)}
            </pre>
          </div>
        ))}

        {status === 'error' && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Button 
            size="sm" 
            variant={status === 'success' ? 'ghost' : 'default'}
            disabled={status === 'running' || status === 'success'}
            onClick={handleExecute}
            className={cn(
              "h-8 px-3 text-xs gap-1.5 transition-all",
              status === 'success' && "text-green-600"
            )}
          >
            {status === 'running' ? (
              <>Executing...</>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Executed
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                Run Tool Call
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};