// ==================== DonateAlertSettings.js (FIXED) ====================
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, RotateCcw, Copy, AlertCircle,
  Sparkles, MonitorSmartphone, Edit3, Save
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

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
  saveDonateSettings,
  fetchDonateSettings,
} from "../../../../actions/DonateAlertapi/donateSettingsApi";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function buildSavePayload(flatSettings) {
  const grouped = transformToGroupedStructure(flatSettings);
  return {
    ...grouped,
    updatedAt: new Date().toISOString(),
  };
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function DonateAlertSettings() {
  const [settings, setSettings]       = useState(() => transformToFlatStructure(defaultSettings));
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges]   = useState(false);
  const [lastSaved, setLastSaved]     = useState(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [copied, setCopied]           = useState(false);

  const [previewSettings, setPreviewSettings] = useState(() => transformToFlatStructure(defaultSettings));

  // ── FIX: Visual Editor state ───────────────────────────
  // เก็บ effectiveSettings และ context-aware updateFn ที่ SettingsTabs ส่งมา
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);
  const editorContextRef = useRef({
    effectiveSettings: null,
    updateFn: null,
  });

  // ── Load settings ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchDonateSettings();
        if (!res?.settings) {
          setSettings(transformToFlatStructure(defaultSettings));
          toast.success("Using default settings");
        } else {
          const flat = transformToFlatStructure(res.settings);
          setSettings(flat);
          setLastSaved(new Date());
          toast.success("Settings loaded");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => { setHasChanges(true); }, [settings]);

  const handleEffectiveSettingsChange = useCallback((effective) => {
    setPreviewSettings(effective);
  }, []);

  useEffect(() => {
    if (!showSaveNotification) return;
    const t = setTimeout(() => setShowSaveNotification(false), 3000);
    return () => clearTimeout(t);
  }, [showSaveNotification]);

  useEffect(() => {
    const h = () => {};
    window.addEventListener("sidebarToggle", h);
    return () => window.removeEventListener("sidebarToggle", h);
  }, []);

  // ── updateSetting (global) ─────────────────────────────
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // ── Actions ───────────────────────────────────────────
  const handleResetSettings = () => {
    if (!window.confirm("Reset all settings to default?")) return;
    setSettings(transformToFlatStructure(defaultSettings));
    setHasChanges(true);
    toast.success("Settings reset");
  };

  const handleCopyJSON = async () => {
    try {
      const payload = buildSavePayload(settings);
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const payload = buildSavePayload(settings);
      console.log("💾 Saving:", payload);
      const res = await saveDonateSettings(payload);
      if (!res) throw new Error("Save failed");

      setSaveSuccess(true);
      setHasChanges(false);
      setLastSaved(new Date());
      setShowSaveNotification(true);
      toast.success("Saved!");
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [settings]);

  // ── FIX: เปิด Visual Editor พร้อม context จาก SettingsTabs ──
  // SettingsTabs จะส่ง (effectiveSettings, updateFn) มาเมื่อกดปุ่ม
  const handleOpenVisualEditor = useCallback((effectiveSettings, updateFn) => {
    editorContextRef.current = { effectiveSettings, updateFn };
    setShowFullscreenEditor(true);
  }, []);

  // ── Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity:0, scale:0.9 }}
          animate={{ opacity:1, scale:1 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
            <Sparkles className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-400">Loading your settings...</p>
        </motion.div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────
  return (
    <>
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity:0, y:-50 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-50 }}
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

      <div className="h-full w-full overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6">
            <SettingsHeader 
              settings={settings} 
              updateSetting={updateSetting}
              hasChanges={hasChanges}
              saveSuccess={saveSuccess}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div
              className="lg:col-span-8 space-y-6"
              initial={{ opacity:0, x:-20 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.1 }}
            >
              <SettingsTabs
                settings={settings}
                updateSetting={updateSetting}
                handleReset={handleResetSettings}
                handleCopyJSON={handleCopyJSON}
                onOpenVisualEditor={handleOpenVisualEditor}
                onEffectiveSettingsChange={handleEffectiveSettingsChange}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Changes are automatically reflected in preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyJSON}
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300"
                    disabled={copied}
                  >
                    {copied ? <><Check className="w-4 h-4 mr-2" />Copied!</> : <><Copy className="w-4 h-4 mr-2" />Copy JSON</>}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetSettings}
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-4"
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.2 }}
            >
              <div className="sticky top-6 space-y-6">
                <PreviewPanel
                  settings={previewSettings}
                  handleSave={handleSave}
                  isSaving={saving}
                  hasChanges={hasChanges}
                />

                <div className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl border border-cyan-500/20">
                  <h4 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Quick Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>Default settings ใช้เมื่อไม่มี Range ตรง</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>แต่ละ Range มี config ของตัวเองแยกจาก Default</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>กดปุ่ม "Config →" บน Range เพื่อแก้ไข</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>Preview จะแสดง Range ที่กำลังแก้อยู่</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── FIX: Visual Editor รับ effectiveSettings + context updateFn ── */}
      <AnimatePresence>
        {showFullscreenEditor && (
          <FullscreenVisualEditor
            settings={editorContextRef.current.effectiveSettings ?? settings}
            updateSetting={editorContextRef.current.updateFn ?? updateSetting}
            onClose={() => setShowFullscreenEditor(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}