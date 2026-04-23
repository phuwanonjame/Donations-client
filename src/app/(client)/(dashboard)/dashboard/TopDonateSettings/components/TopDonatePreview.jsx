// TopDonatePreview.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Copy, Eye, RotateCcw,
  Sparkles, Crown, Star, Heart, Zap, Trophy, Flame, Diamond,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { generateWidgetUrl } from '../constants/topDonateOptions';

const ICON_MAP = {
  sparkles: Sparkles, crown: Crown,   star:    Star,  heart:   Heart,
  zap:      Zap,      trophy: Trophy, flame:   Flame, diamond: Diamond,
};

const GLOW_MAP = {
  low:    { blur: 12, spread: 0,  alpha: '33' },
  medium: { blur: 24, spread: 4,  alpha: '55' },
  high:   { blur: 40, spread: 8,  alpha: '80' },
};

const ANIMATE_CLASS = {
  pulse:  'animate-pulse',
  bounce: 'animate-bounce',
  spin:   'animate-spin',
};

// resolve placeholders ใน title โดยใช้ donorData
function resolveTitle(text, donorData) {
  if (!text) return '';
  const name    = donorData?.name    ?? 'SuperFan123';
  const amount  = donorData?.amount  ?? '฿5,000';
  const message = donorData?.message ?? 'Love your content! Keep it up!';
  return text
    .replace(/\{\{ชื่อ\}\}/g,      name)
    .replace(/\{\{จำนวนเงิน\}\}/g, amount)
    .replace(/\{\{ข้อความ\}\}/g,   message)
    .replace(/\{\{name\}\}/gi,     name)
    .replace(/\{\{amount\}\}/gi,   amount)
    .replace(/\{\{message\}\}/gi,  message);
}

