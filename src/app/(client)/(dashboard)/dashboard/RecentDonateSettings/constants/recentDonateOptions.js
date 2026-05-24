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
    alignment: 'flex-row',
    layoutStyle: 'list',
    isUseStartAt: false,
    startAt: new Date(Date.now()).toISOString().slice(0, 16),
    isUseEndAt: false,
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    amountColor: '#FFFFFF',
    amountFontSize: [36],
    amountAlignment: 'center',
    amountFontFamily: 'IBM Plex Sans Thai',
    amountFontWeight: '700',
    amountStrokeColor: '#000000',
    amountStrokeWidth: [2.5],
    lastDonatorColor: '#FFFFFF',
    lastDonatorFontSize: [36],
    lastDonatorAlignment: 'center',
    lastDonatorFontFamily: 'IBM Plex Sans Thai',
    lastDonatorFontWeight: '700',
    lastDonatorStrokeColor: '#000000',
    lastDonatorStrokeWidth: [2.5],
  };
}

export function getDefaultRecentDonations() {
  return [
    { name: 'Viewer123', amount: '฿100', time: '2 min ago', message: 'Great stream!' },
    { name: 'SupporterX', amount: '฿50', time: '5 min ago', message: '' },
    { name: 'FanGirl', amount: '฿200', time: '8 min ago', message: 'Love your content' },
  ];
}
