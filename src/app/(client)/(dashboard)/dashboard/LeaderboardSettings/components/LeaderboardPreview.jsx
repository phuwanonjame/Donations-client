'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { timeRanges as TIME_RANGES } from '../constants/donate-leaderboard';

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
      k('CardPaddingX'), k('CardPaddingBottom'),
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
    fontFamily:         settings?.[keys.fontFamily]         || "'Rajdhani',sans-serif",
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
  const boxShadow = cs.glowBlur > 0 ? `0 0 ${cs.glowBlur}px ${cs.glowColor}` : 'none';

  return (
    <motion.div layout layoutId={`podium-classic-${rank}`}
      initial={animateEntries ? { opacity: 0, y: 20 } : false}
      animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none',
        borderRadius: cs.cardBorderRadius, position: 'relative',
      }}
    >
      {cs.showShine && (
        <div style={{
          position: 'absolute', top: -30, left: -30, right: -30, bottom: -30,
          borderRadius: '50%', pointerEvents: 'none', zIndex: -1, animation: 'pulseShine 2s infinite',
          background: `radial-gradient(circle, ${cs.glowColor.replace(')', ',0.35)').replace('rgba','rgba')} 0%, transparent 70%)`,
        }} />
      )}
      {cs.showBadge && (
        <div style={{ marginBottom: cs.badgeOffsetY, zIndex: 2 }}>
          <PodiumBadge rank={rank} settings={settings} keys={keys} />
        </div>
      )}
      <div style={{
        width: '100%', height: cs.pedestalHeight, background: cs.pedestalColor,
        clipPath,
        border: `${cs.cardBorderWidth}px ${cs.cardBorderStyle} ${cs.cardBorderColor}`,
        borderTop: cs.showBadge ? 'none' : `${cs.cardBorderWidth}px ${cs.cardBorderStyle} ${cs.cardBorderColor}`,
        borderRadius: cs.cardBorderRadius,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: cs.textVerticalAlign,
        padding: `12px ${cs.cardPaddingX}px ${cs.cardPaddingBottom}px`,
        boxShadow, position: 'relative', overflow: 'hidden',
      }}>
        <PodiumBgLayers cs={cs} />
        <PodiumTextBlock name={name} amount={amount} showAmount={settings?.showAmount} cs={cs} />
      </div>
      {cs.showPedestalBase && cs.pedestalBaseHeight > 0 && (
        <div style={{ height: cs.pedestalBaseHeight, width: '100%', background: cs.pedestalBaseColor, borderTop: '1px solid rgba(255,255,255,0.15)' }} />
      )}
    </motion.div>
  );
});
PodiumCardClassic.displayName = 'PodiumCardClassic';

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 2 — "Cards"
// ══════════════════════════════════════════════════════════════════════════════
const PodiumCardsVariant = memo(({ podiumMap, settings, highlightKey, animateEntries }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[1, 2, 3].map(rank => {
      const e = podiumMap[rank];
      if (!e) return null;
      const keys = PODIUM_KEYS[rank];
      const cs = useCardSettings(rank, settings, keys);
      const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
      const rankDef = RANK_DEFAULTS[rank];
      const boxShadow = cs.glowBlur > 0 ? `0 0 ${cs.glowBlur}px ${cs.glowColor}` : 'none';
      const badgeColW = 64;

      return (
        <motion.div key={rank} layout layoutId={`podium-cards-${rank}`}
          initial={animateEntries ? { opacity: 0, x: -24 } : false}
          animate={animateEntries ? { opacity: 1, x: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 300, damping: 26, delay: (rank - 1) * 0.07 }}
          style={{
            display: 'flex', alignItems: 'stretch', position: 'relative',
            borderRadius: cs.cardBorderRadius || 10, overflow: 'hidden',
            border: `${cs.cardBorderWidth}px ${cs.cardBorderStyle} ${cs.cardBorderColor}`,
            boxShadow, outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none',
            background: cs.pedestalColor,
          }}
        >
          <PodiumBgLayers cs={cs} />
          <div style={{
            width: badgeColW, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 2,
            borderRight: `${cs.cardBorderWidth}px ${cs.cardBorderStyle} ${cs.cardBorderColor}`,
          }}>
            {cs.showBadge
              ? <PodiumBadge rank={rank} settings={settings} keys={keys} sizeOverride={52} />
              : <span style={{ fontSize: 36, fontWeight: '900', fontFamily: "'Teko','Rajdhani',sans-serif", color: rankDef.accentColor, lineHeight: 1 }}>{rank}</span>
            }
          </div>
          <div style={{ flex: 1, padding: `14px ${cs.cardPaddingX}px 14px 16px`, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <PodiumTextBlock name={e.name} amount={e.amount} showAmount={settings?.showAmount} cs={cs} alignOverride="left" />
          </div>
          <div style={{ width: 4, background: rankDef.accentColor, opacity: 0.85, flexShrink: 0, zIndex: 2 }} />
        </motion.div>
      );
    })}
  </div>
));
PodiumCardsVariant.displayName = 'PodiumCardsVariant';

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 3 — "Floating"
// ══════════════════════════════════════════════════════════════════════════════
const PodiumFloatingVariant = memo(({ podiumMap, settings, highlightKey, animateEntries }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'end' }}>
    {[2, 1, 3].map(rank => {
      const e = podiumMap[rank];
      if (!e) return <div key={rank} />;
      const keys = PODIUM_KEYS[rank];
      const cs = useCardSettings(rank, settings, keys);
      const isHighlight = useHighlight(highlightKey, keys.highlightKeys);
      const rankDef = RANK_DEFAULTS[rank];
      const barH = rank === 1 ? 120 : rank === 2 ? 80 : 60;
      const boxShadow = cs.glowBlur > 0 ? `0 0 ${cs.glowBlur}px ${cs.glowColor}` : 'none';
      const floatBadgeSize = rank === 1 ? 80 : 66;

      return (
        <motion.div key={rank} layout layoutId={`podium-floating-${rank}`}
          initial={animateEntries ? { opacity: 0, y: 20 } : false}
          animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
            outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none',
            position: 'relative',
          }}
        >
          {cs.showBadge && (
            <motion.div
              initial={animateEntries ? { scale: 0.6, opacity: 0 } : false}
              animate={animateEntries ? { scale: 1, opacity: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
              style={{ marginBottom: -10, zIndex: 3 }}
            >
              <PodiumBadge rank={rank} settings={settings} keys={keys} sizeOverride={floatBadgeSize} />
            </motion.div>
          )}
          <div style={{ width: '100%', textAlign: 'center', padding: '8px 4px 6px', zIndex: 2, position: 'relative' }}>
            <div style={{
              fontSize: cs.usernameFontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily,
              color: cs.usernameColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              textTransform: cs.textTransform, letterSpacing: cs.letterSpacing, ...cs.strokeStyle,
            }}>
              {e.name}
            </div>
            {settings?.showAmount && (
              <div style={{
                fontSize: cs.amountFontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily,
                color: cs.amountColor, marginTop: 2, ...cs.strokeStyle,
              }}>
                {cs.amountPrefix}{e.amount.toLocaleString()}
              </div>
            )}
            {cs.showExtraLabel && cs.extraLabelText && (
              <div style={{ fontSize: cs.extraLabelFontSize, color: cs.extraLabelColor, marginTop: 2, fontFamily: cs.fontFamily }}>
                {cs.extraLabelText}
              </div>
            )}
          </div>
          <div style={{
            width: '100%', height: barH, position: 'relative', overflow: 'hidden',
            background: cs.pedestalColor,
            borderTop: `3px solid ${rankDef.accentColor}`,
            borderRadius: cs.cardBorderRadius ? `${cs.cardBorderRadius}px ${cs.cardBorderRadius}px 0 0` : '4px 4px 0 0',
            boxShadow,
          }}>
            <PodiumBgLayers cs={cs} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: rankDef.accentColor, zIndex: 2 }} />
          </div>
          {cs.showPedestalBase && cs.pedestalBaseHeight > 0 && (
            <div style={{ height: cs.pedestalBaseHeight, width: '100%', background: cs.pedestalBaseColor }} />
          )}
        </motion.div>
      );
    })}
  </div>
));
PodiumFloatingVariant.displayName = 'PodiumFloatingVariant';

