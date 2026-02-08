import { chatNameGenerator } from "@/assistants/naming/graph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Manually convert to LangChain messages to be more robust
    const langchainMessages = messages.map(m => {
      // Extract text from content parts
      const text = Array.isArray(m.content) 
        ? m.content.map((part: any) => part.text || part.reasoning || "").join("\n")
        : (m.content || "");

      if (m.role === "user") return new HumanMessage(text);
      if (m.role === "assistant") return new AIMessage(text);
      return new HumanMessage(text); // Fallback
    });

    // Run the naming graph
    const result = await chatNameGenerator.invoke({
      messages: langchainMessages,
    });

    return NextResponse.json({ title: result.title });
  } catch (error) {
    console.error("Naming API Error:", error);
    return NextResponse.json({ error: "Failed to generate title" }, { status: 500 });
  }
}
