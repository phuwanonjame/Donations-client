// components/PreviewPanel.jsx
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch'; // ✅ เพิ่ม Switch component
import { Copy } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import GoalPreview from './GoalPreview';
import { toMetadata } from '../utils/donate-goal';

const PreviewPanel = React.memo(({ settings, update, onSave }) => {
  // ✅ State สำหรับควบคุมการแสดงพื้นหลัง
  const [showBackground, setShowBackground] = useState(true);

  useEffect(() => {
    console.log('PreviewPanel received new settings:', settings);
  }, [settings]);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard?.writeText('https://easydonate.app/w/goal/abc123');
  }, []);

  const handleSliderChange = useCallback(([v]) => {
    update('currentAmount', v);
  }, [update]);

  const handleSave = useCallback(() => {
    if (onSave) {
      const metadata = toMetadata(settings);
      onSave(metadata);
    }
  }, [onSave, settings]);

  const previewKey = useMemo(() => {
    return `${settings.type}-${settings.goalAmount}-${settings.currentAmount}-${settings.progressColor}-${settings.goalColor}`;
  }, [settings.type, settings.goalAmount, settings.currentAmount, settings.progressColor, settings.goalColor]);

  return (
    <SectionWrapper delay={0.3} className="sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Preview</h3>

        {/* ✅ ปุ่ม Toggle สำหรับเปิด/ปิดพื้นหลัง */}
        <div className="flex items-center gap-3">
          <Label htmlFor="bg-toggle" className="text-slate-400 text-sm cursor-pointer">
            พื้นหลัง
          </Label>
          <Switch
            id="bg-toggle"
            checked={showBackground}
            onCheckedChange={setShowBackground}
          />
        </div>
      </div>

      {/* Preview widget */}
      <div className="bg-slate-900 rounded-xl p-5 mb-4">
        <GoalPreview
          key={previewKey}
          settings={settings}
          currentAmount={settings.currentAmount}
          showBackground={showBackground}   // ✅ ส่ง prop ไปยัง GoalPreview
        />
      </div>

      {/* Slider for testing current amount */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <Label className="text-slate-400 text-sm">ทดสอบจำนวนปัจจุบัน</Label>
          <span className="text-emerald-400 text-sm">฿{settings.currentAmount}</span>
        </div>
        <Slider
          value={[settings.currentAmount]}
          onValueChange={handleSliderChange}
          min={0}
          max={settings.goalAmount}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">Widget URL</Label>
        <div className="flex gap-2">
          <Input
            value="https://easydonate.app/w/goal/abc123"
            readOnly
            className="bg-slate-800/80 border-slate-700 text-emerald-400 font-mono text-sm"
          />
          <Button
            size="icon"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            onClick={handleCopyUrl}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
          onClick={handleSave}
        >
          บันทึก
        </Button>
      </div>
    </SectionWrapper>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;