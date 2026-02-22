import { createChatModel } from "@/lib/model";
import { PreprocessorState } from "./state";
import { buildWritingContext } from "../common/prompt-utils";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const SUMMARY_PROMPT = PromptTemplate.fromTemplate(`
You are a creative writing assistant. 
Your task is to summarize the following segment of a story into a single, elegant sentence that captures the core narrative beat.

CONTEXT:
{context}

RULES:
- Limit to 20 words.
- Focus on the main action or emotional pivot.
- Maintain the tone of the original writing.
- Output ONLY the single sentence.
`);

const ENTITY_PROMPT = PromptTemplate.fromTemplate(`
You are a world-building assistant. 
Identify the key entities (Characters, Locations, Significant Objects, or Unique Concepts) within the provided story segment.

CONTEXT:
{context}

RULES:
- Output as a JSON array of strings.
- Only include entities that are explicitly mentioned or strongly implied.
- Limit to 5 entities.
- Output ONLY the JSON array (e.g., ["Elara", "The Clockwork Library", "Shadow Ink"]).
`);

export const summarizerNode = async (state: PreprocessorState) => {
  const model = createChatModel("Ling_Flash", { temperature: 0.3 });
  const context = buildWritingContext(state.content, state.storySummary);
  
  const response = await model.invoke(await SUMMARY_PROMPT.format({ context }));
  return { summary: response.content.toString().trim() };
};

export const entityExtractorNode = async (state: PreprocessorState) => {
  const model = createChatModel("Ling_Flash", { temperature: 0 });
  const context = buildWritingContext(state.content, state.storySummary);
  
  const response = await model.invoke(await ENTITY_PROMPT.format({ context }));
  
  try {
    const parser = new JsonOutputParser();
    const entities = await parser.parse(response.content.toString());
    return { extractedEntities: Array.isArray(entities) ? entities : [] };
  } catch (e) {
    console.error("Failed to parse entities:", e);
    return { extractedEntities: [] };
  }
};
