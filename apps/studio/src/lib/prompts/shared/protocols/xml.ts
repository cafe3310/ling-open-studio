/**
 * Protocol: XML Tag
 */

export const XML_PROTOCOL_CONCEPT = `
### TOOL_USE_PROTOCOL
You can invoke tools by wrapping your request in <tool_code> tags.
- **Workflow**:
  1. Think about the parameters needed.
  2. Output <tool_code> containing the tool name and parameters in JSON format.
  3. Stop generating and wait for the user to provide <tool_result>.
`.trim();

export const XML_PROTOCOL_EXAMPLES = `
#### Call Example:
<tool_code>
{
  "name": "tool_name",
  "arguments": {
    "arg1": "value"
  }
}
</tool_code>
`.trim();

export const XML_PROTOCOL_RETURNS = `
#### Result Example (User will provide this):
<tool_result>
  <id>tool_name_result</id>
  <content>
    Success
  </content>
</tool_result>
`.trim();
