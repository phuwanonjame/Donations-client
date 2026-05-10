"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

import { fetchDonateGoalSettings, saveDonateGoalSettings } from "@/actions/DonateGoalapi/donateGoalSettingsApi";
import { createWidgetSettingsNotifier } from "@/lib/notifications/widget-settings-toast";

import GoalSettingsForm from "./components/GoalSettingsForm";
import PreviewPanel from "./components/PreviewPanel";
import { defaultSettings } from "./constants/donate-goal";
import { fromMetadata } from "./utils/donate-goal";

const FIXED_USER_ID = "244bad71-4990-4a79-9a19-9ff983a55442";
const goalNotifier = createWidgetSettingsNotifier("Goal settings");

const logGoalPage = (label, payload) => {
  console.log(`[DonateGoal Page] ${label}`, payload);
};

export default function DonateGoalSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [showHeader, setShowHeader] = useState(true);
  const [widgetId, setWidgetId] = useState(null);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY < 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const widget = await fetchDonateGoalSettings(FIXED_USER_ID);
        logGoalPage("loaded widget from api", widget);

        if (!widget?.id) {
          goalNotifier.error("Goal widget not found for this user");
          return;
        }

        if (!widget?.metadata) {
          setWidgetId(widget.id);
          goalNotifier.defaultLoaded();
          return;
        }

        const mappedSettings = fromMetadata(widget.metadata, defaultSettings);
        logGoalPage("mapped settings from metadata", mappedSettings);

        setWidgetId(widget.id);
        setSettings(mappedSettings);
        goalNotifier.loadSuccess();
      } catch (error) {
        console.error(error);
        goalNotifier.loadError(error);
      }
    };

    load();
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (metadataPayload) => {
    if (!widgetId) {
      goalNotifier.error("Cannot save because the Goal widget does not exist yet");
      return;
    }

    const loadingToastId = goalNotifier.saveLoading();
    const payload = {
      userId: FIXED_USER_ID,
      metadata: metadataPayload?.metadata ?? {},
    };

    logGoalPage("current settings before save", settings);
    logGoalPage("metadata generated for save", metadataPayload);
    logGoalPage("request payload for save", payload);

    try {
      const result = await saveDonateGoalSettings(widgetId, payload);
      logGoalPage("save result", result);

      if (!result) {
        goalNotifier.saveError(null, loadingToastId);
        return;
      }

      goalNotifier.saveSuccess(loadingToastId);
    } catch (error) {
      console.error(error);
      goalNotifier.saveError(error, loadingToastId);
    }
  };

  return (
    <div className="space-y-6 px-4 py-4 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
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
        </motion.div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-[2]">
          <div className="md:sticky md:top-6 md:self-start">
            <PreviewPanel settings={settings} update={update} onSave={handleSave} />
          </div>
        </div>

        <div className="min-w-0 flex-[1] md:max-w-xl">
          <GoalSettingsForm settings={settings} update={update} />
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
