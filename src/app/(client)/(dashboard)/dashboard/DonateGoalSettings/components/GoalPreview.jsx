import React from 'react';
import { resolveFontCssFamily, resolveText, calculatePercentage } from '../utils/donate-goal';

const SHINE_KEYFRAMES = `
  @keyframes donateGoalShineSweep {
    0% { transform: translateX(-165%) skewX(-16deg) scaleX(0.88); opacity: 0; }
    20% { opacity: 0.18; }
    46% { opacity: 0.9; }
    72% { opacity: 0.46; }
    100% { transform: translateX(250%) skewX(-16deg) scaleX(1.02); opacity: 0; }
  }
  @keyframes donateGoalShineSweepFast {
    0% { transform: translateX(-210%) skewX(-16deg) scaleX(0.82); opacity: 0; }
    34% { opacity: 0; }
    52% { opacity: 0.56; }
    100% { transform: translateX(300%) skewX(-16deg) scaleX(1); opacity: 0; }
  }
  @keyframes donateGoalGlossDrift {
    0%, 100% { opacity: 0.32; transform: translateY(-8%) scaleY(0.96); }
    50% { opacity: 0.72; transform: translateY(8%) scaleY(1.04); }
  }
  @keyframes donateGoalPulseGlow {
    0%, 100% { opacity: 0.22; transform: scaleX(0.94) scaleY(0.84); filter: blur(12px); }
    50% { opacity: 0.72; transform: scaleX(1.04) scaleY(1.12); filter: blur(7px); }
  }
  @keyframes donateGoalPulseRing {
    0%, 100% { opacity: 0.2; transform: translateX(-50%) scaleX(0.86); }
    50% { opacity: 0.72; transform: translateX(-50%) scaleX(1.02); }
  }
  @keyframes donateGoalEnergyWave {
    0% { transform: translateX(-120%) skewX(-10deg) scaleX(0.88); opacity: 0; }
    26% { opacity: 0.22; }
    54% { opacity: 0.82; }
    78% { opacity: 0.42; }
    100% { transform: translateX(180%) skewX(-10deg) scaleX(1.08); opacity: 0; }
  }
  @keyframes donateGoalEnergyRipple {
    0% { background-position: 0 0, 0 50%; opacity: 0.12; }
    50% { opacity: 0.34; }
    100% { background-position: 72px 0, 42px 50%; opacity: 0.12; }
  }
  @keyframes donateGoalEnergyBolt {
    0% { transform: translateX(-108%); opacity: 0; }
    26% { opacity: 0.2; }
    52% { opacity: 0.84; }
    100% { transform: translateX(112%); opacity: 0; }
  }
  @keyframes donateGoalSparkleDrift {
    0% { background-position: -44px 50%, -10px 26%, 18px 74%, 46px 40%; opacity: 0; }
    22% { opacity: 0.78; }
    100% { background-position: 104px 50%, 138px 26%, 166px 74%, 194px 40%; opacity: 0; }
  }
  @keyframes donateGoalSparkleTwinkle {
    0%, 100% { opacity: 0.34; transform: scale(0.94); }
    50% { opacity: 0.92; transform: scale(1.08); }
  }
  @keyframes donateGoalScanline {
    0% { background-position: 0 0, 0 0, -56px 0; opacity: 0.16; }
    50% { opacity: 0.44; }
    100% { background-position: 24px 0, -20px 0, 140px 0; opacity: 0.16; }
  }
  @keyframes donateGoalScanGlow {
    0%, 100% { transform: translateX(-110%); opacity: 0; }
    42% { opacity: 0.14; }
    58% { opacity: 0.62; }
    100% { transform: translateX(220%); opacity: 0; }
  }
  @keyframes donateGoalAuraBreath {
    0%, 100% { opacity: 0.18; transform: scaleX(0.97) scaleY(0.84); filter: blur(14px); }
    50% { opacity: 0.54; transform: scaleX(1.03) scaleY(1.08); filter: blur(9px); }
  }
  @keyframes donateGoalFillFlow {
    0% { background-position: 0 0, 0 0; }
    100% { background-position: 0 0, 72px 0; }
  }
  @keyframes donateGoalEdgeSpark {
    0%, 100% { opacity: 0.34; transform: translate(-50%, -50%) scale(0.82); }
    50% { opacity: 0.92; transform: translate(-50%, -50%) scale(1.14); }
  }
  @keyframes donateGoalFloatUp {
    0% { opacity: 0; transform: translateY(6px) scale(0.78); }
    26% { opacity: 0.72; }
    100% { opacity: 0; transform: translateY(-12px) scale(1); }
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

function getRemainingDays(endAt) {
  if (!endAt) return 30;
  const end = new Date(endAt);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

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
  const softColor = colorWithAlpha(shineColor, 0.34);
  const strongColor = colorWithAlpha(shineColor, 0.54);
  const faintColor = colorWithAlpha(shineColor, 0.18);
  const edgeColor = colorWithAlpha('#FFFFFF', 0.78);
  const baseGloss = (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 32%, rgba(255,255,255,0) 76%)',
        opacity: 0.88,
        mixBlendMode: 'screen',
      }}
    />
  );

  if (effect === 'soft_gloss') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-x-[6%] top-[10%] h-[46%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.46), rgba(255,255,255,0.12) 58%, rgba(255,255,255,0) 100%)`,
            animation: 'donateGoalGlossDrift 3.4s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-x-[14%] bottom-[12%] h-[32%] pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${faintColor} 0%, rgba(255,255,255,0) 72%)`,
            animation: 'donateGoalPulseGlow 4.2s ease-in-out infinite',
            mixBlendMode: 'screen',
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
          className="absolute inset-y-[18%] left-1/2 w-[26%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${edgeColor}, ${strongColor}, ${edgeColor}, rgba(255,255,255,0))`,
            boxShadow: `0 0 10px ${softColor}`,
            animation: 'donateGoalPulseRing 1.9s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-[14%] pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.22) 0%, ${faintColor} 44%, rgba(255,255,255,0) 78%)`,
            animation: 'donateGoalPulseGlow 2.4s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
      </>
    );
  }

  if (effect === 'streamer_shine') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-y-[6%] left-[-36%] w-[38%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${colorWithAlpha('#FFFFFF', 0.28)} 18%, rgba(255,255,255,1) 46%, ${streamerColor} 68%, rgba(255,255,255,0) 100%)`,
            filter: 'blur(0.4px)',
            animation: 'donateGoalStreamerSweep 1.55s cubic-bezier(0.32, 0.04, 0.18, 1) infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-y-[14%] left-[-44%] w-[18%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${streamerColor}, rgba(255,255,255,0.82), rgba(255,255,255,0))`,
            filter: 'blur(3px)',
            animation: 'donateGoalStreamerTrail 1.9s linear infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-x-[9%] top-[8%] h-[30%] pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.10) 52%, rgba(255,255,255,0) 100%)',
            opacity: 0.96,
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-[8%] pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.34) 0%, ${colorWithAlpha(shineColor, 0.24)} 34%, rgba(255,255,255,0) 76%)`,
            filter: 'blur(5px)',
            animation: 'donateGoalPulseGlow 1.65s ease-in-out infinite',
            mixBlendMode: 'screen',
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
          className="absolute inset-y-[14%] left-[-36%] w-[52%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${colorWithAlpha(startColor, 0.12)} 18%, ${edgeColor} 48%, ${colorWithAlpha(endColor, 0.32)} 74%, rgba(255,255,255,0) 100%)`,
            filter: `blur(1.8px)`,
            animation: 'donateGoalEnergyWave 2.7s cubic-bezier(0.4, 0.08, 0.2, 1) infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              `linear-gradient(110deg, rgba(255,255,255,0) 0 16px, ${colorWithAlpha(startColor, 0.08)} 18px 22px, rgba(255,255,255,0) 24px 44px)`,
              `radial-gradient(ellipse at 50% 45%, ${faintColor}, rgba(255,255,255,0) 60%)`,
            ].join(', '),
            backgroundSize: '72px 100%, 100% 100%',
            animation: 'donateGoalEnergyRipple 2.2s linear infinite',
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
              'radial-gradient(circle, rgba(255,255,255,0.96) 0 1.2px, transparent 2.6px)',
              `radial-gradient(circle, ${strongColor} 0 1.4px, transparent 3px)`,
              'radial-gradient(circle, rgba(255,255,255,0.72) 0 0.9px, transparent 2.2px)',
              `radial-gradient(circle, ${colorWithAlpha(endColor, 0.44)} 0 1.2px, transparent 2.8px)`,
            ].join(', '),
            backgroundSize: '96px 100%, 96px 100%, 96px 100%, 96px 100%',
            animation: 'donateGoalSparkleDrift 2.8s linear infinite, donateGoalSparkleTwinkle 1.4s ease-in-out infinite',
            filter: `drop-shadow(0 0 6px ${softColor})`,
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-y-[10%] left-[-36%] w-[32%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${faintColor}, rgba(255,255,255,0.52), ${faintColor}, rgba(255,255,255,0))`,
            animation: 'donateGoalShineSweep 2.6s linear infinite',
            mixBlendMode: 'screen',
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
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, rgba(255,255,255,0) 1px 10px)',
              `repeating-linear-gradient(0deg, transparent 0 8px, ${faintColor} 8px 9px, transparent 9px 16px)`,
              `linear-gradient(90deg, transparent 0%, ${strongColor} 50%, transparent 100%)`,
            ].join(', '),
            animation: 'donateGoalScanline 1.8s linear infinite',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-y-[8%] left-[-28%] w-[22%] pointer-events-none rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${softColor}, ${edgeColor}, ${softColor}, rgba(255,255,255,0))`,
            filter: `blur(2.4px)`,
            animation: 'donateGoalScanGlow 2.3s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
      </>
    );
  }

  return (
    <>
      {baseGloss}
      <div
        className="absolute inset-y-[8%] left-[-34%] w-[28%] pointer-events-none rounded-full"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${faintColor} 18%, ${edgeColor} 48%, ${strongColor} 68%, rgba(255,255,255,0) 100%)`,
          filter: 'blur(1px)',
          animation: 'donateGoalShineSweep 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="absolute inset-y-[18%] left-[-42%] w-[14%] pointer-events-none rounded-full"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0), ${strongColor}, rgba(255,255,255,0.42), rgba(255,255,255,0))`,
          filter: `blur(3px)`,
          animation: 'donateGoalShineSweepFast 3.1s linear infinite',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}

