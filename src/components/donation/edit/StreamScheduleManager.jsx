import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Pencil, Check, X, Plus, Trash2 } from "lucide-react";

const DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"];

let _uid = 0;
const uid = () => `slot-${++_uid}`;

const DEFAULT_SCHEDULE = DAYS.map((day) => ({
  day,
  slots: [], // { id, time, game }
  isOff: false,
  live: false,
}));

const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
};

// ── time picker ───────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

function TimePicker({ value, onChange }) {
  const [h, m] = value ? value.split(":") : ["20", "00"];
  return (
    <div className="flex items-center gap-1">
      <select
        value={h}
        onChange={(e) => onChange(`${e.target.value}:${m}`)}
        className="bg-white/10 border border-white/15 rounded-lg px-1.5 py-1 text-xs text-white outline-none focus:border-sky-300/50 transition-all appearance-none text-center w-12 cursor-pointer"
      >
        {HOURS.map((hh) => <option key={hh} value={hh} className="bg-gray-900">{hh}</option>)}
      </select>
      <span className="text-white/40 text-xs">:</span>
      <select
        value={m}
        onChange={(e) => onChange(`${h}:${e.target.value}`)}
        className="bg-white/10 border border-white/15 rounded-lg px-1.5 py-1 text-xs text-white outline-none focus:border-sky-300/50 transition-all appearance-none text-center w-12 cursor-pointer"
      >
        {MINUTES.map((mm) => <option key={mm} value={mm} className="bg-gray-900">{mm}</option>)}
      </select>
    </div>
  );
}

// แปลง { start, end } → string สำหรับแสดงผล
function formatTimeRange(start, end) {
  if (!start && !end) return "—";
  if (start && end) return `${start} - ${end}`;
  return start || end;
}

