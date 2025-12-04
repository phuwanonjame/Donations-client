"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Palette, Type, Settings, Copy, Eye, RotateCcw } from 'lucide-react';
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

const barStyles = [
  { id: 'rounded', name: 'Rounded' },
  { id: 'square', name: 'Square' },
  { id: 'pill', name: 'Pill' },
  { id: 'gradient', name: 'Gradient Glow' },
];

export default function DonateGoalSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    goalTitle: 'New Microphone',
    goalAmount: 5000,
    currentAmount: 0,
    barColor: '#00d4ff',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    barStyle: 'rounded',
    showPercentage: true,
    showAmount: true,
    showTitle: true,
    barHeight: [24],
    fontSize: [16],
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const percentage = Math.min((settings.currentAmount / settings.goalAmount) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Donate Goal Settings</h2>
              <p className="text-slate-400">Display progress towards your donation goal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => updateSetting('enabled', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
            />
            <span className={settings.enabled ? 'text-emerald-400' : 'text-slate-500'}>
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="xl:col-span-2 space-y-6">
          {/* Goal Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Goal Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Goal Title</Label>
                <Input
                  value={settings.goalTitle}
                  onChange={(e) => updateSetting('goalTitle', e.target.value)}
                  placeholder="e.g., New Equipment"
                  className="bg-slate-800/80 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Goal Amount (฿)</Label>
                <Input
                  type="number"
                  value={settings.goalAmount}
                  onChange={(e) => updateSetting('goalAmount', parseInt(e.target.value) || 0)}
                  className="bg-slate-800/80 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Current Amount (฿)</Label>
                <Input
                  type="number"
                  value={settings.currentAmount}
                  onChange={(e) => updateSetting('currentAmount', parseInt(e.target.value) || 0)}
                  className="bg-slate-800/80 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Bar Style</Label>
                <Select value={settings.barStyle} onValueChange={(v) => updateSetting('barStyle', v)}>
                  <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {barStyles.map(style => (
                      <SelectItem key={style.id} value={style.id} className="text-white hover:bg-slate-700">
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Palette className="w-5 h-5 text-emerald-400" />
              Appearance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Bar Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.barColor}
                    onChange={(e) => updateSetting('barColor', e.target.value)}
                    className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
                  />
                  <Input
                    value={settings.barColor}
                    onChange={(e) => updateSetting('barColor', e.target.value)}
                    className="flex-1 bg-slate-800/80 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Background Color</Label>
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
                  <Label className="text-slate-300">Bar Height</Label>
                  <span className="text-emerald-400 font-medium">{settings.barHeight}px</span>
                </div>
                <Slider
                  value={settings.barHeight}
                  onValueChange={(v) => updateSetting('barHeight', v)}
                  min={12}
                  max={48}
                  step={2}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-300">Font Size</Label>
                  <span className="text-emerald-400 font-medium">{settings.fontSize}px</span>
                </div>
                <Slider
                  value={settings.fontSize}
                  onValueChange={(v) => updateSetting('fontSize', v)}
                  min={12}
                  max={32}
                  step={1}
                />
              </div>
            </div>
          </motion.div>

          {/* Display Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Display Options
            </h3>

            <div className="space-y-3">
              {[
                { key: 'showTitle', label: 'Show Goal Title' },
                { key: 'showAmount', label: 'Show Amount (Current/Goal)' },
                { key: 'showPercentage', label: 'Show Percentage' },
              ].map(option => (
                <div key={option.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-white">{option.label}</span>
                  <Switch
                    checked={settings[option.key]}
                    onCheckedChange={(v) => updateSetting(option.key, v)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                  />
                </div>
              ))}
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

            <div className="bg-slate-900 rounded-xl p-6 mb-4">
              <div className="space-y-3">
                {settings.showTitle && (
                  <p style={{ color: settings.textColor, fontSize: `${settings.fontSize[0]}px` }} className="font-bold text-center">
                    {settings.goalTitle}
                  </p>
                )}
                
                <div 
                  className="w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: settings.backgroundColor, height: `${settings.barHeight[0]}px` }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: settings.barColor, 
                      width: `${percentage}%`,
                      boxShadow: settings.barStyle === 'gradient' ? `0 0 20px ${settings.barColor}` : 'none'
                    }}
                  />
                </div>

                <div className="flex justify-between" style={{ color: settings.textColor, fontSize: `${settings.fontSize[0] - 2}px` }}>
                  {settings.showAmount && (
                    <span>฿{settings.currentAmount.toLocaleString()} / ฿{settings.goalAmount.toLocaleString()}</span>
                  )}
                  {settings.showPercentage && (
                    <span>{percentage.toFixed(1)}%</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">Widget URL</Label>
              <div className="flex gap-2">
                <Input
                  value="https://easydonate.app/w/goal/abc123"
                  readOnly
                  className="bg-slate-800/80 border-slate-700 text-emerald-400 font-mono text-sm"
                />
                <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400">
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