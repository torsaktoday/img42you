import { AnimatePresence, motion } from 'motion/react';
import {
  Download,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import type { SalesReview, SceneMotionExportFormat, SceneMotionPreset } from '../types/app';
import { getAspectRatioClass } from '../utils/media';

interface SalesReviewPanelProps {
  salesReview: SalesReview | null;
  reviewAudioUrl: string | null;
  isGeneratingReviewAudio: boolean;
  isGeneratingSceneVideo: number | null;
  isGeneratingSceneImage: number | null;
  isGeneratingSceneMotion: number | null;
  exportingSceneMotionKey: string | null;
  sceneMotionExportSupport: { webm: boolean; mp4: boolean };
  sceneVideoUrls: Record<number, string>;
  sceneImageUrls: Record<number, string>;
  sceneMotionPresets: Record<number, SceneMotionPreset>;
  playingSceneMotion: Record<number, boolean>;
  aspectRatio: string;
  generatedImage: string | null;
  onClose: () => void;
  onGenerateReviewAudio: () => void;
  onGenerateSceneImage: (imagePrompt: string, index: number) => void;
  onGenerateSceneVideo: (scenePrompt: string, index: number) => void;
  onGenerateSceneMotion: (index: number) => void;
  onToggleSceneMotion: (index: number) => void;
  onDownloadSceneMotion: (index: number, format: SceneMotionExportFormat) => void;
  onExpandImage: (imageUrl: string) => void;
}

interface SceneMotionPreviewProps {
  imageUrl: string;
  aspectRatioClass: string;
  preset: SceneMotionPreset;
  isPlaying: boolean;
}

function downloadAsset(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}

function SceneMotionPreview({ imageUrl, aspectRatioClass, preset, isPlaying }: SceneMotionPreviewProps) {
  return (
    <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-cyan-400/20 bg-black`}>
      <motion.img
        src={imageUrl}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        animate={
          isPlaying
            ? {
                scale: [preset.scaleFrom, preset.scaleTo],
                x: [preset.xFrom, preset.xTo],
                y: [preset.yFrom, preset.yTo],
                rotate: [preset.rotateFrom, preset.rotateTo],
              }
            : {
                scale: preset.scaleFrom,
                x: preset.xFrom,
                y: preset.yFrom,
                rotate: preset.rotateFrom,
              }
        }
        transition={{
          duration: preset.duration,
          repeat: isPlaying ? Infinity : 0,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-screen"
        animate={isPlaying ? { x: ['-20%', '240%'], opacity: [0, preset.overlayStrength, 0] } : { x: '-20%', opacity: 0 }}
        transition={{
          duration: Math.max(2.8, preset.duration - 1),
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(0,0,0,0.25),transparent_42%)]"
        animate={isPlaying ? { opacity: [0.45, 0.8, 0.5] } : { opacity: 0.5 }}
        transition={{ duration: preset.duration * 0.7, repeat: isPlaying ? Infinity : 0, ease: 'easeInOut' }}
      />

      <div className="absolute left-2 top-2 rounded-lg bg-black/65 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/20">
        No API Motion
      </div>
    </div>
  );
}

function MotionDownloadButton({
  label,
  index,
  format,
  enabled,
  exportingSceneMotionKey,
  onDownload,
}: {
  label: string;
  index: number;
  format: SceneMotionExportFormat;
  enabled: boolean;
  exportingSceneMotionKey: string | null;
  onDownload: (index: number, format: SceneMotionExportFormat) => void;
}) {
  const exportKey = `${index}:${format}`;
  const isExporting = exportingSceneMotionKey === exportKey;

  return (
    <button
      onClick={() => onDownload(index, format)}
      disabled={!enabled || isExporting}
      className="px-3 py-2 rounded-xl bg-zinc-900/75 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] font-bold transition-all disabled:opacity-30 inline-flex items-center gap-1.5"
      title={enabled ? `Download ${label}` : `${label} export is not supported in this browser`}
    >
      {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      {isExporting ? `Exporting ${label}...` : `Download ${label}`}
    </button>
  );
}

export function SalesReviewPanel({
  salesReview,
  reviewAudioUrl,
  isGeneratingReviewAudio,
  isGeneratingSceneVideo,
  isGeneratingSceneImage,
  isGeneratingSceneMotion,
  exportingSceneMotionKey,
  sceneMotionExportSupport,
  sceneVideoUrls,
  sceneImageUrls,
  sceneMotionPresets,
  playingSceneMotion,
  aspectRatio,
  generatedImage,
  onClose,
  onGenerateReviewAudio,
  onGenerateSceneImage,
  onGenerateSceneVideo,
  onGenerateSceneMotion,
  onToggleSceneMotion,
  onDownloadSceneMotion,
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
                {salesReview.scenes.map((scene, index) => {
                  const sceneImage = sceneImageUrls[index] || generatedImage;
                  const sceneMotion = sceneMotionPresets[index];
                  const isMotionPlaying = !!playingSceneMotion[index];
                  const canGenerateSceneVideo = !!(generatedImage || sceneImageUrls[index]);

                  return (
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
                            <div className="space-y-2">
                              <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-white/10 shadow-lg`}>
                                <img src={sceneImageUrls[index]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />

                                {isGeneratingSceneImage === index && (
                                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
                                    <span className="text-[10px] font-bold text-indigo-400 animate-pulse uppercase tracking-widest">
                                      Regenerating...
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => onExpandImage(sceneImageUrls[index])}
                                  className="px-3 py-2 rounded-xl bg-zinc-900/75 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] font-bold transition-all inline-flex items-center gap-1.5"
                                  title="Expand Image"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                  View Image
                                </button>
                                <button
                                  onClick={() => downloadAsset(sceneImageUrls[index], `scene-${index + 1}.png`)}
                                  className="px-3 py-2 rounded-xl bg-zinc-900/75 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] font-bold transition-all inline-flex items-center gap-1.5"
                                  title="Download Image"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download Image
                                </button>
                                <button
                                  onClick={() => onGenerateSceneImage(scene.imagePrompt, index)}
                                  className="px-3 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/20 text-indigo-300 text-[10px] font-bold transition-all inline-flex items-center gap-1.5"
                                  title="Regenerate Image"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Regenerate
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

                        <div className="space-y-3">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase">Motion Prompt</label>
                          <div className="p-2 bg-zinc-900/50 rounded-lg text-[10px] text-zinc-500 border border-zinc-800 line-clamp-2">
                            {scene.description}
                          </div>

                          <div className="space-y-2 rounded-2xl border border-cyan-400/15 bg-cyan-500/5 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-[9px] font-bold text-cyan-300 uppercase tracking-widest">Animate Scene (No API)</label>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onGenerateSceneMotion(index)}
                                  disabled={isGeneratingSceneMotion !== null || !sceneImage}
                                  className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/20 text-cyan-300 text-[10px] font-bold transition-all disabled:opacity-40"
                                >
                                  {isGeneratingSceneMotion === index ? (
                                    <span className="inline-flex items-center gap-1.5">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      Gen Motion...
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5">
                                      <Wand2 className="w-3.5 h-3.5" />
                                      {sceneMotion ? 'Regen Motion' : 'Gen Motion'}
                                    </span>
                                  )}
                                </button>
                                <button
                                  onClick={() => onToggleSceneMotion(index)}
                                  disabled={!sceneMotion}
                                  className="px-3 py-2 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] font-bold transition-all disabled:opacity-30"
                                >
                                  {isMotionPlaying ? (
                                    <span className="inline-flex items-center gap-1.5">
                                      <Pause className="w-3.5 h-3.5" />
                                      Pause
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5">
                                      <Play className="w-3.5 h-3.5" />
                                      Play
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>

                            {sceneImage && sceneMotion ? (
                              <>
                                <SceneMotionPreview
                                  imageUrl={sceneImage}
                                  aspectRatioClass={aspectRatioClass}
                                  preset={sceneMotion}
                                  isPlaying={isMotionPlaying}
                                />
                                <div className="flex flex-wrap gap-2">
                                  <MotionDownloadButton
                                    label="WebM"
                                    index={index}
                                    format="webm"
                                    enabled={sceneMotionExportSupport.webm}
                                    exportingSceneMotionKey={exportingSceneMotionKey}
                                    onDownload={onDownloadSceneMotion}
                                  />
                                  <MotionDownloadButton
                                    label="MP4"
                                    index={index}
                                    format="mp4"
                                    enabled={sceneMotionExportSupport.mp4}
                                    exportingSceneMotionKey={exportingSceneMotionKey}
                                    onDownload={onDownloadSceneMotion}
                                  />
                                </div>
                              </>
                            ) : (
                              <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-cyan-400/15 bg-black/20 flex items-center justify-center`}>
                                <div className="text-center px-5">
                                  <p className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-2">No API Motion Preview</p>
                                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                                    {sceneImage
                                      ? 'กด Gen Motion เพื่อสร้างภาพเคลื่อนไหว local แบบคม ๆ จากภาพนิ่งของซีนนี้'
                                      : 'ต้องมีภาพของซีนก่อน จึงจะสร้าง motion local ได้'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {sceneVideoUrls[index] ? (
                            <div className="space-y-2">
                              <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-emerald-500/20 shadow-lg`}>
                                <video src={sceneVideoUrls[index]} controls className="w-full h-full object-cover" />

                                {isGeneratingSceneVideo === index && (
                                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mb-2" />
                                    <span className="text-[10px] font-bold text-emerald-400 animate-pulse uppercase tracking-widest">
                                      Animating...
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => downloadAsset(sceneVideoUrls[index], `hero-shot-${index + 1}.mp4`)}
                                  className="px-3 py-2 rounded-xl bg-zinc-900/75 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] font-bold transition-all inline-flex items-center gap-1.5"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download Video
                                </button>
                                <button
                                  onClick={() => onGenerateSceneVideo(scene.description, index)}
                                  disabled={isGeneratingSceneVideo !== null || !canGenerateSceneVideo}
                                  className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/20 text-emerald-300 text-[10px] font-bold transition-all inline-flex items-center gap-1.5 disabled:opacity-30"
                                >
                                  {isGeneratingSceneVideo === index ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      Animating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      Regenerate Video
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden border border-emerald-500/10 bg-emerald-500/5 flex items-center justify-center`}>
                              <button
                                onClick={() => onGenerateSceneVideo(scene.description, index)}
                                disabled={isGeneratingSceneVideo !== null || !canGenerateSceneVideo}
                                className="flex flex-col items-center gap-2 text-emerald-500/60 hover:text-emerald-400 transition-colors group disabled:opacity-30 disabled:hover:text-emerald-500/60"
                              >
                                {isGeneratingSceneVideo === index ? (
                                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                ) : (
                                  <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                )}
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                  {isGeneratingSceneVideo === index ? 'Animating...' : 'Animate Scene (API)'}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
