"use client";
import React from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Target, 
  Trophy, 
  Star, 
  Clock, 
  Gift,
  Settings,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const widgets = [
  {
    id: 'donate-alert',
    name: 'Donate Alert',
    description: 'Show animated alerts when you receive donations',
    icon: Bell,
    gradient: 'from-cyan-500 to-blue-500',
    enabled: true,
    hasSettings: true,
    settingsPage: 'DonateAlertSettings',
  },
  {
    id: 'donate-goal',
    name: 'Donate Goal',
    description: 'Display progress towards your donation goal',
    icon: Target,
    gradient: 'from-emerald-500 to-teal-500',
    enabled: false,
    hasSettings: true,
    settingsPage: 'DonateGoalSettings',
  },
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    description: 'Show top supporters ranking',
    icon: Trophy,
    gradient: 'from-amber-500 to-orange-500',
    enabled: false,
    hasSettings: true,
    settingsPage: 'LeaderboardSettings',
  },
  {
    id: 'top-donate',
    name: 'Top Donate',
    description: 'Highlight your highest donation',
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    enabled: true,
    hasSettings: true,
    settingsPage: 'TopDonateSettings',
  },
  {
    id: 'recent-donate',
    name: 'Recent Donate',
    description: 'Display recent donation activity',
    icon: Clock,
    gradient: 'from-blue-500 to-indigo-500',
    enabled: true,
    hasSettings: true,
    settingsPage: 'RecentDonateSettings',
  },
  {
    id: 'gift-alert',
    name: 'Gift Alert',
    description: 'Special alerts for gift donations',
    icon: Gift,
    gradient: 'from-rose-500 to-pink-500',
    enabled: false,
    hasSettings: true,
    settingsPage: 'GiftAlertSettings',
    isPro: true,
  },
];

export default function Widgets() {
  const [widgetStates, setWidgetStates] = React.useState(
    widgets.reduce((acc, w) => ({ ...acc, [w.id]: w.enabled }), {})
  );

  const toggleWidget = (id) => {
    setWidgetStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Stream Widgets</h2>
              <p className="text-slate-400">Customize widgets for your live streams and donation page</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview All
          </Button>
        </div>
      </motion.div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget, index) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border backdrop-blur-xl overflow-hidden transition-all duration-300 ${
              widgetStates[widget.id]
                ? 'border-cyan-500/30'
                : 'border-slate-700/50'
            }`}
          >
            {/* Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${widget.gradient} ${widgetStates[widget.id] ? 'opacity-100' : 'opacity-30'}`} />
            
            {widget.isPro && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  PRO
                </Badge>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${widget.gradient} ${widgetStates[widget.id] ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
                  <widget.icon className="w-6 h-6 text-white" />
                </div>
                <Switch
                  checked={widgetStates[widget.id]}
                  onCheckedChange={() => toggleWidget(widget.id)}
                  disabled={widget.isPro}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                />
              </div>

              <h3 className={`text-lg font-semibold mb-2 ${widgetStates[widget.id] ? 'text-white' : 'text-slate-400'} transition-colors`}>
                {widget.name}
              </h3>
              <p className="text-slate-500 text-sm mb-4">{widget.description}</p>

              <div className="flex gap-2">
                {widget.hasSettings && widget.settingsPage && (
                  <Link href={createPageUrl(widget.settingsPage)} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                )}
                {widget.hasSettings && !widget.settingsPage && (
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Widget URL Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">How to use widgets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <h4 className="text-white font-medium mb-1">Enable Widget</h4>
            <p className="text-slate-500 text-sm">Toggle on the widgets you want to use</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <h4 className="text-white font-medium mb-1">Copy Widget URL</h4>
            <p className="text-slate-500 text-sm">Get the browser source URL for OBS</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <h4 className="text-white font-medium mb-1">Add to OBS</h4>
            <p className="text-slate-500 text-sm">Paste as Browser Source in your streaming software</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}