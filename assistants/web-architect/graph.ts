import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { initialGenGraph } from "./initial-gen";
import { refineGenGraph } from "./refine-gen";

/**
 * Main Web Architect Graph.
 * Routes to either Initial Generation or Refinement based on state.
 */

async function router(state: WebGenState) {
  // If we only have one user message (excluding the current AIMessage if any), 
  // it's likely an initial request.
  // A better way is to check if we have any files in the taskId directory, 
  // but we can't do that on the server easily without tool calls.
  
  // Simple heuristic: if messages length <= 1 (just the user's first prompt), use initial.
  if (state.messages.length <= 1) {
    return "initial";
  }
  return "refine";
}

const builder = new StateGraph(WebGenState)
  .addNode("initial", initialGenGraph)
  .addNode("refine", refineGenGraph)
  .addConditionalEdges(START, router);

export const webGenGraph = builder.compile();
