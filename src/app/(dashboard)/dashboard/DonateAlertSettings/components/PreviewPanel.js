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
  Volume2,
  EyeIcon,
  ArrowDown,
  ArrowUp,
  Info
} from "lucide-react";
import AlertPreview from "./AlertPreview";

export default function PreviewPanel({ 
  settings, 
  handleSave, 
  isSaving = false, 
  hasChanges = false 
}) {
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

  // Helper function to get duration from settings (support both flat and grouped)
  const getDuration = (type, defaultValue) => {
    if (!settings) return defaultValue;
    
    if (settings.metadata && settings.metadata.animation) {
      const animation = settings.metadata.animation;
      switch (type) {
        case 'in':
          return (animation.enter?.duration || defaultValue * 1000) / 1000;
        case 'display':
          return (animation.display?.duration || defaultValue * 1000) / 1000;
        case 'out':
          return (animation.exit?.duration || defaultValue * 1000) / 1000;
        default:
          return defaultValue;
      }
    }
    
    switch (type) {
      case 'in':
        return settings.inDuration || defaultValue;
      case 'display':
        return settings.displayDuration || defaultValue;
      case 'out':
        return settings.outDuration || defaultValue;
      default:
        return defaultValue;
    }
  };

  const inDuration = getDuration('in', 0.8);
  const displayDuration = getDuration('display', 5);
  const outDuration = getDuration('out', 0.8);

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
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
        }`}
        title={`${label} view`}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="w-full">
      <motion.div 
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm border border-white/10 overflow-hidden shadow-2xl shadow-cyan-500/5 ${
          isFullscreen ? 'fixed inset-4 z-50' : ''
        }`}
      >
        {/* Preview Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-white/5 to-transparent border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
              <span className="text-xs text-slate-500 font-mono">Live Preview</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Size Controls */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xl border border-white/5">
                <DeviceButton device="mobile" />
                <DeviceButton device="tablet" />
                <DeviceButton device="desktop" />
              </div>

              {/* Zoom Control */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xl border border-white/5">
                <button
                  onClick={() => setPreviewScale(prev => Math.max(0.5, prev - 0.1))}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-400 w-12 text-center font-mono">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  onClick={() => setPreviewScale(prev => Math.min(1.5, prev + 0.1))}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-xl border border-white/5">
                <button
                  onClick={refreshPreview}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1 rounded-lg transition-colors ${
                    showSettings ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-slate-400'
                  }`}
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
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="p-3 flex items-center gap-4 text-xs">
                <span className="text-slate-400">Preview Options:</span>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="rounded bg-slate-700" /> Show grid
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="rounded bg-slate-700" /> Safe zone
                </label>
                <select className="bg-slate-800 rounded px-2 py-1 text-slate-300 border border-slate-700 text-xs">
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
            minHeight: '320px',
            maxHeight: '420px',
            overflow: 'auto',
            transform: `scale(${previewScale})`,
            transformOrigin: 'center'
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />
          </div>

          <div 
            className="transition-all duration-300 flex items-center justify-center relative z-10"
            style={{ 
              width: devicePresets[deviceSize].width,
              margin: '0 auto'
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
                  <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs text-slate-400">{isVisible ? 'Active' : 'Hidden'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <Button
                onClick={handlePlayPause}
                className={`w-full h-10 text-sm font-semibold rounded-xl transition-all duration-300 ${
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

              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: "display", label: "Display", color: "emerald", icon: EyeIcon },
                  { step: "in", label: "Enter", color: "cyan", icon: ArrowDown },
                  { step: "out", label: "Exit", color: "rose", icon: ArrowUp }
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isActive = (item.step === "display" && animationStep === "display" && isVisible) ||
                                   (item.step === "in" && animationStep === "in") ||
                                   (item.step === "out" && (!isVisible || animationStep === "out"));
                  
                  return (
                    <Button
                      key={item.step}
                      variant="outline"
                      onClick={() => handleStep(item.step)}
                      className={`h-12 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        isActive
                          ? `border-${item.color}-500 bg-${item.color}-500/10 text-${item.color}-400`
                          : "border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="text-center">
                  <div className="text-xs text-cyan-400 mb-1">Enter Duration</div>
                  <div className="text-lg font-bold text-white">{inDuration.toFixed(1)}s</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-emerald-400 mb-1">Display Duration</div>
                  <div className="text-lg font-bold text-white">{displayDuration.toFixed(1)}s</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-rose-400 mb-1">Exit Duration</div>
                  <div className="text-lg font-bold text-white">{outDuration.toFixed(1)}s</div>
                </div>
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
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
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
                  <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </motion.div>
                ) : showSaveSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    Saved
                  </motion.div>
                ) : (
                  <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
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