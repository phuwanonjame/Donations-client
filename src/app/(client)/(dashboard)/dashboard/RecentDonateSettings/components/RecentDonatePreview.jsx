"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  RECENT_DONATE_THEME_BACKGROUNDS,
  RECENT_DONATE_THEME_PRESETS,
} from '../constants/recentDonateOptions';

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

const cardStyleClass = {
  glass: 'border-white/10 bg-slate-950/55 backdrop-blur-md',
  neon: 'border-purple-400/60 bg-slate-950/70 shadow-[0_0_28px_rgba(139,92,246,0.32)]',
  gradient: 'border-white/10 bg-gradient-to-r from-slate-950/80 to-indigo-950/70',
  minimal: 'border-slate-700 bg-slate-900',
  flat: 'border-transparent bg-slate-800',
};

const layoutClass = {
  list: 'space-y-3',
  compact: 'space-y-2',
  spotlight: 'grid gap-3',
  split: 'space-y-3',
};

const positionClass = {
  'top-left': 'items-start justify-start',
  'top-center': 'items-start justify-center',
  'top-right': 'items-start justify-end',
  'middle-left': 'items-center justify-start',
  center: 'items-center justify-center',
  'middle-right': 'items-center justify-end',
  'bottom-left': 'items-end justify-start',
  'bottom-center': 'items-end justify-center',
  'bottom-right': 'items-end justify-end',
};

const getAnimationInitial = (type) => {
  const map = {
    fade: { opacity: 0 },
    'slide-left': { opacity: 0, x: -28 },
    'slide-right': { opacity: 0, x: 28 },
    'slide-up': { opacity: 0, y: 24 },
    pop: { opacity: 0, scale: 0.92 },
  };
  return map[type] || map.fade;
};

export default function RecentDonatePreview({ settings, donations, onReset }) {
  const maxEntries = getNumberValue(settings.maxEntries, 5);
  const visibleDonations = donations.slice(0, maxEntries);
  const itemSpacing = getNumberValue(settings.itemSpacing, 12);
  const radius = getNumberValue(settings.borderRadius, 16);
  const borderWidth = settings.borderEnabled ? getNumberValue(settings.borderWidth, 1) : 0;
  const shadowBlur = settings.shadowEnabled ? getNumberValue(settings.shadowBlur, 20) : 0;
  const padding = getNumberValue(settings.padding, 16);
  const widgetWidth = getNumberValue(settings.widgetWidth, 320);
  const widgetHeight = getNumberValue(settings.widgetHeight, 420);
  const animationDuration = getNumberValue(settings.animationDuration, 700) / 1000;
  const animationSpeed = Math.max(0.2, getNumberValue(settings.animationSpeed, 50) / 50);
  const previewPosition = positionClass[settings.position] || positionClass.center;
  const selectedPreset = RECENT_DONATE_THEME_PRESETS.find((preset) => preset.id === settings.themePreset);
  const fallbackBackground = RECENT_DONATE_THEME_BACKGROUNDS['streamflow-night'];
  const presetBackground = RECENT_DONATE_THEME_BACKGROUNDS[settings.themePreset] || fallbackBackground;
  const background = selectedPreset?.imageUrl
    ? `linear-gradient(180deg, rgba(2,6,23,.22), rgba(2,6,23,.7)), url("${selectedPreset.imageUrl}"), ${settings.backgroundColor || '#050827'}`
    : `${presetBackground}, ${settings.backgroundColor || '#050827'}`;

  const nameStyle = {
    color: settings.lastDonatorColor ?? settings.textColor,
    fontSize: `${getNumberValue(settings.lastDonatorFontSize, 14)}px`,
    fontFamily: settings.lastDonatorFontFamily,
    fontWeight: settings.lastDonatorFontWeight,
    ...getTextStrokeStyle(settings.lastDonatorStrokeWidth, settings.lastDonatorStrokeColor),
  };
  const amountStyle = {
    color: settings.amountColor ?? settings.accentColor,
    fontSize: `${getNumberValue(settings.amountFontSize, 18)}px`,
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

      <div className={`flex min-h-[460px] overflow-auto rounded-xl border border-slate-700/50 bg-slate-950/70 p-4 ${previewPosition}`}>
        {settings.customCss && <style>{settings.customCss}</style>}
        <div
          className="overflow-hidden rounded-xl border border-slate-700/50"
          style={{
            width: widgetWidth,
            minHeight: widgetHeight,
            flex: '0 0 auto',
            maxWidth: widgetWidth > 640 ? 'none' : '100%',
            background,
            backgroundSize: selectedPreset?.imageUrl ? 'cover' : undefined,
            backgroundPosition: selectedPreset?.imageUrl ? 'center' : undefined,
            padding,
            backdropFilter: settings.backgroundBlur ? `blur(${getNumberValue(settings.backgroundBlurAmount, 10)}px)` : undefined,
          }}
        >
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,.9)]" />
            LIVE
            <span className="ml-3 text-slate-200">{settings.title}</span>
          </div>

          <div
            className={layoutClass[settings.layoutStyle] || layoutClass.list}
            style={{ gap: itemSpacing }}
          >
            {visibleDonations.map((donation, index) => (
              <motion.div
                key={donation.id || `${donation.name}-${index}`}
                initial={getAnimationInitial(settings.animationType)}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{ delay: index * 0.08, duration: animationDuration / animationSpeed }}
                className={`donation-item flex items-center gap-3 border ${cardStyleClass[settings.cardStyle] || cardStyleClass.glass}`}
                style={{
                  borderRadius: radius,
                  borderColor: settings.borderEnabled ? settings.borderColor : 'transparent',
                  borderWidth,
                  boxShadow: shadowBlur ? `0 0 ${shadowBlur}px rgba(139,92,246,.24)` : 'none',
                  padding: settings.layoutStyle === 'compact' ? '8px 10px' : '12px',
                  backdropFilter: settings.backgroundBlur ? `blur(${getNumberValue(settings.backgroundBlurAmount, 10)}px)` : undefined,
                }}
              >
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border font-bold text-white shadow-[0_0_16px_rgba(139,92,246,.35)]"
                  style={{ borderColor: settings.accentColor, background: 'rgba(15,23,42,.75)' }}
                >
                  {donation.name?.[0] ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    {settings.showName && (
                      <div className="min-w-0">
                        <p className="truncate" style={nameStyle}>{donation.name}</p>
                        {settings.showTime && (
                          <p className="text-xs text-slate-300">{donation.time}</p>
                        )}
                      </div>
                    )}
                    {settings.showAmount && (
                      <p className="shrink-0 text-right" style={amountStyle}>{donation.amount}</p>
                    )}
                  </div>
                  {settings.showMessage && (
                    <p className="mt-1 line-clamp-2 text-xs" style={{ color: settings.textColor }}>
                      {donation.message || settings.messagePlaceholder}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">Background Template (OBS Preview)</Label>
        <div className="grid grid-cols-5 gap-2">
          <button className="flex aspect-video flex-col items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-900 text-[10px] text-slate-400">
            <Plus className="mb-1 h-4 w-4" />
            Upload
          </button>
          {RECENT_DONATE_THEME_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className={`aspect-video rounded-lg border ${settings.themePreset === preset.id ? 'border-purple-400' : 'border-slate-700'}`}
              style={{
                background: preset.imageUrl
                  ? `linear-gradient(180deg, rgba(2,6,23,.08), rgba(2,6,23,.38)), url("${preset.imageUrl}")`
                  : preset.preview || preset.background,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
