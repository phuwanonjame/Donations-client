"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, Palette, Settings, Type } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const TABS = [
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-blue-500 to-indigo-500' },
  { id: 'typography', label: 'Typography', icon: Type, color: 'from-cyan-500 to-blue-500' },
  { id: 'sample', label: 'Sample', icon: Clock3, color: 'from-sky-500 to-violet-500' },
];

const ALIGNMENT_OPTIONS = [
  { id: 'list', label: 'List' },
  { id: 'compact', label: 'Compact' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'split', label: 'Split' },
];

const FONT_FAMILIES = [
  'IBM Plex Sans Thai',
  'Kanit',
  'Prompt',
  'Sarabun',
  'Noto Sans Thai',
  'Inter',
  'Poppins',
  'Montserrat',
];

const FONT_WEIGHTS = ['400', '500', '600', '700', '800', '900'];

function RecentDonateTabNav({ activeTab, onSelect }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 blur" />
      <div className="relative overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/40 p-1 backdrop-blur-sm">
        <div className="grid min-w-max grid-flow-col auto-cols-[96px] gap-1 sm:auto-cols-[118px] lg:min-w-0 lg:grid-cols-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onSelect(tab.id)}
                className={`relative rounded-lg px-2 py-2.5 transition-all duration-300 sm:px-3 sm:py-3 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-r ${tab.color}`}
                    layoutId="recentDonateActiveTab"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <Icon className={`h-4 w-4 transition-all duration-300 sm:h-5 sm:w-5 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[10px] font-medium sm:text-xs">{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function RecentDonateSettingsForm({ settings, updateSetting, donations, updateDonation }) {
  const [activeTab, setActiveTab] = useState('settings');

  const updateTextColor = (value) => {
    updateSetting('textColor', value);
    updateSetting('lastDonatorColor', value);
  };

  const updateAccentColor = (value) => {
    updateSetting('accentColor', value);
    updateSetting('amountColor', value);
  };

  const updateFontSize = (value) => {
    updateSetting('fontSize', value);
    updateSetting('lastDonatorFontSize', value);
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.22 } },
    exit: { opacity: 0, x: 16, transition: { duration: 0.18 } },
  };

  return (
    <div className="space-y-5 px-4 sm:space-y-6 sm:px-0">
      <RecentDonateTabNav activeTab={activeTab} onSelect={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-w-0 space-y-5 sm:space-y-6"
        >
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Title</Label>
                  <Input
                    value={settings.title}
                    onChange={(e) => updateSetting('title', e.target.value)}
                    className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <SelectControl
                  label="Layout Style"
                  value={settings.layoutStyle}
                  options={ALIGNMENT_OPTIONS}
                  onChange={(value) => updateSetting('layoutStyle', value)}
                />
              </div>

              <div className="space-y-3">
                {[
                  { key: 'showName', label: 'Show Donor Name' },
                  { key: 'showAmount', label: 'Show Amount' },
                  { key: 'showTime', label: 'Show Time Ago' },
                  { key: 'showMessage', label: 'Show Message' },
                  { key: 'autoScroll', label: 'Auto Scroll' },
                  { key: 'isUseStartAt', label: 'Use Start Date' },
                  { key: 'isUseEndAt', label: 'Use End Date' },
                ].map((option) => (
                  <div key={option.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-white">{option.label}</span>
                    <Switch
                      checked={settings[option.key]}
                      onCheckedChange={(value) => updateSetting(option.key, value)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {settings.isUseStartAt && (
                  <DateInput label="Start Date" value={settings.startAt} onChange={(value) => updateSetting('startAt', value)} />
                )}
                {settings.isUseEndAt && (
                  <DateInput label="End Date" value={settings.endAt} onChange={(value) => updateSetting('endAt', value)} />
                )}
              </div>

              {settings.autoScroll && (
                <div className="mt-4">
                  <SliderControl
                    label="Scroll Speed"
                    value={settings.scrollSpeed}
                    onChange={(value) => updateSetting('scrollSpeed', value)}
                    min={1}
                    max={10}
                    step={1}
                    unit="s"
                    accentClassName="text-blue-400"
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'typography' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-400" />
                  Appearance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <ColorInput label="Accent Color" value={settings.accentColor} onChange={updateAccentColor} />
                  <ColorInput label="Background" value={settings.backgroundColor} onChange={(value) => updateSetting('backgroundColor', value)} />
                  <ColorInput label="Text Color" value={settings.textColor} onChange={updateTextColor} />
                </div>

                <SliderControl
                  label="Base Font Size"
                  value={settings.fontSize}
                  onChange={updateFontSize}
                  min={10}
                  max={32}
                  step={1}
                  unit="px"
                  accentClassName="text-blue-400"
                />
              </motion.div>

              <TextStyleSection
                title="Last Donator Text"
                prefix="lastDonator"
                settings={settings}
                updateSetting={updateSetting}
              />

              <TextStyleSection
                title="Amount Text"
                prefix="amount"
                settings={settings}
                updateSetting={updateSetting}
              />
            </>
          )}

          {activeTab === 'sample' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-blue-400" />
                Sample Donations
              </h3>

              <div className="space-y-4">
                {donations.map((donation, index) => (
                  <div key={index} className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-slate-300">Donor Name</Label>
                        <Input
                          value={donation.name}
                          onChange={(e) => updateDonation(index, 'name', e.target.value)}
                          className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-300">Amount</Label>
                        <Input
                          value={donation.amount}
                          onChange={(e) => updateDonation(index, 'amount', e.target.value)}
                          className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300">Time Label</Label>
                      <Input
                        value={donation.time}
                        onChange={(e) => updateDonation(index, 'time', e.target.value)}
                        className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300">Message</Label>
                      <Textarea
                        value={donation.message}
                        onChange={(e) => updateDonation(index, 'message', e.target.value)}
                        rows={2}
                        className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TextStyleSection({ title, prefix, settings, updateSetting }) {
  const key = (suffix) => `${prefix}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Type className="w-5 h-5 text-blue-400" />
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorInput label="Color" value={settings[key('Color')]} onChange={(value) => updateSetting(key('Color'), value)} />
        <SelectControl
          label="Font Family"
          value={settings[key('FontFamily')]}
          options={FONT_FAMILIES.map((font) => ({ id: font, label: font }))}
          onChange={(value) => updateSetting(key('FontFamily'), value)}
        />
        <SelectControl
          label="Font Weight"
          value={settings[key('FontWeight')]}
          options={FONT_WEIGHTS.map((weight) => ({ id: weight, label: weight }))}
          onChange={(value) => updateSetting(key('FontWeight'), value)}
        />
        <SliderControl
          label="Font Size"
          value={settings[key('FontSize')]}
          onChange={(value) => updateSetting(key('FontSize'), value)}
          min={12}
          max={96}
          step={1}
          unit="px"
          accentClassName="text-blue-400"
        />
        <SliderControl
          label="Stroke Width"
          value={settings[key('StrokeWidth')]}
          onChange={(value) => updateSetting(key('StrokeWidth'), value)}
          min={0}
          max={8}
          step={0.5}
          unit="px"
          accentClassName="text-blue-400"
        />
        <div className="md:col-span-2">
          <ColorInput label="Stroke Color" value={settings[key('StrokeColor')]} onChange={(value) => updateSetting(key('StrokeColor'), value)} />
        </div>
      </div>
    </motion.div>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <Input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800/80 border-slate-700 text-white"
      />
    </div>
  );
}

function SelectControl({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 text-sm text-white outline-none"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-slate-800/80 border-slate-700 text-white font-mono"
        />
      </div>
    </div>
  );
}

function SliderControl({ label, value, onChange, min, max, step, unit, accentClassName }) {
  const display = Array.isArray(value) ? value[0] : value;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-slate-300">{label}</Label>
        <span className={`${accentClassName} font-medium`}>{display}{unit}</span>
      </div>
      <Slider
        value={Array.isArray(value) ? value : [value]}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
