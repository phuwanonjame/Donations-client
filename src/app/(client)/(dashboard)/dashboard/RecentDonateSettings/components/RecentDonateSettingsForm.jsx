"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Palette, Settings, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  thaiGoogleFonts,
  fontWeights as alertFontWeights,
} from '../../DonateAlertSettings/components/utils/fontUtils';

const TABS = [
  {
    id: 'content',
    label: 'Setup',
    title: 'Widget content',
    subtitle: 'Choose what the recent donation widget should show',
    icon: Settings,
  },
  {
    id: 'theme',
    label: 'Style',
    title: 'Visual style',
    subtitle: 'Tune colors, cards, and typography to match the other widgets',
    icon: Palette,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    title: 'Advanced controls',
    subtitle: 'Adjust spacing, borders, blur, and custom CSS only when needed',
    icon: SlidersHorizontal,
  },
];

const CARD_STYLES = ['minimal', 'soft', 'outline', 'plain'];
const FONT_FAMILIES = thaiGoogleFonts.map((font) => ({
  id: font.id,
  label: font.name,
}));
const FONT_WEIGHTS = alertFontWeights.map((weight) => ({
  id: weight,
  label: weight.charAt(0).toUpperCase() + weight.slice(1),
}));

const COLOR_SWATCHES = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080',
  '#0EA5E9', '#FF1493', '#32CD32', '#8A2BE2', '#FFD700',
];

