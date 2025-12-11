import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Upload } from "lucide-react";

export default function SoundTab({ settings, updateSetting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400" /> Text to Speech Settings
        </h3>
        
        {/* Custom Sound Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300">Use Custom Sound</Label>
              <p className="text-slate-500 text-sm mt-1">Upload your own notification sound</p>
            </div>
            <Switch
              checked={settings.useCustomSound}
              onCheckedChange={(v) => updateSetting("useCustomSound", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* เสียง */}
        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">เสียง</Label>
          <p className="text-slate-500 text-sm">เสียงจากเสริมเอ็นจิน</p>
          <Select
            value={settings.alertSound}
            onValueChange={(v) => updateSetting("alertSound", v)}
          >
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="bb_spirit" className="text-white hover:bg-slate-700">BB Spirit</SelectItem>
              <SelectItem value="chime" className="text-white hover:bg-slate-700">Chime</SelectItem>
              <SelectItem value="cash" className="text-white hover:bg-slate-700">Cash Register</SelectItem>
              <SelectItem value="bell" className="text-white hover:bg-slate-700">Bell Ring</SelectItem>
              <SelectItem value="fanfare" className="text-white hover:bg-slate-700">Fanfare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Sound Upload */}
        {settings.useCustomSound && (
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
              >
                Choose File
              </Button>
            </div>
          </div>
        )}

        {/* ระดับเสียงเสริมเอ็นจิน */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">ระดับเสียงเสริมเอ็นจิน ({settings.volume[0]}%)</Label>
          </div>
          <Slider
            value={settings.volume}
            onValueChange={(v) => updateSetting("volume", v)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* เสียงคนพูด Text to Speech */}
        <div className="space-y-3 mt-6">
          <Label className="text-slate-300 text-base">เสียงคนพูด Text to Speech</Label>
          <Select
            value={settings.ttsVoice || "female"}
            onValueChange={(v) => updateSetting("ttsVoice", v)}
          >
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="female" className="text-white hover:bg-slate-700">ผู้หญิง (Female)</SelectItem>
              <SelectItem value="male" className="text-white hover:bg-slate-700">ผู้ชาย (Male)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ความเร็วในการพูด (Rate) */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">ความเร็วในการพูด (Rate) ({settings.ttsRate || 0.5})</Label>
          </div>
          <Slider
            value={[settings.ttsRate || 0.5]}
            onValueChange={(v) => updateSetting("ttsRate", v[0])}
            min={0}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* ระดับเสียงสูงต่ำ (Pitch) */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">ระดับเสียงสูงต่ำ (Pitch) ({settings.ttsPitch || 0.5})</Label>
          </div>
          <Slider
            value={[settings.ttsPitch || 0.5]}
            onValueChange={(v) => updateSetting("ttsPitch", v[0])}
            min={0}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* พูดชื่อและจำนวนเงิน */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">พูดชื่อและจำนวนเงิน</Label>
              <p className="text-slate-500 text-sm mt-1">แปลงชื่อและจำนวนเงินเป็นเสียงพูด</p>
            </div>
            <Switch
              checked={settings.ttsTitleEnabled || true}
              onCheckedChange={(v) => updateSetting("ttsTitleEnabled", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* พูดชื่อความ */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">พูดชื่อความ</Label>
              <p className="text-slate-500 text-sm mt-1">แปลงชื่อความเป็นเสียงพูด</p>
            </div>
            <Switch
              checked={settings.ttsMessageEnabledField || true}
              onCheckedChange={(v) => updateSetting("ttsMessageEnabledField", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* ระดับเสียง Text to Speech */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">ระดับเสียง Text to Speech ({settings.ttsVolume || 50}%)</Label>
          </div>
          <Slider
            value={[settings.ttsVolume || 50]}
            onValueChange={(v) => updateSetting("ttsVolume", v[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}