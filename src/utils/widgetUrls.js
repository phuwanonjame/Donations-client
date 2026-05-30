const DEFAULT_WIDGET_BASE_URL = "https://streamflow.app";

export const WIDGET_BASE_URL = (
  process.env.NEXT_PUBLIC_WIDGET_BASE_URL || DEFAULT_WIDGET_BASE_URL
).replace(/\/$/, "");

export const createWidgetUrl = (type, widgetId) => {
  if (!widgetId) return "";
  return `${WIDGET_BASE_URL}/w/${type}/${widgetId}`;
};
