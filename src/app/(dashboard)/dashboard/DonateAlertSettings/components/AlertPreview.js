// ============================================
// ไฟล์: ./components/AlertPreview.js
// ============================================
"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import EasyDonateTheme from "./EasyDonateTheme"; 
import { getMotionVariants } from "./utils/animationUtils"; 
import { getFontFamilyCss, getFontWeight, getDisplayName, getAmountText } from "./utils/fontUtils";
import { playAlertSound } from "../../../../../utils/audioUtils"; 

const AlertPreview = forwardRef(({ 
  settings, 
  isPlaying, 
  onPlayStateChange,
  onAnimationStepChange,
  externalAnimationStep,
  externalIsVisible 
}, ref) => {
  const easyDonateThemeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [internalAnimationStep, setInternalAnimationStep] = useState("display");
  const [internalIsVisible, setIsVisible] = useState(true);

  const animationStep = externalAnimationStep !== undefined ? externalAnimationStep : internalAnimationStep;
  const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible;

  useImperativeHandle(ref, () => ({
    getElementPositions: () => easyDonateThemeRef.current?.getElementPositions()
  }));

  const extractSettings = () => {
    if (settings.metadata) {
      const metadata = settings.metadata;
      const title = metadata.title || {};
      const message = metadata.message || {};
      const animation = metadata.animation || {};
      const audio = metadata.audio || {};
      const notification = audio.notification || {};
      const tts = audio.tts || {};
      
      return {
        prefixText: title.text || "{{user}} โดเนทมา",
        amountText: title.amountText || "{{amount}}฿",
        textSize: title.fontSize || 36,
        font: title.fontFamily || "IBM Plex Sans Thai",
        fontWeight: title.fontWeight || "700",
        textColor: title.mainColor || "#FFFFFF",
        donorNameColor: title.usernameColor || "#FF9500",
        amountColor: title.amountColor || "#0EA5E9",
        borderWidth: title.strokeWidth || 2.5,
        borderColor: title.strokeColor || "#000000",
        amountShine: title.amountShine ?? true,
        suffixText: title.suffixText || "โดเนทมา",
        showName: title.showName ?? true,
        showAmount: title.showAmount ?? true,
        
        messageFont: message.fontFamily || "IBM Plex Sans Thai",
        messageFontWeight: message.fontWeight || "500",
        messageFontSize: message.fontSize || 24,
        messageColor: message.color || "#FFFFFF",
        messageBorderWidth: message.strokeWidth || 2.5,
        messageBorderColor: message.strokeColor || "#000000",
        messageText: message.text || "ขอบคุณสำหรับการใช้งาน FastDonate",
        showMessage: message.showMessage ?? true,
        
        inAnimation: animation.enter?.type || "fadeInUp",
        inDuration: (animation.enter?.duration || 1000) / 1000,
        outAnimation: animation.exit?.type || "fadeOutUp",
        outDuration: (animation.exit?.duration || 1000) / 1000,
        displayDuration: (animation.display?.duration || 3000) / 1000,
        
        alertSound: notification.sound || "bb_spirit",
        volume: notification.volume || 75,
        useCustomSound: notification.useCustom || false,
        customSound: notification.customSound || null,
        
        ttsEnabled: tts.title?.enabled ?? true,
        ttsVoice: tts.voice || "female",
        ttsRate: tts.rate || 0.5,
        ttsPitch: tts.pitch || 0.5,
        
        image: metadata.image || "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif",
        effect: metadata.effect || "realistic_look",
        confettiEffect: metadata.confettiEffect || "fountain",
        imageGlow: metadata.imageGlow || false,
        showConfetti: metadata.showConfetti || false,
        
        minAmountForAlert: metadata.minimumDonation || 10,
      };
    }
    
    return {
      prefixText: settings.prefixText || "{{user}} โดเนทมา",
      amountText: settings.amountText || "{{amount}}฿",
      textSize: settings.textSize?.[0] || settings.textSize || 36,
      font: settings.font || "ibmplex",
      fontWeight: settings.fontWeight || "700",
      textColor: settings.textColor || "#FFFFFF",
      donorNameColor: settings.donorNameColor || "#FF9500",
      amountColor: settings.amountColor || "#0EA5E9",
      borderWidth: settings.borderWidth || 2.5,
      borderColor: settings.borderColor || "#000000",
      amountShine: settings.amountShine ?? true,
      suffixText: settings.suffixText || "โดเนทมา",
      showName: settings.showName ?? true,
      showAmount: settings.showAmount ?? true,
      
      messageFont: settings.messageFont || "ibmplex",
      messageFontWeight: settings.messageFontWeight || "500",
      messageFontSize: settings.messageFontSize || 24,
      messageColor: settings.messageColor || "#FFFFFF",
      messageBorderWidth: settings.messageBorderWidth || 2.5,
      messageBorderColor: settings.messageBorderColor || "#000000",
      messageText: settings.messageText || "ขอบคุณสำหรับการใช้งาน FastDonate",
      showMessage: settings.showMessage ?? true,
      
      inAnimation: settings.inAnimation || "fadeInUp",
      inDuration: settings.inDuration || 1,
      outAnimation: settings.outAnimation || "fadeOutUp",
      outDuration: settings.outDuration || 1,
      displayDuration: settings.displayDuration || 3,
      
      alertSound: settings.alertSound || "bb_spirit",
      volume: Array.isArray(settings.volume) ? settings.volume[0] : (settings.volume || 75),
      useCustomSound: settings.useCustomSound || false,
      customSound: settings.customSound || null,
      
      ttsEnabled: settings.ttsEnabled ?? true,
      ttsVoice: settings.ttsVoice || "female",
      ttsRate: settings.ttsRate || 0.5,
      ttsPitch: settings.ttsPitch || 0.5,
      
      image: settings.alertImage || settings.image || "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif",
      effect: settings.effect || "realistic_look",
      confettiEffect: settings.confettiEffect || "fountain",
      imageGlow: settings.imageGlow || false,
      showConfetti: settings.showConfetti || false,
      
      minAmountForAlert: settings.minAmountForAlert || 10,
    };
  };

  const effectiveSettingsData = extractSettings();
  
  const effectiveSettings = {
    ...effectiveSettingsData,
    confettiEffect: effectiveSettingsData.confettiEffect || "fountain", 
    imageGlow: effectiveSettingsData.imageGlow || false,
    showConfetti: effectiveSettingsData.showConfetti || false,
  };

  const previewDisplayName = getDisplayName(effectiveSettingsData.prefixText);
  const previewAmountText = getAmountText({
    amountText: effectiveSettingsData.amountText,
    amountSuffix: settings.amountSuffix || "฿"
  });

  const inDuration = effectiveSettingsData.inDuration || 0.8;
  const displayDuration = effectiveSettingsData.displayDuration || 5;
  const outDuration = effectiveSettingsData.outDuration || 0.8;
  const currentVolume = Number(effectiveSettingsData.volume || 50);
  const alertSoundKey = effectiveSettingsData.alertSound || 'chime';

  const mainVariants = getMotionVariants(
    effectiveSettingsData.inAnimation || "fadeIn",
    effectiveSettingsData.outAnimation || "fadeOut",
    inDuration,
    outDuration
  );

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

  useImperativeHandle(ref, () => ({
    handleStep: handleExternalStep,
    getElementPositions: () => easyDonateThemeRef.current?.getElementPositions()
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
                ref={easyDonateThemeRef}
                settings={effectiveSettings} 
                displayName={previewDisplayName}
                amountText={previewAmountText}
                getFontFamilyCss={getFontFamilyCss}
                getFontWeight={getFontWeight}
                mainVariants={mainVariants}
                animationStep={animationStep} 
                imageUrl={effectiveSettingsData.image || "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif"}
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