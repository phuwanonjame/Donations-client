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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-2xl p-4 neon-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">x8</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{post.text}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="w-full rounded-xl mt-2 border border-border"
                  />
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {post.time}
                  </span>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-pink-400 transition-colors">
                    <Heart className="w-3 h-3" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <MessageCircle className="w-3 h-3" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            {i < POSTS.length - 1 && <div className="border-t border-border mt-4" />}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}