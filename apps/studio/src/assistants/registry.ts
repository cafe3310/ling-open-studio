import { simpleGraph } from "./general-chat/graph";
import { webGenGraph } from "./web-architect/graph";

export type AssistantMode = 'chat' | 'web-gen' | 'write-gen' | 'write-gen-v2';

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
  },
  'write-gen': {
    id: 'write-architect-ref',
    graph: simpleGraph, // Placeholder using simpleGraph for now
    description: 'Creative writing and storytelling assistant (Reference)'
  },
  'write-gen-v2': {
    id: 'write-architect',
    graph: simpleGraph, // Placeholder for new graph
    description: 'Next-gen creative writing assistant (Development)'
  }
};

export const assistantRegistry = {
  get: (mode: AssistantMode): AssistantEntry => {
    return registry[mode] || registry['chat'];
  },
  list: () => Object.values(registry)
};
