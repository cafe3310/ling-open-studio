export interface PreprocessorState {
  content: string;
  storySummary?: string;
  summary?: string | null;
  extractedEntities?: string[];
  status: 'idle' | 'running' | 'success' | 'error';
}
