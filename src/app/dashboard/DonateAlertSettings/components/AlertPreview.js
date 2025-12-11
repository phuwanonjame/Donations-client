import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Zap, ZapOff } from "lucide-react";

import EasyDonateTheme from "./EasyDonateTheme";
import { getMotionVariants } from "./utils/animationUtils";

// Font Definitions
const fontFamilies = {
  default: "'Kanit', sans-serif",
  prompt: "'Prompt', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  noto: "'Noto Sans Thai', sans-serif",
  ibmplex: "'IBM Plex Sans Thai', sans-serif",
};

const getFontWeight = (weight) => {
  switch (weight) {
    case "normal":
      return "400";
    case "medium":
      return "500";
    case "bold":
      return "700";
    case "extrabold":
      return "800";
    default:
      return "400";
  }
};

function AlertPreview({ settings }) {
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState("display");

  const [selectedConfettiEffect, setSelectedConfettiEffect] = useState(
    settings.confettiEffect || "fountain"
  );

  const [isImageGlowEnabled, setIsImageGlowEnabled] = useState(
    settings.imageGlow || false
  );

  const effectiveSettings = {
    ...settings,
    confettiEffect: selectedConfettiEffect,
    imageGlow: isImageGlowEnabled,
  };

  const isAlertVisible = animationStep !== "idle";

  useEffect(() => {
    if (!isPlaying) {
      setAnimationStep("display");
    }
    setSelectedConfettiEffect(settings.confettiEffect || "fountain");
    setIsImageGlowEnabled(settings.imageGlow || false);
  }, [settings]);

  const inDuration = settings.inDuration || 0.8;
  const displayDuration = settings.displayDuration || 5;
  const outDuration = settings.outDuration || 0.8;

  const displayName =
    settings.prefixText && settings.prefixText.includes("{{user}}")
      ? settings.prefixText.replace("{{user}}", "โทนี่")
      : "โทนี่";

  const getAmountText = () => {
    if (settings.amountText) {
      return settings.amountText.replace("{{amount}}", "500");
    }
    return `500${settings.amountSuffix || "฿"}`;
  };

  const mainVariants = getMotionVariants(
    settings.inAnimation || "fadeIn",
    settings.outAnimation || "fadeOut",
    inDuration,
    outDuration
  );

  useEffect(() => {
    let timer;

    if (isPlaying && animationStep === "in") {
      timer = setTimeout(() => setAnimationStep("display"), inDuration * 1000);
    } else if (isPlaying && animationStep === "display") {
      timer = setTimeout(
        () => setAnimationStep("out"),
        displayDuration * 1000
      );
    } else if (animationStep === "out") {
      timer = setTimeout(() => {
        setAnimationStep("idle");
        setIsPlaying(false);
      }, outDuration * 1000);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, animationStep, inDuration, displayDuration, outDuration]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setAnimationStep("idle");
    } else {
      setIsPlaying(true);
      setKey((prevKey) => prevKey + 1);
      setAnimationStep("in");
    }
  };

  const handleStep = (step) => {
    setIsPlaying(false);
    if (["idle", "in", "display"].includes(step)) {
      setKey((prevKey) => prevKey + 1);
    }
    setAnimationStep(step);
  };

  const handleConfettiChange = (event) => {
    setSelectedConfettiEffect(event.target.value);
    setKey((prevKey) => prevKey + 1);
  };

  const handleImageGlowToggle = () => {
    setIsImageGlowEnabled((prev) => !prev);
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="w-full mx-auto">
      {/* Control Panel */}
      <div className="mb-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          {/* Confetti + Glow */}
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-700/50 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 whitespace-nowrap">
                Confetti:
              </span>
              <select
                value={selectedConfettiEffect}
                onChange={handleConfettiChange}
                className="bg-slate-700 text-white text-sm p-1.5 rounded-md border border-slate-600 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="fountain">Fountain (พลุยิงขึ้น)</option>
                <option value="rain">Rain (ฝนตกลง)</option>
                <option value="spiral">Spiral (หมุนวน)</option>
                <option value="blast">Blast (ระเบิด)</option>
              </select>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleImageGlowToggle}
              className={`h-8 px-3 text-xs min-w-[120px] ${
                isImageGlowEnabled
                  ? "bg-yellow-600/20 border-yellow-500 text-yellow-400 hover:bg-yellow-600/30"
                  : "border-slate-700 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {isImageGlowEnabled ? (
                <Zap className="w-3 h-3 mr-1" />
              ) : (
                <ZapOff className="w-3 h-3 mr-1" />
              )}
              {isImageGlowEnabled ? "Image Glow: ON" : "Image Glow: OFF"}
            </Button>
          </div>

          {/* Animation Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-300">Animation Control:</span>
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    animationStep === "idle"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400"
                  }`}
                >
                  IDLE
                </span>
                <span className="text-slate-500 text-xs">→</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    animationStep === "in"
                      ? "bg-cyan-600 text-white"
                      : "text-slate-400"
                  }`}
                >
                  IN
                </span>
                <span className="text-slate-500 text-xs">→</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    animationStep === "display"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400"
                  }`}
                >
                  DISPLAY
                </span>
                <span className="text-slate-500 text-xs">→</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    animationStep === "out"
                      ? "bg-rose-600 text-white"
                      : "text-slate-400"
                  }`}
                >
                  OUT
                </span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handlePlayPause}
              className={`h-8 px-3 min-w-[80px] ${
                isPlaying
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 mr-1" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" /> Play
                </>
              )}
            </Button>
          </div>

          {/* Step Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStep("idle")}
                className={`h-8 px-3 text-xs ${
                  animationStep === "idle"
                    ? "border-cyan-500 text-cyan-400"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStep("in")}
                className={`h-8 px-3 text-xs ${
                  animationStep === "in"
                    ? "border-cyan-500 text-cyan-400"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                In
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStep("display")}
                className={`h-8 px-3 text-xs ${
                  animationStep === "display"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                Show
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStep("out")}
                className={`h-8 px-3 text-xs ${
                  animationStep === "out"
                    ? "border-rose-500 text-rose-400"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                Out
              </Button>
            </div>
          </div>

          {/* Durations */}
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-slate-800/50">
                <div className="text-xs text-slate-400">In Duration</div>
                <div className="text-sm font-semibold text-cyan-400 truncate">
                  {inDuration}s
                </div>
              </div>
              <div className="p-2 rounded bg-slate-800/50">
                <div className="text-xs text-slate-400">Display</div>
                <div className="text-sm font-semibold text-emerald-400 truncate">
                  {displayDuration}s
                </div>
              </div>
              <div className="p-2 rounded bg-slate-800/50">
                <div className="text-xs text-slate-400">Out Duration</div>
                <div className="text-sm font-semibold text-rose-400 truncate">
                  {outDuration}s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Zone */}
      <div className="relative w-full mx-auto">
        <AnimatePresence initial={false}>
          {isAlertVisible && (
            <EasyDonateTheme
              key={key}
              settings={effectiveSettings}
              displayName={displayName}
              getAmountText={getAmountText}
              fontFamilies={fontFamilies}
              getFontWeight={getFontWeight}
              mainVariants={mainVariants}
              animationStep={animationStep}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AlertPreview;
