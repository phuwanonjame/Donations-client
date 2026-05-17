const WIDGETS_API_BASE = "http://localhost:5000/api/widgets";
const USER_WIDGETS_API_BASE = "http://localhost:5000/api/users";

const logLeaderboardApi = (label, payload) => {
  console.log(`[Leaderboard API] ${label}`, payload);
};

export const fetchLeaderboardSettings = async (userId, widgetId) => {
  if (!userId) {
    console.error("Failed to fetch leaderboard settings: missing userId");
    return null;
  }

  const urls = [
    `${WIDGETS_API_BASE}/${userId}`,
    `${USER_WIDGETS_API_BASE}/${userId}/widgets`,
  ];

  for (const url of urls) {
    try {
      logLeaderboardApi("fetch request", { url, userId, widgetId });

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
        widget?.type === "LEADERBOARD" ||
        widget?.metadata?.type === "leaderboard" ||
        widget?.metadata?.podium
      ) ?? null;

      logLeaderboardApi("fetch response", payload);
      logLeaderboardApi("fetch matched widget", matchedWidget);

      if (matchedWidget) return matchedWidget;
    } catch (err) {
      logLeaderboardApi("fetch failed, trying fallback", { url, error: err?.message });
    }
  }

  return null;
};

export const saveLeaderboardSettings = async (widgetId, payload) => {
  if (!widgetId) {
    console.error("Failed to save leaderboard settings: missing widgetId");
    return null;
  }

  try {
    const url = `${WIDGETS_API_BASE}/${widgetId}`;
    logLeaderboardApi("save request", { url, widgetId, payload });

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      logLeaderboardApi("save error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const responsePayload = await res.json();
    logLeaderboardApi("save response", responsePayload);
    return responsePayload;
  } catch (err) {
    console.error("Failed to save leaderboard settings:", err);
    throw err;
  }
};
