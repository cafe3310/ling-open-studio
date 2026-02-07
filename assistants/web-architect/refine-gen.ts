import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { createChatModel } from "@/lib/model";
import { getVfsTools } from "@/lib/tools/factory";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * Refiner Node: Handles modifications to existing files.
 */
async function refinerNode(state: WebGenState, config: any) {
  const model = createChatModel(config.configurable?.modelConfig).bindTools(getVfsTools());
  
  const systemPrompt = `You are an expert Web Developer. 
Your task is to modify an existing web project based on the user's feedback.

You have access to the virtual filesystem (VFS). 
If you need to see the current code, use 'vfs_read_file'.
If you know what to change, use 'vfs_write_file' to overwrite the files.

Base directory: /workspace/webapp/

Current taskId: ${state.taskId || 'unknown'}`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...state.messages
  ]);

  return { 
    messages: [response],
    status: 'coding' as const
  };
}

// Build Graph
const builder = new StateGraph(WebGenState)
  .addNode("refiner", refinerNode)
  .addEdge(START, "refiner")
  .addEdge("refiner", END);

export const refineGenGraph = builder.compile();
