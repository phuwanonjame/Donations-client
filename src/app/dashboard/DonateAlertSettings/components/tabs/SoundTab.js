import React from "react";
import { motion } from "framer-motion";

// Import utilities
// ⭐⭐⭐ แก้ไขตรงนี้: ต้อง Import จาก audioUtils ไม่ใช่ audioSources ⭐⭐⭐
import { playAlertSound } from "../../../../../utils/audioUtils"; 

// Component Imports (assuming these are correctly configured, e.g., shadcn/ui)
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Upload, Volume2 } from "lucide-react";

export default function SoundTab({ settings, updateSetting }) {

  // ⭐ ทำให้ค่าทั้งหมดเป็น Number เสมอ ป้องกัน .toFixed พัง
  const currentVolume = Number(
    Array.isArray(settings.volume) ? settings.volume[0] : settings.volume ?? 50
  );

  const currentTtsRate = Number(settings.ttsRate ?? 1.0);
  const currentTtsPitch = Number(settings.ttsPitch ?? 1.0);
  const currentTtsVolume = Number(settings.ttsVolume ?? 50);

  // Function to handle sound change and immediate testing
  const handleAlertSoundChange = (newSoundKey) => {
    // เพิ่มเงื่อนไข: เล่นเสียงและอัปเดตการตั้งค่า เมื่อมีการเปลี่ยนค่าเท่านั้น
    if (settings.alertSound !== newSoundKey) { 
        updateSetting("alertSound", newSoundKey);
        // ทดสอบเล่นเสียงทันทีที่ผู้ใช้เลือก
        playAlertSound(newSoundKey, currentVolume); 
    }
  };
    
  // Function to handle engine volume change and immediate testing
  const handleVolumeChange = (newVolumeArray) => {
    const newVolume = newVolumeArray[0];
    updateSetting("volume", newVolume);
    
    // ทดสอบเล่นเสียงปัจจุบันทันทีที่ผู้ใช้ปรับระดับเสียง
    playAlertSound(settings.alertSound, newVolume);
  };


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

        {/* Custom sound toggle */}
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

        {/* Notification sound */}
        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">เสียง</Label>
          <p className="text-slate-500 text-sm">เสียงจากเสริมเอ็นจิน</p>
          <Select
            value={settings.alertSound}
            onValueChange={handleAlertSoundChange} // <-- ใช้ฟังก์ชันใหม่
          >
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue placeholder="Select a sound" />
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

        {/* Custom sound upload */}
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
                onClick={() => document.getElementById("custom-sound-upload").click()}
              >
                Choose File
              </Button>

              <Input
                id="custom-sound-upload"
                type="file"
                accept=".mp3,.wav"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    console.log(`Selected custom sound: ${e.target.files[0].name}`);
                    // NOTE: ต้องเพิ่ม logic ในการอัพโหลด/จัดเก็บไฟล์ที่นี่
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Engine volume */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">ระดับเสียงเสริมเอ็นจิน ({currentVolume}%)</Label>
            {/* ปุ่มทดสอบเสียงปัจจุบัน */}
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => playAlertSound(settings.alertSound, currentVolume)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8 px-3"
            >
                <Volume2 className="w-4 h-4 mr-1" /> ทดสอบ
            </Button>
          </div>
          <Slider
            value={[currentVolume]}
            onValueChange={handleVolumeChange} // <-- ใช้ฟังก์ชันใหม่
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* TTS Voice */}
        <div className="space-y-3 mt-6">
          <Label className="text-slate-300 text-base">เสียงคนพูด Text to Speech</Label>
          <Select
            value={settings.ttsVoice}
            onValueChange={(v) => updateSetting("ttsVoice", v)}
          >
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue placeholder="Select TTS Voice" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="female" className="text-white hover:bg-slate-700">ผู้หญิง (Female)</SelectItem>
              <SelectItem value="male" className="text-white hover:bg-slate-700">ผู้ชาย (Male)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TTS Rate */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">
              ความเร็วในการพูด (Rate) ({currentTtsRate.toFixed(1)})
            </Label>
          </div>
          <Slider
            value={[currentTtsRate]}
            onValueChange={(v) => updateSetting("ttsRate", v)}
            min={0.1}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* TTS Pitch */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">
              ระดับเสียงสูงต่ำ (Pitch) ({currentTtsPitch.toFixed(1)})
            </Label>
          </div>
          <Slider
            value={[currentTtsPitch]}
            onValueChange={(v) => updateSetting("ttsPitch", v)}
            min={0.1}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* TTS Say Title Enabled */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">พูดชื่อและจำนวนเงิน</Label>
              <p className="text-slate-500 text-sm mt-1">แปลงชื่อและจำนวนเงินเป็นเสียงพูด</p>
            </div>
            <Switch
              checked={settings.ttsTitleEnabled}
              onCheckedChange={(v) => updateSetting("ttsTitleEnabled", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* TTS Say Message */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">พูดข้อความ</Label>
              <p className="text-slate-500 text-sm mt-1">แปลงข้อความที่ส่งมาเป็นเสียงพูด</p>
            </div>
            <Switch
              checked={settings.ttsMessageEnabledField}
              onCheckedChange={(v) => updateSetting("ttsMessageEnabledField", v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* TTS Volume */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">
              ระดับเสียง Text to Speech ({currentTtsVolume}%)
            </Label>
          </div>
          <Slider
            value={[currentTtsVolume]}
            onValueChange={(v) => updateSetting("ttsVolume", v)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}