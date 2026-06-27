import { thaiGoogleFonts, fontWeights as alertFontWeights } from '../../DonateAlertSettings/components/utils/fontUtils';

export const layoutStyles = [
  { id: 'vertical', name: 'Vertical List' },
  { id: 'horizontal', name: 'Horizontal Bar' },
  { id: 'podium', name: 'Podium Style' },
];

export const podiumLayoutStyles = [
  { id: 'classic', name: 'Classic Stage' },
  { id: 'spotlight', name: 'Spotlight Hero' },
  { id: 'neon_steps', name: 'Neon Steps' },
  { id: 'compact_badges', name: 'Compact Badges' },
  { id: 'cards', name: 'Rank Cards' },
  { id: 'floating', name: 'Floating Bars' },
];

export const podiumBadgeShapes = [
  { id: 'pentagon', name: 'Pentagon Gem' },
  { id: 'circle', name: 'Circle Coin' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'star', name: 'Star' },
  { id: 'hexagon', name: 'Hexagon' },
  { id: 'shield', name: 'Shield' },
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
  podiumLayoutVariant: 'classic',
  timeRange: 'month',
  maxEntries: 5,
  showRank: true,
  showAmount: true,
  showAvatar: true,
  animateEntries: true,

  titleText: 'Top Supporters',
  titleFontFamily: 'ibmplex',
  titleFontWeight: 'bold',
  titleFontSize: '36px',
  titleColor: '#f59e0b',
  titleStrokeWidth: '0px',
  titleStrokeColor: '#000000',
  titleAlignment: 'center',

  listFontFamily: 'ibmplex',
  listFontWeight: 'medium',
  listFontSize: '18px',
  listColor: '#ffffff',
  listAmountColor: '#f59e0b',
  listStrokeWidth: '0px',
  listStrokeColor: '#000000',
  listShowBackground: false,
  listBackgroundColor: '#000000',
  listBorderColor: 'rgba(0,0,0,0.12)',

  podiumFirstUsernameFontSize: '24px',
  podiumFirstUsernameColor: '#ffffff',
  podiumFirstAmountFontSize: '28px',
  podiumFirstAmountColor: '#f59e0b',
  podiumFirstFontFamily: 'ibmplex',
  podiumFirstFontWeight: 'bold',
  podiumFirstStrokeWidth: '0px',
  podiumFirstStrokeColor: '#000000',
  podiumFirstShine: true,
  podiumFirstBackgroundColor: '',
  podiumFirstPedestalColor: '#D3D1C7',
  podiumFirstImage: '',
  podiumFirstBadgeType: 'pentagon',
  podiumFirstCardBorderColor: 'rgba(255,0,127,0.6)',
  podiumFirstCardBorderWidth: 1,
  podiumFirstCardBorderRadius: 8,
  podiumFirstCardBorderStyle: 'solid',
  podiumFirstCardPaddingX: 8,
  podiumFirstCardPaddingBottom: 20,
  podiumFirstPedestalHeight: 320,
  podiumFirstPedestalShape: 'rect',
  podiumFirstShowPedestalBase: true,
  podiumFirstPedestalBaseHeight: 12,
  podiumFirstPedestalBaseColor: 'transparent',
  podiumFirstShowBadge: true,
  podiumFirstBadgeSize: 110,
  podiumFirstBadgeGradientFrom: '#FF007F',
  podiumFirstBadgeGradientTo: '#7000FF',
  podiumFirstBadgeTextColor: '#FFFFFF',
  podiumFirstBadgeBorderColor: '#FF007F',
  podiumFirstBadgeBorderWidth: 3,
  podiumFirstBadgeGlowColor: 'rgba(255,0,127,0.7)',
  podiumFirstBadgeOffsetY: -20,
  podiumFirstImageOpacity: 0.7,
  podiumFirstImageFit: 'cover',
  podiumFirstImagePosition: 'center',
  podiumFirstShowOverlay: true,
  podiumFirstOverlayColor: '#000000',
  podiumFirstOverlayOpacity: 0.5,
  podiumFirstOverlayDirection: 'to top',
  podiumFirstGlowColor: 'rgba(255,0,127,0.7)',
  podiumFirstGlowBlur: 0,
  podiumFirstTextAlign: 'center',
  podiumFirstTextVerticalAlign: 'flex-end',
  podiumFirstUsernameLetterSpacing: '1px',
  podiumFirstUsernameTransform: 'uppercase',
  podiumFirstUsernameLineHeight: 'normal',
  podiumFirstAmountPrefix: '฿',
  podiumFirstShowExtraLabel: false,
  podiumFirstExtraLabelText: '',
  podiumFirstExtraLabelColor: 'rgba(255,255,255,0.6)',
  podiumFirstExtraLabelFontSize: '11px',

  podiumSecondUsernameFontSize: '20px',
  podiumSecondUsernameColor: '#ffffff',
  podiumSecondAmountFontSize: '22px',
  podiumSecondAmountColor: '#f59e0b',
  podiumSecondFontFamily: 'ibmplex',
  podiumSecondFontWeight: 'bold',
  podiumSecondStrokeWidth: '0px',
  podiumSecondStrokeColor: '#000000',
  podiumSecondShine: false,
  podiumSecondBackgroundColor: '',
  podiumSecondPedestalColor: '#B4B2A9',
  podiumSecondImage: '',
  podiumSecondBadgeType: 'diamond',
  podiumSecondCardBorderColor: 'rgba(0,212,255,0.5)',
  podiumSecondCardBorderWidth: 1,
  podiumSecondCardBorderRadius: 8,
  podiumSecondCardBorderStyle: 'solid',
  podiumSecondCardPaddingX: 8,
  podiumSecondCardPaddingBottom: 20,
  podiumSecondPedestalHeight: 220,
  podiumSecondPedestalShape: 'rect',
  podiumSecondShowPedestalBase: true,
  podiumSecondPedestalBaseHeight: 12,
  podiumSecondPedestalBaseColor: 'transparent',
  podiumSecondShowBadge: true,
  podiumSecondBadgeSize: 96,
  podiumSecondBadgeGradientFrom: '#00D4FF',
  podiumSecondBadgeGradientTo: '#3B00FF',
  podiumSecondBadgeTextColor: '#FFFFFF',
  podiumSecondBadgeBorderColor: '#00D4FF',
  podiumSecondBadgeBorderWidth: 3,
  podiumSecondBadgeGlowColor: 'rgba(0,212,255,0.6)',
  podiumSecondBadgeOffsetY: -20,
  podiumSecondImageOpacity: 0.7,
  podiumSecondImageFit: 'cover',
  podiumSecondImagePosition: 'center',
  podiumSecondShowOverlay: true,
  podiumSecondOverlayColor: '#000000',
  podiumSecondOverlayOpacity: 0.5,
  podiumSecondOverlayDirection: 'to top',
  podiumSecondGlowColor: 'rgba(0,212,255,0.6)',
  podiumSecondGlowBlur: 0,
  podiumSecondTextAlign: 'center',
  podiumSecondTextVerticalAlign: 'flex-end',
  podiumSecondUsernameLetterSpacing: '1px',
  podiumSecondUsernameTransform: 'uppercase',
  podiumSecondUsernameLineHeight: 'normal',
  podiumSecondAmountPrefix: '฿',
  podiumSecondShowExtraLabel: false,
  podiumSecondExtraLabelText: '',
  podiumSecondExtraLabelColor: 'rgba(255,255,255,0.6)',
  podiumSecondExtraLabelFontSize: '11px',

  podiumThirdUsernameFontSize: '18px',
  podiumThirdUsernameColor: '#ffffff',
  podiumThirdAmountFontSize: '20px',
  podiumThirdAmountColor: '#f59e0b',
  podiumThirdFontFamily: 'ibmplex',
  podiumThirdFontWeight: 'bold',
  podiumThirdStrokeWidth: '0px',
  podiumThirdStrokeColor: '#000000',
  podiumThirdShine: false,
  podiumThirdBackgroundColor: '',
  podiumThirdPedestalColor: '#B4B2A9',
  podiumThirdImage: '',
  podiumThirdBadgeType: 'shield',
  podiumThirdCardBorderColor: 'rgba(255,178,0,0.5)',
  podiumThirdCardBorderWidth: 1,
  podiumThirdCardBorderRadius: 8,
  podiumThirdCardBorderStyle: 'solid',
  podiumThirdCardPaddingX: 8,
  podiumThirdCardPaddingBottom: 20,
  podiumThirdPedestalHeight: 220,
  podiumThirdPedestalShape: 'rect',
  podiumThirdShowPedestalBase: true,
  podiumThirdPedestalBaseHeight: 12,
  podiumThirdPedestalBaseColor: 'transparent',
  podiumThirdShowBadge: true,
  podiumThirdBadgeSize: 90,
  podiumThirdBadgeGradientFrom: '#FFB200',
  podiumThirdBadgeGradientTo: '#FF4400',
  podiumThirdBadgeTextColor: '#FFFFFF',
  podiumThirdBadgeBorderColor: '#FFB200',
  podiumThirdBadgeBorderWidth: 3,
  podiumThirdBadgeGlowColor: 'rgba(255,178,0,0.6)',
  podiumThirdBadgeOffsetY: -20,
  podiumThirdImageOpacity: 0.7,
  podiumThirdImageFit: 'cover',
  podiumThirdImagePosition: 'center',
  podiumThirdShowOverlay: true,
  podiumThirdOverlayColor: '#000000',
  podiumThirdOverlayOpacity: 0.5,
  podiumThirdOverlayDirection: 'to top',
  podiumThirdGlowColor: 'rgba(255,178,0,0.6)',
  podiumThirdGlowBlur: 0,
  podiumThirdTextAlign: 'center',
  podiumThirdTextVerticalAlign: 'flex-end',
  podiumThirdUsernameLetterSpacing: '1px',
  podiumThirdUsernameTransform: 'uppercase',
  podiumThirdUsernameLineHeight: 'normal',
  podiumThirdAmountPrefix: '฿',
  podiumThirdShowExtraLabel: false,
  podiumThirdExtraLabelText: '',
  podiumThirdExtraLabelColor: 'rgba(255,255,255,0.6)',
  podiumThirdExtraLabelFontSize: '11px',

  backgroundColor: '#1e293b',
  showBackground: true,
  accentColor: '#f59e0b',

  isUseStartAt: false,
  startAt: new Date(Date.now()).toISOString().slice(0, 16),
  isUseEndAt: false,
  endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
};

