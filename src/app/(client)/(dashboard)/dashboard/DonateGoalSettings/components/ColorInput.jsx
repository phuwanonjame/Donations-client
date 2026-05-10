import React from 'react';
import { Pipette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const DEFAULT_SWATCHES = [
  '#FFFFFF',
  '#0EA5E9',
  '#22D3EE',
  '#38BDF8',
  '#818CF8',
  '#A855F7',
  '#F472B6',
  '#F43F5E',
  '#FB923C',
  '#FACC15',
  '#10B981',
  '#0F172A',
];

function normalizeHex(value) {
  if (!value) return '#FFFFFF';

  const trimmed = value.trim().toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9A-F]{3}$/.test(trimmed)) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
  }

  return '#FFFFFF';
}

export default function ColorInput({ label, value, onChange, swatches = DEFAULT_SWATCHES }) {
  const normalizedValue = normalizeHex(value);

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>

      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 shrink-0 rounded-xl border border-white/10 shadow-inner"
              style={{ background: normalizedValue }}
            />

            <label className="relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800/90 text-slate-300 hover:text-white">
              <Pipette className="h-4 w-4 pointer-events-none" />
              <input
                type="color"
                value={normalizedValue}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label={`${label} color picker`}
              />
            </label>
          </div>

          <div className="flex-1">
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={9}
              placeholder="#FFFFFF"
              className="bg-slate-800/80 border-slate-700 text-white font-mono uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {swatches.map((swatch) => {
            const isActive = normalizeHex(swatch) === normalizedValue;

            return (
              <button
                key={swatch}
                type="button"
                onClick={() => onChange(swatch.toUpperCase())}
                className={`h-9 rounded-lg border transition sm:h-8 ${
                  isActive
                    ? 'border-white ring-2 ring-emerald-400/70'
                    : 'border-white/10 hover:border-white/40'
                }`}
                style={{ background: swatch }}
                aria-label={`Select ${swatch}`}
                title={swatch}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
