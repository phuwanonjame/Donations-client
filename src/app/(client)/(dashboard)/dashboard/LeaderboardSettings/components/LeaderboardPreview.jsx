'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  getFontFamilyCss,
  injectFontFamily,
} from '../../DonateAlertSettings/components/utils/fontUtils';
import { timeRanges as TIME_RANGES } from '../constants/donate-leaderboard';
import { useOptionalLeaderboardSettings } from './context/LeaderboardSettingsProvider';

const SAMPLE_LEADERBOARD = [
  { rank: 1, name: 'SuperFan123', amount: 5000 },
  { rank: 2, name: 'BigSupporter', amount: 3500 },
  { rank: 3, name: 'GoldenDonor', amount: 2000 },
  { rank: 4, name: 'CoolViewer', amount: 1500 },
  { rank: 5, name: 'NicePerson', amount: 1000 },
];

// ─── Default accent colors per rank ──────────────────────────────────────────
const RANK_DEFAULTS = {
  1: {
    accentColor: '#FF007F',
    badgeGradientFrom: '#FF007F',
    badgeGradientTo: '#7000FF',
    glowColor: 'rgba(255,0,127,0.7)',
    borderColor: 'rgba(255,0,127,0.6)',
    defaultUsernameColor: '#FFD700',
    defaultAmountColor: '#FFD700',
  },
  2: {
    accentColor: '#00D4FF',
    badgeGradientFrom: '#00D4FF',
    badgeGradientTo: '#3B00FF',
    glowColor: 'rgba(0,212,255,0.6)',
    borderColor: 'rgba(0,212,255,0.5)',
    defaultUsernameColor: '#E0E0E0',
    defaultAmountColor: '#F5F5F5',
  },
  3: {
    accentColor: '#FFB200',
    badgeGradientFrom: '#FFB200',
    badgeGradientTo: '#FF4400',
    glowColor: 'rgba(255,178,0,0.6)',
    borderColor: 'rgba(255,178,0,0.5)',
    defaultUsernameColor: '#FFB347',
    defaultAmountColor: '#FFB347',
  },
};

const DEFAULT_PODIUM_CONFIG = {
  1: { badgeW: 110, badgeH: 110, pedH: 320, fontSizeName: 20, fontSizeAmount: 18 },
  2: { badgeW: 96,  badgeH: 96,  pedH: 220, fontSizeName: 18, fontSizeAmount: 16 },
  3: { badgeW: 90,  badgeH: 90,  pedH: 220, fontSizeName: 17, fontSizeAmount: 15 },
};

// ─── Helper: build PODIUM_KEYS for a given prefix ─────────────────────────────
const makePodiumKeys = (prefix) => {
  const k = (name) => `${prefix}${name}`;
  return {
    fontFamily:            k('FontFamily'),
    fontWeight:            k('FontWeight'),
    usernameFontSize:      k('UsernameFontSize'),
    usernameColor:         k('UsernameColor'),
    amountFontSize:        k('AmountFontSize'),
    amountColor:           k('AmountColor'),
    strokeWidth:           k('StrokeWidth'),
    strokeColor:           k('StrokeColor'),
    cardBorderColor:       k('CardBorderColor'),
    cardBorderWidth:       k('CardBorderWidth'),
    cardBorderRadius:      k('CardBorderRadius'),
    cardBorderStyle:       k('CardBorderStyle'),
    cardPaddingX:          k('CardPaddingX'),
    cardPaddingBottom:     k('CardPaddingBottom'),
    backgroundColor:       k('BackgroundColor'),
    pedestalColor:         k('PedestalColor'),
    pedestalHeight:        k('PedestalHeight'),
    showPedestalBase:      k('ShowPedestalBase'),
    pedestalBaseHeight:    k('PedestalBaseHeight'),
    pedestalBaseColor:     k('PedestalBaseColor'),
    pedestalShape:         k('PedestalShape'),
    badgeType:             k('BadgeType'),
    badgeSize:             k('BadgeSize'),
    badgeGradientFrom:     k('BadgeGradientFrom'),
    badgeGradientTo:       k('BadgeGradientTo'),
    badgeTextColor:        k('BadgeTextColor'),
    badgeBorderColor:      k('BadgeBorderColor'),
    badgeBorderWidth:      k('BadgeBorderWidth'),
    showBadge:             k('ShowBadge'),
    badgeGlowColor:        k('BadgeGlowColor'),
    badgeOffsetY:          k('BadgeOffsetY'),
    imageUrl:              k('Image'),
    imageOpacity:          k('ImageOpacity'),
    imageFit:              k('ImageFit'),
    imagePosition:         k('ImagePosition'),
    showOverlay:           k('ShowOverlay'),
    overlayColor:          k('OverlayColor'),
    overlayOpacity:        k('OverlayOpacity'),
    overlayDirection:      k('OverlayDirection'),
    podiumGlowColor:       k('GlowColor'),
    podiumGlowBlur:        k('GlowBlur'),
    showShine:             k('Shine'),
    textAlign:             k('TextAlign'),
    textVerticalAlign:     k('TextVerticalAlign'),
    usernameLetterSpacing: k('UsernameLetterSpacing'),
    usernameTransform:     k('UsernameTransform'),
    usernameLineHeight:    k('UsernameLineHeight'),
    amountPrefix:          k('AmountPrefix'),
    showExtraLabel:        k('ShowExtraLabel'),
    extraLabelText:        k('ExtraLabelText'),
    extraLabelColor:       k('ExtraLabelColor'),
    extraLabelFontSize:    k('ExtraLabelFontSize'),
    highlightKeys: [
      k('FontFamily'), k('FontWeight'),
      k('UsernameFontSize'), k('UsernameColor'),
      k('AmountFontSize'), k('AmountColor'),
      k('StrokeWidth'), k('StrokeColor'),
      k('CardBorderColor'), k('CardBorderWidth'), k('CardBorderRadius'), k('CardBorderStyle'),
      k('CardPaddingX'), k('CardPaddingBottom'), k('BackgroundColor'),
      k('PedestalColor'), k('PedestalHeight'),
      k('ShowPedestalBase'), k('PedestalBaseHeight'), k('PedestalBaseColor'), k('PedestalShape'),
      k('BadgeType'), k('BadgeSize'),
      k('BadgeGradientFrom'), k('BadgeGradientTo'),
      k('BadgeTextColor'), k('BadgeBorderColor'), k('BadgeBorderWidth'),
      k('ShowBadge'), k('BadgeGlowColor'), k('BadgeOffsetY'),
      k('Image'), k('ImageOpacity'), k('ImageFit'), k('ImagePosition'),
      k('ShowOverlay'), k('OverlayColor'), k('OverlayOpacity'), k('OverlayDirection'),
      k('GlowColor'), k('GlowBlur'), k('Shine'),
      k('TextAlign'), k('TextVerticalAlign'),
      k('UsernameLetterSpacing'), k('UsernameTransform'), k('UsernameLineHeight'),
      k('AmountPrefix'),
      k('ShowExtraLabel'), k('ExtraLabelText'), k('ExtraLabelColor'), k('ExtraLabelFontSize'),
    ],
  };
};

