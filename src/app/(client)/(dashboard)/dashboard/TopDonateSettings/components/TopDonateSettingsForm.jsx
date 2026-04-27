// TopDonateSettingsForm.tsx
"use client";
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Palette, Sparkles,
  Crown, Star, Heart, Zap, Trophy, Flame, Diamond,
  Upload, X, Link, ImageIcon, User,
} from 'lucide-react';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Slider }   from '@/components/ui/slider';
import { Switch }   from '@/components/ui/switch';
import { Button }   from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { timeRanges } from '../constants/topDonateOptions';

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

export default function TopDonateSettingsForm({ settings, updateSetting, donorData, updateDonor }) {
  const fileInputRef = useRef(null);
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

  return (
    <div className="space-y-6">

      {/* ── Configuration ── */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label className="text-slate-300">Time Range</Label>
            <Select value={settings.timeRange} onValueChange={(v) => updateSetting('timeRange', v)}>
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {timeRanges.map(r => (
                  <SelectItem key={r.id} value={r.id} className="text-white hover:bg-slate-700">{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </motion.div>

      {/* ── Icon ── */}
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
                <p className="text-xs text-purple-400 font-medium mb-0.5">✓ Custom icon active</p>
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
                <span className="text-xs opacity-60">PNG · SVG · WebP · GIF · JPEG — max 5 MB</span>
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

      {/* ── Appearance ── */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ColorInput label="Accent Color" value={settings.accentColor}     onChange={(v) => updateSetting('accentColor', v)} />
          <ColorInput label="Background"   value={settings.backgroundColor} onChange={(v) => updateSetting('backgroundColor', v)} />
          <ColorInput label="Text Color"   value={settings.textColor}       onChange={(v) => updateSetting('textColor', v)} />
        </div>
        <SliderControl label="Font Size" value={settings.fontSize} onChange={(v) => updateSetting('fontSize', v)} min={12} max={32} step={1} unit="px" />
      </motion.div>

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
      <div className="flex items-center justify-between mb-2">
        <Label className="text-slate-300">{label}</Label>
        <span className="text-purple-400 font-medium">{display}{unit}</span>
      </div>
      <Slider value={Array.isArray(value) ? value : [value]} onValueChange={onChange} min={min} max={max} step={step} />
    </div>
  );
}