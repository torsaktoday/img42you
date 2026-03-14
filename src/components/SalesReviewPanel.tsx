import { AnimatePresence, motion } from 'motion/react';
import {
  Download,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Sparkles,
  X,
} from 'lucide-react';
import type { SalesReview } from '../types/app';
import { getAspectRatioClass } from '../utils/media';

interface SalesReviewPanelProps {
  salesReview: SalesReview | null;
  reviewAudioUrl: string | null;
  isGeneratingReviewAudio: boolean;
  isGeneratingSceneVideo: number | null;
  isGeneratingSceneImage: number | null;
  sceneVideoUrls: Record<number, string>;
  sceneImageUrls: Record<number, string>;
  aspectRatio: string;
  generatedImage: string | null;
  onClose: () => void;
  onGenerateReviewAudio: () => void;
  onGenerateSceneImage: (imagePrompt: string, index: number) => void;
  onGenerateSceneVideo: (scenePrompt: string, index: number) => void;
  onExpandImage: (imageUrl: string) => void;
}

export function SalesReviewPanel({
  salesReview,
  reviewAudioUrl,
  isGeneratingReviewAudio,
  isGeneratingSceneVideo,
  isGeneratingSceneImage,
  sceneVideoUrls,
  sceneImageUrls,
  aspectRatio,
  generatedImage,
  onClose,
  onGenerateReviewAudio,
  onGenerateSceneImage,
  onGenerateSceneVideo,
  onExpandImage,
}: SalesReviewPanelProps) {
  const aspectRatioClass = getAspectRatioClass(aspectRatio);

  return (
    <AnimatePresence>
      {salesReview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-3xl space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Expert Thai Sales Review</h3>
            </div>
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Hook (0-3s)', content: salesReview.hook, color: 'text-orange-400' },
                { label: 'Pain Point', content: salesReview.painPoint, color: 'text-red-400' },
                { label: 'Solution', content: salesReview.solution, color: 'text-emerald-400' },
                { label: 'Call to Action', content: salesReview.cta, color: 'text-blue-400' },
              ].map((part) => (
                <div key={part.label} className="space-y-1.5">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${part.color}`}>{part.label}</label>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                    {part.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-emerald-500/10 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-[10px] font-bold text-emerald-500/60 uppercase block">AI Voice Track</label>
                <button
                  onClick={onGenerateReviewAudio}
                  disabled={isGeneratingReviewAudio}
                  className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 border border-emerald-500/20 disabled:opacity-50"
                >
                  {isGeneratingReviewAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isGeneratingReviewAudio
                    ? 'Generating AI Voice...'
                    : reviewAudioUrl
                      ? 'Regenerate AI Voice'
                      : 'Generate AI Voice (Thai)'}
                </button>
              </div>

              {reviewAudioUrl ? (
                <audio key={reviewAudioUrl} src={reviewAudioUrl} controls className="w-full h-10 rounded-lg bg-black/40" />
              ) : (
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  ระบบจะพยายามสร้างเสียงให้อัตโนมัติหลังสร้าง Thai review เสร็จ และคุณกดสร้างใหม่ได้ถ้าปรับสปีดหรืออารมณ์เพิ่ม
                </p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase block">
                Cinematic Hero Shots (Scenes & Assets)
              </label>
              <div className="grid grid-cols-1 gap-6">
                {salesReview.scenes.map((scene, index) => (
                  <div key={`${scene.narration}-${index}`} className="p-4 bg-black/30 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 font-bold text-xs">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-400">Scene {index + 1}</p>
                        <p className="text-[11px] text-zinc-400 italic">"{scene.narration}"</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase">Image Prompt</label>
                          <button
                            onClick={() => navigator.clipboard.writeText(scene.imagePrompt)}
                            className="text-[9px] text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
                          >
                            Copy Prompt
                          </button>
                        </div>
                        <div className="p-2 bg-zinc-900/50 rounded-lg text-[10px] text-zinc-500 border border-zinc-800 line-clamp-2">
                          {scene.imagePrompt}
                        </div>

                        {sceneImageUrls[index] ? (
                          <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-white/10 shadow-lg group`}>
                            <img src={sceneImageUrls[index]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />

                            {isGeneratingSceneImage === index && (
                              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
                                <span className="text-[10px] font-bold text-indigo-400 animate-pulse uppercase tracking-widest">
                                  Regenerating...
                                </span>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => onExpandImage(sceneImageUrls[index])}
                                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 text-white"
                                title="Expand Image"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = sceneImageUrls[index];
                                  link.download = `scene-${index + 1}.png`;
                                  link.click();
                                }}
                                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 text-white"
                                title="Download Image"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onGenerateSceneImage(scene.imagePrompt, index)}
                                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 text-white"
                                title="Regenerate Image"
                              >
                                <Sparkles className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/30 flex items-center justify-center`}>
                            <button
                              onClick={() => onGenerateSceneImage(scene.imagePrompt, index)}
                              disabled={isGeneratingSceneImage !== null}
                              className="flex flex-col items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors group"
                            >
                              {isGeneratingSceneImage === index ? (
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                              ) : (
                                <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                              )}
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                {isGeneratingSceneImage === index ? 'Generating...' : 'Generate Image'}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase">Motion Prompt</label>
                        <div className="p-2 bg-zinc-900/50 rounded-lg text-[10px] text-zinc-500 border border-zinc-800 line-clamp-2">
                          {scene.description}
                        </div>

                        {sceneVideoUrls[index] ? (
                          <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-emerald-500/20 shadow-lg group`}>
                            <video src={sceneVideoUrls[index]} controls className="w-full h-full object-cover" />

                            {isGeneratingSceneVideo === index && (
                              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mb-2" />
                                <span className="text-[10px] font-bold text-emerald-400 animate-pulse uppercase tracking-widest">
                                  Animating...
                                </span>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = sceneVideoUrls[index];
                                link.download = `hero-shot-${index + 1}.mp4`;
                                link.click();
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-emerald-500 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-emerald-500/10 bg-emerald-500/5 flex items-center justify-center`}>
                            <button
                              onClick={() => onGenerateSceneVideo(scene.description, index)}
                              disabled={isGeneratingSceneVideo !== null || (!generatedImage && !sceneImageUrls[index])}
                              className="flex flex-col items-center gap-2 text-emerald-500/60 hover:text-emerald-400 transition-colors group disabled:opacity-30 disabled:hover:text-emerald-500/60"
                            >
                              {isGeneratingSceneVideo === index ? (
                                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                              ) : (
                                <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                              )}
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                {isGeneratingSceneVideo === index ? 'Animating...' : 'Animate Scene'}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
