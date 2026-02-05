import { LucideIcon } from 'lucide-react';

export enum Tab {
  DESIGN_SYSTEM = 'Design System',
  MODEL_CHAT = 'Model Chat',
  MODEL_WEB = 'Model Web',
  MODEL_WRITE = 'Model Write',
}

export interface NavItem {
  id: Tab;
  label: string;
  icon: LucideIcon;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
}

export interface InspirationCard {
  id: string;
  title: string;
  content: string;
  type: 'plot' | 'description' | 'dialogue';
}

export interface StoryMetadata {
  title: string;
  summary: string;
  world: string;
  characters: string[];
}