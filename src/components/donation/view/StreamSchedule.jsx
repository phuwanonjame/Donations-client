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

export default function StreamSchedule({
  schedule = SCHEDULE,
  visualTheme = defaultTheme,
}) {
  const theme = { ...defaultTheme, ...visualTheme };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
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
          <Calendar
            className="h-4 w-4"
            style={{ color: `rgb(${theme.primary})` }}
          />
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: rgba(theme.mutedText, 0.6) }}
          >
            ตารางสตรีม
          </span>
        </div>

        <div className="space-y-1.5">
          {schedule.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                s.live
                  ? "border border-white/20 bg-white/10"
                  : s.time === "OFF"
                  ? "opacity-40"
                  : "hover:bg-white/10"
              }`}
            >
              <span
                className="w-12 text-xs font-medium"
                style={{
                  color: s.live
                    ? `rgb(${theme.primary})`
                    : rgba(theme.mutedText, 0.6),
                }}
              >
                {s.day}
              </span>

              <div className="min-w-0 flex-1">
                {s.time === "OFF" ? (
                  <span
                    className="text-xs"
                    style={{ color: rgba(theme.mutedText, 0.5) }}
                  >
                    วันหยุด
                  </span>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Clock
                        className="h-3 w-3"
                        style={{ color: rgba(theme.mutedText, 0.5) }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: `rgb(${theme.text})` }}
                      >
                        {s.time}
                      </span>
                    </div>
                    {s.game && (
                      <span
                        className="text-[10px]"
                        style={{ color: rgba(theme.mutedText, 0.5) }}
                      >
                        {s.game}
                      </span>
                    )}
                  </>
                )}
              </div>

              {s.live && (
                <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
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
