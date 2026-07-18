const DEFAULT_WIDGET_BASE_URL = "https://streamflow.app";

export const WIDGET_BASE_URL = (
  process.env.NEXT_PUBLIC_WIDGET_BASE_URL || DEFAULT_WIDGET_BASE_URL
).replace(/\/$/, "");

// Must match the `w=` values handled by the widget switch in
// donation-widget/app/widget/page.tsx.
const WIDGET_TYPE_MAP = {
  alert: "alert",
  goal: "goal",
  leaderboard: "leaderboard",
  top: "topdonate",
  topdonate: "topdonate",
  recent: "recentdonate",
  recentdonate: "recentdonate",
};

export const createWidgetUrl = (type, userId, widgetToken) => {
  if (!userId || !widgetToken) return "";
  const resolvedType = WIDGET_TYPE_MAP[type] || type;
  const params = new URLSearchParams({ w: resolvedType, u: userId, t: widgetToken });
  return `${WIDGET_BASE_URL}/widget?${params.toString()}`;
};
