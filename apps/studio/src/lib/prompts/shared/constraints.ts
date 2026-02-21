/**
 * Shared Output Constraints
 */

export const BASIC_CONSTRAINTS = `
### Output Constraints
- Respond in the SAME LANGUAGE as the user prompt unless specified otherwise.
- Be concise and professional.
- Do NOT include any preambles like "Certainly!" or "Here is the...".
- Respond ONLY with the requested content (Markdown, Code, or JSON).
`.trim();

export const FORMATTING_CONSTRAINTS = `
### Formatting Rules
- Use valid Markdown for documents.
- Use properly escaped strings in JSON if applicable.
- Ensure code blocks are correctly labeled with their language (e.g., html, typescript).
`.trim();
