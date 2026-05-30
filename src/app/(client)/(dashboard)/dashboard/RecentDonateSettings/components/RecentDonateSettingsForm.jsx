"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid2X2, Megaphone, Palette, Settings, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RECENT_DONATE_THEME_PRESETS } from '../constants/recentDonateOptions';

const TABS = [
  { id: 'content', label: 'Content', icon: Settings },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'animation', label: 'Animation', icon: Megaphone },
  { id: 'layout', label: 'Layout', icon: Grid2X2 },
  { id: 'advanced', label: 'Advanced', icon: SlidersHorizontal },
];

const CARD_STYLES = ['glass', 'neon', 'gradient', 'minimal', 'flat'];
const LAYOUT_STYLES = ['list', 'compact', 'spotlight', 'split'];
const ANIMATION_TYPES = ['fade', 'slide-left', 'slide-right', 'slide-up', 'pop'];
const FONT_FAMILIES = ['IBM Plex Sans Thai', 'Kanit', 'Prompt', 'Sarabun', 'Noto Sans Thai', 'Inter', 'Poppins', 'Montserrat'];
const FONT_WEIGHTS = ['400', '500', '600', '700', '800', '900'];
const POSITION_OPTIONS = [
  ['top-left', 'top-center', 'top-right'],
  ['middle-left', 'center', 'middle-right'],
  ['bottom-left', 'bottom-center', 'bottom-right'],
];

