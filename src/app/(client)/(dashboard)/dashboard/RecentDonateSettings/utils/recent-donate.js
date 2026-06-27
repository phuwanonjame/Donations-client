import { thaiGoogleFonts } from '../../DonateAlertSettings/components/utils/fontUtils';
import { getDefaultRecentDonations, getDefaultSettings } from '../constants/recentDonateOptions';

const FONT_WEIGHT_TO_API = {
  normal: '400',
  medium: '500',
  bold: '700',
  extrabold: '800',
};

const FONT_WEIGHT_FROM_API = {
  '400': 'normal',
  '500': 'medium',
  '700': 'bold',
  '800': 'extrabold',
};

const normalizeSliderValue = (value, fallback) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return fallback;
  return [Number(value)];
};

const getSliderNumber = (value, fallback = 0) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveFontName = (fontValue, fallback = 'IBM Plex Sans Thai') => {
  if (!fontValue) return fallback;
  const normalized = String(fontValue).trim().toLowerCase();
  const matched = thaiGoogleFonts.find((font) =>
    font.id.toLowerCase() === normalized || font.name.toLowerCase() === normalized,
  );
  return matched?.name || fontValue;
};

const resolveFontId = (fontValue, fallback = 'ibmplex') => {
  if (!fontValue) return fallback;
  const normalized = String(fontValue).trim().toLowerCase();
  const matched = thaiGoogleFonts.find((font) =>
    font.id.toLowerCase() === normalized || font.name.toLowerCase() === normalized,
  );
  return matched?.id || fallback;
};

const resolveWeightForApi = (weight, fallback = '700') => {
  if (!weight) return fallback;
  return FONT_WEIGHT_TO_API[weight] || String(weight);
};

const resolveWeightForSettings = (weight, fallback = 'bold') => {
  if (!weight) return fallback;
  const normalized = String(weight).trim().toLowerCase();
  if (FONT_WEIGHT_FROM_API[normalized]) return FONT_WEIGHT_FROM_API[normalized];
  if (['normal', 'medium', 'bold', 'extrabold'].includes(normalized)) return normalized;
  if (['100', '200', '300', '400', '500', '600', '700', '800', '900'].includes(normalized)) {
    return FONT_WEIGHT_FROM_API[normalized] || fallback;
  }
  return fallback;
};

const DEFAULT_TEXT_STYLE = {
  color: '#FFFFFF',
  fontSize: 18,
  alignment: 'center',
  fontFamily: 'ibmplex',
  fontWeight: 'bold',
  strokeColor: '#000000',
  strokeWidth: 0,
};

const toTimestampOrNull = (value) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const toDateInputValue = (value, fallback) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString().slice(0, 16);
};

const createTextStyle = (settings, prefix, fallback = DEFAULT_TEXT_STYLE) => ({
  color: settings[`${prefix}Color`] ?? fallback.color,
  fontSize: getSliderNumber(settings[`${prefix}FontSize`], fallback.fontSize),
  alignment: settings[`${prefix}Alignment`] ?? fallback.alignment,
  fontFamily: settings[`${prefix}FontFamily`] ?? fallback.fontFamily,
  fontWeight: settings[`${prefix}FontWeight`] ?? fallback.fontWeight,
  strokeColor: settings[`${prefix}StrokeColor`] ?? fallback.strokeColor,
  strokeWidth: getSliderNumber(settings[`${prefix}StrokeWidth`], fallback.strokeWidth),
});