// ─── TitleBlock ────────────────────────────────────────────────────────────────
const TitleBlock = memo(({ settings, highlightKey }) => {
  const isHighlight = useHighlight(highlightKey, [
    'titleText','titleColor','titleFontFamily','titleFontWeight',
    'titleFontSize','titleAlignment','titleStrokeWidth','titleStrokeColor',
  ]);
  const timeRangeLabel = getTimeRangeLabel(settings?.timeRange);
  return (
    <div style={{
      marginBottom: 28, textAlign: settings?.titleAlignment || 'center',
      outline: isHighlight ? '2px solid rgba(245,158,11,0.6)' : 'none',
      borderRadius: 8, padding: '4px 0',
    }}>
      <div style={{
        fontSize: settings?.titleFontSize || 22,
        fontWeight: normalizeFontWeight(settings?.titleFontWeight) || '500',
        fontFamily: settings?.titleFontFamily,
        color: settings?.titleColor || 'var(--color-text-primary, #111)',
        letterSpacing: '-0.3px',
        ...getStrokeStyle(settings?.titleStrokeWidth, settings?.titleStrokeColor),
      }}>
        {settings?.titleText || 'Top Donors'}
      </div>
      {timeRangeLabel && (
        <div style={{ fontSize: 13, color: 'var(--color-text-tertiary, #888)', marginTop: 4 }}>
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
  const bgColor      = showBg ? (settings?.listBackgroundColor || 'rgba(0,0,0,0.08)') : 'transparent';
  const borderColor  = settings?.listBorderColor || 'rgba(0,0,0,0.12)';

  return (
    <motion.div layout layoutId={`list-${entry.rank}`}
      initial={animateEntries ? { opacity: 0, y: 14 } : false}
      animate={animateEntries ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 8,
        background: bgColor,
        border: `0.5px solid ${isHighlight ? 'rgba(245,158,11,0.6)' : borderColor}`,
        outline: isHighlight ? '2px solid rgba(245,158,11,0.3)' : 'none',
      }}
    >
      {settings?.showRank && (
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-tertiary, #888)', width: 18, textAlign: 'center', flexShrink: 0 }}>
          {entry.rank}
        </div>
      )}
      {settings?.showAvatar && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--color-background-secondary, #f5f5f5)',
          border: '0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.12))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary, #555)', flexShrink: 0,
        }}>
          {entry.name[0]?.toUpperCase()}
        </div>
      )}
      <span style={{
        fontSize: settings?.listFontSize, fontFamily: settings?.listFontFamily,
        fontWeight: normalizeFontWeight(settings?.listFontWeight),
        color: settings?.listColor || 'var(--color-text-primary, #111)',
        flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        ...strokeStyle,
      }}>
        {entry.name}
      </span>
      {settings?.showAmount && (
        <span style={{
          fontSize: settings?.listFontSize, fontFamily: settings?.listFontFamily,
          fontWeight: normalizeFontWeight(settings?.listFontWeight),
          color: settings?.listAmountColor || 'var(--color-text-primary, #111)',
          flexShrink: 0, ...strokeStyle,
        }}>
          ฿{entry.amount.toLocaleString()}
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
  const barWidth     = Math.max(15, (entry.amount / maxAmount) * 100);
  const showBg       = settings?.listShowBackground === true;
  const bgColor      = showBg ? (settings?.listBackgroundColor || 'rgba(0,0,0,0.08)') : 'transparent';
  const borderColor  = settings?.listBorderColor || 'rgba(0,0,0,0.12)';

  return (
    <motion.div layout layoutId={`horizontal-${entry.rank}`}
      initial={animateEntries ? { opacity: 0, x: -20 } : false}
      animate={animateEntries ? { opacity: 1, x: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 8,
        background: bgColor,
        border: `0.5px solid ${isHighlight ? 'rgba(245,158,11,0.6)' : borderColor}`,
      }}
    >
      {settings?.showRank && (
        <div style={{ fontSize: 13, fontWeight: 500, color: '#888', width: 18, textAlign: 'center', flexShrink: 0 }}>{entry.rank}</div>
      )}
      {settings?.showAvatar && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: '#f5f5f5',
          border: '0.5px solid rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 500, color: '#555', flexShrink: 0,
        }}>
          {entry.name[0]?.toUpperCase()}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 8 }}>
          <span style={{
            fontSize: settings?.listFontSize, fontFamily: settings?.listFontFamily,
            fontWeight: normalizeFontWeight(settings?.listFontWeight),
            color: settings?.listColor || '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            ...strokeStyle,
          }}>{entry.name}</span>
          {settings?.showAmount && (
            <span style={{
              fontSize: settings?.listFontSize, fontFamily: settings?.listFontFamily,
              fontWeight: normalizeFontWeight(settings?.listFontWeight),
              color: settings?.listAmountColor || '#111', flexShrink: 0, ...strokeStyle,
            }}>฿{entry.amount.toLocaleString()}</span>
          )}
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 2, background: accentColor }}
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
function LeaderboardPreview({ settings = {}, entries = SAMPLE_LEADERBOARD, highlightKey }) {
  const displayedEntries = useMemo(() => entries.slice(0, settings.maxEntries || 5), [entries, settings.maxEntries]);
  const isHorizontal  = settings.layoutStyle === 'horizontal';
  const isPodium      = settings.layoutStyle === 'podium' || !settings.layoutStyle;
  const animateEntries = settings.animateEntries;
  const enabled       = settings.enabled !== false;
  const maxAmount     = useMemo(() => Math.max(...displayedEntries.map(e => e.amount), 1), [displayedEntries]);
  const podiumMap     = useMemo(() => Object.fromEntries(displayedEntries.map(e => [e.rank, e])), [displayedEntries]);
  const restEntries   = useMemo(() => displayedEntries.filter(e => e.rank > 3), [displayedEntries]);

  const podiumVariant = settings.podiumLayoutVariant || 'classic';

  useEffect(() => {
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
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!enabled) {
    return (
      <div style={{ borderRadius: 16, border: '1px dashed rgba(100,116,139,0.5)', background: 'rgba(15,23,42,0.95)', padding: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>Leaderboard is disabled</p>
        <p style={{ marginTop: 8, fontSize: 14, color: '#94a3b8' }}>เปิดใช้งานเพื่อดูตัวอย่างการปรับแต่งทั้งหมด</p>
      </div>
    );
  }

  const renderListItems = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {displayedEntries.map(entry => (
        <ListItem key={entry.rank} entry={entry} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
      ))}
    </div>
  );

  const renderHorizontal = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {displayedEntries.map(entry => (
        <HorizontalItem key={entry.rank} entry={entry} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} maxAmount={maxAmount} />
      ))}
    </div>
  );

  const RestList = () => restEntries.length > 0 ? (
    <>
      <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.1)', margin: '12px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {restEntries.map(entry => (
          <ListItem key={entry.rank} entry={entry} settings={settings} highlightKey={highlightKey} animateEntries={animateEntries} />
        ))}
      </div>
    </>
  ) : null;

  const renderPodium = () => {
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, alignItems: 'end', marginBottom: 8 }}>
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
    <div style={{ padding: '1.5rem 0' }}>
      <TitleBlock settings={settings} highlightKey={highlightKey} />
      {isHorizontal && renderHorizontal()}
      {!isHorizontal && !isPodium && renderListItems()}
      {isPodium && renderPodium()}
    </div>
  );
}

const MemoizedLeaderboardPreview = memo(LeaderboardPreview);
MemoizedLeaderboardPreview.displayName = 'LeaderboardPreview';

export default MemoizedLeaderboardPreview;