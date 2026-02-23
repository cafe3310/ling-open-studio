import { StateGraph, END } from "@langchain/langgraph";
import { MuseState } from "./state";
import { museNode } from "./nodes";

const graphState: any = {
  context: {
    value: (x: string, y: string) => y ?? x,
    default: () => ""
  },
  storySummary: {
    value: (x?: string, y?: string) => y ?? x,
    default: () => ""
  },
  inspirations: {
    value: (x?: any[], y?: any[]) => y ?? x,
    default: () => []
  },
  status: {
    value: (x: string, y: string) => y ?? x,
    default: () => "idle"
  }
};

const workflow = new StateGraph<MuseState>({
  channels: graphState
})
  .addNode("muse", museNode)
  .setEntryPoint("muse")
  .addEdge("muse", END);

export const museGraph = workflow.compile();
