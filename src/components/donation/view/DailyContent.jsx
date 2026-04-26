import { motion } from "framer-motion";
import { Newspaper, Heart, MessageCircle, Share2, Clock } from "lucide-react";

const POSTS = [
  {
    text: "วันนี้จะสตรีมเกม Valorant ตั้งแต่ 2 ทุ่มเป็นต้นไป มาเจอกันนะครับ! 🎮🔥",
    time: "2 ชม.ที่แล้ว",
    likes: 48,
    comments: 12,
    image: null,
  },
  {
    text: "ขอบคุณทุกคนที่มาร่วมสตรีมเมื่อวาน ยอดโดเนทรวม 5,000 บาท! ❤️",
    time: "เมื่อวาน",
    likes: 156,
    comments: 34,
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=300&fit=crop",
  },
  {
    text: "Merch ใหม่มาแล้วจ้า! ใครอยากได้สั่งได้เลยน้า ✨",
    time: "2 วันที่แล้ว",
    likes: 89,
    comments: 22,
    image: null,
  },
];

export default function DailyContent() {
  const theme = {
  primary: "186, 230, 253",   // ฟ้าน้ำแข็งอ่อน (icy blue)
  secondary: "147, 197, 253", // ฟ้าเย็น
  accent: "255, 255, 255",    // ขาวหิมะ
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
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
        <div className="flex items-center gap-2 mb-4">
          <Newspaper
            className="w-4 h-4"
            style={{ color: `rgb(${theme.secondary})` }}
          />
          <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">
            📝 Content ประจำวัน
          </h3>
        </div>

        <div className="space-y-4">
          {POSTS.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{
                    background: `linear-gradient(135deg, rgba(${theme.primary},0.4), rgba(${theme.accent},0.4))`,
                    color: "#fff",
                  }}
                >
                  x8
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-relaxed">
                    {post.text}
                  </p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      className="w-full rounded-xl mt-2 border border-white/10"
                    />
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      {post.time}
                    </span>

                    <button className="flex items-center gap-1 text-xs text-white/50 hover:text-pink-400 transition">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </button>

                    <button className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </button>

                    <button className="flex items-center gap-1 text-xs text-white/50 hover:text-blue-400 transition">
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {i < POSTS.length - 1 && (
                <div className="mt-4 h-px bg-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}