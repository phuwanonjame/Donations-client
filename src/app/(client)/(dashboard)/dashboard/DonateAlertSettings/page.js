"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, Copy, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import SettingsTabs from "./components/SettingsTabs";
import PreviewPanel from "./components/PreviewPanel";
import SettingsHeader from "./components/SettingsHeader";
import FullscreenVisualEditor from "./components/FullscreenVisualEditor";
import {
  defaultSettings,
  transformToFlatStructure,
  transformToGroupedStructure,
} from "./components/utils/settingsUtils";
import {
  DonateAlertSettingsProvider,
  useDonateAlertSettings,
} from "./components/context/DonateAlertSettingsProvider";
import {
  saveDonateSettings,
  fetchDonateSettings,
} from "../../../../../actions/DonateAlertapi/donateSettingsApi";
import { createWidgetSettingsNotifier } from "@/lib/notifications/widget-settings-toast";

const FIXED_USER_ID = "244bad71-4990-4a79-9a19-9ff983a55442";
const FIXED_WIDGET_ID = "676669ee-9634-44cd-bd08-6aa40afe32a9";
const DEFAULT_TEST_DONATION_MESSAGE = "ขอบคุณมาก ๆ สำหรับกำลังใจนะ {{user}}!";
const alertNotifier = createWidgetSettingsNotifier("Alert settings");

function buildSavePayload(flatSettings) {
  const grouped = transformToGroupedStructure(flatSettings);
  return {
    ...grouped,
    updatedAt: new Date().toISOString(),
  };
}

function buildWidgetPatchRequest(userId, flatSettings) {
  const grouped = buildSavePayload(flatSettings);
  return {
    userId,
    metadata: grouped.metadata,
  };
}

function DonateAlertSettingsContent({
  settings,
  updateSetting,
  handleResetSettings,
  handleCopyJSON,
  handleOpenVisualEditor,
  handleSave,
  saving,
  hasChanges,
  saveSuccess,
  copied,
  testDonationMessage,
  setTestDonationMessage,
}) {
  const { effectiveSettings } = useDonateAlertSettings();

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-5 lg:px-6 2xl:px-8 py-3 sm:py-5 lg:py-6 2xl:py-8">
        <div className="mb-6">
          <SettingsHeader
            settings={settings}
            updateSetting={updateSetting}
            hasChanges={hasChanges}
            saveSuccess={saveSuccess}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 2xl:gap-6">
          <motion.div
            className="xl:col-span-6 2xl:col-span-7 min-w-0 space-y-5 sm:space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SettingsTabs
              handleReset={handleResetSettings}
              handleCopyJSON={handleCopyJSON}
              onOpenVisualEditor={handleOpenVisualEditor}
            />

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-400 min-w-0">
                <AlertCircle className="w-4 h-4" />
                <span className="min-w-0">Changes are automatically reflected in preview</span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleCopyJSON}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 w-full sm:w-auto"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />Copy JSON
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetSettings}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
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
                handleSave={handleSave}
                isSaving={saving}
                hasChanges={hasChanges}
                testDonationMessage={testDonationMessage}
                onTestDonationMessageChange={setTestDonationMessage}
              />

              <div className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quick Tips
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                    <span>Default settings are used when no donation range matches.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                    <span>Each range can override the global master settings independently.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                    <span>Use the Config button on a range to jump into scoped editing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                    <span>The preview follows the currently active range context automatically.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function DonateAlertSettings() {
  const [settings, setSettings] = useState(() => transformToFlatStructure(defaultSettings));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testDonationMessage, setTestDonationMessage] = useState(DEFAULT_TEST_DONATION_MESSAGE);
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);
  const editorContextRef = useRef({
    effectiveSettings: null,
    updateFn: null,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchDonateSettings(FIXED_USER_ID);

        if (!response?.metadata) {
          setSettings(transformToFlatStructure(defaultSettings));
          alertNotifier.defaultLoaded();
        } else {
          setSettings(transformToFlatStructure(response));
          alertNotifier.loadSuccess();
        }
      } catch (error) {
        console.error(error);
        alertNotifier.loadError(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setHasChanges(true);
  }, [settings]);

  useEffect(() => {
    if (!showSaveNotification) return undefined;

    const timeoutId = setTimeout(() => setShowSaveNotification(false), 3000);
    return () => clearTimeout(timeoutId);
  }, [showSaveNotification]);

  const updateSetting = useCallback((key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  }, []);

  const handleResetSettings = useCallback(() => {
    if (!window.confirm("Reset all settings to default?")) return;
    setSettings(transformToFlatStructure(defaultSettings));
    setHasChanges(true);
    alertNotifier.resetSuccess();
  }, []);

  const handleCopyJSON = useCallback(async () => {
    try {
      const grouped = buildSavePayload(settings);
      await navigator.clipboard.writeText(JSON.stringify(grouped, null, 2));
      setCopied(true);
      alertNotifier.copySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alertNotifier.copyError(error);
    }
  }, [settings]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const widgetId = settings.id || FIXED_WIDGET_ID;
      const requestPayload = buildWidgetPatchRequest(FIXED_USER_ID, settings);
      const response = await saveDonateSettings(widgetId, requestPayload);

      if (!response) throw new Error("Save failed");

      setSaveSuccess(true);
      setHasChanges(false);
      setShowSaveNotification(true);
      alertNotifier.saveSuccess();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      alertNotifier.saveError(error);
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const handleOpenVisualEditor = useCallback((effectiveSettings, updateFn) => {
    editorContextRef.current = { effectiveSettings, updateFn };
    setShowFullscreenEditor(true);
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
            <Sparkles className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-400">Loading your settings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <Check className="w-5 h-5" />
            <span>Settings saved successfully!</span>
            <button onClick={() => setShowSaveNotification(false)} className="ml-2 hover:bg-white/20 rounded-lg p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <DonateAlertSettingsProvider settings={settings} updateSetting={updateSetting}>
        <DonateAlertSettingsContent
          settings={settings}
          updateSetting={updateSetting}
          handleResetSettings={handleResetSettings}
          handleCopyJSON={handleCopyJSON}
          handleOpenVisualEditor={handleOpenVisualEditor}
          handleSave={handleSave}
          saving={saving}
          hasChanges={hasChanges}
          saveSuccess={saveSuccess}
          copied={copied}
          testDonationMessage={testDonationMessage}
          setTestDonationMessage={setTestDonationMessage}
        />
      </DonateAlertSettingsProvider>

      <AnimatePresence>
        {showFullscreenEditor && (
          <FullscreenVisualEditor
            settings={editorContextRef.current.effectiveSettings ?? settings}
            updateSetting={editorContextRef.current.updateFn ?? updateSetting}
            testDonationMessage={testDonationMessage}
            onTestDonationMessageChange={setTestDonationMessage}
            onClose={() => setShowFullscreenEditor(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}
