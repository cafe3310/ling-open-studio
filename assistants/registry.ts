import { simpleGraph } from "./general-chat/graph";
import { webGenGraph } from "./web-architect/graph";

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
    graph: webGenGraph,
    description: 'Specialized web application generator'
  }
};

export const assistantRegistry = {
  get: (mode: AssistantMode): AssistantEntry => {
    return registry[mode] || registry['chat'];
  },
  list: () => Object.values(registry)
};
