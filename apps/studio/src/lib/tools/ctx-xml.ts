import { ToolContextDef, formatToolToContext } from "./index";

/**
 * Strategy: XML Tag
 * 
 * Instructs the model to use XML tags for tool invocation.
 * Best for: Anthropic Claude, DeepSeek R1, Mistral.
 */
export const ToolCtxXml: ToolContextDef = {
  conceptFragment: `
### TOOL_USE_PROTOCOL
You can invoke tools by wrapping your request in \
<tool_code>\
 tags.
- **Workflow**:
  1. Think about the parameters needed.
  2. Output \
<tool_code>\
 containing the tool name and parameters in JSON format.
  3. Stop generating and wait for the user to provide \
<tool_result>\
.
`,

  exampleFragment: `
#### Call Example:
<tool_code>
{
  "name": "tool_name",
  "arguments": {
    "arg1": "value"
  }
}
</tool_code>
`,

  returnExampleFragment: `
#### Result Example (User will provide this):
<tool_result>
  <id>tool_name_result</id>
  <content>
    Success
  </content>
</tool_result>
`,

  availableToolsFragment: (tools) => {
    const toolsStr = tools.map(formatToolToContext).join("\n\n");
    return `#### Available Tools:\n${toolsStr}`;
  },

  spliceSystemPrompt: (baseSystem, tools) => {
    if (tools.length === 0) return baseSystem;
    return [
      baseSystem,
      ToolCtxXml.conceptFragment,
      ToolCtxXml.availableToolsFragment(tools),
      ToolCtxXml.exampleFragment,
      ToolCtxXml.returnExampleFragment
    ].join("\n\n");
  },

  formatToolResult: (toolCallId, result) => {
    return `<tool_result>\n<id>${toolCallId}</id>\n<content>\n${JSON.stringify(result, null, 2)}
</content>
</tool_result>`;
  },

  handleUserRejection: (responseWithTool) => {
    return "User rejected the tool execution request.";
  },

  parseResponse: (content) => {
    const pattern = /<tool_code>([\s\S]*?)<\/tool_code>/g;
    const matches = [...content.matchAll(pattern)];
    if (matches.length === 0) return null;

    const calls = [];
    for (const match of matches) {
      try {
        const json = JSON.parse(match[1].trim());
        if (json.name && json.arguments) {
          calls.push({
            toolName: json.name,
            args: json.arguments,
            callId: `call_${json.name}_${Date.now()}`
          });
        }
      } catch (e) {}
    }

    if (calls.length === 0) return null;

    return {
      calls,
      strippedText: content.replace(pattern, "").trim()
    };
  },

  parseResult: (content) => {
    const pattern = /<tool_result>([\s\S]*?)<\/tool_result>/g;
    const matches = [...content.matchAll(pattern)];
    if (matches.length === 0) return null;

    const results = [];
    for (const match of matches) {
      try {
        const inner = match[1].trim();
        const idMatch = inner.match(/<id>(.*?)<\/id>/);
        const contentMatch = inner.match(/<content>([\s\S]*?)<\/content>/);
        if (idMatch && contentMatch) {
          results.push({
            callId: idMatch[1].trim(),
            result: contentMatch[1].trim()
          });
        }
      } catch (e) {}
    }

    if (results.length === 0) return null;

    return {
      results,
      strippedText: content.replace(pattern, "").trim()
    };
  }
};
