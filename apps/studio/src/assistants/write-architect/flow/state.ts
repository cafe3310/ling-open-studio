export interface NarrativeState {
  // Input
  storySummary: string;
  historySummaries: string;
  recentText: string;
  activeLore: string;
  activeInspirations: string;
  
  // Output (streaming handled via nodes/API)
  generatedText?: string;
  
  // Status
  status: 'idle' | 'running' | 'success' | 'error';
}
