// TopDonateShared.jsx
"use client";
import React, { useEffect, useState } from 'react';
import {
  Sparkles, Crown, Star, Heart, Zap, Trophy, Flame, Diamond,
} from 'lucide-react';
import { getFontFamilyCss } from '../../DonateAlertSettings/components/utils/fontUtils';

export const ICON_MAP = {
  sparkles: Sparkles, crown: Crown,   star:    Star,  heart:   Heart,
  zap:      Zap,      trophy: Trophy, flame:   Flame, diamond: Diamond,
};

export const GLOW_MAP = {
  low:    { blur: 12, spread: 0,  alpha: '33' },
  medium: { blur: 24, spread: 4,  alpha: '55' },
  high:   { blur: 40, spread: 8,  alpha: '80' },
};

export const ANIMATE_CLASS = {
  pulse:  'animate-pulse',
  bounce: 'animate-bounce',
  spin:   'animate-spin',
};

export const TEMPLATE_VARIANTS = [
  { id: 'classic',          name: 'Classic' },
  { id: 'hero-center',      name: 'Hero Center Card' },
  { id: 'neon-glass',       name: 'Neon Glass Spotlight' },
  { id: 'minimal-banner',   name: 'Minimal Premium Banner' },
  { id: 'trophy-podium',    name: 'Trophy Podium Style' },
  { id: 'circular-profile', name: 'Circular Profile Focus' },
  { id: 'compact-strip',    name: 'Compact Overlay Strip' },
];

export const PREVIEW_RANK2 = { name: 'SecondDonor', amount: '฿50,000' };
export const PREVIEW_RANK3 = { name: 'ThirdDonor',  amount: '฿20,000' };

const TOP_DONATE_KEYFRAMES = `
  @keyframes topDonateAuraPulse {
    0%, 100% { opacity: 0.35; transform: scale(0.92); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  @keyframes topDonateIconShine {
    0% { left: -40%; opacity: 0; }
    20% { opacity: 0.9; }
    60% { opacity: 0.9; }
    100% { left: 120%; opacity: 0; }
  }
  @keyframes topDonateCrownFloat {
    0%, 100% { transform: translateY(0) rotate(-10deg); }
    50% { transform: translateY(-4px) rotate(-10deg); }
  }
  @keyframes topDonateTextShine {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes topDonateBadgeLifecycle {
    0% { opacity: 0; transform: translate(-50%, 6px) scale(0.8); }
    10% { opacity: 1; transform: translate(-50%, -2px) scale(1.05); }
    16% { transform: translate(-50%, 0) scale(1); }
    85% { opacity: 1; transform: translate(-50%, 0) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -6px) scale(0.9); }
  }
  @keyframes topDonateCardBurst {
    0% { opacity: 0; }
    15% { opacity: 0.9; }
    100% { opacity: 0; }
  }
  @keyframes topDonateSpotlightSweep {
    0%, 100% { transform: translateX(-10%) rotate(-8deg); opacity: 0.5; }
    50% { transform: translateX(10%) rotate(-8deg); opacity: 0.9; }
  }
  @keyframes topDonateCardShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px) rotate(-1deg); }
    40% { transform: translateX(5px) rotate(1deg); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(3px); }
  }
  @keyframes topDonateConfettiFall {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(160px) rotate(360deg); opacity: 0; }
  }
`;

export function injectTopDonateKeyframes() {
  if (typeof document === 'undefined' || document.getElementById('top-donate-preview-anim')) return;
  const style = document.createElement('style');
  style.id = 'top-donate-preview-anim';
  style.textContent = TOP_DONATE_KEYFRAMES;
  document.head.appendChild(style);
}

export function resolvePreviewFontFamily(fontValue, fallback = "'IBM Plex Sans Thai', sans-serif") {
  if (!fontValue) return fallback;
  if (String(fontValue).includes(',') || String(fontValue).includes("'")) return fontValue;
  return getFontFamilyCss(fontValue);
}

export function getNumberValue(value, fallback = 0) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getTextStrokeStyle(width, color) {
  const strokeWidth = getNumberValue(width, 0);
  if (strokeWidth <= 0 || !color) return {};
  return {
    WebkitTextStroke: `${strokeWidth}px ${color}`,
    textStroke: `${strokeWidth}px ${color}`,
  };
}