const PODIUM_KEYS = {
  1: makePodiumKeys('podiumFirst'),
  2: makePodiumKeys('podiumSecond'),
  3: makePodiumKeys('podiumThird'),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStrokeStyle = (strokeWidth, strokeColor) =>
  strokeWidth && strokeWidth !== '0px' && strokeColor && strokeColor !== '#00000000'
    ? { WebkitTextStroke: `${strokeWidth} ${strokeColor}`, textStroke: `${strokeWidth} ${strokeColor}` }
    : {};

const normalizeFontWeight = (weight) => {
  if (typeof weight === 'number') return `${weight}`;
  const normalized = String(weight || '').trim().toLowerCase();
  const map = {
    thin: '100', extralight: '200', 'extra-light': '200',
    light: '300', normal: '400', medium: '500',
    semibold: '600', 'semi-bold': '600', bold: '700',
    extrabold: '800', 'extra-bold': '800', black: '900',
  };
  return map[normalized] || weight || '400';
};

const getTimeRangeLabel = (timeRange) =>
  TIME_RANGES.find(item => item.id === timeRange)?.name || '';

const withAlpha = (color, alpha) => {
  if (!color) return `rgba(245,158,11,${alpha})`;
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
    const hex = color.length === 4
      ? color.slice(1).split('').map(char => char + char).join('')
      : color.slice(1);
    const value = parseInt(hex, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
};

const formatAmount = (amount) => `฿${amount.toLocaleString()}`;

const resolvePreviewFontFamily = (fontValue, fallback = "'IBM Plex Sans Thai', sans-serif") => {
  if (!fontValue) return fallback;
  if (String(fontValue).includes(',') || String(fontValue).includes("'")) return fontValue;
  return getFontFamilyCss(fontValue);
};

const getRankTone = (rank, accentColor = '#f59e0b') => {
  const tones = {
    1: { main: '#f59e0b', soft: 'rgba(245,158,11,0.22)', label: 'TOP' },
    2: { main: '#94a3b8', soft: 'rgba(148,163,184,0.18)', label: '2ND' },
    3: { main: '#d97706', soft: 'rgba(217,119,6,0.18)', label: '3RD' },
  };
  return tones[rank] || { main: accentColor, soft: withAlpha(accentColor, 0.12), label: `#${rank}` };
};

const useHighlight = (highlightKey, targetKeys) => {
  const [isActive, setIsActive] = React.useState(false);
  React.useEffect(() => {
    if (highlightKey && targetKeys.includes(highlightKey)) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 900);
      return () => clearTimeout(timer);
    }
  }, [highlightKey, targetKeys]);
  return isActive;
};

const getPedestalClipPath = (shape) => {
  switch (shape) {
    case 'tapered':  return 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)';
    case 'inverted': return 'polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)';
    case 'arch':     return 'polygon(0% 6%, 3% 0%, 97% 0%, 100% 6%, 100% 100%, 0% 100%)';
    default:         return undefined;
  }
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const PodiumBadge = memo(({ rank, settings, keys, sizeOverride }) => {
  const rankDef = RANK_DEFAULTS[rank];
  const defaultConfig = DEFAULT_PODIUM_CONFIG[rank];
  const badgeType   = settings?.[keys.badgeType]         || 'pentagon';
  const badgeSize   = sizeOverride ?? (settings?.[keys.badgeSize] ? Number(settings[keys.badgeSize]) : defaultConfig.badgeW);
  const gradFrom    = settings?.[keys.badgeGradientFrom] || rankDef.badgeGradientFrom;
  const gradTo      = settings?.[keys.badgeGradientTo]   || rankDef.badgeGradientTo;
  const textColor   = settings?.[keys.badgeTextColor]    || '#FFFFFF';
  const borderColor = settings?.[keys.badgeBorderColor]  || rankDef.accentColor;
  const borderWidth = settings?.[keys.badgeBorderWidth]  != null ? Number(settings[keys.badgeBorderWidth]) : 3;
  const glowColor   = settings?.[keys.badgeGlowColor]    || rankDef.glowColor;
  const w = badgeSize, h = badgeSize, cx = w / 2, cy = h / 2;
  const fontSize = rank === 1 ? Math.round(w * 0.44) : Math.round(w * 0.40);
  const gradId = `badge-grad-${rank}`;

  const getPath = () => {
    switch (badgeType) {
      case 'circle': return null;
      case 'diamond': {
        const hw = w * 0.48, hh = h * 0.48;
        return `M ${cx} ${cy - hh} L ${cx + hw} ${cy} L ${cx} ${cy + hh} L ${cx - hw} ${cy} Z`;
      }
      case 'star': {
        const outerR = w * 0.48, innerR = w * 0.22;
        let d = '';
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const r = i % 2 === 0 ? outerR : innerR;
          d += (i === 0 ? 'M' : 'L') + ` ${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)} `;
        }
        return d + 'Z';
      }
      case 'hexagon': {
        const r = w * 0.47;
        let d = '';
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          d += (i === 0 ? 'M' : 'L') + ` ${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)} `;
        }
        return d + 'Z';
      }
      case 'shield':
        return `M ${cx} ${h*0.03} L ${w*0.93} ${h*0.18} L ${w*0.93} ${h*0.55} Q ${w*0.93} ${h*0.82} ${cx} ${h*0.97} Q ${w*0.07} ${h*0.82} ${w*0.07} ${h*0.55} L ${w*0.07} ${h*0.18} Z`;
      default:
        return `M ${cx} ${h*0.02} L ${w*0.97} ${h*0.30} L ${w*0.83} ${h*0.97} L ${w*0.17} ${h*0.97} L ${w*0.03} ${h*0.30} Z`;
    }
  };

  const pathData = getPath();
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ filter: `drop-shadow(0 0 ${Math.round(w*0.18)}px ${glowColor})` }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradFrom} />
          <stop offset="100%" stopColor={gradTo} />
        </linearGradient>
      </defs>
      {badgeType === 'circle'
        ? <circle cx={cx} cy={cy} r={w*0.46} fill={`url(#${gradId})`} stroke={borderColor} strokeWidth={borderWidth} />
        : <path d={pathData} fill={`url(#${gradId})`} stroke={borderColor} strokeWidth={borderWidth} />
      }
      <text x={cx} y={cy + fontSize*0.36} textAnchor="middle" fontSize={fontSize} fontWeight="900"
        fill={textColor} fontFamily="'Teko','Rajdhani',sans-serif" letterSpacing="2">
        {rank}
      </text>
    </svg>
  );
});
PodiumBadge.displayName = 'PodiumBadge';

