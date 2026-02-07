import { ToolDef } from "./index";

export const list_directory: ToolDef = {
  name: "list_directory",
  desc: "List files and directories at a specific path in the virtual file system. Always list before reading to ensure paths exist.",
  argsDesc: {
    path: "The absolute directory path to list (e.g., '/src'). Defaults to root '/'."
  },
  fn: async (args) => {
    // Client-side implementation placeholder
    return `List directory request for ${args.path} accepted.`;
  }
};

export const read_file: ToolDef = {
  name: "read_file",
  desc: "Read the text content of a file from the virtual file system.",
  argsDesc: {
    path: "The absolute path of the file to read (e.g., '/src/index.tsx')."
  },
  fn: async (args) => {
    return `Read file request for ${args.path} accepted.`;
  }
};

export const write_file: ToolDef = {
  name: "write_file",
  desc: "Write text content to a file in the virtual file system. Creates parent directories if they don't exist. Overwrites existing content.",
  argsDesc: {
    path: "The absolute path of the file to write (e.g., '/src/App.tsx').",
    content: "The full text content to be written to the file."
  },
  fn: async (args) => {
    return `Write file request for ${args.path} accepted.`;
  }
};

export const vfsTools = [list_directory, read_file, write_file];
