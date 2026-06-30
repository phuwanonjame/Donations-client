const DONATE_PAGE_SETTINGS_STORAGE_KEY = "donate-page-settings:preview";

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeWithFallback(fallback, persisted) {
  if (Array.isArray(fallback)) {
    return Array.isArray(persisted) ? persisted : fallback;
  }

  if (!isPlainObject(fallback)) {
    return persisted === undefined ? fallback : persisted;
  }

  const result = { ...fallback };

  Object.keys(persisted || {}).forEach((key) => {
    const fallbackValue = fallback[key];
    const persistedValue = persisted[key];

    if (isPlainObject(fallbackValue) && isPlainObject(persistedValue)) {
      result[key] = mergeWithFallback(fallbackValue, persistedValue);
      return;
    }

    result[key] = persistedValue;
  });

  return result;
}

export function loadDonatePageSettings(fallbackSettings) {
  if (typeof window === "undefined") {
    return fallbackSettings;
  }

  try {
    const raw = window.localStorage.getItem(DONATE_PAGE_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return fallbackSettings;
    }

    const parsed = JSON.parse(raw);
    return mergeWithFallback(fallbackSettings, parsed);
  } catch (error) {
    console.error("Failed to load donate page settings from storage:", error);
    return fallbackSettings;
  }
}

export function saveDonatePageSettings(settings) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(
      DONATE_PAGE_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings)
    );
    return true;
  } catch (error) {
    console.error("Failed to save donate page settings to storage:", error);
    return false;
  }
}

export function savePartialDonatePageSettings(partialSettings, fallbackSettings = {}) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const current = loadDonatePageSettings(fallbackSettings);
    const merged = mergeWithFallback(current, partialSettings);

    window.localStorage.setItem(
      DONATE_PAGE_SETTINGS_STORAGE_KEY,
      JSON.stringify(merged)
    );
    return true;
  } catch (error) {
    console.error("Failed to save partial donate page settings to storage:", error);
    return false;
  }
}

export function clearDonatePageSettings() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.removeItem(DONATE_PAGE_SETTINGS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear donate page settings from storage:", error);
    return false;
  }
}

