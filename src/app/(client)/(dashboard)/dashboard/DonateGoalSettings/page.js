// DonateGoalSettings.jsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import GoalSettingsForm from './components/GoalSettingsForm';
import PreviewPanel from './components/PreviewPanel';
import { defaultSettings } from './constants/donate-goal';

export default function DonateGoalSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  const update = (key, value) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = (metadata) => {
    console.log(JSON.stringify(metadata, null, 2));
    // TODO: ส่ง API request ที่นี่
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Donate Goal Settings</h2>
              <p className="text-sm sm:text-base text-slate-400">ตั้งค่าวิดเจ็ตเป้าหมายการรับบริจาค</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <GoalSettingsForm settings={settings} update={update} />
        </div>
        <div>
          <PreviewPanel settings={settings} update={update} onSave={handleSave} />
        </div>
      </div>

      <style>{`
        @keyframes goalShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}