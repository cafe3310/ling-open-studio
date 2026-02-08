import { ToolContextDef } from "./index";
import { ToolCtxJson } from "./ctx-json";
import { ToolCtxXml } from "./ctx-xml";
import { ToolCtxDelimited } from "./ctx-delimited";

const registry = {
  json: ToolCtxJson,
  xml: ToolCtxXml,
  text: ToolCtxDelimited,
} satisfies Record<string, ToolContextDef>;

/**
 * Automatically inferred from the registry keys.
 */
export type ToolParadigm = keyof typeof registry;

/**
 * Retrieves the tool context strategy based on the paradigm key.
 * Defaults to 'json' if the key is not found or invalid.
 */
export function getToolContextStrategy(paradigm: ToolParadigm | string | undefined | null): ToolContextDef {
  if (!paradigm) return ToolCtxJson;
  
  // Use index access with type assertion for lookup
  const strategy = (registry as Record<string, ToolContextDef>)[paradigm];
  return strategy || ToolCtxJson;
}