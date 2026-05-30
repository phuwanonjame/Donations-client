"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import WidgetUrlHeaderField from '../components/WidgetUrlHeaderField';
import PreviewPanel from './components/PreviewPanel';
import LeaderboardSettingsForm from './components/LeaderboardSettingsForm';
import {
  LeaderboardSettingsProvider,
  useLeaderboardSettings,
} from './components/context/LeaderboardSettingsProvider';

function LeaderboardHeader() {
  const { showHeader, widgetId } = useLeaderboardSettings();

  return (
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
        </div>
        <WidgetUrlHeaderField type="leaderboard" widgetId={widgetId} accentClass="text-amber-300" />
      </motion.div>
    </div>
  );
}

function LeaderboardContent() {
  const { loading } = useLeaderboardSettings();

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <LeaderboardHeader />

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
          Loading leaderboard settings...
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-[2] min-w-0">
            <div className="md:sticky md:top-6 md:self-start">
              <PreviewPanel />
            </div>
          </div>

          <div className="flex-[1] min-w-0 md:max-w-xl">
            <LeaderboardSettingsForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeaderboardSettingsPage() {
  return (
    <LeaderboardSettingsProvider>
      <LeaderboardContent />
    </LeaderboardSettingsProvider>
  );
}
