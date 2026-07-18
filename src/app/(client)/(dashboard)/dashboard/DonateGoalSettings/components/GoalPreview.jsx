import React from 'react';
import { resolveFontCssFamily, resolveText, calculatePercentage } from '../utils/donate-goal';

const SHINE_KEYFRAMES = `
  @keyframes donateGoalShineSweep {
    0% { left: -32%; opacity: 0; }
    16% { opacity: 1; }
    50% { opacity: 1; }
    84% { opacity: 0; }
    100% { left: 112%; opacity: 0; }
  }
  @keyframes donateGoalGlossBreathe {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes donateGoalPulseGlow {
    0%, 100% { opacity: 0.45; transform: scale(0.85); }
    50% { opacity: 1; transform: scale(1.15); }
  }
  @keyframes donateGoalEnergyPulse {
    0% { left: -36%; opacity: 0; }
    20% { opacity: 1; }
    55% { opacity: 0.95; }
    100% { left: 112%; opacity: 0; }
  }
  @keyframes donateGoalSparkleTwinkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes donateGoalScanBeam {
    0% { left: -22%; opacity: 0; }
    20% { opacity: 0.95; }
    80% { opacity: 0.95; }
    100% { left: 112%; opacity: 0; }
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

export function renderProgressShine(color, effect = 'sweep', palette = null) {
  const highlight = palette?.via || palette?.to || color;
  const startColor = palette?.from || color;
  const endColor = palette?.to || color;
  const baseGloss = (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%)',
        mixBlendMode: 'screen',
      }}
    />
  );

  if (effect === 'soft_gloss') {
    return (
      <>
        {baseGloss}
        <div
          className="absolute inset-x-[4%] top-[6%] h-[58%] pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)',
            animation: 'donateGoalGlossBreathe 3.6s ease-in-out infinite',
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
          className="absolute inset-[4%] pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colorWithAlpha('#FFFFFF', 0.75)} 0%, ${colorWithAlpha(highlight, 0.6)} 42%, rgba(255,255,255,0) 78%)`,
            animation: 'donateGoalPulseGlow 2.2s ease-in-out infinite',
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
          className="absolute inset-y-0 w-[36%] pointer-events-none rounded-full"
          style={{
            left: '-36%',
            transform: 'skewX(-10deg)',
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${colorWithAlpha(startColor, 0.3)} 20%, rgba(255,255,255,1) 50%, ${colorWithAlpha(endColor, 0.55)} 80%, rgba(255,255,255,0))`,
            filter: 'blur(1px)',
            animation: 'donateGoalEnergyPulse 1.7s cubic-bezier(0.3, 0, 0.15, 1) infinite',
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
        {[16, 40, 64, 86].map((pos, i) => (
          <div
            key={pos}
            className="absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 pointer-events-none rounded-full"
            style={{
              left: `${pos}%`,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.95)' : colorWithAlpha(highlight, 0.9),
              boxShadow: `0 0 6px ${colorWithAlpha(highlight, 0.6)}`,
              animation: `donateGoalSparkleTwinkle 2s ease-in-out ${i * 0.35}s infinite`,
              mixBlendMode: 'screen',
            }}
          />
        ))}
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
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 9px)',
            opacity: 0.5,
          }}
        />
        <div
          className="absolute inset-y-0 w-[20%] pointer-events-none rounded-full"
          style={{
            left: '-22%',
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${colorWithAlpha('#FFFFFF', 0.95)} 50%, rgba(255,255,255,0))`,
            filter: 'blur(0.6px)',
            animation: 'donateGoalScanBeam 2.1s ease-in-out infinite',
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
        className="absolute inset-y-0 w-[30%] pointer-events-none rounded-full"
        style={{
          left: '-32%',
          transform: 'skewX(-14deg)',
          background: `linear-gradient(90deg, rgba(255,255,255,0), ${colorWithAlpha('#FFFFFF', 0.4)} 28%, rgba(255,255,255,1) 50%, ${colorWithAlpha(highlight, 0.6)} 74%, rgba(255,255,255,0))`,
          filter: 'blur(0.6px)',
          animation: 'donateGoalShineSweep 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
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

export function getGradientPalette(settings) {
  const preset = GRADIENT_PRESETS[settings.progressSkin] || GRADIENT_PRESETS.custom;
  return {
    from: preset.from || settings.progressGradientFrom || settings.progressColor,
    via: preset.via || settings.progressGradientVia || settings.progressColor,
    to: preset.to || settings.progressGradientTo || settings.progressColor,
  };
}

export function getProgressSkinStyles(skin, palette, baseColor) {
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

function ProgressMeter({ settings, percentage, progressBarHeight, progressSkin, progressStyles, progressPalette, previewData }) {
  const effect = settings.progressShine ? (settings.progressShineEffect || 'sweep') : null;

  return (
    <div className="relative w-full" style={{ height: `${progressBarHeight}px` }}>
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





