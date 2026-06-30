'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const COLOR_SWATCHES = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080',
  '#0EA5E9', '#FF1493', '#32CD32', '#8A2BE2', '#FFD700',
];

const POPUP_WIDTH = 320;

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
  const [menuStyle, setMenuStyle] = useState(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const normalizedValue = normalizeHexColor(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInputValue(normalizeHexColor(value));
  }, [value]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const availableWidth = Math.min(POPUP_WIDTH, viewportWidth - 16);
      const left = Math.max(8, Math.min(rect.left, viewportWidth - availableWidth - 8));
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left,
        width: availableWidth,
        zIndex: 1000,
      });
    };

    const handleClickOutside = (event) => {
      const target = event.target;
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
      setInputValue(normalizeHexColor(value));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, value]);

  const applyColor = (nextValue) => {
    const normalized = normalizeHexColor(nextValue, normalizedValue);
    setInputValue(normalized);
    onChange(normalized);
  };

  const handleTextChange = (nextValue) => {
    const upper = nextValue.toUpperCase();
    setInputValue(upper);
    if (/^#[0-9A-Fa-f]{6}$/.test(upper)) {
      onChange(upper);
    }
  };

  const handleTextBlur = () => {
    const normalized = normalizeHexColor(inputValue, normalizedValue);
    setInputValue(normalized);
    onChange(normalized);
  };

  const popup = mounted && isOpen && menuStyle ? createPortal(
    <div ref={menuRef} style={menuStyle}>
      <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm">
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
          className="mb-3 flex h-16 w-full items-center justify-center rounded-lg border border-white/10 px-3 font-mono text-sm uppercase"
          style={{ backgroundColor: normalizedValue, color: getReadableTextColor(normalizedValue) }}
        >
          <span className="truncate">{normalizedValue}</span>
        </div>

        <div className="flex gap-2">
          <label className="relative flex-1 cursor-pointer">
            <input
              type="color"
              value={normalizedValue}
              onChange={(e) => applyColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div className="flex h-10 w-full items-center justify-center rounded-xl border border-white/20 bg-black/40 px-3 text-xs text-white">
              <Palette className="mr-1 h-4 w-4 shrink-0" />
              <span className="truncate">Custom color</span>
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
    </div>,
    document.body,
  ) : null;

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label className="text-slate-300">{label}</Label>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 outline-none md:text-base"
          style={{ borderColor: normalizedValue }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-6 w-6 shrink-0 rounded-full border border-white/20" style={{ backgroundColor: normalizedValue }} />
            <span className="truncate font-mono uppercase">{normalizedValue}</span>
          </div>
          <ChevronDown className={isOpen ? 'h-5 w-5 shrink-0 rotate-180 transition-transform duration-300' : 'h-5 w-5 shrink-0 transition-transform duration-300'} />
        </button>
      </div>
      {popup}
    </div>
  );
}
