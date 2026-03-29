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
  PanelLeftOpen,
  Edit3
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

// Components
import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";
import PreviewPanel from "./components/PreviewPanel";
import FullscreenVisualEditor from "./components/FullscreenVisualEditor";
import { 
  defaultSettings, 
  transformToFlatStructure, 
  transformToGroupedStructure 
} from "./components/utils/settingsUtils";

// API
import {
  saveDonateSettings,
  fetchDonateSettings,
} from "../../../../actions/DonateAlertapi/donateSettingsApi";

export default function DonateAlertSettings() {
  const [settings, setSettings] = useState(() => transformToFlatStructure(defaultSettings));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // ✅ State สำหรับ Fullscreen Visual Editor
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await fetchDonateSettings();
        if (!res || !res.settings) {
          console.log("⚠ No data, using default");
          setSettings(transformToFlatStructure(defaultSettings));
          toast.success("Using default settings");
        } else {
          console.log("📥 Loaded:", res.settings);
          const flatSettings = transformToFlatStructure(res.settings);
          setSettings(flatSettings);
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
      setSettings(transformToFlatStructure(defaultSettings));
      setHasChanges(true);
      toast.success("Settings reset to default");
    }
  };

  const handleCopyJSON = async () => {
    try {
      const groupedData = transformToGroupedStructure(settings);
      const jsonString = JSON.stringify(groupedData, null, 2);
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
      const groupedData = transformToGroupedStructure(settings);
      console.log("groupedData", groupedData);
      
      const dataToSave = {
        ...groupedData,
        updatedAt: new Date().toISOString(),
      };
      
      const res = await saveDonateSettings(dataToSave);
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

  // ✅ เปิด Fullscreen Visual Editor
  const openFullscreenEditor = () => {
    setShowFullscreenEditor(true);
  };

  // ✅ ปิด Fullscreen Visual Editor
  const closeFullscreenEditor = () => {
    setShowFullscreenEditor(false);
  };

  // Loading state
  if (loading) {
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

      {/* Main content */}
      <div className="h-full w-full overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex-shrink-0 hidden sm:block">
                <MonitorSmartphone className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Donation Alert Settings</h1>
                <p className="text-slate-400 text-sm flex items-center gap-2 flex-wrap">
                  Customize your donation alert
                  {lastSaved && (
                    <span className="text-xs text-slate-500">
                      • Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2">
              {/* ✅ Fullscreen Visual Editor Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={openFullscreenEditor}
                className="border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all duration-200"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Visual Editor
              </Button>

              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-2 border border-yellow-500/30"
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  Unsaved Changes
                </motion.div>
              )}
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2 border border-green-500/30"
                >
                  <Check className="w-4 h-4" />
                  Saved
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Settings Header */}
          <div className="mb-6">
            <SettingsHeader settings={settings} updateSetting={updateSetting} />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <motion.div 
              className="lg:col-span-8 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SettingsTabs
                settings={settings}
                updateSetting={updateSetting}
                handleReset={handleResetSettings}
                handleCopyJSON={handleCopyJSON}
                onOpenVisualEditor={openFullscreenEditor}  // ✅ เพิ่มตรงนี้
              />

              {/* Action Buttons */}
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
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy JSON
                      </>
                    )}
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

            {/* Right Column */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-6 space-y-6">
                <PreviewPanel 
                  settings={settings} 
                  handleSave={handleSave}
                  isSaving={saving}
                  hasChanges={hasChanges}
                />
                
                {/* Tips Card */}
                <div className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl border border-cyan-500/20">
                  <h4 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Quick Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>Test your alert on different screen sizes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>Click Save to apply changes permanently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      <span>Try Visual Editor for click-to-edit experience</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fullscreen Visual Editor Modal */}
      <AnimatePresence>
        {showFullscreenEditor && (
          <FullscreenVisualEditor
            settings={settings}
            updateSetting={updateSetting}
            onClose={closeFullscreenEditor}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}