"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Eye, RotateCcw, Trophy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import LeaderboardPreview from './components/LeaderboardPreview';
import LeaderboardSettingsForm from './components/LeaderboardSettingsForm';
import { defaultSettings } from './constants/donate-leaderboard';

export default function LeaderboardSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="space-y-8">
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
        <div className="xl:col-span-2">
          <LeaderboardSettingsForm settings={settings} update={updateSetting} />
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 sticky top-24"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={resetToDefault}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <LeaderboardPreview settings={settings} />

            <div className="space-y-2 mt-4">
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