import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

/**
 * Zod Schemas for VFS operations.
 * These are shared between server (for tool definition) and client (for implementation if needed).
 */

export const WriteFileSchema = z.object({
  path: z.string().describe("The absolute path to the file within the VFS (e.g., '/workspace/index.html')"),
  content: z.string().describe("The text content to write to the file"),
});

export const ReadFileSchema = z.object({
  path: z.string().describe("The absolute path to the file to read"),
});

export const ListDirSchema = z.object({
  path: z.string().describe("The directory path to list"),
});

/**
 * Tool definitions for LangChain.
 * 
 * Note: Since the VFS resides in the browser's IndexedDB, these tools 
 * will typically be executed on the client side or via a bridge.
 * In a server-side LangGraph, these serve as the Tool Schema definitions.
 */

export const createVfsWriteTool = (handler?: (args: z.infer<typeof WriteFileSchema>) => Promise<string>) => 
  new DynamicStructuredTool({
    name: "vfs_write_file",
    description: "Write content to a file in the virtual filesystem. Useful for creating HTML, CSS, and JS files.",
    schema: WriteFileSchema,
    func: handler || (async () => "File write request accepted. (Client execution pending)"),
  });

export const createVfsReadTool = (handler?: (args: z.infer<typeof ReadFileSchema>) => Promise<string>) => 
  new DynamicStructuredTool({
    name: "vfs_read_file",
    description: "Read the content of a file from the virtual filesystem.",
    schema: ReadFileSchema,
    func: handler || (async () => "File read request accepted. (Client execution pending)"),
  });

export const createVfsListTool = (handler?: (args: z.infer<typeof ListDirSchema>) => Promise<string>) => 
  new DynamicStructuredTool({
    name: "vfs_list_dir",
    description: "List files and directories in a given path.",
    schema: ListDirSchema,
    func: handler || (async () => "List directory request accepted. (Client execution pending)"),
  });
