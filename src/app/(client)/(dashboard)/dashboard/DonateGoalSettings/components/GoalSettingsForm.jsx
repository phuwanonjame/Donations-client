import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Eye,
  EyeOff,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Target,
  Type,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDashboardCopy } from '../../i18n';
import ColorInput from './ColorInput';
import DropdownSelect from './DropdownSelect';
import SectionWrapper from './SectionWrapper';
import ShineStylePicker from './ShineStylePicker';
import StringDropdownSelect from './StringDropdownSelect';
import TemplateVariablesHint from './TemplateVariablesHint';
import ThaiDateTimeInput from './ThaiDateTimeInput';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  progressBarSkins,
  progressShineEffects,
  strokeWidths,
  templateVariables,
  widgetTypes,
} from '../constants/donate-goal';
import { getResetDates } from '../utils/donate-goal';
import { useDonateGoalSettings } from './context/DonateGoalSettingsProvider';

const GOAL_TABS = [
  { id: 'settings', icon: Target, color: 'from-emerald-500 to-teal-500' },
  { id: 'progress', icon: Sparkles, color: 'from-cyan-500 to-blue-500' },
  { id: 'description', icon: Type, color: 'from-violet-500 to-purple-500' },
  { id: 'typography', icon: Palette, color: 'from-amber-500 to-orange-500' },
];

const TAB_COPY = {
  en: {
    settings: { title: 'Layout', subtitle: 'Goal name, amount, and schedule', target: 'Title area + goal rules' },
    progress: { title: 'Progress', subtitle: 'Bar, amount text, and shine', target: 'Progress bar + amount line' },
    description: { title: 'Details', subtitle: 'Bottom helper text on the widget', target: 'Description row' },
    typography: { title: 'Text Style', subtitle: 'Fonts, colors, and outline style', target: 'Goal title text' },
    editingLabel: 'Now editing',
    affectsLabel: 'Affects',
    advancedTitle: 'Advanced controls',
    advancedDesc: 'Show description and typography tabs',
  },
  th: {
    settings: { title: 'โครงหลัก', subtitle: 'ชื่อเป้า จำนวน และช่วงเวลา', target: 'ส่วนหัว + กติกาเป้าหมาย' },
    progress: { title: 'หลอดเป้า', subtitle: 'หลอด ข้อความยอด และแสง', target: 'หลอด progress + ข้อความยอด' },
    description: { title: 'ข้อความล่าง', subtitle: 'ข้อความอธิบายด้านล่าง widget', target: 'แถวคำอธิบายด้านล่าง' },
    typography: { title: 'สไตล์ตัวอักษร', subtitle: 'ฟอนต์ สี และเส้นขอบข้อความ', target: 'ข้อความชื่อเป้าหมาย' },
    editingLabel: 'กำลังแก้',
    affectsLabel: 'มีผลกับ',
    advancedTitle: 'Advanced controls',
    advancedDesc: 'แสดงแท็บข้อความล่างและสไตล์ตัวอักษร',
  },
};

const PREVIEW_TARGET_MAP = {
  settings: 'settings',
  progress: 'progress',
  description: 'description',
  typography: 'typography',
};

function GoalTabNav({ activeTab, onSelect, tabs, copy }) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 blur" />
        <div className="relative overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-800/40 p-1.5 backdrop-blur-sm">
          <div
            className="grid min-w-max grid-flow-col auto-cols-[108px] gap-1.5 sm:auto-cols-[124px] lg:min-w-0 lg:grid-flow-row"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const tabCopy = copy[tab.id];

              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelect(tab.id)}
                  className={`group relative rounded-xl px-2.5 py-3 text-left transition-all duration-300 sm:px-3 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color}`}
                      layoutId="goalActiveTab"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex min-w-0 flex-col items-center gap-2 text-center">
                    <div className={`rounded-lg p-2 ${isActive ? 'bg-white/15' : 'bg-slate-900/40 group-hover:bg-slate-900/60'}`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <p className="w-full truncate text-xs font-semibold sm:text-sm">{tabCopy.title}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">{copy.editingLabel}</p>
          <p className="mt-1 text-sm font-semibold text-white">{copy[activeTab].title}</p>
          <p className="mt-1 text-xs text-emerald-100/80">{copy[activeTab].subtitle}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{copy.affectsLabel}</p>
          <p className="mt-1 text-sm text-slate-200">{copy[activeTab].target}</p>
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, step, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-slate-300">{label}</Label>
        <span className="w-14 text-right text-sm text-white">{value}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([next]) => onChange(next)} />
    </div>
  );
}

