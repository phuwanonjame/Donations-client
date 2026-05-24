import React, { useCallback } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const settings = settingsProp ?? contextSettings;

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard?.writeText('https://easydonate.app/w/leaderboard/abc123');
  }, []);

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
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={resetSettings}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mb-4 min-h-[55vh] rounded-xl bg-slate-900 p-5">
        <LeaderboardPreview settings={settings} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-slate-400">Widget URL</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            value="https://easydonate.app/w/leaderboard/abc123"
            readOnly
            inputMode="url"
            className="border-slate-700 bg-slate-800/80 font-mono text-sm text-amber-400"
          />
          <Button
            size="icon"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            onClick={handleCopyUrl}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </SectionWrapper>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;
