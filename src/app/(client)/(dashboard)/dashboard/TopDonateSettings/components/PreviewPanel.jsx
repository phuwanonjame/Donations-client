import React, { useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDashboardCopy } from '../../i18n';

import TopDonatePreview from './TopDonatePreview';
import SectionWrapper from './SectionWrapper';
import { toMetadata } from '../utils/top-donate';
import { useTopDonateSettings } from './context/TopDonateSettingsProvider';

const PreviewPanel = React.memo(({ settings: settingsProp, donorData: donorDataProp, onSave }) => {
  const {
    settings: contextSettings,
    donorData: contextDonorData,
    saveSettings,
    resetSettings,
    saving,
  } = useTopDonateSettings();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const settings = settingsProp ?? contextSettings;
  const donorData = donorDataProp ?? contextDonorData;

  const handleSave = useCallback(() => {
    const metadataPayload = toMetadata(settings, donorData);
    if (onSave) {
      onSave(metadataPayload);
      return;
    }
    saveSettings(metadataPayload);
  }, [donorData, onSave, saveSettings, settings]);

  return (
    <SectionWrapper delay={0.3}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{copy.common.preview}</h3>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={resetSettings}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {copy.common.reset}
        </Button>
      </div>

      <div className="mb-4 rounded-xl bg-slate-900 p-5">
        <TopDonatePreview settings={settings} donorData={donorData} />
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? copy.common.saving : copy.common.saveSettings}
        </Button>
      </div>
    </SectionWrapper>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;
