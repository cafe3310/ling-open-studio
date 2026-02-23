import { NextRequest } from "next/server";
import { createChatModel } from "@/lib/model";
import { NARRATIVE_PROMPT, REWRITE_PROMPT, EXPAND_PROMPT } from "@/assistants/write-architect/flow/nodes";

export async function POST(req: NextRequest) {
  try {
    const { 
      task = "continue", // "continue" | "rewrite" | "expand"
      selectedText,
      storySummary, 
      historySummaries, 
      recentText, 
      activeLore, 
      activeInspirations 
    } = await req.json();

    const model = createChatModel("Ling_2_5_1T", { 
      temperature: 0.8,
    });

    let prompt;
    const commonVars = {
      storySummary: storySummary || "No overall story summary provided yet.",
      historySummaries: historySummaries || "Story is just beginning.",
      activeLore: activeLore || "No specific lore matched.",
      activeInspirations: activeInspirations || "No active creative inspirations.",
      recentText: recentText,
      selectedText: selectedText || ""
    };

    if (task === "rewrite") {
      prompt = await REWRITE_PROMPT.format(commonVars);
    } else if (task === "expand") {
      prompt = await EXPAND_PROMPT.format(commonVars);
    } else {
      prompt = await NARRATIVE_PROMPT.format(commonVars);
    }

    const stream = await model.stream(prompt);

    // Manual stream response
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.content?.toString() || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Generate API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
