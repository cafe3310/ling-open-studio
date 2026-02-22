import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { createChatModel } from "@/lib/model";
import { tracedInvoke } from "@/lib/model-tracer";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { vfsTools } from "@/lib/tools";
import { WebArchitect } from "@/lib/prompts";
import { PromptBuilder } from "@/lib/prompt-engine";

/**
 * Node B (as per Design Doc): Idea Expander
 * Expands user prompt into a structured Product Plan (PRD).
 */
async function ideaExpanderNode(state: WebGenState, config: any) {
  const modelKey = (state.config?.designModelId as any) || "Ling_2_5_1T";
  const model = createChatModel(modelKey as any, {
    temperature: 0.7
  });
  const userPrompt = (state.messages.find(m => m._getType() === 'human')?.content as string) || "";

  // Find selected tech stack for its specific guidance
  const selectedTechStack = WebArchitect.techStacks.find(ts => ts.id === state.config?.techStackId) || WebArchitect.techStacks[0];

  const templateB = WebArchitect.IDEA_EXPANDER_PROMPT(userPrompt, selectedTechStack.description_expander);

  const response = await tracedInvoke(model, [
    new SystemMessage(templateB)
  ], { graphInfo: { graphName: "InitialGen", nodeName: "IdeaExpander" }, modelId: modelKey });

  // Add node metadata for UI identification
  (response as any).metadata = { langgraph_node: "idea_expander" };

  return {
    messages: [response],
    user_request: userPrompt,
    product_plan: response.content as string,
    status: 'planning' as const
  };
}

/**
 * Node A (as per Design Doc): Style Director
 * Translates the product idea into a visual spec (Markdown).
 */
async function styleDirectorNode(state: WebGenState, config: any) {
  const modelKey = (state.config?.designModelId as any) || "Ling_2_5_1T";
  const model = createChatModel(modelKey as any, {
    temperature: 0.7
  });
  const userPrompt = state.user_request || "";
  // Find selected design aesthetic
  const selectedDesign = WebArchitect.designs.find(d => d.id === state.config?.designId) || WebArchitect.designs[0];

  const templateA = WebArchitect.STYLE_DIRECTOR_PROMPT(userPrompt, selectedDesign);

  const response = await tracedInvoke(model, [
    new SystemMessage(templateA),
    new HumanMessage(`Product Plan Context:\n${state.product_plan}`)
  ], { graphInfo: { graphName: "InitialGen", nodeName: "StyleDirector" }, modelId: modelKey });

  // Add node metadata for UI identification
  (response as any).metadata = { langgraph_node: "style_director" };

  return {
    messages: [response],
    visual_spec: response.content as string,
    status: 'designing' as const
  };
}

/**
 * Node C (as per Design Doc): Code Generator
 * Combines Plan and Style into a final implementation call.
 */
async function codeGeneratorNode(state: WebGenState, config: any) {
  const modelKey = (state.config?.codeModelId as any) || "Ling_2_5_1T";
  const model = createChatModel(modelKey as any, {
    temperature: 0.5
  });
  const userPrompt = state.user_request || "";
  const selectedTechStack = WebArchitect.techStacks.find(ts => ts.id === state.config?.techStackId) || WebArchitect.techStacks[0];

  const baseTemplateC = WebArchitect.CODE_GENERATOR_PROMPT(state.product_plan || "", state.visual_spec || "", selectedTechStack);
  
  const enhancedPromptC = PromptBuilder.build({
    basePrompt: baseTemplateC,
    tools: vfsTools.map(t => ({ name: t.name, desc: t.desc })),
    paradigm: 'delimited',
    includeStandardConstraints: true
  });

    const response = await tracedInvoke(model, [
      new SystemMessage(enhancedPromptC),
      new HumanMessage(`User Original Intent: ${userPrompt}`)
    ], { graphInfo: { graphName: "InitialGen", nodeName: "CodeGenerator" }, modelId: modelKey });

    console.log(`[InitialGen/CodeGenerator] Node execution finished. Output length: ${response.content.toString().length}`);

    // Add node metadata for UI identification
    (response as any).metadata = { langgraph_node: "code_generator" };

    return {
      messages: [response],
      status: 'coding' as const
    };
  }
// Build Graph: B (Idea) -> A (Style) -> C (Code)
const builder = new StateGraph(WebGenState)
  .addNode("idea_expander", ideaExpanderNode)
  .addNode("style_director", styleDirectorNode)
  .addNode("code_generator", codeGeneratorNode)
  .addEdge(START, "idea_expander")
  .addEdge("idea_expander", "style_director")
  .addEdge("style_director", "code_generator")
  .addEdge("code_generator", END);

export const initialGenGraph = builder.compile();
