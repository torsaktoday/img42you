import type {
  BrainModelOption,
  PlatformOption,
  VideoTypeOption,
} from '../types/app';

export const platforms: PlatformOption[] = [
  { name: 'Instagram / FB', icon: 'Square', ratio: '1:1', label: '1:1' },
  { name: 'TikTok / Reels', icon: 'Smartphone', ratio: '9:16', label: '9:16' },
  { name: 'YouTube', icon: 'Tv', ratio: '16:9', label: '16:9' },
  { name: 'Portrait', icon: 'RectangleVertical', ratio: '3:4', label: '3:4' },
  { name: 'Landscape', icon: 'RectangleHorizontal', ratio: '4:3', label: '4:3' },
];

export const brainModels: BrainModelOption[] = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'Fast & Smart' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3 Pro', description: 'Deep Reasoning' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Classic Efficiency' },
];

export const videoTypes: VideoTypeOption[] = [
  { id: 'grok', name: 'Grok (6-7s)', description: 'Quick cinematic motion' },
  { id: 'flow', name: 'Flow (8-9s)', description: 'Extended cinematic flow' },
];