// ─── Extract card settings ────────────────────────────────────────────────────
const useCardSettings = (rank, settings, keys) => {
  const rankDef = RANK_DEFAULTS[rank];
  const defaultConfig = DEFAULT_PODIUM_CONFIG[rank];
  return {
    showBadge:          settings?.[keys.showBadge] !== false,
    badgeOffsetY:       settings?.[keys.badgeOffsetY] != null ? Number(settings[keys.badgeOffsetY]) : -20,
    cardBorderColor:    settings?.[keys.cardBorderColor]    || rankDef.borderColor,
    cardBorderWidth:    settings?.[keys.cardBorderWidth]    != null ? Number(settings[keys.cardBorderWidth])    : 1,
    cardBorderRadius:   settings?.[keys.cardBorderRadius]   != null ? Number(settings[keys.cardBorderRadius])   : 0,
    cardBorderStyle:    settings?.[keys.cardBorderStyle]    || 'solid',
    cardPaddingX:       settings?.[keys.cardPaddingX]       != null ? Number(settings[keys.cardPaddingX])       : 8,
    cardPaddingBottom:  settings?.[keys.cardPaddingBottom]  != null ? Number(settings[keys.cardPaddingBottom])  : 20,
    backgroundColor:    settings?.[keys.backgroundColor]    || '',
    pedestalColor:      settings?.[keys.pedestalColor]      || 'transparent',
    pedestalHeight:     settings?.[keys.pedestalHeight]     ?? defaultConfig.pedH,
    pedestalShape:      settings?.[keys.pedestalShape]      || 'rect',
    showPedestalBase:   settings?.[keys.showPedestalBase]   !== false,
    pedestalBaseHeight: settings?.[keys.pedestalBaseHeight] != null ? Number(settings[keys.pedestalBaseHeight]) : 12,
    pedestalBaseColor:  settings?.[keys.pedestalBaseColor]  || 'transparent',
    imageUrl:           settings?.[keys.imageUrl],
    imageOpacity:       settings?.[keys.imageOpacity]       ?? 0.7,
    imageFit:           settings?.[keys.imageFit]           || 'cover',
    imagePosition:      settings?.[keys.imagePosition]      || 'center',
    showOverlay:        settings?.[keys.showOverlay]        !== false,
    overlayColor:       settings?.[keys.overlayColor]       || '#000000',
    overlayOpacity:     settings?.[keys.overlayOpacity]     ?? 0.5,
    overlayDirection:   settings?.[keys.overlayDirection]   || 'to top',
    glowColor:          settings?.[keys.podiumGlowColor]    || rankDef.glowColor,
    glowBlur:           settings?.[keys.podiumGlowBlur]     ?? 0,
    showShine:          settings?.[keys.showShine],
    usernameColor:      settings?.[keys.usernameColor]      || rankDef.defaultUsernameColor,
    amountColor:        settings?.[keys.amountColor]        || rankDef.defaultAmountColor,
    usernameFontSize:   settings?.[keys.usernameFontSize]   || `${defaultConfig.fontSizeName}px`,
    amountFontSize:     settings?.[keys.amountFontSize]     || `${defaultConfig.fontSizeAmount}px`,
    fontFamily:         resolvePreviewFontFamily(settings?.[keys.fontFamily], "'IBM Plex Sans Thai', sans-serif"),
    fontWeight:         normalizeFontWeight(settings?.[keys.fontWeight]) || '700',
    strokeStyle:        getStrokeStyle(settings?.[keys.strokeWidth], settings?.[keys.strokeColor]),
    textAlign:          settings?.[keys.textAlign]             || 'center',
    textVerticalAlign:  settings?.[keys.textVerticalAlign]     || 'flex-end',
    letterSpacing:      settings?.[keys.usernameLetterSpacing] || '1px',
    textTransform:      settings?.[keys.usernameTransform]     || 'uppercase',
    lineHeight:         settings?.[keys.usernameLineHeight]    || 'normal',
    amountPrefix:       settings?.[keys.amountPrefix]          ?? '฿',
    showExtraLabel:     settings?.[keys.showExtraLabel],
    extraLabelText:     settings?.[keys.extraLabelText]        || '',
    extraLabelColor:    settings?.[keys.extraLabelColor]       || 'rgba(255,255,255,0.6)',
    extraLabelFontSize: settings?.[keys.extraLabelFontSize]    || '11px',
    rankDef,
  };
};

// ─── Shared: text block ───────────────────────────────────────────────────────
const PodiumTextBlock = memo(({ name, amount, showAmount, cs, alignOverride }) => (
  <div style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: alignOverride ?? cs.textAlign }}>
    <div style={{
      fontSize: cs.usernameFontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily,
      color: cs.usernameColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      maxWidth: '100%', textTransform: cs.textTransform, letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight, ...cs.strokeStyle,
    }}>
      {name}
    </div>
    {showAmount && (
      <div style={{
        fontSize: cs.amountFontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily,
        color: cs.amountColor, marginTop: 4, ...cs.strokeStyle,
      }}>
        {cs.amountPrefix}{amount.toLocaleString()}
      </div>
    )}
    {cs.showExtraLabel && cs.extraLabelText && (
      <div style={{ fontSize: cs.extraLabelFontSize, color: cs.extraLabelColor, marginTop: 4, fontFamily: cs.fontFamily }}>
        {cs.extraLabelText}
      </div>
    )}
  </div>
));
PodiumTextBlock.displayName = 'PodiumTextBlock';