export function getTextStyle(settings, prefix, fallbackColor) {
  return {
    color: settings[`${prefix}Color`] ?? fallbackColor,
    fontSize: `${getNumberValue(settings[`${prefix}FontSize`], 18)}px`,
    textAlign: settings[`${prefix}Alignment`] ?? 'center',
    fontFamily: resolvePreviewFontFamily(settings[`${prefix}FontFamily`]),
    fontWeight: settings[`${prefix}FontWeight`] ?? '700',
    lineHeight: 1.15,
    margin: 0,
    width: '100%',
    ...getTextStrokeStyle(settings[`${prefix}StrokeWidth`], settings[`${prefix}StrokeColor`]),
  };
}

export function getLayoutStyle(alignment) {
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
}

export function resolveTitle(text, donorData) {
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

export function useTopDonateCelebration(donorName) {
  const [seenDonorName, setSeenDonorName] = useState(null);
  const [isCelebrating, setIsCelebrating] = useState(false);

  if (donorName && donorName !== seenDonorName) {
    const isChange = seenDonorName !== null;
    setSeenDonorName(donorName);
    if (isChange) setIsCelebrating(true);
  }

  useEffect(() => {
    if (!isCelebrating) return undefined;
    const timer = setTimeout(() => setIsCelebrating(false), 4000);
    return () => clearTimeout(timer);
  }, [isCelebrating]);

  return isCelebrating;
}

export const CELEBRATION_EFFECTS = [
  { id: 'burst', name: 'Burst' },
  { id: 'confetti', name: 'Confetti' },
  { id: 'shake', name: 'Shake' },
  { id: 'none', name: 'None' },
];

const CONFETTI_COLORS = ['#FFD700', '#FF6EC7', '#00E5FF', '#A855F7', '#4ADE80'];

function NewChampionBadge() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: -14,
        left: '50%',
        zIndex: 5,
        padding: '4px 14px',
        borderRadius: 999,
        background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
        color: '#3a1d00',
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 14px rgba(255,165,0,0.5)',
        border: '1px solid rgba(255,255,255,0.7)',
        animation: 'topDonateBadgeLifecycle 4s ease-in-out forwards',
      }}
    >
      New Champion
    </div>
  );
}

function BurstOverlay({ settings }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${settings.accentColor || '#a855f7'}55 0%, transparent 70%)`,
        animation: 'topDonateCardBurst 1.2s ease-out',
      }}
    />
  );
}

function ConfettiOverlay() {
  const pieces = Array.from({ length: 14 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 4 }}>
      {pieces.map((_, i) => {
        const left = (i * 37) % 100;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const delay = (i % 7) * 0.08;
        const duration = 1.1 + (i % 4) * 0.15;
        const size = 6 + (i % 3) * 2;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: -10,
              left: `${left}%`,
              width: size,
              height: size * 0.6,
              background: color,
              borderRadius: 2,
              animation: `topDonateConfettiFall ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

export function CelebrationBurst({ settings, isCelebrating }) {
  const effect = settings.celebrationEffect || 'burst';
  if (!isCelebrating || effect === 'none') return null;
  return (
    <>
      {effect === 'burst' && <BurstOverlay settings={settings} />}
      {effect === 'confetti' && <ConfettiOverlay />}
      <NewChampionBadge />
    </>
  );
}

export function getCelebrationShakeStyle(settings, isCelebrating) {
  if (!isCelebrating || (settings.celebrationEffect || 'burst') !== 'shake') return {};
  return { animation: 'topDonateCardShake 0.5s ease-in-out' };
}

function getRadius(settings, containerPx) {
  const radiusPx = getNumberValue(settings.iconRadius, 16);
  const shape = settings.iconShape ?? 'circle';
  if (shape === 'circle')   return '50%';
  if (shape === 'rounded')  return `${radiusPx}px`;
  if (shape === 'squircle') return `${Math.round(radiusPx * 1.6)}px`;
  if (shape === 'square')   return '2px';
  if (shape === 'diamond')  return `${Math.round(containerPx * 0.18)}px`;
  return '4px';
}

