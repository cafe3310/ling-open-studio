import { assistantRegistry, AssistantMode } from "@/assistants/registry";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { ReasoningSplitter } from "@/lib/assistant-utils/reasoning-splitter";
import { getToolContextStrategy } from "@/lib/tools/registry";
import { vfsTools } from "@/lib/tools/tools-vfs";
import { jsTools } from "@/lib/tools/tools-js";
import { ToolDef } from "@/lib/tools";

export async function POST(req: Request) {
  const { messages, config } = await req.json();
  const mode = (config.mode as AssistantMode) || 'chat';
  
  const { enabledTools = [], toolParadigm = 'json', systemPrompt: baseSystemPrompt } = config;

  console.log(`[API/Chat] Starting request in mode: ${mode}, tools: ${enabledTools}, paradigm: ${toolParadigm}`);

  // 1. Select Tool Strategy and Collection
  const strategy = getToolContextStrategy(toolParadigm);
  const activeTools: ToolDef[] = [];
  if (enabledTools.includes('vfs')) activeTools.push(...vfsTools);
  if (enabledTools.includes('js')) activeTools.push(...jsTools);

  // 2. Build Enhanced System Prompt
  const enhancedSystemPrompt = strategy.spliceSystemPrompt(baseSystemPrompt, activeTools);
  console.log("--- ENHANCED SYSTEM PROMPT ---\n", enhancedSystemPrompt, "\n------------------------------");

  // 3. Prepare Messages for Model
  // Convert AI SDK messages to LangChain format
  const langchainMessages = await toBaseMessages(messages);
  
  // Prepend or Update System Message
  const systemMessageIndex = langchainMessages.findIndex(m => m._getType() === 'system');
  if (systemMessageIndex !== -1) {
    langchainMessages[systemMessageIndex].content = enhancedSystemPrompt;
  } else {
    // Insert at the beginning
    const { SystemMessage } = await import("@langchain/core/messages");
    langchainMessages.unshift(new SystemMessage(enhancedSystemPrompt));
  }

  // Resolve the appropriate assistant graph
  const assistant = assistantRegistry.get(mode);
  
  // Use threadId if provided by assistant-ui, otherwise fallback to sessionId
  const threadId = config.threadId || `session-${Date.now()}`;
  
  // Stream the graph run with multiple modes
  const fullStream = await assistant.graph.stream(
    {
      messages: langchainMessages,
      taskId: threadId,
      config: {
        modelId: config.modelId,
        designId: config.designId,
        techStackId: config.techStackId,
      }
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

  // Create the object stream
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      console.log("[API/Chat] Stream execution started.");
      try {
        // Transform the ENTIRE stream (messages + custom events)
        const uiMessageStream = toUIMessageStream(
          splitter.transform(fullStream as any)
        );
        const uiReader = uiMessageStream.getReader();

        console.log("[API/Chat] Entering main stream loop...");

        while (true) {
          const { done, value } = await uiReader.read();
          if (done) break;
          
          if (value?.type?.startsWith('data-')) {
            console.log(`[API/Chat] Forwarding Trace Data: ${value.type}`);
          }
          
          writer.write(value);
        }

        console.log("[API/Chat] Main stream finished.");
        
      } catch (error) {
        console.error("[API/Chat] Stream error:", error);
      } finally {
        console.log("[API/Chat] Stream execution finished.");
      }
    }
  });

  // Return the serialized response
  return createUIMessageStreamResponse({ stream });
}
