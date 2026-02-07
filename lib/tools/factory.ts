import { createVfsWriteTool, createVfsReadTool, createVfsListTool } from "./vfs-tools";

/**
 * Tool Factory to get tools based on requirements.
 */
export const getVfsTools = () => {
  return [
    createVfsWriteTool(),
    createVfsReadTool(),
    createVfsListTool(),
  ];
};

/**
 * More tools can be added here, e.g., web_search, image_gen, etc.
 */