// ─── Shared: image + overlay bg layers ───────────────────────────────────────
const PodiumBgLayers = memo(({ cs }) => (
  <>
    {cs.imageUrl && (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${cs.imageUrl})`, backgroundSize: cs.imageFit,
        backgroundPosition: cs.imagePosition, backgroundRepeat: 'no-repeat',
        opacity: cs.imageOpacity, zIndex: 0,
      }} />
    )}
    {cs.showOverlay && (cs.imageUrl || cs.overlayOpacity > 0) && (
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
        background: `linear-gradient(${cs.overlayDirection}, ${cs.overlayColor}${Math.round(cs.overlayOpacity * 255).toString(16).padStart(2,'0')} 0%, transparent 100%)`,
        zIndex: 1, pointerEvents: 'none',
      }} />
    )}
  </>
));
PodiumBgLayers.displayName = 'PodiumBgLayers';

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 1 — "Classic"
// ══════════════════════════════════════════════════════════════════════════════
const PodiumCardClassic = memo(({ rank, name, amount, settings, highlightKey, animateEntries }) => {
  const keys = PODIUM_KEYS[rank];
  const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
  const cs = useCardSettings(rank, settings, keys);
  const clipPath = getPedestalClipPath(cs.pedestalShape);
  const rankDef = RANK_DEFAULTS[rank];
  const cardBackground = cs.backgroundColor || cs.pedestalColor || 'rgba(15,23,42,0.72)';

  return (
    <motion.div layout layoutId={`podium-classic-${rank}`}
      initial={animateEntries ? { opacity: 0, y: 20 } : false}
      animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none',
        borderRadius: cs.cardBorderRadius || 14, position: 'relative',
      }}
    >
      {cs.showBadge && (
        <div style={{ marginBottom: cs.badgeOffsetY - 8, zIndex: 2 }}>
          <PodiumBadge rank={rank} settings={settings} keys={keys} />
        </div>
      )}
      <div style={{
        width: '100%', height: cs.pedestalHeight,
        background: `linear-gradient(180deg, ${withAlpha(rankDef.accentColor, 0.12)} 0%, ${cardBackground} 28%, ${cardBackground} 100%)`,
        clipPath,
        border: `${cs.cardBorderWidth}px ${cs.cardBorderStyle} ${cs.cardBorderColor}`,
        borderTop: cs.showBadge ? 'none' : `${cs.cardBorderWidth}px ${cs.cardBorderStyle} ${cs.cardBorderColor}`,
        borderRadius: `${cs.cardBorderRadius || 14}px ${cs.cardBorderRadius || 14}px 4px 4px`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: cs.textVerticalAlign,
        padding: `18px ${Math.max(cs.cardPaddingX, 12)}px ${Math.max(cs.cardPaddingBottom, 22)}px`,
        position: 'relative', overflow: 'hidden',
        boxShadow: `0 18px 40px ${withAlpha(rankDef.accentColor, 0.16)}, inset 0 1px 0 rgba(255,255,255,0.10)`,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 12, right: 12, height: 3,
          borderRadius: 999, background: withAlpha(rankDef.accentColor, 0.9), opacity: 0.8,
        }} />
        <PodiumBgLayers cs={cs} />
        <PodiumTextBlock name={name} amount={amount} showAmount={settings?.showAmount} cs={cs} />
      </div>
      {cs.showPedestalBase && cs.pedestalBaseHeight > 0 && (
        <div style={{
          height: Math.max(cs.pedestalBaseHeight, 10), width: '100%',
          background: cs.pedestalBaseColor || 'rgba(255,255,255,0.05)',
          borderTop: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '0 0 4px 4px',
        }} />
      )}
    </motion.div>
  );
});
PodiumCardClassic.displayName = 'PodiumCardClassic';

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 2 — "Cards"
// ══════════════════════════════════════════════════════════════════════════════
const PodiumCardsItem = memo(({ rank, entry, settings, highlightKey, animateEntries }) => {
  const keys = PODIUM_KEYS[rank];
  const cs = useCardSettings(rank, settings, keys);
  const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
  const rankDef = RANK_DEFAULTS[rank];
  const cardBackground = cs.backgroundColor || cs.pedestalColor || 'rgba(15,23,42,0.74)';

  return (
    <motion.div layout layoutId={`podium-cards-${rank}`}
      initial={animateEntries ? { opacity: 0, x: -24 } : false}
      animate={animateEntries ? { opacity: 1, x: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 26, delay: (rank - 1) * 0.07 }}
      style={{
        display: 'grid', gridTemplateColumns: '76px 1fr', alignItems: 'stretch', position: 'relative',
        borderRadius: cs.cardBorderRadius || 12, overflow: 'hidden',
        border: `${cs.cardBorderWidth}px ${cs.cardBorderStyle} ${cs.cardBorderColor}`,
        background: `linear-gradient(135deg, ${withAlpha(rankDef.accentColor, 0.12)} 0%, ${cardBackground} 45%, ${cardBackground} 100%)`,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none',
        boxShadow: `0 14px 30px ${withAlpha(rankDef.accentColor, 0.12)}`,
      }}
    >
      <PodiumBgLayers cs={cs} />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 2, borderRight: `1px solid ${withAlpha(rankDef.accentColor, 0.18)}`,
        background: withAlpha(rankDef.accentColor, 0.08),
      }}>
        {cs.showBadge
          ? <PodiumBadge rank={rank} settings={settings} keys={keys} sizeOverride={48} />
          : <span style={{ fontSize: 28, fontWeight: '900', fontFamily: "'Teko','Rajdhani',sans-serif", color: rankDef.accentColor, lineHeight: 1 }}>{rank}</span>
        }
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <PodiumTextBlock name={entry.name} amount={entry.amount} showAmount={settings?.showAmount} cs={cs} alignOverride="left" />
      </div>
    </motion.div>
  );
});
PodiumCardsItem.displayName = 'PodiumCardsItem';

const PodiumCardsVariant = memo(({ podiumMap, settings, highlightKey, animateEntries }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[1, 2, 3].map(rank => {
      const entry = podiumMap[rank];
      if (!entry) return null;
      return (
        <PodiumCardsItem
          key={rank}
          rank={rank}
          entry={entry}
          settings={settings}
          highlightKey={highlightKey}
          animateEntries={animateEntries}
        />
      );
    })}
  </div>
));
PodiumCardsVariant.displayName = 'PodiumCardsVariant';

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 3 — "Floating"
// ══════════════════════════════════════════════════════════════════════════════
const PodiumFloatingItem = memo(({ rank, entry, settings, highlightKey, animateEntries }) => {
  const keys = PODIUM_KEYS[rank];
  const cs = useCardSettings(rank, settings, keys);
  const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
  const rankDef = RANK_DEFAULTS[rank];
  const barH = rank === 1 ? 112 : rank === 2 ? 82 : 70;
  const floatBadgeSize = rank === 1 ? 76 : 62;
  const cardBackground = cs.backgroundColor || cs.pedestalColor || 'rgba(15,23,42,0.70)';

  return (
    <motion.div layout layoutId={`podium-floating-${rank}`}
      initial={animateEntries ? { opacity: 0, y: 20 } : false}
      animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none', position: 'relative',
      }}
    >
      {cs.showBadge && (
        <motion.div
          initial={animateEntries ? { scale: 0.7, opacity: 0 } : false}
          animate={animateEntries ? { scale: 1, opacity: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          style={{ marginBottom: -12, zIndex: 3 }}
        >
          <PodiumBadge rank={rank} settings={settings} keys={keys} sizeOverride={floatBadgeSize} />
        </motion.div>
      )}
      <div style={{ width: '100%', textAlign: 'center', padding: '10px 6px 8px', zIndex: 2, position: 'relative' }}>
        <div style={{
          fontSize: cs.usernameFontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily,
          color: cs.usernameColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textTransform: cs.textTransform, letterSpacing: cs.letterSpacing, ...cs.strokeStyle,
        }}>
          {entry.name}
        </div>
        {settings?.showAmount && (
          <div style={{
            fontSize: cs.amountFontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily,
            color: cs.amountColor, marginTop: 3, ...cs.strokeStyle,
          }}>
            {cs.amountPrefix}{entry.amount.toLocaleString()}
          </div>
        )}
      </div>
      <div style={{
        width: '100%', height: barH, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(180deg, ${withAlpha(rankDef.accentColor, 0.14)} 0%, ${cardBackground} 100%)`,
        border: `1px solid ${withAlpha(rankDef.accentColor, 0.22)}`,
        borderTop: `3px solid ${rankDef.accentColor}`,
        borderRadius: '12px 12px 4px 4px',
        boxShadow: `0 16px 34px ${withAlpha(rankDef.accentColor, 0.12)}`,
      }}>
        <PodiumBgLayers cs={cs} />
      </div>
      {cs.showPedestalBase && cs.pedestalBaseHeight > 0 && (
        <div style={{ height: Math.max(cs.pedestalBaseHeight, 8), width: '100%', background: cs.pedestalBaseColor || 'rgba(255,255,255,0.05)' }} />
      )}
    </motion.div>
  );
});
PodiumFloatingItem.displayName = 'PodiumFloatingItem';

