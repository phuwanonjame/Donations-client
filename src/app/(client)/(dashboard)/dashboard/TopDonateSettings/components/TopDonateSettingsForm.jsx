// TopDonateSettingsForm.tsx
"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Settings, Palette, Sparkles,
  Crown, Star, Heart, Zap, Trophy, Flame, Diamond,
  Upload, X, Link, ImageIcon, ChevronDown, SlidersHorizontal,
  LayoutTemplate, Check,
} from 'lucide-react';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Slider }   from '@/components/ui/slider';
import { Switch }   from '@/components/ui/switch';
import { Button }   from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DropdownSelect from './DropdownSelect';
import ThaiDateTimeInput from './ThaiDateTimeInput';
import {
  celebrationEffects,
  fontFamilies,
  fontWeights,
  layoutAlignments,
  templateVariants,
  textAlignments,
} from '../constants/topDonateOptions';
import { useTopDonateSettings } from './context/TopDonateSettingsProvider';
import TopDonatePreview from './TopDonatePreview';

export const ICON_OPTIONS = [
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'crown',    label: 'Crown',    icon: Crown },
  { id: 'star',     label: 'Star',     icon: Star },
  { id: 'heart',    label: 'Heart',    icon: Heart },
  { id: 'zap',      label: 'Zap',      icon: Zap },
  { id: 'trophy',   label: 'Trophy',   icon: Trophy },
  { id: 'flame',    label: 'Flame',    icon: Flame },
  { id: 'diamond',  label: 'Diamond',  icon: Diamond },
];

const SHAPE_OPTIONS = [
  { id: 'none',     label: 'None',     borderRadius: '4px', transform: '' },
  { id: 'circle',   label: 'Circle',   borderRadius: '50%', transform: '' },
  { id: 'rounded',  label: 'Rounded',  borderRadius: null,  transform: '' },
  { id: 'squircle', label: 'Squircle', borderRadius: null,  transform: '' },
  { id: 'square',   label: 'Square',   borderRadius: '2px', transform: '' },
  { id: 'diamond',  label: 'Diamond',  borderRadius: '4px', transform: 'rotate(45deg)' },
];

const BG_MODES = [
  { id: 'gradient', label: 'Gradient' },
  { id: 'solid',    label: 'Solid' },
  { id: 'outline',  label: 'Outline' },
  { id: 'none',     label: 'None' },
];

