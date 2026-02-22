import { NextRequest, NextResponse } from "next/server";
import { weaverGraph } from "@/assistants/write-architect/weaver/graph";

export async function POST(req: NextRequest) {
  try {
    const { prefixContext, storySummary } = await req.json();

    if (!prefixContext) {
      return NextResponse.json({ ghostText: null });
    }

    // Invoke the PhantomWeaver graph
    const result = await weaverGraph.invoke({
      prefixContext,
      storySummary,
      status: "running"
    });

    return NextResponse.json({
      ghostText: result.ghostText,
      status: "success"
    });
  } catch (error: any) {
    console.error("Predict API error:", error);
    return NextResponse.json({ ghostText: null, error: error.message }, { status: 500 });
  }
}
