/**
 * Protocol: Delimited Blocks (Markdown/Text Style)
 * 
 * A generic protocol for tools that handle large payloads (code, scripts, logs).
 * Format: === tool_name: primary_argument ===\n[Body Content]
 */

export const DELIMITED_PROTOCOL_CONCEPT = `
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
`.trim();

export const DELIMITED_PROTOCOL_EXAMPLES = `
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
`.trim();

export const DELIMITED_PROTOCOL_RETURNS = `
#### Result Example (System will provide this):
=== content: /index.html ===
[Actual file content here]

OR

=== result: calculate_sum ===
3
`.trim();
