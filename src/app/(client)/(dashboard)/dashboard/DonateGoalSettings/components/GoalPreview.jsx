import React from 'react';
import { resolveText, calculatePercentage } from '../utils/donate-goal';

const SHINE_KEYFRAMES = `
  @keyframes donateGoalShineSweep {
    0% { transform: translateX(-180%) skewX(-18deg) scaleX(0.82); opacity: 0; }
    18% { opacity: 0.96; }
    62% { opacity: 0.82; }
    100% { transform: translateX(335%) skewX(-18deg) scaleX(1.08); opacity: 0; }
  }
  @keyframes donateGoalShineSweepFast {
    0% { transform: translateX(-260%) skewX(-18deg); opacity: 0; }
    26% { opacity: 0; }
    42% { opacity: 0.72; }
    100% { transform: translateX(420%) skewX(-18deg); opacity: 0; }
  }
  @keyframes donateGoalGlossDrift {
    0%, 100% { opacity: 0.38; transform: translateY(-16%) scaleY(0.92); }
    50% { opacity: 0.92; transform: translateY(16%) scaleY(1.12); }
  }
  @keyframes donateGoalPulseGlow {
    0%, 100% { opacity: 0.34; transform: scaleX(0.86) scaleY(0.62); filter: blur(10px); }
    45% { opacity: 0.98; transform: scaleX(1.12) scaleY(1.28); filter: blur(4px); }
    62% { opacity: 0.54; transform: scaleX(1.04) scaleY(0.92); filter: blur(7px); }
  }
  @keyframes donateGoalPulseRing {
    0%, 100% { opacity: 0.36; transform: translateX(-50%) scaleX(0.78); }
    46% { opacity: 1; transform: translateX(-50%) scaleX(1.08); }
  }
  @keyframes donateGoalEnergyWave {
    0% { transform: translateX(-135%) skewX(-10deg) scaleX(0.8); opacity: 0; }
    24% { opacity: 0.9; }
    70% { opacity: 0.72; }
    100% { transform: translateX(210%) skewX(-10deg) scaleX(1.18); opacity: 0; }
  }
  @keyframes donateGoalEnergyRipple {
    0% { background-position: 0 0, 0 50%; opacity: 0.24; }
    50% { opacity: 0.7; }
    100% { background-position: 120px 0, 64px 50%; opacity: 0.24; }
  }
  @keyframes donateGoalEnergyBolt {
    0% { transform: translateX(-110%); opacity: 0; }
    20% { opacity: 0.95; }
    78% { opacity: 0.82; }
    100% { transform: translateX(115%); opacity: 0; }
  }
  @keyframes donateGoalSparkleDrift {
    0% { background-position: -60px 50%, -14px 24%, 22px 76%, 58px 38%, 82px 62%; opacity: 0; }
    18% { opacity: 1; }
    72% { opacity: 0.88; }
    100% { background-position: 142px 50%, 176px 24%, 214px 76%, 248px 38%, 286px 62%; opacity: 0; }
  }
  @keyframes donateGoalSparkleTwinkle {
    0%, 100% { opacity: 0.45; transform: scale(0.9); }
    45% { opacity: 1; transform: scale(1.16); }
  }
  @keyframes donateGoalScanline {
    0% { background-position: 0 0, 0 0, -80px 0; opacity: 0.26; }
    45% { opacity: 0.95; }
    100% { background-position: 42px 0, -42px 0, 220px 0; opacity: 0.26; }
  }
  @keyframes donateGoalScanGlow {
    0%, 100% { transform: translateX(-120%); opacity: 0; }
    38%, 68% { opacity: 0.9; }
    100% { transform: translateX(260%); opacity: 0; }
  }
  @keyframes donateGoalAuraBreath {
    0%, 100% { opacity: 0.34; transform: scaleX(0.94) scaleY(0.72); filter: blur(14px); }
    50% { opacity: 0.92; transform: scaleX(1.06) scaleY(1.20); filter: blur(7px); }
  }
  @keyframes donateGoalFillFlow {
    0% { background-position: 0 0, 0 0; }
    100% { background-position: 0 0, 96px 0; }
  }
  @keyframes donateGoalEdgeSpark {
    0%, 100% { opacity: 0.62; transform: translate(-50%, -50%) scale(0.78); }
    46% { opacity: 1; transform: translate(-50%, -50%) scale(1.38); }
  }
  @keyframes donateGoalFloatUp {
    0% { opacity: 0; transform: translateY(9px) scale(0.7); }
    18% { opacity: 0.95; }
    100% { opacity: 0; transform: translateY(-18px) scale(1.08); }
  }
`;

