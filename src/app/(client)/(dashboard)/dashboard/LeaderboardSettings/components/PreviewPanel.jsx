import React, { useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDashboardCopy } from '../../i18n';

import LeaderboardPreview from './LeaderboardPreview';
import SectionWrapper from './SectionWrapper';
import { toApiMetadata } from '../utils/donate-leaderboard';
import { useLeaderboardSettings } from './context/LeaderboardSettingsProvider';

const PreviewPanel = React.memo(({ settings: settingsProp, onSave }) => {
  const {
    settings: contextSettings,
    saveSettings,
    resetSettings,
    saving,
  } = useLeaderboardSettings();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const settings = settingsProp ?? contextSettings;

  const handleSave = useCallback(() => {
    const metadataPayload = toApiMetadata(settings);
    if (onSave) {
      onSave(metadataPayload);
      return;
    }
    saveSettings(metadataPayload);
  }, [onSave, saveSettings, settings]);

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

      <div className="mb-4 min-h-[55vh] rounded-xl bg-slate-900 p-5">
        <LeaderboardPreview settings={settings} />
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
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
