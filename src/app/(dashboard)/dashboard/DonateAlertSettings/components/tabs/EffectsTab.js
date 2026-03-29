import React from "react";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Sparkles, Layers, Image, Droplet, Ghost, AlertCircle } from "lucide-react";

export default function EffectsTab({ settings, updateSetting }) {
  // Safe value access with fallbacks
  const effect = settings?.effect ?? "realistic_look";
  const imageGlow = settings?.imageGlow ?? false;
  const amountShine = settings?.amountShine ?? false;
  const showConfetti = settings?.showConfetti ?? false;
  const confettiEffect = settings?.confettiEffect ?? "fountain";
  const useRanges = settings?.useRanges ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-cyan-400" /> General Effects
      </h3>

      {/* --- Text / Amount Effect --- */}
      <div className="space-y-2">
        <Label className="text-slate-300 text-base">Text/Amount Effect</Label>
        <Select
          value={effect}
          onValueChange={(v) => updateSetting("effect", v)}
        >
          <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
            <SelectValue placeholder="Select effect" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="realistic_look" className="text-white hover:bg-slate-700">
              Realistic Look
            </SelectItem>
            <SelectItem value="glow" className="text-white hover:bg-slate-700">
              Glow Effect
            </SelectItem>
            <SelectItem value="shadow" className="text-white hover:bg-slate-700">
              Shadow Effect
            </SelectItem>
            <SelectItem value="neon" className="text-white hover:bg-slate-700">
              Neon Effect
            </SelectItem>
            <SelectItem value="none" className="text-white hover:bg-slate-700">
              No Effect
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-slate-500 text-xs mt-1">
          {effect === "realistic_look" && "Natural look with subtle depth"}
          {effect === "glow" && "Soft glow around text and amount"}
          {effect === "shadow" && "Drop shadow for depth"}
          {effect === "neon" && "Bright neon light effect"}
          {effect === "none" && "No text effect applied"}
        </p>
      </div>

      {/* --- Image Glow --- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-fuchsia-400" />
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
      {effect === "realistic_look" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div>
                <Label className="text-slate-300 text-base">Amount Shine Effect</Label>
                <p className="text-slate-500 text-sm mt-1">Adds a shine effect to the donation amount</p>
              </div>
            </div>
            <Switch
              checked={amountShine}
              onCheckedChange={(v) => updateSetting("amountShine", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>
      )}

      {/* --- Confetti Section --- */}
      <div className="pt-6 border-t border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
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
                <SelectItem value="fountain" className="text-white hover:bg-slate-700">
                  Fountain (Shooting upward)
                </SelectItem>
                <SelectItem value="rain" className="text-white hover:bg-slate-700">
                  Rain (Falling from top)
                </SelectItem>
                <SelectItem value="spiral" className="text-white hover:bg-slate-700">
                  Spiral (Spinning around)
                </SelectItem>
                <SelectItem value="blast" className="text-white hover:bg-slate-700">
                  Blast (Explosive burst)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* --- Ranges System --- */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Donation Ranges
          </h4>
          <Switch
            checked={useRanges}
            onCheckedChange={(v) => updateSetting("useRanges", v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
        </div>

        {useRanges ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">Range 1: 1 - 100 THB</p>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  Edit
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-1">Default settings will be used</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">Range 2: 101 - 500 THB</p>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  Edit
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-1">Special effect and sound</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">Range 3: 501 THB+</p>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  Edit
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-1">Premium alert with custom image</p>
            </div>

            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Layers className="w-4 h-4 mr-2" /> Add New Range
            </Button>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Ranges system is disabled</p>
            <p className="text-slate-500 text-sm mt-1">
              Enable to create different alerts for different donation amounts
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// PropTypes for type checking
EffectsTab.propTypes = {
  settings: PropTypes.shape({
    effect: PropTypes.string,
    imageGlow: PropTypes.bool,
    amountShine: PropTypes.bool,
    showConfetti: PropTypes.bool,
    confettiEffect: PropTypes.string,
    useRanges: PropTypes.bool,
  }).isRequired,
  updateSetting: PropTypes.func.isRequired,
};