import { JSON_PROTOCOL_CONCEPT, JSON_PROTOCOL_EXAMPLES, JSON_PROTOCOL_RETURNS } from "../../prompts/shared";

/**
 * Stitching logic for JSON protocol.
 */
export function stitchJson(baseSystem: string, tools: { name: string, desc: string }[]) {
  if (tools.length === 0) return baseSystem;

  // Note: JSON protocol might need more structured tool definitions in the future,
  // but for now we follow the existing pattern.
  const availableToolsFragment = `#### Available Tools:\n${tools.map(t => `- ${t.name}: ${t.desc}`).join("\n")}`;

  return [
    baseSystem,
    JSON_PROTOCOL_CONCEPT,
    availableToolsFragment,
    JSON_PROTOCOL_EXAMPLES,
    JSON_PROTOCOL_RETURNS
  ].join("\n\n");
}