const PodiumFloatingVariant = memo(({ podiumMap, settings, highlightKey, animateEntries }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'end' }}>
    {[2, 1, 3].map(rank => {
      const entry = podiumMap[rank];
      if (!entry) return <div key={rank} />;
      return (
        <PodiumFloatingItem
          key={rank}
          rank={rank}
          entry={entry}
          settings={settings}
          highlightKey={highlightKey}
          animateEntries={animateEntries}
        />
      );
    })}
  </div>
));
PodiumFloatingVariant.displayName = 'PodiumFloatingVariant';

const PodiumSpotlightHero = memo(({ entry, settings, highlightKey, animateEntries }) => {
  const rank = 1;
  const keys = PODIUM_KEYS[rank];
  const cs = useCardSettings(rank, settings, keys);
  const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
  const rankDef = RANK_DEFAULTS[rank];
  const cardBackground = cs.backgroundColor || cs.pedestalColor || 'rgba(15,23,42,0.76)';

  return (
    <motion.div
      layout
      layoutId="podium-spotlight-1"
      initial={animateEntries ? { opacity: 0, scale: 0.97, y: 18 } : false}
      animate={animateEntries ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 16,
        minHeight: 148, padding: '22px 22px',
        display: 'grid', gridTemplateColumns: '96px 1fr', gap: 18, alignItems: 'center',
        background: `linear-gradient(135deg, ${withAlpha(rankDef.accentColor, 0.10)} 0%, ${cardBackground} 34%, ${cardBackground} 100%)`,
        border: `1px solid ${withAlpha(rankDef.accentColor, 0.26)}`,
        boxShadow: `0 22px 48px ${withAlpha(rankDef.accentColor, 0.14)}`,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.65)' : 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${withAlpha(rankDef.accentColor, 0.08)} 0%, transparent 48%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
        <PodiumBadge rank={rank} settings={settings} keys={keys} sizeOverride={88} />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', marginBottom: 8, padding: '4px 10px', borderRadius: 999,
          background: withAlpha(rankDef.accentColor, 0.14),
          color: rankDef.accentColor, fontSize: 11, fontWeight: 900, letterSpacing: 0.8,
        }}>
          TOP SUPPORTER
        </div>
        <PodiumTextBlock name={entry.name} amount={entry.amount} showAmount={settings?.showAmount} cs={cs} alignOverride="left" />
      </div>
    </motion.div>
  );
});
PodiumSpotlightHero.displayName = 'PodiumSpotlightHero';

const PodiumSpotlightVariant = memo(({ podiumMap, settings, highlightKey, animateEntries }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {podiumMap[1] && (
      <PodiumSpotlightHero entry={podiumMap[1]} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
    )}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[2, 3].map(rank => {
        const entry = podiumMap[rank];
        if (!entry) return <div key={rank} />;
        return (
          <PodiumCardsItem
            key={rank}
            rank={rank}
            entry={entry}
            settings={settings}
            highlightKey={highlightKey}
            animateEntries={animateEntries}
          />
        );
      })}
    </div>
  </div>
));
PodiumSpotlightVariant.displayName = 'PodiumSpotlightVariant';

