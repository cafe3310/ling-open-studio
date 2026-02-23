export interface WeaverState {
  prefixContext: string;
  storySummary?: string;
  activeInspirationContent?: string; // Content of activated inspiration cards
  ghostText?: string | null;
  status: 'idle' | 'running' | 'success' | 'error';
}
