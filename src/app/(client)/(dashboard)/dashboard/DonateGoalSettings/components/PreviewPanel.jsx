import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

import GoalPreview from './GoalPreview';
import SectionWrapper from './SectionWrapper';
import { toMetadata } from '../utils/donate-goal';
import { useDonateGoalSettings } from './context/DonateGoalSettingsProvider';

const PreviewPanel = React.memo(({ settings: settingsProp, update: updateProp, onSave }) => {
  const {
    settings: contextSettings,
    update: contextUpdate,
    saveSettings,
    saving,
  } = useDonateGoalSettings();
  const settings = settingsProp ?? contextSettings;
  const update = updateProp ?? contextUpdate;
  const [showBackground, setShowBackground] = useState(true);

  useEffect(() => {
    console.log('PreviewPanel received new settings:', settings);
  }, [settings]);

  const handleSliderChange = useCallback(([value]) => {
    update('currentAmount', value);
  }, [update]);

  const handleSave = useCallback(() => {
    const metadataPayload = toMetadata(settings);
    if (onSave) {
      onSave(metadataPayload);
      return;
    }
    saveSettings(metadataPayload);
  }, [onSave, saveSettings, settings]);

  const previewKey = useMemo(() => {
    return [
      settings.type,
      settings.goalAmount,
      settings.currentAmount,
      settings.progressColor,
      settings.goalColor,
      settings.progressShine,
      settings.progressShineEffect,
      settings.progressSkin,
    ].join('-');
  }, [
    settings.type,
    settings.goalAmount,
    settings.currentAmount,
    settings.progressColor,
    settings.goalColor,
    settings.progressShine,
    settings.progressShineEffect,
    settings.progressSkin,
  ]);

  return (
    <SectionWrapper delay={0.3}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <div className="flex items-center gap-3">
          <Label htmlFor="bg-toggle" className="cursor-pointer text-sm text-slate-400">
            พื้นหลัง
          </Label>
          <Switch
            id="bg-toggle"
            checked={showBackground}
            onCheckedChange={setShowBackground}
          />
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-slate-900 p-5">
        <GoalPreview
          key={previewKey}
          settings={settings}
          currentAmount={settings.currentAmount}
          showBackground={showBackground}
        />
      </div>

      <div className="mb-4">
        <div className="mb-1 flex justify-between">
          <Label className="text-sm text-slate-400">ทดสอบยอดบริจาคปัจจุบัน</Label>
          <span className="text-sm text-emerald-400">฿{settings.currentAmount}</span>
        </div>
        <Slider
          value={[settings.currentAmount]}
          onValueChange={handleSliderChange}
          min={0}
          max={settings.goalAmount}
          step={1}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'บันทึก'}
        </Button>
      </div>
    </SectionWrapper>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;