function getBg(settings) {
  const mode = settings.iconBgMode ?? 'gradient';
  const c1   = settings.iconBgColor  ?? settings.accentColor ?? '#a855f7';
  const c2   = settings.iconBgColor2 ?? '#ec4899';
  if (mode === 'gradient') return { background: `linear-gradient(135deg, ${c1}, ${c2})` };
  if (mode === 'solid')    return { background: c1 };
  if (mode === 'outline')  return { background: 'transparent', boxSizing: 'border-box', border: `${Math.max(getNumberValue(settings.iconBorderWidth, 0), 2)}px solid ${c1}` };
  return { background: 'transparent' };
}

function getGlow(settings) {
  if (!settings.iconGlow) return {};
  const g     = GLOW_MAP[settings.iconGlowIntensity ?? 'medium'];
  const color = settings.iconBgColor ?? settings.accentColor ?? '#a855f7';
  return { boxShadow: `0 0 ${g.blur}px ${g.spread}px ${color}${g.alpha}` };
}

function getExtraBorder(settings) {
  const borderW = getNumberValue(settings.iconBorderWidth, 0);
  if (borderW <= 0 || settings.iconBgMode === 'outline') return {};
  return { border: `${borderW}px solid ${settings.iconBorderColor ?? '#ffffff'}`, boxSizing: 'border-box' };
}

function getIconColor(settings) {
  const mode = settings.iconBgMode ?? 'gradient';
  if (mode === 'outline' || mode === 'none') return settings.iconBgColor ?? settings.accentColor ?? '#a855f7';
  return '#ffffff';
}

export function IconBlock({ settings, size, showCrown = true }) {
  if (!settings.showIcon) return null;

  const containerPx = size ?? getNumberValue(settings.iconSize, 80);
  const iconImageRatio = getNumberValue(settings.iconImageSize, 70) / 100;
  const borderW = getNumberValue(settings.iconBorderWidth, 0);
  const isCustom  = settings.iconType === 'custom' && settings.iconCustomUrl;
  const IconComp  = ICON_MAP[settings.iconType] ?? Sparkles;
  const isDiamond = settings.iconShape === 'diamond';
  const animClass = settings.iconAnimate ? (ANIMATE_CLASS[settings.iconAnimateStyle] ?? '') : '';

  const totalBorder = borderW * 2;
  const effectivePx = containerPx - totalBorder;
  const innerIconPx = isDiamond ? Math.round(effectivePx * 0.60) : effectivePx;
  const iconContentPx = Math.max(8, Math.round(effectivePx * iconImageRatio));
  const diamondIconContentPx = Math.max(8, Math.round(innerIconPx * iconImageRatio));

  const iconRadius = getRadius(settings, containerPx);
  const iconColor = getIconColor(settings);
  const glowColor = settings.iconBgColor ?? settings.accentColor ?? '#a855f7';
  const crownSize = Math.max(20, Math.round(containerPx * 0.36));

  const auraNode = settings.iconGlow ? (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        inset: '-22%',
        background: `radial-gradient(circle, ${glowColor}66 0%, ${glowColor}00 70%)`,
        animation: 'topDonateAuraPulse 2.4s ease-in-out infinite',
        zIndex: 0,
      }}
    />
  ) : null;

  const shineSweepNode = (
    <div
      className="absolute inset-y-0 pointer-events-none"
      style={{
        left: '-40%',
        width: '35%',
        background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))',
        filter: 'blur(1px)',
        animation: 'topDonateIconShine 2.6s cubic-bezier(0.4,0,0.2,1) infinite',
        mixBlendMode: 'screen',
      }}
    />
  );

  const crownBadgeNode = showCrown ? (
    <div
      className="absolute pointer-events-none flex items-center justify-center rounded-full"
      style={{
        top: '-16%',
        right: '-12%',
        width: crownSize,
        height: crownSize,
        background: 'linear-gradient(135deg, #FFE066, #FFA500)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35), 0 0 12px rgba(255,215,0,0.55)',
        border: '2px solid rgba(255,255,255,0.85)',
        animation: 'topDonateCrownFloat 2.2s ease-in-out infinite',
        zIndex: 3,
      }}
    >
      <Crown style={{ width: '58%', height: '58%', color: '#7c3f00' }} strokeWidth={2.5} />
    </div>
  ) : null;

  const innerStyle = !isDiamond
    ? { width: `${iconContentPx}px`, height: `${iconContentPx}px`, objectFit: 'contain', display: 'block' }
    : { width: `${diamondIconContentPx}px`, height: `${diamondIconContentPx}px`, objectFit: 'contain', display: 'block' };

  const lucideStyle = !isDiamond
    ? { width: `${iconContentPx}px`, height: `${iconContentPx}px`, color: iconColor }
    : { width: `${diamondIconContentPx}px`, height: `${diamondIconContentPx}px`, color: iconColor };

  if (isDiamond) {
    const diamondWrapStyle = { width: `${containerPx}px`, height: `${containerPx}px`, flexShrink: 0, position: 'relative' };
    const diamondBoxStyle = {
      position: 'absolute', inset: 0,
      borderRadius: iconRadius,
      transform: 'rotate(45deg)',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...getBg(settings), ...getGlow(settings), ...getExtraBorder(settings),
    };
    const diamondInnerStyle = {
      transform: 'rotate(-45deg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: `${innerIconPx}px`, height: `${innerIconPx}px`,
    };

    return (
      <div style={diamondWrapStyle}>
        {auraNode}
        <div style={diamondBoxStyle} className={animClass}>
          <div style={diamondInnerStyle}>
            {isCustom
              ? <img src={settings.iconCustomUrl} alt="icon" style={innerStyle} />
              : <IconComp style={lucideStyle} />
            }
          </div>
          {shineSweepNode}
        </div>
        {crownBadgeNode}
      </div>
    );
  }

  const normalContainerStyle = {
    position: 'relative',
    width: `${containerPx}px`, height: `${containerPx}px`,
    borderRadius: iconRadius, flexShrink: 0,
    overflow: 'hidden', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    boxSizing: 'border-box',
    ...getBg(settings), ...getGlow(settings), ...getExtraBorder(settings),
  };

  return (
    <div className="relative" style={{ width: containerPx, height: containerPx }}>
      {auraNode}
      <div style={normalContainerStyle} className={animClass}>
        {isCustom
          ? <img src={settings.iconCustomUrl} alt="icon" style={innerStyle} />
          : <IconComp style={lucideStyle} />
        }
        {shineSweepNode}
      </div>
      {crownBadgeNode}
    </div>
  );
}

