"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Eye, 
  Settings, 
  Save, 
  RotateCcw, 
  Copy, 
  Check,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  MonitorSmartphone,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

// Components
import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";
import PreviewPanel from "./components/PreviewPanel";
import { defaultSettings } from "./components/utils/settingsUtils";

// API
import {
  saveDonateSettings,
  fetchDonateSettings,
} from "../../../actions/DonateAlertapi/donateSettingsApi";

export default function DonateAlertSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await fetchDonateSettings();
        if (!res || !res.settings) {
          console.log("⚠ No data, using default");
          setSettings(defaultSettings);
          toast.success("Using default settings");
        } else {
          console.log("📥 Loaded:", res.settings);
          setSettings({
            ...defaultSettings,
            ...res.settings,
          });
          setLastSaved(new Date());
          toast.success("Settings loaded successfully");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [settings]);

  // Auto-hide save notification
  useEffect(() => {
    if (showSaveNotification) {
      const timer = setTimeout(() => setShowSaveNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveNotification]);

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setSettings(defaultSettings);
      setHasChanges(true);
      toast.success("Settings reset to default");
    }
  };

  const handleCopyJSON = async () => {
    try {
      const jsonString = JSON.stringify(settings, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success("Settings copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy settings");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveDonateSettings(settings);
      if (!res) {
        throw new Error("Failed to save");
      }
      setSaveSuccess(true);
      setHasChanges(false);
      setLastSaved(new Date());
      setShowSaveNotification(true);
      toast.success("Settings saved successfully!");
      
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
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

  return (
    <>
      {/* Save notification */}
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
            <button 
              onClick={() => setShowSaveNotification(false)}
              className="ml-2 hover:bg-white/20 rounded-lg p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 px-3 sm:px-4 lg:px-6 py-4 max-w-[1400px] mx-auto">
        {/* Header with status - ปรับให้กระชับ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl hidden sm:block">
              <MonitorSmartphone className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Donation Alert Settings</h1>
              <p className="text-slate-400 text-xs flex items-center gap-2">
                Customize your donation alert
                {lastSaved && (
                  <span className="text-xs text-slate-500">
                    • {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Status badges - ปรับขนาดเล็กลง */}
          <div className="hidden sm:flex items-center gap-2">
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center gap-1 border border-yellow-500/30"
              >
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                Unsaved
              </motion.div>
            )}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1 border border-green-500/30"
              >
                <Check className="w-3 h-3" />
                Saved
              </motion.div>
            )}
          </div>

          {/* Mobile status indicator */}
          <div className="sm:hidden flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                Unsaved
              </span>
            )}
          </div>
        </motion.div>

        {/* Header Component - ปรับ margin */}
        <div className="mb-2">
          <SettingsHeader settings={settings} updateSetting={updateSetting} />
        </div>

        {/* Main content grid - ปรับสัดส่วนสำหรับ 1366px */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left Column: Tabs - 8 คอลัมน์ */}
          <motion.div 
            className="xl:col-span-8 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SettingsTabs
              settings={settings}
              updateSetting={updateSetting}
              handleReset={handleResetSettings}
              handleCopyJSON={handleCopyJSON}
            />

            {/* Quick actions bar - ปรับให้กะทัดรัด */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Auto-saved to preview</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJSON}
                  className="h-8 px-3 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 text-xs"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetSettings}
                  className="h-8 px-3 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </motion.div>

            {/* Reduced spacer */}
            <div className="h-4 lg:h-8" />
          </motion.div>

          {/* Right Column: Preview - 4 คอลัมน์ */}
          <motion.div 
            className="xl:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-4 space-y-4">
              <PreviewPanel 
                settings={settings} 
                handleSave={handleSave}
                isSaving={saving}
                hasChanges={hasChanges}
              />
              
              {/* Quick tips - Compact version */}
              <motion.div 
                className="hidden xl:block p-3 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl border border-cyan-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xs font-medium text-cyan-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Tips
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5" />
                    <span>Test on mobile screens</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5" />
                    <span>Save to apply changes</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5" />
                    <span>Copy JSON as backup</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}