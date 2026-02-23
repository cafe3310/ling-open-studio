import { StateGraph, END } from "@langchain/langgraph";
import { WeaverState } from "./state";
import { predictorNode } from "./nodes";

const graphState: any = {
  prefixContext: {
    value: (x: string, y: string) => y ?? x,
    default: () => ""
  },
  storySummary: {
    value: (x?: string, y?: string) => y ?? x,
    default: () => ""
  },
  activeInspirationContent: {
    value: (x?: string, y?: string) => y ?? x,
    default: () => ""
  },
  ghostText: {
    value: (x?: string | null, y?: string | null) => y ?? x,
    default: () => null
  },
  status: {
    value: (x: string, y: string) => y ?? x,
    default: () => "idle"
  }
};

const workflow = new StateGraph<WeaverState>({
  channels: graphState
})
  .addNode("predictor", predictorNode)
  .setEntryPoint("predictor")
  .addEdge("predictor", END);

export const weaverGraph = workflow.compile();
