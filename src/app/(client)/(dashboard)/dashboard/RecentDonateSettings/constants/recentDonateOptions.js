export function generateWidgetUrl(widgetId = 'abc123') {
  return `https://easydonate.app/w/recent/${widgetId}`;
}

export function getDefaultSettings() {
  return {
    enabled: true,
    title: 'Recent Donations',
    maxEntries: [5],
    showName: true,
    showAmount: true,
    showTime: true,
    showMessage: false,
    autoScroll: true,
    scrollSpeed: [3],
    accentColor: '#3b82f6',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    fontSize: [14],
  };
}

export function getDefaultRecentDonations() {
  return [
    { name: 'Viewer123', amount: '฿100', time: '2 min ago', message: 'Great stream!' },
    { name: 'SupporterX', amount: '฿50', time: '5 min ago', message: '' },
    { name: 'FanGirl', amount: '฿200', time: '8 min ago', message: 'Love your content' },
  ];
}
