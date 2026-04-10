'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Trophy, Clock, Users, Palette, Type, Crown, Medal, RotateCcw,
} from 'lucide-react';
import ColorInput from './ColorInput';
import DropdownSelect from './DropdownSelect';
import StringDropdownSelect from './StringDropdownSelect';
import SectionWrapper from './SectionWrapper';
import ThaiDateTimeInput from './ThaiDateTimeInput';
import {
  layoutStyles, timeRanges, fontFamilies, fontWeights, fontSizes,
  strokeWidths, textAlignments,
} from '../constants/donate-leaderboard';
import { getResetDates } from '../utils/donate-leaderboard';

// Helper to safely get font size index
const getFontSizeIndex = (value, sizes = fontSizes) => {
  const index = sizes.indexOf(value);
  return index >= 0 ? index : 0;
};

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

const FontSizeSlider = ({ label, value, onChange }) => {
  const index = getFontSizeIndex(value, fontSizes);
  
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="flex items-center gap-3">
        <Slider
          value={[index]}
          min={0}
          max={fontSizes.length - 1}
          step={1}
          onValueChange={([val]) => {
            const selectedSize = fontSizes[val];
            if (selectedSize) onChange(selectedSize);
          }}
          className="flex-1"
        />
        <span className="text-white text-sm w-16 text-right font-medium">{value || 'Auto'}</span>
      </div>
    </div>
  );
};

