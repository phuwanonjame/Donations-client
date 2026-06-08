import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

const DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const SHORT_DAYS = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

function getDefaultSchedule() {
  return DAYS.map((day) => ({
    day,
    start_time: "20:00",
    end_time: "23:00",
    game: "",
    is_active: true,
  }));
}

export default function StreamScheduleManager({ config = {}, onUpdate = () => {} }) {
  const externalSchedule = useMemo(
    () => (config.stream_schedule?.length === 7 ? config.stream_schedule : null),
    [config.stream_schedule]
  );
  const [localSchedule, setLocalSchedule] = useState(getDefaultSchedule);
  const schedule = externalSchedule || localSchedule;

  const updateDay = (index, field, value) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    if (!externalSchedule) {
      setLocalSchedule(updated);
    }
    onUpdate({ stream_schedule: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-base font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          ตารางการสตรีม
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          ตั้งเวลาสตรีมของแต่ละวันเพื่อให้แฟน ๆ รู้ว่าคุณจะออนไลน์ช่วงไหน
        </p>
      </div>

      <div className="space-y-3">
        {schedule.map((item, index) => (
          <motion.div
            key={item.day}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-white/10 bg-black/10 p-4 transition-all duration-200"
          >
            <div className="mb-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.day}
                </p>
                <p className="mt-1 text-xs text-white/45">
                  กำหนดเวลาสตรีมของวัน{SHORT_DAYS[index]}
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Input
                  type="time"
                  value={item.start_time}
                  onChange={(e) => updateDay(index, "start_time", e.target.value)}
                  className="bg-secondary/50 border-border/50 h-9 text-sm"
                />
                <span className="text-muted-foreground text-sm">-</span>
                <Input
                  type="time"
                  value={item.end_time}
                  onChange={(e) => updateDay(index, "end_time", e.target.value)}
                  className="bg-secondary/50 border-border/50 h-9 text-sm"
                />
              </div>
              <Input
                value={item.game}
                onChange={(e) => updateDay(index, "game", e.target.value)}
                placeholder="เกม / กิจกรรม"
                className="bg-secondary/50 border-border/50 h-9 text-sm sm:col-span-2"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