const PodiumNeonStepsItem = memo(({ rank, entry, settings, highlightKey, animateEntries }) => {
  const keys = PODIUM_KEYS[rank];
  const cs = useCardSettings(rank, settings, keys);
  const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
  const rankDef = RANK_DEFAULTS[rank];
  const stepHeight = rank === 1 ? 164 : rank === 2 ? 126 : 104;
  const cardBackground = cs.backgroundColor || cs.pedestalColor || 'rgba(15,23,42,0.74)';

  return (
    <motion.div
      layout
      layoutId={`podium-neon-${rank}`}
      initial={animateEntries ? { opacity: 0, y: 24 } : false}
      animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 290, damping: 24, delay: rank * 0.04 }}
      style={{ alignSelf: 'end', position: 'relative', minWidth: 0, outline: isHighlight ? '2px solid rgba(245,158,11,0.65)' : 'none' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: -12, position: 'relative', zIndex: 3 }}>
        <PodiumBadge rank={rank} settings={settings} keys={keys} sizeOverride={rank === 1 ? 72 : 58} />
      </div>
      <div style={{
        height: stepHeight, borderRadius: '14px 14px 4px 4px', padding: '30px 12px 14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(180deg, ${withAlpha(rankDef.accentColor, 0.18)} 0%, ${cardBackground} 38%, ${cardBackground} 100%)`,
        border: `1px solid ${withAlpha(rankDef.accentColor, 0.26)}`,
        boxShadow: `0 18px 42px ${withAlpha(rankDef.accentColor, 0.12)}`,
      }}>
        <div style={{
          position: 'absolute', left: 12, right: 12, top: 10, height: 2,
          borderRadius: 999, background: rankDef.accentColor, opacity: 0.85,
        }} />
        <PodiumTextBlock name={entry.name} amount={entry.amount} showAmount={settings?.showAmount} cs={cs} />
      </div>
    </motion.div>
  );
});
PodiumNeonStepsItem.displayName = 'PodiumNeonStepsItem';

const PodiumNeonStepsVariant = memo(({ podiumMap, settings, highlightKey, animateEntries }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.12fr 1fr', gap: 10, alignItems: 'end', paddingTop: 8 }}>
    {[2, 1, 3].map(rank => {
      const entry = podiumMap[rank];
      if (!entry) return <div key={rank} />;
      return (
        <PodiumNeonStepsItem
          key={rank}
          rank={rank}
          entry={entry}
          settings={settings}
          highlightKey={highlightKey}
          animateEntries={animateEntries}
        />
      );
    })}
  </div>
));
PodiumNeonStepsVariant.displayName = 'PodiumNeonStepsVariant';

const PodiumCompactBadgeItem = memo(({ rank, entry, settings, highlightKey, animateEntries }) => {
  const keys = PODIUM_KEYS[rank];
  const cs = useCardSettings(rank, settings, keys);
  const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
  const rankDef = RANK_DEFAULTS[rank];

  return (
    <motion.div
      layout
      layoutId={`podium-compact-${rank}`}
      initial={animateEntries ? { opacity: 0, y: 12 } : false}
      animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      style={{
        minWidth: 0, padding: '14px 10px', borderRadius: 14, textAlign: 'center',
        background: `linear-gradient(180deg, ${withAlpha(rankDef.accentColor, 0.12)} 0%, rgba(15,23,42,0.52) 100%)`,
        border: `1px solid ${withAlpha(rankDef.accentColor, 0.22)}`,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.65)' : 'none',
        boxShadow: `0 12px 26px ${withAlpha(rankDef.accentColor, 0.10)}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <PodiumBadge rank={rank} settings={settings} keys={keys} sizeOverride={rank === 1 ? 68 : 56} />
      </div>
      <PodiumTextBlock name={entry.name} amount={entry.amount} showAmount={settings?.showAmount} cs={cs} />
    </motion.div>
  );
});
PodiumCompactBadgeItem.displayName = 'PodiumCompactBadgeItem';

const PodiumCompactBadgesVariant = memo(({ podiumMap, settings, highlightKey, animateEntries }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'stretch' }}>
    {[2, 1, 3].map(rank => {
      const entry = podiumMap[rank];
      if (!entry) return <div key={rank} />;
      return (
        <PodiumCompactBadgeItem
          key={rank}
          rank={rank}
          entry={entry}
          settings={settings}
          highlightKey={highlightKey}
          animateEntries={animateEntries}
        />
      );
    })}
  </div>
));
PodiumCompactBadgesVariant.displayName = 'PodiumCompactBadgesVariant';

// ─── TitleBlock ────────────────────────────────────────────────────────────────
const TitleBlock = memo(({ settings, highlightKey }) => {
  const isHighlight = useHighlight(highlightKey, [
    'titleText','titleColor','titleFontFamily','titleFontWeight',
    'titleFontSize','titleAlignment','titleStrokeWidth','titleStrokeColor',
  ]);
  const timeRangeLabel = getTimeRangeLabel(settings?.timeRange);
  return (
    <div style={{
      marginBottom: 22, textAlign: settings?.titleAlignment || 'center',
      outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none',
      borderRadius: 8, padding: '2px 0',
    }}>
      <div style={{
        fontSize: settings?.titleFontSize || 22,
        fontWeight: normalizeFontWeight(settings?.titleFontWeight) || '500',
        fontFamily: resolvePreviewFontFamily(settings?.titleFontFamily),
        color: settings?.titleColor || 'var(--color-text-primary, #111)',
        lineHeight: 1.05,
        ...getStrokeStyle(settings?.titleStrokeWidth, settings?.titleStrokeColor),
      }}>
        {settings?.titleText || 'Top Donors'}
      </div>
      {timeRangeLabel && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 8, padding: '3px 10px', borderRadius: 999,
          background: withAlpha(settings?.accentColor || '#f59e0b', 0.14),
          border: `1px solid ${withAlpha(settings?.accentColor || '#f59e0b', 0.24)}`,
          fontSize: 12, fontWeight: 700, color: withAlpha(settings?.accentColor || '#f59e0b', 0.95),
        }}>
          {timeRangeLabel}
        </div>
      )}
    </div>
  );
});
TitleBlock.displayName = 'TitleBlock';

// ─── ListItem ──────────────────────────────────────────────────────────────────
// ✅ รองรับการเปิด/ปิดพื้นหลังผ่าน listShowBackground และ listBackgroundColor
const ListItem = memo(({ entry, settings, highlightKey, animateEntries }) => {
  const isHighlight = useHighlight(highlightKey, [
    'listFontFamily','listFontWeight','listFontSize','listColor',
    'listAmountColor','listStrokeWidth','listStrokeColor',
    'showRank','showAvatar','showAmount',
    'listShowBackground','listBackgroundColor','listBorderColor',
  ]);
  const strokeStyle  = getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor);
  const showBg       = settings?.listShowBackground === true;
  const accentColor  = settings?.accentColor || '#f59e0b';
  const tone         = getRankTone(entry.rank, accentColor);
  const bgColor      = showBg ? (settings?.listBackgroundColor || 'rgba(0,0,0,0.08)') : 'rgba(15,23,42,0.34)';
  const borderColor  = settings?.listBorderColor || 'rgba(0,0,0,0.12)';

  return (
    <motion.div layout layoutId={`list-${entry.rank}`}
      initial={animateEntries ? { opacity: 0, y: 14 } : false}
      animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 13px', borderRadius: 8,
        background: showBg
          ? `linear-gradient(90deg, ${tone.soft} 0%, ${bgColor} 42%, rgba(15,23,42,0.08) 100%)`
          : 'transparent',
        border: `1px solid ${isHighlight ? 'rgba(245,158,11,0.6)' : showBg ? borderColor : 'transparent'}`,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.3)' : 'none',
        boxShadow: showBg && entry.rank <= 3 ? `0 10px 28px ${withAlpha(tone.main, 0.13)}` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
        borderRadius: '0 999px 999px 0', background: tone.main,
      }} />
      {settings?.showRank && (
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: withAlpha(tone.main, entry.rank <= 3 ? 0.22 : 0.12),
          border: `1px solid ${withAlpha(tone.main, 0.36)}`,
          fontSize: 13, fontWeight: 900, color: tone.main, textAlign: 'center', flexShrink: 0,
        }}>
          {entry.rank}
        </div>
      )}
      {settings?.showAvatar && (
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 25%, #ffffff 0%, ${withAlpha(tone.main, 0.72)} 35%, ${withAlpha(tone.main, 0.32)} 100%)`,
          border: `1px solid ${withAlpha(tone.main, 0.42)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 18px ${withAlpha(tone.main, 0.18)}`,
          fontSize: 12, fontWeight: 900, color: '#0f172a', flexShrink: 0,
        }}>
          {entry.name[0]?.toUpperCase()}
        </div>
      )}
      <span style={{
        fontSize: settings?.listFontSize, fontFamily: resolvePreviewFontFamily(settings?.listFontFamily),
        fontWeight: normalizeFontWeight(settings?.listFontWeight),
        color: settings?.listColor || 'var(--color-text-primary, #111)',
        flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        ...strokeStyle,
      }}>
        {entry.name}
      </span>
      {settings?.showAmount && (
        <span style={{
          fontSize: settings?.listFontSize, fontFamily: resolvePreviewFontFamily(settings?.listFontFamily),
          fontWeight: normalizeFontWeight(settings?.listFontWeight),
          color: settings?.listAmountColor || 'var(--color-text-primary, #111)',
          flexShrink: 0, ...strokeStyle,
        }}>
          {formatAmount(entry.amount)}
        </span>
      )}
    </motion.div>
  );
});
ListItem.displayName = 'ListItem';

