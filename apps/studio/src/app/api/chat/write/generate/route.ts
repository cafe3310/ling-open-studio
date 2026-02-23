import { NextRequest } from "next/server";
import { createChatModel } from "@/lib/model";
import { NARRATIVE_PROMPT } from "@/assistants/write-architect/flow/nodes";
import { LangChainAdapter } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { 
      storySummary, 
      historySummaries, 
      recentText, 
      activeLore, 
      activeInspirations 
    } = await req.json();

    const model = createChatModel("Ling_2_5_1T", { 
      temperature: 0.8,
    });

    const prompt = await NARRATIVE_PROMPT.format({
      storySummary: storySummary || "No overall story summary provided yet.",
      historySummaries: historySummaries || "Story is just beginning.",
      activeLore: activeLore || "No specific lore matched.",
      activeInspirations: activeInspirations || "No active creative inspirations.",
      recentText: recentText
    });

    const stream = await model.stream(prompt);

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error: any) {
    console.error("Generate API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
