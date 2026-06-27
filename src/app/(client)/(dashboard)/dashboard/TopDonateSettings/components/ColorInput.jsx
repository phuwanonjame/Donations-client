import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const COLOR_SWATCHES = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080',
  '#0EA5E9', '#FF1493', '#32CD32', '#8A2BE2', '#FFD700',
];

const normalizeHexColor = (value, fallback = '#FFFFFF') => {
  const raw = String(value || '').trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(raw)) {
    return '#' + raw.slice(1).split('').map((char) => char + char).join('').toUpperCase();
  }
  return fallback.toUpperCase();
};

const getReadableTextColor = (hexColor) => {
  const normalized = normalizeHexColor(hexColor, '#000000').slice(1);
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r) + (0.587 * g) + (0.114 * b);
  return luminance > 186 ? '#000000' : '#FFFFFF';
};

export default function ColorInput({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(normalizeHexColor(value));
  const containerRef = useRef(null);
  const normalizedValue = normalizeHexColor(value);

  useEffect(() => {
    setInputValue(normalizeHexColor(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setInputValue(normalizeHexColor(value));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const applyColor = (nextValue) => {
    const normalized = normalizeHexColor(nextValue, normalizedValue);
    setInputValue(normalized);
    onChange(normalized);
  };

  const handleTextChange = (nextValue) => {
    setInputValue(nextValue.toUpperCase());
    if (/^#[0-9A-Fa-f]{6}$/.test(nextValue)) {
      onChange(nextValue.toUpperCase());
    }
  };

  const handleTextBlur = () => {
    const normalized = normalizeHexColor(inputValue, normalizedValue);
    setInputValue(normalized);
    onChange(normalized);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label className="text-slate-300">{label}</Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 outline-none md:text-base"
          style={{ borderColor: normalizedValue }}
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: normalizedValue }} />
            <span className="font-mono uppercase">{normalizedValue}</span>
          </div>
          <ChevronDown className={isOpen ? 'h-5 w-5 rotate-180 transition-transform duration-300' : 'h-5 w-5 transition-transform duration-300'} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 min-w-full w-[320px] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm shadow-2xl shadow-black/30">
            <div className="mb-3 grid grid-cols-5 gap-2">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => applyColor(swatch)}
                  className="mx-auto h-8 w-8 rounded-full border border-white/20 transition-all hover:scale-110"
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>

            <div
              className="mb-3 flex h-16 w-full items-center justify-center rounded-lg border border-white/10 font-mono text-sm uppercase"
              style={{ backgroundColor: normalizedValue, color: getReadableTextColor(normalizedValue) }}
            >
              {normalizedValue}
            </div>

            <div className="flex gap-2">
              <label className="relative flex-1 cursor-pointer">
                <input
                  type="color"
                  value={normalizedValue}
                  onChange={(e) => applyColor(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div className="flex h-10 w-full items-center justify-center rounded-xl border border-white/20 bg-black/40 text-xs text-white">
                  <Palette className="mr-1 h-4 w-4" />
                  Custom color
                </div>
              </label>
              <Input
                value={inputValue}
                onChange={(e) => handleTextChange(e.target.value)}
                onBlur={handleTextBlur}
                maxLength={7}
                className="h-10 w-28 rounded-xl border-white/20 bg-black/40 px-2 text-center font-mono text-sm uppercase text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

