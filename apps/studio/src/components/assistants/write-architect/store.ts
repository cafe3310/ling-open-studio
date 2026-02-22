import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type SegmentStatus = "raw" | "processing" | "completed";

export interface TextSegment {
  id: string;
  content: string;
  status: SegmentStatus;
  preprocessed?: {
    summary: string | null;
    extractedEntities: string[];
  } | null;
}

interface WriteState {
  metadata: {
    title: string;
    summary: string;
  };
  segments: TextSegment[];
  activeSegmentId: string | null;
  
  // Actions
  updateMetadata: (metadata: Partial<WriteState["metadata"]>) => void;
  addSegment: (content: string, afterId?: string) => string;
  updateSegment: (id: string, updates: Partial<TextSegment>) => void;
  deleteSegment: (id: string) => void;
  setActiveSegment: (id: string | null) => void;
  splitSegment: (id: string, contentBefore: string, contentAfter: string) => void;
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
  activeSegmentId: null,

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
}));
