import { createChatModel } from "@/lib/model";
import { MuseState } from "./state";
import { buildWritingContext } from "../common/prompt-utils";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";

const MUSE_PROMPT = PromptTemplate.fromTemplate(`
You are a brilliant creative writing muse.
Your goal is to provide 3 distinct "Inspiration Cards" based on the current story context.

STORY SUMMARY/OUTLINE:
{storySummary}

CURRENT SEGMENT CONTEXT:
{context}

GENERATE 3 CARDS with the following types:
1. Plot: A surprising plot twist or an immediate conflict.
2. Atmosphere: A vivid sensory detail or a change in environmental mood.
3. Dialogue: A striking line of dialogue that could be said next.

OUTPUT FORMAT:
Return a JSON array of 3 objects with this schema:
{{
  "type": "Plot" | "Atmosphere" | "Dialogue",
  "title": string,
  "content": string
}}

RULES:
- Be extremely creative and evocative.
- Keep the content short (under 20 words per card).
- Ensure the cards feel like natural but exciting continuations or depth-additions.
- Output ONLY the JSON array.
`);

export const museNode = async (state: MuseState) => {
  const model = createChatModel("Ling_2_5_1T", { temperature: 0.85 });
  const writingContext = buildWritingContext(state.context, state.storySummary);
  
  const response = await model.invoke(await MUSE_PROMPT.format({ 
    context: writingContext,
    storySummary: state.storySummary || "No outline provided."
  }));
  
  try {
    const parser = new JsonOutputParser();
    const result = await parser.parse(response.content.toString());
    
    const inspirations = (Array.isArray(result) ? result : []).map(item => ({
      id: uuidv4(),
      ...item
    }));

    return { 
      inspirations,
      status: "success" as const 
    };
  } catch (e) {
    console.error("MuseWhisper parse error:", e);
    return { inspirations: [], status: "error" as const };
  }
};