export function TitleLine({ settings, resolvedTitle }) {
  if (!resolvedTitle) return null;
  return (
    <p
      className="mb-3"
      style={{
        color: settings.accentColor,
        fontSize: `${getNumberValue(settings.titleFontSize, 14)}px`,
        lineHeight: 1.2,
        margin: '0 0 12px',
      }}
    >
      {resolvedTitle}
    </p>
  );
}

export function NameLine({ settings, donorName, align, truncate = false }) {
  if (!settings.showName) return null;
  const style = getTextStyle(settings, 'topDonator', settings.textColor ?? '#ffffff');
  return (
    <p style={{
      ...style,
      textAlign: align ?? style.textAlign,
      minWidth: 0,
      ...(truncate ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {}),
    }}>
      {donorName}
    </p>
  );
}

export function AmountLine({ settings, donorAmount, align, shine = true }) {
  if (!settings.showAmount) return null;
  const style = getTextStyle(settings, 'amount', settings.accentColor ?? '#a855f7');
  const base = { ...style, textAlign: align ?? style.textAlign };
  if (!shine) return <p style={base}>{donorAmount}</p>;
  return (
    <p
      style={{
        ...base,
        backgroundImage: `linear-gradient(90deg, ${style.color} 15%, #FFFFFF 50%, ${style.color} 85%)`,
        backgroundSize: '220% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        animation: 'topDonateTextShine 3s linear infinite',
      }}
    >
      {donorAmount}
    </p>
  );
}

export function MessageLine({ settings, donorMessage }) {
  if (!settings.showMessage) return null;
  return (
    <p
      className="opacity-80"
      style={{
        color: settings.textColor,
        fontSize: `${getNumberValue(settings.messageFontSize, 18)}px`,
        lineHeight: 1.35,
        margin: 0,
        textAlign: 'center',
        width: '100%',
      }}
    >
      <span>&quot;{donorMessage}&quot;</span>
    </p>
  );
}