const normalizeHexColor = (value, fallback = '#FFFFFF') => {
  const raw = String(value || '').trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(raw)) {
    return `#${raw.slice(1).split('').map((char) => char + char).join('').toUpperCase()}`;
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

function TabNav({ activeTab, onSelect, tabs }) {
  const activeMeta = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) || tabs[0],
    [activeTab, tabs],
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 blur" />
        <div className="relative overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-800/40 p-1.5 backdrop-blur-sm">
          <div
            className="grid min-w-max grid-flow-col auto-cols-[110px] gap-1.5 sm:auto-cols-[126px] lg:min-w-0 lg:grid-flow-row"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelect(tab.id)}
                  className={`group relative rounded-xl px-2.5 py-3 text-center transition-all duration-300 sm:px-3 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/20'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex min-w-0 flex-col items-center gap-2">
                    <div className={`rounded-lg p-2 ${isActive ? 'bg-white/15' : 'bg-slate-900/40 group-hover:bg-slate-900/60'}`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="w-full truncate text-xs font-semibold sm:text-sm">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">Editing section</p>
        <p className="mt-1 text-sm font-semibold text-white">{activeMeta.title}</p>
        <p className="mt-1 text-xs text-violet-100/80">{activeMeta.subtitle}</p>
      </div>
    </div>
  );
}

export default function RecentDonateSettingsForm({ settings, updateSetting, donations }) {
  const [activeTab, setActiveTab] = useState('content');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const firstDonation = donations[0] || {};
  const visibleTabs = showAdvanced ? TABS : TABS.slice(0, 2);

  const updateTextColor = (value) => {
    updateSetting('textColor', value);
  };

  const updateAccentColor = (value) => {
    updateSetting('accentColor', value);
  };

  useEffect(() => {
    if (!showAdvanced && activeTab === 'advanced') {
      setActiveTab('content');
    }
  }, [activeTab, showAdvanced]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/50 backdrop-blur-xl">
      <div className="space-y-4 p-4 pb-0">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-3">
          <div className="flex min-w-0 items-start gap-2">
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-300">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Advanced controls</p>
              <p className="text-xs text-slate-400">Show extra layout, border, blur, and custom CSS settings.</p>
            </div>
          </div>
          <Switch
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-blue-500"
          />
        </div>
        <TabNav activeTab={activeTab} onSelect={setActiveTab} tabs={visibleTabs} />
      </div>
      <div className="space-y-5 p-5">
        {activeTab === 'content' && (
          <>
            <PanelTitle number="1" title="Widget content" subtitle="Choose what the recent donation widget should show" />
            <TextInput label="Title" value={settings.title} onChange={(value) => updateSetting('title', value)} />
            <ToggleList
              items={[
                ['showName', 'Show donor name'],
                ['showAmount', 'Show amount'],
                ['showTime', 'Show time ago'],
                ['showMessage', 'Show message'],
                ['autoScroll', 'Auto scroll list'],
              ]}
              settings={settings}
              updateSetting={updateSetting}
            />
            <TextInput label="Empty message" value={settings.messagePlaceholder} onChange={(value) => updateSetting('messagePlaceholder', value)} />
            <SliderControl label="Visible items" value={settings.maxEntries} onChange={(value) => updateSetting('maxEntries', value)} min={1} max={10} step={1} unit=" items" />
            <SampleMini donation={firstDonation} settings={settings} />
          </>
        )}
        {activeTab === 'theme' && (
          <>
            <PanelTitle number="2" title="Visual style" subtitle="Tune colors, cards, and typography to match the other widgets" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorInput label="Accent color" value={settings.accentColor} onChange={updateAccentColor} />

              <ColorInput label="Text color" value={settings.textColor} onChange={updateTextColor} />
              <ColorInput label="Amount color" value={settings.amountColor} onChange={(value) => updateSetting('amountColor', value)} />
            </div>

            <div className="space-y-4 rounded-xl border border-slate-700/60 bg-slate-900/30 p-4">
              <SegmentedControl label="Card style" value={settings.cardStyle} options={CARD_STYLES} onChange={(value) => updateSetting('cardStyle', value)} />
              <SliderControl label="Corner radius" value={settings.borderRadius} onChange={(value) => updateSetting('borderRadius', value)} min={0} max={32} step={1} unit="px" />
            </div>

            <div className="space-y-3">
              <SectionLabel label="Typography" hint="Adjust each text group independently" />
              <div className="grid grid-cols-1 gap-4">
                <TextStylePanel
                  title="Title"
                  color={settings.textColor}
                  fontSize={settings.fontSize}
                  fontFamily={settings.titleFontFamily}
                  fontWeight={settings.titleFontWeight}
                  onColorChange={(value) => updateSetting('textColor', value)}
                  onFontSizeChange={(value) => updateSetting('fontSize', value)}
                  onFontFamilyChange={(value) => updateSetting('titleFontFamily', value)}
                  onFontWeightChange={(value) => updateSetting('titleFontWeight', value)}
                />
                <TextStylePanel
                  title="Donor name"
                  color={settings.lastDonatorColor}
                  fontSize={settings.lastDonatorFontSize}
                  fontFamily={settings.lastDonatorFontFamily}
                  fontWeight={settings.lastDonatorFontWeight}
                  onColorChange={(value) => updateSetting('lastDonatorColor', value)}
                  onFontSizeChange={(value) => updateSetting('lastDonatorFontSize', value)}
                  onFontFamilyChange={(value) => updateSetting('lastDonatorFontFamily', value)}
                  onFontWeightChange={(value) => updateSetting('lastDonatorFontWeight', value)}
                />
                <TextStylePanel
                  title="Amount"
                  color={settings.amountColor}
                  fontSize={settings.amountFontSize}
                  fontFamily={settings.amountFontFamily}
                  fontWeight={settings.amountFontWeight}
                  onColorChange={(value) => updateSetting('amountColor', value)}
                  onFontSizeChange={(value) => updateSetting('amountFontSize', value)}
                  onFontFamilyChange={(value) => updateSetting('amountFontFamily', value)}
                  onFontWeightChange={(value) => updateSetting('amountFontWeight', value)}
                />
              </div>
            </div>
          </>
        )}
        {activeTab === 'advanced' && (
          <>
            <PanelTitle number="3" title="Advanced controls" subtitle="Adjust layout spacing and optional styling only when needed" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SliderControl label="Widget width" value={settings.widgetWidth} onChange={(value) => updateSetting('widgetWidth', value)} min={220} max={1200} step={10} unit="px" />
              <SliderControl label="Widget height" value={settings.widgetHeight} onChange={(value) => updateSetting('widgetHeight', value)} min={240} max={800} step={10} unit="px" />
              <SliderControl label="Inner padding" value={settings.padding} onChange={(value) => updateSetting('padding', value)} min={0} max={48} step={1} unit="px" />
              <SliderControl label="Item spacing" value={settings.itemSpacing} onChange={(value) => updateSetting('itemSpacing', value)} min={0} max={32} step={1} unit="px" />
            </div>
            <SwitchRow label="Show border" checked={settings.borderEnabled} onChange={(value) => updateSetting('borderEnabled', value)} />
            {settings.borderEnabled && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ColorInput label="Border color" value={settings.borderColor} onChange={(value) => updateSetting('borderColor', value)} />
                <SliderControl label="Border width" value={settings.borderWidth} onChange={(value) => updateSetting('borderWidth', value)} min={0} max={8} step={1} unit="px" />
              </div>
            )}
            <SwitchRow label="Show shadow" checked={settings.shadowEnabled} onChange={(value) => updateSetting('shadowEnabled', value)} />
            {settings.shadowEnabled && (
              <SliderControl label="Shadow blur" value={settings.shadowBlur} onChange={(value) => updateSetting('shadowBlur', value)} min={0} max={48} step={1} unit="px" />
            )}
            <div className="space-y-2">
              <Label className="text-slate-300">Custom CSS</Label>
              <Textarea
                value={settings.customCss}
                onChange={(e) => updateSetting('customCss', e.target.value)}
                rows={5}
                className="border-slate-700 bg-slate-950/80 font-mono text-xs text-slate-200"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PanelTitle({ number, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function SectionLabel({ label, hint }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{label}</h4>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

function ToggleList({ items, settings, updateSetting }) {
  return (
    <div className="divide-y divide-slate-800 rounded-xl border border-slate-700/60 bg-slate-900/40">
      {items.map(([key, label]) => (
        <SwitchRow key={key} label={label} checked={settings[key]} onChange={(value) => updateSetting(key, value)} compact />
      ))}
    </div>
  );
}

function SwitchRow({ label, checked, onChange, compact = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${compact ? 'px-3 py-2.5' : 'rounded-xl border border-slate-700/60 bg-slate-900/40 p-3'}`}>
      <span className="text-sm text-slate-100">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-blue-500" />
    </div>
  );
}

