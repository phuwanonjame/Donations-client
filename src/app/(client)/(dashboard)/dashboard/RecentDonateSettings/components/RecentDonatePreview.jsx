"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateWidgetUrl } from '../constants/recentDonateOptions';

const getNumberValue = (value, fallback = 0) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getTextStrokeStyle = (width, color) => {
  const strokeWidth = getNumberValue(width, 0);
  if (strokeWidth <= 0 || !color) return {};
  return {
    WebkitTextStroke: `${strokeWidth}px ${color}`,
    textStroke: `${strokeWidth}px ${color}`,
  };
};

const getLayoutStyles = (layoutStyle) => {
  const map = {
    list: {
      item: 'flex items-start gap-3 p-2 rounded-lg',
      avatar: 'w-8 h-8',
      content: 'flex-1 min-w-0',
      row: 'flex items-center justify-between gap-3',
      showAvatar: true,
      titleClassName: 'text-center font-bold mb-3',
    },
    compact: {
      item: 'flex items-center gap-2 px-2 py-1.5 rounded-lg',
      avatar: 'w-6 h-6',
      content: 'flex-1 min-w-0',
      row: 'flex items-center justify-between gap-2',
      showAvatar: true,
      titleClassName: 'text-left text-sm font-bold mb-2',
    },
    spotlight: {
      item: 'flex flex-col items-center gap-3 p-5 rounded-lg text-center',
      avatar: 'w-14 h-14',
      content: 'w-full min-w-0',
      row: 'flex flex-col items-center justify-center gap-2',
      showAvatar: true,
      titleClassName: 'text-center font-bold mb-4',
    },
    split: {
      item: 'grid grid-cols-[1fr_auto] items-center gap-4 p-3 rounded-lg',
      avatar: 'hidden',
      content: 'min-w-0 contents',
      row: 'contents',
      showAvatar: false,
      titleClassName: 'text-left font-bold mb-3',
    },
  };
  return map[layoutStyle] || map.list;
};

export default function RecentDonatePreview({ settings, donations, onReset }) {
  const widgetUrl = generateWidgetUrl();
  const fontSize = Array.isArray(settings.fontSize) ? settings.fontSize[0] : settings.fontSize;
  const maxEntries = Array.isArray(settings.maxEntries) ? settings.maxEntries[0] : settings.maxEntries;
  const visibleDonations = donations.slice(0, maxEntries);
  const layout = getLayoutStyles(settings.layoutStyle);

  const nameStyle = {
    color: settings.lastDonatorColor ?? settings.textColor,
    fontSize: `${getNumberValue(settings.lastDonatorFontSize, fontSize)}px`,
    fontFamily: settings.lastDonatorFontFamily,
    fontWeight: settings.lastDonatorFontWeight,
    ...getTextStrokeStyle(settings.lastDonatorStrokeWidth, settings.lastDonatorStrokeColor),
  };
  const amountStyle = {
    color: settings.amountColor ?? settings.accentColor,
    fontSize: `${getNumberValue(settings.amountFontSize, fontSize)}px`,
    fontFamily: settings.amountFontFamily,
    fontWeight: settings.amountFontWeight,
    ...getTextStrokeStyle(settings.amountStrokeWidth, settings.amountStrokeColor),
  };

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
        <h4 className={layout.titleClassName} style={{ color: settings.accentColor }}>
          {settings.title}
        </h4>

        <div className="space-y-2">
          {visibleDonations.map((donation, index) => (
            <motion.div
              key={`${donation.name}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={layout.item}
              style={{ backgroundColor: `${settings.accentColor}15` }}
            >
              {layout.showAvatar && (
                <div
                  className={`${layout.avatar} rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}
                  style={{ backgroundColor: settings.accentColor, color: '#ffffff' }}
                >
                  {donation.name?.[0] ?? '?'}
                </div>
              )}
              <div className={layout.content}>
                <div
                  className={layout.row}
                >
                  {settings.showName && (
                    <span className="font-medium truncate" style={nameStyle}>
                      {donation.name}
                    </span>
                  )}
                  {settings.showAmount && (
                    <span className="shrink-0 font-semibold" style={amountStyle}>
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
