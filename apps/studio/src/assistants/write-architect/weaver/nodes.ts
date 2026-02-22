import { createChatModel } from "@/lib/model";
import { WeaverState } from "./state";
import { buildWritingContext } from "../common/prompt-utils";
import { PromptTemplate } from "@langchain/core/prompts";

const PREDICT_PROMPT = PromptTemplate.fromTemplate(`
You are a fast-thinking creative writing assistant.
Predict the next 10-20 words to continue the following segment.

CONTEXT:
{context}

RULES:
- Predict EXACTLY how the sentence or paragraph would naturally continue.
- Keep the style, tone, and POV consistent.
- Limit to 15 words maximum.
- Output ONLY the predicted text. 
- If no good continuation is possible, output "..."
`);

export const predictorNode = async (state: WeaverState) => {
  const model = createChatModel("Ling_Flash", { 
    temperature: 0.3,
    maxTokens: 30
  });
  
  // Use prefixContext as the primary input content
  const context = buildWritingContext(state.prefixContext, state.storySummary);
  
  const response = await model.invoke(await PREDICT_PROMPT.format({ context }));
  let ghostText = response.content.toString().trim();
  
  // Clean up potential AI prefixes or "..."
  if (ghostText === "...") ghostText = null;
  
  return { ghostText, status: "success" as const };
};
