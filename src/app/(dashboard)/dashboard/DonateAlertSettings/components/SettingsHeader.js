import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsHeader({ settings, updateSetting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Donate Alert Settings
            </h2>
            <p className="text-slate-400">
              Customize how donation alerts appear on your stream
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={settings.enabled}
            onCheckedChange={(v) => updateSetting("enabled", v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
          <span
            className={settings.enabled ? "text-cyan-400" : "text-slate-500"}
          >
            {settings.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}