function FontSizeField({ label, value, onChange }) {
  const currentIndex = Math.max(fontSizes.indexOf(value), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-slate-300">{label}</Label>
        <span className="w-14 text-right text-sm text-white">{value}</span>
      </div>
      <Slider
        value={[currentIndex]}
        min={0}
        max={fontSizes.length - 1}
        step={1}
        onValueChange={([next]) => onChange(fontSizes[next])}
      />
    </div>
  );
}

function ToggleCard({ title, description, checked, onChange, icon }) {
  const Icon = icon;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        {Icon ? <Icon className={`mt-0.5 h-4 w-4 ${checked ? 'text-emerald-400' : 'text-slate-400'}`} /> : null}
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          {description ? <p className="text-xs text-slate-400">{description}</p> : null}
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
      />
    </div>
  );
}

export default function GoalSettingsForm({
  settings: settingsProp,
  update: updateProp,
  setPreviewFocus,
}) {
  const [activeTab, setActiveTab] = useState('settings');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    settings: contextSettings,
    update: contextUpdate,
    updateSettings,
  } = useDonateGoalSettings();
  const settings = settingsProp ?? contextSettings;
  const update = updateProp ?? contextUpdate;
  const { language } = useLanguage();
  const textInputClassName = 'bg-slate-800/80 border-slate-700 text-white';
  const templateInputClassName = `${textInputClassName} font-mono`;
  const visibleTabs = showAdvanced ? GOAL_TABS : GOAL_TABS.slice(0, 2);
  const copy = TAB_COPY[language] || TAB_COPY.en;

  const progressSkinPresets = useMemo(() => ({
    custom: null,
    aurora: { from: '#22D3EE', via: '#8B5CF6', to: '#EC4899' },
    sunset: { from: '#FB7185', via: '#FB923C', to: '#FACC15' },
    ocean: { from: '#0EA5E9', via: '#14B8A6', to: '#67E8F9' },
    berry: { from: '#A855F7', via: '#EC4899', to: '#F43F5E' },
    mono: { from: '#94A3B8', via: '#E2E8F0', to: '#CBD5E1' },
  }), []);

  const isSolidProgressSkin = settings.progressSkin === 'solid';
  const isCustomProgressSkin = settings.progressSkin === 'custom';
  const isLargeWidget = settings.type === 'large';

  useEffect(() => {
    if (!showAdvanced && (activeTab === 'description' || activeTab === 'typography')) {
      setActiveTab('settings');
    }
  }, [activeTab, showAdvanced]);

  useEffect(() => {
    if (setPreviewFocus) {
      setPreviewFocus(PREVIEW_TARGET_MAP[activeTab] || 'settings');
    }
  }, [activeTab, setPreviewFocus]);

  const handleResetDates = useCallback(() => {
    const { startAt, endAt } = getResetDates();
    updateSettings({
      startAt,
      endAt,
      isUseStartAt: true,
      isUseEndAt: true,
    });
  }, [updateSettings]);

  const handleGoalAmountChange = useCallback((event) => {
    const nextValue = parseInt(event.target.value, 10);
    update('goalAmount', Number.isNaN(nextValue) ? 0 : nextValue);
  }, [update]);

  const handleProgressSkinChange = useCallback((value) => {
    const preset = progressSkinPresets[value];
    updateSettings({
      progressSkin: value,
      ...(preset ? {
        progressGradientFrom: preset.from,
        progressGradientVia: preset.via,
        progressGradientTo: preset.to,
      } : {}),
    });
  }, [progressSkinPresets, updateSettings]);

  const tabContentVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.22 } },
    exit: { opacity: 0, x: 16, transition: { duration: 0.18 } },
  };

  return (
    <div className="space-y-6 px-4 sm:space-y-7 sm:px-0">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-3">
        <div className="flex min-w-0 items-start gap-2">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{copy.advancedTitle}</p>
            <p className="text-xs text-slate-400">{copy.advancedDesc}</p>
          </div>
        </div>
        <Switch
          checked={showAdvanced}
          onCheckedChange={setShowAdvanced}
          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
        />
      </div>

      <GoalTabNav activeTab={activeTab} onSelect={setActiveTab} tabs={visibleTabs} copy={copy} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-w-0 space-y-6 sm:space-y-7"
        >

          {activeTab === 'settings' && (
            <>
              <SectionWrapper delay={0.05}>
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Layout
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {widgetTypes.map((widgetType) => (
                    <button
                      key={widgetType.id}
                      type="button"
                      onClick={() => update('type', widgetType.id)}
                      className={`rounded-xl border p-3 text-sm font-medium text-white transition duration-300 hover:scale-[1.02] sm:rounded-2xl sm:text-base ${
                        settings.type === widgetType.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700 bg-black/20 hover:border-slate-500'
                      }`}
                    >
                      {widgetType.name}
                    </button>
                  ))}
                </div>
              </SectionWrapper>

              <SectionWrapper delay={0.1}>
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Goal basics
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Goal name</Label>
                      <Input
                        type="text"
                        value={settings.goalName}
                        onChange={(event) => update('goalName', event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        maxLength={80}
                        placeholder="Donation goal"
                        className={textInputClassName}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Goal amount</Label>
                      <Input
                        type="number"
                        value={settings.goalAmount}
                        onChange={handleGoalAmountChange}
                        min={0}
                        step={1}
                        inputMode="numeric"
                        placeholder="0"
                        className={textInputClassName}
                      />
                    </div>
                  </div>

                  <ToggleCard
                    title="Show goal amount"
                    description="Display the amount next to the goal name."
                    checked={settings.showGoalAmount}
                    onChange={(value) => update('showGoalAmount', value)}
                    icon={settings.showGoalAmount ? Eye : EyeOff}
                  />
                </div>
              </SectionWrapper>

              <SectionWrapper delay={0.15}>
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Schedule
                </h3>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <ToggleCard
                      title="Use custom start date"
                      description="If turned off, the goal starts from the member start date."
                      checked={settings.isUseStartAt}
                      onChange={(value) => update('isUseStartAt', value)}
                    />
                    {settings.isUseStartAt && (
                      <ThaiDateTimeInput label="Start date" value={settings.startAt} onChange={(value) => update('startAt', value)} />
                    )}
                  </div>

                  <div className="space-y-3">
                    <ToggleCard
                      title="Use custom end date"
                      description="If turned off, the goal will not have an end date."
                      checked={settings.isUseEndAt}
                      onChange={(value) => update('isUseEndAt', value)}
                    />
                    {settings.isUseEndAt && (
                      <ThaiDateTimeInput label="End date" value={settings.endAt} onChange={(value) => update('endAt', value)} />
                    )}
                  </div>

                  <Button variant="outline" className="w-full gap-2 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleResetDates}>
                    <RotateCcw className="h-4 w-4" />
                    Reset to a 30-day goal
                  </Button>
                </div>
              </SectionWrapper>
            </>
          )}

          {activeTab === 'progress' && (
            <SectionWrapper delay={0.15}>
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                Progress bar
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Progress text</Label>
                  <Input
                    type="text"
                    value={settings.progressText}
                    onChange={(event) => update('progressText', event.target.value)}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="{{amount}} THB ({{percentage}}%)"
                    className={templateInputClassName}
                  />
                  <TemplateVariablesHint variables={templateVariables.progress} />
                </div>

                <SliderField
                  label="Bar height"
                  value={settings.progressBarHeight ?? 32}
                  min={20}
                  max={56}
                  step={2}
                  onChange={(value) => update('progressBarHeight', value)}
                />

                <DropdownSelect
                  label="Progress theme"
                  value={settings.progressSkin ?? 'custom'}
                  options={progressBarSkins}
                  onChange={handleProgressSkinChange}
                />

                {showAdvanced && (
                  <div className="grid grid-cols-1 gap-4">
                    <ColorInput label="Progress color" value={settings.progressColor} onChange={(value) => update('progressColor', value)} />
                    <DropdownSelect label="Progress font" value={settings.progressFontFamily} options={fontFamilies} onChange={(value) => update('progressFontFamily', value)} />
                  </div>
                )}

                {showAdvanced && isCustomProgressSkin && (
                  <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-900/35 p-3 sm:p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">Studio gradient</p>
                      <p className="text-xs leading-relaxed text-slate-400">Fine tune the three color stops for the custom gradient theme.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <ColorInput label="Gradient start" value={settings.progressGradientFrom ?? '#38BDF8'} onChange={(value) => update('progressGradientFrom', value)} />
                      <ColorInput label="Gradient middle" value={settings.progressGradientVia ?? '#818CF8'} onChange={(value) => update('progressGradientVia', value)} />
                      <ColorInput label="Gradient end" value={settings.progressGradientTo ?? '#F472B6'} onChange={(value) => update('progressGradientTo', value)} />
                    </div>
                  </div>
                )}

                {!isSolidProgressSkin && !isCustomProgressSkin && (
                  <p className="text-xs text-slate-400">This preset already includes its own gradient colors. Switch to Studio Gradient if you want custom colors.</p>
                )}

                {showAdvanced && isLargeWidget && (
                  <div className="space-y-4 border-t border-slate-700/50 pt-4">
                    <p className="text-sm text-slate-400">Large widget text</p>
                    <FontSizeField label="Top font size" value={settings.largeTopFontSize} onChange={(value) => update('largeTopFontSize', value)} />
                    <FontSizeField label="Bottom font size" value={settings.largeBottomFontSize} onChange={(value) => update('largeBottomFontSize', value)} />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Top right text</Label>
                      <Input type="text" value={settings.largeTopRightText} onChange={(event) => update('largeTopRightText', event.target.value)} placeholder="{{amount}}/{{goal}}" className={templateInputClassName} />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Bottom left text</Label>
                        <Input type="text" value={settings.largeBottomLeftText} onChange={(event) => update('largeBottomLeftText', event.target.value)} placeholder="Ends in {{days}} days" className={templateInputClassName} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Bottom right text</Label>
                        <Input type="text" value={settings.largeBottomRightText} onChange={(event) => update('largeBottomRightText', event.target.value)} placeholder="{{percentage}}%" className={templateInputClassName} />
                      </div>
                    </div>

                    <TemplateVariablesHint variables={templateVariables.large} />
                  </div>
                )}

                <ToggleCard
                  title="Shine effect"
                  description="Add a moving light effect on top of the progress bar."
                  checked={settings.progressShine}
                  onChange={(value) => update('progressShine', value)}
                />

                {settings.progressShine && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-slate-300">Shine style</Label>
                      <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Live preview</span>
                    </div>
                    <ShineStylePicker
                      value={settings.progressShineEffect ?? 'sweep'}
                      onChange={(value) => update('progressShineEffect', value)}
                      options={progressShineEffects}
                      progressColor={settings.progressColor}
                      progressSkin={settings.progressSkin ?? 'custom'}
                      progressGradientFrom={settings.progressGradientFrom}
                      progressGradientVia={settings.progressGradientVia}
                      progressGradientTo={settings.progressGradientTo}
                    />
                  </div>
                )}
              </div>
            </SectionWrapper>
          )}

          {activeTab === 'description' && (
            <SectionWrapper delay={0.2}>
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                <Type className="h-5 w-5 text-emerald-400" />
                Description text
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Left text</Label>
                    <Input type="text" value={isLargeWidget ? settings.largeBottomLeftText : settings.descriptionLeftText} onChange={(event) => update(isLargeWidget ? 'largeBottomLeftText' : 'descriptionLeftText', event.target.value)} placeholder="Raised {{amount}}" className={templateInputClassName} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Right text</Label>
                    <Input type="text" value={isLargeWidget ? settings.largeBottomRightText : settings.descriptionRightText} onChange={(event) => update(isLargeWidget ? 'largeBottomRightText' : 'descriptionRightText', event.target.value)} placeholder="Ends in {{days}} days" className={templateInputClassName} />
                  </div>
                </div>

                <TemplateVariablesHint variables={templateVariables.description} />

                <div className="grid grid-cols-1 gap-4">
                  <DropdownSelect label="Font family" value={settings.descriptionFontFamily} options={fontFamilies} onChange={(value) => update('descriptionFontFamily', value)} />
                  <DropdownSelect label="Font weight" value={settings.descriptionFontWeight} options={fontWeights} onChange={(value) => update('descriptionFontWeight', value)} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FontSizeField label="Font size" value={isLargeWidget ? settings.largeBottomFontSize : settings.descriptionFontSize} onChange={(value) => update(isLargeWidget ? 'largeBottomFontSize' : 'descriptionFontSize', value)} />
                  <ColorInput label="Text color" value={settings.descriptionColor} onChange={(value) => update('descriptionColor', value)} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <StringDropdownSelect label="Stroke width" value={settings.descriptionStrokeWidth} options={strokeWidths} onChange={(value) => update('descriptionStrokeWidth', value)} />
                  <ColorInput label="Stroke color" value={settings.descriptionStrokeColor} onChange={(value) => update('descriptionStrokeColor', value)} />
                </div>
              </div>
            </SectionWrapper>
          )}

          {activeTab === 'typography' && (
            <SectionWrapper delay={0.25}>
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                <Palette className="h-5 w-5 text-emerald-400" />
                Goal title style
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <DropdownSelect label="Font family" value={settings.goalFontFamily} options={fontFamilies} onChange={(value) => update('goalFontFamily', value)} />
                  <DropdownSelect label="Font weight" value={settings.goalFontWeight} options={fontWeights} onChange={(value) => update('goalFontWeight', value)} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FontSizeField label="Font size" value={settings.goalFontSize} onChange={(value) => update('goalFontSize', value)} />
                  <ColorInput label="Text color" value={settings.goalColor} onChange={(value) => update('goalColor', value)} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <StringDropdownSelect label="Stroke width" value={settings.goalStrokeWidth} options={strokeWidths} onChange={(value) => update('goalStrokeWidth', value)} />
                  <ColorInput label="Stroke color" value={settings.goalStrokeColor} onChange={(value) => update('goalStrokeColor', value)} />
                </div>
              </div>
            </SectionWrapper>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

