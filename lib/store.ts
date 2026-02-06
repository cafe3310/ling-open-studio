import { create } from 'zustand';

interface ModelConfig {
  modelId: string;
  systemPrompt: string;
  temperature: number;
}

interface ModelStore extends ModelConfig {
  setModelId: (modelId: string) => void;
  setSystemPrompt: (systemPrompt: string) => void;
  setTemperature: (temperature: number) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  modelId: 'Ling_1T',
  systemPrompt: 'You are a helpful, harmless, and honest AI assistant created by InclusionAI.',
  temperature: 0.6,
  setModelId: (modelId) => set({ modelId }),
  setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
  setTemperature: (temperature) => set({ temperature }),
}));
