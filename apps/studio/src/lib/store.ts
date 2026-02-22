import { create } from 'zustand';

interface ModelConfig {
  modelId: string;
  systemPrompt: string;
  temperature: number;
  enabledTools: string[];
  toolParadigm: 'json' | 'xml' | 'text';
  // Web Generation Specific
  designId?: string;
  techStackId?: string;
  designModelId?: string;
  codeModelId?: string;
}

interface ModelStore extends ModelConfig {
  setModelId: (modelId: string) => void;
  setSystemPrompt: (systemPrompt: string) => void;
  setTemperature: (temperature: number) => void;
  setEnabledTools: (tools: string[]) => void;
  setToolParadigm: (paradigm: 'json' | 'xml' | 'text') => void;
  setDesignId: (id: string) => void;
  setTechStackId: (id: string) => void;
  setDesignModelId: (id: string) => void;
  setCodeModelId: (id: string) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  modelId: 'Ling_1T',
  systemPrompt: 'You are a helpful, harmless, and honest AI assistant created by InclusionAI.',
  temperature: 0.6,
  enabledTools: [],
  toolParadigm: 'json',
  designId: 'minimalist',
  techStackId: 'html-tailwind',
  designModelId: 'Ling_2_5_1T',
  codeModelId: 'Ling_1T',
  setModelId: (modelId) => set({ modelId }),
  setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
  setTemperature: (temperature) => set({ temperature }),
  setEnabledTools: (enabledTools) => set({ enabledTools }),
  setToolParadigm: (toolParadigm) => set({ toolParadigm }),
  setDesignId: (designId) => set({ designId }),
  setTechStackId: (techStackId) => set({ techStackId }),
  setDesignModelId: (designModelId) => set({ designModelId }),
  setCodeModelId: (codeModelId) => set({ codeModelId }),
}));