// ─── HorizontalItem ────────────────────────────────────────────────────────────
const HorizontalItem = memo(({ entry, settings, highlightKey, animateEntries, maxAmount }) => {
  const isHighlight = useHighlight(highlightKey, [
    'listFontFamily','listFontWeight','listFontSize','listColor',
    'listAmountColor','listStrokeWidth','listStrokeColor',
    'showRank','showAvatar','showAmount','accentColor',
    'listShowBackground','listBackgroundColor','listBorderColor',
  ]);
  const strokeStyle  = getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor);
  const accentColor  = settings?.accentColor || '#EF9F27';
  const tone         = getRankTone(entry.rank, accentColor);
  const barWidth     = Math.max(15, (entry.amount / maxAmount) * 100);
  const showBg       = settings?.listShowBackground === true;
  const bgColor      = showBg ? (settings?.listBackgroundColor || 'rgba(0,0,0,0.08)') : 'rgba(15,23,42,0.34)';
  const borderColor  = settings?.listBorderColor || 'rgba(0,0,0,0.12)';

  return (
    <motion.div layout layoutId={`horizontal-${entry.rank}`}
      initial={animateEntries ? { opacity: 0, x: -20 } : false}
      animate={animateEntries ? { opacity: 1, x: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 8,
        background: showBg
          ? `linear-gradient(135deg, ${bgColor} 0%, ${withAlpha(tone.main, 0.10)} 100%)`
          : 'transparent',
        border: `1px solid ${isHighlight ? 'rgba(245,158,11,0.6)' : showBg ? borderColor : 'transparent'}`,
        boxShadow: showBg ? `0 10px 28px ${withAlpha(tone.main, entry.rank <= 3 ? 0.16 : 0.08)}` : 'none',
      }}
    >
      {settings?.showRank && (
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 900, color: tone.main,
          background: withAlpha(tone.main, 0.16),
          border: `1px solid ${withAlpha(tone.main, 0.32)}`,
          flexShrink: 0,
        }}>{entry.rank}</div>
      )}
      {settings?.showAvatar && (
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: `linear-gradient(135deg, ${withAlpha(tone.main, 0.95)}, ${withAlpha(accentColor, 0.38)})`,
          border: `1px solid ${withAlpha(tone.main, 0.42)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0,
        }}>
          {entry.name[0]?.toUpperCase()}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 8 }}>
          <span style={{
            fontSize: settings?.listFontSize, fontFamily: resolvePreviewFontFamily(settings?.listFontFamily),
            fontWeight: normalizeFontWeight(settings?.listFontWeight),
            color: settings?.listColor || '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            ...strokeStyle,
          }}>{entry.name}</span>
          {settings?.showAmount && (
            <span style={{
              fontSize: settings?.listFontSize, fontFamily: resolvePreviewFontFamily(settings?.listFontFamily),
              fontWeight: normalizeFontWeight(settings?.listFontWeight),
              color: settings?.listAmountColor || '#111', flexShrink: 0, ...strokeStyle,
            }}>{formatAmount(entry.amount)}</span>
          )}
        </div>
        <div style={{
          height: 9, borderRadius: 999, background: 'rgba(15,23,42,0.24)', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.22)',
        }}>
          <motion.div
            style={{
              height: '100%', borderRadius: 999,
              background: `linear-gradient(90deg, ${withAlpha(tone.main, 0.82)} 0%, ${accentColor} 65%, rgba(255,255,255,0.92) 100%)`,
              boxShadow: `0 0 18px ${withAlpha(tone.main, 0.42)}`,
            }}
            initial={animateEntries ? { width: 0 } : { width: `${barWidth}%` }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
});
HorizontalItem.displayName = 'HorizontalItem';

// ─── Main LeaderboardPreview ──────────────────────────────────────────────────
function LeaderboardPreview({ settings: settingsProp, entries = SAMPLE_LEADERBOARD, highlightKey }) {
  const { settings: contextSettings } = useOptionalLeaderboardSettings() || {};
  const settings = settingsProp ?? contextSettings ?? {};
  const displayedEntries = useMemo(() => entries.slice(0, settings.maxEntries || 5), [entries, settings.maxEntries]);
  const isHorizontal  = settings.layoutStyle === 'horizontal';
  const isPodium      = settings.layoutStyle === 'podium' || !settings.layoutStyle;
  const animateEntries = settings.animateEntries;
  const enabled       = settings.enabled !== false;
  const maxAmount     = useMemo(() => Math.max(...displayedEntries.map(e => e.amount), 1), [displayedEntries]);
  const podiumMap     = useMemo(() => Object.fromEntries(displayedEntries.map(e => [e.rank, e])), [displayedEntries]);
  const restEntries   = useMemo(() => displayedEntries.filter(e => e.rank > 3), [displayedEntries]);
  const showBackground = settings.showBackground !== false;

  const podiumVariant = settings.podiumLayoutVariant || 'classic';

  useEffect(() => {
    [
      settings.titleFontFamily,
      settings.listFontFamily,
      settings.podiumFirstFontFamily,
      settings.podiumSecondFontFamily,
      settings.podiumThirdFontFamily,
    ].forEach((fontId) => {
      const cssFamily = resolvePreviewFontFamily(fontId);
      const familyName = cssFamily.split(',')[0]?.replace(/['"]/g, '').trim();
      injectFontFamily(familyName);
    });

    if (!document.getElementById('leaderboard-preview-anim')) {
      const style = document.createElement('style');
      style.id = 'leaderboard-preview-anim';
      style.innerHTML = `
        @keyframes lbPulse {
          0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
          50%  { box-shadow: 0 0 0 12px rgba(245,158,11,0.08); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        @keyframes pulseShine {
          0%   { opacity: 0.2; transform: scale(0.95); }
          50%  { opacity: 0.6; transform: scale(1.08); }
          100% { opacity: 0.2; transform: scale(0.95); }
        }
        @keyframes lbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `;
      document.head.appendChild(style);
    }
  }, [
    settings.titleFontFamily,
    settings.listFontFamily,
    settings.podiumFirstFontFamily,
    settings.podiumSecondFontFamily,
    settings.podiumThirdFontFamily,
  ]);

  if (!enabled) {
    return (
      <div style={{ borderRadius: 16, border: '1px dashed rgba(100,116,139,0.5)', background: 'rgba(15,23,42,0.95)', padding: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>Leaderboard is disabled</p>
        <p style={{ marginTop: 8, fontSize: 14, color: '#94a3b8' }}>เปิดใช้งานเพื่อดูตัวอย่างการปรับแต่งทั้งหมด</p>
      </div>
    );
  }

  const renderListItems = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {displayedEntries.map(entry => (
        <ListItem key={entry.rank} entry={entry} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
      ))}
    </div>
  );

  const renderHorizontal = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {displayedEntries.map(entry => (
        <HorizontalItem key={entry.rank} entry={entry} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} maxAmount={maxAmount} />
      ))}
    </div>
  );

  const RestList = () => restEntries.length > 0 ? (
    <>
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${withAlpha(settings?.accentColor || '#f59e0b', 0.28)}, transparent)`,
        margin: '16px 0 12px',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {restEntries.map(entry => (
          <ListItem key={entry.rank} entry={entry} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
        ))}
      </div>
    </>
  ) : null;

  const renderPodium = () => {
    if (podiumVariant === 'spotlight') {
      return (
        <div>
          <PodiumSpotlightVariant podiumMap={podiumMap} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
          <RestList />
        </div>
      );
    }
    if (podiumVariant === 'neon_steps') {
      return (
        <div>
          <PodiumNeonStepsVariant podiumMap={podiumMap} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
          <RestList />
        </div>
      );
    }
    if (podiumVariant === 'compact_badges') {
      return (
        <div>
          <PodiumCompactBadgesVariant podiumMap={podiumMap} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
          <RestList />
        </div>
      );
    }
    if (podiumVariant === 'cards') {
      return (
        <div>
          <PodiumCardsVariant podiumMap={podiumMap} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
          <RestList />
        </div>
      );
    }
    if (podiumVariant === 'floating') {
      return (
        <div>
          <PodiumFloatingVariant podiumMap={podiumMap} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
          <RestList />
        </div>
      );
    }
    return (
      <div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, alignItems: 'end',
          marginBottom: 8, padding: '10px 8px 0',
          background: `radial-gradient(circle at 50% 8%, ${withAlpha(settings?.accentColor || '#f59e0b', 0.16)}, transparent 45%)`,
          borderRadius: 8,
        }}>
          {[2, 1, 3].map(rank => {
            const e = podiumMap[rank];
            if (!e) return <div key={rank} />;
            return (
              <PodiumCardClassic key={rank} rank={rank} name={e.name} amount={e.amount}
                settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
            );
          })}
        </div>
        <RestList />
      </div>
    );
  };

  return (
    <div style={{
      padding: '1.35rem',
      borderRadius: 8,
      background: showBackground
        ? `linear-gradient(145deg, ${settings?.backgroundColor || '#111827'} 0%, rgba(15,23,42,0.72) 100%)`
        : 'transparent',
      border: showBackground ? `1px solid ${withAlpha(settings?.accentColor || '#f59e0b', 0.18)}` : '1px solid transparent',
      boxShadow: showBackground ? `0 24px 70px ${withAlpha(settings?.accentColor || '#f59e0b', 0.10)}` : 'none',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(115deg, transparent 0%, ${withAlpha(settings?.accentColor || '#f59e0b', 0.10)} 48%, transparent 82%)`,
        opacity: showBackground ? 0.8 : 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <TitleBlock settings={settings} highlightKey={highlightKey} />
      {isHorizontal && renderHorizontal()}
      {!isHorizontal && !isPodium && renderListItems()}
      {isPodium && renderPodium()}
      </div>
    </div>
  );
}

const MemoizedLeaderboardPreview = memo(LeaderboardPreview);
MemoizedLeaderboardPreview.displayName = 'LeaderboardPreview';

export default MemoizedLeaderboardPreview;






