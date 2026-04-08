import { motion } from "framer-motion";
import { Calendar, Clock, Gamepad2, Mic, Monitor } from "lucide-react";

const SCHEDULE = [
  { day: "จันทร์", time: "20:00 - 00:00", game: "Valorant", icon: Gamepad2, isLive: false, color: "from-red-500/20 to-orange-500/20", borderColor: "border-red-500/20" },
  { day: "อังคาร", time: "21:00 - 01:00", game: "Just Chatting", icon: Mic, isLive: false, color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/20" },
  { day: "พุธ", time: "20:00 - 23:00", game: "League of Legends", icon: Monitor, isLive: false, color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/20" },
  { day: "พฤหัสบดี", time: "OFF", game: "พักผ่อน 😴", icon: null, isLive: false, color: "from-gray-500/10 to-gray-500/10", borderColor: "border-border" },
  { day: "ศุกร์", time: "20:00 - 02:00", game: "Valorant Ranked", icon: Gamepad2, isLive: false, color: "from-red-500/20 to-orange-500/20", borderColor: "border-red-500/20" },
  { day: "เสาร์", time: "14:00 - 02:00", game: "Marathon Stream!", icon: Monitor, isLive: true, color: "from-emerald-500/20 to-cyan-500/20", borderColor: "border-emerald-500/30" },
  { day: "อาทิตย์", time: "15:00 - 22:00", game: "Variety Games", icon: Gamepad2, isLive: false, color: "from-yellow-500/20 to-orange-500/20", borderColor: "border-yellow-500/20" },
];

export default function StreamSchedule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-2xl p-4 neon-border"
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          📅 ตารางสตรีม
        </h3>
      </div>

      <div className="space-y-1.5">
        {SCHEDULE.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            whileHover={{ x: 3 }}
            className={`flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r ${item.color} border ${item.borderColor} transition-all`}
          >
            <div className="w-14 text-center flex-shrink-0">
              <p className="text-xs font-semibold text-foreground">{item.day}</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs text-foreground truncate">{item.game}</p>
                {item.isLive && (
                  <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/30 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Clock className="w-3 h-3" />
              {item.time}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}