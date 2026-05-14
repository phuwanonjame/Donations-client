import React from "react";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Sparkles, Layers, Image as ImageIcon, Droplet, Ghost, AlertCircle } from "lucide-react";
import {
  amountEffectOptions,
  confettiEffectOptions,
  confettiModeOptions,
  effectOptions,
} from "../utils/settingsUtils";

export default function EffectsTab({ settings, updateSetting }) {
  // Safe value access with fallbacks
  const textEffect = settings?.titleTextEffect ?? settings?.effect ?? "realistic_look";
  const imageGlow = settings?.imageGlow ?? false;
  const amountShine = settings?.titleAmountShine ?? false;
  const amountEffect = settings?.titleAmountEffect ?? (amountShine ? "sweep" : "none");
  const showConfetti = settings?.showConfetti ?? false;
  const confettiEffect = settings?.confettiEffect ?? "fountain";
  const confettiMode = settings?.confettiMode ?? "classic";
  const useRanges = settings?.rangesUseRanges ?? false;
  const activeTextEffect =
    effectOptions.find((option) => option.id === textEffect) ??
    effectOptions.find((option) => option.id === "realistic_look");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 sm:space-y-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-cyan-400" /> General Effects
      </h3>

      {/* --- Text / Amount Effect --- */}
      <div className="space-y-2">
        <Label className="text-slate-300 text-base">Text Effect</Label>
        <Select
          value={textEffect}
          onValueChange={(v) => {
            updateSetting("titleTextEffect", v);
            updateSetting("effect", v);
          }}
        >
          <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
            <SelectValue placeholder="Select effect" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {effectOptions.map((effect) => (
              <SelectItem key={effect.id} value={effect.id} className="text-white hover:bg-slate-700">
                {effect.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-slate-500 text-xs mt-1">{activeTextEffect?.description}</p>
      </div>

      {/* --- Image Glow --- */}
      <div className="space-y-3">
        <div className="flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <ImageIcon className="w-5 h-5 text-fuchsia-400 shrink-0" />
            <div>
              <Label className="text-slate-300 text-base">Image Glow</Label>
              <p className="text-slate-500 text-sm mt-1">Adds a glow around the alert image/GIF</p>
            </div>
          </div>
          <Switch
            checked={imageGlow}
            onCheckedChange={(v) => updateSetting("imageGlow", v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-fuchsia-500 data-[state=checked]:to-pink-500"
          />
        </div>
      </div>

      {/* --- Amount Shine (เฉพาะ Realistic Look) --- */}
      <div className="space-y-3">
        <div className="flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div>
                <Label className="text-slate-300 text-base">Amount Shine Effect</Label>
                <p className="text-slate-500 text-sm mt-1">Adds an extra animated highlight to the donation amount</p>
              </div>
            </div>
            <Switch
              checked={amountShine}
              onCheckedChange={(v) => updateSetting("titleAmountShine", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-base">Amount Effect Style</Label>
            <Select
              value={amountEffect}
              onValueChange={(v) => updateSetting("titleAmountEffect", v)}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
                <SelectValue placeholder="Select amount effect" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {amountEffectOptions.map((effect) => (
                  <SelectItem key={effect.id} value={effect.id} className="text-white hover:bg-slate-700">
                    {effect.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-slate-500 text-sm mt-1">
              {amountEffectOptions.find((effect) => effect.id === amountEffect)?.description}
            </p>
          </div>
      </div>

      {/* --- Confetti Section --- */}
      <div className="pt-6 border-t border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-indigo-400" />
            Confetti Animation
          </h4>
          <Switch
            checked={showConfetti}
            onCheckedChange={(v) => updateSetting("showConfetti", v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
          />
        </div>

        {showConfetti && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-base">Confetti Motion Mode</Label>
              <Select
                value={confettiMode}
                onValueChange={(v) => updateSetting("confettiMode", v)}
              >
                <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {confettiModeOptions.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id} className="text-white hover:bg-slate-700">
                      {mode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-base">Confetti Effect Type</Label>
              <Select
                value={confettiEffect}
                onValueChange={(v) => updateSetting("confettiEffect", v)}
              >
                <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {confettiEffectOptions.map((effect) => (
                    <SelectItem key={effect.id} value={effect.id} className="text-white hover:bg-slate-700">
                      {effect.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* --- Ranges System --- */}
     
    </motion.div>
  );
}

// PropTypes for type checking
EffectsTab.propTypes = {
  settings: PropTypes.shape({
    effect: PropTypes.string,
    titleTextEffect: PropTypes.string,
    imageGlow: PropTypes.bool,
    titleAmountShine: PropTypes.bool,
    titleAmountEffect: PropTypes.string,
    showConfetti: PropTypes.bool,
    confettiEffect: PropTypes.string,
    confettiMode: PropTypes.string,
    useRanges: PropTypes.bool,
  }).isRequired,
  updateSetting: PropTypes.func.isRequired,
};
