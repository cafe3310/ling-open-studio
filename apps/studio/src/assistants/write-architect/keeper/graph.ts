import { StateGraph, END } from "@langchain/langgraph";
import { KeeperState } from "./state";
import { keeperNode } from "./nodes";

const graphState: any = {
  entityNames: {
    value: (x: string[], y: string[]) => y ?? x,
    default: () => []
  },
  context: {
    value: (x: string, y: string) => y ?? x,
    default: () => ""
  },
  storySummary: {
    value: (x?: string, y?: string) => y ?? x,
    default: () => ""
  },
  entries: {
    value: (x?: any[], y?: any[]) => y ?? x,
    default: () => []
  },
  status: {
    value: (x: string, y: string) => y ?? x,
    default: () => "idle"
  }
};

const workflow = new StateGraph<KeeperState>({
  channels: graphState
})
  .addNode("keeper", keeperNode)
  .setEntryPoint("keeper")
  .addEdge("keeper", END);

export const keeperGraph = workflow.compile();
