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

  parseResponse: (response, tools) => {
    console.log("[ToolCtxXml] Parsing response:", response.substring(0, 100) + "...");
    // Regex to capture content inside <tool_code> tags
    const regex = /<tool_code>([\s\S]*?)<\/tool_code>/g;
    const matches = [...response.matchAll(regex)];
    
    console.log("[ToolCtxXml] Regex matches found:", matches.length);

    if (matches.length === 0) return null;

    const parsedCalls = [];
    for (const match of matches) {
      try {
        const content = match[1].trim();
        console.log("[ToolCtxXml] Processing match content:", content.substring(0, 50) + "...");
        
        // Assuming content is JSON as per protocol
        const json = JSON.parse(content);
        if (json.name && json.arguments) {
          parsedCalls.push({
            toolName: json.name,
            args: json.arguments,
            callId: `call_${json.name}_${Date.now()}` // XML usually doesn't strictly enforce IDs in call
          });
        }
      } catch (e) {
        console.error("[ToolCtxXml] Error parsing XML tool content:", e);
      }
    }
    
    return parsedCalls.length > 0 ? parsedCalls : null;
  }
};