export const toMetadata = (settings) => {
  const defaults = getDefaultSettings();
  const amountFallback = settings.amountFallback || DEFAULT_TEXT_STYLE;
  const lastDonatorFallback = settings.lastDonatorFallback || DEFAULT_TEXT_STYLE;

  return {
    type: 'LASTDONATE',
    metadata: {
      enabled: settings.enabled ?? defaults.enabled,
      endAt: settings.isUseEndAt ? toTimestampOrNull(settings.endAt) : null,
      title: settings.title ?? defaults.title,
      amount: {
        ...createTextStyle(settings, 'amount', amountFallback),
        fontFamily: resolveFontName(settings.amountFontFamily ?? amountFallback.fontFamily),
        fontWeight: resolveWeightForApi(settings.amountFontWeight ?? amountFallback.fontWeight),
      },
      padding: getSliderNumber(settings.padding, getSliderNumber(defaults.padding, 16)),
      startAt: settings.isUseStartAt ? toTimestampOrNull(settings.startAt) : null,
      fontSize: getSliderNumber(settings.fontSize, getSliderNumber(defaults.fontSize, 16)),
      position: settings.position ?? defaults.position,
      showName: settings.showName ?? defaults.showName,
      showTime: settings.showTime ?? defaults.showTime,
      alignment: settings.alignment ?? 'flex-row',
      cardStyle: settings.cardStyle ?? defaults.cardStyle,
      customCss: settings.customCss ?? defaults.customCss,
      textColor: settings.textColor ?? defaults.textColor,
      alertSound: resolveWeightForApi(settings.titleFontWeight ?? defaults.titleFontWeight),
      autoScroll: settings.autoScroll ?? defaults.autoScroll,
      isUseEndAt: settings.isUseEndAt ?? false,
      maxEntries: getSliderNumber(settings.maxEntries, getSliderNumber(defaults.maxEntries, 5)),
      shadowBlur: getSliderNumber(settings.shadowBlur, getSliderNumber(defaults.shadowBlur, 12)),
      showAmount: settings.showAmount ?? defaults.showAmount,
      accentColor: settings.accentColor ?? defaults.accentColor,
      borderColor: settings.borderColor ?? defaults.borderColor,
      borderWidth: getSliderNumber(settings.borderWidth, getSliderNumber(defaults.borderWidth, 1)),
      itemSpacing: getSliderNumber(settings.itemSpacing, getSliderNumber(defaults.itemSpacing, 12)),
      lastDonator: {
        ...createTextStyle(settings, 'lastDonator', lastDonatorFallback),
        fontFamily: resolveFontName(settings.lastDonatorFontFamily ?? lastDonatorFallback.fontFamily),
        fontWeight: resolveWeightForApi(settings.lastDonatorFontWeight ?? lastDonatorFallback.fontWeight),
      },
      layoutStyle: settings.layoutStyle ?? defaults.layoutStyle,
      scrollSpeed: getSliderNumber(settings.scrollSpeed, getSliderNumber(defaults.scrollSpeed, 3)),
      showMessage: settings.showMessage ?? defaults.showMessage,
      themePreset: resolveFontName(settings.titleFontFamily ?? defaults.titleFontFamily),
      widgetWidth: getSliderNumber(settings.widgetWidth, getSliderNumber(defaults.widgetWidth, 520)),
      borderRadius: getSliderNumber(settings.borderRadius, getSliderNumber(defaults.borderRadius, 16)),
      isUseStartAt: settings.isUseStartAt ?? false,
      widgetHeight: getSliderNumber(settings.widgetHeight, getSliderNumber(defaults.widgetHeight, 420)),
      animationType: settings.animationType ?? defaults.animationType,
      borderEnabled: settings.borderEnabled ?? defaults.borderEnabled,
      shadowEnabled: settings.shadowEnabled ?? defaults.shadowEnabled,
      animationSpeed: getSliderNumber(settings.animationSpeed, getSliderNumber(defaults.animationSpeed, 50)),
      backgroundBlur: settings.backgroundBlur ?? false,
      backgroundColor: settings.backgroundColor ?? defaults.backgroundColor,
      alertSoundEnabled: settings.alertSoundEnabled ?? true,
      animationDuration: getSliderNumber(settings.animationDuration, getSliderNumber(defaults.animationDuration, 700)),
      messagePlaceholder: settings.messagePlaceholder ?? defaults.messagePlaceholder,
      backgroundBlurAmount: getSliderNumber(settings.backgroundBlurAmount, 0),
    },
  };
};

