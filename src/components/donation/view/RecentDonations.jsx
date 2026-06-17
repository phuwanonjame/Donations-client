import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const RECENT_DONATIONS = [
  {
    initials: "NN",
    name: "น้องนะโม",
    message: "ส่งกำลังใจให้ครับ!",
    amount: 100,
    timeAgo: "2 นาทีที่แล้ว",
  },
  {
    initials: "PK",
    name: "Pakorn",
    message: "เพลงนี้โหดมากๆ",
    amount: 50,
    timeAgo: "15 นาทีที่แล้ว",
  },
  {
    initials: "AN",
    name: "Anonymous",
    message: "ขอบคุณนะครับ",
    amount: 20,
    timeAgo: "1 ชม.ที่แล้ว",
  },
];

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
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

export default function RecentDonations({
  donations = RECENT_DONATIONS,
  visualTheme = defaultTheme,
}) {
  const todayTotal = donations.reduce((s, d) => s + d.amount, 0);
  const theme = { ...defaultTheme, ...visualTheme };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
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

      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div
            className="rounded-xl border p-3 text-center backdrop-blur-md"
            style={{
              background: rgba(theme.baseSecondary, 0.42),
              borderColor: rgba(theme.primary, 0.18),
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: rgba(theme.mutedText, 0.5) }}
            >
              ยอดรวมวันนี้
            </p>
            <p
              className="mt-0.5 text-2xl font-bold"
              style={{ color: `rgb(${theme.text})` }}
            >
              ฿{todayTotal}
            </p>
          </div>

          <div
            className="rounded-xl border p-3 text-center backdrop-blur-md"
            style={{
              background: rgba(theme.baseSecondary, 0.42),
              borderColor: rgba(theme.primary, 0.18),
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: rgba(theme.mutedText, 0.5) }}
            >
              จำนวนครั้ง
            </p>
            <p
              className="mt-0.5 text-2xl font-bold"
              style={{ color: `rgb(${theme.text})` }}
            >
              {donations.length}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4" style={{ color: `rgb(${theme.accent})` }} />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: rgba(theme.mutedText, 0.6) }}
            >
              โดเนทล่าสุด
            </span>
          </div>

          <div className="space-y-2">
            {donations.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-white/10"
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${
                    AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                  }`}
                >
                  {d.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: `rgb(${theme.text})` }}
                  >
                    {d.name}
                  </p>
                  <p
                    className="truncate text-xs"
                    style={{ color: rgba(theme.mutedText, 0.6) }}
                  >
                    {d.message}
                  </p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p
                    className="text-sm font-bold"
                    style={{ color: `rgb(${theme.primary})` }}
                  >
                    ฿{d.amount}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: rgba(theme.mutedText, 0.5) }}
                  >
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
