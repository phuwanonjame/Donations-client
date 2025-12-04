"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Palette, Settings, Copy, Eye, RotateCcw } from 'lucide-react';
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

const sampleDonations = [
  { name: 'Viewer123', amount: 100, time: '2 min ago', message: 'Great stream!' },
  { name: 'SupporterX', amount: 50, time: '5 min ago', message: '' },
  { name: 'FanGirl', amount: 200, time: '8 min ago', message: 'Love your content' },
];

export default function RecentDonateSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    title: 'Recent Donations',
    maxEntries: [5],
    showName: true,
    showAmount: true,
    showTime: true,
    showMessage: false,
    autoScroll: true,
    scrollSpeed: [3],
    accentColor: '#3b82f6',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    fontSize: [14],
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
        className="rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Donate Settings</h2>
              <p className="text-slate-400">Display recent donation activity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => updateSetting('enabled', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500"
            />
            <span className={settings.enabled ? 'text-blue-400' : 'text-slate-500'}>
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
              <Settings className="w-5 h-5 text-blue-400" />
              Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Title</Label>
                <Input
                  value={settings.title}
                  onChange={(e) => updateSetting('title', e.target.value)}
                  className="bg-slate-800/80 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Max Entries</Label>
                  <span className="text-blue-400 font-medium">{settings.maxEntries}</span>
                </div>
                <Slider
                  value={settings.maxEntries}
                  onValueChange={(v) => updateSetting('maxEntries', v)}
                  min={3}
                  max={10}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'showName', label: 'Show Donor Name' },
                { key: 'showAmount', label: 'Show Amount' },
                { key: 'showTime', label: 'Show Time Ago' },
                { key: 'showMessage', label: 'Show Message' },
                { key: 'autoScroll', label: 'Auto Scroll' },
              ].map(option => (
                <div key={option.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-white">{option.label}</span>
                  <Switch
                    checked={settings[option.key]}
                    onCheckedChange={(v) => updateSetting(option.key, v)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500"
                  />
                </div>
              ))}
            </div>

            {settings.autoScroll && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-300">Scroll Speed</Label>
                  <span className="text-blue-400 font-medium">{settings.scrollSpeed}s</span>
                </div>
                <Slider
                  value={settings.scrollSpeed}
                  onValueChange={(v) => updateSetting('scrollSpeed', v)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            )}
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-400" />
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-300">Font Size</Label>
                <span className="text-blue-400 font-medium">{settings.fontSize}px</span>
              </div>
              <Slider
                value={settings.fontSize}
                onValueChange={(v) => updateSetting('fontSize', v)}
                min={10}
                max={24}
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

            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: settings.backgroundColor }}>
              <h4 className="text-center font-bold mb-3" style={{ color: settings.accentColor }}>
                {settings.title}
              </h4>
              
              <div className="space-y-2">
                {sampleDonations.map((donation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ backgroundColor: `${settings.accentColor}15` }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: settings.accentColor, color: 'white' }}>
                      {donation.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        {settings.showName && (
                          <span className="font-medium truncate" style={{ color: settings.textColor, fontSize: `${settings.fontSize[0]}px` }}>
                            {donation.name}
                          </span>
                        )}
                        {settings.showAmount && (
                          <span style={{ color: settings.accentColor }}>฿{donation.amount}</span>
                        )}
                      </div>
                      {settings.showTime && (
                        <span className="text-xs opacity-60" style={{ color: settings.textColor }}>{donation.time}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">Widget URL</Label>
              <div className="flex gap-2">
                <Input
                  value="https://easydonate.app/w/recent/abc123"
                  readOnly
                  className="bg-slate-800/80 border-slate-700 text-blue-400 font-mono text-sm"
                />
                <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400">
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