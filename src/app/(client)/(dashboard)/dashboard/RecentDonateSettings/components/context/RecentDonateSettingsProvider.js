import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  fetchRecentDonateSettings,
  saveRecentDonateSettings,
} from "@/actions/RecentDonateapi/recentDonateSettingsApi";
import { useAuth } from "@/contexts/AuthContext";
import { useWidgetPreviews } from "../../../../components/context/WidgetPreviewsProvider";
import { createWidgetSettingsNotifier } from "@/lib/notifications/widget-settings-toast";

import { getDefaultRecentDonations, getDefaultSettings } from "../../constants/recentDonateOptions";
import { fromMetadata, toMetadata } from "../../utils/recent-donate";

const RecentDonateSettingsContext = createContext(null);
const recentDonateNotifier = createWidgetSettingsNotifier("Recent Donate settings");
const MISSING_WIDGET_MESSAGE = "Recent Donate widget was not found for this user";

const logRecentDonateProvider = (label, payload) => {
  console.log(`[RecentDonate Provider] ${label}`, payload);
};

export function RecentDonateSettingsProvider({ children }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id;
  const { invalidateWidgetPreviews } = useWidgetPreviews();
  const [settings, setSettings] = useState(getDefaultSettings());
  const [donations, setDonations] = useState(getDefaultRecentDonations());
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
        const widget = await fetchRecentDonateSettings(userId);
        logRecentDonateProvider("loaded widget from api", widget);

        const resolvedWidgetId = widget?.id || null;
        setWidgetId(resolvedWidgetId);

        if (!widget?.metadata) {
          setSettings(getDefaultSettings());
          setDonations(getDefaultRecentDonations());
          setHasChanges(false);
          recentDonateNotifier.defaultLoaded();
          return;
        }

        const mapped = fromMetadata(widget.metadata, getDefaultSettings(), getDefaultRecentDonations());
        logRecentDonateProvider("mapped settings from metadata", mapped);

        setSettings(mapped.settings);
        setDonations(mapped.donations);
        setHasChanges(false);
        recentDonateNotifier.loadSuccess();
      } catch (error) {
        console.error(error);
        recentDonateNotifier.loadError(error);
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

  const updateDonation = useCallback((index, key, valueOrUpdater) => {
    setDonations((previous) =>
      previous.map((donation, donationIndex) =>
        donationIndex === index
          ? {
              ...donation,
              [key]: typeof valueOrUpdater === "function"
                ? valueOrUpdater(donation[key], donation)
                : valueOrUpdater,
            }
          : donation
      )
    );
    setHasChanges(true);
    setSaveSuccess(false);
  }, []);

  const resetSettings = useCallback(() => {
    if (!window.confirm("Reset recent donate settings to default?")) return;
    setSettings(getDefaultSettings());
    setDonations(getDefaultRecentDonations());
    setHasChanges(true);
    setSaveSuccess(false);
    recentDonateNotifier.resetSuccess();
  }, []);

  const saveSettings = useCallback(async (metadataPayload) => {
    const resolvedWidgetId = widgetId;

    if (!userId || !resolvedWidgetId) {
      recentDonateNotifier.error(MISSING_WIDGET_MESSAGE);
      console.error(MISSING_WIDGET_MESSAGE);
      return;
    }

    const loadingToastId = recentDonateNotifier.saveLoading();
    const resolvedMetadataPayload = metadataPayload ?? toMetadata(settings);
    const payload = {
      userId,
      metadata: resolvedMetadataPayload?.metadata ?? {},
    };

    logRecentDonateProvider("current settings before save", settings);
    logRecentDonateProvider("metadata generated for save", resolvedMetadataPayload);
    logRecentDonateProvider("request payload for save", payload);

    setSaving(true);
    try {
      const result = await saveRecentDonateSettings(resolvedWidgetId, payload);
      logRecentDonateProvider("save result", result);

      if (!result) {
        recentDonateNotifier.saveError(null, loadingToastId);
        return;
      }

      setWidgetId(resolvedWidgetId);
      invalidateWidgetPreviews(userId);
      setHasChanges(false);
      setSaveSuccess(true);
      recentDonateNotifier.saveSuccess(loadingToastId);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      recentDonateNotifier.saveError(error, loadingToastId);
    } finally {
      setSaving(false);
    }
  }, [invalidateWidgetPreviews, settings, userId, widgetId]);

  const metadata = useMemo(() => toMetadata(settings), [settings]);

  const value = useMemo(() => ({
    settings,
    donations,
    metadata,
    widgetId,
    loading,
    saving,
    hasChanges,
    saveSuccess,
    showHeader,
    setSettings,
    setDonations,
    updateSetting,
    update: updateSetting,
    updateSettings,
    updateDonation,
    resetSettings,
    saveSettings,
  }), [
    settings,
    donations,
    metadata,
    widgetId,
    loading,
    saving,
    hasChanges,
    saveSuccess,
    showHeader,
    updateSetting,
    updateSettings,
    updateDonation,
    resetSettings,
    saveSettings,
  ]);

  return (
    <RecentDonateSettingsContext.Provider value={value}>
      {children}
    </RecentDonateSettingsContext.Provider>
  );
}

export function useRecentDonateSettings() {
  const context = useContext(RecentDonateSettingsContext);

  if (!context) {
    throw new Error("useRecentDonateSettings must be used within RecentDonateSettingsProvider");
  }

  return context;
}
