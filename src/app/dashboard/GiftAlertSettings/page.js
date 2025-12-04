"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Palette, Volume2, Settings, Copy, Eye, RotateCcw, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const giftTypes = [
  { id: 'heart', emoji: '💖', name: 'Heart', value: 10 },
  { id: 'star', emoji: '⭐', name: 'Star', value: 25 },
  { id: 'diamond', emoji: '💎', name: 'Diamond', value: 50 },
  { id: 'crown', emoji: '👑', name: 'Crown', value: 100 },
  { id: 'rocket', emoji: '🚀', name: 'Rocket', value: 200 },
  { id: 'fire', emoji: '🔥', name: 'Fire', value: 500 },
];

export default function GiftAlertSettings() {
  const [settings, setSettings] = useState({
    enabled: false,
    volume: [75],
    duration: [5],
    showGiftAnimation: true,
    showSenderName: true,
    showGiftValue: true,
    playSound: true,
    accentColor: '#ec4899',
    backgroundColor: 'transparent',
    textColor: '#ffffff',
    fontSize: [20],
  });

  const [isPro] = useState(false);

  const updateSetting = (key, value) => {
    if (!isPro) return;
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 border border-rose-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/25">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">Gift Alert Settings</h2>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  PRO
                </Badge>
              </div>
              <p className="text-slate-400">Special alerts for gift donations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => updateSetting('enabled', v)}
              disabled={!isPro}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500"
            />
            <span className={settings.enabled ? 'text-rose-400' : 'text-slate-500'}>
              {isPro ? (settings.enabled ? 'Enabled' : 'Disabled') : 'Locked'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Pro Upgrade Banner */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 p-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
              <p className="text-slate-400 mb-4">
                Gift Alert is a Pro feature. Upgrade now to unlock animated gift alerts, 
                custom sounds, and more engaging ways to celebrate your supporters!
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro - ฿199/mo
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6 ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Settings */}
        <div className="xl:col-span-2 space-y-6">
          {/* Gift Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-400" />
              Available Gifts
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {giftTypes.map((gift) => (
                <div
                  key={gift.id}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-rose-500/30 transition-colors cursor-pointer"
                >
                  <div className="text-4xl mb-2">{gift.emoji}</div>
                  <p className="text-white font-medium">{gift.name}</p>
                  <p className="text-rose-400 text-sm">฿{gift.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-rose-400" />
              Configuration
            </h3>

            <div className="space-y-3">
              {[
                { key: 'showGiftAnimation', label: 'Show Gift Animation' },
                { key: 'showSenderName', label: 'Show Sender Name' },
                { key: 'showGiftValue', label: 'Show Gift Value' },
                { key: 'playSound', label: 'Play Sound Effect' },
              ].map(option => (
                <div key={option.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-white">{option.label}</span>
                  <Switch
                    checked={settings[option.key]}
                    onCheckedChange={(v) => updateSetting(option.key, v)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Volume
                  </Label>
                  <span className="text-rose-400 font-medium">{settings.volume}%</span>
                </div>
                <Slider
                  value={settings.volume}
                  onValueChange={(v) => updateSetting('volume', v)}
                  max={100}
                  step={1}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-300">Display Duration</Label>
                  <span className="text-rose-400 font-medium">{settings.duration}s</span>
                </div>
                <Slider
                  value={settings.duration}
                  onValueChange={(v) => updateSetting('duration', v)}
                  min={3}
                  max={15}
                  step={1}
                />
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-400" />
              Appearance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
                  />
                  <Input
                    value={settings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    className="flex-1 bg-slate-800/80 border-slate-700 text-white font-mono"
                  />
                </div>
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

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-300">Font Size</Label>
                <span className="text-rose-400 font-medium">{settings.fontSize}px</span>
              </div>
              <Slider
                value={settings.fontSize}
                onValueChange={(v) => updateSetting('fontSize', v)}
                min={14}
                max={36}
                step={1}
              />
            </div>
          </motion.div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 sticky top-24"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <RotateCcw className="w-4 h-4 mr-2" />
                Test
              </Button>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 mb-4 aspect-video flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="text-6xl mb-4"
                >
                  💎
                </motion.div>
                
                {settings.showSenderName && (
                  <p className="font-bold" style={{ color: settings.textColor, fontSize: `${settings.fontSize[0]}px` }}>
                    SuperFan sent a gift!
                  </p>
                )}
                
                {settings.showGiftValue && (
                  <p className="font-bold text-xl mt-2" style={{ color: settings.accentColor }}>
                    Diamond • ฿50
                  </p>
                )}
              </motion.div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">Widget URL</Label>
              <div className="flex gap-2">
                <Input
                  value="https://easydonate.app/w/gift/abc123"
                  readOnly
                  className="bg-slate-800/80 border-slate-700 text-rose-400 font-mono text-sm"
                />
                <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400">
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