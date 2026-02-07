import { vfs } from "@/lib/vfs/core";

/**
 * Client-side tool implementations.
 * These functions run directly in the user's browser.
 */
export const clientTools = {
  browser_js_eval: async (args: { code: string }) => {
    try {
      // Using indirect eval to run in global scope
      const result = window.eval(args.code);
      return typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
    } catch (e: any) {
      return `Error executing JS: ${e.message}`;
    }
  },

  list_directory: async (args: { path: string }) => {
    try {
      const entries = await vfs.listDirectory(args.path || "/");
      return JSON.stringify(entries.map(e => e.name), null, 2);
    } catch (e: any) {
      return `Error listing directory: ${e.message}`;
    }
  },

  read_file: async (args: { path: string }) => {
    try {
      const content = await vfs.readFile(args.path);
      return content;
    } catch (e: any) {
      return `Error reading file: ${e.message}`;
    }
  },

  write_file: async (args: { path: string; content: string }) => {
    try {
      await vfs.writeFile(args.path, args.content);
      return "Success";
    } catch (e: any) {
      return `Error writing file: ${e.message}`;
    }
  },
};

export type ClientToolName = keyof typeof clientTools;
