import { NextRequest, NextResponse } from "next/server";
import { preprocessorGraph } from "@/assistants/write-architect/preprocessor/graph";

export async function POST(req: NextRequest) {
  try {
    const { segmentId, content, storySummary } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    // Invoke the preprocessor graph
    const result = await preprocessorGraph.invoke({
      content,
      storySummary,
      status: "running"
    });

    return NextResponse.json({
      segmentId,
      summary: result.summary,
      extractedEntities: result.extractedEntities,
      status: "success"
    });
  } catch (error: any) {
    console.error("Precompute API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
