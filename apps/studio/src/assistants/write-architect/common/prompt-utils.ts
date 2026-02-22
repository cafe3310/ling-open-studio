/**
 * Constructs a comprehensive context for Writing Assistants,
 * with clear placeholders for un-implemented features.
 */
export const buildWritingContext = (
  content: string, 
  storySummary?: string,
  options: { includePlaceholders?: boolean } = { includePlaceholders: true }
) => {
  let context = `STORY SUMMARY:\n${storySummary || "No overall story summary provided yet."}\n\n`;
  
  if (options.includePlaceholders) {
    context += `--- ACTIVE INSPIRATIONS (Placeholder) ---\n[暂时未开发: ACTIVE_INSPIRATIONS_HERE]\n\n`;
    context += `--- MATCHED LORE/KNOWLEDGE (Placeholder) ---\n[暂时未开发: KB_MATCHED_LORE_HERE]\n\n`;
  }
  
  context += `CURRENT SEGMENT CONTENT:\n${content}`;
  
  return context;
};

