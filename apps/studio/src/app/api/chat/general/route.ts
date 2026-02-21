import { assistantRegistry } from "@/assistants/registry";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { ReasoningSplitter } from "@/lib/assistant-utils/reasoning-splitter";
import { vfsTools } from "@/lib/tools/tools-vfs";
import { jsTools } from "@/lib/tools/tools-js";
import { ToolDef } from "@/lib/tools";
import { PromptBuilder, ToolParadigm } from "@/lib/prompt-engine";

export async function POST(req: Request) {
  const { messages, config } = await req.json();
  const mode = 'chat'; // Dedicated endpoint for chat
  
  const { enabledTools = [], toolParadigm = 'json', systemPrompt: baseSystemPrompt = "" } = config;

  console.log(`[API/Chat/General] Starting request, tools: \${enabledTools}, paradigm: \${toolParadigm}`);

  // 1. Collect Active Tools
  const activeTools: ToolDef[] = [];
  if (enabledTools.includes('vfs')) activeTools.push(...vfsTools);
  if (enabledTools.includes('js')) activeTools.push(...jsTools);

  // 2. Build Enhanced System Prompt using PromptBuilder
  const enhancedSystemPrompt = PromptBuilder.build({
    basePrompt: baseSystemPrompt,
    tools: activeTools.map(t => ({ name: t.name, desc: t.desc })),
    paradigm: toolParadigm as ToolParadigm,
    includeStandardConstraints: true
  });
  console.log("[API/Chat/General] Enhanced System Prompt Injected via PromptBuilder");

  // 3. Prepare Messages for Model
  const langchainMessages = await toBaseMessages(messages);
  
  const systemMessageIndex = langchainMessages.findIndex(m => m._getType() === 'system');
  if (systemMessageIndex !== -1) {
    langchainMessages[systemMessageIndex].content = enhancedSystemPrompt;
  } else {
    const { SystemMessage } = await import("@langchain/core/messages");
    langchainMessages.unshift(new SystemMessage(enhancedSystemPrompt));
  }

  // Resolve the assistant graph
  const assistant = assistantRegistry.get(mode);
  const threadId = config.threadId || `session-${Date.now()}`;
  
  const fullStream = await assistant.graph.stream(
    {
      messages: langchainMessages,
      taskId: threadId,
      // Pass config to state if needed
    },
    {
      configurable: { 
        thread_id: threadId,
        modelConfig: config,
      },
      streamMode: ["messages", "custom"],
    }
  );

  const splitter = new ReasoningSplitter();

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      try {
        const uiMessageStream = toUIMessageStream(
          splitter.transform(fullStream as any)
        );
        const uiReader = uiMessageStream.getReader();
        while (true) {
          const { done, value } = await uiReader.read();
          if (done) break;
          writer.write(value);
        }
      } catch (error) {
        console.error("[API/Chat/General] Stream error:", error);
      }
    }
  });

  return createUIMessageStreamResponse({ stream });
}