const GLOW_LEVELS = [
  { id: 'low',    label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high',   label: 'High' },
];

const ANIMATE_STYLES = [
  { id: 'pulse',  label: 'Pulse' },
  { id: 'bounce', label: 'Bounce' },
  { id: 'spin',   label: 'Spin' },
];

const UPLOAD_TABS = [
  { id: 'file',   label: 'Upload File', icon: Upload },
  { id: 'url',    label: 'URL / Link',  icon: Link },
  { id: 'preset', label: 'Preset',      icon: Sparkles },
];

// Placeholder tags ที่ใช้ได้ใน Title
const PLACEHOLDERS = [
  { tag: '{{ชื่อ}}',        desc: 'ชื่อผู้บริจาค' },
  { tag: '{{จำนวนเงิน}}',  desc: 'จำนวนเงิน' },
  { tag: '{{ข้อความ}}',    desc: 'ข้อความ' },
];

const TOP_DONATE_TABS = [
  { id: 'template', label: 'Template', icon: LayoutTemplate, color: 'from-emerald-500 to-teal-500' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-purple-500 to-pink-500' },
  { id: 'icon', label: 'Icon', icon: Sparkles, color: 'from-fuchsia-500 to-violet-500' },
  { id: 'appearance', label: 'Appearance', icon: Palette, color: 'from-cyan-500 to-blue-500' },
  { id: 'advanced', label: 'Advanced', icon: SlidersHorizontal, color: 'from-violet-500 to-indigo-500' },
];

const THUMBNAIL_HEIGHT = 150;

// การ์ดทุกใบต้องสูงเท่ากันเสมอ แต่แต่ละเทมเพลตมีสัดส่วนเนื้อหาต่างกันมาก
// (Compact Strip เตี้ยและกว้าง, Trophy Podium สูง) จึง render เนื้อหาจริงเต็มขนาด
// แล้ววัด natural size จริงด้วย ResizeObserver จากนั้นคำนวณ scale ให้พอดีกรอบเสมอ
// วิธีนี้ไม่มีการตัดเนื้อหาทิ้ง (ต่างจาก overflow:hidden + fixed scale แบบเดิม)
function TemplateThumbnail({ settings, donorData, templateVariant }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(0.001);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return undefined;

    const measure = () => {
      const outerRect = outer.getBoundingClientRect();
      const naturalW = inner.scrollWidth;
      const naturalH = inner.scrollHeight;
      if (!naturalW || !naturalH || !outerRect.width || !outerRect.height) return;
      const nextScale = Math.min(outerRect.width / naturalW, outerRect.height / naturalH, 1);
      setScale(nextScale > 0 ? nextScale : 0.001);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [settings, templateVariant, donorData]);

  return (
    <div
      ref={outerRef}
      className="relative overflow-hidden rounded-lg bg-slate-950/40 flex items-center justify-center"
      style={{ height: THUMBNAIL_HEIGHT }}
    >
      <div ref={innerRef} style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <TopDonatePreview settings={{ ...settings, templateVariant }} donorData={donorData} />
      </div>
    </div>
  );
}

function TopDonateTabNav({ activeTab, onSelect, tabs }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 blur" />
      <div className="relative overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/40 p-1 backdrop-blur-sm">
        <div
          className="grid min-w-max grid-flow-col auto-cols-[96px] gap-1 sm:auto-cols-[118px] lg:min-w-0"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => {
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
                    layoutId="topDonateActiveTab"
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

export default function TopDonateSettingsForm({
  settings: settingsProp,
  updateSetting: updateSettingProp,
  donorData: donorDataProp,
  updateDonor: updateDonorProp,
} = {}) {
  const topDonateContext = useTopDonateSettings();
  const settings = settingsProp ?? topDonateContext.settings;
  const updateSetting = updateSettingProp ?? topDonateContext.updateSetting;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const donorData = donorDataProp ?? topDonateContext.donorData;
  const updateDonor = updateDonorProp ?? topDonateContext.updateDonor;
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [uploadTab, setUploadTab] = useState('file');
  const [urlInput,  setUrlInput]  = useState('');
  const [urlError,  setUrlError]  = useState('');

  function handleIconUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateSetting('iconCustomUrl', ev.target.result);
      updateSetting('iconType', 'custom');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleApplyUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) { setUrlError('Please enter a URL'); return; }
    try { new URL(trimmed); } catch { setUrlError('Invalid URL format'); return; }
    setUrlError('');
    updateSetting('iconCustomUrl', trimmed);
    updateSetting('iconType', 'custom');
  }

  function clearCustomIcon() {
    updateSetting('iconCustomUrl', null);
    updateSetting('iconType', 'sparkles');
    setUrlInput('');
    setUrlError('');
  }

  function shapeRadius(id, radiusPx) {
    if (id === 'circle')   return '50%';
    if (id === 'rounded')  return `${radiusPx}px`;
    if (id === 'squircle') return `${Math.round(radiusPx * 1.6)}px`;
    if (id === 'square')   return '2px';
    if (id === 'diamond')  return '4px';
    return '4px';
  }

  // คลิก tag แล้วแทรกที่ cursor ใน title input
  function insertPlaceholder(tag) {
    const input = document.getElementById('title-input');
    if (!input) { updateSetting('title', (settings.title ?? '') + tag); return; }
    const start = input.selectionStart ?? settings.title?.length ?? 0;
    const end   = input.selectionEnd   ?? start;
    const current = settings.title ?? '';
    const next = current.slice(0, start) + tag + current.slice(end);
    updateSetting('title', next);
    setTimeout(() => {
      input.focus();
      const pos = start + tag.length;
      input.setSelectionRange(pos, pos);
    }, 0);
  }

  const radiusPx = Array.isArray(settings.iconRadius) ? settings.iconRadius[0] : settings.iconRadius;
  const showRadiusSlider = ['rounded', 'squircle', 'square'].includes(settings.iconShape);
  const tabContentVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.22 } },
    exit: { opacity: 0, x: 16, transition: { duration: 0.18 } },
  };
  const visibleTabs = showAdvanced ? TOP_DONATE_TABS : TOP_DONATE_TABS.slice(0, 4);

  useEffect(() => {
    if (!showAdvanced && activeTab === 'advanced') {
      setActiveTab('settings');
    }
  }, [activeTab, showAdvanced]);

  return (
    <div className="space-y-5 px-4 sm:space-y-6 sm:px-0">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-3">
        <div className="flex min-w-0 items-start gap-2">
          <div className="rounded-lg bg-violet-500/10 p-2 text-violet-300">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Advanced controls</p>
            <p className="text-xs text-slate-400">Show extra layout, date, and typography settings only when needed.</p>
          </div>
        </div>
        <Switch
          checked={showAdvanced}
          onCheckedChange={setShowAdvanced}
          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-blue-500"
        />
      </div>
      <TopDonateTabNav activeTab={activeTab} onSelect={setActiveTab} tabs={visibleTabs} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-w-0 space-y-5 sm:space-y-6"
        >

{/* â”€â”€ Template â”€â”€ */}
      {activeTab === 'template' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-emerald-400" />
          Template
        </h3>
        <p className="text-xs text-slate-400 mb-4">เลือกรูปแบบดีไซน์ของ widget สีและฟอนต์ที่ตั้งค่าไว้จะใช้ร่วมกับทุกเทมเพลต</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templateVariants.map(({ id, name }) => {
            const isActive = (settings.templateVariant ?? 'classic') === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => updateSetting('templateVariant', id)}
                className={`relative min-w-0 rounded-xl border p-3 text-left transition-all duration-150 ${
                  isActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 z-10 rounded-full bg-purple-500 p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="pointer-events-none mb-2 min-w-0">
                  <TemplateThumbnail settings={settings} donorData={donorData} templateVariant={id} />
                </div>
                <p className="text-sm font-medium text-white">{name}</p>
              </button>
            );
          })}
        </div>
      </motion.div>
      )}

{/* â”€â”€ Configuration â”€â”€ */}
      {activeTab === 'settings' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Configuration
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {/* Title + placeholder buttons */}
          <div className="space-y-2">
            <Label className="text-slate-300">Title</Label>
            <Input
              id="title-input"
              value={settings.title ?? ''}
              onChange={(e) => updateSetting('title', e.target.value)}
              placeholder="ขอบคุณนะงับ {{ชื่อ}}"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PLACEHOLDERS.map(({ tag, desc }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertPlaceholder(tag)}
                  title={desc}
                  className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-mono hover:bg-purple-500/30 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">คลิก tag เพื่อแทรกลงใน title</p>
          </div>

        </div>

        {/* Donor data inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-700/60">
          <div className="space-y-1.5">
            <Label className="text-slate-300">Donor Name (ตัวอย่าง)</Label>
            <Input
              value={donorData?.name ?? ''}
              onChange={(e) => updateDonor('name', e.target.value)}
              placeholder="SuperFan123"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">Amount (ตัวอย่าง)</Label>
            <Input
              value={donorData?.amount ?? ''}
              onChange={(e) => updateDonor('amount', e.target.value)}
              placeholder="฿5,000"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">Message (ตัวอย่าง)</Label>
            <Textarea
              value={donorData?.message ?? ''}
              onChange={(e) => updateDonor('message', e.target.value)}
              placeholder="Love your content! Keep it up!"
              rows={1}
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 resize-none"
            />
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {[
            { key: 'showName',    label: 'Show Donor Name' },
            { key: 'showAmount',  label: 'Show Amount' },
            { key: 'showMessage', label: 'Show Message' },
            { key: 'showIcon',    label: 'Show Icon' },
          ].map(opt => (
            <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-white">{opt.label}</span>
              <Switch
                checked={settings[opt.key]}
                onCheckedChange={(v) => updateSetting(opt.key, v)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 mt-6 pt-4 border-t border-slate-700/60">
          <div>
            <Label className="text-slate-300">Celebration Effect</Label>
            <p className="text-xs text-slate-500 mt-0.5">เอฟเฟกต์ที่เล่นตอนมีคนบริจาคแซงขึ้นอันดับ 1 คนใหม่</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {celebrationEffects.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                onClick={() => updateSetting('celebrationEffect', id)}
                className={`py-2 rounded-xl border text-xs transition-all ${
                  (settings.celebrationEffect ?? 'burst') === id
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      )}

      {/* â”€â”€ Icon â”€â”€ */}
      {activeTab === 'icon' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
      >
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Icon
        </h3>

        <div className="space-y-3">
          <Label className="text-slate-300">Source</Label>
          <div className="flex rounded-xl overflow-hidden border border-slate-700 w-fit">
            {UPLOAD_TABS.map(({ id, label, icon: TabIcon }) => (
              <button
                key={id}
                onClick={() => setUploadTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors duration-150 ${
                  uploadTab === id ? 'bg-purple-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {settings.iconCustomUrl && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-purple-500/40">
              <div className="w-12 h-12 rounded-lg bg-slate-700/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={settings.iconCustomUrl} alt="preview" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-400 font-medium mb-0.5">Custom icon active</p>
                <p className="text-xs text-slate-400 truncate">
                  {settings.iconCustomUrl.startsWith('data:') ? 'Uploaded file' : settings.iconCustomUrl}
                </p>
              </div>
              <Button size="sm" variant="outline" className="border-red-900/60 text-red-400 hover:bg-red-900/20 flex-shrink-0" onClick={clearCustomIcon}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {uploadTab === 'file' && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-slate-600 hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-150 text-slate-400 hover:text-purple-300"
              >
                <ImageIcon className="w-7 h-7" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs opacity-60">PNG / SVG / WebP / GIF / JPEG - max 5 MB</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/png,image/svg+xml,image/webp,image/gif,image/jpeg" className="hidden" onChange={handleIconUpload} />
            </>
          )}

          {uploadTab === 'url' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setUrlError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
                  placeholder="https://example.com/icon.gif"
                  className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm"
                />
                <Button onClick={handleApplyUrl} className="bg-purple-600 hover:bg-purple-500 text-white flex-shrink-0">Apply</Button>
              </div>
              {urlError && <p className="text-xs text-red-400">{urlError}</p>}
              <p className="text-xs text-slate-500">รองรับ Animated GIF, CDN URL, Discord emoji URL ฯลฯ</p>
            </div>
          )}

          {uploadTab === 'preset' && (
            <div className="grid grid-cols-4 gap-2">
              {ICON_OPTIONS.map(({ id, label, icon: IconComp }) => (
                <button
                  key={id}
                  onClick={() => { updateSetting('iconType', id); updateSetting('iconCustomUrl', null); }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-150 ${
                    settings.iconType === id && !settings.iconCustomUrl
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  <span className="text-[10px] leading-tight">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-700/60 pt-5 space-y-5">

          {/* Container shape */}
          <div className="space-y-3">
            <div>
              <Label className="text-slate-300">Container shape</Label>
              <p className="text-xs text-slate-500 mt-0.5">รูปทรงกรอบที่ครอบไอคอน</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SHAPE_OPTIONS.map(({ id, label, transform }) => {
                const isActive = settings.iconShape === id;
                const br = shapeRadius(id, radiusPx);
                return (
                  <button
                    key={id}
                    onClick={() => updateSetting('iconShape', id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 ${
                      isActive ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <div style={{
                      width: '28px', height: '28px',
                      borderRadius: id === 'none' ? '4px' : br,
                      transform,
                      background: id === 'none' ? 'transparent' : 'linear-gradient(135deg,#7F77DD,#D4537E)',
                      border: id === 'none' ? '2px dashed #64748b' : 'none',
                      flexShrink: 0,
                    }} />
                    <span className="text-[10px]">{label}</span>
                  </button>
                );
              })}
            </div>
            {showRadiusSlider && (
              <SliderControl label="Corner radius" value={settings.iconRadius} onChange={(v) => updateSetting('iconRadius', v)} min={0} max={48} step={2} unit="px" />
            )}
          </div>

          {/* Sizing */}
          <div className="space-y-4">
            <SliderControl label="Container size" value={settings.iconSize} onChange={(v) => updateSetting('iconSize', v)} min={32} max={160} step={4} unit="px" />
            <div>
              <SliderControl label="Image size (inside container)" value={settings.iconImageSize} onChange={(v) => updateSetting('iconImageSize', v)} min={40} max={100} step={5} unit="%" />
              <p className="text-xs text-slate-500 mt-1">ปรับให้รูปใหญ่เต็ม หรือเล็กลงเพื่อให้มี padding รอบข้าง</p>
            </div>
          </div>

          {/* Background fill */}
          <div className="space-y-3">
            <div>
              <Label className="text-slate-300">Background fill</Label>
              <p className="text-xs text-slate-500 mt-0.5">สีพื้นหลังของ container</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {BG_MODES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => updateSetting('iconBgMode', id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-[11px] transition-all duration-150 ${
                    settings.iconBgMode === id ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '4px',
                    background: id === 'gradient' ? 'linear-gradient(135deg,#7F77DD,#D4537E)' : id === 'solid' ? '#7F77DD' : 'transparent',
                    border: id === 'outline' ? '1.5px solid #7F77DD' : id === 'none' ? '1px dashed #475569' : 'none',
                  }} />
                  {label}
                </button>
              ))}
            </div>
            {settings.iconBgMode === 'gradient' && (
              <div className="grid grid-cols-2 gap-3">
                <ColorInput label="Gradient start" value={settings.iconBgColor}  onChange={(v) => updateSetting('iconBgColor', v)} />
                <ColorInput label="Gradient end"   value={settings.iconBgColor2} onChange={(v) => updateSetting('iconBgColor2', v)} />
              </div>
            )}
            {settings.iconBgMode === 'solid' && (
              <ColorInput label="Fill color" value={settings.iconBgColor} onChange={(v) => updateSetting('iconBgColor', v)} />
            )}
            {settings.iconBgMode === 'outline' && (
              <ColorInput label="Outline color" value={settings.iconBgColor} onChange={(v) => updateSetting('iconBgColor', v)} />
            )}
          </div>

          {/* Border */}
          <div className="space-y-3">
            <Label className="text-slate-300">Border</Label>
            <div className="grid grid-cols-2 gap-4">
              <SliderControl label="Width" value={settings.iconBorderWidth} onChange={(v) => updateSetting('iconBorderWidth', v)} min={0} max={8} step={1} unit="px" />
              <ColorInput label="Color" value={settings.iconBorderColor} onChange={(v) => updateSetting('iconBorderColor', v)} />
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-3">
            <Label className="text-slate-300">Effects</Label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-white">Glow / shadow</span>
              <Switch checked={settings.iconGlow} onCheckedChange={(v) => updateSetting('iconGlow', v)} className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500" />
            </div>
            {settings.iconGlow && (
              <div className="grid grid-cols-3 gap-2">
                {GLOW_LEVELS.map(({ id, label }) => (
                  <button key={id} onClick={() => updateSetting('iconGlowIntensity', id)}
                    className={`py-2 rounded-xl border text-sm transition-all ${settings.iconGlowIntensity === id ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-white">Animate icon</span>
              <Switch checked={settings.iconAnimate} onCheckedChange={(v) => updateSetting('iconAnimate', v)} className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500" />
            </div>
            {settings.iconAnimate && (
              <div className="grid grid-cols-3 gap-2">
                {ANIMATE_STYLES.map(({ id, label }) => (
                  <button key={id} onClick={() => updateSetting('iconAnimateStyle', id)}
                    className={`py-2 rounded-xl border text-sm transition-all ${settings.iconAnimateStyle === id ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </motion.div>
      )}

      {/* â”€â”€ Appearance â”€â”€ */}
      {/* Appearance */}
      {activeTab === 'appearance' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          Appearance
        </h3>
        <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <ColorInput label="Accent Color" value={settings.accentColor} onChange={(v) => updateSetting('accentColor', v)} />
          <ColorInput label="Background" value={settings.backgroundColor} onChange={(v) => updateSetting('backgroundColor', v)} />
          <ColorInput label="Text Color" value={settings.textColor} onChange={(v) => updateSetting('textColor', v)} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SliderControl
            label="Title Font Size"
            value={settings.titleFontSize}
            onChange={(v) => updateSetting('titleFontSize', v)}
            min={10}
            max={48}
            step={1}
            unit="px"
          />
          <SliderControl
            label="Message Font Size"
            value={settings.messageFontSize}
            onChange={(v) => updateSetting('messageFontSize', v)}
            min={10}
            max={48}
            step={1}
            unit="px"
          />
        </div>
      </motion.div>
      )}

      {/* Advanced */}
      {activeTab === 'advanced' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-violet-300" />
          Advanced controls
        </h3>
        <p className="mb-5 text-xs text-slate-400">Adjust layout, schedule, and detailed typography only when needed.</p>

        <div className="space-y-5 rounded-xl border border-slate-700/60 bg-slate-900/30 p-4">
          <DropdownSelect
            label="Widget Alignment"
            value={settings.alignment}
            options={layoutAlignments}
            onChange={(v) => updateSetting('alignment', v)}
          />

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
                <div>
                  <p className="text-sm font-medium text-white">Use Start Date</p>
                  <p className="text-xs text-slate-400">Send startAt from selected date when enabled</p>
                </div>
                <Switch
                  checked={settings.isUseStartAt}
                  onCheckedChange={(v) => updateSetting('isUseStartAt', v)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                />
              </div>
              {settings.isUseStartAt && (
                <ThaiDateTimeInput
                  label="Start Date"
                  value={settings.startAt}
                  onChange={(v) => updateSetting('startAt', v)}
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
                <div>
                  <p className="text-sm font-medium text-white">Use End Date</p>
                  <p className="text-xs text-slate-400">Send endAt from selected date when enabled</p>
                </div>
                <Switch
                  checked={settings.isUseEndAt}
                  onCheckedChange={(v) => updateSetting('isUseEndAt', v)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                />
              </div>
              {settings.isUseEndAt && (
                <ThaiDateTimeInput
                  label="End Date"
                  value={settings.endAt}
                  onChange={(v) => updateSetting('endAt', v)}
                />
              )}
            </div>
          </div>
        </div>

        <TextStyleControls
          title="Top Donator Text"
          prefix="topDonator"
          settings={settings}
          updateSetting={updateSetting}
        />

        <TextStyleControls
          title="Amount Text"
          prefix="amount"
          settings={settings}
          updateSetting={updateSetting}
        />
      </motion.div>
      )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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

function TextStyleControls({ title, prefix, settings, updateSetting }) {
  const key = (suffix) => `${prefix}${suffix}`;

  return (
    <div className="mt-6 border-t border-slate-700/60 pt-5">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ColorInput
          label="Color"
          value={settings[key('Color')]}
          onChange={(v) => updateSetting(key('Color'), v)}
        />
        <DropdownSelect
          label="Alignment"
          value={settings[key('Alignment')]}
          options={textAlignments}
          onChange={(v) => updateSetting(key('Alignment'), v)}
        />
        <DropdownSelect
          label="Font Family"
          value={settings[key('FontFamily')]}
          options={fontFamilies}
          onChange={(v) => updateSetting(key('FontFamily'), v)}
        />
        <DropdownSelect
          label="Font Weight"
          value={settings[key('FontWeight')]}
          options={fontWeights}
          onChange={(v) => updateSetting(key('FontWeight'), v)}
        />
        <SliderControl
          label="Font Size"
          value={settings[key('FontSize')]}
          onChange={(v) => updateSetting(key('FontSize'), v)}
          min={12}
          max={96}
          step={1}
          unit="px"
        />
        <SliderControl
          label="Stroke Width"
          value={settings[key('StrokeWidth')]}
          onChange={(v) => updateSetting(key('StrokeWidth'), v)}
          min={0}
          max={8}
          step={0.5}
          unit="px"
        />
        <div className="md:col-span-2">
          <ColorInput
            label="Stroke Color"
            value={settings[key('StrokeColor')]}
            onChange={(v) => updateSetting(key('StrokeColor'), v)}
          />
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, value, onChange, min, max, step, unit }) {
  const display = Array.isArray(value) ? value[0] : value;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-slate-300">{label}</Label>
        <span className="text-purple-400 font-medium">{display}{unit}</span>
      </div>
      <Slider value={Array.isArray(value) ? value : [value]} onValueChange={onChange} min={min} max={max} step={step} />
    </div>
  );
}




