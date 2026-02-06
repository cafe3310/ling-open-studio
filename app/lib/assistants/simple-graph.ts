import { StateGraph, Annotation, RunnableConfig } from "@langchain/langgraph";
import { AIMessageChunk, BaseMessage, SystemMessage } from "@langchain/core/messages";
import { createChatModel, MODEL_CONFIG } from "@/app/lib/model";
import { v4 as uuidv4 } from "uuid";

// Define a custom state similar to model-judger
export const GraphState = Annotation.Root({
  session_id: Annotation<string>,
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});

// Define the function that calls the model
async function callModel(state: typeof GraphState.State, config: RunnableConfig) {
  const modelConfig = config.configurable?.modelConfig;
  const modelId = modelConfig?.modelId || "Ling_1T";
  const temperature = modelConfig?.temperature ?? 0.7;
  const systemPrompt = modelConfig?.systemPrompt;

  console.log(`Calling model ${modelId} temp ${temperature} for session:`, state.session_id);

  const model = createChatModel(modelId as any, { temperature });

  const messages = [...state.messages];
  if (systemPrompt) {
    // Check if there's already a system message, if not add it
    const hasSystemMessage = messages.some(m => m._getType() === "system");
    if (!hasSystemMessage) {
      messages.unshift(new SystemMessage(systemPrompt));
    }
  }

  const response = await model.invoke(messages);

  console.log("Model response:", response.content.toString().substring(0, 50), "...");

  const chunk = new AIMessageChunk({
    content: response.content,
    id: response.id || uuidv4(),
    name: "agent",
  });

  return { messages: [chunk] };
}

// Create the graph
const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__");

// Compile the graph
export const simpleGraph = workflow.compile();
