import { AnimatePresence, motion } from 'motion/react';
import { Download, X } from 'lucide-react';

interface ImageLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageLightbox({ imageUrl, onClose }: ImageLightboxProps) {
  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={imageUrl} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'generated-image.png';
                link.click();
              }}
              className="absolute bottom-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 font-bold shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download High-Res
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