function SampleMini({ donation, settings }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3">
      <Label className="mb-2 block text-slate-300">Mini preview</Label>
      <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/70 p-3">
        <div>
          <p className="font-semibold text-white">{donation?.name || 'Viewer123'}</p>
          <p className="text-xs text-slate-300">{donation?.message || settings.messagePlaceholder}</p>
        </div>
        <p className="font-bold" style={{ color: settings.amountColor || '#38BDF8' }}>{donation?.amount || 'THB 100'}</p>
      </div>
    </div>
  );
}

function TextStylePanel({ title, color, fontSize, fontFamily, fontWeight, onColorChange, onFontSizeChange, onFontFamilyChange, onFontWeightChange }) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-xs text-slate-400">Simple typography controls</p>
      </div>
      <ColorInput label="Color" value={color} onChange={onColorChange} compact />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectControl label="Font family" value={fontFamily} options={FONT_FAMILIES} onChange={onFontFamilyChange} />
        <SelectControl label="Font weight" value={fontWeight} options={FONT_WEIGHTS} onChange={onFontWeightChange} />
      </div>
      <SliderControl label="Font size" value={fontSize} onChange={onFontSizeChange} min={10} max={48} step={1} unit="px" />
    </div>
  );
}

function SegmentedControl({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
              value === option ? 'border-violet-500 bg-violet-500/20 text-violet-200' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
            }`}
          >
            {option.replaceAll('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500" />
    </div>
  );
}

function SelectControl({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 text-sm text-white outline-none">
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
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
          <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="mt-2 w-full rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm">
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

function SliderControl({ label, value, onChange, min, max, step, unit }) {
  const display = Array.isArray(value) ? value[0] : value;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <Label className="text-slate-300">{label}</Label>
        <span className="shrink-0 font-medium text-violet-300">{display}{unit}</span>
      </div>
      <Slider value={Array.isArray(value) ? value : [value]} onValueChange={onChange} min={min} max={max} step={step} />
    </div>
  );
}










