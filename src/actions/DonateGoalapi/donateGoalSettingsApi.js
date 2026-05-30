const WIDGETS_API_BASE = "http://localhost:5000/api/users";
const WIDGET_API_BASE = "http://localhost:5000/api/widgets";

const logGoalApi = (label, payload) => {
  console.log(`[DonateGoal API] ${label}`, payload);
};

export const fetchDonateGoalSettings = async (userId) => {
  if (!userId) {
    console.error("Failed to fetch donate goal settings: missing userId");
    return null;
  }

  try {
    const url = `${WIDGETS_API_BASE}/${userId}/widgets`;
    logGoalApi("fetch request", { url, userId });

    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const payload = await res.json();
    const matchedWidget = (payload?.data || []).find((widget) =>
      widget?.type === "GOAL" ||
      widget?.type === "DONATE_GOAL" ||
      widget?.widgetTypeCode === "GOAL" ||
      widget?.widgetTypeCode === "DONATE_GOAL" ||
      widget?.metadata?.goal
    ) ?? null;

    logGoalApi("fetch response", payload);
    logGoalApi("fetch matched widget", matchedWidget);

    return matchedWidget;
  } catch (err) {
    console.error("Failed to fetch donate goal settings:", err);
    return null;
  }
};

export const saveDonateGoalSettings = async (widgetId, payload) => {
  if (!widgetId) {
    console.error("Failed to save donate goal settings: missing widgetId");
    return null;
  }

  try {
    const url = `${WIDGET_API_BASE}/${widgetId}`;
    logGoalApi("save request", { url, widgetId, payload });

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      logGoalApi("save error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const responsePayload = await res.json();
    logGoalApi("save response", responsePayload);
    return responsePayload;
  } catch (err) {
    console.error("Failed to save donate goal settings:", err);
    throw err;
  }
};
