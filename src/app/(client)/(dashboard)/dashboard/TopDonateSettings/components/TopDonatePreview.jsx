// TopDonatePreview.tsx
"use client";
import React from 'react';
import {
  Copy,
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

const getTextStyle = (settings, prefix, fallbackColor) => ({
  color: settings[`${prefix}Color`] ?? fallbackColor,
  fontSize: `${getNumberValue(settings[`${prefix}FontSize`], 18)}px`,
  textAlign: settings[`${prefix}Alignment`] ?? 'center',
  fontFamily: settings[`${prefix}FontFamily`] ?? 'inherit',
  fontWeight: settings[`${prefix}FontWeight`] ?? '700',
  lineHeight: 1.15,
  margin: 0,
  width: '100%',
  ...getTextStrokeStyle(settings[`${prefix}StrokeWidth`], settings[`${prefix}StrokeColor`]),
});

const getLayoutStyle = (alignment) => {
  const normalizedMap = {
    'flex-col': 'stack-center',
    'flex-row': 'row-center',
    'flex-col-reverse': 'stack-reverse-center',
    'flex-row-reverse': 'row-reverse-center',
  };
  const normalized = normalizedMap[alignment] || alignment || 'stack-center';
  const isRow = normalized.startsWith('row-');
  const isReverse = normalized.includes('reverse');
  const isLeft = normalized.endsWith('left');
  const isRight = normalized.endsWith('right');
  const isStack = normalized.startsWith('stack-');
  const justifyContent = isLeft ? 'flex-start' : isRight ? 'flex-end' : 'center';
  const alignItems = isStack
    ? isLeft ? 'flex-start' : isRight ? 'flex-end' : 'center'
    : 'center';
  const textAlign = isLeft ? 'left' : isRight ? 'right' : 'center';

  return {
    container: {
      display: 'flex',
      flexDirection: isRow
        ? isReverse ? 'row-reverse' : 'row'
        : isReverse ? 'column-reverse' : 'column',
      alignItems,
      justifyContent,
      gap: 16,
      width: '100%',
    },
    textGroup: {
      minWidth: 0,
      width: isStack ? 'fit-content' : 'auto',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 10,
      textAlign,
    },
  };
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
  const iconImageRatio = getNumberValue(settings.iconImageSize, 70) / 100;
  const legacyFontPx = getNumberValue(settings.fontSize, 18);
  const titleFontPx = getNumberValue(settings.titleFontSize, Math.max(12, Math.round(legacyFontPx * 0.8)));
  const messageFontPx = getNumberValue(settings.messageFontSize, legacyFontPx);
  const radiusPx    = Array.isArray(settings.iconRadius)      ? settings.iconRadius[0]      : (settings.iconRadius      ?? 16);
  const borderW     = Array.isArray(settings.iconBorderWidth) ? settings.iconBorderWidth[0] : (settings.iconBorderWidth ?? 0);
  const topDonatorStyle = getTextStyle(settings, 'topDonator', settings.textColor ?? '#ffffff');
  const amountStyle = getTextStyle(settings, 'amount', settings.accentColor ?? '#a855f7');
  const layoutStyle = getLayoutStyle(settings.alignment);

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
  const iconContentPx = Math.max(8, Math.round(effectivePx * iconImageRatio));
  const diamondIconContentPx = Math.max(8, Math.round(innerIconPx * iconImageRatio));

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
    ? { width: `${iconContentPx}px`, height: `${iconContentPx}px`, objectFit: 'contain', display: 'block' }
    : { width: `${diamondIconContentPx}px`, height: `${diamondIconContentPx}px`, objectFit: 'contain', display: 'block' };

  const lucideStyle = !isDiamond
    ? { width: `${iconContentPx}px`, height: `${iconContentPx}px`, color: getIconColor() }
    : { width: `${diamondIconContentPx}px`, height: `${diamondIconContentPx}px`, color: getIconColor() };

  return (
    <div className="space-y-4">
      {/* Widget preview */}
      <div
        className="rounded-xl p-6 transition-colors duration-200"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <p
          className="mb-3"
          style={{
            color: settings.accentColor,
            fontSize: `${titleFontPx}px`,
            lineHeight: 1.2,
            margin: '0 0 12px',
          }}
        >
          {resolvedTitle}
        </p>

        <div style={layoutStyle.container}>
          {settings.showIcon && (
            <div className="flex justify-center">
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

          <div
            style={layoutStyle.textGroup}
          >
            {settings.showName && (
              <p style={topDonatorStyle}>
                {donorName}
              </p>
            )}

            {settings.showAmount && (
              <p style={amountStyle}>
                {donorAmount}
              </p>
            )}

            {settings.showMessage && (
              <p
                className="opacity-80"
                style={{
                  color: settings.textColor,
                  fontSize: `${messageFontPx}px`,
                  lineHeight: 1.35,
                  margin: 0,
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <span>&quot;{donorMessage}&quot;</span>
              </p>
            )}
          </div>
        </div>
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
