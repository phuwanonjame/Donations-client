"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

import WidgetUrlHeaderField from "../components/WidgetUrlHeaderField";
import GoalSettingsForm from "./components/GoalSettingsForm";
import PreviewPanel from "./components/PreviewPanel";
import {
  DonateGoalSettingsProvider,
  useDonateGoalSettings,
} from "./components/context/DonateGoalSettingsProvider";

function GoalSettingsHeader() {
  const { showHeader, widgetId } = useDonateGoalSettings();

  return (
    <div className={`overflow-hidden transition-all duration-300 ease-out ${showHeader ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-5 sm:p-6"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 shadow-lg shadow-emerald-500/25 sm:p-4">
              <Target className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">Donate Goal Settings</h2>
              <p className="text-sm text-slate-400 sm:text-base">ตั้งค่าวิดเจ็ตเป้าหมายการรับบริจาค</p>
            </div>
          </div>
        </div>
        <WidgetUrlHeaderField type="goal" widgetId={widgetId} accentClass="text-emerald-300" />
      </motion.div>
    </div>
  );
}

function DonateGoalSettingsContent() {
  const { loading } = useDonateGoalSettings();

  return (
    <div className="space-y-6 px-4 py-4 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <GoalSettingsHeader />

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
          Loading goal settings...
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-[2]">
            <div className="md:sticky md:top-6 md:self-start">
              <PreviewPanel />
            </div>
          </div>

          <div className="min-w-0 flex-[1] md:max-w-xl">
            <GoalSettingsForm />
          </div>
        </div>
      )}

      <style>{`
        @keyframes goalShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

export default function DonateGoalSettings() {
  return (
    <DonateGoalSettingsProvider>
      <DonateGoalSettingsContent />
    </DonateGoalSettingsProvider>
  );
}
