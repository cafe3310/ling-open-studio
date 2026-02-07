import { simpleGraph } from "./general-chat/graph";
// Import other graphs as they are implemented
// import { webGenGraph } from "./web-architect/initial-gen";

export type AssistantMode = 'chat' | 'web-gen';

export interface AssistantEntry {
  id: string;
  graph: any; // Using any for compiled graphs for simplicity in registry
  description: string;
}

const registry: Record<AssistantMode, AssistantEntry> = {
  'chat': {
    id: 'general-chat',
    graph: simpleGraph,
    description: 'General purpose chat assistant'
  },
  'web-gen': {
    id: 'web-architect',
    graph: simpleGraph, // Temporary fallback until webGenGraph is implemented
    description: 'Specialized web application generator'
  }
};

export const assistantRegistry = {
  get: (mode: AssistantMode): AssistantEntry => {
    return registry[mode] || registry['chat'];
  },
  list: () => Object.values(registry)
};
