import { simpleGraph } from "@/app/lib/assistants/simple-graph";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  // Convert AI SDK messages to LangChain format
  const langchainMessages = await toBaseMessages(messages);
  // Use a unique ID for the session/thread, similar to model-judger
  const sessionId = `session-${Date.now()}`;
  // Stream the graph run directly
  const stream = await simpleGraph.stream(
    {
      messages: langchainMessages,
      session_id: sessionId,
    },
    {
      configurable: { thread_id: sessionId },
      streamMode: ["messages"],
    }
  );

  return createUIMessageStreamResponse({ 
    stream: toUIMessageStream(stream),
  });
}