export default function LeaderboardSettingsForm({ settings, update }) {
  const handleResetDates = useCallback(() => {
    const { startAt, endAt } = getResetDates();
    update('startAt', startAt);
    update('endAt', endAt);
    update('isUseStartAt', true);
    update('isUseEndAt', true);
  }, [update]);

  const isPodium = settings?.layoutStyle === 'podium';

  const defaultFontFamily = fontFamilies?.[0]?.id || 'ibm-plex-sans-thai';
  const defaultFontWeight = fontWeights?.[0]?.id || 'medium';

  return (
    <div className="space-y-6">

      {/* Configuration */}
      <SectionWrapper delay={0.1}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Configuration
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Title</Label>
              <Input
                value={settings?.titleText || ''}
                onChange={e => update('titleText', e.target.value)}
                className="bg-slate-800/80 border-slate-700 text-white placeholder-slate-500"
                placeholder="Enter leaderboard title"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Time Range</Label>
              <DropdownSelect
                label=""
                value={settings?.timeRange || 'month'}
                options={timeRanges}
                onChange={v => update('timeRange', v)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Layout Style</Label>
              <DropdownSelect
                label=""
                value={settings?.layoutStyle || 'podium'}
                options={layoutStyles}
                onChange={v => update('layoutStyle', v)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Max Entries</Label>
                <span className="text-amber-400 font-medium">{settings?.maxEntries || 5}</span>
              </div>
              <Slider
                value={[settings?.maxEntries || 5]}
                onValueChange={([val]) => update('maxEntries', val)}
                min={3}
                max={10}
                step={1}
              />
            </div>
          </div>
          <div className="mt-4">
            <SwitchRow
              label="Enable Leaderboard"
              checked={settings?.enabled || false}
              onCheckedChange={v => update('enabled', v)}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Appearance */}
      <SectionWrapper delay={0.2}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Appearance
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <ColorInput
              label="Accent Color"
              value={settings?.accentColor || '#F59E0B'}
              onChange={v => update('accentColor', v)}
            />
            <ColorInput
              label="Background"
              value={settings?.backgroundColor || '#1F2937'}
              onChange={v => update('backgroundColor', v)}
            />
          </div>
          <div className="space-y-3">
            {[
              { key: 'showRank', label: 'Show Rank Number' },
              { key: 'showAmount', label: 'Show Donation Amount' },
              { key: 'showAvatar', label: 'Show Avatar/Icon' },
              { key: 'animateEntries', label: 'Animate New Entries' },
            ].map(opt => (
              <SwitchRow
                key={opt.key}
                label={opt.label}
                checked={settings?.[opt.key] || false}
                onCheckedChange={v => update(opt.key, v)}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Date Range */}
      <SectionWrapper delay={0.25}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Date Range (Filter)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <SwitchRow
                label="กำหนดวันที่เริ่มต้นเอง"
                checked={settings?.isUseStartAt || false}
                onCheckedChange={v => update('isUseStartAt', v)}
              />
              {settings?.isUseStartAt && (
                <ThaiDateTimeInput
                  label="วันที่เริ่มต้น (พ.ศ.)"
                  value={settings?.startAt}
                  onChange={v => update('startAt', v)}
                />
              )}
            </div>
            <div className="space-y-3">
              <SwitchRow
                label="กำหนดวันที่สิ้นสุดเอง"
                checked={settings?.isUseEndAt || false}
                onCheckedChange={v => update('isUseEndAt', v)}
              />
              {settings?.isUseEndAt && (
                <ThaiDateTimeInput
                  label="วันที่สิ้นสุด (พ.ศ.)"
                  value={settings?.endAt}
                  onChange={v => update('endAt', v)}
                />
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 mt-4"
            onClick={handleResetDates}
          >
            <RotateCcw className="w-4 h-4" /> รีเซ็ตเป็น 30 วัน
          </Button>
        </div>
      </SectionWrapper>

      {/* Title Typography */}
      <SectionWrapper delay={0.3}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Type className="w-5 h-5 text-amber-400" /> Title Typography
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DropdownSelect
              label="Font Family"
              value={settings?.titleFontFamily || defaultFontFamily}
              options={fontFamilies}
              onChange={v => update('titleFontFamily', v)}
            />
            <DropdownSelect
              label="Font Weight"
              value={settings?.titleFontWeight || defaultFontWeight}
              options={fontWeights}
              onChange={v => update('titleFontWeight', v)}
            />
            <FontSizeSlider
              label="Font Size"
              value={settings?.titleFontSize || fontSizes[0]}
              onChange={v => update('titleFontSize', v)}
            />
            <ColorInput
              label="Color"
              value={settings?.titleColor || '#FFFFFF'}
              onChange={v => update('titleColor', v)}
            />
            <StringDropdownSelect
              label="Stroke Width"
              value={settings?.titleStrokeWidth || '0px'}
              options={strokeWidths}
              onChange={v => update('titleStrokeWidth', v)}
            />
            <ColorInput
              label="Stroke Color"
              value={settings?.titleStrokeColor || '#00000000'}
              onChange={v => update('titleStrokeColor', v)}
            />
            <DropdownSelect
              label="Alignment"
              value={settings?.titleAlignment || 'center'}
              options={textAlignments}
              onChange={v => update('titleAlignment', v)}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* List Typography */}
      <SectionWrapper delay={0.35}>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" /> List Typography
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DropdownSelect
              label="Font Family"
              value={settings?.listFontFamily || defaultFontFamily}
              options={fontFamilies}
              onChange={v => update('listFontFamily', v)}
            />
            <DropdownSelect
              label="Font Weight"
              value={settings?.listFontWeight || defaultFontWeight}
              options={fontWeights}
              onChange={v => update('listFontWeight', v)}
            />
            <FontSizeSlider
              label="Font Size"
              value={settings?.listFontSize || fontSizes[0]}
              onChange={v => update('listFontSize', v)}
            />
            <ColorInput
              label="Name Color"
              value={settings?.listColor || '#FFFFFF'}
              onChange={v => update('listColor', v)}
            />
            <ColorInput
              label="Amount Color"
              value={settings?.listAmountColor || '#F59E0B'}
              onChange={v => update('listAmountColor', v)}
            />
            <StringDropdownSelect
              label="Stroke Width"
              value={settings?.listStrokeWidth || '0px'}
              options={strokeWidths}
              onChange={v => update('listStrokeWidth', v)}
            />
            <ColorInput
              label="Stroke Color"
              value={settings?.listStrokeColor || '#00000000'}
              onChange={v => update('listStrokeColor', v)}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Podium Settings */}
      {isPodium && (
        <>
          <SectionWrapper delay={0.4}>
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" /> Podium - Rank 1
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DropdownSelect
                  label="Font Family"
                  value={settings?.podiumFirstFontFamily || defaultFontFamily}
                  options={fontFamilies}
                  onChange={v => update('podiumFirstFontFamily', v)}
                />
                <DropdownSelect
                  label="Font Weight"
                  value={settings?.podiumFirstFontWeight || defaultFontWeight}
                  options={fontWeights}
                  onChange={v => update('podiumFirstFontWeight', v)}
                />
                <FontSizeSlider
                  label="Username Font Size"
                  value={settings?.podiumFirstUsernameFontSize || fontSizes[0]}
                  onChange={v => update('podiumFirstUsernameFontSize', v)}
                />
                <ColorInput
                  label="Username Color"
                  value={settings?.podiumFirstUsernameColor || '#FFD700'}
                  onChange={v => update('podiumFirstUsernameColor', v)}
                />
                <FontSizeSlider
                  label="Amount Font Size"
                  value={settings?.podiumFirstAmountFontSize || fontSizes[0]}
                  onChange={v => update('podiumFirstAmountFontSize', v)}
                />
                <ColorInput
                  label="Amount Color"
                  value={settings?.podiumFirstAmountColor || '#FFD700'}
                  onChange={v => update('podiumFirstAmountColor', v)}
                />
                <StringDropdownSelect
                  label="Stroke Width"
                  value={settings?.podiumFirstStrokeWidth || '0px'}
                  options={strokeWidths}
                  onChange={v => update('podiumFirstStrokeWidth', v)}
                />
                <ColorInput
                  label="Stroke Color"
                  value={settings?.podiumFirstStrokeColor || '#00000000'}
                  onChange={v => update('podiumFirstStrokeColor', v)}
                />
              </div>
              <div className="mt-4">
                <SwitchRow
                  label="Shine Effect"
                  sublabel="แสงกระจายด้านหลังอันดับ 1"
                  checked={settings?.podiumFirstShine || false}
                  onCheckedChange={v => update('podiumFirstShine', v)}
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.45}>
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-slate-300" /> Podium - Rank 2
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DropdownSelect
                  label="Font Family"
                  value={settings?.podiumSecondFontFamily || defaultFontFamily}
                  options={fontFamilies}
                  onChange={v => update('podiumSecondFontFamily', v)}
                />
                <DropdownSelect
                  label="Font Weight"
                  value={settings?.podiumSecondFontWeight || defaultFontWeight}
                  options={fontWeights}
                  onChange={v => update('podiumSecondFontWeight', v)}
                />
                <FontSizeSlider
                  label="Username Font Size"
                  value={settings?.podiumSecondUsernameFontSize || fontSizes[0]}
                  onChange={v => update('podiumSecondUsernameFontSize', v)}
                />
                <ColorInput
                  label="Username Color"
                  value={settings?.podiumSecondUsernameColor || '#C0C0C0'}
                  onChange={v => update('podiumSecondUsernameColor', v)}
                />
                <FontSizeSlider
                  label="Amount Font Size"
                  value={settings?.podiumSecondAmountFontSize || fontSizes[0]}
                  onChange={v => update('podiumSecondAmountFontSize', v)}
                />
                <ColorInput
                  label="Amount Color"
                  value={settings?.podiumSecondAmountColor || '#C0C0C0'}
                  onChange={v => update('podiumSecondAmountColor', v)}
                />
                <StringDropdownSelect
                  label="Stroke Width"
                  value={settings?.podiumSecondStrokeWidth || '0px'}
                  options={strokeWidths}
                  onChange={v => update('podiumSecondStrokeWidth', v)}
                />
                <ColorInput
                  label="Stroke Color"
                  value={settings?.podiumSecondStrokeColor || '#00000000'}
                  onChange={v => update('podiumSecondStrokeColor', v)}
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.5}>
            <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-600" /> Podium - Rank 3
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DropdownSelect
                  label="Font Family"
                  value={settings?.podiumThirdFontFamily || defaultFontFamily}
                  options={fontFamilies}
                  onChange={v => update('podiumThirdFontFamily', v)}
                />
                <DropdownSelect
                  label="Font Weight"
                  value={settings?.podiumThirdFontWeight || defaultFontWeight}
                  options={fontWeights}
                  onChange={v => update('podiumThirdFontWeight', v)}
                />
                <FontSizeSlider
                  label="Username Font Size"
                  value={settings?.podiumThirdUsernameFontSize || fontSizes[0]}
                  onChange={v => update('podiumThirdUsernameFontSize', v)}
                />
                <ColorInput
                  label="Username Color"
                  value={settings?.podiumThirdUsernameColor || '#CD7F32'}
                  onChange={v => update('podiumThirdUsernameColor', v)}
                />
                <FontSizeSlider
                  label="Amount Font Size"
                  value={settings?.podiumThirdAmountFontSize || fontSizes[0]}
                  onChange={v => update('podiumThirdAmountFontSize', v)}
                />
                <ColorInput
                  label="Amount Color"
                  value={settings?.podiumThirdAmountColor || '#CD7F32'}
                  onChange={v => update('podiumThirdAmountColor', v)}
                />
                <StringDropdownSelect
                  label="Stroke Width"
                  value={settings?.podiumThirdStrokeWidth || '0px'}
                  options={strokeWidths}
                  onChange={v => update('podiumThirdStrokeWidth', v)}
                />
                <ColorInput
                  label="Stroke Color"
                  value={settings?.podiumThirdStrokeColor || '#00000000'}
                  onChange={v => update('podiumThirdStrokeColor', v)}
                />
              </div>
            </div>
          </SectionWrapper>
        </>
      )}
    </div>
  );
}