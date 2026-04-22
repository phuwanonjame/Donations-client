import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const SCHEDULE = [
  { day: "จันทร์", time: "20:00 - 23:00", game: "Valorant", live: false },
  { day: "อังคาร", time: "20:00 - 23:00", game: "Just Chatting", live: false },
  { day: "พุธ", time: "OFF", game: "", live: false },
  { day: "พฤหัส", time: "20:00 - 00:00", game: "GTA V RP", live: false },
  { day: "ศุกร์", time: "19:00 - 01:00", game: "Game Night", live: false },
  { day: "เสาร์", time: "14:00 - 22:00", game: "Marathon Stream", live: true },
  { day: "อาทิตย์", time: "15:00 - 20:00", game: "Special Event", live: false },
];

export default function StreamSchedule() {
  const theme = {
  primary: "186, 230, 253",   // ฟ้าน้ำแข็งอ่อน (icy blue)
  secondary: "147, 197, 253", // ฟ้าเย็น
  accent: "255, 255, 255",    // ขาวหิมะ
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
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
          <Calendar
            className="w-4 h-4"
            style={{ color: `rgb(${theme.primary})` }}
          />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
            ตารางสตรีม
          </span>
        </div>

        <div className="space-y-1.5">
          {SCHEDULE.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                s.live
                  ? "bg-white/10 border border-white/20"
                  : s.time === "OFF"
                  ? "opacity-40"
                  : "hover:bg-white/10"
              }`}
            >
              <span
                className="text-xs font-medium w-12"
                style={{
                  color: s.live
                    ? `rgb(${theme.primary})`
                    : "rgba(255,255,255,0.6)",
                }}
              >
                {s.day}
              </span>

              <div className="flex-1 min-w-0">
                {s.time === "OFF" ? (
                  <span className="text-xs text-white/50">วันหยุด</span>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-white/50" />
                      <span className="text-xs text-white">{s.time}</span>
                    </div>
                    {s.game && (
                      <span className="text-[10px] text-white/50">
                        {s.game}
                      </span>
                    )}
                  </>
                )}
              </div>

              {s.live && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}