function TabNav({ activeTab, onSelect }) {
  return (
    <div className="flex overflow-x-auto border-b border-slate-700/70">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`relative flex min-w-max items-center gap-2 px-4 py-3 text-sm transition-colors ${
              isActive ? 'text-violet-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-violet-500" />}
          </button>
        );
      })}
    </div>
  );
}

export default function RecentDonateSettingsForm({ settings, updateSetting, donations, updateDonation }) {
  const [activeTab, setActiveTab] = useState('content');
  const firstDonation = donations[0] || {};

  const updateTextColor = (value) => {
    updateSetting('textColor', value);
    updateSetting('lastDonatorColor', value);
  };

  const updateAccentColor = (value) => {
    updateSetting('accentColor', value);
    updateSetting('amountColor', value);
  };

  const applyThemePreset = (preset) => {
    updateSetting('themePreset', preset.id);
    if (!preset.settings) return;

    Object.entries(preset.settings).forEach(([key, value]) => {
      const sliderKeys = new Set(['shadowBlur', 'backgroundBlurAmount']);
      updateSetting(key, sliderKeys.has(key) ? [value] : value);
    });
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/50 backdrop-blur-xl">
      <TabNav activeTab={activeTab} onSelect={setActiveTab} />
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
          >
            {activeTab === 'content' && (
              <>
                <PanelTitle number="1" title="Content" subtitle="ปรับแต่งข้อมูลที่แสดงใน Widget" />
                <TextInput label="Title" value={settings.title} onChange={(value) => updateSetting('title', value)} />
                <ToggleList
                  items={[
                    ['showName', 'แสดงชื่อผู้บริจาค (Donor Name)'],
                    ['showAmount', 'แสดงจำนวนเงิน (Amount)'],
                    ['showTime', 'แสดงระยะเวลา (Time Ago)'],
                    ['showMessage', 'แสดงข้อความ (Message)'],
                    ['autoScroll', 'เลื่อนรายการอัตโนมัติ'],
                  ]}
                  settings={settings}
                  updateSetting={updateSetting}
                />
                <TextInput label="ข้อความเมื่อไม่มีข้อความ" value={settings.messagePlaceholder} onChange={(value) => updateSetting('messagePlaceholder', value)} />
                <SliderControl label="จำนวนรายการที่แสดง" value={settings.maxEntries} onChange={(value) => updateSetting('maxEntries', value)} min={1} max={10} step={1} unit=" รายการ" />
                <SampleMini donation={firstDonation} settings={settings} />
              </>
            )}

            {activeTab === 'theme' && (
              <>
                <PanelTitle number="2" title="Theme" subtitle="ปรับสไตล์สีและพื้นหลัง Widget" />
                <div>
                  <Label className="mb-3 block text-slate-300">ธีมสำเร็จรูป (Presets)</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {RECENT_DONATE_THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyThemePreset(preset)}
                        className={`rounded-xl border p-2 text-left transition ${
                          settings.themePreset === preset.id ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                        }`}
                      >
                        <div
                          className="mb-2 h-12 rounded-lg"
                          style={{
                            background: preset.imageUrl
                              ? `linear-gradient(180deg, rgba(2,6,23,.08), rgba(2,6,23,.38)), url("${preset.imageUrl}")`
                              : preset.preview || `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <span className="text-xs text-slate-200">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <ColorInput label="สีหลัก (Primary)" value={settings.accentColor} onChange={updateAccentColor} />
                  <ColorInput label="สีรอง (Secondary)" value={settings.amountColor} onChange={(value) => updateSetting('amountColor', value)} />
                  <ColorInput label="พื้นหลัง (Background)" value={settings.backgroundColor} onChange={(value) => updateSetting('backgroundColor', value)} />
                  <ColorInput label="สีตัวอักษร (Text)" value={settings.textColor} onChange={updateTextColor} />
                </div>
                <SegmentedControl label="สไตล์การ์ด (Card Style)" value={settings.cardStyle} options={CARD_STYLES} onChange={(value) => updateSetting('cardStyle', value)} />
                <SliderControl label="มุมโค้ง (Border Radius)" value={settings.borderRadius} onChange={(value) => updateSetting('borderRadius', value)} min={0} max={32} step={1} unit="px" />
              </>
            )}

            {activeTab === 'animation' && (
              <>
                <PanelTitle number="3" title="Animation" subtitle="ปรับแอนิเมชันและการเลื่อนหน้าจอ" />
                <SegmentedControl label="แอนิเมชันเข้า" value={settings.animationType} options={ANIMATION_TYPES} onChange={(value) => updateSetting('animationType', value)} />
                <SliderControl label="ความเร็วแอนิเมชัน" value={settings.animationSpeed} onChange={(value) => updateSetting('animationSpeed', value)} min={10} max={100} step={5} unit="%" />
                <SliderControl label="ระยะเวลาแอนิเมชัน" value={settings.animationDuration} onChange={(value) => updateSetting('animationDuration', value)} min={100} max={1500} step={50} unit=" ms" />
                <SwitchRow label="การเลื่อนรายการ (Auto Scroll)" checked={settings.autoScroll} onChange={(value) => updateSetting('autoScroll', value)} />
                {settings.autoScroll && (
                  <SliderControl label="ความเร็วการเลื่อน" value={settings.scrollSpeed} onChange={(value) => updateSetting('scrollSpeed', value)} min={1} max={10} step={1} unit="s" />
                )}
              </>
            )}

            {activeTab === 'layout' && (
              <>
                <PanelTitle number="4" title="Layout" subtitle="เลือกโครงร่างและการจัดวาง" />
                <SegmentedControl label="รูปแบบการ์ดรายการ" value={settings.layoutStyle} options={LAYOUT_STYLES} onChange={(value) => updateSetting('layoutStyle', value)} />
                <div>
                  <Label className="mb-3 block text-slate-300">การจัดตำแหน่งใน Widget</Label>
                  <div className="grid w-fit grid-cols-3 gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 p-2">
                    {POSITION_OPTIONS.flat().map((position) => (
                      <button
                        key={position}
                        type="button"
                        onClick={() => updateSetting('position', position)}
                        className={`h-9 w-9 rounded-lg border transition ${
                          settings.position === position ? 'border-violet-500 bg-violet-500/30' : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SliderControl label="ความกว้าง Widget" value={settings.widgetWidth} onChange={(value) => updateSetting('widgetWidth', value)} min={220} max={1200} step={10} unit="px" />
                  <SliderControl label="ความสูง Widget" value={settings.widgetHeight} onChange={(value) => updateSetting('widgetHeight', value)} min={240} max={800} step={10} unit="px" />
                  <SliderControl label="ระยะห่างภายใน (Padding)" value={settings.padding} onChange={(value) => updateSetting('padding', value)} min={0} max={48} step={1} unit="px" />
                  <SliderControl label="ระยะห่างรายการ (Item Spacing)" value={settings.itemSpacing} onChange={(value) => updateSetting('itemSpacing', value)} min={0} max={32} step={1} unit="px" />
                </div>
              </>
            )}

            {activeTab === 'advanced' && (
              <>
                <PanelTitle number="5" title="Advanced" subtitle="ตั้งค่าชั้นสูงเพิ่มเติม" />
                <SwitchRow label="แสดงเส้นขอบ (Border)" checked={settings.borderEnabled} onChange={(value) => updateSetting('borderEnabled', value)} />
                {settings.borderEnabled && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ColorInput label="Border Color" value={settings.borderColor} onChange={(value) => updateSetting('borderColor', value)} />
                    <SliderControl label="Border Width" value={settings.borderWidth} onChange={(value) => updateSetting('borderWidth', value)} min={0} max={8} step={1} unit="px" />
                  </div>
                )}
                <SwitchRow label="เงา (Shadow)" checked={settings.shadowEnabled} onChange={(value) => updateSetting('shadowEnabled', value)} />
                {settings.shadowEnabled && (
                  <SliderControl label="ระดับเงา" value={settings.shadowBlur} onChange={(value) => updateSetting('shadowBlur', value)} min={0} max={48} step={1} unit="px" />
                )}
                <SwitchRow label="เบลอพื้นหลัง (Background Blur)" checked={settings.backgroundBlur} onChange={(value) => updateSetting('backgroundBlur', value)} />
                {settings.backgroundBlur && (
                  <SliderControl label="ความเบลอ" value={settings.backgroundBlurAmount} onChange={(value) => updateSetting('backgroundBlurAmount', value)} min={0} max={30} step={1} unit="px" />
                )}
                <SwitchRow label="เสียงแจ้งเตือน (Alert Sound)" checked={settings.alertSoundEnabled} onChange={(value) => updateSetting('alertSoundEnabled', value)} />
                <SelectControl
                  label="Alert Sound"
                  value={settings.alertSound}
                  options={['chime-1', 'bell', 'pop', 'none'].map((id) => ({ id, label: id }))}
                  onChange={(value) => updateSetting('alertSound', value)}
                />
                <div className="space-y-2">
                  <Label className="text-slate-300">Custom CSS</Label>
                  <Textarea
                    value={settings.customCss}
                    onChange={(e) => updateSetting('customCss', e.target.value)}
                    rows={5}
                    className="bg-slate-950/80 border-slate-700 font-mono text-xs text-slate-200"
                  />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
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
      <Label className="mb-2 block text-slate-300">ตัวอย่าง</Label>
      <div className="flex items-center justify-between rounded-lg border border-violet-500/20 bg-violet-500/10 p-3">
        <div>
          <p className="font-semibold text-white">{donation?.name || 'Viewer123'}</p>
          <p className="text-xs text-slate-300">{donation?.message || settings.messagePlaceholder}</p>
        </div>
        <p className="font-bold" style={{ color: settings.accentColor }}>{donation?.amount || '฿100'}</p>
      </div>
    </div>
  );
}

function SegmentedControl({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500" />
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
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="flex gap-2">
        <Input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-slate-800/80 border-slate-700 text-white font-mono" />
      </div>
    </div>
  );
}

function SliderControl({ label, value, onChange, min, max, step, unit }) {
  const display = Array.isArray(value) ? value[0] : value;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="text-slate-300">{label}</Label>
        <span className="font-medium text-violet-300">{display}{unit}</span>
      </div>
      <Slider value={Array.isArray(value) ? value : [value]} onValueChange={onChange} min={min} max={max} step={step} />
    </div>
  );
}
