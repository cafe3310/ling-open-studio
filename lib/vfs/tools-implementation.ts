import { useVFS } from "./hooks";
import { useCallback } from "react";

/**
 * Hook to provide VFS tool implementations for the Assistant Runtime.
 */
export const useVFSTools = () => {
  const vfs = useVFS("global"); // WebGen currently uses global VFS

  const vfs_write_file = useCallback(async ({ path, content }: { path: string; content: string }) => {
    try {
      await vfs.writeFile(path, content);
      return `Successfully wrote to ${path}`;
    } catch (error: any) {
      return `Error writing file: ${error.message}`;
    }
  }, [vfs]);

  const vfs_read_file = useCallback(async ({ path }: { path: string }) => {
    try {
      const content = await vfs.readFile(path);
      return content || "(File is empty)";
    } catch (error: any) {
      return `Error reading file: ${error.message}`;
    }
  }, [vfs]);

  const vfs_list_dir = useCallback(async ({ path }: { path: string }) => {
    try {
      const items = await vfs.readDir(path);
      return items.map(i => `${i.type === 'dir' ? '[DIR]' : '[FILE]'} ${i.name}`).join("\n");
    } catch (error: any) {
      return `Error listing directory: ${error.message}`;
    }
  }, [vfs]);

  return {
    vfs_write_file,
    vfs_read_file,
    vfs_list_dir,
  };
};
