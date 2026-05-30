import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  fetchLeaderboardSettings,
  saveLeaderboardSettings,
} from '@/actions/Leaderboardapi/leaderboardSettingsApi';
import { useAuth } from '@/contexts/AuthContext';
import { createWidgetSettingsNotifier } from '@/lib/notifications/widget-settings-toast';

import {
  defaultSettings,
  podiumBadgeShapes,
  podiumLayoutStyles,
} from '../../constants/donate-leaderboard';
import { fromMetadata, toApiMetadata, toMetadata } from '../../utils/donate-leaderboard';

const LeaderboardSettingsContext = createContext(null);

const leaderboardNotifier = createWidgetSettingsNotifier('Leaderboard settings');

const logLeaderboardProvider = (label, payload) => {
  console.log(`[Leaderboard Provider] ${label}`, payload);
};

export function LeaderboardSettingsProvider({ children }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id;
  const [settings, setSettings] = useState(defaultSettings);
  const [widgetId, setWidgetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY < 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      if (isAuthLoading) return;

      if (!userId) {
        setWidgetId(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const widget = await fetchLeaderboardSettings(userId);
        logLeaderboardProvider('loaded widget from api', widget);

        if (!widget?.id) {
          leaderboardNotifier.error('Leaderboard widget not found for this user');
          return;
        }

        setWidgetId(widget.id);

        if (!widget?.metadata) {
          setSettings(defaultSettings);
          setHasChanges(false);
          leaderboardNotifier.defaultLoaded();
          return;
        }

        const mappedSettings = fromMetadata(widget.metadata, defaultSettings);
        logLeaderboardProvider('mapped settings from metadata', mappedSettings);

        setSettings(mappedSettings);
        setHasChanges(false);
        leaderboardNotifier.loadSuccess();
      } catch (error) {
        console.error(error);
        leaderboardNotifier.loadError(error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isAuthLoading, userId]);

  const updateSettings = useCallback((patchOrUpdater) => {
    setSettings((previous) => {
      const patch = typeof patchOrUpdater === 'function'
        ? patchOrUpdater(previous)
        : patchOrUpdater;

      if (!patch || typeof patch !== 'object') return previous;
      return { ...previous, ...patch };
    });
    setHasChanges(true);
    setSaveSuccess(false);
  }, []);

  const updateSetting = useCallback((key, valueOrUpdater) => {
    updateSettings((previous) => ({
      [key]: typeof valueOrUpdater === 'function'
        ? valueOrUpdater(previous[key], previous)
        : valueOrUpdater,
    }));
  }, [updateSettings]);

  const resetSettings = useCallback(() => {
    if (!window.confirm('Reset leaderboard settings to default?')) return;
    setSettings(defaultSettings);
    setHasChanges(true);
    setSaveSuccess(false);
    leaderboardNotifier.resetSuccess();
  }, []);

  const saveSettings = useCallback(async (metadataPayload) => {
    if (!userId || !widgetId) {
      leaderboardNotifier.error('Cannot save because the Leaderboard widget does not exist yet');
      return;
    }

    const loadingToastId = leaderboardNotifier.saveLoading();
    const resolvedMetadataPayload = metadataPayload ?? toApiMetadata(settings);
    const payload = {
      userId,
      metadata: resolvedMetadataPayload?.metadata ?? {},
    };

    logLeaderboardProvider('current settings before save', settings);
    logLeaderboardProvider('metadata generated for save', resolvedMetadataPayload);
    logLeaderboardProvider('request payload for save', payload);

    setSaving(true);
    try {
      const result = await saveLeaderboardSettings(widgetId, payload);
      logLeaderboardProvider('save result', result);

      if (!result) {
        leaderboardNotifier.saveError(null, loadingToastId);
        return;
      }

      setHasChanges(false);
      setSaveSuccess(true);
      leaderboardNotifier.saveSuccess(loadingToastId);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      leaderboardNotifier.saveError(error, loadingToastId);
    } finally {
      setSaving(false);
    }
  }, [settings, userId, widgetId]);

  const metadata = useMemo(() => toMetadata(settings), [settings]);

  const value = useMemo(() => ({
    settings,
    metadata,
    widgetId,
    loading,
    saving,
    hasChanges,
    saveSuccess,
    showHeader,
    podiumBadgeShapes,
    podiumLayoutStyles,
    setSettings,
    updateSetting,
    update: updateSetting,
    updateSettings,
    addLeaderboardData: updateSettings,
    resetSettings,
    saveSettings,
  }), [
    settings,
    metadata,
    widgetId,
    loading,
    saving,
    hasChanges,
    saveSuccess,
    showHeader,
    updateSetting,
    updateSettings,
    resetSettings,
    saveSettings,
  ]);

  return (
    <LeaderboardSettingsContext.Provider value={value}>
      {children}
    </LeaderboardSettingsContext.Provider>
  );
}

export function useLeaderboardSettings() {
  const context = useContext(LeaderboardSettingsContext);

  if (!context) {
    throw new Error('useLeaderboardSettings must be used within LeaderboardSettingsProvider');
  }

  return context;
}

export function useOptionalLeaderboardSettings() {
  return useContext(LeaderboardSettingsContext);
}
