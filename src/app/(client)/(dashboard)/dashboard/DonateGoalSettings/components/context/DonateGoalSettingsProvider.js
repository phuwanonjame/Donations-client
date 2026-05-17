import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  fetchDonateGoalSettings,
  saveDonateGoalSettings,
} from "@/actions/DonateGoalapi/donateGoalSettingsApi";
import { createWidgetSettingsNotifier } from "@/lib/notifications/widget-settings-toast";

import { defaultSettings } from "../../constants/donate-goal";
import { fromMetadata, toMetadata } from "../../utils/donate-goal";

const DonateGoalSettingsContext = createContext(null);
const FIXED_USER_ID = "244bad71-4990-4a79-9a19-9ff983a55442";
const goalNotifier = createWidgetSettingsNotifier("Goal settings");

const logGoalProvider = (label, payload) => {
  console.log(`[DonateGoal Provider] ${label}`, payload);
};

export function DonateGoalSettingsProvider({ children }) {
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);

      try {
        const widget = await fetchDonateGoalSettings(FIXED_USER_ID);
        logGoalProvider("loaded widget from api", widget);

        if (!widget?.id) {
          goalNotifier.error("Goal widget not found for this user");
          return;
        }

        setWidgetId(widget.id);

        if (!widget?.metadata) {
          setSettings(defaultSettings);
          setHasChanges(false);
          goalNotifier.defaultLoaded();
          return;
        }

        const mappedSettings = fromMetadata(widget.metadata, defaultSettings);
        logGoalProvider("mapped settings from metadata", mappedSettings);

        setSettings(mappedSettings);
        setHasChanges(false);
        goalNotifier.loadSuccess();
      } catch (error) {
        console.error(error);
        goalNotifier.loadError(error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback((patchOrUpdater) => {
    setSettings((previous) => {
      const patch = typeof patchOrUpdater === "function"
        ? patchOrUpdater(previous)
        : patchOrUpdater;

      if (!patch || typeof patch !== "object") return previous;
      return { ...previous, ...patch };
    });
    setHasChanges(true);
    setSaveSuccess(false);
  }, []);

  const updateSetting = useCallback((key, valueOrUpdater) => {
    updateSettings((previous) => ({
      [key]: typeof valueOrUpdater === "function"
        ? valueOrUpdater(previous[key], previous)
        : valueOrUpdater,
    }));
  }, [updateSettings]);

  const resetSettings = useCallback(() => {
    if (!window.confirm("Reset goal settings to default?")) return;
    setSettings(defaultSettings);
    setHasChanges(true);
    setSaveSuccess(false);
    goalNotifier.resetSuccess();
  }, []);

  const saveSettings = useCallback(async (metadataPayload) => {
    if (!widgetId) {
      goalNotifier.error("Cannot save because the Goal widget does not exist yet");
      return;
    }

    const loadingToastId = goalNotifier.saveLoading();
    const resolvedMetadataPayload = metadataPayload ?? toMetadata(settings);
    const payload = {
      userId: FIXED_USER_ID,
      metadata: resolvedMetadataPayload?.metadata ?? {},
    };

    logGoalProvider("current settings before save", settings);
    logGoalProvider("metadata generated for save", resolvedMetadataPayload);
    logGoalProvider("request payload for save", payload);

    setSaving(true);
    try {
      const result = await saveDonateGoalSettings(widgetId, payload);
      logGoalProvider("save result", result);

      if (!result) {
        goalNotifier.saveError(null, loadingToastId);
        return;
      }

      setHasChanges(false);
      setSaveSuccess(true);
      goalNotifier.saveSuccess(loadingToastId);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      goalNotifier.saveError(error, loadingToastId);
    } finally {
      setSaving(false);
    }
  }, [settings, widgetId]);

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
    setSettings,
    updateSetting,
    update: updateSetting,
    updateSettings,
    addGoalData: updateSettings,
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
    <DonateGoalSettingsContext.Provider value={value}>
      {children}
    </DonateGoalSettingsContext.Provider>
  );
}

export function useDonateGoalSettings() {
  const context = useContext(DonateGoalSettingsContext);

  if (!context) {
    throw new Error("useDonateGoalSettings must be used within DonateGoalSettingsProvider");
  }

  return context;
}