export const fromMetadata = (
  metadata = {},
  fallbackSettings = getDefaultSettings(),
  fallbackDonations = getDefaultRecentDonations(),
) => {
  const source = metadata.recentDonate || metadata;
  const amount = source.amount || DEFAULT_TEXT_STYLE;
  const lastDonator = source.lastDonator || DEFAULT_TEXT_STYLE;
  const donations = Array.isArray(metadata.donations)
    ? metadata.donations
    : Array.isArray(metadata.recentDonations)
      ? metadata.recentDonations
      : fallbackDonations;

  return {
    settings: {
      ...fallbackSettings,
      enabled: source.enabled ?? fallbackSettings.enabled,
      title: source.title ?? fallbackSettings.title,
      titleFontFamily: resolveFontId(source.titleFontFamily ?? source.themePreset, fallbackSettings.titleFontFamily || 'ibmplex'),
      titleFontWeight: resolveWeightForSettings(source.titleFontWeight ?? source.alertSound, fallbackSettings.titleFontWeight || 'bold'),
      layoutStyle: source.layoutStyle ?? fallbackSettings.layoutStyle,
      cardStyle: source.cardStyle ?? fallbackSettings.cardStyle,
      borderRadius: normalizeSliderValue(source.borderRadius, fallbackSettings.borderRadius),
      messagePlaceholder: source.messagePlaceholder ?? fallbackSettings.messagePlaceholder,
      animationType: source.animationType ?? fallbackSettings.animationType,
      animationSpeed: normalizeSliderValue(source.animationSpeed, fallbackSettings.animationSpeed),
      animationDuration: normalizeSliderValue(source.animationDuration, fallbackSettings.animationDuration),
      itemSpacing: normalizeSliderValue(source.itemSpacing, fallbackSettings.itemSpacing),
      widgetWidth: normalizeSliderValue(source.widgetWidth, fallbackSettings.widgetWidth),
      widgetHeight: normalizeSliderValue(source.widgetHeight, fallbackSettings.widgetHeight),
      padding: normalizeSliderValue(source.padding, fallbackSettings.padding),
      position: source.position ?? fallbackSettings.position,
      borderEnabled: source.borderEnabled ?? fallbackSettings.borderEnabled,
      borderColor: source.borderColor ?? fallbackSettings.borderColor,
      borderWidth: normalizeSliderValue(source.borderWidth, fallbackSettings.borderWidth),
      shadowEnabled: source.shadowEnabled ?? fallbackSettings.shadowEnabled,
      shadowBlur: normalizeSliderValue(source.shadowBlur, fallbackSettings.shadowBlur),      customCss: source.customCss ?? fallbackSettings.customCss,
      maxEntries: normalizeSliderValue(source.maxEntries, fallbackSettings.maxEntries),
      showName: source.showName ?? fallbackSettings.showName,
      showAmount: source.showAmount ?? fallbackSettings.showAmount,
      showTime: source.showTime ?? fallbackSettings.showTime,
      showMessage: source.showMessage ?? fallbackSettings.showMessage,
      autoScroll: source.autoScroll ?? fallbackSettings.autoScroll,
      scrollSpeed: normalizeSliderValue(source.scrollSpeed, fallbackSettings.scrollSpeed),
      accentColor: source.accentColor ?? fallbackSettings.accentColor,
      backgroundColor: source.backgroundColor ?? fallbackSettings.backgroundColor,
      textColor: source.textColor ?? fallbackSettings.textColor,
      fontSize: normalizeSliderValue(source.fontSize, fallbackSettings.fontSize),
      startAt: toDateInputValue(source.startAt, fallbackSettings.startAt),
      endAt: toDateInputValue(source.endAt, fallbackSettings.endAt),
      alignment: source.alignment ?? 'flex-row',
      isUseStartAt: source.isUseStartAt ?? false,
      isUseEndAt: source.isUseEndAt ?? false,
      amountFallback: amount,
      amountColor: amount.color ?? DEFAULT_TEXT_STYLE.color,
      amountFontSize: normalizeSliderValue(amount.fontSize, [DEFAULT_TEXT_STYLE.fontSize]),
      amountAlignment: amount.alignment ?? DEFAULT_TEXT_STYLE.alignment,
      amountFontFamily: resolveFontId(amount.fontFamily, fallbackSettings.amountFontFamily || DEFAULT_TEXT_STYLE.fontFamily),
      amountFontWeight: resolveWeightForSettings(amount.fontWeight, fallbackSettings.amountFontWeight || DEFAULT_TEXT_STYLE.fontWeight),
      amountStrokeColor: amount.strokeColor ?? DEFAULT_TEXT_STYLE.strokeColor,
      amountStrokeWidth: normalizeSliderValue(amount.strokeWidth, [DEFAULT_TEXT_STYLE.strokeWidth]),
      lastDonatorFallback: lastDonator,
      lastDonatorColor: lastDonator.color ?? DEFAULT_TEXT_STYLE.color,
      lastDonatorFontSize: normalizeSliderValue(lastDonator.fontSize, [DEFAULT_TEXT_STYLE.fontSize]),
      lastDonatorAlignment: lastDonator.alignment ?? DEFAULT_TEXT_STYLE.alignment,
      lastDonatorFontFamily: resolveFontId(lastDonator.fontFamily, fallbackSettings.lastDonatorFontFamily || DEFAULT_TEXT_STYLE.fontFamily),
      lastDonatorFontWeight: resolveWeightForSettings(lastDonator.fontWeight, fallbackSettings.lastDonatorFontWeight || DEFAULT_TEXT_STYLE.fontWeight),
      lastDonatorStrokeColor: lastDonator.strokeColor ?? DEFAULT_TEXT_STYLE.strokeColor,
      lastDonatorStrokeWidth: normalizeSliderValue(lastDonator.strokeWidth, [DEFAULT_TEXT_STYLE.strokeWidth]),
    },
    donations,
  };
};

