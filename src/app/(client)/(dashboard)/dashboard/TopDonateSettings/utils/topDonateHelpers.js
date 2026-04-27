export function generateWidgetUrl(widgetId = 'abc123') {
  return `https://easydonate.app/w/top/${widgetId}`;
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