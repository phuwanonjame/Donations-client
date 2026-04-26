"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, Palette, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function RecentDonateSettingsForm({ settings, updateSetting, donations, updateDonation }) {
  return (
    <div className="space-y-6">
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
          <SliderControl
            label="Max Entries"
            value={settings.maxEntries}
            onChange={(value) => updateSetting('maxEntries', value)}
            min={3}
            max={10}
            step={1}
            unit=""
            accentClassName="text-blue-400"
          />
        </div>

        <div className="space-y-3">
          {[
            { key: 'showName', label: 'Show Donor Name' },
            { key: 'showAmount', label: 'Show Amount' },
            { key: 'showTime', label: 'Show Time Ago' },
            { key: 'showMessage', label: 'Show Message' },
            { key: 'autoScroll', label: 'Auto Scroll' },
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-400" />
          Appearance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ColorInput label="Accent Color" value={settings.accentColor} onChange={(value) => updateSetting('accentColor', value)} />
          <ColorInput label="Background" value={settings.backgroundColor} onChange={(value) => updateSetting('backgroundColor', value)} />
          <ColorInput label="Text Color" value={settings.textColor} onChange={(value) => updateSetting('textColor', value)} />
        </div>

        <SliderControl
          label="Font Size"
          value={settings.fontSize}
          onChange={(value) => updateSetting('fontSize', value)}
          min={10}
          max={24}
          step={1}
          unit="px"
          accentClassName="text-blue-400"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
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
