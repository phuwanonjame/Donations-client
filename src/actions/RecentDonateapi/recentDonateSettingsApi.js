const USER_WIDGETS_API_BASE = "http://localhost:5000/api/users";
const WIDGET_API_BASE = "http://localhost:5000/api/widgets";

const logRecentDonateApi = (label, payload) => {
  console.log(`[RecentDonate API] ${label}`, payload);
};

export const fetchRecentDonateSettings = async (userId, widgetId) => {
  if (!userId) {
    console.error("Failed to fetch recent donate settings: missing userId");
    return null;
  }

  try {
    const url = `${USER_WIDGETS_API_BASE}/${userId}/widgets?ts=${Date.now()}`;
    logRecentDonateApi("fetch request", { url, userId, widgetId });

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const payload = await res.json();
    const widgets = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [payload?.data || payload].filter(Boolean);

    const matchedWidget = widgets.find((widget) =>
      widget?.id === widgetId ||
      widget?.type === "RECENT_DONATE" ||
      widget?.type === "RECENTDONATE" ||
      widget?.type === "RECENT" ||
      widget?.widgetTypeCode === "RECENT_DONATE" ||
      widget?.widgetTypeCode === "RECENTDONATE" ||
      widget?.widgetTypeCode === "RECENT" ||
      widget?.metadata?.type === "recent_donate" ||
      widget?.metadata?.type === "recentDonate" ||
      widget?.metadata?.recentDonate
    ) ?? null;

    logRecentDonateApi("fetch response", payload);
    logRecentDonateApi("fetch matched widget", matchedWidget);

    return matchedWidget;
  } catch (err) {
    console.error("Failed to fetch recent donate settings:", err);
    return null;
  }
};

export const saveRecentDonateSettings = async (widgetId, payload) => {
  if (!widgetId) {
    console.error("Failed to save recent donate settings: missing widgetId");
    return null;
  }

  try {
    const url = `${WIDGET_API_BASE}/${widgetId}`;
    logRecentDonateApi("save request", { url, widgetId, payload });

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      logRecentDonateApi("save error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const responsePayload = await res.json();
    logRecentDonateApi("save response", responsePayload);
    return responsePayload;
  } catch (err) {
    console.error("Failed to save recent donate settings:", err);
    throw err;
  }
};
