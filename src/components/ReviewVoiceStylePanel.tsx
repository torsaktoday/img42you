import { AnimatePresence, motion } from 'motion/react';
import { Gauge, Headphones, Loader2, Mic2, Radio, Sparkles } from 'lucide-react';
import { reviewStyles, voiceMoodPresets, voicePresets, voiceSpeedPresets } from '../constants/app';
import type { VoiceCategory, VoiceMood, VoiceSpeed } from '../types/app';

interface ReviewVoiceStylePanelProps {
  selectedCategory: VoiceCategory;
  selectedVoiceId: string;
  selectedStyleId: string;
  selectedSpeedId: VoiceSpeed;
  selectedMoodId: VoiceMood;
  isPreviewingVoice: boolean;
  previewAudioUrl: string | null;
  onCategoryChange: (category: VoiceCategory) => void;
  onVoiceChange: (voiceId: string) => void;
  onStyleChange: (styleId: string) => void;
  onSpeedChange: (speedId: VoiceSpeed) => void;
  onMoodChange: (moodId: VoiceMood) => void;
  onPreviewVoice: () => void;
}

const categoryLabels: Record<VoiceCategory, string> = {
  female: 'หญิง',
  male: 'ชาย',
  kid: 'เด็ก',
  teen: 'วัยรุ่น',
};

export function ReviewVoiceStylePanel({
  selectedCategory,
  selectedVoiceId,
  selectedStyleId,
  selectedSpeedId,
  selectedMoodId,
  isPreviewingVoice,
  previewAudioUrl,
  onCategoryChange,
  onVoiceChange,
  onStyleChange,
  onSpeedChange,
  onMoodChange,
  onPreviewVoice,
}: ReviewVoiceStylePanelProps) {
  const voicesInCategory = voicePresets.filter((voice) => voice.category === selectedCategory);
  const selectedVoice = voicePresets.find((voice) => voice.id === selectedVoiceId);
  const selectedStyle = reviewStyles.find((style) => style.id === selectedStyleId);
  const selectedSpeed = voiceSpeedPresets.find((speed) => speed.id === selectedSpeedId);
  const selectedMood = voiceMoodPresets.find((mood) => mood.id === selectedMoodId);

  return (
    <section className="space-y-4 p-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/5">
      <div className="space-y-1">
        <label className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Thai Review Voice Studio
        </label>
        <p className="text-xs text-zinc-400 leading-relaxed">
          เลือกเสียง สไตล์ ความเร็ว และอารมณ์ก่อนกดสร้าง Thai review เพื่อให้บท เสียง และซีนไปทางเดียวกัน
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">หมวดเสียง</p>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(categoryLabels) as VoiceCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
                selectedCategory === category
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">เลือกเสียง</p>
        <div className="grid grid-cols-1 gap-2">
          {voicesInCategory.map((voice) => (
            <button
              key={voice.id}
              onClick={() => onVoiceChange(voice.id)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                selectedVoiceId === voice.id
                  ? 'bg-cyan-500/10 border-cyan-400/60 text-zinc-100'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{voice.label}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{voice.description}</p>
                </div>
                <div className="shrink-0 rounded-xl bg-black/30 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-300">
                  {voice.energy}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">สไตล์การพูด/การขาย</p>
        <div className="grid grid-cols-2 gap-2">
          {reviewStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                selectedStyleId === style.id
                  ? 'bg-amber-500/10 border-amber-400/60 text-zinc-100'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-3.5 h-3.5 text-amber-300" />
                <p className="text-xs font-bold">{style.label}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ความเร็วการพูด</p>
        <div className="grid grid-cols-3 gap-2">
          {voiceSpeedPresets.map((speed) => (
            <button
              key={speed.id}
              onClick={() => onSpeedChange(speed.id)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                selectedSpeedId === speed.id
                  ? 'bg-lime-500/10 border-lime-400/60 text-zinc-100'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-3.5 h-3.5 text-lime-300" />
                <p className="text-xs font-bold">{speed.label}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">{speed.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">โทนอารมณ์เสียง</p>
        <div className="grid grid-cols-2 gap-2">
          {voiceMoodPresets.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onMoodChange(mood.id)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                selectedMoodId === mood.id
                  ? 'bg-pink-500/10 border-pink-400/60 text-zinc-100'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <p className="text-xs font-bold">{mood.label}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">{mood.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-black/20 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-cyan-300" />
              พร้อมลองฟังเสียงตัวอย่าง
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              เสียง: {selectedVoice?.label || '-'} | สไตล์: {selectedStyle?.shortLabel || '-'}
            </p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              ความเร็ว: {selectedSpeed?.label || '-'} | อารมณ์: {selectedMood?.label || '-'}
            </p>
          </div>
          <button
            onClick={onPreviewVoice}
            disabled={isPreviewingVoice || !selectedVoice || !selectedStyle || !selectedSpeed || !selectedMood}
            className="shrink-0 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 px-3 py-2 text-xs font-bold transition-all disabled:opacity-50"
          >
            {isPreviewingVoice ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                กำลังสร้าง...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5" />
                ลองฟังเสียง
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {previewAudioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-2"
            >
              <label className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest block">Preview Audio</label>
              <audio key={previewAudioUrl} src={previewAudioUrl} controls className="w-full h-10 rounded-lg bg-black/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
