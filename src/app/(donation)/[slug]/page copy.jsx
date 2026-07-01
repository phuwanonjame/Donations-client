"use client";

import { useSyncExternalStore } from "react";
import DonatePageStructure from "@/components/donation/shared/DonatePageStructure";
import { defaultDonatePageSettings } from "@/components/donation/shared/donatePageConfig";
import { loadDonatePageSettings } from "@/components/donation/shared/donatePageStorage";

function buildPublicDonatePageSettings(source) {
  return {
    ...source,
    display: {
      ...source.display,
      showProfileHeader: true,
      showDonationForm: true,
      showMusicPanel: false,
      showVideoHighlights: true,
      showDailyContent: true,
      showGallery: true,
      showSchedule: true,
      showProducts: false,
      showRecentDonations: false,
      showFooter: false,
    },
  };
}

const defaultPublicDonatePageSettings =
  buildPublicDonatePageSettings(defaultDonatePageSettings);

let cachedRawSettings = null;
let cachedPublicSettings = defaultPublicDonatePageSettings;

function subscribe(onStoreChange) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorageChange = () => {
    onStoreChange();
  };
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getSnapshot() {
  const loadedSettings = loadDonatePageSettings(defaultDonatePageSettings);
  const rawSettings = JSON.stringify(loadedSettings);

  if (rawSettings !== cachedRawSettings) {
    cachedRawSettings = rawSettings;
    cachedPublicSettings = buildPublicDonatePageSettings(loadedSettings);
  }

  return cachedPublicSettings;
}

export default function DonateProfile() {
  const settings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => defaultPublicDonatePageSettings
  );

  return <DonatePageStructure settings={settings} />;
}