export default function StreamScheduleManager() {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [editingDay, setEditingDay] = useState(null); // index of day being edited

  // ── helpers ─────────────────────────────────────────────────────────────────
  const updateDay = (i, patch) =>
    setSchedule((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  const addSlot = (i) =>
    updateDay(i, { slots: [...schedule[i].slots, { id: uid(), start: "20:00", end: "23:00", game: "" }] });

  const updateSlot = (dayIdx, slotId, patch) =>
    setSchedule((prev) =>
      prev.map((d, i) =>
        i !== dayIdx
          ? d
          : {
              ...d,
              slots: d.slots.map((s) => (s.id === slotId ? { ...s, ...patch } : s)),
            }
      )
    );

  const removeSlot = (dayIdx, slotId) =>
    setSchedule((prev) =>
      prev.map((d, i) =>
        i !== dayIdx ? d : { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
      )
    );

  const toggleOff = (i) => {
    updateDay(i, { isOff: !schedule[i].isOff, slots: [] });
  };

  const toggleLive = (i) => updateDay(i, { live: !schedule[i].live });

  const closeEdit = () => setEditingDay(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden p-4 rounded-2xl"
    >
      {/* Glass */}
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
          backdropFilter: "blur(18px)",
        }}
      />

      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
        <div
          className="w-full h-full rounded-2xl"
          style={{
            background: `linear-gradient(120deg, rgba(${theme.primary},0.6), rgba(${theme.secondary},0.6), rgba(${theme.accent},0.6))`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      </div>

      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.primary},0.25)` }} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.secondary},0.25)` }} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4" style={{ color: `rgb(${theme.primary})` }} />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">ตารางสตรีม</span>
        </div>

        <div className="space-y-1.5">
          {schedule.map((s, i) => (
            <div key={s.day}>
              {/* ── Row ── */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className={`flex items-start gap-3 px-3 py-2 rounded-xl transition-all ${
                  s.live
                    ? "bg-white/10 border border-white/20"
                    : s.isOff
                    ? "opacity-40"
                    : "hover:bg-white/5"
                }`}
              >
                {/* Day label */}
                <span
                  className="text-xs font-medium w-12 pt-0.5 flex-shrink-0"
                  style={{ color: s.live ? `rgb(${theme.primary})` : "rgba(255,255,255,0.6)" }}
                >
                  {s.day}
                </span>

                {/* Slots */}
                <div className="flex-1 min-w-0">
                  {s.isOff ? (
                    <span className="text-xs text-white/50">วันหยุด</span>
                  ) : s.slots.length === 0 ? (
                    <span className="text-[10px] text-white/30">ยังไม่มีตาราง</span>
                  ) : (
                    <div className="space-y-1">
                      {s.slots.map((slot) => (
                        <div key={slot.id}>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-white/40 flex-shrink-0" />
                            <span className="text-xs text-white">{formatTimeRange(slot.start, slot.end)}</span>
                          </div>
                          {slot.game && (
                            <span className="text-[10px] text-white/50 ml-[18px] block">{slot.game}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side: live badge + edit btn */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {s.live && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      LIVE
                    </span>
                  )}
                  <button
                    onClick={() => setEditingDay(editingDay === i ? null : i)}
                    className="p-1 rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>

              {/* ── Edit panel ── */}
              <AnimatePresence>
                {editingDay === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mx-1 mb-2 rounded-xl p-3 border border-white/10 space-y-3"
                      style={{ background: `rgba(${theme.primary},0.06)` }}
                    >
                      {/* Toggle row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Off toggle */}
                        <button
                          onClick={() => toggleOff(i)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all"
                          style={{
                            background: s.isOff ? `rgba(${theme.primary},0.2)` : "rgba(255,255,255,0.08)",
                            color: s.isOff ? `rgb(${theme.primary})` : "rgba(255,255,255,0.5)",
                            border: `1px solid ${s.isOff ? `rgba(${theme.primary},0.4)` : "rgba(255,255,255,0.1)"}`,
                          }}
                        >
                          {s.isOff ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          วันหยุด
                        </button>

                        {/* Live toggle */}
                        {!s.isOff && (
                          <button
                            onClick={() => toggleLive(i)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all"
                            style={{
                              background: s.live ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
                              color: s.live ? "rgb(248,113,113)" : "rgba(255,255,255,0.5)",
                              border: `1px solid ${s.live ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
                            }}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.live ? "bg-red-400 animate-pulse" : "bg-white/30"}`} />
                            LIVE
                          </button>
                        )}
                      </div>

                      {/* Slot editor */}
                      {!s.isOff && (
                        <div className="space-y-2">
                          {s.slots.map((slot) => (
                            <div key={slot.id} className="space-y-2 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                              {/* Time row */}
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-white/30 flex-shrink-0" />
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  <span className="text-[10px] text-white/40 flex-shrink-0">เริ่ม</span>
                                  <TimePicker
                                    value={slot.start}
                                    onChange={(v) => updateSlot(i, slot.id, { start: v })}
                                  />
                                  <span className="text-[10px] text-white/40 flex-shrink-0">ถึง</span>
                                  <TimePicker
                                    value={slot.end}
                                    onChange={(v) => updateSlot(i, slot.id, { end: v })}
                                  />
                                </div>
                                <button
                                  onClick={() => removeSlot(i, slot.id)}
                                  className="p-1 rounded text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              {/* Content row */}
                              <div className="flex items-center gap-2 pl-5">
                                <input
                                  value={slot.game}
                                  onChange={(e) => updateSlot(i, slot.id, { game: e.target.value })}
                                  placeholder="เกม / Content"
                                  className="w-full bg-white/10 border border-white/15 rounded-lg px-2 py-1 text-xs text-white placeholder-white/30 outline-none focus:border-sky-300/50 transition-all"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => addSlot(i)}
                            className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg transition-all w-full justify-center"
                            style={{
                              color: `rgba(${theme.primary},0.7)`,
                              background: `rgba(${theme.primary},0.08)`,
                              border: `1px dashed rgba(${theme.primary},0.2)`,
                            }}
                          >
                            <Plus className="w-3 h-3" />
                            เพิ่มช่วงเวลา
                          </button>
                        </div>
                      )}

                      {/* Done */}
                      <div className="flex justify-end">
                        <button
                          onClick={closeEdit}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-semibold transition-all"
                          style={{
                            background: `rgb(${theme.primary})`,
                            color: "#0c1a2e",
                          }}
                        >
                          <Check className="w-3 h-3" />
                          เสร็จแล้ว
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}