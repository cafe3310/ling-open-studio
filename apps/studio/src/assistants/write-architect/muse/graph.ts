import { StateGraph, START, END } from "@langchain/langgraph";
import { MuseState } from "./state";
import { museGeneratorNode } from "./nodes";

const workflow = new StateGraph<MuseState>({
  channels: {
    storySummary: null,
    recentContext: null,
    historySummaries: null,
    inspirations: null,
    status: null,
  }
})
  .addNode("generator", museGeneratorNode)
  .addEdge(START, "generator")
  .addEdge("generator", END);

export const museGraph = workflow.compile();
