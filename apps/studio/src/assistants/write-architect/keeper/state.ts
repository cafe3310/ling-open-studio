export interface KeeperState {
  entityNames: string[];
  context: string; // Surrounding segment content
  storySummary?: string;
  entries?: any[]; // Array of generated KnowledgeEntry objects
  status: 'idle' | 'running' | 'success' | 'error';
}
