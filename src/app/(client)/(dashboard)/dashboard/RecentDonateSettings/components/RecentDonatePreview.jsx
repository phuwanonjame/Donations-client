"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateWidgetUrl } from '../constants/recentDonateOptions';

export default function RecentDonatePreview({ settings, donations, onReset }) {
  const widgetUrl = generateWidgetUrl();
  const fontSize = Array.isArray(settings.fontSize) ? settings.fontSize[0] : settings.fontSize;
  const maxEntries = Array.isArray(settings.maxEntries) ? settings.maxEntries[0] : settings.maxEntries;
  const visibleDonations = donations.slice(0, maxEntries);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: settings.backgroundColor }}>
        <h4 className="text-center font-bold mb-3" style={{ color: settings.accentColor }}>
          {settings.title}
        </h4>

        <div className="space-y-2">
          {visibleDonations.map((donation, index) => (
            <motion.div
              key={`${donation.name}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-2 rounded-lg"
              style={{ backgroundColor: `${settings.accentColor}15` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: settings.accentColor, color: '#ffffff' }}
              >
                {donation.name?.[0] ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  {settings.showName && (
                    <span className="font-medium truncate" style={{ color: settings.textColor, fontSize: `${fontSize}px` }}>
                      {donation.name}
                    </span>
                  )}
                  {settings.showAmount && (
                    <span className="shrink-0 font-semibold" style={{ color: settings.accentColor }}>
                      {donation.amount}
                    </span>
                  )}
                </div>
                {settings.showTime && (
                  <div className="text-xs opacity-60 mt-0.5" style={{ color: settings.textColor }}>
                    {donation.time}
                  </div>
                )}
                {settings.showMessage && donation.message && (
                  <p className="text-xs mt-1 opacity-80 line-clamp-2" style={{ color: settings.textColor }}>
                    {donation.message}
                  </p>
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
            value={widgetUrl}
            readOnly
            className="bg-slate-800/80 border-slate-700 text-blue-400 font-mono text-sm"
          />
          <Button
            size="icon"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            onClick={() => navigator.clipboard?.writeText(widgetUrl)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
