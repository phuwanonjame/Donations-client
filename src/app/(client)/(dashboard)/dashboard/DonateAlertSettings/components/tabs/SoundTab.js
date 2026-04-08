import React from "react";
import { motion } from "framer-motion";

// Import utilities
import { playAlertSound } from "@/utils/audioUtils"; 

// Component Imports
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Upload, Volume2 } from "lucide-react";

export default function SoundTab({ settings, updateSetting }) {

  // Helper function to get values from settings (support both flat and grouped)
  const getSettingValue = (flatKey, groupedPath, defaultValue) => {
    if (!settings) return defaultValue;
    
    // If using grouped structure
    if (settings.metadata) {
      const paths = groupedPath.split('.');
      let value = settings.metadata;
      for (const p of paths) {
        if (value && typeof value === 'object' && p in value) {
          value = value[p];
        } else {
          return defaultValue;
        }
      }
      return value !== undefined && value !== null ? value : defaultValue;
    }
    
    // Flat structure
    return settings[flatKey] !== undefined && settings[flatKey] !== null 
      ? settings[flatKey] 
      : defaultValue;
  };

  // Helper function to update values (support both flat and grouped)
  const updateSettingValue = (flatKey, groupedPath, value) => {
    if (settings.metadata) {
      // For grouped structure, update nested object
      const paths = groupedPath.split('.');
      let updatedMetadata = { ...settings.metadata };
      let current = updatedMetadata;
      
      for (let i = 0; i < paths.length - 1; i++) {
        if (!current[paths[i]]) {
          current[paths[i]] = {};
        }
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      updateSetting("metadata", updatedMetadata);
    } else {
      // Flat structure
      updateSetting(flatKey, value);
    }
  };

  // Get values with proper defaults
  const alertSound = getSettingValue('alertSound', 'audio.notification.sound', 'bb_spirit');
  const useCustomSound = getSettingValue('useCustomSound', 'audio.notification.useCustom', false);
  const customSound = getSettingValue('customSound', 'audio.notification.customSound', null);
  const volume = getSettingValue('volume', 'audio.notification.volume', 75);
  const ttsVoice = getSettingValue('ttsVoice', 'audio.tts.voice', 'female');
  const ttsRate = getSettingValue('ttsRate', 'audio.tts.rate', 0.5);
  const ttsPitch = getSettingValue('ttsPitch', 'audio.tts.pitch', 0.5);
  const ttsTitleEnabled = getSettingValue('ttsTitleEnabled', 'audio.tts.title.enabled', true);
  const ttsMessageEnabled = getSettingValue('ttsMessageEnabledField', 'audio.tts.message.enabled', false);
  const ttsVolume = getSettingValue('ttsVolume', 'audio.tts.volume', 50);

  // Convert to numbers safely
  const currentVolume = Number(volume);
  const currentTtsRate = Number(ttsRate);
  const currentTtsPitch = Number(ttsPitch);
  const currentTtsVolume = Number(ttsVolume);

  // Function to handle sound change and immediate testing
  const handleAlertSoundChange = (newSoundKey) => {
    if (alertSound !== newSoundKey) {
      updateSettingValue('alertSound', 'audio.notification.sound', newSoundKey);
      // Test the new sound
      playAlertSound(newSoundKey, currentVolume);
    }
  };
  
  // Function to handle volume change and immediate testing
  const handleVolumeChange = (newVolumeArray) => {
    const newVolume = newVolumeArray[0];
    updateSettingValue('volume', 'audio.notification.volume', newVolume);
    // Test current sound with new volume
    playAlertSound(alertSound, newVolume);
  };

  // Function to handle custom sound upload
  const handleCustomSoundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("ไฟล์ห้ามเกิน 2MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      updateSettingValue('customSound', 'audio.notification.customSound', reader.result);
    };
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
              onCheckedChange={(v) => updateSettingValue('useCustomSound', 'audio.notification.useCustom', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* Notification sound */}
        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">Notification Sound</Label>
          <p className="text-slate-500 text-sm">Select a sound for donation alerts</p>
          <Select
            value={alertSound}
            onValueChange={handleAlertSoundChange}
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
              <p className="text-xs text-green-400 mt-2">
                ✓ Custom sound loaded successfully
              </p>
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

        {/* TTS Section Header */}
        <div className="mt-8 pt-4 border-t border-slate-700/50">
          <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Text-to-Speech Settings
          </h4>
        </div>

        {/* TTS Voice */}
        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">TTS Voice</Label>
          <Select
            value={ttsVoice}
            onValueChange={(v) => updateSettingValue('ttsVoice', 'audio.tts.voice', v)}
          >
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue placeholder="Select TTS Voice" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="female" className="text-white hover:bg-slate-700">Female (ผู้หญิง)</SelectItem>
              <SelectItem value="male" className="text-white hover:bg-slate-700">Male (ผู้ชาย)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TTS Rate */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">
              Speech Rate ({currentTtsRate.toFixed(1)})
            </Label>
          </div>
          <Slider
            value={[currentTtsRate]}
            onValueChange={(v) => updateSettingValue('ttsRate', 'audio.tts.rate', v[0])}
            min={0.1}
            max={2}
            step={0.1}
            className="w-full"
          />
          <p className="text-slate-500 text-xs">Slower ← → Faster</p>
        </div>

        {/* TTS Pitch */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">
              Pitch ({currentTtsPitch.toFixed(1)})
            </Label>
          </div>
          <Slider
            value={[currentTtsPitch]}
            onValueChange={(v) => updateSettingValue('ttsPitch', 'audio.tts.pitch', v[0])}
            min={0.1}
            max={2}
            step={0.1}
            className="w-full"
          />
          <p className="text-slate-500 text-xs">Lower ← → Higher</p>
        </div>

        {/* TTS Title Enabled */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">Read Donation Info</Label>
              <p className="text-slate-500 text-sm mt-1">Read donor name and amount aloud</p>
            </div>
            <Switch
              checked={ttsTitleEnabled}
              onCheckedChange={(v) => updateSettingValue('ttsTitleEnabled', 'audio.tts.title.enabled', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* TTS Message */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <Label className="text-slate-300 text-base">Read Message</Label>
              <p className="text-slate-500 text-sm mt-1">Read donation message aloud</p>
            </div>
            <Switch
              checked={ttsMessageEnabled}
              onCheckedChange={(v) => updateSettingValue('ttsMessageEnabledField', 'audio.tts.message.enabled', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        {/* TTS Volume */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 text-base">
              TTS Volume ({currentTtsVolume}%)
            </Label>
          </div>
          <Slider
            value={[currentTtsVolume]}
            onValueChange={(v) => updateSettingValue('ttsVolume', 'audio.tts.volume', v[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}