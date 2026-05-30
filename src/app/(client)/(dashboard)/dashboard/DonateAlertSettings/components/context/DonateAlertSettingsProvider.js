import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createRangeSettingsFromMaster,
  defaultSettings,
  normalizeFlatSettings,
  transformToFlatStructure,
  transformToGroupedStructure,
} from "../utils/settingsUtils";
import {
  fetchDonateSettings,
  saveDonateSettings,
} from "@/actions/DonateAlertapi/donateSettingsApi";
import { useAuth } from "@/contexts/AuthContext";
import { createWidgetSettingsNotifier } from "@/lib/notifications/widget-settings-toast";

const DonateAlertSettingsContext = createContext(null);
const DEFAULT_TEST_DONATION_MESSAGE = "ขอบคุณมาก ๆ สำหรับกำลังใจนะ {{user}}!";
const alertNotifier = createWidgetSettingsNotifier("Alert settings");

function buildSavePayload(flatSettings) {
  const grouped = transformToGroupedStructure(flatSettings);
  return {
    ...grouped,
    updatedAt: new Date().toISOString(),
  };
}

function buildWidgetPatchRequest(userId, flatSettings) {
  const grouped = buildSavePayload(flatSettings);
  return {
    userId,
    metadata: grouped.metadata,
  };
}

