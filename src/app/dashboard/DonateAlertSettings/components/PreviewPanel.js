// PreviewPanel.js (แก้ไข)
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, Eye } from "lucide-react";
import AlertPreview from "./AlertPreview";

export default function PreviewPanel({ settings, handleSave }) {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl space-y-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            Live Preview
          </h3>
        </div>

        {/* ส่วนแสดงผล Preview - ต้องไม่มี pointer-events-none ที่นี่ */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
          <AlertPreview settings={settings} />
        </div>

        {/* ปุ่ม Save Settings - เพิ่ม z-index และ cursor-pointer เพื่อความชัวร์ */}
        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 
            hover:from-cyan-400 hover:to-blue-400 
            text-white font-semibold py-6 rounded-xl 
            shadow-lg shadow-cyan-500/25
            z-50 cursor-pointer relative" // <--- เพิ่ม Z-index, Cursor, และ Relative
        >
          <Bell className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}