export interface ReferenceImage {
  id: string;
  mimeType: string;
  data: string;
  previewUrl: string;
}

export interface PlatformOption {
  name: string;
  icon: string;
  ratio: string;
  label: string;
}

export interface BrainModelOption {
  id: string;
  name: string;
  description: string;
}

export interface VideoTypeOption {
  id: VideoType;
  name: string;
  description: string;
}

export interface CinematicPrompts {
  script: string;
  motion: string;
}

export interface SalesReviewScene {
  description: string;
  imagePrompt: string;
  narration: string;
}

export interface SalesReview {
  script: string;
  scenes: SalesReviewScene[];
  hook: string;
  painPoint: string;
  solution: string;
  cta: string;
}

export type VideoType = 'grok' | 'flow';
export type VeoModel = 'fast' | 'normal';
