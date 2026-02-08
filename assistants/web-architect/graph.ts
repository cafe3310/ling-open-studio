import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { initialGenGraph } from "./initial-gen";
import { refineGenGraph } from "./refine-gen";

/**
 * Main Web Architect Graph.
 * Routes to either Initial Generation or Refinement based on state.
 */

async function router(state: WebGenState) {
  // If config is present in the input but not yet in state, it will be handled by the first node.
  // We determine initial vs refine based on whether we have previous messages 
  // or if we've already generated a plan.
  const isInitial = !state.product_plan && state.messages.length <= 1;
  console.log(`[WebGenGraph] Routing decision: ${isInitial ? 'INITIAL' : 'REFINE'} (Plan: ${!!state.product_plan}, MsgCount: ${state.messages.length})`);
  
  if (isInitial) {
    return "initial";
  }
  return "refine";
}

const builder = new StateGraph(WebGenState)
  .addNode("initial", initialGenGraph)
  .addNode("refine", refineGenGraph)
  .addConditionalEdges(START, router);

export const webGenGraph = builder.compile();
