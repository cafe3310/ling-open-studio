import { createChatModel } from "@/lib/model";
import { NarrativeState } from "./state";
import { PromptTemplate } from "@langchain/core/prompts";

export const NARRATIVE_PROMPT = PromptTemplate.fromTemplate(`
You are a master novelist. Your task is to continue writing the story based on the provided context.
Maintain the style, tone, and pacing of the manuscript.

<story_foundation>
{storySummary}
</story_foundation>

<narrative_memory>
{historySummaries}
</narrative_memory>

<active_lore>
{activeLore}
</active_lore>

<creative_directives>
{activeInspirations}
</creative_directives>

<current_manuscript>
{recentText}
</current_manuscript>

INSTRUCTION:
- Continue the story from where it left off in <current_manuscript>.
- Deeply incorporate the directions in <creative_directives> if any are provided.
- Ensure logical consistency with <story_foundation> and <active_lore>.
- Write exactly ONE or TWO high-quality paragraphs.
- Output ONLY the story text, no meta-commentary.
`);

export const narrativeWriterNode = async (state: NarrativeState) => {
  const model = createChatModel("Ling_2_5_1T", { 
    temperature: 0.8,
  });

  const prompt = await NARRATIVE_PROMPT.format({
    storySummary: state.storySummary || "No overall story summary provided yet.",
    historySummaries: state.historySummaries || "Story is just beginning.",
    activeLore: state.activeLore || "No specific lore matched.",
    activeInspirations: state.activeInspirations || "No active creative inspirations.",
    recentText: state.recentText
  });

  // Note: Streaming is handled by the model.stream or by invoking the model directly in the API route if needed.
  // For LangGraph node consistency, we return the message. 
  const response = await model.invoke(prompt);
  return { generatedText: response.content.toString(), status: 'success' as const };
};
