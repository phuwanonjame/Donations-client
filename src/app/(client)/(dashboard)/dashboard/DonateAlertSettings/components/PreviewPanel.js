// ==================== PreviewPanel.js ====================
// แก้เฉพาะ getDuration — เอา metadata branch ออก
"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Maximize2, Minimize2, RefreshCw, CheckCircle,
  Smartphone, Tablet, Monitor, Save, Settings2,
  Download, Share2, Play, Pause, Clock, EyeIcon,
  ArrowDown, ArrowUp, Info, Grid3X3, ShieldCheck
} from "lucide-react";
import AlertPreview from "./AlertPreview";

function DeviceButton({ device, preset, isActive, onClick }) {
  const { icon: Icon, label } = preset;

  return (
    <button
      onClick={() => onClick(device)}
      className={`relative p-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
      }`}
      title={`${label} view`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

const phaseControls = [
  {
    step: "in",
    label: "Enter",
    description: "เริ่มเข้า",
    icon: ArrowDown,
    activeClass: "border-cyan-400 bg-cyan-500/15 text-cyan-200 shadow-cyan-950/30",
    idleClass: "border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-200",
    dotClass: "bg-cyan-400",
  },
  {
    step: "display",
    label: "Display",
    description: "แสดงผล",
    icon: EyeIcon,
    activeClass: "border-emerald-400 bg-emerald-500/15 text-emerald-200 shadow-emerald-950/30",
    idleClass: "border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-200",
    dotClass: "bg-emerald-400",
  },
  {
    step: "out",
    label: "Exit",
    description: "ออกจากจอ",
    icon: ArrowUp,
    activeClass: "border-rose-400 bg-rose-500/15 text-rose-200 shadow-rose-950/30",
    idleClass: "border-slate-700 text-slate-400 hover:border-rose-500/50 hover:text-rose-200",
    dotClass: "bg-rose-400",
  },
];

const previewBackgrounds = {
  default: "bg-[radial-gradient(circle_at_center,#1e293b_0,#020617_70%)]",
  dark: "bg-slate-950",
  light: "bg-slate-200",
};

const PREVIEW_OPTIONS_STORAGE_KEY = "donate-alert-preview-options";
const DEFAULT_PREVIEW_OPTIONS = {
  deviceSize: "desktop",
  previewScale: 1,
  showSettings: false,
  showGrid: false,
  showSafeZone: true,
  backgroundMode: "default",
};

function sanitizePreviewOptions(rawOptions = {}) {
  const safeDeviceSize = ["mobile", "tablet", "desktop"].includes(rawOptions.deviceSize)
    ? rawOptions.deviceSize
    : DEFAULT_PREVIEW_OPTIONS.deviceSize;
  const safeBackgroundMode = ["default", "dark", "light"].includes(rawOptions.backgroundMode)
    ? rawOptions.backgroundMode
    : DEFAULT_PREVIEW_OPTIONS.backgroundMode;
  const parsedScale = Number(rawOptions.previewScale);
  const safePreviewScale = Number.isFinite(parsedScale)
    ? Math.min(1.5, Math.max(0.5, parsedScale))
    : DEFAULT_PREVIEW_OPTIONS.previewScale;

  return {
    deviceSize: safeDeviceSize,
    previewScale: safePreviewScale,
    showSettings: typeof rawOptions.showSettings === "boolean"
      ? rawOptions.showSettings
      : DEFAULT_PREVIEW_OPTIONS.showSettings,
    showGrid: typeof rawOptions.showGrid === "boolean"
      ? rawOptions.showGrid
      : DEFAULT_PREVIEW_OPTIONS.showGrid,
    showSafeZone: typeof rawOptions.showSafeZone === "boolean"
      ? rawOptions.showSafeZone
      : DEFAULT_PREVIEW_OPTIONS.showSafeZone,
    backgroundMode: safeBackgroundMode,
  };
}

function loadPreviewOptions() {
  if (typeof window === "undefined") {
    return DEFAULT_PREVIEW_OPTIONS;
  }

  try {
    const stored = window.localStorage.getItem(PREVIEW_OPTIONS_STORAGE_KEY);
    if (!stored) return DEFAULT_PREVIEW_OPTIONS;
    return sanitizePreviewOptions(JSON.parse(stored));
  } catch {
    return DEFAULT_PREVIEW_OPTIONS;
  }
}

export default function PreviewPanel({
  settings,
  handleSave,
  isSaving = false,
  hasChanges = false
}) {
  const alertPreviewRef = useRef();
  const [previewOptions, setPreviewOptions] = useState(loadPreviewOptions);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState("display");
  const [isVisible, setIsVisible] = useState(true);
  const [showControls] = useState(true);
  const {
    deviceSize,
    previewScale,
    showSettings,
    showGrid,
    showSafeZone,
    backgroundMode,
  } = previewOptions;

  const devicePresets = {
    mobile:  { width: "375px", icon: Smartphone, label: "Mobile" },
    tablet:  { width: "768px", icon: Tablet,     label: "Tablet" },
    desktop: { width: "100%",  icon: Monitor,    label: "Desktop" },
  };

  // ✅ flat structure เท่านั้น — ไม่มี metadata branch
  const getDuration = (type, defaultValue) => {
    if (!settings) return defaultValue;
    switch (type) {
      case "in":      return settings.inDuration      ?? defaultValue;
      case "display": return settings.displayDuration ?? defaultValue;
      case "out":     return settings.outDuration     ?? defaultValue;
      default:        return defaultValue;
    }
  };

  const inDuration      = getDuration("in",      0.8);
  const displayDuration = getDuration("display", 5);
  const outDuration     = getDuration("out",     0.8);
  const totalDuration   = inDuration + displayDuration + outDuration;
  const activePhaseIndex = phaseControls.findIndex((item) => item.step === animationStep);
  const previewScaleLabel = `${Math.round(previewScale * 100)}%`;
  const waitsForTts = Boolean(settings?.ttsTitleEnabled || settings?.ttsMessageEnabledField);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PREVIEW_OPTIONS_STORAGE_KEY, JSON.stringify(previewOptions));
  }, [previewOptions]);

  const updatePreviewOptions = (patch) => {
    setPreviewOptions((prev) => sanitizePreviewOptions({
      ...prev,
      ...(typeof patch === "function" ? patch(prev) : patch),
    }));
  };

  const handleSaveWithFeedback = async () => {
    try {
      await handleSave();
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const refreshPreview = () => setKey(prev => prev + 1);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsVisible(true);
    setAnimationStep("in");
    setIsPlaying(true);
  };

  const handleStep = (step) => {
    setIsPlaying(false);
    setAnimationStep(step);
    if (step === "display" || step === "in") {
      setIsVisible(true);
    } else if (step === "out") {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 50);
    }

    alertPreviewRef.current?.handleStep?.(step);
  };

  return (
    <div className="w-full">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm border border-white/10 overflow-hidden shadow-2xl shadow-cyan-500/5 min-w-0 ${
          isFullscreen ? "fixed inset-4 z-50" : ""
        }`}
      >
        {/* Preview Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-white/5 to-transparent border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
              <span className="text-xs text-slate-500 font-mono">Live Preview</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Device Size Controls */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xl border border-white/5">
                <DeviceButton
                  device="mobile"
                  preset={devicePresets.mobile}
                  isActive={deviceSize === "mobile"}
                  onClick={(nextDevice) => updatePreviewOptions({ deviceSize: nextDevice })}
                />
                <DeviceButton
                  device="tablet"
                  preset={devicePresets.tablet}
                  isActive={deviceSize === "tablet"}
                  onClick={(nextDevice) => updatePreviewOptions({ deviceSize: nextDevice })}
                />
                <DeviceButton
                  device="desktop"
                  preset={devicePresets.desktop}
                  isActive={deviceSize === "desktop"}
                  onClick={(nextDevice) => updatePreviewOptions({ deviceSize: nextDevice })}
                />
              </div>

              {/* Zoom Control */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xl border border-white/5">
                <button
                  onClick={() => updatePreviewOptions((prev) => ({ previewScale: prev.previewScale - 0.1 }))}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-400 w-12 text-center font-mono">
                  {previewScaleLabel}
                </span>
                <button
                  onClick={() => updatePreviewOptions((prev) => ({ previewScale: prev.previewScale + 0.1 }))}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xl border border-white/5">
                <button onClick={refreshPreview} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => updatePreviewOptions((prev) => ({ showSettings: !prev.showSettings }))}
                  className={`p-1 rounded-lg transition-colors ${showSettings ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-white/10 text-slate-400"}`}
                >
                  <Settings2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Settings Bar */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="p-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 text-xs">
                <span className="text-slate-400">Preview Options:</span>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(event) => updatePreviewOptions({ showGrid: event.target.checked })}
                    className="rounded bg-slate-700"
                  />
                  <Grid3X3 className="w-3.5 h-3.5" />
                  Show grid
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSafeZone}
                    onChange={(event) => updatePreviewOptions({ showSafeZone: event.target.checked })}
                    className="rounded bg-slate-700"
                  />
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Safe zone
                </label>
                <select
                  value={backgroundMode}
                  onChange={(event) => updatePreviewOptions({ backgroundMode: event.target.value })}
                  className="bg-slate-800 rounded px-2 py-1 text-slate-300 border border-slate-700 text-xs"
                >
                  <option value="default">Default background</option>
                  <option value="dark">Dark background</option>
                  <option value="light">Light background</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Content */}
        <div className={`relative min-h-[320px] sm:min-h-[360px] overflow-auto p-3 sm:p-6 transition-colors duration-300 ${previewBackgrounds[backgroundMode]}`}>
          <div
            className={`absolute inset-0 opacity-25 ${showGrid ? "bg-[linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[size:32px_32px]" : ""}`}
          />

          <div className="relative z-10 mx-auto flex min-h-[280px] sm:min-h-[312px] w-full items-center justify-center">
            <div
              className={`relative flex min-h-[240px] sm:min-h-[260px] w-full items-center justify-center rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4 transition-all duration-300 ${
                showSafeZone ? "outline outline-1 outline-dashed outline-cyan-400/30 outline-offset-[-18px]" : ""
              }`}
              style={{ maxWidth: devicePresets[deviceSize].width }}
            >
              <div
                className="flex w-full items-center justify-center transition-transform duration-300"
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "center",
                }}
              >
                <AlertPreview
                  ref={alertPreviewRef}
                  settings={settings}
                  isPlaying={isPlaying}
                  onPlayStateChange={setIsPlaying}
                  onAnimationStepChange={setAnimationStep}
                  externalAnimationStep={animationStep}
                  externalIsVisible={isVisible}
                />
              </div>
            </div>
          </div>

          {!isFullscreen && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-[10px] text-slate-400 border border-white/10">
              {devicePresets[deviceSize].label} • {previewScale * 100}%
            </div>
          )}
        </div>

        {/* Animation Controls */}
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50"
          >
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-cyan-500/20 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-sm font-medium text-white">Animation Controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isVisible ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  <span className="text-xs text-slate-400">{isVisible ? "Active" : "Hidden"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                <Button
                  onClick={handlePlayPause}
                  className={`h-11 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isPlaying
                      ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                  }`}
                >
                  {isPlaying ? (
                    <><Pause className="w-4 h-4 mr-2" /> Pause Animation</>
                  ) : (
                    <><Play className="w-4 h-4 mr-2" /> Play Full Animation</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={refreshPreview}
                  className="h-11 rounded-xl border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Replay
                </Button>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Timeline</span>
                  <span className="font-mono">{waitsForTts ? "waits for TTS" : `${totalDuration.toFixed(1)}s total`}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {phaseControls.map((item, index) => (
                    <button
                      key={item.step}
                      onClick={() => handleStep(item.step)}
                      className={`h-2 rounded-full transition-all ${
                        index <= activePhaseIndex ? item.dotClass : "bg-slate-700"
                      }`}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {phaseControls.map((item) => {
                  const IconComponent = item.icon;
                  const isActive =
                    (item.step === "display" && animationStep === "display" && isVisible) ||
                    (item.step === "in"      && animationStep === "in") ||
                    (item.step === "out"     && (!isVisible || animationStep === "out"));
                  return (
                    <Button
                      key={item.step}
                      variant="outline"
                      onClick={() => handleStep(item.step)}
                      className={`h-16 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 shadow-lg ${
                        isActive ? item.activeClass : item.idleClass
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] opacity-70">{item.description}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl bg-slate-900/50 border border-white/5 p-2">
                {[
                  { label: "Enter", value: inDuration, className: "text-cyan-300" },
                  { label: "Display", value: displayDuration, className: "text-emerald-300", note: waitsForTts ? "TTS" : null },
                  { label: "Exit", value: outDuration, className: "text-rose-300" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/[0.03] px-2 py-2 text-center">
                    <div className={`text-[11px] font-medium ${item.className}`}>{item.label}</div>
                    <div className="text-base font-bold text-white">
                      {item.note ? "wait" : `${item.value.toFixed(1)}s`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <p className="text-xs text-cyan-400/80">
                  <span className="font-medium text-cyan-400">Information:</span> Click individual steps to test each animation phase
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer Actions */}
        <div className="p-3 bg-white/5 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 w-full sm:w-auto">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>

            <Button
              onClick={handleSaveWithFeedback}
              disabled={isSaving || !hasChanges}
              className={`relative overflow-hidden transition-all duration-300 w-full sm:w-auto ${
                hasChanges
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </motion.div>
                ) : showSaveSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-4 h-4" /> Saved
                  </motion.div>
                ) : (
                  <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {hasChanges ? "Save Changes" : "No Changes"}
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
