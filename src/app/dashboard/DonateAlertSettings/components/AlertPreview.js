"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { AnimatePresence, motion } from "framer-motion";

import EasyDonateTheme from "./EasyDonateTheme"; 
import { getMotionVariants } from "./utils/animationUtils"; 
import { getFontFamilyCss, getFontWeight, getDisplayName, getAmountText } from "./utils/fontUtils";
import { playAlertSound } from "../../../../utils/audioUtils"; 

const AlertPreview = forwardRef(({ 
  settings, 
  isPlaying, 
  onPlayStateChange,
  onAnimationStepChange,
  externalAnimationStep,
  externalIsVisible 
}, ref) => {
  const [key, setKey] = useState(0);
  const [internalAnimationStep, setInternalAnimationStep] = useState("display");
  const [internalIsVisible, setIsVisible] = useState(true);

  // Use external control if provided, otherwise internal
  const animationStep = externalAnimationStep !== undefined ? externalAnimationStep : internalAnimationStep;
  const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible;

  const effectiveSettings = {
    ...settings,
    confettiEffect: settings.confettiEffect || "fountain", 
    imageGlow: settings.imageGlow || false, 
  };

  const previewDisplayName = getDisplayName(settings.prefixText);
  const previewAmountText = getAmountText(settings);

  const inDuration = settings.inDuration || 0.8;
  const displayDuration = settings.displayDuration || 5;
  const outDuration = settings.outDuration || 0.8;
  const currentVolume = Number(Array.isArray(settings.volume) ? settings.volume[0] : settings.volume ?? 50);
  const alertSoundKey = settings.alertSound || 'chime';

  const mainVariants = getMotionVariants(
    settings.inAnimation || "fadeIn",
    settings.outAnimation || "fadeOut",
    inDuration,
    outDuration
  );

  // Auto-play animation
  useEffect(() => {
    let timer;
    if (isPlaying && animationStep === "in") {
      try { playAlertSound(alertSoundKey, currentVolume); } catch (e) { console.error("Sound Error:", e); }
      timer = setTimeout(() => {
        setInternalAnimationStep("display");
        if (onAnimationStepChange) onAnimationStepChange("display");
      }, inDuration * 1000);
    } else if (isPlaying && animationStep === "display") {
      timer = setTimeout(() => {
        setIsVisible(false);
        setInternalAnimationStep("out");
        if (onAnimationStepChange) onAnimationStepChange("out");
      }, displayDuration * 1000);
    } else if (animationStep === "out") {
      timer = setTimeout(() => {
        setInternalAnimationStep("display");
        setIsVisible(true);
        if (onAnimationStepChange) onAnimationStepChange("display");
        if (onPlayStateChange) onPlayStateChange(false);
        setKey((prevKey) => prevKey + 1);
      }, outDuration * 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, animationStep, inDuration, displayDuration, outDuration, alertSoundKey, currentVolume, onAnimationStepChange, onPlayStateChange]); 

  // Handle play/pause from parent
  useEffect(() => {
    if (isPlaying) {
      setInternalAnimationStep("in");
      setIsVisible(true);
      setKey((prevKey) => prevKey + 1);
    } else {
      setInternalAnimationStep("display");
      setIsVisible(true);
    }
  }, [isPlaying]);

  // Handle manual step from parent
  const handleExternalStep = (step) => {
    if (step === "display" || step === "in") {
      setIsVisible(true);
      setKey((prevKey) => prevKey + 1);
      if (step === "in") {
        try { playAlertSound(alertSoundKey, currentVolume); } catch (e) { console.error("Sound Error:", e); }
      }
      setInternalAnimationStep(step);
    } else if (step === "out") {
      setIsVisible(true);
      setKey((prevKey) => prevKey + 1);
      setTimeout(() => setIsVisible(false), 50);
      setInternalAnimationStep(step);
    }
  };

  // Expose handleStep to parent
  useImperativeHandle(ref, () => ({
    handleStep: handleExternalStep
  }));

  return (
    <div className="w-full mx-auto">
      <div className="relative w-full mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <EasyDonateTheme
                settings={effectiveSettings} 
                displayName={previewDisplayName}
                amountText={previewAmountText}
                getFontFamilyCss={getFontFamilyCss}
                getFontWeight={getFontWeight}
                mainVariants={mainVariants}
                animationStep={animationStep} 
                imageUrl={settings.image || settings.imageUrl || "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

AlertPreview.displayName = 'AlertPreview';
export default AlertPreview;