// Helper: แปลง font family id เป็นชื่อเต็ม
const getFontFamilyName = (id) => {
  const found = fontFamilies.find(f => f.id === id);
  return found ? found.name : id;
};

const getFontFamilyId = (fontValue, fallback = 'ibmplex') => {
  if (!fontValue) return fallback;
  const normalized = String(fontValue).trim().toLowerCase();
  const found = fontFamilies.find(f =>
    f.id.toLowerCase() === normalized || f.name.toLowerCase() === normalized
  );
  return found ? found.id : fallback;
};

const normalizeMetadataFontWeight = (weight) => {
  if (typeof weight === 'number') return `${weight}`;
  const normalized = String(weight || '').trim().toLowerCase();
  const weightMap = {
    thin: '100',
    extralight: '200',
    'extra-light': '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    'semi-bold': '600',
    bold: '700',
    extrabold: '800',
    'extra-bold': '800',
    black: '900',
  };
  return weightMap[normalized] || weight || '400';
};

const normalizeSettingsFontWeight = (weight, fallback = 'medium') => {
  const normalized = String(weight || '').trim().toLowerCase();
  const weightMap = {
    '100': 'thin',
    '200': 'extralight',
    '300': 'light',
    '400': 'normal',
    '500': 'medium',
    '600': 'semibold',
    '700': 'bold',
    '800': 'extrabold',
    '900': 'black',
  };
  return weightMap[normalized] || normalized || fallback;
};

