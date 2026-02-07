/**
 * Simplified Tool Definition Structure
 */
export interface ToolDef {
  name: string;
  desc: string;
  argsDesc: Record<string, string>;
  fn: (args: any) => Promise<string>;
}

/**
 * Tool Context Strategy Definition
 * 
 * Defines how tools are presented to the model, how responses are parsed, 
 * and how results are fed back.
 */
export interface ToolContextDef {
  /**
   * Descriptive fragment about the concept of tool use.
   * Injected into system prompt.
   */
  conceptFragment: string;

  /**
   * Example fragment showing how to call a tool.
   * Injected into system prompt.
   */
  exampleFragment: string;

  /**
   * Example fragment showing what a tool return looks like.
   * Injected into system prompt.
   */
  returnExampleFragment: string;

  /**
   * Function to generate the list of available tools formatted for the prompt.
   */
  availableToolsFragment: (tools: ToolDef[]) => string;

  /**
   * Function to splice the base system prompt with tool context.
   */
  spliceSystemPrompt: (baseSystem: string, tools: ToolDef[]) => string;

  /**
   * Function to format a tool execution result into a user message content.
   * This facilitates the "User-Mediated" loop.
   */
  formatToolResult: (toolCallId: string, result: any) => string;

  /**
   * Function to modify a response that contains a tool call but was rejected by the user.
   * e.g., turning a JSON tool call into a text explanation "I cannot run this tool."
   */
  handleUserRejection: (responseWithTool: string) => string;

  /**
   * Function to parse the model's response and extract tool calls.
   * Returns null if no tool call is found.
   */
  parseResponse: (response: string, tools: ToolDef[]) => { toolName: string; args: any; callId: string }[] | null;
}

/**
 * Converts a ToolDef into a string representation for system prompts.
 */
export function formatToolToContext(tool: ToolDef): string {
  const args = Object.entries(tool.argsDesc)
    .map(([name, desc]) => `  - ${name}: ${desc}`)
    .join("\n");

  return `TOOL: ${tool.name}
DESCRIPTION: ${tool.desc}
ARGUMENTS:
${args}`;
}