const GRADIENT_PRESETS = {
  custom: { from: null, via: null, to: null },
  aurora: { from: '#22D3EE', via: '#8B5CF6', to: '#EC4899' },
  sunset: { from: '#FB7185', via: '#FB923C', to: '#FACC15' },
  ocean: { from: '#0EA5E9', via: '#14B8A6', to: '#67E8F9' },
  berry: { from: '#A855F7', via: '#EC4899', to: '#F43F5E' },
  mono: { from: '#94A3B8', via: '#E2E8F0', to: '#CBD5E1' },
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
    return <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 22% 45%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 18%), radial-gradient(circle at 76% 58%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 20%)', opacity: 0.9 }} />;
  }
  if (skin === 'sunset') {
    return <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,214,0.12) 24%, rgba(255,255,255,0.18) 50%, rgba(255,244,214,0.12) 76%, rgba(255,255,255,0) 100%)', opacity: 0.75 }} />;
  }
  if (skin === 'ocean') {
    return <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 100%)', opacity: 0.7, mixBlendMode: 'screen' }} />;
  }
  if (skin === 'berry') {
    return <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 18% 50%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 16%), radial-gradient(circle at 78% 54%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 18%)', opacity: 0.8 }} />;
  }
  if (skin === 'mono') {
    return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.16) 12.5%, transparent 12.5%, transparent 50%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.16) 62.5%, transparent 62.5%, transparent)', backgroundSize: '18px 18px', opacity: 0.22, mixBlendMode: 'screen' }} />;
  }
  return null;
}

