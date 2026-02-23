import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type SegmentStatus = "raw" | "processing" | "completed";
export type EntryCategory = 'worldSettings' | 'characters' | 'concepts';
export type EntryType = 'manual' | 'auto';
export type GraphStatus = 'idle' | 'running' | 'success' | 'error';

export interface TextSegment {
  id: string;
  content: string;
  status: SegmentStatus;
  preprocessed?: {
    summary: string | null;
    extractedEntities: string[];
  } | null;
}

export interface KnowledgeEntry {
  id: string;
  name: string;
  category: EntryCategory;
  type: EntryType;
  definition: string;
  suggestions: string[];
  isApproved: boolean;
  lastDetectedAt: number;
}

export interface InspirationCard {
  id: string;
  type: 'Plot' | 'Atmosphere' | 'Dialogue';
  title: string;
  content: string;
}

interface WriteState {
  metadata: {
    title: string;
    summary: string;
  };
  segments: TextSegment[];
  knowledgeBase: {
    worldSettings: KnowledgeEntry[];
    characters: KnowledgeEntry[];
    concepts: KnowledgeEntry[];
  };
  inspirations: InspirationCard[];
  activeInspirationIds: string[];
  activeSegmentId: string | null;
  runtime: {
    ghostText: string | null;
    isPredicting: boolean;
    graphStates: Record<string, {
      status: GraphStatus;
      progress?: number;
      lastResult?: string;
    }>;
  };
  
  // Actions
  updateMetadata: (metadata: Partial<WriteState["metadata"]>) => void;
  addSegment: (content: string, afterId?: string) => string;
  updateSegment: (id: string, updates: Partial<TextSegment>) => void;
  deleteSegment: (id: string) => void;
  setActiveSegment: (id: string | null) => void;
  setGhostText: (text: string | null) => void;
  setPredicting: (isPredicting: boolean) => void;
  updateGraphStatus: (codeName: string, updates: Partial<WriteState["runtime"]["graphStates"][string]>) => void;
  splitSegment: (id: string, contentBefore: string, contentAfter: string) => void;
  
  // KB Actions
  upsertEntry: (entry: Partial<KnowledgeEntry> & { name: string; category: EntryCategory }) => void;
  approveEntry: (id: string, category: EntryCategory) => void;
  deleteEntry: (id: string, category: EntryCategory) => void;

  // Inspiration Actions
  setInspirations: (inspirations: InspirationCard[]) => void;
  toggleInspiration: (id: string) => void;
}

export const useWriteStore = create<WriteState>((set) => ({
  metadata: {
    title: "Untitled Story",
    summary: "",
  },
  segments: [
    {
      id: uuidv4(),
      content: "",
      status: "raw",
    },
  ],
  knowledgeBase: {
    worldSettings: [],
    characters: [],
    concepts: [],
  },
  inspirations: [],
  activeInspirationIds: [],
  activeSegmentId: null,
  runtime: {
    ghostText: null,
    isPredicting: false,
    graphStates: {
      'PhantomWeaver': { status: 'idle' },
      'SegmentPreprocessor': { status: 'idle' },
      'NarrativeFlow': { status: 'idle' },
      'LoreKeeper': { status: 'idle' },
      'MuseWhisper': { status: 'idle' },
    },
  },

  updateMetadata: (metadata) =>
    set((state) => ({
      metadata: { ...state.metadata, ...metadata },
    })),

  addSegment: (content, afterId) => {
    const id = uuidv4();
    set((state) => {
      const newSegment: TextSegment = { id, content, status: "raw" };
      if (!afterId) {
        return { segments: [...state.segments, newSegment] };
      }
      const index = state.segments.findIndex((s) => s.id === afterId);
      const newSegments = [...state.segments];
      newSegments.splice(index + 1, 0, newSegment);
      return { segments: newSegments };
    });
    return id;
  },

  updateSegment: (id, updates) =>
    set((state) => ({
      segments: state.segments.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  deleteSegment: (id) =>
    set((state) => ({
      segments: state.segments.filter((s) => s.id !== id),
    })),

  setActiveSegment: (id) => set({ activeSegmentId: id }),

  setGhostText: (text) => set((state) => ({ 
    runtime: { ...state.runtime, ghostText: text } 
  })),

  setPredicting: (isPredicting) => set((state) => ({ 
    runtime: { ...state.runtime, isPredicting } 
  })),

  updateGraphStatus: (codeName, updates) =>
    set((state) => ({
      runtime: {
        ...state.runtime,
        graphStates: {
          ...state.runtime.graphStates,
          [codeName]: { ...state.runtime.graphStates[codeName], ...updates }
        }
      }
    })),

  splitSegment: (id, contentBefore, contentAfter) =>
    set((state) => {
      const index = state.segments.findIndex((s) => s.id === id);
      if (index === -1) return state;

      const newId = uuidv4();
      const updatedSegments = [...state.segments];
      
      // Update original segment
      updatedSegments[index] = { 
        ...updatedSegments[index], 
        content: contentBefore, 
        status: "raw" 
      };

      // Insert new segment after
      updatedSegments.splice(index + 1, 0, {
        id: newId,
        content: contentAfter,
        status: "raw",
      });

      return { 
        segments: updatedSegments,
        activeSegmentId: newId 
      };
    }),

  upsertEntry: (entry) =>
    set((state) => {
      const category = entry.category;
      const list = [...state.knowledgeBase[category]];
      const index = list.findIndex(e => e.name.toLowerCase() === entry.name.toLowerCase());

      if (index > -1) {
        list[index] = { ...list[index], ...entry };
      } else {
        list.push({
          id: uuidv4(),
          type: 'auto',
          definition: '',
          suggestions: [],
          isApproved: false,
          lastDetectedAt: Date.now(),
          ...entry
        } as KnowledgeEntry);
      }

      return {
        knowledgeBase: {
          ...state.knowledgeBase,
          [category]: list
        }
      };
    }),

  approveEntry: (id, category) =>
    set((state) => ({
      knowledgeBase: {
        ...state.knowledgeBase,
        [category]: state.knowledgeBase[category].map(e => 
          e.id === id ? { ...e, type: 'manual', isApproved: true } : e
        )
      }
    })),

  deleteEntry: (id, category) =>
    set((state) => ({
      knowledgeBase: {
        ...state.knowledgeBase,
        [category]: state.knowledgeBase[category].filter(e => e.id !== id)
      }
    })),

  setInspirations: (inspirations) => set({ inspirations }),

  toggleInspiration: (id) => set((state) => ({
    activeInspirationIds: state.activeInspirationIds.includes(id)
      ? state.activeInspirationIds.filter((i) => i !== id)
      : [...state.activeInspirationIds, id]
  })),
}));
