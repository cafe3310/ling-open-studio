import { ToolContextDef, formatToolToContext } from "./index";

/**
 * Strategy: JSON Strict
 * 
 * Instructs the model to output a strict JSON object structure.
 * Best for: GPT-4, Llama 3, and strong instruction-following models.
 */
export const ToolCtxJson: ToolContextDef = {
  conceptFragment: `
### TOOL_USE_PROTOCOL
You have access to a set of client-side tools. To use a tool, you must output a JSON object strictly following the defined schema.
- **Trigger**: When you need external data or action, output the JSON immediately.
- **Constraints**: 
  - Do NOT wrap the JSON in markdown code blocks.
  - The JSON must be valid and parsable.
  - You can invoke multiple tools in one 
    array if needed.
`,

  exampleFragment: `
#### Call Example:
{
  "tool_calls": [
    {
      "id": "call_unique_id",
      "type": "function",
      "function": {
        "name": "tool_name",
        "arguments": "{\"arg1\": \"value\"}"
      }
    }
  ]
}`,

  returnExampleFragment: `
#### Result Example (User will provide this):
{
  "tool_call_result": {
    "toolCallId": "call_unique_id",
    "result": "Success"
  }
}`,

  availableToolsFragment: (tools) => {
    const toolsStr = tools.map(formatToolToContext).join("\n\n");
    return `#### Available Tools:\n${toolsStr}`;
  },

  spliceSystemPrompt: (baseSystem, tools) => {
    if (tools.length === 0) return baseSystem;
    return [
      baseSystem,
      ToolCtxJson.conceptFragment,
      ToolCtxJson.availableToolsFragment(tools),
      ToolCtxJson.exampleFragment,
      ToolCtxJson.returnExampleFragment
    ].join("\n\n");
  },

  formatToolResult: (toolCallId, result) => {
    return JSON.stringify({
      tool_call_result: {
        toolCallId: toolCallId,
        result: result
      }
    }, null, 2);
  },

  handleUserRejection: (responseWithTool) => {
    // Simple heuristic: if user rejects, we assume the response was just the JSON.
    // We return a text saying tool was rejected.
    return "User rejected the tool execution request.";
  },

  parseResponse: (content) => {
    try {
      const pattern = /\{[\s\S]*"tool_calls"[\s\S]*\}/;
      const match = content.match(pattern);
      if (!match) return null;

      const json = JSON.parse(match[0]);
      if (!json.tool_calls || !Array.isArray(json.tool_calls)) return null;

      const calls = json.tool_calls.map((call: any) => {
        let args = call.function.arguments;
        if (typeof args === 'string') {
          try { args = JSON.parse(args); } catch {}
        }
        return {
          toolName: call.function.name,
          args: args,
          callId: call.id || `call_${Date.now()}`
        };
      });

      return {
        calls,
        strippedText: content.replace(pattern, "").trim()
      };
    } catch (e) {
      return null;
    }
  },

  parseResult: (content) => {
    try {
      const pattern = /\{[\s\S]*"tool_call_result"[\s\S]*\}/;
      const match = content.match(pattern);
      if (!match) return null;

      const json = JSON.parse(match[0]);
      if (!json.tool_call_result) return null;

      const res = json.tool_call_result;
      return {
        results: [{
          callId: res.toolCallId,
          result: res.result
        }],
        strippedText: content.replace(pattern, "").trim()
      };
    } catch (e) {
      return null;
    }
  }
};
