import { motion } from 'motion/react';
import { Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import type { RefObject } from 'react';
import { getRandomFileName } from '../utils/media';

interface OutputPanelProps {
  isGenerating: boolean;
  isGeneratingVideo: boolean;
  generatedVideoUrl: string | null;
  generatedAudioUrl: string | null;
  generatedImage: string | null;
  audioRef: RefObject<HTMLAudioElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  onPlayVideo: () => void;
}

export function OutputPanel({
  isGenerating,
  isGeneratingVideo,
  generatedVideoUrl,
  generatedAudioUrl,
  generatedImage,
  audioRef,
  videoRef,
  onPlayVideo,
}: OutputPanelProps) {
  return (
    <div className="w-full aspect-square lg:aspect-auto lg:h-[calc(100vh-8rem)] bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden relative flex items-center justify-center shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

      {isGenerating || isGeneratingVideo ? (
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-zinc-200 animate-pulse">
              {isGeneratingVideo ? 'Directing your scene...' : 'Creating your masterpiece'}
            </p>
            <p className="text-sm text-zinc-500">
              {isGeneratingVideo ? 'Generating cinematic motion and speech...' : 'This usually takes a few seconds...'}
            </p>
          </div>
        </div>
      ) : generatedVideoUrl ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full relative group z-10 p-4 flex flex-col items-center justify-center"
        >
          <video
            ref={videoRef}
            src={generatedVideoUrl}
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
            loop
            onClick={onPlayVideo}
          />
          {generatedAudioUrl && <audio ref={audioRef} src={generatedAudioUrl} className="hidden" />}

          <div className="absolute bottom-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={onPlayVideo}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 border border-indigo-500 rounded-xl text-sm font-medium hover:bg-indigo-500 hover:scale-105 transition-all shadow-xl text-white"
            >
              Play with Audio
            </button>
            <a
              href={generatedVideoUrl}
              download={getRandomFileName('mp4')}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl text-white"
            >
              <Download className="w-4 h-4" />
              Download Video
            </a>
          </div>
        </motion.div>
      ) : generatedImage ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full h-full relative group z-10 p-4"
        >
          <img src={generatedImage} alt="Generated AI Art" className="w-full h-full object-contain rounded-2xl shadow-2xl" />
          <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <a
              href={generatedImage}
              download={getRandomFileName()}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl text-white"
            >
              <Download className="w-4 h-4" />
              Download High-Res
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-zinc-600 z-10">
          <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50">
            <ImageIcon className="w-8 h-8 opacity-50" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-medium text-zinc-400">No content generated yet</p>
            <p className="text-sm text-zinc-600">Enter a prompt and click generate to start</p>
          </div>
        </div>
      )}
    </div>
  );
}
