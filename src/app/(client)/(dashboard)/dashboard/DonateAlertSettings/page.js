"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, Copy, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDashboardCopy } from "../i18n";

import SettingsTabs from "./components/SettingsTabs";
import PreviewPanel from "./components/PreviewPanel";
import SettingsHeader from "./components/SettingsHeader";
import FullscreenVisualEditor from "./components/FullscreenVisualEditor";
import {
  DonateAlertSettingsProvider,
  useDonateAlertSettings,
} from "./components/context/DonateAlertSettingsProvider";

function LoadingState() {
  const { language } = useLanguage();
  const text = getDashboardCopy(language).settings.alert;

  return (
    <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
          <Sparkles className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-400">{text.loading}</p>
      </motion.div>
    </div>
  );
}

function SaveNotification() {
  const { showSaveNotification, setShowSaveNotification } = useDonateAlertSettings();
  const { language } = useLanguage();
  const text = getDashboardCopy(language).settings.alert;

  return (
    <AnimatePresence>
      {showSaveNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <Check className="w-5 h-5" />
          <span>{text.savedMessage}</span>
          <button
            onClick={() => setShowSaveNotification(false)}
            className="ml-2 hover:bg-white/20 rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DonateAlertSettingsContent() {
  const {
    effectiveSettings,
    saving,
    hasChanges,
    copied,
    testDonationMessage,
    setTestDonationMessage,
    copySettingsJSON,
    resetSettings,
    saveSettings,
  } = useDonateAlertSettings();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const text = copy.settings.alert;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-5 lg:px-6 2xl:px-8 py-3 sm:py-5 lg:py-6 2xl:py-8">
        <div className="mb-6">
          <SettingsHeader />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 2xl:gap-6">
          <motion.div
            className="xl:col-span-6 2xl:col-span-7 min-w-0 space-y-5 sm:space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SettingsTabs />

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-400 min-w-0">
                <AlertCircle className="w-4 h-4" />
                <span className="min-w-0">{copy.common.autoPreview}</span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={copySettingsJSON}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 w-full sm:w-auto"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />{copy.common.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />{copy.common.copyJson}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {copy.common.resetAll}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="xl:col-span-6 2xl:col-span-5 min-w-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="xl:sticky xl:top-6 space-y-5 sm:space-y-6">
              <PreviewPanel
                settings={{
                  ...effectiveSettings,
                  messageText: testDonationMessage,
                }}
                handleSave={saveSettings}
                isSaving={saving}
                hasChanges={hasChanges}
                testDonationMessage={testDonationMessage}
                onTestDonationMessageChange={setTestDonationMessage}
              />

              <div className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {text.quickTips}
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {text.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FullscreenEditorLayer() {
  const {
    settings,
    showFullscreenEditor,
    fullscreenEditorContext,
    updateSetting,
    testDonationMessage,
    setTestDonationMessage,
    closeFullscreenEditor,
    saveSettings,
  } = useDonateAlertSettings();

  return (
    <AnimatePresence>
      {showFullscreenEditor && (
        <FullscreenVisualEditor
          settings={fullscreenEditorContext.effectiveSettings ?? settings}
          updateSetting={fullscreenEditorContext.updateFn ?? updateSetting}
          testDonationMessage={testDonationMessage}
          onTestDonationMessageChange={setTestDonationMessage}
          onClose={closeFullscreenEditor}
          onSave={saveSettings}
        />
      )}
    </AnimatePresence>
  );
}

function DonateAlertSettingsShell() {
  const { loading } = useDonateAlertSettings();

  if (loading) return <LoadingState />;

  return (
    <>
      <SaveNotification />
      <DonateAlertSettingsContent />
      <FullscreenEditorLayer />
    </>
  );
}

export default function DonateAlertSettings() {
  return (
    <DonateAlertSettingsProvider>
      <DonateAlertSettingsShell />
    </DonateAlertSettingsProvider>
  );
}
