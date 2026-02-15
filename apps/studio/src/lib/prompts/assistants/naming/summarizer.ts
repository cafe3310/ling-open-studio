/**
 * Prompt for the Naming Assistant
 */

export const NAMING_SUMMARIZER_PROMPT = (conversationText: string) => `
Task: Generate a very concise title (2-5 words) for the following conversation.
Constraint: The title must be in the same language as the conversation.
Do not use quotes, periods or prefixes like 'Title:'.
Respond with the title text.

<conversation>
${conversationText}
</conversation>
`.trim();
