const LEGACY_API_URL = "http://localhost:4000/api/donate-settings";
const WIDGETS_API_BASE = "http://localhost:5000/api/users";
const WIDGET_API_BASE = "http://localhost:5000/api/widgets";

// GET settings
export const fetchDonateSettings = async (userId) => {
  if (!userId) {
    console.error("Failed to fetch donate settings: missing userId");
    return null;
  }

  try {
    const res = await fetch(`${WIDGETS_API_BASE}/${userId}/widgets`, {
      method: "GET",
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const payload = await res.json();
    return (payload?.data || []).find((widget) => widget?.type === "ALERT") ?? null;
  } catch (err) {
    console.error("Failed to fetch donate settings:", err);
    return null;
  }
};

// SAVE settings
export const saveDonateSettings = async (widgetId, payload) => {
  if (!widgetId) {
    console.error("Failed to save donate settings: missing widgetId");
    return null;
  }

  console.log("PATCH request", {
    method: "PATCH",
    url: `${WIDGET_API_BASE}/${widgetId}`,
    body: payload,
  });

  try {
    const res = await fetch(`${WIDGET_API_BASE}/${widgetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to save donate settings:", err);
    return null;
  }
};