const toPxString = (value, fallback = '0px') => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? `${parsed}px` : fallback;
};

export const toThaiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear() + 543;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const fromThaiDate = (thaiDateString) => {
  if (!thaiDateString) return '';
  const parts = thaiDateString.trim().split(' ');
  const datePart = parts[0];
  const timePart = parts[1] || '00:00';
  const [day, month, thaiYear] = datePart.split('/');
  if (!day || !month || !thaiYear) return '';
  const year = parseInt(thaiYear, 10) - 543;
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}T${timePart}`;
};

export const getResetDates = () => {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    startAt: now.toISOString().slice(0, 16),
    endAt: end.toISOString().slice(0, 16),
  };
};

export const toMetadata = (settings) => {
  return {
    type: 'LEADERBOARD',
    metadata: {
      // ── Layout & Display ──────────────────────────────────────
      type: settings.layoutStyle || 'podium',
      timeRange: settings.timeRange,
      podiumLayoutVariant: settings.podiumLayoutVariant || 'classic',
      enabled: settings.enabled,
      maxEntries: settings.maxEntries,

      // ── Display Toggles ───────────────────────────────────────
      showRank: settings.showRank,
      showAmount: settings.showAmount,
      showAvatar: settings.showAvatar,
      animateEntries: settings.animateEntries,

      // ── Colors ────────────────────────────────────────────────
      backgroundColor: settings.backgroundColor,
      showBackground: settings.showBackground,
      accentColor: settings.accentColor,

      // ── Title ────────────────────────────────────────────────
      title: {
        text: settings.titleText,
        fontFamily: getFontFamilyName(settings.titleFontFamily),
        fontWeight: normalizeMetadataFontWeight(settings.titleFontWeight),
        fontSize: parseInt(settings.titleFontSize, 10),
        color: settings.titleColor,
        strokeWidth: parseFloat(settings.titleStrokeWidth),
        strokeColor: settings.titleStrokeColor,
        alignment: settings.titleAlignment,
      },

      // ── List ─────────────────────────────────────────────────
      list: {
        count: settings.maxEntries,
        fontFamily: getFontFamilyName(settings.listFontFamily),
        fontWeight: normalizeMetadataFontWeight(settings.listFontWeight),
        fontSize: parseInt(settings.listFontSize, 10),
        color: settings.listColor,
        amountColor: settings.listAmountColor,
        strokeWidth: parseFloat(settings.listStrokeWidth),
        strokeColor: settings.listStrokeColor,
        showBackground: settings.listShowBackground,
        backgroundColor: settings.listBackgroundColor,
        borderColor: settings.listBorderColor,
      },

      // ── Date Range ────────────────────────────────────────────
      isUseStartAt: settings.isUseStartAt,
      startAt: settings.isUseStartAt ? new Date(settings.startAt).getTime() : null,
      isUseEndAt: settings.isUseEndAt,
      endAt: settings.isUseEndAt ? new Date(settings.endAt).getTime() : null,

      // ── Podium ────────────────────────────────────────────────
      podium: {
        // Rank 1
        firstFontFamily: getFontFamilyName(settings.podiumFirstFontFamily),
        firstFontWeight: normalizeMetadataFontWeight(settings.podiumFirstFontWeight),
        firstUsernameFontSize: parseInt(settings.podiumFirstUsernameFontSize, 10),
        firstUsernameColor: settings.podiumFirstUsernameColor,
        firstAmountFontSize: parseInt(settings.podiumFirstAmountFontSize, 10),
        firstAmountColor: settings.podiumFirstAmountColor,
        firstStrokeWidth: parseFloat(settings.podiumFirstStrokeWidth),
        firstStrokeColor: settings.podiumFirstStrokeColor,
        firstShine: settings.podiumFirstShine,
        firstBackgroundColor: settings.podiumFirstBackgroundColor,
        firstPedestalColor: settings.podiumFirstPedestalColor,
        firstImage: settings.podiumFirstImage,
        firstCardBorderColor: settings.podiumFirstCardBorderColor,
        firstCardBorderWidth: settings.podiumFirstCardBorderWidth != null ? Number(settings.podiumFirstCardBorderWidth) : undefined,
        firstCardBorderRadius: settings.podiumFirstCardBorderRadius != null ? Number(settings.podiumFirstCardBorderRadius) : undefined,
        firstCardBorderStyle: settings.podiumFirstCardBorderStyle,
        firstCardPaddingX: settings.podiumFirstCardPaddingX != null ? Number(settings.podiumFirstCardPaddingX) : undefined,
        firstCardPaddingBottom: settings.podiumFirstCardPaddingBottom != null ? Number(settings.podiumFirstCardPaddingBottom) : undefined,
        firstPedestalHeight: settings.podiumFirstPedestalHeight != null ? Number(settings.podiumFirstPedestalHeight) : undefined,
        firstPedestalShape: settings.podiumFirstPedestalShape,
        firstShowPedestalBase: settings.podiumFirstShowPedestalBase,
        firstPedestalBaseHeight: settings.podiumFirstPedestalBaseHeight != null ? Number(settings.podiumFirstPedestalBaseHeight) : undefined,
        firstPedestalBaseColor: settings.podiumFirstPedestalBaseColor,
        firstShowBadge: settings.podiumFirstShowBadge,
        firstBadgeType: settings.podiumFirstBadgeType,
        firstBadgeSize: settings.podiumFirstBadgeSize != null ? Number(settings.podiumFirstBadgeSize) : undefined,
        firstBadgeGradientFrom: settings.podiumFirstBadgeGradientFrom,
        firstBadgeGradientTo: settings.podiumFirstBadgeGradientTo,
        firstBadgeTextColor: settings.podiumFirstBadgeTextColor,
        firstBadgeBorderColor: settings.podiumFirstBadgeBorderColor,
        firstBadgeBorderWidth: settings.podiumFirstBadgeBorderWidth != null ? Number(settings.podiumFirstBadgeBorderWidth) : undefined,
        firstBadgeGlowColor: settings.podiumFirstBadgeGlowColor,
        firstBadgeOffsetY: settings.podiumFirstBadgeOffsetY != null ? Number(settings.podiumFirstBadgeOffsetY) : undefined,
        firstImageOpacity: settings.podiumFirstImageOpacity != null ? Number(settings.podiumFirstImageOpacity) : undefined,
        firstImageFit: settings.podiumFirstImageFit,
        firstImagePosition: settings.podiumFirstImagePosition,
        firstShowOverlay: settings.podiumFirstShowOverlay,
        firstOverlayColor: settings.podiumFirstOverlayColor,
        firstOverlayOpacity: settings.podiumFirstOverlayOpacity != null ? Number(settings.podiumFirstOverlayOpacity) : undefined,
        firstOverlayDirection: settings.podiumFirstOverlayDirection,
        firstGlowColor: settings.podiumFirstGlowColor,
        firstGlowBlur: settings.podiumFirstGlowBlur != null ? Number(settings.podiumFirstGlowBlur) : undefined,
        firstTextAlign: settings.podiumFirstTextAlign,
        firstTextVerticalAlign: settings.podiumFirstTextVerticalAlign,
        firstUsernameLetterSpacing: settings.podiumFirstUsernameLetterSpacing,
        firstUsernameTransform: settings.podiumFirstUsernameTransform,
        firstUsernameLineHeight: settings.podiumFirstUsernameLineHeight,
        firstAmountPrefix: settings.podiumFirstAmountPrefix,
        firstShowExtraLabel: settings.podiumFirstShowExtraLabel,
        firstExtraLabelText: settings.podiumFirstExtraLabelText,
        firstExtraLabelColor: settings.podiumFirstExtraLabelColor,
        firstExtraLabelFontSize: settings.podiumFirstExtraLabelFontSize,

        // Rank 2
        secondFontFamily: getFontFamilyName(settings.podiumSecondFontFamily),
        secondFontWeight: normalizeMetadataFontWeight(settings.podiumSecondFontWeight),
        secondUsernameFontSize: parseInt(settings.podiumSecondUsernameFontSize, 10),
        secondUsernameColor: settings.podiumSecondUsernameColor,
        secondAmountFontSize: parseInt(settings.podiumSecondAmountFontSize, 10),
        secondAmountColor: settings.podiumSecondAmountColor,
        secondStrokeWidth: parseFloat(settings.podiumSecondStrokeWidth),
        secondStrokeColor: settings.podiumSecondStrokeColor,
        secondShine: settings.podiumSecondShine,
        secondBackgroundColor: settings.podiumSecondBackgroundColor,
        secondPedestalColor: settings.podiumSecondPedestalColor,
        secondImage: settings.podiumSecondImage,
        secondCardBorderColor: settings.podiumSecondCardBorderColor,
        secondCardBorderWidth: settings.podiumSecondCardBorderWidth != null ? Number(settings.podiumSecondCardBorderWidth) : undefined,
        secondCardBorderRadius: settings.podiumSecondCardBorderRadius != null ? Number(settings.podiumSecondCardBorderRadius) : undefined,
        secondCardBorderStyle: settings.podiumSecondCardBorderStyle,
        secondCardPaddingX: settings.podiumSecondCardPaddingX != null ? Number(settings.podiumSecondCardPaddingX) : undefined,
        secondCardPaddingBottom: settings.podiumSecondCardPaddingBottom != null ? Number(settings.podiumSecondCardPaddingBottom) : undefined,
        secondPedestalHeight: settings.podiumSecondPedestalHeight != null ? Number(settings.podiumSecondPedestalHeight) : undefined,
        secondPedestalShape: settings.podiumSecondPedestalShape,
        secondShowPedestalBase: settings.podiumSecondShowPedestalBase,
        secondPedestalBaseHeight: settings.podiumSecondPedestalBaseHeight != null ? Number(settings.podiumSecondPedestalBaseHeight) : undefined,
        secondPedestalBaseColor: settings.podiumSecondPedestalBaseColor,
        secondShowBadge: settings.podiumSecondShowBadge,
        secondBadgeType: settings.podiumSecondBadgeType,
        secondBadgeSize: settings.podiumSecondBadgeSize != null ? Number(settings.podiumSecondBadgeSize) : undefined,
        secondBadgeGradientFrom: settings.podiumSecondBadgeGradientFrom,
        secondBadgeGradientTo: settings.podiumSecondBadgeGradientTo,
        secondBadgeTextColor: settings.podiumSecondBadgeTextColor,
        secondBadgeBorderColor: settings.podiumSecondBadgeBorderColor,
        secondBadgeBorderWidth: settings.podiumSecondBadgeBorderWidth != null ? Number(settings.podiumSecondBadgeBorderWidth) : undefined,
        secondBadgeGlowColor: settings.podiumSecondBadgeGlowColor,
        secondBadgeOffsetY: settings.podiumSecondBadgeOffsetY != null ? Number(settings.podiumSecondBadgeOffsetY) : undefined,
        secondImageOpacity: settings.podiumSecondImageOpacity != null ? Number(settings.podiumSecondImageOpacity) : undefined,
        secondImageFit: settings.podiumSecondImageFit,
        secondImagePosition: settings.podiumSecondImagePosition,
        secondShowOverlay: settings.podiumSecondShowOverlay,
        secondOverlayColor: settings.podiumSecondOverlayColor,
        secondOverlayOpacity: settings.podiumSecondOverlayOpacity != null ? Number(settings.podiumSecondOverlayOpacity) : undefined,
        secondOverlayDirection: settings.podiumSecondOverlayDirection,
        secondGlowColor: settings.podiumSecondGlowColor,
        secondGlowBlur: settings.podiumSecondGlowBlur != null ? Number(settings.podiumSecondGlowBlur) : undefined,
        secondTextAlign: settings.podiumSecondTextAlign,
        secondTextVerticalAlign: settings.podiumSecondTextVerticalAlign,
        secondUsernameLetterSpacing: settings.podiumSecondUsernameLetterSpacing,
        secondUsernameTransform: settings.podiumSecondUsernameTransform,
        secondUsernameLineHeight: settings.podiumSecondUsernameLineHeight,
        secondAmountPrefix: settings.podiumSecondAmountPrefix,
        secondShowExtraLabel: settings.podiumSecondShowExtraLabel,
        secondExtraLabelText: settings.podiumSecondExtraLabelText,
        secondExtraLabelColor: settings.podiumSecondExtraLabelColor,
        secondExtraLabelFontSize: settings.podiumSecondExtraLabelFontSize,

        // Rank 3
        thirdFontFamily: getFontFamilyName(settings.podiumThirdFontFamily),
        thirdFontWeight: normalizeMetadataFontWeight(settings.podiumThirdFontWeight),
        thirdUsernameFontSize: parseInt(settings.podiumThirdUsernameFontSize, 10),
        thirdUsernameColor: settings.podiumThirdUsernameColor,
        thirdAmountFontSize: parseInt(settings.podiumThirdAmountFontSize, 10),
        thirdAmountColor: settings.podiumThirdAmountColor,
        thirdStrokeWidth: parseFloat(settings.podiumThirdStrokeWidth),
        thirdStrokeColor: settings.podiumThirdStrokeColor,
        thirdShine: settings.podiumThirdShine,
        thirdBackgroundColor: settings.podiumThirdBackgroundColor,
        thirdPedestalColor: settings.podiumThirdPedestalColor,
        thirdImage: settings.podiumThirdImage,
        thirdCardBorderColor: settings.podiumThirdCardBorderColor,
        thirdCardBorderWidth: settings.podiumThirdCardBorderWidth != null ? Number(settings.podiumThirdCardBorderWidth) : undefined,
        thirdCardBorderRadius: settings.podiumThirdCardBorderRadius != null ? Number(settings.podiumThirdCardBorderRadius) : undefined,
        thirdCardBorderStyle: settings.podiumThirdCardBorderStyle,
        thirdCardPaddingX: settings.podiumThirdCardPaddingX != null ? Number(settings.podiumThirdCardPaddingX) : undefined,
        thirdCardPaddingBottom: settings.podiumThirdCardPaddingBottom != null ? Number(settings.podiumThirdCardPaddingBottom) : undefined,
        thirdPedestalHeight: settings.podiumThirdPedestalHeight != null ? Number(settings.podiumThirdPedestalHeight) : undefined,
        thirdPedestalShape: settings.podiumThirdPedestalShape,
        thirdShowPedestalBase: settings.podiumThirdShowPedestalBase,
        thirdPedestalBaseHeight: settings.podiumThirdPedestalBaseHeight != null ? Number(settings.podiumThirdPedestalBaseHeight) : undefined,
        thirdPedestalBaseColor: settings.podiumThirdPedestalBaseColor,
        thirdShowBadge: settings.podiumThirdShowBadge,
        thirdBadgeType: settings.podiumThirdBadgeType,
        thirdBadgeSize: settings.podiumThirdBadgeSize != null ? Number(settings.podiumThirdBadgeSize) : undefined,
        thirdBadgeGradientFrom: settings.podiumThirdBadgeGradientFrom,
        thirdBadgeGradientTo: settings.podiumThirdBadgeGradientTo,
        thirdBadgeTextColor: settings.podiumThirdBadgeTextColor,
        thirdBadgeBorderColor: settings.podiumThirdBadgeBorderColor,
        thirdBadgeBorderWidth: settings.podiumThirdBadgeBorderWidth != null ? Number(settings.podiumThirdBadgeBorderWidth) : undefined,
        thirdBadgeGlowColor: settings.podiumThirdBadgeGlowColor,
        thirdBadgeOffsetY: settings.podiumThirdBadgeOffsetY != null ? Number(settings.podiumThirdBadgeOffsetY) : undefined,
        thirdImageOpacity: settings.podiumThirdImageOpacity != null ? Number(settings.podiumThirdImageOpacity) : undefined,
        thirdImageFit: settings.podiumThirdImageFit,
        thirdImagePosition: settings.podiumThirdImagePosition,
        thirdShowOverlay: settings.podiumThirdShowOverlay,
        thirdOverlayColor: settings.podiumThirdOverlayColor,
        thirdOverlayOpacity: settings.podiumThirdOverlayOpacity != null ? Number(settings.podiumThirdOverlayOpacity) : undefined,
        thirdOverlayDirection: settings.podiumThirdOverlayDirection,
        thirdGlowColor: settings.podiumThirdGlowColor,
        thirdGlowBlur: settings.podiumThirdGlowBlur != null ? Number(settings.podiumThirdGlowBlur) : undefined,
        thirdTextAlign: settings.podiumThirdTextAlign,
        thirdTextVerticalAlign: settings.podiumThirdTextVerticalAlign,
        thirdUsernameLetterSpacing: settings.podiumThirdUsernameLetterSpacing,
        thirdUsernameTransform: settings.podiumThirdUsernameTransform,
        thirdUsernameLineHeight: settings.podiumThirdUsernameLineHeight,
        thirdAmountPrefix: settings.podiumThirdAmountPrefix,
        thirdShowExtraLabel: settings.podiumThirdShowExtraLabel,
        thirdExtraLabelText: settings.podiumThirdExtraLabelText,
        thirdExtraLabelColor: settings.podiumThirdExtraLabelColor,
        thirdExtraLabelFontSize: settings.podiumThirdExtraLabelFontSize,
      },
    },
  };
};

const pickFields = (source, keys) => keys.reduce((picked, key) => {
  if (source[key] !== undefined) picked[key] = source[key];
  return picked;
}, {});

const API_SAFE_PODIUM_FIELDS = [
  'firstImage',
  'firstShine',
  'thirdImage',
  'secondImage',
  'firstGlowBlur',
  'firstImageFit',
  'thirdGlowBlur',
  'thirdImageFit',
  'firstBadgeSize',
  'firstBadgeType',
  'firstGlowColor',
  'firstShowBadge',
  'firstTextAlign',
  'secondGlowBlur',
  'secondImageFit',
  'thirdBadgeSize',
  'thirdBadgeType',
  'thirdGlowColor',
  'thirdShowBadge',
  'thirdTextAlign',
  'firstFontFamily',
  'firstFontWeight',
  'secondBadgeSize',
  'secondBadgeType',
  'secondGlowColor',
  'secondShowBadge',
  'secondTextAlign',
  'thirdFontFamily',
  'thirdFontWeight',
  'firstAmountColor',
  'firstShowOverlay',
  'firstStrokeColor',
  'firstStrokeWidth',
  'secondFontFamily',
  'secondFontWeight',
  'thirdAmountColor',
  'thirdShowOverlay',
  'thirdStrokeColor',
  'thirdStrokeWidth',
  'firstAmountPrefix',
  'firstBadgeOffsetY',
  'firstCardPaddingX',
  'firstImageOpacity',
  'firstOverlayColor',
  'secondAmountColor',
  'secondShowOverlay',
  'secondStrokeColor',
  'secondStrokeWidth',
  'thirdAmountPrefix',
  'thirdBadgeOffsetY',
  'thirdCardPaddingX',
  'thirdImageOpacity',
  'thirdOverlayColor',
  'firstImagePosition',
  'firstPedestalColor',
  'firstPedestalShape',
  'firstUsernameColor',
  'secondAmountPrefix',
  'secondBadgeOffsetY',
  'secondCardPaddingX',
  'secondImageOpacity',
  'secondOverlayColor',
  'thirdImagePosition',
  'thirdPedestalColor',
  'thirdPedestalShape',
  'thirdUsernameColor',
  'firstAmountFontSize',
  'firstBadgeGlowColor',
  'firstBadgeTextColor',
  'firstExtraLabelText',
  'firstOverlayOpacity',
  'firstPedestalHeight',
  'firstShowExtraLabel',
  'secondImagePosition',
  'secondPedestalColor',
  'secondPedestalShape',
  'secondUsernameColor',
  'thirdAmountFontSize',
  'thirdBadgeGlowColor',
  'thirdBadgeTextColor',
  'thirdExtraLabelText',
  'thirdOverlayOpacity',
  'thirdPedestalHeight',
  'thirdShowExtraLabel',
  'firstBackgroundColor',
  'firstBadgeGradientTo',
  'firstCardBorderColor',
  'firstCardBorderStyle',
  'firstCardBorderWidth',
  'firstExtraLabelColor',
  'secondAmountFontSize',
  'secondBadgeGlowColor',
  'secondBadgeTextColor',
  'secondExtraLabelText',
  'secondOverlayOpacity',
  'secondPedestalHeight',
  'secondShowExtraLabel',
  'thirdBackgroundColor',
  'thirdBadgeGradientTo',
  'thirdCardBorderColor',
  'thirdCardBorderStyle',
  'thirdCardBorderWidth',
  'thirdExtraLabelColor',
  'firstBadgeBorderColor',
  'firstBadgeBorderWidth',
  'firstCardBorderRadius',
  'firstOverlayDirection',
  'firstShowPedestalBase',
  'firstUsernameFontSize',
  'secondBackgroundColor',
  'secondBadgeGradientTo',
  'secondCardBorderColor',
  'secondCardBorderStyle',
  'secondCardBorderWidth',
  'secondExtraLabelColor',
  'thirdBadgeBorderColor',
  'thirdBadgeBorderWidth',
  'thirdCardBorderRadius',
  'thirdOverlayDirection',
  'thirdShowPedestalBase',
  'thirdUsernameFontSize',
  'firstBadgeGradientFrom',
  'firstCardPaddingBottom',
  'firstPedestalBaseColor',
  'firstTextVerticalAlign',
  'firstUsernameTransform',
  'secondBadgeBorderColor',
  'secondBadgeBorderWidth',
  'secondCardBorderRadius',
  'secondOverlayDirection',
  'secondShowPedestalBase',
  'secondUsernameFontSize',
  'thirdBadgeGradientFrom',
  'thirdCardPaddingBottom',
  'thirdPedestalBaseColor',
  'thirdTextVerticalAlign',
  'thirdUsernameTransform',
  'firstExtraLabelFontSize',
  'firstPedestalBaseHeight',
  'firstUsernameLineHeight',
  'secondBadgeGradientFrom',
  'secondCardPaddingBottom',
  'secondPedestalBaseColor',
  'secondTextVerticalAlign',
  'secondUsernameTransform',
  'thirdExtraLabelFontSize',
  'thirdPedestalBaseHeight',
  'thirdUsernameLineHeight',
  'secondExtraLabelFontSize',
  'secondPedestalBaseHeight',
  'secondUsernameLineHeight',
  'firstUsernameLetterSpacing',
  'thirdUsernameLetterSpacing',
  'secondUsernameLetterSpacing',
];

const API_LAYOUT_TYPE = 'main';

const toApiLayoutType = (layoutStyle, fallback = 'podium') => {
  const normalized = layoutStyle || fallback;
  if (normalized === 'podium') return API_LAYOUT_TYPE;
  if (normalized === 'vertical' || normalized === 'horizontal') return normalized;
  return fallback === 'podium' ? API_LAYOUT_TYPE : fallback;
};

const normalizeApiLayoutStyle = (type, fallback) => {
  if (type === API_LAYOUT_TYPE) return 'podium';
  if (type === 'vertical' || type === 'horizontal' || type === 'podium') return type;
  return fallback;
};

export const toApiMetadata = (settings) => {
  const fullMetadata = toMetadata(settings).metadata;

  return {
    type: 'LEADERBOARD',
    metadata: {
      list: fullMetadata.list,
      type: toApiLayoutType(fullMetadata.type, 'podium'),
      endAt: fullMetadata.endAt,
      title: fullMetadata.title,
      podium: pickFields(fullMetadata.podium, API_SAFE_PODIUM_FIELDS),
      enabled: fullMetadata.enabled,
      startAt: fullMetadata.startAt,
      showRank: fullMetadata.showRank,
      timeRange: fullMetadata.timeRange,
      isUseEndAt: fullMetadata.isUseEndAt,
      maxEntries: fullMetadata.maxEntries,
      showAmount: fullMetadata.showAmount,
      showAvatar: fullMetadata.showAvatar,
      accentColor: fullMetadata.accentColor,
      isUseStartAt: fullMetadata.isUseStartAt,
      animateEntries: fullMetadata.animateEntries,
      showBackground: fullMetadata.showBackground,
      backgroundColor: fullMetadata.backgroundColor,
      podiumLayoutVariant: fullMetadata.podiumLayoutVariant,
    },
  };
};

export const fromMetadata = (metadata = {}, fallbackSettings = defaultSettings) => {
  const title = metadata.title || {};
  const list = metadata.list || {};
  const podium = metadata.podium || {};

  const settings = {
    ...fallbackSettings,
    enabled: metadata.enabled ?? fallbackSettings.enabled,
    layoutStyle: normalizeApiLayoutStyle(metadata.type, fallbackSettings.layoutStyle),
    timeRange: metadata.timeRange ?? fallbackSettings.timeRange,
    podiumLayoutVariant: metadata.podiumLayoutVariant ?? fallbackSettings.podiumLayoutVariant,
    maxEntries: metadata.maxEntries ?? list.count ?? fallbackSettings.maxEntries,
    showRank: metadata.showRank ?? fallbackSettings.showRank,
    showAmount: metadata.showAmount ?? fallbackSettings.showAmount,
    showAvatar: metadata.showAvatar ?? fallbackSettings.showAvatar,
    animateEntries: metadata.animateEntries ?? fallbackSettings.animateEntries,
    backgroundColor: metadata.backgroundColor ?? fallbackSettings.backgroundColor,
    showBackground: metadata.showBackground ?? fallbackSettings.showBackground,
    accentColor: metadata.accentColor ?? fallbackSettings.accentColor,

    titleText: title.text ?? fallbackSettings.titleText,
    titleFontFamily: getFontFamilyId(title.fontFamily, fallbackSettings.titleFontFamily),
    titleFontWeight: normalizeSettingsFontWeight(title.fontWeight, fallbackSettings.titleFontWeight),
    titleFontSize: toPxString(title.fontSize, fallbackSettings.titleFontSize),
    titleColor: title.color ?? fallbackSettings.titleColor,
    titleStrokeWidth: toPxString(title.strokeWidth, fallbackSettings.titleStrokeWidth),
    titleStrokeColor: title.strokeColor ?? fallbackSettings.titleStrokeColor,
    titleAlignment: title.alignment ?? fallbackSettings.titleAlignment,

    listFontFamily: getFontFamilyId(list.fontFamily, fallbackSettings.listFontFamily),
    listFontWeight: normalizeSettingsFontWeight(list.fontWeight, fallbackSettings.listFontWeight),
    listFontSize: toPxString(list.fontSize, fallbackSettings.listFontSize),
    listColor: list.color ?? fallbackSettings.listColor,
    listAmountColor: list.amountColor ?? fallbackSettings.listAmountColor,
    listStrokeWidth: toPxString(list.strokeWidth, fallbackSettings.listStrokeWidth),
    listStrokeColor: list.strokeColor ?? fallbackSettings.listStrokeColor,
    listShowBackground: list.showBackground ?? fallbackSettings.listShowBackground,
    listBackgroundColor: list.backgroundColor ?? fallbackSettings.listBackgroundColor,
    listBorderColor: list.borderColor ?? fallbackSettings.listBorderColor,

    isUseStartAt: metadata.isUseStartAt ?? fallbackSettings.isUseStartAt,
    startAt: metadata.startAt ? new Date(metadata.startAt).toISOString().slice(0, 16) : fallbackSettings.startAt,
    isUseEndAt: metadata.isUseEndAt ?? fallbackSettings.isUseEndAt,
    endAt: metadata.endAt ? new Date(metadata.endAt).toISOString().slice(0, 16) : fallbackSettings.endAt,
  };

  ['first', 'second', 'third'].forEach((rank) => {
    const prefix = `podium${rank.charAt(0).toUpperCase()}${rank.slice(1)}`;
    Object.entries(podium).forEach(([key, value]) => {
      if (!key.startsWith(rank) || value === undefined) return;
      const suffix = key.slice(rank.length);
      const settingKey = `${prefix}${suffix}`;

      if (settingKey.endsWith('FontFamily')) {
        settings[settingKey] = getFontFamilyId(value, fallbackSettings[settingKey]);
      } else if (settingKey.endsWith('FontWeight')) {
        settings[settingKey] = normalizeSettingsFontWeight(value, fallbackSettings[settingKey]);
      } else if (
        settingKey.endsWith('UsernameFontSize') ||
        settingKey.endsWith('AmountFontSize') ||
        settingKey.endsWith('StrokeWidth') ||
        settingKey.endsWith('ExtraLabelFontSize')
      ) {
        settings[settingKey] = toPxString(value, fallbackSettings[settingKey]);
      } else {
        settings[settingKey] = value;
      }
    });
  });

  return settings;
};
