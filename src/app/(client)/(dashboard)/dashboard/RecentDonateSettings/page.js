"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import RecentDonatePreview from './components/RecentDonatePreview';
import RecentDonateSettingsForm from './components/RecentDonateSettingsForm';
import WidgetUrlHeaderField from '../components/WidgetUrlHeaderField';
import {
  RecentDonateSettingsProvider,
  useRecentDonateSettings,
} from './components/context/RecentDonateSettingsProvider';
import { toMetadata } from './utils/recent-donate';

const TEST_DONATIONS = [
  { name: 'NeonFan', amount: '฿120', time: 'just now', message: 'Amazing stream!' },
  { name: 'LuckyViewer', amount: '฿250', time: 'just now', message: 'Keep going!' },
  { name: 'PixelHero', amount: '฿75', time: 'just now', message: 'Love this overlay' },
  { name: 'MoonSupport', amount: '฿500', time: 'just now', message: 'Big support!' },
];

function RecentDonateHeader({ onTestDonation }) {
  const {
    settings,
    updateSetting,
    saveSettings,
    saving,
    showHeader,
    widgetId,
  } = useRecentDonateSettings();

  const handleSave = () => saveSettings(toMetadata(settings));

  return (
    <div className={`space-y-3 overflow-hidden transition-all duration-300 ease-out ${showHeader ? 'max-h-[999px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="outline" className="h-9 w-9 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="text-sm font-semibold text-white">Widget Editor</div>
            <div className="text-xs text-slate-500">/ Recent Donations</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800" onClick={onTestDonation}>
            Test Donation
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-500" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
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

        <WidgetUrlHeaderField type="recent" widgetId={widgetId} accentClass="text-blue-400" />

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
              <Button
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-sm sm:text-base py-3 px-4 shadow-lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button variant="outline" className="border border-white/10 text-slate-300 hover:bg-slate-800 py-3 px-4">
                <Eye className="w-4 h-4" />
              </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function RecentDonateContent() {
  const {
    settings,
    donations,
    loading,
    resetSettings,
    updateSetting,
    updateDonation,
  } = useRecentDonateSettings();
  const [previewDonations, setPreviewDonations] = useState(donations);

  React.useEffect(() => {
    setPreviewDonations(donations);
  }, [donations]);

  const handleTestDonation = () => {
    setPreviewDonations((current) => {
      const nextDonation = TEST_DONATIONS[Math.floor(Math.random() * TEST_DONATIONS.length)];
      const stampedDonation = {
        ...nextDonation,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      };
      return [stampedDonation, ...current].slice(0, 10);
    });
  };

  return (
    <div className="min-h-screen bg-[#070b16] px-4 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="space-y-6 sm:space-y-8">
      <RecentDonateHeader onTestDonation={handleTestDonation} />

      {loading && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
          Loading recent donate settings...
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0">
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
                  donations={previewDonations}
                  onReset={resetSettings}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="min-w-0">
          <RecentDonateSettingsForm
            settings={settings}
            updateSetting={updateSetting}
            donations={donations}
            updateDonation={updateDonation}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

export default function RecentDonateSettingsPage() {
  return (
    <RecentDonateSettingsProvider>
      <RecentDonateContent />
    </RecentDonateSettingsProvider>
  );
}
