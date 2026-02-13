import { StateGraph, START, END } from "@langchain/langgraph";
import { WebGenState } from "./state";
import { createChatModel } from "@/lib/model";
import { tracedInvoke } from "@/lib/model-tracer";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { vfsTools, ToolCtxDelimited } from "@/lib/tools";
import { designs, techStacks } from "./prompts";

/**
 * Node B (as per Design Doc): Idea Expander
 * Expands user prompt into a structured Product Plan (PRD).
 */
async function ideaExpanderNode(state: WebGenState, config: any) {
  const model = createChatModel("Ring_2_5_1T", {
    temperature: 0.7
  });
  const userPrompt = (state.messages.find(m => m._getType() === 'human')?.content as string) || "";

  // Find selected tech stack for its specific guidance
  const selectedTechStack = techStacks.find(ts => ts.id === state.config?.techStackId) || techStacks[0];

  const templateB = `
    You are a Product Manager at a high-end web studio. Your job is to expand a short user request into a comprehensive Product Requirements Document (PRD).

    User Prompt: ${userPrompt}
    Technical Constraints: ${selectedTechStack.description_expander}

    You should output a markdown document with the following sections:
    1. Page Concept: A 2-3 sentence overview of the site's purpose and "vibe".
    2. Content Structure: Define the sections of the page (e.g., Hero, Projects, Services, Contact).
    3. Detailed Copy: For each section, provide specific headlines and body text ideas.
    4. Component Needs: List specific interactive or UI components needed.
    5. Icon & Imagery Strategy: Suggest specific Lucide icon names and placeholder div with solid color.

    Output ONLY the markdown content.
  `.trim();

  const response = await tracedInvoke(model, [
    new SystemMessage(templateB)
  ], { graphInfo: { graphName: "InitialGen", nodeName: "IdeaExpander" }, modelId: "Ring_2_5_1T" });

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
  const model = createChatModel("Ring_2_5_1T", {
    temperature: 0.7
  });
  const userPrompt = state.user_request || "";
  // Find selected design aesthetic
  const selectedDesign = designs.find(d => d.id === state.config?.designId) || designs[0];

  const templateA = `
    You are a Design Director. Your job is to translate the product idea into a coherent visual system.

    Design Guide: ${selectedDesign.description_general}
    Colors: ${selectedDesign.description_color}
    Shapes: ${selectedDesign.description_shape}
    Fonts: ${selectedDesign.description_font}
    User requirements: ${userPrompt}

    You should output a markdown document with the following sections exactly:
    1. Color Palette: Define background, foreground, primary accent colors in Hex.
    2. Style Tokens: Define border radius, border styles, shadow styles using Tailwind classes.
    3. Typography: Suggest font family and Google Fonts URL.
    4. Layout Logic: Describe the overall layout style (e.g., grid, asymmetric, heavy typography).
    5. Decorative Elements: Suggest any additional visual elements (border, shadow, icons, patterns).

    Output ONLY the markdown content.
  `.trim();

  const response = await tracedInvoke(model, [
    new SystemMessage(templateA),
    new HumanMessage(`Product Plan Context:\n${state.product_plan}`)
  ], { graphInfo: { graphName: "InitialGen", nodeName: "StyleDirector" }, modelId: "Ring_2_5_1T" });

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
  const model = createChatModel("Ling_2_5_1T", {
    temperature: 0.5
  });
  const userPrompt = state.user_request || "";
  const selectedTechStack = techStacks.find(ts => ts.id === state.config?.techStackId) || techStacks[0];

  const templateC = `
    You are a Senior Frontend Developer. Your mission is to implement a complete, beautiful, and functional website based on the provided Design Spec and Product Plan.

    ### 1. PRODUCT PLAN (Requirements)
    ${state.product_plan}

    ### 2. VISUAL SPEC (Design)
    ${state.visual_spec}

    ### 3. TECHNICAL CONSTRAINTS
    - Use the following Boilerplate EXACTLY. Do NOT remove CDN links or the Icon initialization script.
    - Tech Stack Boilerplate:
    ${selectedTechStack.boilerplate_code}
    - Style Guide: ${selectedTechStack.description_style}

    ### 4. INSTRUCTIONS
    - Map the "Style Tokens" from the Visual Spec to Tailwind classes.
    - Use the primary accent color for key elements like buttons and icons.
    - Ensure the copy from the Product Plan is accurately reflected.
    - Use Lucide icons correctly: <i data-lucide="icon-name"></i>.
    - Write the final code to "/index.html" using the write_file tool.
  `.trim();

    const response = await tracedInvoke(model, [
      new SystemMessage(ToolCtxDelimited.spliceSystemPrompt(templateC, vfsTools)),
      new HumanMessage(`User Original Intent: ${userPrompt}`)
    ], { graphInfo: { graphName: "InitialGen", nodeName: "CodeGenerator" }, modelId: "Ling_2_5_1T" });

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