export default function TopDonatePreview({ settings, donorData }) {
  const widgetUrl = generateWidgetUrl();

  // ค่าจริงจาก donorData
  const donorName    = donorData?.name    ?? 'SuperFan123';
  const donorAmount  = donorData?.amount  ?? '฿5,000';
  const donorMessage = donorData?.message ?? 'Love your content! Keep it up!';

  const resolvedTitle = resolveTitle(settings.title ?? '', donorData);

  const containerPx = Array.isArray(settings.iconSize)        ? settings.iconSize[0]        : (settings.iconSize        ?? 80);
  const radiusPx    = Array.isArray(settings.iconRadius)      ? settings.iconRadius[0]      : (settings.iconRadius      ?? 16);
  const borderW     = Array.isArray(settings.iconBorderWidth) ? settings.iconBorderWidth[0] : (settings.iconBorderWidth ?? 0);
  const fontPx      = Array.isArray(settings.fontSize)        ? settings.fontSize[0]        : settings.fontSize;

  const isCustom  = settings.iconType === 'custom' && settings.iconCustomUrl;
  const IconComp  = ICON_MAP[settings.iconType] ?? Sparkles;
  const isDiamond = settings.iconShape === 'diamond';
  const animClass = settings.iconAnimate ? (ANIMATE_CLASS[settings.iconAnimateStyle] ?? '') : '';

  function getRadius() {
    const shape = settings.iconShape ?? 'circle';
    if (shape === 'circle')   return '50%';
    if (shape === 'rounded')  return `${radiusPx}px`;
    if (shape === 'squircle') return `${Math.round(radiusPx * 1.6)}px`;
    if (shape === 'square')   return '2px';
    if (shape === 'diamond')  return `${Math.round(containerPx * 0.18)}px`;
    return '4px';
  }

  function getBg() {
    const mode = settings.iconBgMode ?? 'gradient';
    const c1   = settings.iconBgColor  ?? settings.accentColor ?? '#a855f7';
    const c2   = settings.iconBgColor2 ?? '#ec4899';
    if (mode === 'gradient') return { background: `linear-gradient(135deg, ${c1}, ${c2})` };
    if (mode === 'solid')    return { background: c1 };
    if (mode === 'outline')  return { background: 'transparent', boxSizing: 'border-box', border: `${Math.max(borderW, 2)}px solid ${c1}` };
    return { background: 'transparent' };
  }

  function getGlow() {
    if (!settings.iconGlow) return {};
    const g     = GLOW_MAP[settings.iconGlowIntensity ?? 'medium'];
    const color = settings.iconBgColor ?? settings.accentColor ?? '#a855f7';
    return { boxShadow: `0 0 ${g.blur}px ${g.spread}px ${color}${g.alpha}` };
  }

  function getExtraBorder() {
    if (borderW <= 0 || settings.iconBgMode === 'outline') return {};
    return { border: `${borderW}px solid ${settings.iconBorderColor ?? '#ffffff'}`, boxSizing: 'border-box' };
  }

  function getIconColor() {
    const mode = settings.iconBgMode ?? 'gradient';
    if (mode === 'outline' || mode === 'none') return settings.iconBgColor ?? settings.accentColor ?? '#a855f7';
    return '#ffffff';
  }

  const totalBorder = borderW * 2;
  const effectivePx = containerPx - totalBorder;
  const innerIconPx = isDiamond ? Math.round(effectivePx * 0.60) : effectivePx;

  const diamondWrapStyle = isDiamond ? {
    width: `${containerPx}px`, height: `${containerPx}px`,
    flexShrink: 0, position: 'relative',
  } : null;

  const diamondBoxStyle = isDiamond ? {
    position: 'absolute', inset: 0,
    borderRadius: getRadius(),
    transform: 'rotate(45deg)',
    overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    ...getBg(), ...getGlow(), ...getExtraBorder(),
  } : null;

  const diamondInnerStyle = isDiamond ? {
    transform: 'rotate(-45deg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: `${innerIconPx}px`, height: `${innerIconPx}px`,
  } : null;

  const normalContainerStyle = !isDiamond ? {
    width: `${containerPx}px`, height: `${containerPx}px`,
    borderRadius: getRadius(), flexShrink: 0,
    overflow: 'hidden', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    boxSizing: 'border-box',
    ...getBg(), ...getGlow(), ...getExtraBorder(),
  } : null;

  const innerStyle = !isDiamond
    ? { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
    : { width: `${innerIconPx}px`, height: `${innerIconPx}px`, objectFit: 'cover', display: 'block' };

  const lucideStyle = !isDiamond
    ? { width: `${Math.round(effectivePx * 0.58)}px`, height: `${Math.round(effectivePx * 0.58)}px`, color: getIconColor() }
    : { width: `${Math.round(innerIconPx * 0.65)}px`, height: `${Math.round(innerIconPx * 0.65)}px`, color: getIconColor() };

  return (
    <div className="space-y-4">
      {/* Widget preview */}
      <div
        className="rounded-xl p-6 text-center transition-colors duration-200"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <p className="text-sm mb-3" style={{ color: settings.accentColor }}>
          {resolvedTitle}
        </p>

        {settings.showIcon && (
          <div className="flex justify-center mb-4">
            {isDiamond ? (
              <div style={diamondWrapStyle} className={animClass}>
                <div style={diamondBoxStyle}>
                  <div style={diamondInnerStyle}>
                    {isCustom
                      ? <img src={settings.iconCustomUrl} alt="icon" style={innerStyle} />
                      : <IconComp style={lucideStyle} />
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div style={normalContainerStyle} className={animClass}>
                {isCustom
                  ? <img src={settings.iconCustomUrl} alt="icon" style={innerStyle} />
                  : <IconComp style={lucideStyle} />
                }
              </div>
            )}
          </div>
        )}

        {settings.showName && (
          <p className="font-bold" style={{ color: settings.textColor, fontSize: `${fontPx}px` }}>
            {donorName}
          </p>
        )}

        {settings.showAmount && (
          <p className="font-bold text-2xl mt-1" style={{ color: settings.accentColor }}>
            {donorAmount}
          </p>
        )}

        {settings.showMessage && (
          <p className="text-sm mt-2 opacity-80" style={{ color: settings.textColor }}>
            "{donorMessage}"
          </p>
        )}
      </div>

      {/* Widget URL */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">Widget URL</Label>
        <div className="flex gap-2">
          <Input
            value={widgetUrl}
            readOnly
            className="bg-slate-800/80 border-slate-700 text-purple-400 font-mono text-sm"
          />
          <Button
            size="icon" variant="outline"
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