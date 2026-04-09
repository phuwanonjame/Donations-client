import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Target, RotateCcw, Sparkles, Type, Palette, Eye, EyeOff } from 'lucide-react';
import ColorInput from './ColorInput';
import DropdownSelect from './DropdownSelect';
import StringDropdownSelect from './StringDropdownSelect';
import TemplateVariablesHint from './TemplateVariablesHint';
import SectionWrapper from './SectionWrapper';
import ThaiDateTimeInput from './ThaiDateTimeInput';
import { widgetTypes, fontFamilies, fontWeights, fontSizes, strokeWidths, templateVariables } from '../constants/donate-goal';
import { getResetDates } from '../utils/donate-goal';

export default function GoalSettingsForm({ settings, update }) {
  const handleResetDates = useCallback(() => {
    const { startAt, endAt } = getResetDates();
    update('startAt', startAt);
    update('endAt', endAt);
    update('isUseStartAt', true);
    update('isUseEndAt', true);
  }, [update]);

  const getFontSizeIndex = (value) => {
    const index = fontSizes.indexOf(value);
    return index >= 0 ? index : 0;
  };

  const handleGoalAmountChange = useCallback((e) => {
    const val = parseInt(e.target.value, 10);
    update('goalAmount', isNaN(val) ? 0 : val);
  }, [update]);

  return (
    <div className="space-y-5 sm:space-y-6 px-4 sm:px-0">
      {/* Widget Type */}
      <SectionWrapper delay={0.05}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          รูปแบบ
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {widgetTypes.map(wt => (
            <button
              key={wt.id}
              onClick={() => update('type', wt.id)}
              className={`rounded-xl sm:rounded-2xl border p-2.5 sm:p-3 transition duration-300 hover:scale-[1.02] text-white text-sm sm:text-base font-medium ${
                settings.type === wt.id
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-700 bg-black/20 hover:border-slate-500'
              }`}
            >
              {wt.name}
            </button>
          ))}
        </div>
      </SectionWrapper>

      {/* Goal Config */}
      <SectionWrapper delay={0.1}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          เป้าหมาย
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">ชื่อ</Label>
              <Input 
                value={settings.goalName} 
                onChange={e => update('goalName', e.target.value)} 
                className="bg-slate-800/80 border-slate-700 text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">จำนวน (฿)</Label>
              <Input 
                type="number" 
                value={settings.goalAmount} 
                onChange={handleGoalAmountChange} 
                className="bg-slate-800/80 border-slate-700 text-white" 
              />
            </div>
          </div>

          {/* Switch แสดง/ซ่อนจำนวนเป้าหมาย */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              {settings.showGoalAmount ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <p className="text-white font-medium text-sm sm:text-base">แสดงจำนวนเป้าหมาย</p>
                <p className="text-xs text-slate-400">แสดง (xxxx บาท) ต่อท้ายชื่อเป้าหมาย</p>
              </div>
            </div>
            <Switch 
              checked={settings.showGoalAmount} 
              onCheckedChange={v => update('showGoalAmount', v)} 
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500" 
            />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">กำหนดวันที่เริ่มต้นเอง</p>
                  <p className="text-xs text-slate-400">ถ้าไม่กำหนด จะนับตั้งแต่วันที่สมัครสมาชิก</p>
                </div>
                <Switch 
                  checked={settings.isUseStartAt} 
                  onCheckedChange={v => update('isUseStartAt', v)} 
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500" 
                />
              </div>
              {settings.isUseStartAt && (
                <ThaiDateTimeInput 
                  label="วันที่เริ่มต้น (พ.ศ.)"
                  value={settings.startAt}
                  onChange={v => update('startAt', v)}
                />
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">กำหนดวันที่สิ้นสุดเอง</p>
                  <p className="text-xs text-slate-400">ถ้าไม่กำหนด จะนับไปไม่มีที่สิ้นสุด</p>
                </div>
                <Switch 
                  checked={settings.isUseEndAt} 
                  onCheckedChange={v => update('isUseEndAt', v)} 
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500" 
                />
              </div>
              {settings.isUseEndAt && (
                <ThaiDateTimeInput 
                  label="วันที่สิ้นสุด (พ.ศ.)"
                  value={settings.endAt}
                  onChange={v => update('endAt', v)}
                />
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 text-sm sm:text-base"
            onClick={handleResetDates}
          >
            <RotateCcw className="w-4 h-4" />
            รีเซ็ตเป้าหมาย (ระยะเวลา 30 วัน)
          </Button>
        </div>
      </SectionWrapper>

      {/* Progress (Bar) Section */}
      <SectionWrapper delay={0.15}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          หลอดเป้าหมาย
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">ข้อความในหลอด</Label>
            <Input 
              value={settings.progressText} 
              onChange={e => update('progressText', e.target.value)} 
              className="bg-slate-800/80 border-slate-700 text-white font-mono" 
            />
            <TemplateVariablesHint variables={templateVariables.progress} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput 
              label="สีหลอด" 
              value={settings.progressColor} 
              onChange={v => update('progressColor', v)} 
            />
            <DropdownSelect 
              label="ฟอนต์" 
              value={settings.progressFontFamily} 
              options={fontFamilies} 
              onChange={v => update('progressFontFamily', v)} 
            />
          </div>

          {/* Large widget texts */}
          {settings.type === 'large' && (
            <div className="space-y-3 pt-2 border-t border-slate-700/50">
              <p className="text-sm text-slate-400">ข้อความสำหรับ Large Widget</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">ขนาดฟอนต์บน</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[getFontSizeIndex(settings.largeTopFontSize)]}
                      min={0}
                      max={fontSizes.length - 1}
                      step={1}
                      onValueChange={([val]) => update('largeTopFontSize', fontSizes[val])}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-12 text-right">{settings.largeTopFontSize}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">ขนาดฟอนต์ล่าง</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[getFontSizeIndex(settings.largeBottomFontSize)]}
                      min={0}
                      max={fontSizes.length - 1}
                      step={1}
                      onValueChange={([val]) => update('largeBottomFontSize', fontSizes[val])}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-12 text-right">{settings.largeBottomFontSize}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">ข้อความบนขวา</Label>
                <Input 
                  value={settings.largeTopRightText} 
                  onChange={e => update('largeTopRightText', e.target.value)} 
                  className="bg-slate-800/80 border-slate-700 text-white font-mono" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">ข้อความล่างซ้าย</Label>
                  <Input 
                    value={settings.largeBottomLeftText} 
                    onChange={e => update('largeBottomLeftText', e.target.value)} 
                    className="bg-slate-800/80 border-slate-700 text-white font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">ข้อความล่างขวา</Label>
                  <Input 
                    value={settings.largeBottomRightText} 
                    onChange={e => update('largeBottomRightText', e.target.value)} 
                    className="bg-slate-800/80 border-slate-700 text-white font-mono" 
                  />
                </div>
              </div>
              <TemplateVariablesHint variables={templateVariables.large} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 gap-3 sm:gap-0">
            <div>
              <p className="text-white font-medium text-sm sm:text-base">เปิด Shine Effect</p>
              <p className="text-xs text-slate-400">แสงที่วิ่งไปเรื่อย ๆ บริเวณหลอดเป้าหมาย</p>
            </div>
            <Switch 
              checked={settings.progressShine} 
              onCheckedChange={v => update('progressShine', v)} 
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500" 
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Description Section */}
      <SectionWrapper delay={0.2}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Type className="w-5 h-5 text-emerald-400" />
          รายละเอียด
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">ข้อความด้านซ้าย</Label>
              <Input 
                value={settings.descriptionLeftText} 
                onChange={e => update('descriptionLeftText', e.target.value)} 
                className="bg-slate-800/80 border-slate-700 text-white font-mono" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">ข้อความด้านขวา</Label>
              <Input 
                value={settings.descriptionRightText} 
                onChange={e => update('descriptionRightText', e.target.value)} 
                className="bg-slate-800/80 border-slate-700 text-white font-mono" 
              />
            </div>
          </div>
          <TemplateVariablesHint variables={templateVariables.description} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownSelect 
              label="ฟอนต์" 
              value={settings.descriptionFontFamily} 
              options={fontFamilies} 
              onChange={v => update('descriptionFontFamily', v)} 
            />
            <DropdownSelect 
              label="น้ำหนักฟอนต์" 
              value={settings.descriptionFontWeight} 
              options={fontWeights} 
              onChange={v => update('descriptionFontWeight', v)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">ขนาดฟอนต์</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[getFontSizeIndex(settings.descriptionFontSize)]}
                  min={0}
                  max={fontSizes.length - 1}
                  step={1}
                  onValueChange={([val]) => update('descriptionFontSize', fontSizes[val])}
                  className="flex-1"
                />
                <span className="text-white text-sm w-12 text-right">{settings.descriptionFontSize}</span>
              </div>
            </div>
            <ColorInput 
              label="สีฟอนต์" 
              value={settings.descriptionColor} 
              onChange={v => update('descriptionColor', v)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringDropdownSelect 
              label="ขนาดขอบ" 
              value={settings.descriptionStrokeWidth} 
              options={strokeWidths} 
              onChange={v => update('descriptionStrokeWidth', v)} 
            />
            <ColorInput 
              label="สีขอบ" 
              value={settings.descriptionStrokeColor} 
              onChange={v => update('descriptionStrokeColor', v)} 
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Goal Text Appearance */}
      <SectionWrapper delay={0.25}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-400" />
          ปรับแต่งข้อความเป้าหมาย
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownSelect 
              label="ฟอนต์" 
              value={settings.goalFontFamily} 
              options={fontFamilies} 
              onChange={v => update('goalFontFamily', v)} 
            />
            <DropdownSelect 
              label="น้ำหนักฟอนต์" 
              value={settings.goalFontWeight} 
              options={fontWeights} 
              onChange={v => update('goalFontWeight', v)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">ขนาดฟอนต์</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[getFontSizeIndex(settings.goalFontSize)]}
                  min={0}
                  max={fontSizes.length - 1}
                  step={1}
                  onValueChange={([val]) => update('goalFontSize', fontSizes[val])}
                  className="flex-1"
                />
                <span className="text-white text-sm w-12 text-right">{settings.goalFontSize}</span>
              </div>
            </div>
            <ColorInput 
              label="สีฟอนต์" 
              value={settings.goalColor} 
              onChange={v => update('goalColor', v)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringDropdownSelect 
              label="ขนาดขอบ" 
              value={settings.goalStrokeWidth} 
              options={strokeWidths} 
              onChange={v => update('goalStrokeWidth', v)} 
            />
            <ColorInput 
              label="สีขอบ" 
              value={settings.goalStrokeColor} 
              onChange={v => update('goalStrokeColor', v)} 
            />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}