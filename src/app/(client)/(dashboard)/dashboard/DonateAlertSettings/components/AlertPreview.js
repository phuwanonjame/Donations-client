// ==================== AlertPreview.js ====================
// แก้: ลบ if (settings.metadata) branch ออกทั้งหมด — flat only
"use client";
import React, {
  useState, useEffect, forwardRef, useImperativeHandle, useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import EasyDonateTheme from "./EasyDonateTheme";
import { getMotionVariants } from "./utils/animationUtils";
import { getFontFamilyCss, getFontWeight, getDisplayName, getAmountText } from "./utils/fontUtils";
import { playAlertSound } from "../../../../../../utils/audioUtils";

function readNum(raw, fallback) {
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  if (typeof raw === "number") return raw;
  return fallback;
}

// ✅ flat structure เท่านั้น — ไม่มี if (settings.metadata) อีกต่อไป
function buildSettings(settings) {
  return {
    prefixText:         settings.prefixText         ?? "{{user}} ",
    amountText:         settings.amountText         ?? "{{amount}}฿",
    textSize:           readNum(settings.textSize, 36),
    font:               settings.font               ?? "IBM Plex Sans Thai",
    fontWeight:         settings.fontWeight         ?? "700",
    textColor:          settings.textColor          ?? "#FFFFFF",
    donorNameColor:     settings.donorNameColor     ?? "#FF9500",
    amountColor:        settings.amountColor        ?? "#0EA5E9",
    borderWidth:        settings.borderWidth        ?? 2.5,
    borderColor:        settings.borderColor        ?? "#000000",
    amountShine:        settings.amountShine        ?? true,
    suffixText:         settings.suffixText         ?? "โดเนทมา",
    showName:           settings.showName           ?? true,
    showAmount:         settings.showAmount         ?? true,
    messageFont:        settings.messageFont        ?? "IBM Plex Sans Thai",
    messageFontWeight:  settings.messageFontWeight  ?? "500",
    messageFontSize:    readNum(settings.messageFontSize, 24),
    messageColor:       settings.messageColor       ?? "#FFFFFF",
    messageBorderWidth: settings.messageBorderWidth ?? 2.5,
    messageBorderColor: settings.messageBorderColor ?? "#000000",
    messageText:        settings.messageText        ?? "ขอบคุณสำหรับการใช้งาน FastDonate",
    showMessage:        settings.showMessage        ?? true,
    inAnimation:        settings.inAnimation        ?? "fadeInUp",
    inDuration:         settings.inDuration         ?? 1,
    outAnimation:       settings.outAnimation       ?? "fadeOutUp",
    outDuration:        settings.outDuration        ?? 1,
    displayDuration:    settings.displayDuration    ?? 3,
    alertSound:         settings.alertSound         ?? "bb_spirit",
    volume:             readNum(settings.volume, 75),
    useCustomSound:     settings.useCustomSound     ?? false,
    ttsVoice:           settings.ttsVoice           ?? "female",
    ttsRate:            settings.ttsRate            ?? 0.5,
    ttsPitch:           settings.ttsPitch           ?? 0.5,
    // ✅ รองรับทั้ง alertImage และ image (flat ใช้ทั้งสองอย่าง)
    image:              settings.alertImage ?? settings.image
                        ?? "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif",
    effect:             settings.effect             ?? "realistic_look",
    confettiEffect:     settings.confettiEffect     ?? "fountain",
    imageGlow:          settings.imageGlow          ?? false,
    showConfetti:       settings.showConfetti       ?? false,
    minAmountForAlert:  settings.minAmountForAlert  ?? 10,
  };
}

const AlertPreview = forwardRef(({
  settings,
  isPlaying,
  onPlayStateChange,
  onAnimationStepChange,
  externalAnimationStep,
  externalIsVisible,
}, ref) => {
  const themeRef  = useRef(null);
  const [cycleKey, setCycleKey] = useState(0);
  const [step,  setStep]   = useState("display");
  const [visible, setVisible] = useState(true);

  const animStep = externalAnimationStep ?? step;
  const isVis    = externalIsVisible     ?? visible;

  const s = buildSettings(settings);

  const displayName  = getDisplayName(s.prefixText);
  const amountText   = getAmountText({ amountText: s.amountText, amountSuffix: settings.amountSuffix ?? "฿" });
  const mainVariants = getMotionVariants(s.inAnimation, s.outAnimation, s.inDuration, s.outDuration);

  useImperativeHandle(ref, () => ({
    handleStep: (step) => {
      if (step === "in" || step === "display") {
        setVisible(true);
        setCycleKey(k => k + 1);
        if (step === "in") {
          try { playAlertSound(s.alertSound, s.volume); } catch {}
        }
        setStep(step);
      } else if (step === "out") {
        setVisible(true);
        setCycleKey(k => k + 1);
        setTimeout(() => setVisible(false), 50);
        setStep(step);
      }
    },
    getElementPositions: () => themeRef.current?.getElementPositions(),
  }));

  // ── animation state machine ──────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    let timer;
    if (animStep === "in") {
      try { playAlertSound(s.alertSound, s.volume); } catch {}
      timer = setTimeout(() => {
        setStep("display");
        onAnimationStepChange?.("display");
      }, s.inDuration * 1000);
    } else if (animStep === "display") {
      timer = setTimeout(() => {
        setVisible(false);
        setStep("out");
        onAnimationStepChange?.("out");
      }, s.displayDuration * 1000);
    } else if (animStep === "out") {
      timer = setTimeout(() => {
        setStep("display");
        setVisible(true);
        onAnimationStepChange?.("display");
        onPlayStateChange?.(false);
        setCycleKey(k => k + 1);
      }, s.outDuration * 1000);
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, animStep]);

  useEffect(() => {
    if (isPlaying) {
      setStep("in");
      setVisible(true);
      setCycleKey(k => k + 1);
    } else {
      setStep("display");
      setVisible(true);
    }
  }, [isPlaying]);

  return (
    <div className="w-full mx-auto">
      <div className="relative w-full mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isVis && (
            <motion.div
              key={cycleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <EasyDonateTheme
                ref={themeRef}
                settings={s}
                displayName={displayName}
                amountText={amountText}
                getFontFamilyCss={getFontFamilyCss}
                getFontWeight={getFontWeight}
                mainVariants={mainVariants}
                animationStep={animStep}
                imageUrl={s.image}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

AlertPreview.displayName = "AlertPreview";
export default AlertPreview;