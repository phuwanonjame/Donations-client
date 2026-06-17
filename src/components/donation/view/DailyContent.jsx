import { motion } from "framer-motion";
import { Newspaper, Heart, MessageCircle, Share2, Clock } from "lucide-react";

const POSTS = [
  {
    text: "วันนี้จะสตรีมเกม Valorant ตั้งแต่ 2 ทุ่มเป็นต้นไป มาเจอกันนะครับ!",
    time: "2 ชม.ที่แล้ว",
    likes: 48,
    comments: 12,
    image: null,
  },
  {
    text: "ขอบคุณทุกคนที่มาร่วมสตรีมเมื่อวาน ยอดโดเนทรวม 5,000 บาท!",
    time: "เมื่อวาน",
    likes: 156,
    comments: 34,
    image:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=300&fit=crop",
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

export default function DailyContent({
  posts = POSTS,
  visualTheme = defaultTheme,
}) {
  const theme = { ...defaultTheme, ...visualTheme };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl p-4"
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
        <div className="mb-4 flex items-center gap-2">
          <Newspaper
            className="h-4 w-4"
            style={{ color: `rgb(${theme.secondary})` }}
          />
          <h3
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: rgba(theme.mutedText, 0.6) }}
          >
            Content ประจำวัน
          </h3>
        </div>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group"
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${rgba(
                      theme.primary,
                      0.4
                    )}, ${rgba(theme.accent, 0.4)})`,
                    color: `rgb(${theme.text})`,
                  }}
                >
                  x8
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: `rgb(${theme.text})` }}
                  >
                    {post.text}
                  </p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      className="mt-2 w-full rounded-xl border border-white/10"
                    />
                  )}

                  <div className="mt-2 flex items-center gap-4">
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{ color: rgba(theme.mutedText, 0.5) }}
                    >
                      <Clock className="h-3 w-3" />
                      {post.time}
                    </span>

                    <button
                      className="flex items-center gap-1 text-xs transition hover:text-pink-400"
                      style={{ color: rgba(theme.mutedText, 0.5) }}
                    >
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </button>

                    <button
                      className="flex items-center gap-1 text-xs transition hover:text-white"
                      style={{ color: rgba(theme.mutedText, 0.5) }}
                    >
                      <MessageCircle className="h-3 w-3" />
                      {post.comments}
                    </button>

                    <button
                      className="flex items-center gap-1 text-xs transition hover:text-blue-400"
                      style={{ color: rgba(theme.mutedText, 0.5) }}
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {i < posts.length - 1 && <div className="mt-4 h-px bg-white/10" />}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
