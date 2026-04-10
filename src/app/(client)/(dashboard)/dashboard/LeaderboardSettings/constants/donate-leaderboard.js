import { thaiGoogleFonts, fontWeights as alertFontWeights } from '../../DonateAlertSettings/components/utils/fontUtils';

export const layoutStyles = [
  { id: 'vertical', name: 'Vertical List' },
  { id: 'horizontal', name: 'Horizontal Bar' },
  { id: 'podium', name: 'Podium Style' },
];

export const timeRanges = [
  { id: 'today', name: 'Today' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'all', name: 'All Time' },
];

export const fontFamilies = thaiGoogleFonts.map(f => ({ id: f.id, name: f.name }));
export const fontWeights = alertFontWeights.map(weight => ({ id: weight, name: weight.charAt(0).toUpperCase() + weight.slice(1) }));

export const fontSizes = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px', '30px', '32px', '36px',
  '40px', '48px', '56px', '64px', '72px', '80px', '96px', '100px'
];

export const strokeWidths = ['0px', '1px', '1.5px', '2px', '2.5px', '3px', '4px'];
export const textAlignments = [
  { id: 'left', name: 'Left' },
  { id: 'center', name: 'Center' },
  { id: 'right', name: 'Right' },
];

export const defaultSettings = {
  enabled: true,
  layoutStyle: 'podium',
  timeRange: 'month',
  maxEntries: 5,
  showRank: true,
  showAmount: true,
  showAvatar: true,
  animateEntries: true,

  titleText: 'Top Supporters',
  titleFontFamily: 'ibm-plex-sans-thai',
  titleFontWeight: 'bold',
  titleFontSize: '36px',
  titleColor: '#f59e0b',
  titleStrokeWidth: '0px',
  titleStrokeColor: '#000000',
  titleAlignment: 'center',

  listFontFamily: 'ibm-plex-sans-thai',
  listFontWeight: 'medium',
  listFontSize: '18px',
  listColor: '#ffffff',
  listAmountColor: '#f59e0b',
  listStrokeWidth: '0px',
  listStrokeColor: '#000000',

  podiumFirstUsernameFontSize: '24px',
  podiumFirstUsernameColor: '#ffffff',
  podiumFirstAmountFontSize: '28px',
  podiumFirstAmountColor: '#f59e0b',
  podiumFirstFontFamily: 'ibm-plex-sans-thai',
  podiumFirstFontWeight: 'bold',
  podiumFirstStrokeWidth: '0px',
  podiumFirstStrokeColor: '#000000',
  podiumFirstShine: true,

  podiumSecondUsernameFontSize: '20px',
  podiumSecondUsernameColor: '#ffffff',
  podiumSecondAmountFontSize: '22px',
  podiumSecondAmountColor: '#f59e0b',
  podiumSecondFontFamily: 'ibm-plex-sans-thai',
  podiumSecondFontWeight: 'bold',
  podiumSecondStrokeWidth: '0px',
  podiumSecondStrokeColor: '#000000',

  backgroundColor: '#1e293b',
  accentColor: '#f59e0b',

  isUseStartAt: false,
  startAt: new Date(Date.now()).toISOString().slice(0, 16),
  isUseEndAt: false,
  endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
};