import { ToolContextDef } from "./index";

/**
 * Strategy: XML Tag
 *
 * Instructs the model to use XML tags for tool invocation.
 * Best for: Anthropic Claude, DeepSeek R1, Mistral.
 */
export const ToolCtxXml: ToolContextDef = {
  formatToolResult: (toolCallId, result) => {
    return `<tool_result>\n<id>\${toolCallId}</id>\n<content>\n\${JSON.stringify(result, null, 2)}
</content>
</tool_result>`;
  },

  handleUserRejection: (responseWithTool) => {
    return "User rejected the tool execution request.";
  },

  parseResponse: (content) => {
    const pattern = /<tool_call>([\s\S]*?)<\/tool_call>/g;
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
