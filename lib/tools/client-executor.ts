import { vfs } from "@/lib/vfs/core";

/**
 * Mount Map: Maps virtual paths (seen by agent) to physical paths (in VFS)
 * e.g., { "/": "/workspace/sessions/123/", "/system": "/system/" }
 */
type MountMap = Record<string, string>;

/**
 * Resolves a virtual path to a physical VFS path based on mount points.
 * Finds the longest matching prefix in the mount map.
 */
const resolveMountPath = (virtualPath: string, mounts: MountMap) => {
  const normalized = virtualPath.startsWith("/") ? virtualPath : "/" + virtualPath;

  // Sort mounts by length descending to find most specific match first
  const sortedPrefixes = Object.keys(mounts).sort((a, b) => b.length - a.length);

  for (const prefix of sortedPrefixes) {
    if (normalized.startsWith(prefix)) {
      const physicalPrefix = mounts[prefix];
      // Replace the virtual prefix with the physical one
      // Handle the case where prefix is just "/" carefully
      const suffix = normalized.slice(prefix.length);

      // Ensure clean join
      let result = physicalPrefix;
      if (!result.endsWith("/")) result += "/";
      if (suffix.startsWith("/")) result += suffix.slice(1);
      else result += suffix;

      return result.replace(/\/+/g, '/');
    }
  }

  // Fallback: If no mount matches, treat as absolute path (or throw error)
  // For safety, we default to the root mount if it exists, otherwise error
  if (mounts["/"]) {
    return resolveMountPath("/" + normalized, mounts);
  }

  throw new Error(`Path ${virtualPath} is not within any mounted directory.`);
};

/**
 * Client-side tool implementations.
 */
export const createClientTools = (mounts: MountMap) => {
  // We use "global" for all VFS operations because isolation is now path-based.
  const VFS_SCOPE = "global";

  return {
    browser_js_eval: async (args: { code: string }) => {
      console.log("[ClientTool: JS] Executing code:", args.code);
      try {
        const result = window.eval(args.code);
        console.log("[ClientTool: JS] Result:", result);
        return typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
      } catch (e: any) {
        console.error("[ClientTool: JS] Error:", e);
        return `Error executing JS: ${e.message}`;
      }
    },

        list_directory: async (args: { path: string }) => {
          try {
            const vPath = args.path.startsWith("/") ? args.path : "/" + args.path;
            const vPathWithSlash = vPath.endsWith("/") ? vPath : vPath + "/";
            const results: string[] = [];
    
            console.log(`[ClientTool: VFS] Recursive list: ${vPath}`);
    
            for (const [vPrefix, pPrefix] of Object.entries(mounts)) {
              let searchPPath = "";
              let currentVPrefix = vPrefix.endsWith("/") ? vPrefix : vPrefix + "/";
    
              // Case A: The requested path is a parent of the mount point (e.g., list "/" and we have mount "/system")
              if (currentVPrefix.startsWith(vPathWithSlash)) {
                searchPPath = pPrefix;
              } 
              // Case B: The mount point is a parent of the requested path (e.g., list "/system/subdir" and we have mount "/system")
              else if (vPathWithSlash.startsWith(currentVPrefix)) {
                const relative = vPathWithSlash.slice(currentVPrefix.length);
                searchPPath = (pPrefix + (pPrefix.endsWith("/") ? "" : "/") + relative).replace(/\/+/g, '/');
              } else {
                continue; // This mount is irrelevant
              }
    
              const files = await vfs.listDir(VFS_SCOPE, searchPPath);
              for (const file of files) {
                // Map physical back to virtual
                // First, find which part of file.path belongs to this physical prefix
                const relativeToP = file.path.slice(pPrefix.replace(/\/$/, "").length);
                const virtualFile = (vPrefix.replace(/\/$/, "") + relativeToP).replace(/\/+/g, '/');
                
                // Only add if it's actually under the requested vPath (to handle overlap)
                if (virtualFile.startsWith(vPath.replace(/\/$/, ""))) {
                  results.push(virtualFile);
                }
              }
            }
    
            const uniqueResults = Array.from(new Set(results)).sort();
            console.log(`[ClientTool: VFS] Found ${uniqueResults.length} files across all mounts.`);
            return JSON.stringify(uniqueResults, null, 2);
          } catch (e: any) {
            console.error("[ClientTool: VFS] Error:", e);
            return `Error listing directory: ${e.message}`;
          }
        },
    read_file: async (args: { path: string }) => {
      try {
        const physicalPath = resolveMountPath(args.path, mounts);
        console.log(`[ClientTool: VFS] Read: ${args.path} -> ${physicalPath}`);

        const file = await vfs.readFile(VFS_SCOPE, physicalPath);
        console.log("[ClientTool: VFS] File size:", file.size);
        return typeof file.content === 'string' ? file.content : "Binary content not supported in text tool.";
      } catch (e: any) {
        console.error("[ClientTool: VFS] Error:", e);
        return `Error reading file: ${e.message}`;
      }
    },

    write_file: async (args: { path: string; content: string }) => {
      try {
        const physicalPath = resolveMountPath(args.path, mounts);
        console.log(`[ClientTool: VFS] Write: ${args.path} -> ${physicalPath}`);

        await vfs.writeFile(VFS_SCOPE, physicalPath, args.content, 'agent');
        console.log("[ClientTool: VFS] Write successful.");
        return "Success";
      } catch (e: any) {
        console.error("[ClientTool: VFS] Error:", e);
        return `Error writing file: ${e.message}`;
      }
    },
  };
};
