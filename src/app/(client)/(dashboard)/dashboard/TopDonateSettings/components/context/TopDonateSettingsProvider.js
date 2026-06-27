import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  fetchTopDonateSettings,
  saveTopDonateSettings,
} from "@/actions/TopDonateapi/topDonateSettingsApi";
import { useAuth } from "@/contexts/AuthContext";
import { useWidgetPreviews } from "../../../../components/context/WidgetPreviewsProvider";
import { createWidgetSettingsNotifier } from "@/lib/notifications/widget-settings-toast";

import { getDefaultSettings } from "../../constants/topDonateOptions";
import {
  DEFAULT_DONOR_DATA,
  fromMetadata,
  toMetadata,
} from "../../utils/top-donate";

const TopDonateSettingsContext = createContext(null);
const topDonateNotifier = createWidgetSettingsNotifier("Top Donate settings");

const logTopDonateProvider = (label, payload) => {
  console.log(`[TopDonate Provider] ${label}`, payload);
};

export function TopDonateSettingsProvider({ children }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id;
  const { invalidateWidgetPreviews } = useWidgetPreviews();
  const [settings, setSettings] = useState(getDefaultSettings());
  const [donorData, setDonorData] = useState(DEFAULT_DONOR_DATA);
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
      if (isAuthLoading) return;

      if (!userId) {
        setWidgetId(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const widget = await fetchTopDonateSettings(userId);
        logTopDonateProvider("loaded widget from api", widget);

        const resolvedWidgetId = widget?.id || null;
        setWidgetId(resolvedWidgetId);

        if (!widget?.metadata) {
          setSettings(getDefaultSettings());
          setDonorData(DEFAULT_DONOR_DATA);
          setHasChanges(false);
          topDonateNotifier.defaultLoaded();
          return;
        }

        const mapped = fromMetadata(widget.metadata, getDefaultSettings(), DEFAULT_DONOR_DATA);
        logTopDonateProvider("mapped settings from metadata", mapped);

        setSettings(mapped.settings);
        setDonorData(mapped.donorData);
        setHasChanges(false);
        topDonateNotifier.loadSuccess();
      } catch (error) {
        console.error(error);
        topDonateNotifier.loadError(error);
        setWidgetId(null);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isAuthLoading, userId]);

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

  const updateDonorData = useCallback((patchOrUpdater) => {
    setDonorData((previous) => {
      const patch = typeof patchOrUpdater === "function"
        ? patchOrUpdater(previous)
        : patchOrUpdater;

      if (!patch || typeof patch !== "object") return previous;
      return { ...previous, ...patch };
    });
    setHasChanges(true);
    setSaveSuccess(false);
  }, []);

  const updateDonor = useCallback((key, valueOrUpdater) => {
    updateDonorData((previous) => ({
      [key]: typeof valueOrUpdater === "function"
        ? valueOrUpdater(previous[key], previous)
        : valueOrUpdater,
    }));
  }, [updateDonorData]);

  const resetSettings = useCallback(() => {
    if (!window.confirm("Reset top donate settings to default?")) return;
    setSettings(getDefaultSettings());
    setDonorData(DEFAULT_DONOR_DATA);
    setHasChanges(true);
    setSaveSuccess(false);
    topDonateNotifier.resetSuccess();
  }, []);

  const saveSettings = useCallback(async (metadataPayload) => {
    const resolvedWidgetId = widgetId;

    if (!userId || !resolvedWidgetId) {
      topDonateNotifier.error("Cannot save because the Top Donate widget does not exist yet");
      return;
    }

    const loadingToastId = topDonateNotifier.saveLoading();
    const resolvedMetadataPayload = metadataPayload ?? toMetadata(settings, donorData);
    const payload = {
      userId,
      metadata: resolvedMetadataPayload?.metadata ?? {},
    };

    logTopDonateProvider("current settings before save", settings);
    logTopDonateProvider("metadata generated for save", resolvedMetadataPayload);
    logTopDonateProvider("request payload for save", payload);

    setSaving(true);
    try {
      const result = await saveTopDonateSettings(resolvedWidgetId, payload);
      logTopDonateProvider("save result", result);

      if (!result) {
        topDonateNotifier.saveError(null, loadingToastId);
        return;
      }

      setWidgetId(resolvedWidgetId);
      invalidateWidgetPreviews(userId);
      setHasChanges(false);
      setSaveSuccess(true);
      topDonateNotifier.saveSuccess(loadingToastId);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      topDonateNotifier.saveError(error, loadingToastId);
    } finally {
      setSaving(false);
    }
  }, [donorData, invalidateWidgetPreviews, settings, userId, widgetId]);

  const metadata = useMemo(() => toMetadata(settings, donorData), [donorData, settings]);

  const value = useMemo(() => ({
    settings,
    donorData,
    metadata,
    widgetId,
    loading,
    saving,
    hasChanges,
    saveSuccess,
    showHeader,
    setSettings,
    setDonorData,
    updateSetting,
    update: updateSetting,
    updateSettings,
    updateDonor,
    updateDonorData,
    resetSettings,
    saveSettings,
  }), [
    settings,
    donorData,
    metadata,
    widgetId,
    loading,
    saving,
    hasChanges,
    saveSuccess,
    showHeader,
    updateSetting,
    updateSettings,
    updateDonor,
    updateDonorData,
    resetSettings,
    saveSettings,
  ]);

  return (
    <TopDonateSettingsContext.Provider value={value}>
      {children}
    </TopDonateSettingsContext.Provider>
  );
}

export function useTopDonateSettings() {
  const context = useContext(TopDonateSettingsContext);

  if (!context) {
    throw new Error("useTopDonateSettings must be used within TopDonateSettingsProvider");
  }

  return context;
}
