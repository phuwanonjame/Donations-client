"use client";
import React, { useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDashboardCopy } from '../../i18n';
import {
  getFontFamilyCss,
  injectFontFamily,
} from '../../DonateAlertSettings/components/utils/fontUtils';

const getNumberValue = (value, fallback = 0) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolvePreviewFontFamily = (fontValue, fallback = "'IBM Plex Sans Thai', sans-serif") => {
  if (!fontValue) return fallback;
  if (String(fontValue).includes(',') || String(fontValue).includes("'")) return fontValue;
  return getFontFamilyCss(fontValue);
};

const buildTitleStyle = (settings) => ({
  color: settings.textColor || '#F8FAFC',
  fontSize: `${getNumberValue(settings.fontSize, 16)}px`,
  fontFamily: resolvePreviewFontFamily(settings.titleFontFamily),
  fontWeight: settings.titleFontWeight || '700',
});

const buildNameStyle = (settings) => ({
  color: settings.lastDonatorColor || '#FFFFFF',
  fontSize: `${getNumberValue(settings.lastDonatorFontSize, 18)}px`,
  fontFamily: resolvePreviewFontFamily(settings.lastDonatorFontFamily),
  fontWeight: settings.lastDonatorFontWeight || '700',
});

const buildAmountStyle = (settings) => ({
  color: settings.amountColor || '#38BDF8',
  fontSize: `${getNumberValue(settings.amountFontSize, 20)}px`,
  fontFamily: resolvePreviewFontFamily(settings.amountFontFamily),
  fontWeight: settings.amountFontWeight || '700',
});

const formatAmountValue = (amount) => {
  if (amount == null) return 'THB 0';
  if (typeof amount === 'string') return amount;
  return `THB ${Number(amount).toLocaleString()}`;
};

function PlainRow({ donation, settings }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <div className="min-w-0 flex-1">
        {settings.showName && <p className="truncate leading-tight" style={buildNameStyle(settings)}>{donation.name}</p>}
        {settings.showMessage && <p className="mt-1 truncate text-xs text-slate-400">{donation.message || settings.messagePlaceholder}</p>}
      </div>
      <div className="flex flex-col items-end text-right">
        {settings.showAmount && <p className="leading-tight" style={buildAmountStyle(settings)}>{formatAmountValue(donation.amount)}</p>}
        {settings.showTime && <p className="mt-1 text-xs text-slate-400">{donation.time}</p>}
      </div>
    </div>
  );
}

function CardRow({ donation, settings, index }) {
  const cardStyle = settings.cardStyle || 'minimal';
  const radius = getNumberValue(settings.borderRadius, 16);
  const borderWidth = settings.borderEnabled ? getNumberValue(settings.borderWidth, 1) : 0;
  const shadowBlur = settings.shadowEnabled ? getNumberValue(settings.shadowBlur, 12) : 0;
  const styleMap = {
    minimal: 'border-slate-800 bg-slate-900/55',
    soft: 'border-slate-800/70 bg-slate-900/40',
    outline: 'border-slate-700/70 bg-transparent',
    plain: 'border-transparent bg-transparent',
  };

  return (
    <div
      className={`donation-item border ${styleMap[cardStyle] || styleMap.minimal}`}
      style={{
        borderRadius: radius,
        borderColor: settings.borderEnabled ? settings.borderColor : 'transparent',
        borderWidth,
        boxShadow: shadowBlur ? `0 8px ${shadowBlur}px rgba(15,23,42,.12)` : 'none',
        padding: '12px 16px',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border text-sm font-bold"
          style={{
            color: settings.accentColor || '#38BDF8',
            borderColor: `${settings.accentColor || '#38BDF8'}55`,
            background: `${settings.accentColor || '#38BDF8'}14`,
          }}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {settings.showName && <p className="truncate leading-tight" style={buildNameStyle(settings)}>{donation.name}</p>}
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                {settings.showMessage && <span className="truncate">{donation.message || settings.messagePlaceholder}</span>}
                {settings.showTime && <span>{donation.time}</span>}
              </div>
            </div>
            {settings.showAmount && (
              <div className="shrink-0 text-right">
                <p className="leading-tight" style={buildAmountStyle(settings)}>{formatAmountValue(donation.amount)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentDonatePreview({ settings, donations, onReset, onSave, saving = false }) {
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const maxEntries = getNumberValue(settings.maxEntries, 5);
  const visibleDonations = donations.slice(0, maxEntries);
  const itemSpacing = getNumberValue(settings.itemSpacing, 12);
  const padding = getNumberValue(settings.padding, 16);
  const widgetWidth = Math.min(getNumberValue(settings.widgetWidth, 520), 760);
  const isPlain = settings.cardStyle === 'plain';

  useEffect(() => {
    [settings.titleFontFamily, settings.lastDonatorFontFamily, settings.amountFontFamily].forEach((fontId) => {
      const cssFamily = resolvePreviewFontFamily(fontId);
      const familyName = cssFamily.split(',')[0]?.replace(/["']/g, '').trim();
      injectFontFamily(familyName);
    });
  }, [settings.amountFontFamily, settings.lastDonatorFontFamily, settings.titleFontFamily]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{copy.common.preview}</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500" onClick={onSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? copy.common.saving : copy.common.saveSettings}
          </Button>
          <Button size="sm" variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {copy.common.reset}
          </Button>
        </div>
      </div>

      <div className="flex justify-center overflow-auto p-4">
        {settings.customCss && <style>{settings.customCss}</style>}
        <div
          className="mx-auto w-full max-w-full"
          style={{
            width: widgetWidth,
            flex: '0 0 auto',
            padding,
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              LIVE
            </div>
            <span className="truncate text-right" style={buildTitleStyle(settings)}>{settings.title}</span>
          </div>

          <div className="grid grid-cols-[64px_1fr_132px] gap-3 border-b border-white/10 px-1 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Rank</span>
            <span>Supporter</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="mt-3 flex flex-col" style={{ gap: itemSpacing }}>
            {visibleDonations.map((donation, index) =>
              isPlain ? (
                <PlainRow key={donation.id || `${donation.name}-${index}`} donation={donation} settings={settings} />
              ) : (
                <CardRow key={donation.id || `${donation.name}-${index}`} donation={donation} settings={settings} index={index} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



