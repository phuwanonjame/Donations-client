"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { getDashboardCopy } from "../i18n";
import WidgetUrlHeaderField from "../components/WidgetUrlHeaderField";
import RecentDonatePreview from "./components/RecentDonatePreview";
import RecentDonateSettingsForm from "./components/RecentDonateSettingsForm";
import {
  RecentDonateSettingsProvider,
  useRecentDonateSettings,
} from "./components/context/RecentDonateSettingsProvider";
import { toMetadata } from "./utils/recent-donate";

function RecentDonateHeader() {
  const { showHeader, widgetId } = useRecentDonateSettings();
  const { language } = useLanguage();
  const text = getDashboardCopy(language).settings.recent;

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-out ${
        showHeader ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 p-4 sm:p-6"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-3 shadow-lg shadow-blue-500/25 sm:p-4">
              <Clock className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">{text.title}</h2>
              <p className="text-sm text-slate-400 sm:text-base">
                {text.description}
              </p>
            </div>
          </div>
        </div>

        <WidgetUrlHeaderField type="recent" widgetId={widgetId} accentClass="text-blue-400" />
      </motion.div>
    </div>
  );
}

function RecentDonateContent() {
  const {
    settings,
    donations,
    loading,
    saving,
    saveSettings,
    resetSettings,
    updateSetting,
    updateDonation,
  } = useRecentDonateSettings();
  const [previewDonations, setPreviewDonations] = useState(donations);
  const { language } = useLanguage();
  const text = getDashboardCopy(language).settings.recent;

  useEffect(() => {
    setPreviewDonations(donations);
  }, [donations]);

  const handleSave = () => saveSettings(toMetadata(settings));

  return (
    <div className="space-y-6 px-4 py-4 text-slate-100 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <RecentDonateHeader />

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
          {text.loading}
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-[2]">
            <div className="md:sticky md:top-6 md:self-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="min-h-[55vh] rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 backdrop-blur-xl sm:p-6"
              >
                <div className="h-full">
                  <RecentDonatePreview
                    settings={settings}
                    donations={previewDonations}
                    onReset={resetSettings}
                    onSave={handleSave}
                    saving={saving}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="min-w-0 flex-[1] md:max-w-xl">
            <RecentDonateSettingsForm
              settings={settings}
              updateSetting={updateSetting}
              donations={donations}
              updateDonation={updateDonation}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecentDonateSettingsPage() {
  return (
    <RecentDonateSettingsProvider>
      <RecentDonateContent />
    </RecentDonateSettingsProvider>
  );
}
