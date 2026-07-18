// components/ShineStylePicker.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  getGradientPalette,
  getProgressSkinStyles,
  renderProgressShine,
} from './GoalPreview';

const EFFECT_HINTS = {
  sweep: 'Soft beam glides across the bar.',
  soft_gloss: 'Calm glass sheen, always on.',
  pulse_glow: 'Breathing glow pulses at the center.',
  energy_wave: 'Fast ripple with a spark trail.',
  sparkle: 'Twinkling sparkles drift by.',
  scanline: 'Retro scanlines with a glowing edge.',
};

const PREVIEW_FILL_PERCENT = 64;

export default function ShineStylePicker({
  value,
  onChange,
  options,
  progressColor,
  progressSkin,
  progressGradientFrom,
  progressGradientVia,
  progressGradientTo,
}) {
  const palette = getGradientPalette({
    progressSkin,
    progressGradientFrom,
    progressGradientVia,
    progressGradientTo,
    progressColor,
  });
  const barStyles = getProgressSkinStyles(progressSkin, palette, progressColor);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const isActive = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={isActive}
            className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${
              isActive
                ? 'border-emerald-400/80 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                : 'border-slate-700/60 bg-slate-900/40 hover:border-slate-500/70 hover:bg-slate-800/60'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="shineStyleActiveGlow"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}

            <div className="relative z-10 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">{option.name}</p>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isActive
                    ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                    : 'border-slate-600 text-transparent'
                }`}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            </div>

            <div className="relative z-10 mt-3 h-7 w-full overflow-hidden rounded-full bg-slate-800/80 shadow-inner shadow-black/40">
              <div
                className="relative h-full overflow-hidden rounded-full isolate"
                style={{
                  background: barStyles.background,
                  width: `${PREVIEW_FILL_PERCENT}%`,
                  boxShadow: barStyles.boxShadow,
                }}
              >
                {renderProgressShine(progressColor, option.id, palette)}
              </div>
            </div>

            <p className="relative z-10 mt-2 text-[11px] leading-snug text-slate-400">
              {EFFECT_HINTS[option.id] ?? ''}
            </p>
          </button>
        );
      })}
    </div>
  );
}
