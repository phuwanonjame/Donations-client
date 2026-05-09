import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playAlertSound } from "@/utils/audioUtils";
import {
  FALLBACK_TTS_STYLES,
  FALLBACK_TTS_VOICES,
  fetchTtsStyles,
  fetchTtsVoices,
  findMatchingTtsStyleId,
  getReadableVoiceLabel,
  resolveTtsVoiceId,
  synthesizeTtsAudio,
} from "@/utils/ttsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Music, RefreshCw, Upload, Volume2 } from "lucide-react";

export default function SoundTab({ settings, updateSetting }) {
  const alertSound = settings?.alertSound ?? "bb_spirit";
  const useCustomSound = settings?.useCustomSound ?? false;
  const customSound = settings?.customSound ?? null;
  const volume = settings?.volume ?? [75];
  const ttsVoice = settings?.ttsVoice ?? "female";
  const ttsStyleId = settings?.ttsStyleId ?? null;
  const ttsRate = settings?.ttsRate ?? 0.95;
  const ttsPitch = settings?.ttsPitch ?? 1.05;
  const ttsTitleEnabled = settings?.ttsTitleEnabled ?? true;
  const ttsMessageEnabled = settings?.ttsMessageEnabledField ?? false;
  const ttsVolume = settings?.ttsVolume ?? 50;

  const currentVolume = Number(Array.isArray(volume) ? volume[0] : volume);
  const currentTtsRate = Number(ttsRate);
  const currentTtsPitch = Number(ttsPitch);
  const currentTtsVolume = Number(ttsVolume);

  const audioRef = useRef(null);
  const [ttsPreviewText, setTtsPreviewText] = useState("ขอบคุณสำหรับโดเนท 100 บาท");
  const [ttsVoices, setTtsVoices] = useState(FALLBACK_TTS_VOICES);
  const [ttsStyles, setTtsStyles] = useState(FALLBACK_TTS_STYLES);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [voiceLoadError, setVoiceLoadError] = useState("");
  const [loadingStyles, setLoadingStyles] = useState(false);
  const [isPreviewingTts, setIsPreviewingTts] = useState(false);

  const resolvedVoiceId = resolveTtsVoiceId(ttsVoice);
  const selectedStyleId = ttsStyleId || findMatchingTtsStyleId(currentTtsRate, currentTtsPitch);
  const selectedStyle = ttsStyles.find((style) => style.id === selectedStyleId) || FALLBACK_TTS_STYLES[0];
  const activeVoiceExists = useMemo(
    () => ttsVoices.some((voice) => voice.id === resolvedVoiceId),
    [ttsVoices, resolvedVoiceId],
  );

  const loadVoices = async () => {
    setLoadingVoices(true);
    setVoiceLoadError("");
    try {
      const voices = await fetchTtsVoices();
      setTtsVoices(voices.length > 0 ? voices : FALLBACK_TTS_VOICES);
      if (voices.length === 0) {
        setVoiceLoadError("TTS service returned no voices, using fallback list.");
      }
    } catch (error) {
      setTtsVoices(FALLBACK_TTS_VOICES);
      setVoiceLoadError("TTS service offline, using fallback voice list.");
    } finally {
      setLoadingVoices(false);
    }
  };

  useEffect(() => {
    loadVoices();
  }, []);

  useEffect(() => {
    const loadStyles = async () => {
      setLoadingStyles(true);
      try {
        const styles = await fetchTtsStyles();
        setTtsStyles(styles.length > 0 ? styles : FALLBACK_TTS_STYLES);
      } catch {
        setTtsStyles(FALLBACK_TTS_STYLES);
      } finally {
        setLoadingStyles(false);
      }
    };

    loadStyles();
  }, []);

  useEffect(() => {
    const normalizedVoiceId = ttsVoice ? resolveTtsVoiceId(ttsVoice) : FALLBACK_TTS_VOICES[0].id;
    if (ttsVoice !== normalizedVoiceId || !activeVoiceExists) {
      updateSetting("ttsVoice", normalizedVoiceId);
    }
  }, [activeVoiceExists, ttsVoice, updateSetting]);

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
      alert("ไฟล์ต้องไม่เกิน 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateSetting("customSound", reader.result);
    reader.readAsDataURL(file);
  };

  const handleTtsPreview = async () => {
    if (!ttsPreviewText.trim()) return;

    try {
      setIsPreviewingTts(true);

      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current._blobUrl) {
          URL.revokeObjectURL(audioRef.current._blobUrl);
        }
        audioRef.current = null;
      }

      const blob = await synthesizeTtsAudio({
        text: ttsPreviewText.trim(),
        voice: resolvedVoiceId,
        styleId: selectedStyleId,
        rate: currentTtsRate,
        pitch: currentTtsPitch,
        volume: currentTtsVolume,
      });

      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      audio.volume = Math.max(0, Math.min(1, currentTtsVolume / 100));
      audio._blobUrl = blobUrl;
      audioRef.current = audio;

      const cleanup = () => {
        URL.revokeObjectURL(blobUrl);
        if (audioRef.current === audio) audioRef.current = null;
        setIsPreviewingTts(false);
      };

      audio.onended = cleanup;
      audio.onerror = cleanup;
      await audio.play();
    } catch (error) {
      console.error("TTS preview failed:", error);
      alert(`TTS preview failed: ${error?.message || "Please make sure the Python TTS service is running."}`);
      setIsPreviewingTts(false);
    }
  };

  const handleStyleChange = (styleId) => {
    const style = ttsStyles.find((item) => item.id === styleId) || FALLBACK_TTS_STYLES[0];
    updateSetting("ttsStyleId", style.id);
    updateSetting("ttsRate", style.rate);
    updateSetting("ttsPitch", style.pitch);
    if (style.recommended_voice) {
      updateSetting("ttsVoice", style.recommended_voice);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6 space-y-5 sm:space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400" /> Sound Settings
        </h3>

        <div className="space-y-3">
          <div className="flex items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="min-w-0">
              <Label className="text-slate-300">Use Custom Sound</Label>
              <p className="text-slate-500 text-sm mt-1">Upload your own notification sound</p>
            </div>
            <Switch
              checked={useCustomSound}
              onCheckedChange={(value) => updateSetting("useCustomSound", value)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">Notification Sound</Label>
          <p className="text-slate-500 text-sm">Select a sound for donation alerts</p>
          <Select value={alertSound} onValueChange={handleAlertSoundChange}>
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
              <p className="text-xs text-green-400 mt-2">Custom sound loaded successfully</p>
            )}
          </div>
        )}

        <div className="space-y-3 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Label className="text-slate-300 text-base">Notification Volume ({currentVolume}%)</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => playAlertSound(alertSound, currentVolume)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8 px-3"
            >
              <Volume2 className="w-4 h-4 mr-1" /> Test
            </Button>
          </div>
          <Slider value={[currentVolume]} onValueChange={handleVolumeChange} max={100} step={1} className="w-full" />
        </div>

        <div className="mt-8 pt-4 border-t border-slate-700/50">
          <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Text-to-Speech Settings
          </h4>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <Label className="text-slate-300 text-base">TTS Voice</Label>
              <p className="text-slate-500 text-sm mt-1">
                {voiceLoadError || `Current voice: ${getReadableVoiceLabel(resolvedVoiceId)}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadVoices();
              }}
              disabled={loadingVoices || loadingStyles}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8 px-3 w-full sm:w-auto"
            >
              {loadingVoices ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Reload
            </Button>
          </div>
          <Select value={resolvedVoiceId} onValueChange={(value) => updateSetting("ttsVoice", value)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue placeholder="Select TTS Voice" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-72">
              {ttsVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id} className="text-white hover:bg-slate-700">
                  {voice.name} ({voice.locale}, {voice.gender})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">Voice Style Preset</Label>
          <Select value={selectedStyleId} onValueChange={handleStyleChange}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-12">
              <SelectValue placeholder="Select TTS style" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-72">
              {ttsStyles.map((style) => (
                <SelectItem key={style.id} value={style.id} className="text-white hover:bg-slate-700">
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3">
            <p className="text-sm text-slate-200">{selectedStyle.name}</p>
            <p className="text-xs text-slate-500 mt-1">{selectedStyle.description}</p>
            <p className="text-[11px] text-slate-500 mt-2">
              Preset controlled by backend. Users cannot manually tune pitch/rate here.
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <Label className="text-slate-300 text-base">TTS Preview Text</Label>
          <Input
            value={ttsPreviewText}
            onChange={(e) => setTtsPreviewText(e.target.value)}
            className="bg-slate-800/80 border-slate-700 text-white"
            placeholder="ขอบคุณสำหรับโดเนท 100 บาท"
          />
          <Button
            variant="outline"
            onClick={handleTtsPreview}
            disabled={isPreviewingTts || !ttsPreviewText.trim()}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
          >
            {isPreviewingTts ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4 mr-2" />
            )}
            Test TTS Voice
          </Button>
        </div>

        <div className="space-y-3 mt-6">
          <Label className="text-slate-300 text-base">Applied Backend Tuning</Label>
          <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-3 text-sm text-slate-300">
            <div>Speech Rate: {currentTtsRate.toFixed(2)}</div>
            <div>Pitch: {currentTtsPitch.toFixed(2)}</div>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="min-w-0">
              <Label className="text-slate-300 text-base">Read Donation Info</Label>
              <p className="text-slate-500 text-sm mt-1">Read donor name and amount aloud</p>
            </div>
            <Switch
              checked={ttsTitleEnabled}
              onCheckedChange={(value) => updateSetting("ttsTitleEnabled", value)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="min-w-0">
              <Label className="text-slate-300 text-base">Read Message</Label>
              <p className="text-slate-500 text-sm mt-1">Read donation message aloud</p>
            </div>
            <Switch
              checked={ttsMessageEnabled}
              onCheckedChange={(value) => updateSetting("ttsMessageEnabledField", value)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <Label className="text-slate-300 text-base">TTS Volume ({currentTtsVolume}%)</Label>
          <Slider
            value={[currentTtsVolume]}
            onValueChange={(value) => updateSetting("ttsVolume", value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
