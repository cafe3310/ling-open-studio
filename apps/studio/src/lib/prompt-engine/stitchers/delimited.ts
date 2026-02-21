import { DELIMITED_PROTOCOL_CONCEPT, DELIMITED_PROTOCOL_EXAMPLES, DELIMITED_PROTOCOL_RETURNS } from "../../prompts/shared";

/**
 * Stitching logic for Delimited Blocks protocol.
 */
export function stitchDelimited(baseSystem: string, tools: { name: string, desc: string }[]) {
  if (tools.length === 0) return baseSystem;

  const availableToolsFragment = `#### Available Tools:\n${tools.map(t => `- ${t.name}: ${t.desc}`).join("\n")}`;

  return [
    baseSystem,
    DELIMITED_PROTOCOL_CONCEPT,
    availableToolsFragment,
    DELIMITED_PROTOCOL_EXAMPLES,
    DELIMITED_PROTOCOL_RETURNS
  ].join("\n\n");
}
