import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const RECENT_DONATIONS = [
  { initials: "NN", name: "น้องนะโม", message: "ส่งกำลังใจให้ครับ!", amount: 100, timeAgo: "2 นาทีที่แล้ว" },
  { initials: "PK", name: "Pakorn", message: "เพลงนี้โหดมากๆ", amount: 50, timeAgo: "15 นาทีที่แล้ว" },
  { initials: "AN", name: "Anonymous", message: "ขอบคุณนะครับ", amount: 20, timeAgo: "1 ชม.ที่แล้ว" },
  { initials: "SK", name: "SakuraFan", message: "มาเชียร์ทุกวัน ❤️", amount: 200, timeAgo: "2 ชม.ที่แล้ว" },
  { initials: "GM", name: "GamerTH", message: "GG ครับพี่", amount: 30, timeAgo: "3 ชม.ที่แล้ว" },
];

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
];

export default function RecentDonations() {
  const todayTotal = RECENT_DONATIONS.reduce((s, d) => s + d.amount, 0);

  const theme = {
  primary: "186, 230, 253",   // ฟ้าน้ำแข็งอ่อน (icy blue)
  secondary: "147, 197, 253", // ฟ้าเย็น
  accent: "255, 255, 255",    // ขาวหิมะ
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
      className="relative overflow-hidden p-4 rounded-2xl"
    >
      {/* 🔥 Dark base */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 🧊 Glass layer */}
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
      <div className="relative z-10 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md">
            <p className="text-[10px] text-white/50 uppercase tracking-wider">
              ยอดรวมวันนี้
            </p>
            <p className="text-2xl font-bold text-white mt-0.5">
              ฿{todayTotal}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md">
            <p className="text-[10px] text-white/50 uppercase tracking-wider">
              จำนวนครั้ง
            </p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {RECENT_DONATIONS.length}
            </p>
          </div>
        </div>

        {/* List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart
              className="w-4 h-4"
              style={{ color: `rgb(${theme.accent})` }}
            />
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              โดเนทล่าสุด
            </span>
          </div>

          <div className="space-y-2">
            {RECENT_DONATIONS.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all"
              >
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${
                    AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                  } flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}
                >
                  {d.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {d.name}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {d.message}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                    className="text-sm font-bold"
                    style={{ color: `rgb(${theme.primary})` }}
                  >
                    ฿{d.amount}
                  </p>
                  <p className="text-[10px] text-white/50">
                    {d.timeAgo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}