if (typeof document !== 'undefined') {
  const styleId = 'donate-goal-shine-styles';
  const existingStyle = document.getElementById(styleId);

  if (existingStyle) {
    if (existingStyle.textContent !== SHINE_KEYFRAMES) {
      existingStyle.textContent = SHINE_KEYFRAMES;
    }
  } else {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = SHINE_KEYFRAMES;
    document.head.appendChild(style);
  }
}

// Helper: คำนวณจำนวนวันที่เหลือ (days) จาก endAt (ถ้ามี)
function getRemainingDays(endAt) {
  if (!endAt) return 30;
  const end = new Date(endAt);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// จัดรูปแบบตัวเลขแบบไทย (มี comma)
function formatNumber(num) {
  return num.toLocaleString('th-TH');
}

function colorWithAlpha(color, alpha) {
  if (!color) return `rgba(255,255,255,${alpha})`;
  if (color.startsWith('#')) {
    const hex = color.length === 4
      ? color.slice(1).split('').map((part) => part + part).join('')
      : color.slice(1, 7);
    const value = parseInt(hex, 16);
    if (Number.isFinite(value)) {
      const r = (value >> 16) & 255;
      const g = (value >> 8) & 255;
      const b = value & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    }
  }
  return color;
}

function renderProgressShine(color, effect = 'sweep', palette = null) {
  const shineColor = palette?.via || palette?.to || color;
  const startColor = palette?.from || color;
  const endColor = palette?.to || color;
  const softColor = colorWithAlpha(shineColor, 0.62);
  const strongColor = colorWithAlpha(shineColor, 0.82);
  const faintColor = colorWithAlpha(shineColor, 0.34);
  const baseGloss = (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0) 100%)',
        opacity: 0.9,
        mixBlendMode: 'screen',
      }}
    />
  );

  if (effect === 'soft_gloss') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.18) 54%, ${faintColor} 72%, rgba(255,255,255,0))`,
            animation: 'donateGoalGlossDrift 2.6s ease-in-out infinite',
            filter: `drop-shadow(0 0 8px ${faintColor})`,
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${strongColor}, rgba(255,255,255,0) 68%)`,
            animation: 'donateGoalPulseGlow 3.1s ease-in-out infinite',
            mixBlendMode: 'screen',
            borderRadius: 'inherit',
          }}
        />
      </>
    );
  }

  if (effect === 'pulse_glow') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-y-[18%] left-1/2 w-[42%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.72), ${strongColor}, rgba(255,255,255,0.72), rgba(255,255,255,0))`,
            boxShadow: `0 0 14px ${strongColor}, inset 0 0 10px rgba(255,255,255,0.32)`,
            animation: 'donateGoalPulseRing 1.15s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.56) 0%, ${strongColor} 28%, ${faintColor} 56%, rgba(255,255,255,0) 82%)`,
            filter: `drop-shadow(0 0 14px ${strongColor})`,
            animation: 'donateGoalPulseGlow 1.85s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-full pointer-events-none rounded-full"
          style={{
            boxShadow: `inset 0 0 18px rgba(255,255,255,0.34), 0 0 22px ${softColor}, 0 0 42px ${faintColor}`,
            animation: 'donateGoalPulseGlow 2.35s ease-in-out infinite reverse',
          }}
        />
      </>
    );
  }

  if (effect === 'energy_wave') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-y-[15%] left-0 w-full pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(112deg, transparent 0 12%, rgba(255,255,255,0.82) 18%, ${strongColor} 24%, transparent 31%, transparent 42%, ${colorWithAlpha(startColor, 0.72)} 48%, rgba(255,255,255,0.88) 53%, transparent 61%, transparent 100%)`,
            backgroundSize: '130% 100%',
            filter: `drop-shadow(0 0 10px ${strongColor})`,
            animation: 'donateGoalEnergyBolt 1.55s linear infinite',
            mixBlendMode: 'screen',
            borderRadius: 'inherit',
          }}
        />
        <div
          className="absolute inset-y-0 left-[-48%] w-[68%] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${colorWithAlpha(startColor, 0.62)} 22%, rgba(255,255,255,0.88) 48%, ${colorWithAlpha(endColor, 0.72)} 72%, rgba(255,255,255,0) 100%)`,
            filter: `blur(2.4px) drop-shadow(0 0 14px ${strongColor})`,
            animation: 'donateGoalEnergyWave 2.35s cubic-bezier(0.45, 0, 0.25, 1) infinite',
            mixBlendMode: 'screen',
            borderRadius: 'inherit',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              `linear-gradient(110deg, rgba(255,255,255,0) 0 12px, rgba(255,255,255,0.28) 14px 16px, ${faintColor} 18px 22px, rgba(255,255,255,0) 28px 48px)`,
              `radial-gradient(ellipse at 50% 45%, ${faintColor}, rgba(255,255,255,0) 58%)`,
            ].join(', '),
            backgroundSize: '120px 100%, 100% 100%',
            animation: 'donateGoalEnergyRipple 1.45s linear infinite',
            mixBlendMode: 'screen',
          }}
        />
      </>
    );
  }

  if (effect === 'sparkle') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              'radial-gradient(circle, rgba(255,255,255,1) 0 1.6px, transparent 3px)',
              `radial-gradient(circle, ${strongColor} 0 1.8px, transparent 4px)`,
              'radial-gradient(circle, rgba(255,255,255,0.78) 0 1px, transparent 2.5px)',
              `radial-gradient(circle, ${faintColor} 0 1.2px, transparent 3px)`,
              `radial-gradient(circle, ${colorWithAlpha(endColor, 0.78)} 0 1.4px, transparent 3.4px)`,
            ].join(', '),
            backgroundSize: '112px 100%, 112px 100%, 112px 100%, 112px 100%, 112px 100%',
            animation: 'donateGoalSparkleDrift 2.25s linear infinite, donateGoalSparkleTwinkle 1.05s ease-in-out infinite',
            filter: `drop-shadow(0 0 9px ${strongColor})`,
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-y-0 left-[-30%] w-[46%] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${faintColor}, rgba(255,255,255,0.70), ${faintColor}, rgba(255,255,255,0))`,
            animation: 'donateGoalShineSweep 2.15s linear infinite',
            mixBlendMode: 'screen',
            borderRadius: 'inherit',
          }}
        />
      </>
    );
  }

  if (effect === 'scanline') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 1px, rgba(255,255,255,0) 1px 9px)',
              `repeating-linear-gradient(0deg, transparent 0 7px, ${faintColor} 7px 9px, transparent 9px 16px)`,
              `linear-gradient(90deg, transparent 0%, ${strongColor} 48%, transparent 100%)`,
            ].join(', '),
            animation: 'donateGoalScanline 1.12s linear infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-y-0 left-[-34%] w-[28%] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${strongColor}, rgba(255,255,255,0.88), ${softColor}, rgba(255,255,255,0))`,
            filter: `blur(3px) drop-shadow(0 0 14px ${strongColor})`,
            animation: 'donateGoalScanGlow 1.75s ease-in-out infinite',
            mixBlendMode: 'screen',
            borderRadius: 'inherit',
          }}
        />
      </>
    );
  }

  return (
    <>
      {baseGloss}
      <div
        className="absolute inset-y-0 left-[-42%] w-[38%] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${faintColor} 18%, rgba(255,255,255,0.94) 48%, ${strongColor} 62%, rgba(255,255,255,0) 100%)`,
          filter: `blur(1.2px) drop-shadow(0 0 12px ${strongColor})`,
          animation: 'donateGoalShineSweep 2.15s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          mixBlendMode: 'screen',
          borderRadius: 'inherit',
        }}
      />
      <div
        className="absolute inset-y-[8%] left-[-50%] w-[20%] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0), ${strongColor}, rgba(255,255,255,0.68), rgba(255,255,255,0))`,
          filter: `blur(4px) drop-shadow(0 0 10px ${softColor})`,
          animation: 'donateGoalShineSweepFast 2.55s linear infinite',
          mixBlendMode: 'screen',
          borderRadius: 'inherit',
        }}
      />
    </>
  );
}

