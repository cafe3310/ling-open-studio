import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { createChatModel } from "@/lib/model";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { techStacks } from "./prompts";

/**
 * Node D (as per Design Doc): Editor / Reader
 * Identifies which files need to be read to satisfy user feedback.
 */
async function editorNode(state: WebGenState, config: any) {
  const model = createChatModel(config.configurable?.modelConfig);
  
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
- Use the Delimited Blocks Protocol to read the file.

### PROTOCOL (CRITICAL)
=== read: [file_path] ===
`.trim();

  const response = await model.invoke([
    new SystemMessage(templateD),
    ...state.messages.slice(0, -1) // Context without the latest prompt to keep focus
  ]);

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
  const model = createChatModel(config.configurable?.modelConfig);
  const selectedTechStack = techStacks.find(ts => ts.id === state.config?.techStackId) || techStacks[0];

  const templateE = `
You are a Senior Frontend Developer. You have been provided with the content of a file and a specific modification request.

### 1. USER INSTRUCTION
${state.messages[state.messages.length - 2].content} (Previous instruction)

### 2. TECHNICAL RULES
- Tech Stack: ${selectedTechStack.description_style}
- Protocol: Use delimited blocks === write: path === for output.
- Do NOT output partial diffs. Output the ENTIRE file content.

### 3. INSTRUCTIONS
- Analyze the code provided in the conversation history (as content blocks).
- Apply the requested changes accurately.
- Ensure the resulting page is still valid and functional.

### PROTOCOL (CRITICAL)
=== write: [file_path] ===
[Full content here]
`.trim();

  const response = await model.invoke([
    new SystemMessage(templateE),
    ...state.messages
  ]);

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