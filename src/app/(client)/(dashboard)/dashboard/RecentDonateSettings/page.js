"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RecentDonateSettingsForm from './components/RecentDonateSettingsForm';
import RecentDonatePreview from './components/RecentDonatePreview';
import { getDefaultSettings, generateWidgetUrl, getDefaultRecentDonations } from './constants/recentDonateOptions';

export default function RecentDonateSettingsPage() {
  const [settings, setSettings] = useState(getDefaultSettings());
  const [donations, setDonations] = useState(getDefaultRecentDonations());
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY < 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateDonation(index, key, value) {
    setDonations((prev) =>
      prev.map((donation, donationIndex) =>
        donationIndex === index ? { ...donation, [key]: value } : donation
      )
    );
  }

  function handleReset() {
    setSettings(getDefaultSettings());
    setDonations(getDefaultRecentDonations());
  }

  function handleSave() {
    console.log('RecentDonate Settings:', JSON.stringify({ settings, donations }, null, 2));
    alert('Settings saved! Check console for payload.');
  }

  const widgetUrl = generateWidgetUrl();

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className={`overflow-hidden transition-all duration-300 ease-out ${showHeader ? 'max-h-[999px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 border border-blue-500/20 p-4 sm:p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Donate Settings</h2>
                <p className="text-slate-400 text-sm sm:text-base">Display recent donation activity</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.enabled}
                onCheckedChange={(value) => updateSetting('enabled', value)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500"
              />
              <span className={`text-sm sm:text-base ${settings.enabled ? 'text-blue-400' : 'text-slate-500'}`}>
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
                    value={widgetUrl}
                    readOnly
                    className="flex-1 bg-transparent border border-white/10 text-blue-400 font-mono text-xs sm:text-sm focus:border-blue-400"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-white/10 hover:border-blue-400 hover:bg-slate-800"
                    onClick={() => navigator.clipboard?.writeText(widgetUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-sm sm:text-base py-3 px-4 shadow-lg"
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
              <div className="h-full">
                <RecentDonatePreview
                  settings={settings}
                  donations={donations}
                  onReset={handleReset}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-[1] min-w-0 md:max-w-xl">
          <RecentDonateSettingsForm
            settings={settings}
            updateSetting={updateSetting}
            donations={donations}
            updateDonation={updateDonation}
          />
        </div>
      </div>
    </div>
  );
}
