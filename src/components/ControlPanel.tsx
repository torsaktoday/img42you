import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { brainModels, platforms, videoTypes } from '../constants/app';
import type { ReferenceImage, VeoModel, VideoType } from '../types/app';

interface ControlPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onEnhancePrompt: () => void;
  isEnhancing: boolean;
  brainModel: string;
  onBrainModelChange: (value: string) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  videoType: VideoType;
  onVideoTypeChange: (value: VideoType) => void;
  veoModel: VeoModel;
  onVeoModelChange: (value: VeoModel) => void;
  referenceImages: ReferenceImage[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageDrop: (event: DragEvent<HTMLDivElement>) => void;
  onImageDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onRemoveImage: (id: string) => void;
  error: string | null;
  isGenerating: boolean;
  isGeneratingVideo: boolean;
  isGeneratingPrompts: boolean;
  isGeneratingReview: boolean;
  hasGeneratedImage: boolean;
  onGenerateImage: () => void;
  onGeneratePrompts: () => void;
  onGenerateSalesReview: () => void;
  onGenerateVideo: () => void;
}

export function ControlPanel({
  prompt,
  onPromptChange,
  onEnhancePrompt,
  isEnhancing,
  brainModel,
  onBrainModelChange,
  aspectRatio,
  onAspectRatioChange,
  videoType,
  onVideoTypeChange,
  veoModel,
  onVeoModelChange,
  referenceImages,
  fileInputRef,
  onImageUpload,
  onImageDrop,
  onImageDragOver,
  onRemoveImage,
  error,
  isGenerating,
  isGeneratingVideo,
  isGeneratingPrompts,
  isGeneratingReview,
  hasGeneratedImage,
  onGenerateImage,
  onGeneratePrompts,
  onGenerateSalesReview,
  onGenerateVideo,
}: ControlPanelProps) {
  return (
    <>
      <section className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Prompt
        </label>
        <div className="relative group">
          <textarea
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 pb-14 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-zinc-900 resize-none transition-all shadow-sm"
            rows={5}
            placeholder="Describe the image you want to create, or type a simple idea and click Enhance..."
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={onEnhancePrompt}
              disabled={!prompt.trim() || isEnhancing || isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-indigo-500/20 text-zinc-400 hover:text-indigo-400 disabled:opacity-50 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400 rounded-xl transition-all text-xs font-medium border border-zinc-700 hover:border-indigo-500/50 disabled:border-zinc-700"
              title="Enhance prompt with AI"
            >
              {isEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
              {isEnhancing ? 'Enhancing...' : 'Enhance Idea'}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          AI Brain Model
        </label>
        <div className="grid grid-cols-3 gap-2">
          {brainModels.map((model) => (
            <button
              key={model.id}
              onClick={() => onBrainModelChange(model.id)}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all ${
                brainModel === model.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <span className="text-[10px] font-bold text-center leading-tight">{model.name}</span>
              <span className="text-[8px] uppercase tracking-tighter opacity-60 text-center">{model.description.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Aspect Ratio
        </label>
        <div className="grid grid-cols-5 gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.ratio}
              onClick={() => onAspectRatioChange(platform.ratio)}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all ${
                aspectRatio === platform.ratio
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
              title={platform.name}
            >
              <span className="text-[10px] font-bold">{platform.label}</span>
              <span className="text-[8px] uppercase tracking-tighter opacity-60 truncate w-full text-center">
                {platform.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          Video Motion Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {videoTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onVideoTypeChange(type.id)}
              className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                videoType === type.id
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <span className="text-xs font-bold">{type.name}</span>
              <span className="text-[10px] opacity-60 mt-1">{type.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Veo Video Model
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onVeoModelChange('fast')}
            className={`p-3 rounded-xl border transition-all text-left ${
              veoModel === 'fast'
                ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            <p className="text-[10px] font-bold">Veo Fast</p>
            <p className="text-[8px] opacity-60">720p - Fast & Efficient</p>
          </button>
          <button
            onClick={() => onVeoModelChange('normal')}
            className={`p-3 rounded-xl border transition-all text-left ${
              veoModel === 'normal'
                ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            <p className="text-[10px] font-bold">Veo Normal</p>
            <p className="text-[8px] opacity-60">1080p - High Quality</p>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Reference Images ({referenceImages.length}/3)
          </label>
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider bg-zinc-900 px-2 py-1 rounded-md">
            Optional
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {referenceImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-700 group shadow-lg"
              >
                <img src={image.previewUrl} alt="Reference" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button
                    onClick={() => onRemoveImage(image.id)}
                    className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-full transition-all"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {referenceImages.length < 3 && (
            <motion.div
              layout
              onDrop={onImageDrop}
              onDragOver={onImageDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group relative overflow-hidden ${
                referenceImages.length === 0 ? 'col-span-3 h-32' : 'aspect-square'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Upload className="w-6 h-6 text-zinc-600 group-hover:text-indigo-400 mb-2 transition-colors group-hover:scale-110 duration-300" />
              {referenceImages.length === 0 && (
                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  Click or drag images here
                </span>
              )}
              <span className="text-[10px] text-zinc-600 mt-1">JPEG, PNG, WEBP</span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={onImageUpload}
              />
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-start gap-3 mt-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 mt-auto space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onGenerateImage}
            disabled={!prompt.trim() || isGenerating || isGeneratingVideo || isGeneratingPrompts}
            className="py-4 bg-zinc-100 hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-900 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 disabled:shadow-none relative overflow-hidden group"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            {isGenerating ? 'Gen Image...' : 'Gen Image'}
          </button>

          <button
            onClick={onGeneratePrompts}
            disabled={!prompt.trim() || isGenerating || isGeneratingVideo || isGeneratingPrompts || isGeneratingReview}
            className="py-4 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-100 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-zinc-700 relative overflow-hidden group"
          >
            {isGeneratingPrompts ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {isGeneratingPrompts ? 'Gen Prompts...' : 'Gen Prompts'}
          </button>
        </div>

        <button
          onClick={onGenerateSalesReview}
          disabled={!prompt.trim() || isGenerating || isGeneratingVideo || isGeneratingPrompts || isGeneratingReview}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 disabled:shadow-none relative overflow-hidden group"
        >
          {isGeneratingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isGeneratingReview ? 'Creating Sales Review...' : 'Gen Thai Sales Review (45-90s + 6 Clips)'}
        </button>

        {hasGeneratedImage && (
          <button
            onClick={onGenerateVideo}
            disabled={isGeneratingVideo || isGenerating || isGeneratingPrompts}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-900 disabled:text-zinc-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 disabled:shadow-none relative overflow-hidden group"
          >
            {isGeneratingVideo ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Cinematic Video...
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-5 h-5" />
                Animate to Video + Speech
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
