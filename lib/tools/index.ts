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
 * Structured tool call extracted from text
 */
export interface ToolCall {
  toolName: string;
  args: any;
  callId: string;
}

/**
 * Result of parsing an assistant message
 */
export interface ToolParsedResponse {
  calls: ToolCall[];
  strippedText: string; // Content with tool blocks removed
}

/**
 * Structured tool result extracted from text
 */
export interface ToolResult {
  callId: string;
  result: any;
}

/**
 * Result of parsing a user result message
 */
export interface ToolParsedResult {
  results: ToolResult[];
  strippedText: string; // Content with tool result blocks removed
}

/**
 * Tool Context Strategy Definition
 */
export interface ToolContextDef {
  /**
   * Descriptive fragment about the concept of tool use.
   */
  conceptFragment: string;

  /**
   * Example fragment showing how to call a tool.
   */
  exampleFragment: string;

  /**
   * Example fragment showing what a tool return looks like.
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
   */
  formatToolResult: (toolCallId: string, result: any) => string;

  /**
   * Function to modify a response that contains a tool call but was rejected by the user.
   */
  handleUserRejection: (responseWithTool: string) => string;

  /**
   * Parses the assistant's response for tool calls.
   */
  parseResponse: (content: string) => ToolParsedResponse | null;

  /**
   * Parses the user's message for tool results.
   */
  parseResult: (content: string) => ToolParsedResult | null;
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
