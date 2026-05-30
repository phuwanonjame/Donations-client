import { createWidgetUrl } from "@/utils/widgetUrls";

export function generateWidgetUrl(widgetId = 'preview') {
  return createWidgetUrl('top', widgetId);
}

export function getDefaultSettings() {
  return {
    enabled: true,
    title: 'Top Donation',
    timeRange: 'stream',
    showName: true,
    showAmount: true,
    showMessage: true,
    showIcon: true,
    accentColor: '#a855f7',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    fontSize: [18],
    iconSize: [48],
    animationStyle: 'glow',
  };
}
