"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import { fetchDonateSettings } from "@/actions/DonateAlertapi/donateSettingsApi";
import { fetchDonateGoalSettings } from "@/actions/DonateGoalapi/donateGoalSettingsApi";
import { fetchLeaderboardSettings } from "@/actions/Leaderboardapi/leaderboardSettingsApi";
import { fetchRecentDonateSettings } from "@/actions/RecentDonateapi/recentDonateSettingsApi";
import { fetchTopDonateSettings } from "@/actions/TopDonateapi/topDonateSettingsApi";

import { defaultSettings as defaultAlertSettings, transformToFlatStructure } from "../../dashboard/DonateAlertSettings/components/utils/settingsUtils";
import { defaultSettings as defaultGoalSettings } from "../../dashboard/DonateGoalSettings/constants/donate-goal";
import { fromMetadata as fromGoalMetadata } from "../../dashboard/DonateGoalSettings/utils/donate-goal";
import { defaultSettings as defaultLeaderboardSettings, fromMetadata as fromLeaderboardMetadata } from "../../dashboard/LeaderboardSettings/constants/donate-leaderboard";
import { getDefaultSettings as getDefaultRecentDonateSettings, getDefaultRecentDonations } from "../../dashboard/RecentDonateSettings/constants/recentDonateOptions";
import { fromMetadata as fromRecentDonateMetadata } from "../../dashboard/RecentDonateSettings/utils/recent-donate";
import { getDefaultSettings as getDefaultTopDonateSettings } from "../../dashboard/TopDonateSettings/constants/topDonateOptions";
import { DEFAULT_DONOR_DATA, fromMetadata as fromTopDonateMetadata } from "../../dashboard/TopDonateSettings/utils/top-donate";

const WIDGET_IDS = [
  "donate-alert",
  "donate-goal",
  "leaderboard",
  "top-donate",
  "recent-donate",
  "gift-alert",
];

const DEFAULT_WIDGET_STATES = {
  "donate-alert": true,
  "donate-goal": false,
  leaderboard: false,
  "top-donate": true,
  "recent-donate": true,
  "gift-alert": false,
};

function getGoalPreviewCurrentAmount(settings) {
  const goalAmount = Number(settings?.goalAmount || 100);
  return Math.max(1, Math.round(goalAmount * 0.62));
}

function createDefaultWidgetPreviews() {
  return {
    "donate-alert": {
      kind: "donate-alert",
      widgetId: null,
      settings: transformToFlatStructure(defaultAlertSettings),
    },
    "donate-goal": {
      kind: "donate-goal",
      widgetId: null,
      settings: { ...defaultGoalSettings },
      currentAmount: getGoalPreviewCurrentAmount(defaultGoalSettings),
    },
    leaderboard: {
      kind: "leaderboard",
      widgetId: null,
      settings: { ...defaultLeaderboardSettings },
    },
    "top-donate": {
      kind: "top-donate",
      widgetId: null,
      settings: { ...getDefaultTopDonateSettings() },
      donorData: { ...DEFAULT_DONOR_DATA },
    },
    "recent-donate": {
      kind: "recent-donate",
      widgetId: null,
      settings: { ...getDefaultRecentDonateSettings() },
      donations: getDefaultRecentDonations().map((item, index) => ({
        id: index + 1,
        ...item,
      })),
    },
  };
}

function buildWidgetStatesFromPreviews(previews, fallbackStates = DEFAULT_WIDGET_STATES) {
  return WIDGET_IDS.reduce((accumulator, widgetId) => {
    const previewEnabled = previews?.[widgetId]?.settings?.enabled;
    accumulator[widgetId] = typeof previewEnabled === "boolean"
      ? previewEnabled
      : fallbackStates?.[widgetId] ?? DEFAULT_WIDGET_STATES[widgetId] ?? false;
    return accumulator;
  }, {});
}

const WidgetPreviewsContext = createContext(null);

