import { StateGraph, Annotation } from "@langchain/langgraph";
import { AIMessageChunk, BaseMessage } from "@langchain/core/messages";
import { createChatModel } from "@/app/lib/model";
import { v4 as uuidv4 } from "uuid";

// Initialize the model for this specific assistant
const assistantModel = createChatModel("Ling_1T", { temperature: 0.1 });

// Define a custom state similar to model-judger
export const GraphState = Annotation.Root({
  session_id: Annotation<string>,
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});

// Define the function that calls the model
async function callModel(state: typeof GraphState.State) {
  console.log("Calling model for session:", state.session_id);
  
  const response = await assistantModel.invoke(state.messages);
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
