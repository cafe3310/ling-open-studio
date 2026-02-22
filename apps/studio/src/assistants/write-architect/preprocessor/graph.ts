import { StateGraph, END } from "@langchain/langgraph";
import { PreprocessorState } from "./state";
import { summarizerNode, entityExtractorNode } from "./nodes";

const graphState: any = {
  content: {
    value: (x: string, y: string) => y ?? x,
    default: () => ""
  },
  storySummary: {
    value: (x?: string, y?: string) => y ?? x,
    default: () => ""
  },
  summary: {
    value: (x?: string, y?: string) => y ?? x,
    default: () => null
  },
  extractedEntities: {
    value: (x?: string[], y?: string[]) => y ?? x,
    default: () => []
  },
  status: {
    value: (x: string, y: string) => y ?? x,
    default: () => "idle"
  }
};

const workflow = new StateGraph<PreprocessorState>({
  channels: graphState
})
  .addNode("summarizer", summarizerNode)
  .addNode("entityExtractor", entityExtractorNode)
  .setEntryPoint("summarizer")
  .addEdge("summarizer", "entityExtractor")
  .addEdge("entityExtractor", END);

export const preprocessorGraph = workflow.compile();
