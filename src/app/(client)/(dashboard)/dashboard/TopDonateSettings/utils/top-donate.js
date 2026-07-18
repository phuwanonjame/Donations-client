import { getDefaultSettings } from '../constants/topDonateOptions';
import { thaiGoogleFonts } from '../../DonateAlertSettings/components/utils/fontUtils';

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
  return fallback;
};

export const DEFAULT_DONOR_DATA = {
  name: 'SuperFan123',
  amount: '5,000',
  message: 'Love your content! Keep it up!',
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

const normalizeSliderValue = (value, fallback) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return fallback;
  return [Number(value)];
};

const getFontSizeNumber = (value, fallback = 36) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const createTextStyle = (settings, prefix, fallbackSettings = {}) => ({
  color: settings[`${prefix}Color`] ?? fallbackSettings[`${prefix}Color`],
  fontSize: getFontSizeNumber(settings[`${prefix}FontSize`], getFontSizeNumber(fallbackSettings[`${prefix}FontSize`], 36)),
  alignment: settings[`${prefix}Alignment`] ?? fallbackSettings[`${prefix}Alignment`],
  fontFamily: resolveFontName(settings[`${prefix}FontFamily`] ?? fallbackSettings[`${prefix}FontFamily`]),
  fontWeight: resolveWeightForApi(settings[`${prefix}FontWeight`] ?? fallbackSettings[`${prefix}FontWeight`]),
  strokeColor: settings[`${prefix}StrokeColor`] ?? fallbackSettings[`${prefix}StrokeColor`],
  strokeWidth: getFontSizeNumber(settings[`${prefix}StrokeWidth`], getFontSizeNumber(fallbackSettings[`${prefix}StrokeWidth`], 0)),
});

const TOP_LEVEL_SETTING_KEYS = [
  'enabled',
  'templateVariant',
  'celebrationEffect',
  'title',
  'timeRange',
  'iconGlow',
  'iconType',
  'showIcon',
  'showName',
  'iconShape',
  'textColor',
  'iconBgMode',
  'showAmount',
  'accentColor',
  'iconAnimate',
  'iconBgColor',
  'showMessage',
  'iconBgColor2',
  'iconCustomUrl',
  'backgroundColor',
  'iconBorderColor',
  'iconAnimateStyle',
  'iconGlowIntensity',
  'animationStyle',
];

const pickTopLevelSettings = (source = {}) => TOP_LEVEL_SETTING_KEYS.reduce((picked, key) => {
  if (source[key] !== undefined) picked[key] = source[key];
  return picked;
}, {});

const toTimestampOrNull = (value) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const getSliderNumber = (value, fallback = 0) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeWidgetAlignment = (alignment, fallback = 'stack-center') => {
  const alignmentMap = {
    'stack-center': 'stack-center',
    'stack-left': 'stack-left',
    'stack-right': 'stack-right',
    'stack-reverse-center': 'stack-reverse-center',
    'stack-reverse-left': 'stack-reverse-left',
    'stack-reverse-right': 'stack-reverse-right',
    'row-center': 'row-center',
    'row-left': 'row-left',
    'row-right': 'row-right',
    'row-reverse-center': 'row-reverse-center',
    'row-reverse-left': 'row-reverse-left',
    'row-reverse-right': 'row-reverse-right',
    'flex-col': 'stack-center',
    'flex-row': 'row-center',
    'flex-col-reverse': 'stack-reverse-center',
    'flex-row-reverse': 'row-reverse-center',
  };
  return alignmentMap[alignment] || fallback;
};

