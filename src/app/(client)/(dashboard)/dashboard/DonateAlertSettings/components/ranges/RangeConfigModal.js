// ./components/tabs/ranges/RangeConfigModal.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap, Sparkles, Image, Droplet, Volume2, Palette, Eye,
  Type, Layout, Music, Video, Trash2, RotateCcw, Copy,
  RefreshCw, Gift, Star, Trophy
} from "lucide-react";
import { createWidgetSettingsNotifier } from "@/lib/notifications/widget-settings-toast";
import {
  animationStyleOptions,
  blurOptions,
  confettiEffectOptions,
  confettiModeOptions,
  effectOptions,
  fontSizePresetOptions,
  gradientOptions,
  imageShapeOptions,
  imageSizeOptions,
  positionOptions,
  rangeModalFontOptions,
  toValueLabelOptions,
  normalizeFlatSettings,
} from "../utils/settingsUtils";

const rangeNotifier = createWidgetSettingsNotifier("Range settings");

const FONT_SIZE_CLASS_TO_PX = {
  "text-sm": 18,
  "text-base": 24,
  "text-xl": 30,
  "text-2xl": 36,
  "text-4xl": 48,
};

function resolveTitleFontSizeClass(titleFontSize) {
  const px = Array.isArray(titleFontSize) ? titleFontSize[0] : titleFontSize;
  const match = Object.entries(FONT_SIZE_CLASS_TO_PX).find(([, value]) => value === Number(px));
  return match?.[0] || "text-2xl";
}

function normalizeRangeConfig(config = {}) {
  const normalized = normalizeFlatSettings({
    ...config,
    image: config.image ?? config.imageUrl ?? "",
    titleFontFamily: config.titleFontFamily ?? config.fontFamily ?? "IBM Plex Sans Thai",
    titleFontSize: config.titleFontSize ?? [FONT_SIZE_CLASS_TO_PX[config.titleFontSizeClass ?? config.fontSize] ?? 36],
    titleMainColor: config.titleMainColor ?? config.textColor ?? "#ffffff",
    titleAmountShine: config.titleAmountShine ?? config.amountShine ?? false,
    animationEnterType: config.animationEnterType ?? "fadeInUp",
    animationEnterDuration: config.animationEnterDuration ?? 0.8,
    animationExitType: config.animationExitType ?? "fadeOutUp",
    animationExitDuration: config.animationExitDuration ?? 0.8,
    animationDisplayDuration: config.animationDisplayDuration ?? Math.max(1, Math.round((config.duration ?? 5000) / 1000)),
    notificationSound: config.notificationSound ?? (config.notificationUseCustom || config.soundEnabled ? "custom" : "bb_spirit"),
    notificationVolume: config.notificationVolume ?? [config.soundVolume ?? 70],
    notificationUseCustom: config.notificationUseCustom ?? Boolean(config.notificationCustomSound ?? config.soundUrl),
    notificationCustomSound: config.notificationCustomSound ?? config.soundUrl ?? null,
  });

  return {
    ...normalized,
    titleFontSizeClass: config.titleFontSizeClass ?? resolveTitleFontSizeClass(normalized.titleFontSize),
    imageSize: config.imageSize ?? "md",
    imageShape: config.imageShape ?? "circle",
    soundLoop: config.soundLoop ?? false,
    textEffect: config.textEffect ?? normalized.titleTextEffect ?? "realistic_look",
    textShadow: config.textShadow ?? false,
    textGlow: config.textGlow ?? false,
    backgroundColor: config.backgroundColor ?? "from-purple-500 to-pink-500",
    backgroundBlur: config.backgroundBlur ?? "backdrop-blur-md",
    animationStyle: config.animationStyle ?? "slide-up",
    position: config.position ?? "top-center",
    particleEffect: config.particleEffect ?? false,
    glowIntensity: config.glowIntensity ?? 50,
    customCSS: config.customCSS ?? "",
    customClass: config.customClass ?? "",
  };
}

// Default empty config for new range (เหมือนการรีเซ็ตทั้งหมด)
const getEmptyRangeConfig = () => ({
  // Basic Info
  id: Date.now(),
  name: "",
  minAmount: 0,
  maxAmount: 100,
  priority: 1,
  enabled: true,
  
  // Media Settings - Empty/Default
  image: "",
  imageSize: "md",
  imageShape: "circle",
  imageGlow: false,
  
  // Sound Settings - Empty/Default
  notificationUseCustom: false,
  notificationCustomSound: "",
  notificationVolume: [70],
  notificationSound: "bb_spirit",
  soundLoop: false,
  
  // Text Settings - Empty/Default
  textEffect: "realistic_look",
  titleTextEffect: "realistic_look",
  effect: "realistic_look",
  titleMainColor: "#ffffff",
  textShadow: false,
  textGlow: false,
  titleAmountShine: false,
  titleFontFamily: "Inter",
  titleFontSize: [36],
  titleFontSizeClass: "text-2xl",
  
  // Display Settings - Empty/Default
  backgroundColor: "from-purple-500 to-pink-500",
  backgroundBlur: "backdrop-blur-md",
  animationStyle: "slide-up",
  animationDisplayDuration: 5,
  position: "top-center",
  
  // Effects - Empty/Default
  showConfetti: false,
  confettiEffect: "fountain",
  confettiMode: "classic",
  particleEffect: false,
  glowIntensity: 50,
  
  // Custom
  customCSS: "",
  customClass: "",
});

export default function RangeConfigModal({ range, onSave, onDelete, onDuplicate, onClose, isOpen }) {
  // ถ้าเป็น range เดิม ให้ใช้ค่าของมัน, ถ้าสร้างใหม่ให้ใช้ empty config
  const [config, setConfig] = useState(() => {
    if (range) {
      // แก้ไข range เดิม - ใช้ config เดิม
      return normalizeRangeConfig(range);
    } else {
      // สร้าง range ใหม่ - เริ่มจาก empty config
      return getEmptyRangeConfig();
    }
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = () => {
    // Validation
    if (!config.name.trim()) {
      rangeNotifier.error("Please enter a range name");
      return;
    }
    if (config.minAmount >= config.maxAmount) {
      rangeNotifier.error("Minimum amount must be less than maximum amount");
      return;
    }
    onSave(normalizeFlatSettings(config));
  };

  // รีเซ็ต config ใหม่ทั้งหมด (เหมือนสร้าง range ใหม่)
  const handleResetConfig = () => {
    if (window.confirm("Are you sure you want to reset all settings for this range? This will clear all configured values.")) {
      setIsResetting(true);
      setConfig(getEmptyRangeConfig());
      setTimeout(() => setIsResetting(false), 500);
      rangeNotifier.success("Range settings reset to empty. You can now configure from scratch.");
    }
  };

  const textEffects = toValueLabelOptions(effectOptions);
  const fontOptions = toValueLabelOptions(rangeModalFontOptions);
  const fontSizeOptions = toValueLabelOptions(fontSizePresetOptions);
  const gradientOptionItems = toValueLabelOptions(gradientOptions);
  const animationOptionItems = toValueLabelOptions(animationStyleOptions);
  const positionOptionItems = toValueLabelOptions(positionOptions);
  const imageSizeOptionItems = toValueLabelOptions(imageSizeOptions);
  const imageShapeOptionItems = toValueLabelOptions(imageShapeOptions);
  const confettiOptions = toValueLabelOptions(confettiEffectOptions);
  const confettiModeOptionItems = toValueLabelOptions(confettiModeOptions);
  const blurOptionItems = toValueLabelOptions(blurOptions);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
            {range?.id ? "✏️ Edit Donation Range" : "✨ Create New Donation Range"}
            {!range?.id && (
              <span className="text-sm font-normal text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">
                Configure from scratch
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {range?.id 
              ? "Edit the settings for this donation range" 
              : "Create a new range with custom settings. All fields start empty for you to configure."}
          </DialogDescription>
        </DialogHeader>

        {/* Range Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-3 sm:p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="sm:col-span-2 space-y-2">
            <Label className="text-slate-300">
              Range Name <span className="text-red-400">*</span>
            </Label>
            <Input
              value={config.name}
              onChange={(e) => setConfig({...config, name: e.target.value})}
              placeholder="e.g., Small Gift, Big Support"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Min Amount (THB)</Label>
            <Input
              type="number"
              min="0"
              value={config.minAmount}
              onChange={(e) => setConfig({...config, minAmount: parseInt(e.target.value) || 0})}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Max Amount (THB)</Label>
            <Input
              type="number"
              min={config.minAmount + 1}
              value={config.maxAmount}
              onChange={(e) => setConfig({...config, maxAmount: parseInt(e.target.value) || config.minAmount + 1})}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Full Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-slate-800 h-auto">
            <TabsTrigger value="basic" className="text-slate-300 data-[state=active]:bg-slate-700">Basic</TabsTrigger>
            <TabsTrigger value="media" className="text-slate-300 data-[state=active]:bg-slate-700">Media</TabsTrigger>
            <TabsTrigger value="text" className="text-slate-300 data-[state=active]:bg-slate-700">Text</TabsTrigger>
            <TabsTrigger value="display" className="text-slate-300 data-[state=active]:bg-slate-700">Display</TabsTrigger>
            <TabsTrigger value="sound" className="text-slate-300 data-[state=active]:bg-slate-700">Sound</TabsTrigger>
            <TabsTrigger value="effects" className="text-slate-300 data-[state=active]:bg-slate-700">Effects</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Priority (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={config.priority}
                  onChange={(e) => setConfig({...config, priority: parseInt(e.target.value)})}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-slate-500 text-xs">Higher priority = overrides lower ones</p>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-800/50">
                  <span className="text-slate-300">Enable this range</span>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(v) => setConfig({...config, enabled: v})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Text Effect</Label>
              <Select
                value={config.titleTextEffect ?? config.textEffect}
                onValueChange={(v) => setConfig({
                  ...config,
                  textEffect: v,
                  titleTextEffect: v,
                  effect: v,
                })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {textEffects.map(effect => (
                    <SelectItem key={effect.value} value={effect.value}>{effect.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Animation Style</Label>
              <Select value={config.animationStyle} onValueChange={(v) => setConfig({...config, animationStyle: v})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {animationOptionItems.map(anim => (
                    <SelectItem key={anim.value} value={anim.value}>{anim.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Image URL (Optional)</Label>
              <Input
                value={config.image}
                onChange={(e) => setConfig({...config, image: e.target.value})}
                placeholder="https://example.com/image.gif or leave empty for default"
                className="bg-slate-800 border-slate-700 text-white"
              />
              <p className="text-slate-500 text-xs">Leave empty to use default alert image</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Image Size</Label>
                <Select value={config.imageSize} onValueChange={(v) => setConfig({...config, imageSize: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {imageSizeOptionItems.map(size => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Image Shape</Label>
                <Select value={config.imageShape} onValueChange={(v) => setConfig({...config, imageShape: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {imageShapeOptionItems.map(shape => (
                      <SelectItem key={shape.value} value={shape.value}>{shape.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-fuchsia-400" />
                <Label className="text-slate-300">Image Glow Effect</Label>
              </div>
              <Switch
                checked={config.imageGlow}
                onCheckedChange={(v) => setConfig({...config, imageGlow: v})}
              />
            </div>

            {config.image && (
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Preview:</p>
                <img 
                  src={config.image} 
                  alt="Preview" 
                  className={`${config.imageSize === 'sm' ? 'w-10 h-10' : config.imageSize === 'md' ? 'w-12 h-12' : config.imageSize === 'lg' ? 'w-16 h-16' : 'w-20 h-20'} ${config.imageShape === 'circle' ? 'rounded-full' : config.imageShape === 'rounded' ? 'rounded-lg' : ''}`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.titleMainColor}
                    onChange={(e) => setConfig({...config, titleMainColor: e.target.value})}
                    className="w-12 h-10 p-1 bg-slate-800 border-slate-700"
                  />
                  <Input
                    value={config.titleMainColor}
                    onChange={(e) => setConfig({...config, titleMainColor: e.target.value})}
                    className="flex-1 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Font Family</Label>
                <Select value={config.titleFontFamily} onValueChange={(v) => setConfig({...config, titleFontFamily: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Font Size</Label>
                <Select
                  value={config.titleFontSizeClass}
                  onValueChange={(v) => setConfig({
                    ...config,
                    titleFontSizeClass: v,
                    titleFontSize: [FONT_SIZE_CLASS_TO_PX[v] ?? 36],
                  })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {fontSizeOptions.map(size => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Glow Intensity</Label>
                <Slider
                  value={[config.glowIntensity]}
                  onValueChange={(v) => setConfig({...config, glowIntensity: v[0]})}
                  max={100}
                  step={1}
                  className="bg-slate-700"
                />
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.textShadow}
                  onCheckedChange={(v) => setConfig({...config, textShadow: v})}
                />
                <Label className="text-slate-300">Text Shadow</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.textGlow}
                  onCheckedChange={(v) => setConfig({...config, textGlow: v})}
                />
                <Label className="text-slate-300">Text Glow</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.titleAmountShine}
                  onCheckedChange={(v) => setConfig({...config, titleAmountShine: v})}
                />
                <Label className="text-slate-300">Amount Shine</Label>
              </div>
            </div>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Background Gradient</Label>
              <Select value={config.backgroundColor} onValueChange={(v) => setConfig({...config, backgroundColor: v})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                    {gradientOptionItems.map(grad => (
                    <SelectItem key={grad.value} value={grad.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${grad.value}`} />
                        {grad.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Position</Label>
                <Select value={config.position} onValueChange={(v) => setConfig({...config, position: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {positionOptionItems.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Duration (ms)</Label>
                <Slider
                  value={[Math.max(2000, Number(config.animationDisplayDuration ?? 5) * 1000)]}
                  onValueChange={(v) => setConfig({...config, animationDisplayDuration: Math.max(1, Math.round(v[0] / 1000))})}
                  min={2000}
                  max={10000}
                  step={500}
                  className="bg-slate-700"
                />
                <p className="text-slate-500 text-xs text-center">{Number(config.animationDisplayDuration ?? 5) * 1000}ms ({config.animationDisplayDuration ?? 5} seconds)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Background Blur</Label>
              <Select value={config.backgroundBlur} onValueChange={(v) => setConfig({...config, backgroundBlur: v})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {blurOptionItems.map(blur => (
                    <SelectItem key={blur.value} value={blur.value}>{blur.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Sound Tab */}
          <TabsContent value="sound" className="space-y-4 mt-4">
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-green-400" />
                <Label className="text-slate-300">Enable Sound</Label>
              </div>
              <Switch
                checked={config.notificationUseCustom}
                onCheckedChange={(v) => setConfig({...config, notificationUseCustom: v})}
              />
            </div>

            {config.notificationUseCustom && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Sound URL</Label>
                  <Input
                    value={config.notificationCustomSound ?? ""}
                    onChange={(e) => setConfig({...config, notificationCustomSound: e.target.value})}
                    placeholder="/sounds/donation.mp3 or https://..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-slate-500 text-xs">Leave empty to use default sound</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Volume ({Array.isArray(config.notificationVolume) ? config.notificationVolume[0] : config.notificationVolume}%)</Label>
                  <Slider
                    value={Array.isArray(config.notificationVolume) ? config.notificationVolume : [config.notificationVolume ?? 70]}
                    onValueChange={(v) => setConfig({...config, notificationVolume: v})}
                    max={100}
                    step={1}
                    className="bg-slate-700"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.soundLoop}
                    onCheckedChange={(v) => setConfig({...config, soundLoop: v})}
                  />
                  <Label className="text-slate-300">Loop Sound</Label>
                </div>
              </>
            )}
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-4 mt-4">
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Droplet className="w-5 h-5 text-indigo-400" />
                <Label className="text-slate-300">Show Confetti</Label>
              </div>
              <Switch
                checked={config.showConfetti}
                onCheckedChange={(v) => setConfig({...config, showConfetti: v})}
              />
            </div>

            {config.showConfetti && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 sm:pl-8">
                <div className="space-y-2">
                  <Label className="text-slate-300">Confetti Mode</Label>
                  <Select value={config.confettiMode ?? "classic"} onValueChange={(v) => setConfig({...config, confettiMode: v})}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {confettiModeOptionItems.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Confetti Type</Label>
                  <Select value={config.confettiEffect} onValueChange={(v) => setConfig({...config, confettiEffect: v})}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {confettiOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <Label className="text-slate-300">Particle Effect</Label>
              </div>
              <Switch
                checked={config.particleEffect}
                onCheckedChange={(v) => setConfig({...config, particleEffect: v})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Custom CSS (Advanced)</Label>
              <textarea
                value={config.customCSS}
                onChange={(e) => setConfig({...config, customCSS: e.target.value})}
                placeholder=".donation-alert { /* custom styles */ }"
                className="w-full h-24 bg-slate-800 border-slate-700 text-white rounded-lg p-2 font-mono text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Section */}
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            Live Preview
          </h4>
          <div className={`p-4 rounded-lg bg-gradient-to-r ${config.backgroundColor} ${config.backgroundBlur}`}>
            <div className="flex items-center gap-3">
              {config.image && (
                <img 
                  src={config.image} 
                  alt="Preview" 
                  className={`${config.imageSize === 'sm' ? 'w-10 h-10' : config.imageSize === 'md' ? 'w-12 h-12' : config.imageSize === 'lg' ? 'w-16 h-16' : 'w-20 h-20'} ${config.imageShape === 'circle' ? 'rounded-full' : config.imageShape === 'rounded' ? 'rounded-lg' : ''}`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div>
                <p className={`font-bold ${config.titleFontSizeClass}`} style={{ color: config.titleMainColor, fontFamily: config.titleFontFamily }}>
                  🎉 {config.name || "New Donation"}!
                </p>
                <p className={`text-lg`} style={{ color: config.titleMainColor }}>
                  ฿{config.minAmount} - ฿{config.maxAmount}
                </p>
              </div>
            </div>
            {config.showConfetti && <div className="text-xs mt-2 text-white/70">🎊 Confetti will appear</div>}
            {config.notificationUseCustom && <div className="text-xs mt-1 text-white/70">🔊 Sound enabled</div>}
          </div>
        </div>

        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
          <div className="flex gap-2 mr-auto">
            {range?.id && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(config.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate(config)}
                >
                  <Copy className="w-4 h-4 mr-2" /> Duplicate
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetConfig}
              disabled={isResetting}
              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
              Reset All Settings
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500">
              {range?.id ? "Save Changes" : "Create Range"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

RangeConfigModal.propTypes = {
  range: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
