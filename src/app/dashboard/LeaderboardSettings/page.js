"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Palette, Users, Settings, Copy, Eye, RotateCcw, Crown, Medal } from 'lucide-react';
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

const sampleLeaderboard = [
  { rank: 1, name: 'SuperFan123', amount: 5000, icon: '👑' },
  { rank: 2, name: 'BigSupporter', amount: 3500, icon: '🥈' },
  { rank: 3, name: 'GoldenDonor', amount: 2000, icon: '🥉' },
  { rank: 4, name: 'CoolViewer', amount: 1500, icon: '' },
  { rank: 5, name: 'NicePerson', amount: 1000, icon: '' },
];

const timeRanges = [
  { id: 'today', name: 'Today' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'all', name: 'All Time' },
];

const layoutStyles = [
  { id: 'vertical', name: 'Vertical List' },
  { id: 'horizontal', name: 'Horizontal Bar' },
  { id: 'podium', name: 'Podium Style' },
];

export default function LeaderboardSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    title: 'Top Supporters',
    maxEntries: [5],
    timeRange: 'month',
    layoutStyle: 'vertical',
    showRank: true,
    showAmount: true,
    showAvatar: true,
    accentColor: '#f59e0b',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    fontSize: [14],
    animateEntries: true,
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
        className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Leaderboard Settings</h2>
              <p className="text-slate-400">Show top supporters ranking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => updateSetting('enabled', v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-500"
            />
            <span className={settings.enabled ? 'text-amber-400' : 'text-slate-500'}>
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
              <Settings className="w-5 h-5 text-amber-400" />
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
              <div className="space-y-2">
                <Label className="text-slate-300">Layout Style</Label>
                <Select value={settings.layoutStyle} onValueChange={(v) => updateSetting('layoutStyle', v)}>
                  <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {layoutStyles.map(style => (
                      <SelectItem key={style.id} value={style.id} className="text-white hover:bg-slate-700">
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Max Entries</Label>
                  <span className="text-amber-400 font-medium">{settings.maxEntries}</span>
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
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-amber-400" />
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

            <div className="space-y-3">
              {[
                { key: 'showRank', label: 'Show Rank Number' },
                { key: 'showAmount', label: 'Show Donation Amount' },
                { key: 'showAvatar', label: 'Show Avatar/Icon' },
                { key: 'animateEntries', label: 'Animate New Entries' },
              ].map(option => (
                <div key={option.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-white">{option.label}</span>
                  <Switch
                    checked={settings[option.key]}
                    onCheckedChange={(v) => updateSetting(option.key, v)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-500"
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

            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: settings.backgroundColor }}>
              <h4 className="text-center font-bold mb-4" style={{ color: settings.accentColor }}>
                {settings.title}
              </h4>
              
              <div className="space-y-2">
                {sampleLeaderboard.slice(0, settings.maxEntries[0]).map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ 
                      backgroundColor: index < 3 ? `${settings.accentColor}20` : 'transparent',
                      borderLeft: index < 3 ? `3px solid ${settings.accentColor}` : 'none'
                    }}
                  >
                    {settings.showRank && (
                      <span className="w-6 text-center font-bold" style={{ color: settings.accentColor }}>
                        {entry.icon || `#${entry.rank}`}
                      </span>
                    )}
                    {settings.showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm">
                        {entry.name[0]}
                      </div>
                    )}
                    <span className="flex-1 font-medium" style={{ color: settings.textColor, fontSize: `${settings.fontSize[0]}px` }}>
                      {entry.name}
                    </span>
                    {settings.showAmount && (
                      <span style={{ color: settings.accentColor }}>฿{entry.amount.toLocaleString()}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">Widget URL</Label>
              <div className="flex gap-2">
                <Input
                  value="https://easydonate.app/w/leaderboard/abc123"
                  readOnly
                  className="bg-slate-800/80 border-slate-700 text-amber-400 font-mono text-sm"
                />
                <Button size="icon" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400">
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