import { StateGraph, START, END } from "@langchain/langgraph";
import { NarrativeState } from "./state";
import { narrativeWriterNode } from "./nodes";

const workflow = new StateGraph<NarrativeState>({
  channels: {
    storySummary: null,
    historySummaries: null,
    recentText: null,
    activeLore: null,
    activeInspirations: null,
    generatedText: null,
    status: null,
  }
})
  .addNode("writer", narrativeWriterNode)
  .addEdge(START, "writer")
  .addEdge("writer", END);

export const narrativeFlowGraph = workflow.compile();
