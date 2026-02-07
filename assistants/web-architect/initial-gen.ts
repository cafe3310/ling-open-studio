import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { createChatModel } from "@/lib/model";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

// Nodes implementation

/**
 * Analyst Node: Understands user intent and breaks it down into requirements.
 */
async function analystNode(state: WebGenState, config: any) {
  const model = createChatModel(config.configurable?.modelConfig);
  const userPrompt = state.messages[state.messages.length - 1].content;
  
  const response = await model.invoke([
    new SystemMessage(`You are a Web Requirements Analyst. 
Analyze the user's request and provide a concise summary of what needs to be built.
Output your analysis in Markdown format.`),
    new HumanMessage(userPrompt as string)
  ]);

  return { 
    requirements: response.content as string,
    status: 'analyzing' as const
  };
}

/**
 * Coder Node: Generates the actual code based on requirements.
 */
async function coderNode(state: WebGenState, config: any) {
  const model = createChatModel(config.configurable?.modelConfig);
  
  const systemPrompt = `You are a Senior Web Developer. 
Based on the following requirements, generate the necessary web files.
Use HTML5 and Tailwind CSS (via CDN).

Requirements:
${state.requirements}

Use the tool 'write_file' to create the files. 
Always start with /workspace/webapp/ as the base directory.
Usually you need at least an 'index.html' file.

Explain your plan briefly, then call the tools.`;

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
  .addNode("analyst", analystNode)
  .addNode("coder", coderNode)
  .addEdge(START, "analyst")
  .addEdge("analyst", "coder")
  .addEdge("coder", END);

export const initialGenGraph = builder.compile();