import { NextRequest, NextResponse } from "next/server";
import { preprocessorGraph } from "@/assistants/write-architect/preprocessor/graph";
import { keeperGraph } from "@/assistants/write-architect/keeper/graph";
import { museGraph } from "@/assistants/write-architect/muse/graph";
import { PreprocessorState } from "@/assistants/write-architect/preprocessor/state";
import { KeeperState } from "@/assistants/write-architect/keeper/state";
import { MuseState } from "@/assistants/write-architect/muse/state";

export async function POST(req: NextRequest) {
  try {
    const { segmentId, content, storySummary, existingEntityNames = [] } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    // Phase 1: Basic preprocessing (summary & entity extraction)
    const precomputeResult = await preprocessorGraph.invoke({
      content,
      storySummary,
      status: "running"
    }) as unknown as PreprocessorState;

    const extractedNames: string[] = precomputeResult.extractedEntities || [];
    
    // Phase 2: Knowledge discovery (find entities not yet in KB)
    const existingSet = new Set(existingEntityNames.map((n: string) => n.toLowerCase()));
    const newNames = extractedNames.filter(name => !existingSet.has(name.toLowerCase()));

    let newEntries = [];
    if (newNames.length > 0) {
      const keeperResult = await keeperGraph.invoke({
        entityNames: newNames,
        context: content,
        storySummary,
        status: "running"
      }) as unknown as KeeperState;
      newEntries = keeperResult.entries || [];
    }

    // Phase 3: Creative Muse (Inspiration Cards)
    const museResult = await museGraph.invoke({
      context: content,
      storySummary,
      status: "running"
    }) as unknown as MuseState;

    return NextResponse.json({
      segmentId,
      summary: precomputeResult.summary,
      extractedEntities: extractedNames,
      newEntries, // New KnowledgeEntry objects
      inspirations: museResult.inspirations || [],
      status: "success"
    });
  } catch (error: any) {
    console.error("Precompute API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
