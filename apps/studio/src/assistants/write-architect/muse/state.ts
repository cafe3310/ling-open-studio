import { InspirationCard } from "@/components/assistants/write-architect/store";

export interface MuseState {
  context: string;
  storySummary?: string;
  inspirations?: InspirationCard[];
  status: 'idle' | 'running' | 'success' | 'error';
}
