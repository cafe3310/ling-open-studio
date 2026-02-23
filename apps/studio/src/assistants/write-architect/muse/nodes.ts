import { createChatModel } from "@/lib/model";
import { MuseState } from "./state";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const MUSE_PROMPT = PromptTemplate.fromTemplate(`
You are a master creative writing mentor and literary editor. 
Based on the provided story context, your goal is to generate 3 diverse and compelling "Inspirations" to spark the author's creativity for the next narrative beats.

<story_foundation>
{storySummary}
</story_foundation>

<narrative_memory>
{historySummaries}
</narrative_memory>

<manuscript_context>
{recentContext}
</manuscript_context>

GUIDELINES:
1. Provide exactly 3 inspirations, one for each type:
   - "Plot": A potential conflict, mystery, or strategic pivot.
   - "Atmosphere": A sensory detail, thematic metaphor, or environmental shift.
   - "Dialogue": A poignant line, a sharp retort, or a character-defining statement.
2. Be specific and evocative. Avoid cliches.
3. Ensure they are logically derived from the current context but push the boundary of what could happen next.
4. Output format: A JSON array of 3 objects with keys: "id", "type", "title", "content". Use unique short strings for IDs.

Example Output:
[
  {{ "id": "m1", "type": "Plot", "title": "The Silent Witness", "content": "Elara notices a small, blood-stained locket under the rug—one that belonged to the gardener who disappeared last winter." }},
  {{ "id": "m2", "type": "Atmosphere", "title": "Suffocating Stillness", "content": "The ticking of the grandfather clock begins to sound like a heavy hammer against lead, vibrating through the floorboards." }},
  {{ "id": "m3", "type": "Dialogue", "title": "A Bitter Truth", "content": "'Memory is a parasite, Silas. It feeds on what we used to be until there's nothing left but the ghosts of our regrets.'" }}
]

Output ONLY the JSON array.
`);

export const museGeneratorNode = async (state: MuseState) => {
  const model = createChatModel("Ling_2_5_1T", { 
    temperature: 0.8,
    response_format: { type: "json_object" } 
  });
  
  const prompt = await MUSE_PROMPT.format({
    storySummary: state.storySummary || "No overall story summary provided yet.",
    historySummaries: state.historySummaries || "Story is just beginning.",
    recentContext: state.recentContext
  });

  const response = await model.invoke(prompt);
  
  try {
    const parser = new JsonOutputParser();
    const result = await parser.parse(response.content.toString());
    return { 
      inspirations: Array.isArray(result) ? result : [],
      status: 'success' as const
    };
  } catch (e) {
    console.error("Failed to parse muse inspirations:", e);
    return { inspirations: [], status: 'error' as const };
  }
};
