import { motion } from "framer-motion";
import { Gift, TrendingUp } from "lucide-react";

const RECENT_DONATIONS = [
  { initials: "NN", name: "น้องนะโม", message: "ส่งกำลังใจให้ครับ! 🔥", amount: 100, timeAgo: "2 นาทีที่แล้ว", emoji: "⚡" },
  { initials: "PK", name: "Pakorn", message: "เพลงนี้โหดมากๆ", amount: 50, timeAgo: "15 นาทีที่แล้ว", emoji: "🎵" },
  { initials: "AN", name: "Anonymous", message: "ขอบคุณนะครับ", amount: 20, timeAgo: "1 ชม.ที่แล้ว", emoji: "❤️" },
  { initials: "JK", name: "JokerX", message: "เก่งมาก clutch สุดๆ", amount: 200, timeAgo: "2 ชม.ที่แล้ว", emoji: "💎" },
  { initials: "MM", name: "MewMew", message: "สู้ๆนะคะ!", amount: 30, timeAgo: "3 ชม.ที่แล้ว", emoji: "🌟" },
];

export default function RecentDonations() {
  const todayTotal = RECENT_DONATIONS.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-4 neon-border"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            📊 สรุปวันนี้
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gradient-to-br from-primary/10 to-pink-500/10 border border-primary/20 rounded-xl p-3 text-center">
            <p className="text-[11px] text-muted-foreground">ยอดรวม</p>
            <p className="text-2xl font-heading font-bold text-foreground mt-0.5 text-glow">
              ฿{todayTotal}
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-emerald-500/10 border border-accent/20 rounded-xl p-3 text-center">
            <p className="text-[11px] text-muted-foreground">ครั้ง</p>
            <p className="text-2xl font-heading font-bold text-foreground mt-0.5">
              {RECENT_DONATIONS.length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Donation list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4 neon-border"
      >
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            🎁 โดเนทล่าสุด
          </h3>
        </div>
        <div className="space-y-1">
          {RECENT_DONATIONS.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/30 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">{d.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground truncate">{d.message}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-heading font-bold text-primary">฿{d.amount}</p>
                <p className="text-[11px] text-muted-foreground">{d.timeAgo}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ad slot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-4 neon-border"
      >
        <div className="bg-secondary/30 border border-dashed border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">// ช่วงโฆษณา</p>
          <p className="text-sm font-medium text-foreground mt-1">สนใจลงโฆษณา?</p>
          <a href="#" className="text-xs text-primary hover:underline mt-0.5 block">ติดต่อเราเลย</a>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed text-center">
          อยากมีหน้ารับเงินแบบนี้?{" "}
          <a href="/" className="text-primary hover:underline">เริ่มต้นกับเราเลย!</a>
        </p>
      </motion.div>
    </div>
  );
}