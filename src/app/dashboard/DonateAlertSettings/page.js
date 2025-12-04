"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Image, 
  Volume2, 
  Type, 
  Clock, 
  Palette,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Copy,
  Music,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const alertSounds = [
  { id: 'chime', name: 'Chime' },
  { id: 'cash', name: 'Cash Register' },
  { id: 'bell', name: 'Bell Ring' },
  { id: 'fanfare', name: 'Fanfare' },
  { id: 'magic', name: 'Magic Sparkle' },
  { id: 'custom', name: 'Custom Upload' },
];

const animationStyles = [
  { id: 'fade', name: 'Fade In' },
  { id: 'slide', name: 'Slide Down' },
  { id: 'bounce', name: 'Bounce' },
  { id: 'zoom', name: 'Zoom In' },
  { id: 'flip', name: 'Flip' },
];

const fontOptions = [
  { id: 'default', name: 'Default (Kanit)' },
  { id: 'prompt', name: 'Prompt' },
  { id: 'sarabun', name: 'Sarabun' },
  { id: 'noto', name: 'Noto Sans Thai' },
];

export default function DonateAlertSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    volume: [75],
    duration: [5],
    textSize: [24],
    alertSound: 'chime',
    animation: 'bounce',
    font: 'default',
    textColor: '#00d4ff',
    backgroundColor: 'transparent',
    showAmount: true,
    showMessage: true,
    showName: true,
    prefixText: '🎉',
    suffixText: 'donated!',
    minAmountForAlert: 1,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Donate Alert Settings</h2>
              <p className="text-slate-400">Customize how donation alerts appear on your stream</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => updateSetting('enabled', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
            <span className={settings.enabled ? 'text-cyan-400' : 'text-slate-500'}>
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="xl:col-span-2 space-y-6">
          <Tabs defaultValue="media" className="w-full">
            <TabsList className="w-full bg-slate-800/80 p-1 rounded-xl">
              <TabsTrigger value="media" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500">
                <Image className="w-4 h-4 mr-2" />
                Media
              </TabsTrigger>
              <TabsTrigger value="sound" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500">
                <Volume2 className="w-4 h-4 mr-2" />
                Sound
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500">
                <Type className="w-4 h-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="display" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500">
                <Sparkles className="w-4 h-4 mr-2" />
                Display
              </TabsTrigger>
            </TabsList>

            {/* Media Tab */}
            <TabsContent value="media" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-cyan-400" />
                    Alert Image / GIF
                  </h3>
                  
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Upload Image or GIF</p>
                    <p className="text-slate-500 text-sm mb-4">Supports PNG, JPG, GIF (Max 5MB)</p>
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center cursor-pointer hover:border-cyan-500/30 transition-colors">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white text-sm">Default Alert</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center cursor-pointer hover:border-cyan-500/30 transition-colors">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-3 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white text-sm">Premium Alert</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Sound Tab */}
            <TabsContent value="sound" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5 text-cyan-400" />
                    Alert Sound
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Sound Effect</Label>
                      <Select value={settings.alertSound} onValueChange={(v) => updateSetting('alertSound', v)}>
                        <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {alertSounds.map(sound => (
                            <SelectItem key={sound.id} value={sound.id} className="text-white hover:bg-slate-700">
                              {sound.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <Button
                        size="icon"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm">0:03</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Volume
                    </Label>
                    <span className="text-cyan-400 font-medium">{settings.volume}%</span>
                  </div>
                  <Slider
                    value={settings.volume}
                    onValueChange={(v) => updateSetting('volume', v)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-white font-medium text-sm">Upload Custom Sound</p>
                  <p className="text-slate-500 text-xs">MP3, WAV (Max 2MB)</p>
                </div>
              </motion.div>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    Message Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Prefix Text</Label>
                      <Input
                        value={settings.prefixText}
                        onChange={(e) => updateSetting('prefixText', e.target.value)}
                        placeholder="🎉"
                        className="bg-slate-800/80 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Suffix Text</Label>
                      <Input
                        value={settings.suffixText}
                        onChange={(e) => updateSetting('suffixText', e.target.value)}
                        placeholder="donated!"
                        className="bg-slate-800/80 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-slate-300">Text Size</Label>
                    <span className="text-cyan-400 font-medium">{settings.textSize}px</span>
                  </div>
                  <Slider
                    value={settings.textSize}
                    onValueChange={(v) => updateSetting('textSize', v)}
                    min={12}
                    max={48}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Font Family</Label>
                    <Select value={settings.font} onValueChange={(v) => updateSetting('font', v)}>
                      <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {fontOptions.map(font => (
                          <SelectItem key={font.id} value={font.id} className="text-white hover:bg-slate-700">
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.textColor}
                        onChange={(e) => updateSetting('textColor', e.target.value)}
                        className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
                      />
                      <Input
                        value={settings.textColor}
                        onChange={(e) => updateSetting('textColor', e.target.value)}
                        className="flex-1 bg-slate-800/80 border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-300">Display Options</Label>
                  <div className="space-y-3">
                    {[
                      { key: 'showName', label: 'Show Donor Name' },
                      { key: 'showAmount', label: 'Show Donation Amount' },
                      { key: 'showMessage', label: 'Show Donation Message' },
                    ].map(option => (
                      <div key={option.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <span className="text-white">{option.label}</span>
                        <Switch
                          checked={settings[option.key]}
                          onCheckedChange={(v) => updateSetting(option.key, v)}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Display Tab */}
            <TabsContent value="display" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Animation & Timing
                  </h3>

                  <div className="space-y-2 mb-6">
                    <Label className="text-slate-300">Animation Style</Label>
                    <Select value={settings.animation} onValueChange={(v) => updateSetting('animation', v)}>
                      <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {animationStyles.map(anim => (
                          <SelectItem key={anim.id} value={anim.id} className="text-white hover:bg-slate-700">
                            {anim.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Display Duration
                      </Label>
                      <span className="text-cyan-400 font-medium">{settings.duration}s</span>
                    </div>
                    <Slider
                      value={settings.duration}
                      onValueChange={(v) => updateSetting('duration', v)}
                      min={3}
                      max={15}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Minimum Amount for Alert (฿)</Label>
                  <Input
                    type="number"
                    value={settings.minAmountForAlert}
                    onChange={(e) => updateSetting('minAmountForAlert', parseInt(e.target.value) || 1)}
                    min={1}
                    className="bg-slate-800/80 border-slate-700 text-white"
                  />
                  <p className="text-slate-500 text-sm">Donations below this amount won't trigger an alert</p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 sticky top-24"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <RotateCcw className="w-4 h-4 mr-2" />
                Test
              </Button>
            </div>

            {/* Preview Area */}
            <div className="aspect-video bg-slate-900 rounded-xl border border-slate-700/50 flex items-center justify-center mb-4 overflow-hidden">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto mb-4 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-white" />
                </div>
                <p style={{ color: settings.textColor, fontSize: `${settings.textSize[0]}px` }} className="font-bold">
                  {settings.prefixText} Supporter {settings.suffixText}
                </p>
                {settings.showAmount && (
                  <p className="text-2xl font-bold text-white mt-2">฿100</p>
                )}
                {settings.showMessage && (
                  <p className="text-slate-400 mt-2">"Great stream!"</p>
                )}
              </motion.div>
            </div>

            {/* Widget URL */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">Widget URL</Label>
              <div className="flex gap-2">
                <Input
                  value="https://easydonate.app/w/alert/abc123"
                  readOnly
                  className="bg-slate-800/80 border-slate-700 text-cyan-400 font-mono text-sm"
                />
                <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                Save Settings
              </Button>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}