function renderProgressStageEffect(color, effect, palette, percentage) {
  if (!effect) return null;
  if (effect === 'soft_gloss' || effect === 'sweep') return null;

  const glowColor = palette?.via || color;
  const softGlow = colorWithAlpha(glowColor, effect === 'pulse_glow' ? 0.34 : effect === 'streamer_shine' ? 0.78 : 0.28);
  const hotGlow = colorWithAlpha(glowColor, effect === 'streamer_shine' ? 1 : effect === 'pulse_glow' ? 0.58 : 0.62);
  const endPosition = `${Math.max(4, Math.min(percentage, 98))}%`;

  return (
    <>
      <div
        className="absolute inset-x-[-8px] inset-y-[-8px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${endPosition} 50%, ${softGlow} 0%, ${colorWithAlpha(glowColor, effect === 'streamer_shine' ? 0.32 : effect === 'pulse_glow' ? 0.16 : 0.16)} 36%, rgba(255,255,255,0) 76%)`,
          animation: effect === 'streamer_shine' ? 'donateGoalAuraBreath 1.15s ease-in-out infinite' : effect === 'pulse_glow' ? 'donateGoalAuraBreath 2.1s ease-in-out infinite' : 'donateGoalAuraBreath 2.9s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />
      {['energy_wave', 'sparkle', 'streamer_shine'].includes(effect) && (
        <div
          className="absolute inset-x-0 inset-y-[-8px] pointer-events-none overflow-visible"
          style={{
            backgroundImage: [
              `radial-gradient(circle at ${endPosition} 50%, rgba(255,255,255,0.88) 0 1.8px, transparent 3px)`,
              `radial-gradient(circle at calc(${endPosition} - 10%) 30%, ${colorWithAlpha(palette?.from || color, effect === 'streamer_shine' ? 0.48 : 0.34)} 0 1.2px, transparent 3px)`,
              `radial-gradient(circle at calc(${endPosition} + 8%) 70%, ${colorWithAlpha(palette?.to || color, effect === 'streamer_shine' ? 0.48 : 0.34)} 0 1.2px, transparent 3px)`,
            ].join(', '),
            animation: effect === 'streamer_shine' ? 'donateGoalFloatUp 1.8s ease-out infinite' : 'donateGoalFloatUp 2.8s ease-out infinite',
            filter: `drop-shadow(0 0 6px ${softGlow})`,
            mixBlendMode: 'screen',
          }}
        />
      )}
      {['pulse_glow', 'energy_wave', 'streamer_shine'].includes(effect) && (
        <div
          className="absolute top-1/2 h-[18px] w-[18px] rounded-full pointer-events-none"
          style={{
            left: endPosition,
            background: `radial-gradient(circle, rgba(255,255,255,0.98) 0 18%, ${hotGlow} 34%, ${softGlow} 58%, rgba(255,255,255,0) 76%)`,
            boxShadow: effect === 'streamer_shine' ? `0 0 18px ${hotGlow}, 0 0 30px ${softGlow}` : `0 0 12px ${hotGlow}, 0 0 22px ${softGlow}`,
            animation: effect === 'streamer_shine' ? 'donateGoalEdgeSpark 1s ease-in-out infinite' : 'donateGoalEdgeSpark 1.9s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </>
  );
}

function ProgressMeter({ settings, percentage, progressBarHeight, progressSkin, progressStyles, progressPalette, previewData }) {
  const effect = settings.progressShine ? (settings.progressShineEffect || 'sweep') : null;

  return (
    <div className="relative w-full" style={{ height: `${progressBarHeight}px` }}>
      {effect && renderProgressStageEffect(settings.progressColor, effect, progressPalette, percentage)}
      <div className="absolute inset-0 rounded-full overflow-hidden bg-slate-700 shadow-inner shadow-black/40">
        <div
          className="relative h-full overflow-hidden rounded-full isolate transition-all duration-500"
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
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-medium text-white"
        style={{
          fontFamily: resolveFontCssFamily(settings.progressFontFamily),
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
    percentage,
    days,
  };

  const getStrokeStyle = (strokeWidth, strokeColor) => {
    if (strokeWidth && strokeWidth !== '0px' && strokeColor) {
      return { WebkitTextStroke: `${strokeWidth} ${strokeColor}` };
    }
    return {};
  };

  const goalDisplayText = settings.showGoalAmount
    ? `${settings.goalName} (${formatNumber(settings.goalAmount)} บาท)`
    : settings.goalName;

  if (settings.type === 'main') {
    return (
      <div className="space-y-2">
        <p
          className="text-center font-bold"
          style={{
            color: settings.goalColor,
            fontSize: settings.goalFontSize,
            fontFamily: resolveFontCssFamily(settings.goalFontFamily),
            fontWeight: settings.goalFontWeight,
            ...getStrokeStyle(settings.goalStrokeWidth, settings.goalStrokeColor),
          }}
        >
          {goalDisplayText}
        </p>

        <ProgressMeter
          settings={settings}
          percentage={percentage}
          progressBarHeight={progressBarHeight}
          progressSkin={progressSkin}
          progressStyles={progressStyles}
          progressPalette={progressPalette}
          previewData={previewData}
        />

        <div
          className="flex justify-between"
          style={{
            color: settings.descriptionColor,
            fontFamily: resolveFontCssFamily(settings.descriptionFontFamily),
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p
          style={{
            color: settings.goalColor,
            fontSize: settings.goalFontSize,
            fontFamily: resolveFontCssFamily(settings.goalFontFamily),
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
            fontFamily: resolveFontCssFamily(settings.descriptionFontFamily),
            fontWeight: settings.descriptionFontWeight,
            ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
          }}
        >
          {resolveText(settings.largeTopRightText, previewData)}
        </span>
      </div>

      <ProgressMeter
        settings={settings}
        percentage={percentage}
        progressBarHeight={progressBarHeight}
        progressSkin={progressSkin}
        progressStyles={progressStyles}
        progressPalette={progressPalette}
        previewData={previewData}
      />

      <div
        className="flex justify-between"
        style={{
          color: settings.descriptionColor,
          fontFamily: resolveFontCssFamily(settings.descriptionFontFamily),
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





