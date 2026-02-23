import { createChatModel } from "@/lib/model";
import { KeeperState } from "./state";
import { buildWritingContext } from "../common/prompt-utils";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const KEEPER_PROMPT = PromptTemplate.fromTemplate(`
You are a master world-builder and lore keeper.
Your task is to analyze the following NEW ENTITIES and provide structured definitions and creative suggestions for each.

STORY CONTEXT:
{context}

NEW ENTITIES TO ANALYZE:
{entities}

FOR EACH ENTITY, provide:
1. Category: One of ['worldSettings', 'characters', 'concepts'].
2. Definition: A 1-2 sentence summary of who/what they are based on the context.
3. Suggestions: 3 short, creative fragments or traits that could expand this entity's role in the story (be imaginative but consistent).

OUTPUT FORMAT:
Return a JSON array of objects with this schema:
{{
  "name": string,
  "category": "worldSettings" | "characters" | "concepts",
  "definition": string,
  "suggestions": string[]
}}

RULES:
- Be concise.
- Suggestions should feel like "seeds" for future plot or world-building.
- Output ONLY the JSON array.
`);

export const keeperNode = async (state: KeeperState) => {
  const model = createChatModel("Ling_2_5_1T", { temperature: 0.7 });
  const writingContext = buildWritingContext(state.context, state.storySummary);
  
  const response = await model.invoke(await KEEPER_PROMPT.format({ 
    context: writingContext,
    entities: state.entityNames.join(", ")
  }));
  
  try {
    const parser = new JsonOutputParser();
    const result = await parser.parse(response.content.toString());
    return { 
      entries: Array.isArray(result) ? result : [],
      status: "success" as const 
    };
  } catch (e) {
    console.error("LoreKeeper parse error:", e);
    return { entries: [], status: "error" as const };
  }
};
