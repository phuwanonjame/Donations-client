"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import WidgetUrlHeaderField from '../components/WidgetUrlHeaderField';
import PreviewPanel from './components/PreviewPanel';
import TopDonateSettingsForm from './components/TopDonateSettingsForm';
import {
  TopDonateSettingsProvider,
  useTopDonateSettings,
} from './components/context/TopDonateSettingsProvider';

function TopDonateHeader() {
  const { showHeader, widgetId } = useTopDonateSettings();

  return (
    <div className={`overflow-hidden transition-all duration-300 ease-out ${showHeader ? 'max-h-[999px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-violet-500/10 p-4 sm:p-6"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg shadow-purple-500/25 sm:p-4">
              <Sparkles className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">Top Donate Settings</h2>
              <p className="text-sm text-slate-400 sm:text-base">Show top donor of the stream</p>
            </div>
          </div>
        </div>
        <WidgetUrlHeaderField type="top" widgetId={widgetId} accentClass="text-purple-300" />
      </motion.div>
    </div>
  );
}

function TopDonateContent() {
  const {
    loading,
  } = useTopDonateSettings();

  return (
    <div className="space-y-6 px-4 py-4 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <TopDonateHeader />

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
          Loading top donate settings...
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-[2]">
            <div className="md:sticky md:top-6 md:self-start">
              <PreviewPanel />
            </div>
          </div>

          <div className="min-w-0 flex-[1] md:max-w-xl">
            <TopDonateSettingsForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TopDonatePage() {
  return (
    <TopDonateSettingsProvider>
      <TopDonateContent />
    </TopDonateSettingsProvider>
  );
}
