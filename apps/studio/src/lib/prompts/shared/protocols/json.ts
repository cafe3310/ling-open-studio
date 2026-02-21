/**
 * Protocol: JSON Strict
 */

export const JSON_PROTOCOL_CONCEPT = `
### TOOL_USE_PROTOCOL
You have access to a set of client-side tools. To use a tool, you must output a JSON object strictly following the defined schema.
- **Trigger**: When you need external data or action, output the JSON immediately.
- **Constraints**: 
  - Do NOT wrap the JSON in markdown code blocks.
  - The JSON must be valid and parsable.
  - You can invoke multiple tools in one array if needed.
  - RESPOND IN 'ASSISTANT' ROLE ONLY, DO NOT RESPOND IN 'TOOL' ROLE.
`.trim();

export const JSON_PROTOCOL_EXAMPLES = `
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
}`.trim();

export const JSON_PROTOCOL_RETURNS = `
#### Result Example (User will provide this):
{
  "tool_call_result": {
    "toolCallId": "call_unique_id",
    "result": "Success"
  }
}`.trim();
