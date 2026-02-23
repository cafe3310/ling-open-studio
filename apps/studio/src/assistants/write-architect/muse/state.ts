export interface MuseInspiration {
  type: 'Plot' | 'Atmosphere' | 'Dialogue';
  title: string;
  content: string;
}

export interface MuseState {
  // Input from outside
  storySummary: string;
  recentContext: string;
  historySummaries: string;
  
  // Internal nodes output
  inspirations: MuseInspiration[];
  
  // Runtime status
  status: 'idle' | 'running' | 'success' | 'error';
}
