import { assistantRegistry } from "@/assistants/registry";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { ReasoningSplitter } from "@/lib/assistant-utils/reasoning-splitter";

export async function POST(req: Request) {
  const { messages, config } = await req.json();
  const mode = 'web-gen'; // Matches registry key
  
  console.log(`[API/Chat/Web] Starting request. Thread: ${config.threadId}`);

  // 1. Prepare Messages for Model (No System Prompt Injection)
  const langchainMessages = await toBaseMessages(messages);
  
  // 2. Resolve the assistant graph
  const assistant = assistantRegistry.get(mode);
  const threadId = config.threadId || `session-${Date.now()}`;
  
  // 3. Stream the graph run
  const fullStream = await assistant.graph.stream(
    {
      messages: langchainMessages,
      taskId: threadId,
      config: {
        modelId: config.modelId,
        designId: config.designId,
        techStackId: config.techStackId,
        designModelId: config.designModelId,
        codeModelId: config.codeModelId,
        presetStylePrompt: config.presetStylePrompt,
        temperature: config.temperature,
        toolParadigm: config.toolParadigm,
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

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      console.log(`[API/Chat/Web] SSE Stream execution started for thread: ${threadId}`);
      let chunkCount = 0;
      try {
        const uiMessageStream = toUIMessageStream(
          splitter.transform(fullStream as any)
        );
        const uiReader = uiMessageStream.getReader();
        while (true) {
          const { done, value } = await uiReader.read();
          if (done) {
            console.log(`[API/Chat/Web] SSE Stream reached DONE state after ${chunkCount} chunks.`);
            break;
          }
          chunkCount++;
          if (chunkCount % 50 === 0) console.log(`[API/Chat/Web] Streamed ${chunkCount} chunks...`);
          writer.write(value);
        }
      } catch (error) {
        console.error("[API/Chat/Web] Stream CRITICAL error:", error);
      } finally {
        console.log(`[API/Chat/Web] SSE Stream closed for thread: ${threadId}`);
      }
    }
  });

  return createUIMessageStreamResponse({ stream });
}
