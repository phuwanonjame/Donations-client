// ==================== SoundTab.js ====================
import React from "react";
import { motion } from "framer-motion";
import { playAlertSound } from "@/utils/audioUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Upload, Volume2 } from "lucide-react";

export default function SoundTab({ settings, updateSetting }) {
  // ✅ flat structure เท่านั้น
  const alertSound    = settings?.alertSound             ?? "bb_spirit";
  const useCustomSound = settings?.useCustomSound        ?? false;
  const customSound   = settings?.customSound            ?? null;
  const volume        = settings?.volume                 ?? [75];
  const ttsVoice      = settings?.ttsVoice              ?? "female";
  const ttsRate       = settings?.ttsRate               ?? 0.5;
  const ttsPitch      = settings?.ttsPitch              ?? 0.5;
  const ttsTitleEnabled    = settings?.ttsTitleEnabled   ?? true;
  const ttsMessageEnabled  = settings?.ttsMessageEnabledField ?? false;
  const ttsVolume     = settings?.ttsVolume             ?? 50;

  const currentVolume    = Number(Array.isArray(volume) ? volume[0] : volume);
  const currentTtsRate   = Number(ttsRate);
  const currentTtsPitch  = Number(ttsPitch);
  const currentTtsVolume = Number(ttsVolume);

  const handleAlertSoundChange = (newSoundKey) => {
    if (alertSound !== newSoundKey) {
      updateSetting("alertSound", newSoundKey);
      playAlertSound(newSoundKey, currentVolume);
    }
  };

  const handleVolumeChange = (newVolumeArray) => {
    const newVolume = newVolumeArray[0];
    updateSetting("volume", [newVolume]);
    playAlertSound(alertSound, newVolume);
  };

  const handleCustomSoundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("ไฟล์ห้ามเกิน 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateSetting("customSound", reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400" /> Sound Settings
        </h3>

        {/* Custom sound toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300">Use Custom Sound</Label>
              <p className="text-slate-500 text-sm mt-1">Upload your own notification sound</p>
            </div>
            <Switch
              checked={useCustomSound}
              onCheckedChange={(v) => updateSetting("useCustomSound", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* Notification sound */}
        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">Notification Sound</Label>
          <p className="text-slate-500 text-sm">Select a sound for donation alerts</p>
          <Select value={alertSound} onValueChange={handleAlertSoundChange}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue placeholder="Select a sound" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="bb_spirit" className="text-white hover:bg-slate-700">BB Spirit</SelectItem>
              <SelectItem value="chime"     className="text-white hover:bg-slate-700">Chime</SelectItem>
              <SelectItem value="cash"      className="text-white hover:bg-slate-700">Cash Register</SelectItem>
              <SelectItem value="bell"      className="text-white hover:bg-slate-700">Bell Ring</SelectItem>
              <SelectItem value="fanfare"   className="text-white hover:bg-slate-700">Fanfare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom sound upload */}
        {useCustomSound && (
          <div className="space-y-3 mt-4">
            <Label className="text-slate-300 text-base">Custom Sound Upload</Label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-white text-sm mb-1">Upload MP3 or WAV file</p>
              <p className="text-slate-500 text-xs">Max file size: 2MB</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => document.getElementById("custom-sound-upload").click()}
              >
                Choose File
              </Button>
              <Input
                id="custom-sound-upload"
                type="file"
                accept=".mp3,.wav"
                className="hidden"
                onChange={handleCustomSoundUpload}
              />
            </div>
            {customSound && (
              <p className="text-xs text-green-400 mt-2">✓ Custom sound loaded successfully</p>
            )}
          </div>
        )}

        {/* Notification volume */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">
              Notification Volume ({currentVolume}%)
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => playAlertSound(alertSound, currentVolume)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8 px-3"
            >
              <Volume2 className="w-4 h-4 mr-1" /> Test
            </Button>
          </div>
          <Slider
            value={[currentVolume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* TTS Section */}
        <div className="mt-8 pt-4 border-t border-slate-700/50">
          <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Text-to-Speech Settings
          </h4>
        </div>

        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">TTS Voice</Label>
          <Select value={ttsVoice} onValueChange={(v) => updateSetting("ttsVoice", v)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue placeholder="Select TTS Voice" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="female" className="text-white hover:bg-slate-700">Female (ผู้หญิง)</SelectItem>
              <SelectItem value="male"   className="text-white hover:bg-slate-700">Male (ผู้ชาย)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">Speech Rate ({currentTtsRate.toFixed(1)})</Label>
          </div>
          <Slider
            value={[currentTtsRate]}
            onValueChange={(v) => updateSetting("ttsRate", v[0])}
            min={0.1} max={2} step={0.1} className="w-full"
          />
          <p className="text-slate-500 text-xs">Slower ← → Faster</p>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">Pitch ({currentTtsPitch.toFixed(1)})</Label>
          </div>
          <Slider
            value={[currentTtsPitch]}
            onValueChange={(v) => updateSetting("ttsPitch", v[0])}
            min={0.1} max={2} step={0.1} className="w-full"
          />
          <p className="text-slate-500 text-xs">Lower ← → Higher</p>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">Read Donation Info</Label>
              <p className="text-slate-500 text-sm mt-1">Read donor name and amount aloud</p>
            </div>
            <Switch
              checked={ttsTitleEnabled}
              onCheckedChange={(v) => updateSetting("ttsTitleEnabled", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">Read Message</Label>
              <p className="text-slate-500 text-sm mt-1">Read donation message aloud</p>
            </div>
            <Switch
              checked={ttsMessageEnabled}
              onCheckedChange={(v) => updateSetting("ttsMessageEnabledField", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">TTS Volume ({currentTtsVolume}%)</Label>
          </div>
          <Slider
            value={[currentTtsVolume]}
            onValueChange={(v) => updateSetting("ttsVolume", v[0])}
            max={100} step={1} className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}