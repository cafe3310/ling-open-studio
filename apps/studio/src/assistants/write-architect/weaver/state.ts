export interface WeaverState {
  prefixContext: string;
  storySummary?: string;
  ghostText?: string | null;
  status: 'idle' | 'running' | 'success' | 'error';
}