export function DonateAlertSettingsProvider({
  onEffectiveSettingsChange,
  children,
}) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id;
  const [settings, setSettings] = useState(() => transformToFlatStructure(defaultSettings));
  const [widgetId, setWidgetId] = useState(null);
  const [activeRangeId, setActiveRangeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testDonationMessage, setTestDonationMessage] = useState(DEFAULT_TEST_DONATION_MESSAGE);
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);
  const [fullscreenEditorContext, setFullscreenEditorContext] = useState({
    effectiveSettings: null,
    updateFn: null,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (isAuthLoading) return;

      if (!userId) {
        setSettings(transformToFlatStructure(defaultSettings));
        setWidgetId(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetchDonateSettings(userId);
        setWidgetId(response?.id || null);

        if (!response?.metadata) {
          setSettings(transformToFlatStructure(defaultSettings));
          alertNotifier.defaultLoaded();
        } else {
          setSettings(transformToFlatStructure(response));
          alertNotifier.loadSuccess();
        }

        setHasChanges(false);
      } catch (error) {
        console.error(error);
        alertNotifier.loadError(error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isAuthLoading, userId]);

  useEffect(() => {
    if (!showSaveNotification) return undefined;

    const timeoutId = setTimeout(() => setShowSaveNotification(false), 3000);
    return () => clearTimeout(timeoutId);
  }, [showSaveNotification]);

  const normalizedSettings = useMemo(
    () => normalizeFlatSettings(settings),
    [settings]
  );

  const ranges = useMemo(
    () => normalizedSettings?.rangesItems || [],
    [normalizedSettings]
  );
  const resolvedActiveRangeId = ranges.some((range) => range.id === activeRangeId)
    ? activeRangeId
    : null;
  const activeRange = ranges.find((range) => range.id === resolvedActiveRangeId) || null;

  const effectiveSettings = useMemo(() => {
    if (!activeRange) return normalizedSettings;

    return normalizeFlatSettings({
      ...normalizedSettings,
      ...activeRange,
      rangesItems: normalizedSettings.rangesItems,
    });
  }, [activeRange, normalizedSettings]);

  useEffect(() => {
    onEffectiveSettingsChange?.(effectiveSettings);
  }, [effectiveSettings, onEffectiveSettingsChange]);

  const updateSettings = useCallback((patchOrUpdater) => {
    setSettings((previous) => {
      const patch = typeof patchOrUpdater === "function"
        ? patchOrUpdater(previous)
        : patchOrUpdater;

      if (!patch || typeof patch !== "object") return previous;
      return normalizeFlatSettings({ ...previous, ...patch });
    });
    setHasChanges(true);
  }, []);

  const updateSetting = useCallback((key, valueOrUpdater) => {
    updateSettings((previous) => ({
      [key]: typeof valueOrUpdater === "function"
        ? valueOrUpdater(previous[key], previous)
        : valueOrUpdater,
    }));
  }, [updateSettings]);

  const updateGlobalSetting = useCallback((key, value) => {
    updateSetting(key, value);
  }, [updateSetting]);

  const updateContextSetting = useCallback(
    (key, value) => {
      if (!activeRange) {
        updateSetting(key, value);
        return;
      }

      const updatedRanges = ranges.map((range) =>
        range.id === resolvedActiveRangeId
          ? { ...range, [key]: value, isCustomized: true }
          : range
      );

      updateSetting("rangesItems", updatedRanges);
    },
    [activeRange, ranges, resolvedActiveRangeId, updateSetting]
  );

  const replaceRanges = useCallback(
    (updatedRanges) => {
      updateSetting("rangesItems", updatedRanges);
    },
    [updateSetting]
  );

  const addRange = useCallback(
    (overrides = {}) => {
      const newRange = createRangeSettingsFromMaster(normalizedSettings, overrides);
      updateSetting("rangesItems", [...ranges, newRange]);
      return newRange;
    },
    [normalizedSettings, ranges, updateSetting]
  );

  const upsertRange = useCallback(
    (rangeConfig) => {
      const nextRange = normalizeFlatSettings(rangeConfig);
      const exists = ranges.some((range) => range.id === nextRange.id);
      const updatedRanges = exists
        ? ranges.map((range) => (range.id === nextRange.id ? { ...range, ...nextRange } : range))
        : [...ranges, createRangeSettingsFromMaster(normalizedSettings, nextRange)];

      updateSetting("rangesItems", updatedRanges);
    },
    [normalizedSettings, ranges, updateSetting]
  );

  const deleteRange = useCallback(
    (rangeId) => {
      updateSetting("rangesItems", ranges.filter((range) => range.id !== rangeId));
      if (activeRangeId === rangeId) setActiveRangeId(null);
    },
    [activeRangeId, ranges, updateSetting]
  );

  const duplicateRange = useCallback(
    (range, overrides = {}) => {
      const duplicated = {
        ...range,
        ...overrides,
      };
      updateSetting("rangesItems", [...ranges, duplicated]);
      return duplicated;
    },
    [ranges, updateSetting]
  );

  const resetActiveRangeToDefault = useCallback(() => {
    if (!activeRange) return;

    const updatedRanges = ranges.map((range) => {
      if (range.id !== resolvedActiveRangeId) return range;

      return createRangeSettingsFromMaster(normalizedSettings, {
        id: range.id,
        name: range.name,
        minAmount: range.minAmount,
        maxAmount: range.maxAmount,
        priority: range.priority,
        color: range.color,
        _templateId: range._templateId,
        isCustomized: false,
      });
    });

    updateSetting("rangesItems", updatedRanges);
  }, [activeRange, normalizedSettings, ranges, resolvedActiveRangeId, updateSetting]);

  const buildRangeSettings = useCallback(
    (overrides = {}) => createRangeSettingsFromMaster(normalizedSettings, overrides),
    [normalizedSettings]
  );

  const resetSettings = useCallback(() => {
    if (!window.confirm("Reset all settings to default?")) return;
    setSettings(transformToFlatStructure(defaultSettings));
    setActiveRangeId(null);
    setHasChanges(true);
    alertNotifier.resetSuccess();
  }, []);

  const copySettingsJSON = useCallback(async () => {
    try {
      const grouped = buildSavePayload(settings);
      await navigator.clipboard.writeText(JSON.stringify(grouped, null, 2));
      setCopied(true);
      alertNotifier.copySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alertNotifier.copyError(error);
    }
  }, [settings]);

  const saveSettings = useCallback(async () => {
    setSaving(true);
    try {
      const resolvedWidgetId = settings.id || widgetId;

      if (!userId || !resolvedWidgetId) {
        alertNotifier.error("Cannot save because the Alert widget does not exist for this user");
        return;
      }

      const requestPayload = buildWidgetPatchRequest(userId, settings);
      const response = await saveDonateSettings(resolvedWidgetId, requestPayload);

      if (!response) throw new Error("Save failed");

      setSaveSuccess(true);
      setHasChanges(false);
      setShowSaveNotification(true);
      alertNotifier.saveSuccess();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      alertNotifier.saveError(error);
    } finally {
      setSaving(false);
    }
  }, [settings, userId, widgetId]);

  const openFullscreenEditor = useCallback((editorSettings, updateFn) => {
    setFullscreenEditorContext({
      effectiveSettings: editorSettings,
      updateFn,
    });
    setShowFullscreenEditor(true);
  }, []);

  const closeFullscreenEditor = useCallback(() => {
    setShowFullscreenEditor(false);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      widgetId,
      normalizedSettings,
      effectiveSettings,
      loading,
      saving,
      saveSuccess,
      hasChanges,
      showSaveNotification,
      setShowSaveNotification,
      copied,
      testDonationMessage,
      setTestDonationMessage,
      showFullscreenEditor,
      fullscreenEditorContext,
      ranges,
      activeRange,
      activeRangeId: resolvedActiveRangeId,
      setActiveRangeId,
      clearActiveRange: () => setActiveRangeId(null),
      setSettings,
      updateSetting,
      updateSettings,
      addSettingsData: updateSettings,
      updateGlobalSetting,
      updateContextSetting,
      replaceRanges,
      addRange,
      upsertRange,
      deleteRange,
      duplicateRange,
      resetActiveRangeToDefault,
      buildRangeSettings,
      resetSettings,
      copySettingsJSON,
      saveSettings,
      openFullscreenEditor,
      closeFullscreenEditor,
    }),
    [
      settings,
      widgetId,
      normalizedSettings,
      effectiveSettings,
      loading,
      saving,
      saveSuccess,
      hasChanges,
      showSaveNotification,
      copied,
      testDonationMessage,
      showFullscreenEditor,
      fullscreenEditorContext,
      ranges,
      activeRange,
      resolvedActiveRangeId,
      updateSetting,
      updateSettings,
      updateGlobalSetting,
      updateContextSetting,
      replaceRanges,
      addRange,
      upsertRange,
      deleteRange,
      duplicateRange,
      resetActiveRangeToDefault,
      buildRangeSettings,
      resetSettings,
      copySettingsJSON,
      saveSettings,
      openFullscreenEditor,
      closeFullscreenEditor,
    ]
  );

  return (
    <DonateAlertSettingsContext.Provider value={value}>
      {children}
    </DonateAlertSettingsContext.Provider>
  );
}

export function useDonateAlertSettings() {
  const context = useContext(DonateAlertSettingsContext);

  if (!context) {
    throw new Error("useDonateAlertSettings must be used within DonateAlertSettingsProvider");
  }

  return context;
}
