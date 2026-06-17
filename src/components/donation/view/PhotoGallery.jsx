import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Heart, MessageCircle } from "lucide-react";

const PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
    likes: 124,
    caption: "Setup ใหม่!",
  },
  {
    url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop",
    likes: 89,
    caption: "พร้อมสตรีม!",
  },
  {
    url: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop",
    likes: 256,
    caption: "แฟนมีตติ้ง",
  },
  {
    url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop",
    likes: 67,
    caption: "Merch ใหม่มาแล้ว",
  },
];

const defaultTheme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
  base: "4, 15, 30",
  baseSecondary: "12, 28, 48",
  text: "255, 255, 255",
  mutedText: "255, 255, 255",
};

const rgba = (rgb, opacity) => `rgba(${rgb},${opacity})`;

export default function PhotoGallery({
  photos = PHOTOS,
  visualTheme = defaultTheme,
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const theme = { ...defaultTheme, ...visualTheme };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 p-4 backdrop-blur-xl"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${rgba(theme.base, 0.82)}, ${rgba(
              theme.baseSecondary,
              0.68
            )})`,
            backdropFilter: "blur(18px)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]">
          <div
            className="h-full w-full rounded-2xl"
            style={{
              background: `linear-gradient(120deg, rgba(${theme.primary},0.6), rgba(${theme.secondary},0.6), rgba(${theme.accent},0.6))`,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          />
        </div>

        <div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: rgba(theme.primary, 0.25) }}
        />
        <div
          className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: rgba(theme.secondary, 0.25) }}
        />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4" style={{ color: `rgb(${theme.accent})` }} />
            <h3
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: rgba(theme.mutedText, 0.6) }}
            >
              รูปภาพ & โมเมนต์
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-xs text-white">
                    <Heart className="h-3 w-3 fill-current" />
                    {photo.likes}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full rounded-2xl"
              />

              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm text-white">{selectedPhoto.caption}</p>

                <div className="mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-white/70">
                    <Heart className="h-3 w-3" /> {selectedPhoto.likes}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/70">
                    <MessageCircle className="h-3 w-3" /> 12
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