const GRADIENT_PRESETS = {
  custom: {
    from: null,
    via: null,
    to: null,
  },
  aurora: {
    from: "#22D3EE",
    via: "#8B5CF6",
    to: "#EC4899",
  },
  sunset: {
    from: "#FB7185",
    via: "#FB923C",
    to: "#FACC15",
  },
  ocean: {
    from: "#0EA5E9",
    via: "#14B8A6",
    to: "#67E8F9",
  },
  berry: {
    from: "#A855F7",
    via: "#EC4899",
    to: "#F43F5E",
  },
  mono: {
    from: "#94A3B8",
    via: "#E2E8F0",
    to: "#CBD5E1",
  },
};

function getGradientPalette(settings) {
  const preset = GRADIENT_PRESETS[settings.progressSkin] || GRADIENT_PRESETS.custom;
  return {
    from: preset.from || settings.progressGradientFrom || settings.progressColor,
    via: preset.via || settings.progressGradientVia || settings.progressColor,
    to: preset.to || settings.progressGradientTo || settings.progressColor,
  };
}

function getProgressSkinStyles(skin, palette, baseColor) {
  const gradient = `linear-gradient(90deg, ${palette.from} 0%, ${palette.via} 52%, ${palette.to} 100%)`;
  const softVia = colorWithAlpha(palette.via || baseColor, 0.28);
  const softTo = colorWithAlpha(palette.to || baseColor, 0.18);
  const softBase = colorWithAlpha(baseColor, 0.26);

  switch (skin) {
    case 'custom':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 30%), ${gradient}`,
        boxShadow: `0 0 10px ${softVia}, 0 0 18px ${softTo}, inset 0 1px 0 rgba(255,255,255,0.12)`,
      };
    case 'aurora':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 30%), ${gradient}`,
        boxShadow: '0 0 10px rgba(139, 92, 246, 0.18), 0 0 18px rgba(34, 211, 238, 0.14), inset 0 1px 0 rgba(255,255,255,0.14)',
      };
    case 'sunset':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 30%), ${gradient}`,
        boxShadow: '0 0 10px rgba(251, 146, 60, 0.18), 0 0 18px rgba(244, 63, 94, 0.14), inset 0 1px 0 rgba(255,255,255,0.14)',
      };
    case 'ocean':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 30%), ${gradient}`,
        boxShadow: '0 0 10px rgba(14, 165, 233, 0.18), 0 0 18px rgba(20, 184, 166, 0.14), inset 0 1px 0 rgba(255,255,255,0.16)',
      };
    case 'berry':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 30%), ${gradient}`,
        boxShadow: '0 0 10px rgba(236, 72, 153, 0.18), 0 0 18px rgba(168, 85, 247, 0.14), inset 0 1px 0 rgba(255,255,255,0.14)',
      };
    case 'mono':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 24%), ${gradient}`,
        boxShadow: '0 0 10px rgba(226, 232, 240, 0.16), 0 0 16px rgba(148, 163, 184, 0.18), inset 0 1px 0 rgba(255,255,255,0.26)',
      };
    case 'solid':
    default:
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 30%), linear-gradient(90deg, ${baseColor} 0%, ${baseColor} 100%)`,
        boxShadow: `0 0 8px ${softBase}, 0 0 16px ${colorWithAlpha(baseColor, 0.18)}, inset 0 1px 0 rgba(255,255,255,0.12)`,
      };
  }
}

function renderProgressSkinOverlay(skin) {
  if (skin === 'aurora') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 22% 45%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 18%), radial-gradient(circle at 76% 58%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 20%)',
          opacity: 0.9,
        }}
      />
    );
  }

  if (skin === 'sunset') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,214,0.12) 24%, rgba(255,255,255,0.18) 50%, rgba(255,244,214,0.12) 76%, rgba(255,255,255,0) 100%)',
          opacity: 0.75,
        }}
      />
    );
  }

  if (skin === 'ocean') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 100%)',
          opacity: 0.7,
          mixBlendMode: 'screen',
        }}
      />
    );
  }

  if (skin === 'berry') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 18% 50%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 16%), radial-gradient(circle at 78% 54%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 18%)',
          opacity: 0.8,
        }}
      />
    );
  }

  if (skin === 'mono') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.16) 12.5%, transparent 12.5%, transparent 50%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.16) 62.5%, transparent 62.5%, transparent)',
          backgroundSize: '18px 18px',
          opacity: 0.22,
          mixBlendMode: 'screen',
        }}
      />
    );
  }

  return null;
}

function renderProgressStageEffect(color, effect, palette, percentage) {
  if (!effect) return null;
  if (effect === 'soft_gloss' || effect === 'sweep') return null;

  const glowColor = palette?.via || color;
  const softGlow = colorWithAlpha(glowColor, effect === 'pulse_glow' ? 0.78 : 0.58);
  const hotGlow = colorWithAlpha(glowColor, 0.82);
  const endPosition = `${Math.max(3, Math.min(percentage, 98))}%`;

  return (
    <>
      <div
        className="absolute inset-x-[-10px] inset-y-[-9px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${endPosition} 50%, ${softGlow} 0%, ${colorWithAlpha(glowColor, 0.32)} 38%, rgba(255,255,255,0) 78%)`,
          animation: effect === 'pulse_glow' ? 'donateGoalAuraBreath 1.8s ease-in-out infinite' : 'donateGoalAuraBreath 2.65s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {['energy_wave', 'sparkle', 'scanline'].includes(effect) && (
        <div
          className="absolute inset-x-0 inset-y-[-12px] pointer-events-none overflow-visible"
          style={{
            backgroundImage: [
              `radial-gradient(circle at ${endPosition} 50%, rgba(255,255,255,0.88) 0 2px, transparent 4px)`,
              `radial-gradient(circle at calc(${endPosition} - 12%) 22%, ${colorWithAlpha(palette?.from || color, 0.72)} 0 1.5px, transparent 4px)`,
              `radial-gradient(circle at calc(${endPosition} + 9%) 78%, ${colorWithAlpha(palette?.to || color, 0.72)} 0 1.7px, transparent 4px)`,
            ].join(', '),
            animation: 'donateGoalFloatUp 2.2s ease-out infinite',
            filter: `drop-shadow(0 0 10px ${softGlow})`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      <div
        className="absolute top-1/2 h-[22px] w-[22px] rounded-full pointer-events-none"
        style={{
          left: endPosition,
          background: `radial-gradient(circle, rgba(255,255,255,1) 0 16%, ${hotGlow} 30%, ${softGlow} 56%, rgba(255,255,255,0) 76%)`,
          boxShadow: `0 0 14px ${hotGlow}, 0 0 30px ${softGlow}`,
          animation: 'donateGoalEdgeSpark 1.55s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}

function ProgressMeter({
  settings,
  percentage,
  progressBarHeight,
  progressSkin,
  progressStyles,
  progressPalette,
  previewData,
}) {
  const effect = settings.progressShine ? (settings.progressShineEffect || 'sweep') : null;

  return (
    <div className="relative w-full" style={{ height: `${progressBarHeight}px` }}>
      {effect && renderProgressStageEffect(settings.progressColor, effect, progressPalette, percentage)}

      <div className="absolute inset-0 rounded-full overflow-hidden bg-slate-700 shadow-inner shadow-black/40">
        <div
          className="h-full rounded-full transition-all duration-500 relative overflow-hidden isolate"
          style={{
            background: progressStyles.background,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            width: `${percentage}%`,
            minWidth: percentage > 0 ? '10px' : 0,
            boxShadow: progressStyles.boxShadow,
            clipPath: 'inset(0 round 999px)',
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          }}
        >
          {renderProgressSkinOverlay(progressSkin)}
          {effect && renderProgressShine(settings.progressColor, effect, progressPalette)}
        </div>
      </div>

      <span
        className="absolute inset-0 z-10 flex items-center justify-center font-medium text-white pointer-events-none"
        style={{
          fontFamily: settings.progressFontFamily,
          fontSize: '14px',
          textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 8px rgba(0,0,0,0.35)',
        }}
      >
        {resolveText(settings.progressText, previewData)}
      </span>
    </div>
  );
}

export default function GoalPreview({ settings, currentAmount }) {
  const percentage = calculatePercentage(currentAmount, settings.goalAmount);
  const days = getRemainingDays(settings.isUseEndAt ? settings.endAt : null);
  const progressBarHeight = Math.max(20, Math.min(Number(settings.progressBarHeight) || 32, 56));
  const progressSkin = settings.progressSkin || 'custom';
  const progressPalette = getGradientPalette(settings);
  const progressStyles = getProgressSkinStyles(progressSkin, progressPalette, settings.progressColor);

  const previewData = {
    amount: currentAmount,
    goal: settings.goalAmount,
    percentage: percentage,
    days: days,
  };

  // สร้าง style สำหรับข้อความที่มีขอบ (stroke)
  const getStrokeStyle = (strokeWidth, strokeColor) => {
    if (strokeWidth && strokeWidth !== '0px' && strokeColor) {
      return { WebkitTextStroke: `${strokeWidth} ${strokeColor}` };
    }
    return {};
  };

  // สร้างข้อความชื่อเป้าหมาย แสดงจำนวนเป้าหมายตาม setting showGoalAmount
  const goalDisplayText = settings.showGoalAmount
    ? `${settings.goalName} (${formatNumber(settings.goalAmount)} บาท)`
    : settings.goalName;

  if (settings.type === 'main') {
    return (
      <div className="space-y-2">
        {/* ชื่อเป้าหมาย */}
        <p
          className="text-center font-bold"
          style={{
            color: settings.goalColor,
            fontSize: settings.goalFontSize,
            fontFamily: settings.goalFontFamily,
            fontWeight: settings.goalFontWeight,
            ...getStrokeStyle(settings.goalStrokeWidth, settings.goalStrokeColor),
          }}
        >
          {goalDisplayText}
        </p>

        {/* หลอดเป้าหมาย */}
        <ProgressMeter
          settings={settings}
          percentage={percentage}
          progressBarHeight={progressBarHeight}
          progressSkin={progressSkin}
          progressStyles={progressStyles}
          progressPalette={progressPalette}
          previewData={previewData}
        />

        {/* รายละเอียดด้านล่าง (ซ้าย/ขวา) - ลบ text-xs ออก */}
        <div
          className="flex justify-between"
          style={{
            color: settings.descriptionColor,
            fontFamily: settings.descriptionFontFamily,
            fontWeight: settings.descriptionFontWeight,
            fontSize: settings.descriptionFontSize,
            ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
          }}
        >
          <span>{resolveText(settings.descriptionLeftText, previewData)}</span>
          <span>{resolveText(settings.descriptionRightText, previewData)}</span>
        </div>
      </div>
    );
  }

  // Large widget preview
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p
          style={{
            color: settings.goalColor,
            fontSize: settings.goalFontSize,
            fontFamily: settings.goalFontFamily,
            fontWeight: settings.goalFontWeight,
            ...getStrokeStyle(settings.goalStrokeWidth, settings.goalStrokeColor),
          }}
        >
          {goalDisplayText}
        </p>
        <span
          style={{
            color: settings.descriptionColor,
            fontSize: settings.largeTopFontSize,
            fontFamily: settings.descriptionFontFamily,
            fontWeight: settings.descriptionFontWeight,
            ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
          }}
        >
          {resolveText(settings.largeTopRightText, previewData)}
        </span>
      </div>

      {/* หลอดเป้าหมาย */}
      <ProgressMeter
        settings={settings}
        percentage={percentage}
        progressBarHeight={progressBarHeight}
        progressSkin={progressSkin}
        progressStyles={progressStyles}
        progressPalette={progressPalette}
        previewData={previewData}
      />

      {/* รายละเอียดล่างซ้าย/ขวา (Large) - ลบ text-xs */}
      <div
        className="flex justify-between"
        style={{
          color: settings.descriptionColor,
          fontFamily: settings.descriptionFontFamily,
          fontWeight: settings.descriptionFontWeight,
          ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
        }}
      >
        <span style={{ fontSize: settings.largeBottomFontSize }}>
          {resolveText(settings.largeBottomLeftText, previewData)}
        </span>
        <span style={{ fontSize: settings.largeBottomFontSize }}>
          {resolveText(settings.largeBottomRightText, previewData)}
        </span>
      </div>
    </div>
  );
}
