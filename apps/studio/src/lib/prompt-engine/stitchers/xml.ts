import { XML_PROTOCOL_CONCEPT, XML_PROTOCOL_EXAMPLES, XML_PROTOCOL_RETURNS } from "../../prompts/shared";

/**
 * Stitching logic for XML protocol.
 */
export function stitchXml(baseSystem: string, tools: { name: string, desc: string }[]) {
  if (tools.length === 0) return baseSystem;

  const availableToolsFragment = `#### Available Tools:\n${tools.map(t => `- ${t.name}: ${t.desc}`).join("\n")}`;

  return [
    baseSystem,
    XML_PROTOCOL_CONCEPT,
    availableToolsFragment,
    XML_PROTOCOL_EXAMPLES,
    XML_PROTOCOL_RETURNS
  ].join("\n\n");
}
