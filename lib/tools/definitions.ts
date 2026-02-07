import { z } from "zod";

/**
 * Core Tool Definitions for the Prompt-Reinforced Paradigm.
 * These definitions are used to generate system prompts and 
 * facilitate the user-mediated tool call loop.
 */

export const BrowserJsEvalSchema = z.object({
  code: z.string().describe("The JavaScript code to execute in the browser environment."),
});

export const ListDirectorySchema = z.object({
  path: z.string().default("/").describe("The absolute directory path to list (e.g., '/src'). Defaults to root '/'."),
});

export const ReadFileSchema = z.object({
  path: z.string().describe("The absolute path of the file to read (e.g., '/src/index.tsx')."),
});

export const WriteFileSchema = z.object({
  path: z.string().describe("The absolute path of the file to write (e.g., '/src/App.tsx')."),
  content: z.string().describe("The full text content to be written to the file."),
});

export interface ToolDefinition {
  name: string;
  description: string;
  schema: z.ZodObject<any>;
}

export const TOOL_DEFINITIONS: Record<string, ToolDefinition> = {
  browser_js_eval: {
    name: "browser_js_eval",
    description: "Execute JavaScript code in the user's browser environment. Use this for calculations, data processing, or accessing browser APIs. Returns the result of the last expression or console logs.",
    schema: BrowserJsEvalSchema,
  },
  list_directory: {
    name: "list_directory",
    description: "List files and directories at a specific path in the virtual file system. Always list before reading to ensure paths exist.",
    schema: ListDirectorySchema,
  },
  read_file: {
    name: "read_file",
    description: "Read the text content of a file from the virtual file system.",
    schema: ReadFileSchema,
  },
  write_file: {
    name: "write_file",
    description: "Write text content to a file in the virtual file system. Creates parent directories if they don't exist. Overwrites existing content.",
    schema: WriteFileSchema,
  },
};

export type ToolName = keyof typeof TOOL_DEFINITIONS;
