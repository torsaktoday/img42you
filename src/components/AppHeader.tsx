import { Settings, Sparkles } from 'lucide-react';

interface AppHeaderProps {
  showSettingsButton: boolean;
  onOpenSettings: () => void;
}

export function AppHeader({ showSettingsButton, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            AI Image Studio
          </h1>
        </div>

        {showSettingsButton && (
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            title="Admin Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
