import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { createChatModel } from "@/lib/model";
import { tracedInvoke } from "@/lib/model-tracer";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { vfsTools, ToolCtxDelimited } from "@/lib/tools";
import { techStacks } from "./prompts";

/**
 * Node D (as per Design Doc): Editor / Reader
 * Identifies which files need to be read to satisfy user feedback.
 */
async function editorNode(state: WebGenState, config: any) {
  const model = createChatModel("Ling_1T", { 
    temperature: 0.7 
  });
  
  // In a real scenario, we would use list_directory tool here to get the file list.
  // For now, we assume /index.html is the main target.
  const fileList = ["/index.html"]; 

  const templateD = `
You are a Code Maintenance Engineer. The user wants to modify an existing website or fix a bug.

### 1. USER INSTRUCTION
${state.messages[state.messages.length - 1].content}

### 2. CURRENT PROJECT FILES
${fileList.join("\n")}

### 3. INSTRUCTIONS
- Identify which file(s) contain the code that needs modification.
- Usually, this is "/index.html".
- Use the read_file tool to read the content of the file.
`.trim();

  const response = await tracedInvoke(model, [
    new SystemMessage(ToolCtxDelimited.spliceSystemPrompt(templateD, vfsTools)),
    ...state.messages.slice(0, -1) // Context without the latest prompt to keep focus
  ], { graphInfo: { graphName: "RefineGen", nodeName: "WebEditor" }, modelId: "Ling_1T" });

  return { 
    messages: [response],
    status: 'refining' as const
  };
}

/**
 * Node E (as per Design Doc): Resolver / Writer
 * Receives the file content and applies the modification.
 */
async function resolverNode(state: WebGenState, config: any) {
  const model = createChatModel("Ling_1T", { 
    temperature: 0.1 
  });
  const selectedTechStack = techStacks.find(ts => ts.id === state.config?.techStackId) || techStacks[0];

  const templateE = `
You are a Senior Frontend Developer. You have been provided with the content of a file and a specific modification request.

### 1. USER INSTRUCTION
${state.messages[state.messages.length - 2].content} (Previous instruction)

### 2. TECHNICAL RULES
- Tech Stack Guide: ${selectedTechStack.description_style}
- Do NOT output partial diffs. Output the ENTIRE file content.

### 3. INSTRUCTIONS
- Analyze the code provided in the conversation history (as content blocks).
- Apply the requested changes accurately.
- Ensure the resulting page is still valid and functional.
- Write the final updated code back to the file using the write_file tool.
`.trim();

  const response = await tracedInvoke(model, [
    new SystemMessage(ToolCtxDelimited.spliceSystemPrompt(templateE, vfsTools)),
    ...state.messages
  ], { graphInfo: { graphName: "RefineGen", nodeName: "WebResolver" }, modelId: "Ling_1T" });

  return { 
    messages: [response],
    status: 'coding' as const
  };
}

// Build Graph
const builder = new StateGraph(WebGenState)
  .addNode("editor", editorNode)
  .addNode("resolver", resolverNode)
  .addEdge(START, "editor")
  // In a semi-automatic loop, Node D would output a 'read' block, 
  // the client would execute it, and the next turn would hit Node E.
  // But for a pure server-side graph, we might need a tool execution layer here.
  // Given our architecture, we'll let the Editor finish its turn, 
  // and the Resolver will be the next step once content is available.
  .addEdge("editor", "resolver") 
  .addEdge("resolver", END);

export const refineGenGraph = builder.compile();