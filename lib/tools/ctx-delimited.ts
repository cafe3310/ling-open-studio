import { ToolContextDef } from "./index";

/**
 * Strategy: Delimited Blocks (Markdown/Text Style)
 * 
 * A generic protocol for tools that handle large payloads (code, scripts, logs).
 * Format: === tool_name: primary_argument ===\n[Body Content]
 */
export const ToolCtxDelimited: ToolContextDef = {
  conceptFragment: `
### TOOL_USE_PROTOCOL (DELIMITED BLOCKS)
You have access to interactive tools. To use a tool, especially those requiring large code blocks, use the following delimited format:

- **Format**:
  === tool_name: primary_argument ===
  [Optional Body Content]

- **Rules**:
  - The "primary_argument" is typically a file path, a label, or a target name.
  - The "Body Content" starts on the line immediately after the "===" marker.
  - The block ends at the next "===" marker or the end of the message.
  - Use this instead of JSON to avoid escaping issues with HTML/JS code.
`,

  exampleFragment: `
#### Call Examples:

1. Writing a file:
=== write_file: /index.html ===
<!DOCTYPE html>
<html>...</html>

2. Executing JavaScript:
=== browser_js_eval: calculate_sum ===
const a = 1;
const b = 2;
return a + b;

3. Reading a file:
=== read_file: /config.json ===
`,

  returnExampleFragment: `
#### Result Example (System will provide this):
=== content: /index.html ===
[Actual file content here]

OR

=== result: calculate_sum ===
3
`,

  availableToolsFragment: (tools) => {
    return `#### Available Tools:\n${tools.map(t => `- ${t.name}: ${t.desc}`).join("\n")}`;
  },

  spliceSystemPrompt: (baseSystem, tools) => {
    if (tools.length === 0) return baseSystem;
    return [
      baseSystem,
      ToolCtxDelimited.conceptFragment,
      ToolCtxDelimited.availableToolsFragment(tools),
      ToolCtxDelimited.exampleFragment,
      ToolCtxDelimited.returnExampleFragment
    ].join("\n\n");
  },

  formatToolResult: (toolCallId, result) => {
    // If the result looks like code or large text, use 'content' label, otherwise 'result'
    const isLarge = typeof result === 'string' && (result.length > 100 || result.includes('\n'));
    const label = isLarge ? 'content' : 'result';
    return `=== ${label}: ${toolCallId} ===\n${result}`;
  },

  handleUserRejection: (responseWithTool) => {
    return "User rejected the tool execution request.";
  },

  parseResponse: (content) => {
    const calls: any[] = [];
    
    // Generic Pattern: === tool_name: primary_arg ===\nbody
    const blockPattern = /===\s*([\w-]+):\s*(.*?)\s*===([\s\S]*?)(?====|$)/g;
    let match;
    
    while ((match = blockPattern.exec(content)) !== null) {
      const toolName = match[1].trim();
      const param = match[2].trim();
      const body = match[3].trim();
      
      const args: any = {};

      // Smart Mapping based on common tool patterns
      if (toolName.includes('write')) {
        args.path = param;
        args.content = body;
      } else if (toolName.includes('read') || toolName.includes('list')) {
        args.path = param;
      } else if (toolName.includes('js_eval') || toolName.includes('eval')) {
        args.code = body;
        args.label = param; // Optional label
      } else {
        // Generic fallback: first arg is param, second is body
        args.param = param;
        args.body = body;
      }

      // Map short aliases to full tool names if known
      let mappedName = toolName;
      if (toolName === 'write') mappedName = 'write_file';
      if (toolName === 'read') mappedName = 'read_file';
      if (toolName === 'list') mappedName = 'list_directory';
      if (toolName === 'js') mappedName = 'browser_js_eval';

      calls.push({
        toolName: mappedName,
        args,
        callId: param || toolName
      });
    }

    if (calls.length === 0) return null;

    return {
      calls,
      strippedText: content.replace(/===\s*\w+:\s*.*?\s*===[\s\S]*?(?====|$)/g, "").trim()
    };
  },

  parseResult: (content) => {
    const results: any[] = [];
    const resPattern = /===\s*(content|result):\s*(.*?)\s*===([\s\S]*?)(?====|$)/g;
    let match;
    
    while ((match = resPattern.exec(content)) !== null) {
      results.push({
        callId: match[2].trim(),
        result: match[3].trim()
      });
    }

    if (results.length === 0) return null;

    return {
      results,
      strippedText: content.replace(/===\s*(content|result):\s*.*?\s*===[\s\S]*?(?====|$)/g, "").trim()
    };
  }
};