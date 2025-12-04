"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Palette, Type, Settings, Copy, Eye, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeRanges = [
  { id: 'today', name: 'Today' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'stream', name: 'This Stream' },
  { id: 'all', name: 'All Time' },
];

export default function TopDonateSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    title: 'Top Donation',
    timeRange: 'stream',
    showName: true,
    showAmount: true,
    showMessage: true,
    showIcon: true,
    accentColor: '#a855f7',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    fontSize: [18],
    iconSize: [48],
    animationStyle: 'glow',
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 border border-purple-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Top Donate Settings</h2>
              <p className="text-slate-400">Highlight your highest donation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => updateSetting('enabled', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
            />
            <span className={settings.enabled ? 'text-purple-400' : 'text-slate-500'}>
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="xl:col-span-2 space-y-6">
          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Title</Label>
                <Input
                  value={settings.title}
                  onChange={(e) => updateSetting('title', e.target.value)}
                  className="bg-slate-800/80 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Time Range</Label>
                <Select value={settings.timeRange} onValueChange={(v) => updateSetting('timeRange', v)}>
                  <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {timeRanges.map(range => (
                      <SelectItem key={range.id} value={range.id} className="text-white hover:bg-slate-700">
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {[
                { key: 'showName', label: 'Show Donor Name' },
                { key: 'showAmount', label: 'Show Amount' },
                { key: 'showMessage', label: 'Show Message' },
                { key: 'showIcon', label: 'Show Crown Icon' },
              ].map(option => (
                <div key={option.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-white">{option.label}</span>
                  <Switch
                    checked={settings[option.key]}
                    onCheckedChange={(v) => updateSetting(option.key, v)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              Appearance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <Label className="text-slate-300">Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                    className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
                  />
                  <Input
                    value={settings.backgroundColor}
                    onChange={(e) => updateSetting('backgroundColor', e.target.value)}
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

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-300">Font Size</Label>
                  <span className="text-purple-400 font-medium">{settings.fontSize}px</span>
                </div>
                <Slider
                  value={settings.fontSize}
                  onValueChange={(v) => updateSetting('fontSize', v)}
                  min={12}
                  max={32}
                  step={1}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-300">Icon Size</Label>
                  <span className="text-purple-400 font-medium">{settings.iconSize}px</span>
                </div>
                <Slider
                  value={settings.iconSize}
                  onValueChange={(v) => updateSetting('iconSize', v)}
                  min={24}
                  max={72}
                  step={4}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview */}
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
                Reset
              </Button>
            </div>

            <div className="rounded-xl p-6 text-center mb-4" style={{ backgroundColor: settings.backgroundColor }}>
              <p className="text-sm mb-2" style={{ color: settings.accentColor }}>{settings.title}</p>
              
              {settings.showIcon && (
                <div 
                  className="mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ 
                    width: `${settings.iconSize[0]}px`, 
                    height: `${settings.iconSize[0]}px`,
                    background: `linear-gradient(135deg, ${settings.accentColor}, #ec4899)`,
                    boxShadow: `0 0 30px ${settings.accentColor}50`
                  }}
                >
                  <Sparkles className="text-white" style={{ width: `${settings.iconSize[0] * 0.5}px`, height: `${settings.iconSize[0] * 0.5}px` }} />
                </div>
              )}
              
              {settings.showName && (
                <p className="font-bold" style={{ color: settings.textColor, fontSize: `${settings.fontSize[0]}px` }}>
                  SuperFan123
                </p>
              )}
              
              {settings.showAmount && (
                <p className="font-bold text-2xl mt-1" style={{ color: settings.accentColor }}>
                  ฿5,000
                </p>
              )}
              
              {settings.showMessage && (
                <p className="text-sm mt-2 opacity-80" style={{ color: settings.textColor }}>
                  "Love your content! Keep it up!"
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">Widget URL</Label>
              <div className="flex gap-2">
                <Input
                  value="https://easydonate.app/w/top/abc123"
                  readOnly
                  className="bg-slate-800/80 border-slate-700 text-purple-400 font-mono text-sm"
                />
                <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400">
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