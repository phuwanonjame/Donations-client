import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Heart, MessageCircle } from "lucide-react";

const PHOTOS = [
  { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop", likes: 124, caption: "Setup ใหม่! 🎮" },
  { url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop", likes: 89, caption: "พร้อมสตรีม! 🔥" },
  { url: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop", likes: 256, caption: "แฟนมีตติ้ง ❤️" },
  { url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop", likes: 67, caption: "Merch ใหม่มาแล้ว" },
  { url: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=400&fit=crop", likes: 199, caption: "Gaming room ✨" },
  { url: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=400&h=400&fit=crop", likes: 341, caption: "กิจกรรมพิเศษ! 🎉" },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // 🎨 เปลี่ยนสีได้
const theme = {
  primary: "186, 230, 253",   // ฟ้าน้ำแข็งอ่อน (icy blue)
  secondary: "147, 197, 253", // ฟ้าเย็น
  accent: "255, 255, 255",    // ขาวหิมะ
};

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          "--primary": theme.primary,
          "--secondary": theme.secondary,
          "--accent": theme.accent,
        }}
        className="relative overflow-hidden p-4 rounded-2xl backdrop-blur-xl border border-white/10"
      >
        {/* 🔥 Dark layer */}
        <div className="absolute inset-0 bg-black/30" />

        {/* 🧊 Glass */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(0,0,0,0.55),
                rgba(0,0,0,0.35)
              )
            `,
            backdropFilter: "blur(18px)",
          }}
        />

        {/* 🌈 Gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
          <div
            className="w-full h-full rounded-2xl"
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

        {/* Glow BG */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
          style={{ background: `rgba(${theme.primary},0.25)` }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl"
          style={{ background: `rgba(${theme.secondary},0.25)` }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4" style={{ color: `rgb(${theme.accent})` }} />
            <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">
              📸 รูปภาพ & โมเมนต์
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {PHOTOS.map((photo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPhoto(photo)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-white text-xs">
                    <Heart className="w-3 h-3 fill-current" />
                    {photo.likes}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full rounded-2xl"
              />

              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <p className="text-white text-sm">{selectedPhoto.caption}</p>

                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-white/70 text-xs">
                    <Heart className="w-3 h-3" /> {selectedPhoto.likes}
                  </span>
                  <span className="flex items-center gap-1 text-white/70 text-xs">
                    <MessageCircle className="w-3 h-3" /> 12
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