export function WidgetPreviewsProvider({ children }) {
  const [widgetPreviews, setWidgetPreviews] = useState(() => createDefaultWidgetPreviews());
  const [widgetStates, setWidgetStates] = useState(() => ({ ...DEFAULT_WIDGET_STATES }));
  const [loadedUserId, setLoadedUserId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const updatePreviewBundle = useCallback((nextPreviews) => {
    setWidgetPreviews(nextPreviews);
    setWidgetStates((previous) => buildWidgetStatesFromPreviews(nextPreviews, previous));
  }, []);

  const ensureWidgetPreviewsLoaded = useCallback(async (userId) => {
    if (!userId) {
      const defaults = createDefaultWidgetPreviews();
      updatePreviewBundle(defaults);
      setLoadedUserId(null);
      setLoadingUserId(null);
      return defaults;
    }

    if (loadedUserId === userId && loadingUserId === null) {
      return widgetPreviews;
    }

    if (loadingUserId === userId) {
      return widgetPreviews;
    }

    setLoadingUserId(userId);
    const defaults = createDefaultWidgetPreviews();

    try {
      const results = await Promise.allSettled([
        fetchDonateSettings(userId),
        fetchDonateGoalSettings(userId),
        fetchLeaderboardSettings(userId),
        fetchTopDonateSettings(userId),
        fetchRecentDonateSettings(userId),
      ]);

      const next = { ...defaults };
      const [alertResult, goalResult, leaderboardResult, topDonateResult, recentDonateResult] = results;

      if (alertResult.status === "fulfilled" && alertResult.value?.metadata) {
        next["donate-alert"] = {
          kind: "donate-alert",
          widgetId: alertResult.value?.id ?? null,
          settings: transformToFlatStructure(alertResult.value),
        };
      }

      if (goalResult.status === "fulfilled" && goalResult.value?.metadata) {
        const goalSettings = fromGoalMetadata(goalResult.value.metadata, defaultGoalSettings);
        next["donate-goal"] = {
          kind: "donate-goal",
          widgetId: goalResult.value?.id ?? null,
          settings: goalSettings,
          currentAmount: getGoalPreviewCurrentAmount(goalSettings),
        };
      }

      if (leaderboardResult.status === "fulfilled" && leaderboardResult.value?.metadata) {
        next.leaderboard = {
          kind: "leaderboard",
          widgetId: leaderboardResult.value?.id ?? null,
          settings: fromLeaderboardMetadata(leaderboardResult.value.metadata, defaultLeaderboardSettings),
        };
      }

      if (topDonateResult.status === "fulfilled" && topDonateResult.value?.metadata) {
        const mapped = fromTopDonateMetadata(
          topDonateResult.value.metadata,
          getDefaultTopDonateSettings(),
          DEFAULT_DONOR_DATA,
        );

        next["top-donate"] = {
          kind: "top-donate",
          widgetId: topDonateResult.value?.id ?? null,
          settings: mapped.settings,
          donorData: mapped.donorData,
        };
      }

      if (recentDonateResult.status === "fulfilled" && recentDonateResult.value?.metadata) {
        const mapped = fromRecentDonateMetadata(
          recentDonateResult.value.metadata,
          getDefaultRecentDonateSettings(),
          getDefaultRecentDonations(),
        );

        next["recent-donate"] = {
          kind: "recent-donate",
          widgetId: recentDonateResult.value?.id ?? null,
          settings: mapped.settings,
          donations: mapped.donations.map((item, index) => ({
            id: item.id || index + 1,
            ...item,
          })),
        };
      }

      updatePreviewBundle(next);
      setLoadedUserId(userId);
      return next;
    } finally {
      setLoadingUserId((current) => (current === userId ? null : current));
    }
  }, [loadedUserId, loadingUserId, updatePreviewBundle, widgetPreviews]);

  const setWidgetState = useCallback((widgetId, nextValue) => {
    setWidgetStates((previous) => ({
      ...previous,
      [widgetId]: typeof nextValue === "function" ? nextValue(previous[widgetId]) : nextValue,
    }));
  }, []);

  const invalidateWidgetPreviews = useCallback((userId = null) => {
    setLoadedUserId((current) => (userId && current !== userId ? current : null));
    setLoadingUserId((current) => (userId && current !== userId ? current : null));
  }, []);

  const value = useMemo(() => ({
    widgetPreviews,
    widgetStates,
    isWidgetPreviewsLoaded: loadedUserId !== null,
    isWidgetPreviewsLoading: loadingUserId !== null,
    loadedUserId,
    ensureWidgetPreviewsLoaded,
    setWidgetState,
    setWidgetStates,
    setWidgetPreviews: updatePreviewBundle,
    invalidateWidgetPreviews,
  }), [
    ensureWidgetPreviewsLoaded,
    invalidateWidgetPreviews,
    loadedUserId,
    loadingUserId,
    setWidgetState,
    updatePreviewBundle,
    widgetPreviews,
    widgetStates,
  ]);

  return (
    <WidgetPreviewsContext.Provider value={value}>
      {children}
    </WidgetPreviewsContext.Provider>
  );
}

export function useWidgetPreviews() {
  const context = useContext(WidgetPreviewsContext);

  if (!context) {
    throw new Error("useWidgetPreviews must be used within WidgetPreviewsProvider");
  }

  return context;
}
