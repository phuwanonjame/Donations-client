import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createRangeSettingsFromMaster,
  normalizeFlatSettings,
} from "../utils/settingsUtils";

const DonateAlertSettingsContext = createContext(null);

export function DonateAlertSettingsProvider({
  settings,
  updateSetting,
  onEffectiveSettingsChange,
  children,
}) {
  const [activeRangeId, setActiveRangeId] = useState(null);

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

  const updateGlobalSetting = useCallback(
    (key, value) => {
      updateSetting(key, value);
    },
    [updateSetting]
  );

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

  const value = useMemo(
    () => ({
      settings,
      normalizedSettings,
      effectiveSettings,
      ranges,
      activeRange,
      activeRangeId: resolvedActiveRangeId,
      setActiveRangeId,
      clearActiveRange: () => setActiveRangeId(null),
      updateGlobalSetting,
      updateContextSetting,
      replaceRanges,
      resetActiveRangeToDefault,
      buildRangeSettings,
    }),
    [
      settings,
      normalizedSettings,
      effectiveSettings,
      ranges,
      activeRange,
      resolvedActiveRangeId,
      updateGlobalSetting,
      updateContextSetting,
      replaceRanges,
      resetActiveRangeToDefault,
      buildRangeSettings,
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
