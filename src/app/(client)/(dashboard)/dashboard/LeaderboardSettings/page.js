"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Eye, RotateCcw, Trophy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import LeaderboardPreview from './components/LeaderboardPreview';
import LeaderboardSettingsForm from './components/LeaderboardSettingsForm';
import { defaultSettings, toMetadata } from './constants/donate-leaderboard';

export default function LeaderboardSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY < 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
  };

  const handleSave = () => {
    const payload = toMetadata(settings);
    console.log('🏆 Leaderboard Payload:', JSON.stringify(payload, null, 2));
    alert('Settings saved! Check console for payload.');
    // TODO: ส่ง payload ไปยัง API
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className={`overflow-hidden transition-all duration-300 ease-out ${showHeader ? 'max-h-[999px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 p-4 sm:p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Leaderboard Settings</h2>
                <p className="text-slate-400 text-sm sm:text-base">Show top supporters ranking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.enabled}
                onCheckedChange={(v) => updateSetting('enabled', v)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-500"
              />
              <span className={`text-sm sm:text-base ${settings.enabled ? 'text-amber-400' : 'text-slate-500'}`}>
                {settings.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1 min-w-0">
                <Label className="text-slate-400 text-xs uppercase tracking-[0.2em]">Widget URL</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value="https://easydonate.app/w/leaderboard/abc123"
                    readOnly
                    className="flex-1 bg-transparent border border-white/10 text-amber-400 font-mono text-xs sm:text-sm focus:border-amber-400"
                  />
                  <Button size="icon" variant="outline" className="border-white/10 hover:border-amber-400 hover:bg-slate-800">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-sm sm:text-base py-3 px-4 shadow-lg"
                  onClick={handleSave}
                >
                  Save Settings
                </Button>
                <Button variant="outline" className="border border-white/10 text-slate-300 hover:bg-slate-800 py-3 px-4">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-[2] min-w-0">
          <div className="md:sticky md:top-6 md:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6 min-h-[55vh]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">Preview</h3>
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={resetToDefault}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              <div className="h-full">
                <LeaderboardPreview settings={settings} />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-[1] min-w-0 md:max-w-xl">
          <LeaderboardSettingsForm settings={settings} update={updateSetting} />
        </div>
      </div>
    </div>
  );
}