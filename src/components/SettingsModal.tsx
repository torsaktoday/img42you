import { AnimatePresence, motion } from 'motion/react';
import { Key, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  tempApiKey: string;
  onTempApiKeyChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function SettingsModal({
  isOpen,
  tempApiKey,
  onTempApiKeyChange,
  onClose,
  onSave,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#141414] border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <Key className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">Admin Settings</h2>
                  <p className="text-xs text-zinc-500">Configure your API credentials</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(event) => onTempApiKeyChange(event.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
                <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                  Your API key is stored locally in your browser&apos;s localStorage and is never sent to any server other than Google&apos;s API.
                </p>
              </div>

              <button
                onClick={onSave}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
