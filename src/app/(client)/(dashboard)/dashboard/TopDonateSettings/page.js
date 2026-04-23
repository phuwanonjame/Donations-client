"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Eye, RotateCcw, Sparkles } from 'lucide-react';
import TopDonateSettingsForm from './components/TopDonateSettingsForm';
import TopDonatePreview      from './components/TopDonatePreview';
import { getDefaultSettings, generateWidgetUrl } from './constants/topDonateOptions';

const DEFAULT_DONOR = {
  name:    'SuperFan123',
  amount:  '฿5,000',
  message: 'Love your content! Keep it up!',
};

export default function TopDonatePage() {
  const [settings,   setSettings]   = useState(getDefaultSettings());
  const [donorData,  setDonorData]  = useState(DEFAULT_DONOR);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY < 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  function updateDonor(key, value) {
    setDonorData(prev => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setSettings(getDefaultSettings());
    setDonorData(DEFAULT_DONOR);
  }

  function handleSave() {
    console.log('⭐ TopDonate Settings:', JSON.stringify(settings, null, 2));
    alert('Settings saved! Check console for payload.');
    // TODO: ส่ง payload ไปยัง API
  }

  const widgetUrl = generateWidgetUrl();

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

      {/* Header scroll-aware */}
      <div className={`overflow-hidden transition-all duration-300 ease-out ${showHeader ? 'max-h-[999px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-violet-500/10 border border-purple-500/20 p-4 sm:p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Top Donate Settings</h2>
                <p className="text-slate-400 text-sm sm:text-base">Show top donor of the stream</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.enabled}
                onCheckedChange={(v) => updateSetting('enabled', v)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
              />
              <span className={`text-sm sm:text-base ${settings.enabled ? 'text-purple-400' : 'text-slate-500'}`}>
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
                    className="flex-1 bg-transparent border border-white/10 text-purple-400 font-mono text-xs sm:text-sm focus:border-purple-400"
                  />
                  <Button
                    size="icon" variant="outline"
                    className="border-white/10 hover:border-purple-400 hover:bg-slate-800"
                    onClick={() => navigator.clipboard?.writeText(widgetUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-sm sm:text-base py-3 px-4 shadow-lg"
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

      {/* Body: Preview sticky ซ้าย + Form ขวา */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Preview sticky */}
        <div className="flex-[2] min-w-0">
          <div className="md:sticky md:top-6 md:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6 min-h-[55vh]"
            >
             
              <div className="h-full">
                <TopDonatePreview
                  settings={settings}
                  donorData={donorData}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-[1] min-w-0 md:max-w-xl">
          <TopDonateSettingsForm
            settings={settings}
            updateSetting={updateSetting}
            donorData={donorData}
            updateDonor={updateDonor}
          />
        </div>

      </div>
    </div>
  );
}