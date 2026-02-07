import { vfs } from "@/lib/vfs/core";

/**
 * Client-side tool implementations.
 * These functions run directly in the user's browser.
 */
export const clientTools = {
  browser_js_eval: async (args: { code: string }) => {
    console.log("[ClientTool: JS] Executing code:", args.code);
    try {
      // Using indirect eval to run in global scope
      const result = window.eval(args.code);
      console.log("[ClientTool: JS] Result:", result);
      return typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
    } catch (e: any) {
      console.error("[ClientTool: JS] Error:", e);
      return `Error executing JS: ${e.message}`;
    }
  },

  list_directory: async (args: { path: string }) => {
    console.log("[ClientTool: VFS] Listing directory:", args.path);
    try {
      const entries = await vfs.listDirectory(args.path || "/");
      console.log("[ClientTool: VFS] Found entries:", entries.length);
      return JSON.stringify(entries.map(e => e.name), null, 2);
    } catch (e: any) {
      console.error("[ClientTool: VFS] Error:", e);
      return `Error listing directory: ${e.message}`;
    }
  },

  read_file: async (args: { path: string }) => {
    console.log("[ClientTool: VFS] Reading file:", args.path);
    try {
      const content = await vfs.readFile(args.path);
      console.log("[ClientTool: VFS] File size:", content.length);
      return content;
    } catch (e: any) {
      console.error("[ClientTool: VFS] Error:", e);
      return `Error reading file: ${e.message}`;
    }
  },

  write_file: async (args: { path: string; content: string }) => {
    console.log("[ClientTool: VFS] Writing to file:", args.path);
    try {
      await vfs.writeFile(args.path, args.content);
      console.log("[ClientTool: VFS] Write successful.");
      return "Success";
    } catch (e: any) {
      console.error("[ClientTool: VFS] Error:", e);
      return `Error writing file: ${e.message}`;
    }
  },
};

export type ClientToolName = keyof typeof clientTools;
