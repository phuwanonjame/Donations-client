"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react"; 
import { AnimatePresence } from "framer-motion"; // <-- NEW: Import AnimatePresence

import EasyDonateTheme from "./EasyDonateTheme"; 
import { getMotionVariants } from "./utils/animationUtils"; 
import { getFontFamilyCss, getFontWeight, getDisplayName, getAmountText } from "./utils/fontUtils";
import { playAlertSound } from "../../../../utils/audioUtils"; 

function AlertPreview({ settings }) {
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState("display"); 
  const [isVisible, setIsVisible] = useState(true); // <-- NEW: State เพื่อควบคุมการ Unmount/Mount

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

  // ⭐⭐ Animation Timer (useEffect) - ปรับปรุง Logic ⭐⭐
  useEffect(() => {
    let timer;
    if (isPlaying && animationStep === "in") {
      try { playAlertSound(alertSoundKey, currentVolume); } catch (e) { console.error("Sound Error:", e); }
      timer = setTimeout(() => setAnimationStep("display"), inDuration * 1000);
    } else if (isPlaying && animationStep === "display") {
      // เมื่อหมดเวลา Display ให้สั่ง Unmount เพื่อรัน 'exit' variant
      timer = setTimeout(() => {
        setIsVisible(false); // <-- สั่งซ่อน (Unmount)
        setAnimationStep("out");
      }, displayDuration * 1000);
    } else if (animationStep === "out") {
      // รัน Timer รอจน Animation Out เสร็จสิ้น
      timer = setTimeout(() => {
        setAnimationStep("display"); 
        setIsPlaying(false);
        setIsVisible(true); // <-- นำกลับมาแสดงในสถานะ display
        setKey((prevKey) => prevKey + 1); // รีเซ็ต key 
      }, outDuration * 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, animationStep, inDuration, displayDuration, outDuration, alertSoundKey, currentVolume]); 
  
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsVisible(true); 
      setAnimationStep("display"); 
    } else {
      setIsPlaying(true);
      setIsVisible(true); // <-- ต้องแน่ใจว่ามองเห็นได้
      setKey((prevKey) => prevKey + 1);
      setAnimationStep("in");
    }
  };

  const handleStep = (step) => {
    setIsPlaying(false);
    
    if (step === "display" || step === "in") {
        setIsVisible(true);
        setKey((prevKey) => prevKey + 1);
        if (step === "in") {
            try { playAlertSound(alertSoundKey, currentVolume); } catch (e) { console.error("Sound Error:", e); }
        }
    } 
    else if (step === "out") {
        // เพื่อให้ Out Animation ทำงาน ต้องแน่ใจว่า element ถูก Mount ก่อน
        setIsVisible(true);
        setKey((prevKey) => prevKey + 1); 
        // สั่งซ่อนใน microtask ถัดไปเพื่อให้ Framer Motion รัน exit
        setTimeout(() => setIsVisible(false), 50); 
    }
    setAnimationStep(step);
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative w-full mx-auto min-h-[150px] mb-4"> 
        {/* 🚨 ใช้ AnimatePresence ครอบคอมโพเนนต์ที่ต้องการรัน 'exit' variant */}
        <AnimatePresence>
          {isVisible && (
            <EasyDonateTheme
              key={key} 
              settings={effectiveSettings} 
              displayName={previewDisplayName}
              amountText={previewAmountText}
              getFontFamilyCss={getFontFamilyCss}
              getFontWeight={getFontWeight}
              mainVariants={mainVariants}
              // เมื่อใช้ AnimatePresence ไม่จำเป็นต้องส่ง "out" เข้าไปใน animationStep
              animationStep={animationStep} 
              imageUrl={settings.image || settings.imageUrl || "https://picsum.photos/200/200"}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Control Panel */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm space-y-4">
        <div className="flex justify-center pb-3 border-b border-slate-700/50">
          <Button
            onClick={handlePlayPause}
            className={`h-9 px-6 text-sm font-semibold w-full max-w-xs ${
              isPlaying
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isPlaying ? <><Pause className="w-4 h-4 mr-1" /> PAUSE</> : <><Play className="w-4 h-4 mr-1" /> PLAY ALERT</>}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => handleStep("display")} 
                className={`h-8 px-3 text-xs ${(animationStep === "display" && isVisible) ? "border-emerald-500 text-emerald-400" : "border-slate-700 text-slate-400"}`}>
                Show
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleStep("in")} 
                className={`h-8 px-3 text-xs ${animationStep === "in" ? "border-cyan-500 text-cyan-400" : "border-slate-700 text-slate-400"}`}>
                In
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleStep("out")} 
                className={`h-8 px-3 text-xs ${(!isVisible || animationStep === "out") ? "border-rose-500 text-rose-400" : "border-slate-700 text-slate-400"}`}>
                Out
              </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">Status:</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded ${
                (animationStep === "display" && isVisible) ? "bg-emerald-600 text-white" :
                (animationStep === "in" && isVisible) ? "bg-cyan-600 text-white" :
                (!isVisible || animationStep === "out") ? "bg-rose-600 text-white" : 
                "bg-slate-700 text-white"
            }`}>
              {(!isVisible || animationStep === "out") ? "OUT" : animationStep.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-slate-800/50">
              <div className="text-xs text-slate-400">In Duration</div>
              <div className="text-sm font-semibold text-cyan-400 truncate">{inDuration}s</div>
            </div>
            <div className="p-2 rounded bg-slate-800/50">
              <div className="text-xs text-slate-400">Display Duration</div>
              <div className="text-sm font-semibold text-emerald-400 truncate">{displayDuration}s</div>
            </div>
            <div className="p-2 rounded bg-slate-800/50">
              <div className="text-xs text-slate-400">Out Duration</div>
              <div className="text-sm font-semibold text-rose-400 truncate">{outDuration}s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertPreview;