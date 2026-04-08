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
import { toast } from 'react-hot-toast';

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
  imageUrl: "",
  imageSize: "md",
  imageShape: "circle",
  imageGlow: false,
  
  // Sound Settings - Empty/Default
  soundEnabled: false,
  soundUrl: "",
  soundVolume: 70,
  soundLoop: false,
  
  // Text Settings - Empty/Default
  textEffect: "realistic_look",
  textColor: "#ffffff",
  textShadow: false,
  textGlow: false,
  amountShine: false,
  fontFamily: "Inter",
  fontSize: "text-2xl",
  
  // Display Settings - Empty/Default
  backgroundColor: "from-purple-500 to-pink-500",
  backgroundBlur: "backdrop-blur-md",
  animationStyle: "slide-up",
  duration: 5000,
  position: "top-center",
  
  // Effects - Empty/Default
  showConfetti: false,
  confettiEffect: "fountain",
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
      return { ...range };
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
      toast.error("Please enter a range name");
      return;
    }
    if (config.minAmount >= config.maxAmount) {
      toast.error("Minimum amount must be less than maximum amount");
      return;
    }
    onSave(config);
  };

  // รีเซ็ต config ใหม่ทั้งหมด (เหมือนสร้าง range ใหม่)
  const handleResetConfig = () => {
    if (window.confirm("Are you sure you want to reset all settings for this range? This will clear all configured values.")) {
      setIsResetting(true);
      setConfig(getEmptyRangeConfig());
      setTimeout(() => setIsResetting(false), 500);
      toast.success("Range settings reset to empty. You can now configure from scratch.");
    }
  };

  const textEffects = [
    { value: "realistic_look", label: "Realistic Look" },
    { value: "glow", label: "Glow Effect" },
    { value: "shadow", label: "Shadow Effect" },
    { value: "neon", label: "Neon Effect" },
    { value: "none", label: "No Effect" }
  ];

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Poppins", label: "Poppins" },
    { value: "Roboto", label: "Roboto" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Prompt", label: "Prompt" }
  ];

  const fontSizeOptions = [
    { value: "text-sm", label: "Small" },
    { value: "text-base", label: "Medium" },
    { value: "text-xl", label: "Large" },
    { value: "text-2xl", label: "Extra Large" },
    { value: "text-4xl", label: "Huge" }
  ];

  const gradientOptions = [
    { value: "from-purple-500 to-pink-500", label: "Purple to Pink" },
    { value: "from-blue-500 to-cyan-500", label: "Blue to Cyan" },
    { value: "from-green-500 to-emerald-500", label: "Green to Emerald" },
    { value: "from-orange-500 to-red-500", label: "Orange to Red" },
    { value: "from-yellow-500 to-amber-500", label: "Yellow to Amber" },
    { value: "from-indigo-500 to-purple-500", label: "Indigo to Purple" }
  ];

  const animationOptions = [
    { value: "slide-up", label: "Slide Up" },
    { value: "slide-down", label: "Slide Down" },
    { value: "fade-in", label: "Fade In" },
    { value: "scale", label: "Scale" },
    { value: "bounce", label: "Bounce" },
    { value: "flip", label: "Flip" }
  ];

  const positionOptions = [
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
    { value: "center", label: "Center" },
    { value: "bottom-center", label: "Bottom Center" }
  ];

  const imageSizeOptions = [
    { value: "sm", label: "Small (40px)" },
    { value: "md", label: "Medium (60px)" },
    { value: "lg", label: "Large (80px)" },
    { value: "xl", label: "Extra Large (100px)" }
  ];

  const imageShapeOptions = [
    { value: "circle", label: "Circle" },
    { value: "rounded", label: "Rounded" },
    { value: "square", label: "Square" }
  ];

  const confettiOptions = [
    { value: "fountain", label: "Fountain (Shooting upward)" },
    { value: "rain", label: "Rain (Falling from top)" },
    { value: "spiral", label: "Spiral (Spinning around)" },
    { value: "blast", label: "Blast (Explosive burst)" }
  ];

  const blurOptions = [
    { value: "backdrop-blur-none", label: "No Blur" },
    { value: "backdrop-blur-sm", label: "Light Blur" },
    { value: "backdrop-blur-md", label: "Medium Blur" },
    { value: "backdrop-blur-lg", label: "Heavy Blur" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
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
        <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="col-span-2 space-y-2">
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
          <TabsList className="grid w-full grid-cols-6 bg-slate-800">
            <TabsTrigger value="basic" className="text-slate-300 data-[state=active]:bg-slate-700">Basic</TabsTrigger>
            <TabsTrigger value="media" className="text-slate-300 data-[state=active]:bg-slate-700">Media</TabsTrigger>
            <TabsTrigger value="text" className="text-slate-300 data-[state=active]:bg-slate-700">Text</TabsTrigger>
            <TabsTrigger value="display" className="text-slate-300 data-[state=active]:bg-slate-700">Display</TabsTrigger>
            <TabsTrigger value="sound" className="text-slate-300 data-[state=active]:bg-slate-700">Sound</TabsTrigger>
            <TabsTrigger value="effects" className="text-slate-300 data-[state=active]:bg-slate-700">Effects</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
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
              <Select value={config.textEffect} onValueChange={(v) => setConfig({...config, textEffect: v})}>
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
                  {animationOptions.map(anim => (
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
                value={config.imageUrl}
                onChange={(e) => setConfig({...config, imageUrl: e.target.value})}
                placeholder="https://example.com/image.gif or leave empty for default"
                className="bg-slate-800 border-slate-700 text-white"
              />
              <p className="text-slate-500 text-xs">Leave empty to use default alert image</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Image Size</Label>
                <Select value={config.imageSize} onValueChange={(v) => setConfig({...config, imageSize: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {imageSizeOptions.map(size => (
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
                    {imageShapeOptions.map(shape => (
                      <SelectItem key={shape.value} value={shape.value}>{shape.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-fuchsia-400" />
                <Label className="text-slate-300">Image Glow Effect</Label>
              </div>
              <Switch
                checked={config.imageGlow}
                onCheckedChange={(v) => setConfig({...config, imageGlow: v})}
              />
            </div>

            {config.imageUrl && (
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Preview:</p>
                <img 
                  src={config.imageUrl} 
                  alt="Preview" 
                  className={`${config.imageSize === 'sm' ? 'w-10 h-10' : config.imageSize === 'md' ? 'w-12 h-12' : config.imageSize === 'lg' ? 'w-16 h-16' : 'w-20 h-20'} ${config.imageShape === 'circle' ? 'rounded-full' : config.imageShape === 'rounded' ? 'rounded-lg' : ''}`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => setConfig({...config, textColor: e.target.value})}
                    className="w-12 h-10 p-1 bg-slate-800 border-slate-700"
                  />
                  <Input
                    value={config.textColor}
                    onChange={(e) => setConfig({...config, textColor: e.target.value})}
                    className="flex-1 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Font Family</Label>
                <Select value={config.fontFamily} onValueChange={(v) => setConfig({...config, fontFamily: v})}>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Font Size</Label>
                <Select value={config.fontSize} onValueChange={(v) => setConfig({...config, fontSize: v})}>
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
                  checked={config.amountShine}
                  onCheckedChange={(v) => setConfig({...config, amountShine: v})}
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
                  {gradientOptions.map(grad => (
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Position</Label>
                <Select value={config.position} onValueChange={(v) => setConfig({...config, position: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {positionOptions.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Duration (ms)</Label>
                <Slider
                  value={[config.duration]}
                  onValueChange={(v) => setConfig({...config, duration: v[0]})}
                  min={2000}
                  max={10000}
                  step={500}
                  className="bg-slate-700"
                />
                <p className="text-slate-500 text-xs text-center">{config.duration}ms ({Math.floor(config.duration / 1000)} seconds)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Background Blur</Label>
              <Select value={config.backgroundBlur} onValueChange={(v) => setConfig({...config, backgroundBlur: v})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {blurOptions.map(blur => (
                    <SelectItem key={blur.value} value={blur.value}>{blur.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Sound Tab */}
          <TabsContent value="sound" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-green-400" />
                <Label className="text-slate-300">Enable Sound</Label>
              </div>
              <Switch
                checked={config.soundEnabled}
                onCheckedChange={(v) => setConfig({...config, soundEnabled: v})}
              />
            </div>

            {config.soundEnabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Sound URL</Label>
                  <Input
                    value={config.soundUrl}
                    onChange={(e) => setConfig({...config, soundUrl: e.target.value})}
                    placeholder="/sounds/donation.mp3 or https://..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-slate-500 text-xs">Leave empty to use default sound</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Volume ({config.soundVolume}%)</Label>
                  <Slider
                    value={[config.soundVolume]}
                    onValueChange={(v) => setConfig({...config, soundVolume: v[0]})}
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
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
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
              <div className="space-y-2 pl-8">
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
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
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
              {config.imageUrl && (
                <img 
                  src={config.imageUrl} 
                  alt="Preview" 
                  className={`${config.imageSize === 'sm' ? 'w-10 h-10' : config.imageSize === 'md' ? 'w-12 h-12' : config.imageSize === 'lg' ? 'w-16 h-16' : 'w-20 h-20'} ${config.imageShape === 'circle' ? 'rounded-full' : config.imageShape === 'rounded' ? 'rounded-lg' : ''}`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div>
                <p className={`font-bold ${config.fontSize}`} style={{ color: config.textColor, fontFamily: config.fontFamily }}>
                  🎉 {config.name || "New Donation"}!
                </p>
                <p className={`text-lg`} style={{ color: config.textColor }}>
                  ฿{config.minAmount} - ฿{config.maxAmount}
                </p>
              </div>
            </div>
            {config.showConfetti && <div className="text-xs mt-2 text-white/70">🎊 Confetti will appear</div>}
            {config.soundEnabled && <div className="text-xs mt-1 text-white/70">🔊 Sound enabled</div>}
          </div>
        </div>

        <DialogFooter className="mt-6">
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