import { TOOL_DEFINITIONS, ToolName, ToolDefinition } from "./definitions";

export type PromptStrategyProfile = 'JSON_Strict' | 'XML_Tag';

/**
 * ToolContextBuilder generates system prompt fragments for the 
 * "Prompt-Reinforced" tool call paradigm.
 */
export class ToolContextBuilder {
  private enabledTools: ToolName[] = [];
  private profile: PromptStrategyProfile = 'JSON_Strict';

  constructor(profile: PromptStrategyProfile = 'JSON_Strict') {
    this.profile = profile;
  }

  setTools(tools: ToolName[]) {
    this.enabledTools = tools;
    return this;
  }

  /**
   * Generates the complete tool use protocol and tool definitions
   * to be inserted into the system prompt.
   */
  build(): string {
    if (this.enabledTools.length === 0) return "";

    const parts: string[] = [];

    // 1. Tool Use Protocol (Introduction)
    parts.push(this.getProtocolIntro());

    // 2. Tool Definitions
    parts.push("#### Available Tools:");
    for (const toolName of this.enabledTools) {
      const tool = TOOL_DEFINITIONS[toolName];
      if (tool) {
        parts.push(this.getToolDefinition(tool));
      }
    }

    return parts.join("\n\n");
  }

  private getProtocolIntro(): string {
    if (this.profile === 'JSON_Strict') {
      return `### TOOL_USE_PROTOCOL
You have access to a set of client-side tools. To use a tool, you must output a JSON object strictly following the 	tool_calls\t schema defined below.
- **Trigger**: When you need external data or action, output the JSON immediately.
- **Constraints**: 
  - Do NOT wrap the JSON in markdown code blocks (like 	\tjson).
  - The JSON must be valid and parsable.
  - You can invoke multiple tools in one 	tool_calls\t array if needed.
- **Mental Model**: 
  - If you need to read a file, always list the directory first to ensure the path is correct.
  - If you are writing a file, provide the full content.`;
    }

    return `### TOOL_USE_PROTOCOL
You can invoke tools by wrapping your request in \t<tool_code>\t tags.
- **Workflow**:
  1. Think about the parameters needed.
  2. Output \t<tool_code>\t containing the tool name and parameters in JSON format.
  3. Stop generating and wait for the user to provide \t<tool_result>\t.`;
  }

  private getToolDefinition(tool: ToolDefinition): string {
    if (this.profile === 'JSON_Strict') {
      return `##### Tool: ${tool.name}
- **Description**: ${tool.description}
- **Schema**:
  {
    "type": "function",
    "function": {
      "name": "${tool.name}",
      "parameters": ${JSON.stringify(this.getSimplifiedSchema(tool.schema), null, 2)}
    }
  }`;
    }

    return `##### Tool: ${tool.name}
- **Description**: ${tool.description}
- **Usage Format**:
  <tool_code>
  {
    "name": "${tool.name}",
    "arguments": ${JSON.stringify(this.getSimplifiedSchema(tool.schema), null, 2)}
  }
  </tool_code>`;
  }

  /**
   * Helper to turn a Zod schema into a simplified readable object for prompts.
   */
  private getSimplifiedSchema(schema: any): any {
    const shape = schema.shape;
    const result: any = {
      type: "object",
      properties: {},
      required: [],
    };

    for (const key in shape) {
      const field = shape[key];
      const isOptional = field.isOptional();
      
      // Navigate through Zod wrappers (Default, Optional) to find the core definition
      let currentField = field;
      while (currentField._def.innerType) {
        currentField = currentField._def.innerType;
      }

      result.properties[key] = {
        type: this.getZodType(field),
        description: field.description || field._def.description || "",
      };

      if (!isOptional) {
        result.required.push(key);
      }
    }

    return result;
  }

  private getZodType(field: any): string {
    let current = field;
    // Unwrap Default and Optional
    while (current._def.innerType) {
      current = current._def.innerType;
    }

    const typeName = current._def.typeName;
    if (typeName === 'ZodString') return 'string';
    if (typeName === 'ZodNumber') return 'number';
    if (typeName === 'ZodBoolean') return 'boolean';
    if (typeName === 'ZodArray') return 'array';
    return 'string'; // Default to string for simplicity in prompt
  }

  /**
   * Static helper to generate a result template (simulating what the user sends back)
   */
  static getResultTemplate(callId: string, result: any, profile: PromptStrategyProfile = 'JSON_Strict'): string {
    if (profile === 'JSON_Strict') {
      return JSON.stringify({
        tool_call_result: {
          toolCallId: callId,
          result: result
        }
      }, null, 2);
    }

    return `<tool_result>
  <id>${callId}</id>
  <content>
    ${JSON.stringify(result, null, 2)}
  </content>
</tool_result>`;
  }
}
