const USER_WIDGETS_API_BASE = "http://localhost:5000/api/users";
const WIDGET_API_BASE = "http://localhost:5000/api/widgets";

const logRecentDonateApi = (label, payload) => {
  console.log(`[RecentDonate API] ${label}`, payload);
};

const RECENT_DONATE_WIDGET_CODES = [
  "LASTDONATE",
  "LAST_DONATE",
  "RECENT_DONATE",
  "RECENTDONATE",
  "RECENT",
];

const normalizeWidgetPayload = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [payload?.data || payload].filter(Boolean);
};

const findRecentDonateWidget = (widgets, widgetId) =>
  widgets.find((widget) => {
    const type = widget?.type;
    const widgetTypeCode = widget?.widgetTypeCode;
    const metadataType = widget?.metadata?.type;

    return (
      widget?.id === widgetId ||
      RECENT_DONATE_WIDGET_CODES.includes(type) ||
      RECENT_DONATE_WIDGET_CODES.includes(widgetTypeCode) ||
      metadataType === "LASTDONATE" ||
      metadataType === "lastDonate" ||
      metadataType === "recent_donate" ||
      metadataType === "recentDonate" ||
      widget?.metadata?.lastDonator ||
      widget?.metadata?.recentDonate
    );
  }) ?? null;

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
    const widgets = normalizeWidgetPayload(payload);
    let matchedWidget = findRecentDonateWidget(widgets, widgetId);

    if (!matchedWidget) {
      for (const widgetTypeCode of RECENT_DONATE_WIDGET_CODES) {
        const directUrl = `${WIDGET_API_BASE}?userId=${encodeURIComponent(userId)}&widgetTypeCode=${encodeURIComponent(widgetTypeCode)}`;
        logRecentDonateApi("direct fetch request", { url: directUrl, userId, widgetTypeCode });

        const directRes = await fetch(directUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (directRes.ok) {
          const directPayload = await directRes.json();
          matchedWidget = normalizeWidgetPayload(directPayload)[0] ?? null;
          logRecentDonateApi("direct fetch matched widget", matchedWidget);
          if (matchedWidget) break;
        }
      }
    }

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
