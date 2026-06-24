import { createWidgetUrl } from "@/utils/widgetUrls";

export function generateWidgetUrl(widgetId = 'preview') {
  return createWidgetUrl('recent', widgetId);
}

export const RECENT_DONATE_THEME_PRESETS = [];
export const RECENT_DONATE_THEME_BACKGROUNDS = {};

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
    accentColor: '#38BDF8',
    backgroundColor: '#111827',
    textColor: '#F8FAFC',
    fontSize: [16],
    titleFontFamily: 'ibmplex',
    titleFontWeight: 'bold',
    alignment: 'flex-row',
    layoutStyle: 'list',
    cardStyle: 'minimal',
    borderRadius: [18],
    messagePlaceholder: 'Thanks for your support!',
    animationType: 'fade',
    animationSpeed: [50],
    animationDuration: [700],
    itemSpacing: [12],
    widgetWidth: [520],
    widgetHeight: [420],
    padding: [16],
    position: 'center',
    borderEnabled: true,
    borderColor: '#334155',
    borderWidth: [1],
    shadowEnabled: true,
    shadowBlur: [12],    customCss: '',
    isUseStartAt: false,
    startAt: new Date(Date.now()).toISOString().slice(0, 16),
    isUseEndAt: false,
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    amountColor: '#38BDF8',
    amountFontSize: [20],
    amountAlignment: 'center',
    amountFontFamily: 'ibmplex',
    amountFontWeight: 'bold',
    amountStrokeColor: '#000000',
    amountStrokeWidth: [0],
    lastDonatorColor: '#FFFFFF',
    lastDonatorFontSize: [18],
    lastDonatorAlignment: 'center',
    lastDonatorFontFamily: 'ibmplex',
    lastDonatorFontWeight: 'bold',
    lastDonatorStrokeColor: '#000000',
    lastDonatorStrokeWidth: [0],
  };
}

export function getDefaultRecentDonations() {
  return [
    { name: 'BigSupporter', amount: 'THB 3,500', time: '2 min ago', message: 'Diamond Supporter - Rank #2' },
    { name: 'GoldenDonor', amount: 'THB 2,000', time: '5 min ago', message: 'Gold Supporter - Rank #3' },
    { name: 'NightWolf', amount: 'THB 1,500', time: '8 min ago', message: 'Purple Supporter - Rank #4' },
    { name: 'CatLover', amount: 'THB 1,200', time: '12 min ago', message: 'Green Supporter - Rank #5' },
    { name: 'MrStream', amount: 'THB 900', time: '16 min ago', message: 'Cyan Supporter - Rank #6' },
  ];
}