export const toMetadata = (settings) => {
  const defaults = getDefaultSettings();

  return {
    type: 'TOP_DONATE',
    metadata: {
      enabled: settings.enabled ?? defaults.enabled,
      templateVariant: settings.templateVariant ?? defaults.templateVariant,
      celebrationEffect: settings.celebrationEffect ?? defaults.celebrationEffect,
      endAt: settings.isUseEndAt ? toTimestampOrNull(settings.endAt) : null,
      title: settings.title ?? defaults.title,
      timeRange: settings.timeRange ?? defaults.timeRange,
      amount: createTextStyle(settings, 'amount', defaults),
      startAt: settings.isUseStartAt ? toTimestampOrNull(settings.startAt) : null,
      iconGlow: settings.iconGlow ?? defaults.iconGlow,
      iconSize: getSliderNumber(settings.iconSize, getSliderNumber(defaults.iconSize, 80)),
      iconType: settings.iconType ?? defaults.iconType,
      showIcon: settings.showIcon ?? defaults.showIcon,
      showName: settings.showName ?? defaults.showName,
      alignment: normalizeWidgetAlignment(settings.alignment ?? defaults.alignment, 'stack-center'),
      iconShape: settings.iconShape ?? defaults.iconShape,
      textColor: settings.textColor ?? defaults.textColor,
      iconBgMode: settings.iconBgMode ?? defaults.iconBgMode,
      iconRadius: getSliderNumber(settings.iconRadius, getSliderNumber(defaults.iconRadius, 16)),
      isUseEndAt: settings.isUseEndAt ?? defaults.isUseEndAt,
      showAmount: settings.showAmount ?? defaults.showAmount,
      topDonator: createTextStyle(settings, 'topDonator', defaults),
      accentColor: settings.accentColor ?? defaults.accentColor,
      iconAnimate: settings.iconAnimate ?? defaults.iconAnimate,
      iconBgColor: settings.iconBgColor ?? defaults.iconBgColor,
      showMessage: settings.showMessage ?? defaults.showMessage,
      iconBgColor2: settings.iconBgColor2 ?? defaults.iconBgColor2,
      isUseStartAt: settings.isUseStartAt ?? defaults.isUseStartAt,
      iconCustomUrl: settings.iconCustomUrl ?? defaults.iconCustomUrl,
      iconImageSize: getSliderNumber(settings.iconImageSize, getSliderNumber(defaults.iconImageSize, 70)),
      titleFontSize: getSliderNumber(settings.titleFontSize, getSliderNumber(defaults.titleFontSize, 14)),
      backgroundColor: settings.backgroundColor ?? defaults.backgroundColor,
      iconBorderColor: settings.iconBorderColor ?? defaults.iconBorderColor,
      iconBorderWidth: getSliderNumber(settings.iconBorderWidth, getSliderNumber(defaults.iconBorderWidth, 0)),
      messageFontSize: getSliderNumber(settings.messageFontSize, getSliderNumber(defaults.messageFontSize, 18)),
      iconAnimateStyle: settings.iconAnimateStyle ?? defaults.iconAnimateStyle,
      iconGlowIntensity: settings.iconGlowIntensity ?? defaults.iconGlowIntensity,
      fontSize: getSliderNumber(settings.fontSize, getSliderNumber(defaults.fontSize, 18)),
      animationStyle: settings.animationStyle ?? defaults.animationStyle,
    },
  };
};

export const fromMetadata = (
  metadata = {},
  fallbackSettings = getDefaultSettings(),
  fallbackDonorData = DEFAULT_DONOR_DATA,
) => {
  const source = metadata.topDonate || metadata;
  const donorSource = metadata.donorData || {};
  const topDonator = metadata.topDonator || {};
  const amount = metadata.amount || {};

  return {
    settings: {
      ...fallbackSettings,
      ...pickTopLevelSettings(source),
      alignment: normalizeWidgetAlignment(source.alignment, fallbackSettings.alignment),
      isUseStartAt: source.isUseStartAt ?? fallbackSettings.isUseStartAt,
      startAt: source.startAt ? new Date(source.startAt).toISOString().slice(0, 16) : fallbackSettings.startAt,
      isUseEndAt: source.isUseEndAt ?? fallbackSettings.isUseEndAt,
      endAt: source.endAt ? new Date(source.endAt).toISOString().slice(0, 16) : fallbackSettings.endAt,
      amountColor: amount.color ?? fallbackSettings.amountColor,
      amountFontSize: normalizeSliderValue(amount.fontSize, fallbackSettings.amountFontSize),
      amountAlignment: amount.alignment ?? fallbackSettings.amountAlignment,
      amountFontFamily: resolveFontId(amount.fontFamily, fallbackSettings.amountFontFamily),
      amountFontWeight: resolveWeightForSettings(amount.fontWeight, fallbackSettings.amountFontWeight),
      amountStrokeColor: amount.strokeColor ?? fallbackSettings.amountStrokeColor,
      amountStrokeWidth: normalizeSliderValue(amount.strokeWidth, fallbackSettings.amountStrokeWidth),
      topDonatorColor: topDonator.color ?? fallbackSettings.topDonatorColor,
      topDonatorFontSize: normalizeSliderValue(topDonator.fontSize, fallbackSettings.topDonatorFontSize),
      topDonatorAlignment: topDonator.alignment ?? fallbackSettings.topDonatorAlignment,
      topDonatorFontFamily: resolveFontId(topDonator.fontFamily, fallbackSettings.topDonatorFontFamily),
      topDonatorFontWeight: resolveWeightForSettings(topDonator.fontWeight, fallbackSettings.topDonatorFontWeight),
      topDonatorStrokeColor: topDonator.strokeColor ?? fallbackSettings.topDonatorStrokeColor,
      topDonatorStrokeWidth: normalizeSliderValue(topDonator.strokeWidth, fallbackSettings.topDonatorStrokeWidth),
      iconRadius: normalizeSliderValue(source.iconRadius, fallbackSettings.iconRadius),
      iconSize: normalizeSliderValue(source.iconSize, fallbackSettings.iconSize),
      iconImageSize: normalizeSliderValue(source.iconImageSize, fallbackSettings.iconImageSize),
      iconBorderWidth: normalizeSliderValue(source.iconBorderWidth, fallbackSettings.iconBorderWidth),
      fontSize: normalizeSliderValue(source.fontSize, fallbackSettings.fontSize),
      titleFontSize: normalizeSliderValue(source.titleFontSize, fallbackSettings.titleFontSize),
      messageFontSize: normalizeSliderValue(source.messageFontSize, fallbackSettings.messageFontSize),
    },
    donorData: {
      ...fallbackDonorData,
      ...donorSource,
    },
  };
};

