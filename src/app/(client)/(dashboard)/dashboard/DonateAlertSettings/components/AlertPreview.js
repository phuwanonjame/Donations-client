// ==================== AlertPreview.js ====================
"use client";
import React, {
  useState, useEffect, forwardRef, useImperativeHandle, useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import EasyDonateTheme from "./EasyDonateTheme";
import { getMotionVariants } from "./utils/animationUtils";
import {
  getFontFamilyCss,
  getFontWeight,
  getDisplayName,
  getAmountText,
  injectFontFamily,
} from "./utils/fontUtils";
import { buildAlertRenderSettings } from "./utils/settingsUtils";
import { playAlertSound } from "../../../../../../utils/audioUtils";
import { findMatchingTtsStyleId, synthesizeTtsAudio } from "../../../../../../utils/ttsService";

const AlertPreview = forwardRef(({
  settings,
  isPlaying,
  onPlayStateChange,
  onAnimationStepChange,
  externalAnimationStep,
  externalIsVisible,
}, ref) => {
  const themeRef = useRef(null);
  const ttsAudioRef = useRef(null);
  const ttsRequestIdRef = useRef(0);
  const ttsPlaybackPromiseRef = useRef(null);
  const ttsPlaybackActiveRef = useRef(false);
  const [cycleKey, setCycleKey] = useState(0);
  const [step, setStep] = useState("display");
  const [visible, setVisible] = useState(true);

  const animStep = externalAnimationStep ?? step;
  const isVis = externalIsVisible ?? visible;
  const s = buildAlertRenderSettings(settings);

  useEffect(() => {
    injectFontFamily(s.titleFontFamily);
    injectFontFamily(s.messageFontFamily);
  }, [s.titleFontFamily, s.messageFontFamily]);

  const displayName = getDisplayName(s.titleText);
  const amountText = getAmountText({
    amountText: s.titleAmountText,
    amountSuffix: settings.amountSuffix ?? "฿",
  });
  const mainVariants = getMotionVariants(
    s.animationEnterType,
    s.animationExitType,
    s.animationEnterDuration,
    s.animationExitDuration,
  );

  const stopTtsAudio = () => {
    const activeAudio = ttsAudioRef.current;
    if (!activeAudio) return;

    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {}

    if (activeAudio._blobUrl) {
      URL.revokeObjectURL(activeAudio._blobUrl);
    }

    ttsAudioRef.current = null;
    ttsPlaybackActiveRef.current = false;
    ttsPlaybackPromiseRef.current = null;
  };

  const buildPreviewTtsText = () => {
    const parts = [];

    if (s.ttsTitleEnabled) {
      parts.push(`${displayName} ${amountText}`.replace(/\s+/g, " ").trim());
    }

    if (s.ttsMessageEnabled) {
      const message = (s.messageText || "")
        .replace("{{user}}", displayName)
        .trim();

      if (message) {
        parts.push(message);
      }
    }

    return parts.join(" ").trim();
  };

  const ttsText = buildPreviewTtsText();
  const shouldWaitForTts = Boolean(ttsText);

  const triggerEnterAudio = async () => {
    try {
      playAlertSound(s.notificationSound, s.notificationVolume);
    } catch {}

    const previewText = ttsText;
    if (!previewText) {
      ttsPlaybackActiveRef.current = false;
      ttsPlaybackPromiseRef.current = null;
      return Promise.resolve();
    }

    const requestId = ++ttsRequestIdRef.current;
    stopTtsAudio();
    ttsPlaybackActiveRef.current = true;

    try {
      const blob = await synthesizeTtsAudio({
        text: previewText,
        voice: s.ttsVoice,
        styleId: s.ttsStyleId || findMatchingTtsStyleId(s.ttsRate, s.ttsPitch),
        rate: s.ttsRate,
        pitch: s.ttsPitch,
        volume: s.ttsVolume,
      });

      if (ttsRequestIdRef.current !== requestId) {
        ttsPlaybackActiveRef.current = false;
        return Promise.resolve();
      }

      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      audio.volume = Math.max(0, Math.min(1, Number(s.ttsVolume) / 100));
      audio._blobUrl = blobUrl;
      ttsAudioRef.current = audio;

      const playbackPromise = new Promise((resolve) => {
        const cleanup = () => {
          if (audio._blobUrl) {
            URL.revokeObjectURL(audio._blobUrl);
          }

          if (ttsAudioRef.current === audio) {
            ttsAudioRef.current = null;
          }

          if (ttsRequestIdRef.current === requestId) {
            ttsPlaybackActiveRef.current = false;
          }

          resolve();
        };

        audio.onended = cleanup;
        audio.onerror = cleanup;
      });

      ttsPlaybackPromiseRef.current = playbackPromise;

      await audio.play();
      return playbackPromise;
    } catch (error) {
      console.warn("Preview TTS playback failed:", error);
      ttsPlaybackActiveRef.current = false;
      ttsPlaybackPromiseRef.current = null;
      return Promise.resolve();
    }
  };

  useImperativeHandle(ref, () => ({
    handleStep: (nextStep) => {
      if (nextStep === "in" || nextStep === "display") {
        setVisible(true);
        setCycleKey((k) => k + 1);
        if (nextStep === "in") {
          triggerEnterAudio();
        }
        setStep(nextStep);
      } else if (nextStep === "out") {
        stopTtsAudio();
        setVisible(true);
        setCycleKey((k) => k + 1);
        setTimeout(() => setVisible(false), 50);
        setStep(nextStep);
      }
    },
    getElementPositions: () => themeRef.current?.getElementPositions(),
  }));

  useEffect(() => {
    if (!isPlaying) return undefined;

    let timer;
    let cancelled = false;

    if (animStep === "in") {
      ttsPlaybackPromiseRef.current = triggerEnterAudio();
      timer = setTimeout(() => {
        if (cancelled) return;
        setStep("display");
        onAnimationStepChange?.("display");
      }, s.animationEnterDuration * 1000);
    } else if (animStep === "display") {
      const goToExit = () => {
        if (cancelled) return;
        setVisible(false);
        setStep("out");
        onAnimationStepChange?.("out");
      };

      if (shouldWaitForTts && ttsPlaybackActiveRef.current && ttsPlaybackPromiseRef.current) {
        ttsPlaybackPromiseRef.current.then(goToExit);
      } else {
        timer = setTimeout(goToExit, s.animationDisplayDuration * 1000);
      }
    } else if (animStep === "out") {
      timer = setTimeout(() => {
        if (cancelled) return;
        setStep("display");
        setVisible(true);
        onAnimationStepChange?.("display");
        onPlayStateChange?.(false);
        setCycleKey((k) => k + 1);
      }, s.animationExitDuration * 1000);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, animStep]);

  useEffect(() => {
    if (isPlaying) {
      setStep("in");
      setVisible(true);
      setCycleKey((k) => k + 1);
    } else {
      stopTtsAudio();
      setStep("display");
      setVisible(true);
    }
  }, [isPlaying]);

  useEffect(() => () => {
    ttsRequestIdRef.current += 1;
    stopTtsAudio();
  }, []);

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
                isPlaying={isPlaying}
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
