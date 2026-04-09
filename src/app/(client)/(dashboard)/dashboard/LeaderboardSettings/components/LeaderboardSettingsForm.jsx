import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Trophy, LayoutTemplate, Clock, Users, Palette, Type, Crown, Medal, RotateCcw } from 'lucide-react';
import ColorInput from './ColorInput';
import DropdownSelect from './DropdownSelect';
import StringDropdownSelect from './StringDropdownSelect';
import SectionWrapper from './SectionWrapper';
import ThaiDateTimeInput from './ThaiDateTimeInput';
import { layoutStyles, timeRanges, fontFamilies, fontWeights, fontSizes, strokeWidths, textAlignments } from '../constants/donate-leaderboard';
import { getResetDates } from '../utils/donate-leaderboard';

// ใช้ Map เพื่อ O(1) lookup แทน indexOf O(n)
const fontSizeIndexMap = new Map(fontSizes.map((v, i) => [v, i]));
const getFontSizeIndex = (value) => fontSizeIndexMap.get(value) ?? 0;

// Switch row ที่ใช้ซ้ำบ่อย
const SwitchRow = ({ label, sublabel, checked, onCheckedChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 gap-3">
    <div>
      <p className="text-white font-medium text-sm">{label}</p>
      {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-500"
    />
  </div>
);

// FontSize Slider ที่ใช้ซ้ำบ่อย
const FontSizeSlider = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <Label className="text-slate-300">{label}</Label>
    <div className="flex items-center gap-3">
      <Slider
        value={[getFontSizeIndex(value)]}
        min={0}
        max={fontSizes.length - 1}
        step={1}
        onValueChange={([val]) => onChange(fontSizes[val])}
        className="flex-1"
      />
      <span className="text-white text-sm w-12 text-right">{value}</span>
    </div>
  </div>
);

export default function LeaderboardSettingsForm({ settings, update }) {
  const handleResetDates = useCallback(() => {
    const { startAt, endAt } = getResetDates();
    update('startAt', startAt);
    update('endAt', endAt);
    update('isUseStartAt', true);
    update('isUseEndAt', true);
  }, [update]);

  // memoize เฉพาะส่วนที่ depend กับ settings.layoutStyle เพื่อกัน re-render ที่ไม่จำเป็น
  const isPodium = settings.layoutStyle === 'podium';

  return (
    <div className="space-y-6">

      {/* Configuration */}
      <SectionWrapper delay={0.1}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Title</Label>
              <Input
                value={settings.titleText}
                onChange={e => update('titleText', e.target.value)}
                className="bg-slate-800/80 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Time Range</Label>
              <DropdownSelect label="" value={settings.timeRange} options={timeRanges} onChange={v => update('timeRange', v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Layout Style</Label>
              <DropdownSelect label="" value={settings.layoutStyle} options={layoutStyles} onChange={v => update('layoutStyle', v)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Max Entries</Label>
                <span className="text-amber-400 font-medium">{settings.maxEntries}</span>
              </div>
              <Slider value={[settings.maxEntries]} onValueChange={([val]) => update('maxEntries', val)} min={3} max={10} step={1} />
            </div>
          </div>
          <div className="mt-4">
            <SwitchRow
              label="Enable Leaderboard"
              checked={settings.enabled}
              onCheckedChange={v => update('enabled', v)}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Appearance */}
      <SectionWrapper delay={0.2}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Appearance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ColorInput label="Accent Color" value={settings.accentColor} onChange={v => update('accentColor', v)} />
            <ColorInput label="Background" value={settings.backgroundColor} onChange={v => update('backgroundColor', v)} />
          </div>
          <div className="space-y-3">
            {[
              { key: 'showRank',      label: 'Show Rank Number' },
              { key: 'showAmount',    label: 'Show Donation Amount' },
              { key: 'showAvatar',    label: 'Show Avatar/Icon' },
              { key: 'animateEntries', label: 'Animate New Entries' },
            ].map(opt => (
              <SwitchRow key={opt.key} label={opt.label} checked={settings[opt.key]} onCheckedChange={v => update(opt.key, v)} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Date Range */}
      <SectionWrapper delay={0.25}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Date Range (Filter)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <SwitchRow label="กำหนดวันที่เริ่มต้นเอง" checked={settings.isUseStartAt} onCheckedChange={v => update('isUseStartAt', v)} />
              {settings.isUseStartAt && <ThaiDateTimeInput label="วันที่เริ่มต้น (พ.ศ.)" value={settings.startAt} onChange={v => update('startAt', v)} />}
            </div>
            <div className="space-y-3">
              <SwitchRow label="กำหนดวันที่สิ้นสุดเอง" checked={settings.isUseEndAt} onCheckedChange={v => update('isUseEndAt', v)} />
              {settings.isUseEndAt && <ThaiDateTimeInput label="วันที่สิ้นสุด (พ.ศ.)" value={settings.endAt} onChange={v => update('endAt', v)} />}
            </div>
          </div>
          <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 mt-4" onClick={handleResetDates}>
            <RotateCcw className="w-4 h-4" /> รีเซ็ตเป็น 30 วัน
          </Button>
        </div>
      </SectionWrapper>

      {/* Title Typography */}
      <SectionWrapper delay={0.3}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Type className="w-5 h-5 text-amber-400" /> Title Typography
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownSelect label="Font Family" value={settings.titleFontFamily} options={fontFamilies} onChange={v => update('titleFontFamily', v)} />
            <DropdownSelect label="Font Weight" value={settings.titleFontWeight} options={fontWeights} onChange={v => update('titleFontWeight', v)} />
            <FontSizeSlider label="Font Size" value={settings.titleFontSize} onChange={v => update('titleFontSize', v)} />
            <ColorInput label="Color" value={settings.titleColor} onChange={v => update('titleColor', v)} />
            <StringDropdownSelect label="Stroke Width" value={settings.titleStrokeWidth} options={strokeWidths} onChange={v => update('titleStrokeWidth', v)} />
            <ColorInput label="Stroke Color" value={settings.titleStrokeColor} onChange={v => update('titleStrokeColor', v)} />
            <DropdownSelect label="Alignment" value={settings.titleAlignment} options={textAlignments} onChange={v => update('titleAlignment', v)} />
          </div>
        </div>
      </SectionWrapper>

      {/* List Typography */}
      <SectionWrapper delay={0.35}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" /> List Typography
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownSelect label="Font Family" value={settings.listFontFamily} options={fontFamilies} onChange={v => update('listFontFamily', v)} />
            <DropdownSelect label="Font Weight" value={settings.listFontWeight} options={fontWeights} onChange={v => update('listFontWeight', v)} />
            <FontSizeSlider label="Font Size" value={settings.listFontSize} onChange={v => update('listFontSize', v)} />
            <ColorInput label="Name Color" value={settings.listColor} onChange={v => update('listColor', v)} />
            <ColorInput label="Amount Color" value={settings.listAmountColor} onChange={v => update('listAmountColor', v)} />
            <StringDropdownSelect label="Stroke Width" value={settings.listStrokeWidth} options={strokeWidths} onChange={v => update('listStrokeWidth', v)} />
            <ColorInput label="Stroke Color" value={settings.listStrokeColor} onChange={v => update('listStrokeColor', v)} />
          </div>
        </div>
      </SectionWrapper>

      {/* Podium Settings */}
      {isPodium && (
        <>
          <SectionWrapper delay={0.4}>
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" /> Podium - Rank 1
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropdownSelect label="Font Family" value={settings.podiumFirstFontFamily} options={fontFamilies} onChange={v => update('podiumFirstFontFamily', v)} />
                <DropdownSelect label="Font Weight" value={settings.podiumFirstFontWeight} options={fontWeights} onChange={v => update('podiumFirstFontWeight', v)} />
                <FontSizeSlider label="Username Font Size" value={settings.podiumFirstUsernameFontSize} onChange={v => update('podiumFirstUsernameFontSize', v)} />
                <ColorInput label="Username Color" value={settings.podiumFirstUsernameColor} onChange={v => update('podiumFirstUsernameColor', v)} />
                <FontSizeSlider label="Amount Font Size" value={settings.podiumFirstAmountFontSize} onChange={v => update('podiumFirstAmountFontSize', v)} />
                <ColorInput label="Amount Color" value={settings.podiumFirstAmountColor} onChange={v => update('podiumFirstAmountColor', v)} />
                <StringDropdownSelect label="Stroke Width" value={settings.podiumFirstStrokeWidth} options={strokeWidths} onChange={v => update('podiumFirstStrokeWidth', v)} />
                <ColorInput label="Stroke Color" value={settings.podiumFirstStrokeColor} onChange={v => update('podiumFirstStrokeColor', v)} />
              </div>
              <div className="mt-4">
                <SwitchRow
                  label="Shine Effect"
                  sublabel="แสงกระจาด้านหลังอันดับ 1"
                  checked={settings.podiumFirstShine}
                  onCheckedChange={v => update('podiumFirstShine', v)}
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.45}>
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-slate-300" /> Podium - Rank 2
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropdownSelect label="Font Family" value={settings.podiumSecondFontFamily} options={fontFamilies} onChange={v => update('podiumSecondFontFamily', v)} />
                <DropdownSelect label="Font Weight" value={settings.podiumSecondFontWeight} options={fontWeights} onChange={v => update('podiumSecondFontWeight', v)} />
                <FontSizeSlider label="Username Font Size" value={settings.podiumSecondUsernameFontSize} onChange={v => update('podiumSecondUsernameFontSize', v)} />
                <ColorInput label="Username Color" value={settings.podiumSecondUsernameColor} onChange={v => update('podiumSecondUsernameColor', v)} />
                <FontSizeSlider label="Amount Font Size" value={settings.podiumSecondAmountFontSize} onChange={v => update('podiumSecondAmountFontSize', v)} />
                <ColorInput label="Amount Color" value={settings.podiumSecondAmountColor} onChange={v => update('podiumSecondAmountColor', v)} />
                <StringDropdownSelect label="Stroke Width" value={settings.podiumSecondStrokeWidth} options={strokeWidths} onChange={v => update('podiumSecondStrokeWidth', v)} />
                <ColorInput label="Stroke Color" value={settings.podiumSecondStrokeColor} onChange={v => update('podiumSecondStrokeColor', v)} />
              </div>
            </div>
          </SectionWrapper>
        </>
      )}
    </div>
  );
}