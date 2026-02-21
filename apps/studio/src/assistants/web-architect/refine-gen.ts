import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { createChatModel } from "@/lib/model";
import { tracedInvoke } from "@/lib/model-tracer";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { vfsTools } from "@/lib/tools";
import { WebArchitect } from "@/lib/prompts";
import { PromptBuilder } from "@/lib/prompt-engine";

/**
 * Node D (as per Design Doc): Editor / Reader
 * Identifies which files need to be read to satisfy user feedback.
 */
async function editorNode(state: WebGenState, config: any) {
  const model = createChatModel("Ling_2_5_1T", {
    temperature: 0.7
  });

  // In a real scenario, we would use list_directory tool here to get the file list.
  // For now, we assume /index.html is the main target.
  const fileList = ["/index.html"];

  const baseTemplateD = WebArchitect.WEB_EDITOR_PROMPT(
    state.messages[state.messages.length - 1].content as string,
    fileList
  );

  const enhancedPromptD = PromptBuilder.build({
    basePrompt: baseTemplateD,
    tools: vfsTools.map(t => ({ name: t.name, desc: t.desc })),
    paradigm: 'delimited',
    includeStandardConstraints: true
  });

  const response = await tracedInvoke(model, [
    new SystemMessage(enhancedPromptD),
    ...state.messages.slice(0, -1) // Context without the latest prompt to keep focus
  ], { graphInfo: { graphName: "RefineGen", nodeName: "WebEditor" }, modelId: "Ling_2_5_1T" });

  // Add node metadata for UI identification
  (response as any).metadata = { langgraph_node: "refine" };

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
  const model = createChatModel("Ling_2_5_1T", {
    temperature: 0.1
  });
  const selectedTechStack = WebArchitect.techStacks.find(ts => ts.id === state.config?.techStackId) || WebArchitect.techStacks[0];

  const baseTemplateE = WebArchitect.WEB_RESOLVER_PROMPT(
    state.messages[state.messages.length - 2].content as string,
    selectedTechStack.description_style
  );

  const enhancedPromptE = PromptBuilder.build({
    basePrompt: baseTemplateE,
    tools: vfsTools.map(t => ({ name: t.name, desc: t.desc })),
    paradigm: 'delimited',
    includeStandardConstraints: true
  });

  const response = await tracedInvoke(model, [
    new SystemMessage(enhancedPromptE),
    ...state.messages
  ], { graphInfo: { graphName: "RefineGen", nodeName: "WebResolver" }, modelId: "Ling_2_5_1T" });

  // Add node metadata for UI identification
  (response as any).metadata = { langgraph_node: "refine" };

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
