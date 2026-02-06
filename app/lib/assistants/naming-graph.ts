import { StateGraph, Annotation } from "@langchain/langgraph";
import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { createChatModel } from "@/app/lib/model";

// Define the state for the naming graph
export const NamingGraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  title: Annotation<string>,
});

// The node function that generates the title
async function generateTitleNode(state: typeof NamingGraphState.State) {
  // Use Ling-Mini for fast and efficient summarization
  const model = createChatModel("Ling_Flash", { temperature: 1 });

  // We only need the first few messages to get the context
  const contextMessages = state.messages.slice(0, 2);
  const conversationText = contextMessages
    .map(m => `${m._getType() === 'human' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const fullPrompt =
    "Task: Generate a very concise title (2-5 words) for the following conversation.\n" +
    "Constraint: The title must be in the same language as the conversation.\n" +
    "Do not use quotes, periods or prefixes like 'Title:'.\n" +
    "Respond with the title text.\n\n" +
    "<conversation>\n" +
    conversationText.slice(0, 120) +
    "</conversation>\n";

  const response = await model.invoke([new SystemMessage(fullPrompt)]);

  const generatedTitle = response.content.toString().trim();

  console.log("Generated Title:", generatedTitle);

  return { title: generatedTitle };
}

// Build the graph
const workflow = new StateGraph(NamingGraphState)
  .addNode("generate", generateTitleNode)
  .addEdge("__start__", "generate")
  .addEdge("generate", "__end__");

// Export the compiled graph
export const chatNameGenerator = workflow.compile();
