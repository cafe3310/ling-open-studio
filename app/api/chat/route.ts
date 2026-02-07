import { assistantRegistry, AssistantMode } from "@/assistants/registry";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";
import { ReasoningSplitter } from "@/lib/assistant-utils/reasoning-splitter";

export async function POST(req: Request) {
  const { messages, config } = await req.json();
  const mode = (config.mode as AssistantMode) || 'chat';
  
  // Resolve the appropriate assistant graph
  const assistant = assistantRegistry.get(mode);
  
  // Convert AI SDK messages to LangChain format
  const langchainMessages = await toBaseMessages(messages);
  // Use a unique ID for the session/thread
  const sessionId = `session-${Date.now()}`;
  
  // Stream the graph run
  const stream = await assistant.graph.stream(
    {
      messages: langchainMessages,
      session_id: sessionId,
    },
    {
      configurable: { 
        thread_id: sessionId,
        modelConfig: config,
      },
      streamMode: ["messages"],
    }
  );

  const splitter = new ReasoningSplitter();

  return createUIMessageStreamResponse({ 
    stream: toUIMessageStream(splitter.transform(stream as any)),
  });
}
