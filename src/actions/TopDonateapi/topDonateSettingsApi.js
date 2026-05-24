const USER_WIDGETS_API_BASE = "http://localhost:5000/api/users";
const WIDGET_API_BASE = "http://localhost:5000/api/widgets";

const logTopDonateApi = (label, payload) => {
  console.log(`[TopDonate API] ${label}`, payload);
};

export const fetchTopDonateSettings = async (userId, widgetId) => {
  if (!userId) {
    console.error("Failed to fetch top donate settings: missing userId");
    return null;
  }

  try {
    const url = `${USER_WIDGETS_API_BASE}/${userId}/widgets`;
    logTopDonateApi("fetch request", { url, userId, widgetId });

    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const payload = await res.json();
    const widgets = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [payload?.data || payload].filter(Boolean);

    const matchedWidget = widgets.find((widget) =>
      widget?.id === widgetId ||
      widget?.type === "TOP_DONATE" ||
      widget?.type === "TOPDONATE" ||
      widget?.type === "TOP" ||
      widget?.metadata?.type === "top_donate" ||
      widget?.metadata?.type === "topDonate" ||
      widget?.metadata?.topDonate
    ) ?? null;

    logTopDonateApi("fetch response", payload);
    logTopDonateApi("fetch matched widget", matchedWidget);

    return matchedWidget;
  } catch (err) {
    console.error("Failed to fetch top donate settings:", err);
    return null;
  }
};

export const saveTopDonateSettings = async (widgetId, payload) => {
  if (!widgetId) {
    console.error("Failed to save top donate settings: missing widgetId");
    return null;
  }

  try {
    const url = `${WIDGET_API_BASE}/${widgetId}`;
    logTopDonateApi("save request", { url, widgetId, payload });

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      logTopDonateApi("save error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const responsePayload = await res.json();
    logTopDonateApi("save response", responsePayload);
    return responsePayload;
  } catch (err) {
    console.error("Failed to save top donate settings:", err);
    throw err;
  }
};
