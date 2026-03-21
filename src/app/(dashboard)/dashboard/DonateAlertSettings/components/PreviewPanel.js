"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Eye, 
  EyeOff,
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Settings2,
  Sparkles,
  Download,
  Share2,
  Play,
  Pause,
  Clock,
  Volume2
} from "lucide-react";
import AlertPreview from "./AlertPreview";

export default function PreviewPanel({ settings, handleSave, isSaving = false, hasChanges = false }) {
  const alertPreviewRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceSize, setDeviceSize] = useState('desktop');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [key, setKey] = useState(0);
  const [previewScale, setPreviewScale] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Animation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState("display");
  const [isVisible, setIsVisible] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const devicePresets = {
    mobile: { width: '375px', icon: Smartphone, label: 'Mobile' },
    tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
    desktop: { width: '100%', icon: Monitor, label: 'Desktop' }
  };

  const inDuration = settings.inDuration || 0.8;
  const displayDuration = settings.displayDuration || 5;
  const outDuration = settings.outDuration || 0.8;
  const currentVolume = Number(Array.isArray(settings.volume) ? settings.volume[0] : settings.volume ?? 50);
  const alertSoundKey = settings.alertSound || 'chime';

  const handleSaveWithFeedback = async () => {
    try {
      await handleSave();
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const refreshPreview = () => {
    setKey(prev => prev + 1);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStep = (step) => {
    setIsPlaying(false);
    setAnimationStep(step);
    
    if (step === "display" || step === "in") {
      setIsVisible(true);
      if (step === "in") {
        // Sound will be played in AlertPreview
      }
    } else if (step === "out") {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 50);
    }
  };

  const DeviceButton = ({ device }) => {
    const { icon: Icon, label } = devicePresets[device];
    const isActive = deviceSize === device;
    
    return (
      <button
        onClick={() => setDeviceSize(device)}
        className={`relative px-3 py-2 rounded-lg transition-all duration-200 group ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
        }`}
        title={`${label} view`}
      >
        <Icon className="w-4 h-4" />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-4 sticky top-4 w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Preview Dashboard</h3>
            <p className="text-xs text-slate-400">Real-time alert preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Show/Hide Controls Toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 transition-all"
            title={showControls ? "Hide controls" : "Show controls"}
          >
            {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Status Badge */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center gap-1.5 border border-amber-500/30"
            >
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Unsaved
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Preview Card */}
      <motion.div 
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 overflow-hidden transition-all duration-500 ${
          isFullscreen ? 'fixed inset-4 z-50' : 'shadow-2xl'
        }`}
        style={{
          boxShadow: isFullscreen ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Preview Header - MacOS Style */}
        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer transition-colors" />
              </div>
              <span className="text-xs text-slate-500 font-mono">preview.html</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Size Controls */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-lg border border-white/5">
                <DeviceButton device="mobile" />
                <DeviceButton device="tablet" />
                <DeviceButton device="desktop" />
              </div>

              {/* Zoom Control */}
              <div className="flex items-center gap-1 px-2 border-l border-white/10">
                <button
                  onClick={() => setPreviewScale(prev => Math.max(0.5, prev - 0.1))}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                  title="Zoom out"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-400 w-12 text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  onClick={() => setPreviewScale(prev => Math.min(1.5, prev + 0.1))}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                  title="Zoom in"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={refreshPreview}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                  title="Refresh preview"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    showSettings ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-slate-400'
                  }`}
                  title="Preview settings"
                >
                  <Settings2 className="w-4 h-4" />
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
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="p-3 flex items-center gap-4 text-xs">
                <span className="text-slate-400">Preview Options:</span>
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="rounded bg-slate-700" /> Show grid
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="rounded bg-slate-700" /> Safe zone
                </label>
                <select className="bg-slate-800 rounded px-2 py-1 text-slate-300 border border-slate-700">
                  <option>Default background</option>
                  <option>Dark background</option>
                  <option>Light background</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Content */}
        <div 
          className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 flex items-center justify-center transition-all duration-300 relative"
          style={{ 
            minHeight: isFullscreen ? 'calc(100vh - 380px)' : '400px',
            maxHeight: isFullscreen ? 'calc(100vh - 380px)' : '400px',
            overflow: 'auto',
            transform: `scale(${previewScale})`,
            transformOrigin: 'center'
          }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>

          <div 
            className="transition-all duration-300 flex items-center justify-center relative z-10"
            style={{ 
              width: devicePresets[deviceSize].width,
              margin: '0 auto'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={deviceSize + settings.theme + key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full"
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Device Info Overlay */}
          {!isFullscreen && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] text-slate-400 border border-white/10">
              {devicePresets[deviceSize].label} • {previewScale * 100}%
            </div>
          )}
        </div>

        {/* Animation Controls Section */}
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90"
          >
            {/* Control Header */}
            <div className="px-6 py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm font-medium text-white">Animation Controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs text-slate-400">{isVisible ? 'Active' : 'Hidden'}</span>
                </div>
              </div>
            </div>

            {/* Control Body */}
            <div className="p-6 space-y-6">
              {/* Play/Pause Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handlePlayPause}
                  className={`h-12 px-8 text-base font-semibold rounded-full transition-all duration-300 shadow-2xl ${
                    isPlaying
                      ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 scale-105"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-105"
                  }`}
                >
                  {isPlaying ? (
                    <><Pause className="w-5 h-5 mr-2" /> Pause Animation</>
                  ) : (
                    <><Play className="w-5 h-5 mr-2" /> Play Animation</>
                  )}
                </Button>
              </div>

              {/* Step Controls */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: "display", label: "SHOW", color: "emerald", icon: "👁️" },
                  { step: "in", label: "IN", color: "cyan", icon: "⬇️" },
                  { step: "out", label: "OUT", color: "rose", icon: "⬆️" }
                ].map((item) => (
                  <Button
                    key={item.step}
                    variant="outline"
                    onClick={() => handleStep(item.step)}
                    className={`h-16 rounded-xl border-2 transition-all relative overflow-hidden group ${
                      (item.step === "display" && animationStep === "display" && isVisible) ||
                      (item.step === "in" && animationStep === "in") ||
                      (item.step === "out" && (!isVisible || animationStep === "out"))
                        ? `border-${item.color}-500 bg-${item.color}-500/10 text-${item.color}-400`
                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-1">{item.icon}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Status Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <div className="text-xs text-slate-400 mb-1">Current Phase</div>
                  <div className={`text-xl font-bold ${
                    (animationStep === "display" && isVisible) ? "text-emerald-400" :
                    (animationStep === "in" && isVisible) ? "text-cyan-400" :
                    (!isVisible || animationStep === "out") ? "text-rose-400" : 
                    "text-slate-400"
                  }`}>
                    {(!isVisible || animationStep === "out") ? "OUT" : animationStep.toUpperCase()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <div className="text-xs text-slate-400 mb-1">Duration</div>
                  <div className="text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-cyan-400">In:</span> {inDuration}s
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400">Show:</span> {displayDuration}s
                    </div>
                    <div className="flex justify-between">
                      <span className="text-rose-400">Out:</span> {outDuration}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Progress */}
              {isPlaying && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Animation Progress</span>
                    <span>{animationStep}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        animationStep === "in" ? "bg-cyan-500" :
                        animationStep === "display" ? "bg-emerald-500" :
                        "bg-rose-500"
                      }`}
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: animationStep === "in" ? "100%" : 
                               animationStep === "display" ? "100%" : 
                               "100%" 
                      }}
                      transition={{ 
                        duration: animationStep === "in" ? inDuration :
                                 animationStep === "display" ? displayDuration :
                                 outDuration,
                        ease: "linear"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <p className="text-xs text-cyan-400/80">
                  <span className="font-medium text-cyan-400">Pro Tip:</span> Click individual steps to test each animation phase
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Button
              onClick={handleSaveWithFeedback}
              disabled={isSaving || !hasChanges}
              className={`relative overflow-hidden transition-all duration-300 ${
                hasChanges 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25' 
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </motion.div>
                ) : showSaveSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-green-300"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {hasChanges ? 'Save Changes' : 'No Changes'}
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