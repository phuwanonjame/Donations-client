import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Eye, Clock, Film } from "lucide-react";

const VIDEOS = [
  {
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
    title: "Clutch 1v5 Valorant!!",
    views: "12.5K",
    duration: "0:45",
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
    title: "โดเนทเพลง สุดฮา 😂",
    views: "8.2K",
    duration: "1:20",
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop",
    title: "รีแอคชั่นสุดโหด!",
    views: "15.1K",
    duration: "0:58",
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=225&fit=crop",
    title: "ชนะทัวร์นาเมนต์! 🏆",
    views: "22.3K",
    duration: "2:10",
  },
];

export default function VideoHighlights() {
  const [playingIndex, setPlayingIndex] = useState(null);

  const theme = {
  primary: "186, 230, 253",   // ฟ้าน้ำแข็งอ่อน (icy blue)
  secondary: "147, 197, 253", // ฟ้าเย็น
  accent: "255, 255, 255",    // ขาวหิมะ
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
      className="relative overflow-hidden p-4 rounded-2xl"
    >
      {/* 🔥 Dark base */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 🧊 Glass */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))`,
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

      {/* 💡 Glow */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
        style={{ background: `rgba(${theme.primary},0.25)` }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl"
        style={{ background: `rgba(${theme.secondary},0.25)` }}
      />

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Film
            className="w-4 h-4"
            style={{ color: `rgb(${theme.accent})` }}
          />
          <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">
            🎬 Highlight คลิปสั้น
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
          {VIDEOS.map((video, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                setPlayingIndex(i === playingIndex ? null : i)
              }
              className="flex-shrink-0 w-40 cursor-pointer group"
            >
              {/* 🎥 Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </motion.div>
                </div>

                {/* duration */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 backdrop-blur-sm">
                  <Clock className="w-2.5 h-2.5" />
                  {video.duration}
                </div>
              </div>

              {/* text */}
              <p className="text-xs font-medium text-white mt-2 truncate">
                {video.title}
              </p>
              <p className="text-[11px] text-white/60 flex items-center gap-1">
                <Eye className="w-3 h-3" /> {video.views} views
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}