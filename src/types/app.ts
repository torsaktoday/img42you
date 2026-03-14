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
export type VoiceCategory = 'female' | 'male' | 'kid' | 'teen';
export type VoiceSpeed = 'slow' | 'balanced' | 'fast';
export type VoiceMood = 'warm' | 'excited' | 'urgent' | 'playful' | 'luxury';
export type SceneMotionStyle = 'push-in' | 'drift' | 'float' | 'spotlight' | 'parallax';
export type SceneMotionExportFormat = 'webm' | 'mp4';

export interface VoicePreset {
  id: string;
  label: string;
  category: VoiceCategory;
  voiceName: string;
  description: string;
  energy: string;
}

export interface ReviewStylePreset {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  scriptDirection: string;
  sceneDirection: string;
  deliveryDirection: string;
  previewTemplate: string;
}

export interface VoiceSpeedPreset {
  id: VoiceSpeed;
  label: string;
  description: string;
  ttsDirection: string;
  scriptDirection: string;
}

export interface VoiceMoodPreset {
  id: VoiceMood;
  label: string;
  description: string;
  ttsDirection: string;
  scriptDirection: string;
  sceneDirection: string;
}

export interface SceneMotionPreset {
  id: string;
  style: SceneMotionStyle;
  duration: number;
  scaleFrom: number;
  scaleTo: number;
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
  rotateFrom: number;
  rotateTo: number;
  overlayStrength: number;
}
