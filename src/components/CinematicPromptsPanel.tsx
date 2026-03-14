import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import type { CinematicPrompts } from '../types/app';

interface CinematicPromptsPanelProps {
  cinematicPrompts: CinematicPrompts | null;
  onClose: () => void;
}

export function CinematicPromptsPanel({
  cinematicPrompts,
  onClose,
}: CinematicPromptsPanelProps) {
  return (
    <AnimatePresence>
      {cinematicPrompts && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest">Cinematic Prompts</h3>
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Speech Script</label>
              <div
                className="p-2 bg-black/40 rounded-lg text-xs text-zinc-300 border border-zinc-800/50 select-all cursor-pointer hover:bg-black/60 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(cinematicPrompts.script);
                }}
              >
                {cinematicPrompts.script}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                Motion Prompt (for Grok/Flow)
              </label>
              <div
                className="p-2 bg-black/40 rounded-lg text-xs text-zinc-300 border border-zinc-800/50 select-all cursor-pointer hover:bg-black/60 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(cinematicPrompts.motion);
                }}
              >
                {cinematicPrompts.motion}
              </div>
            </div>
          </div>

          <p className="text-[9px] text-zinc-600 italic text-center">Click text to copy for Grok or Flow</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
