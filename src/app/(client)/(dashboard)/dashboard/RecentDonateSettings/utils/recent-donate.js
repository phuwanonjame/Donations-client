import { getDefaultRecentDonations, getDefaultSettings } from '../constants/recentDonateOptions';

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

const DEFAULT_TEXT_STYLE = {
  color: '#FFFFFF',
  fontSize: 36,
  alignment: 'center',
  fontFamily: 'IBM Plex Sans Thai',
  fontWeight: '700',
  strokeColor: '#000000',
  strokeWidth: 2.5,
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
      layoutStyle: settings.layoutStyle ?? defaults.layoutStyle,
      themePreset: settings.themePreset ?? defaults.themePreset,
      cardStyle: settings.cardStyle ?? defaults.cardStyle,
      borderRadius: getSliderNumber(settings.borderRadius, getSliderNumber(defaults.borderRadius, 16)),
      messagePlaceholder: settings.messagePlaceholder ?? defaults.messagePlaceholder,
      animationType: settings.animationType ?? defaults.animationType,
      animationSpeed: getSliderNumber(settings.animationSpeed, getSliderNumber(defaults.animationSpeed, 50)),
      animationDuration: getSliderNumber(settings.animationDuration, getSliderNumber(defaults.animationDuration, 700)),
      itemSpacing: getSliderNumber(settings.itemSpacing, getSliderNumber(defaults.itemSpacing, 12)),
      widgetWidth: getSliderNumber(settings.widgetWidth, getSliderNumber(defaults.widgetWidth, 320)),
      widgetHeight: getSliderNumber(settings.widgetHeight, getSliderNumber(defaults.widgetHeight, 420)),
      padding: getSliderNumber(settings.padding, getSliderNumber(defaults.padding, 16)),
      position: settings.position ?? defaults.position,
      borderEnabled: settings.borderEnabled ?? defaults.borderEnabled,
      borderColor: settings.borderColor ?? defaults.borderColor,
      borderWidth: getSliderNumber(settings.borderWidth, getSliderNumber(defaults.borderWidth, 1)),
      shadowEnabled: settings.shadowEnabled ?? defaults.shadowEnabled,
      shadowBlur: getSliderNumber(settings.shadowBlur, getSliderNumber(defaults.shadowBlur, 20)),
      backgroundBlur: settings.backgroundBlur ?? defaults.backgroundBlur,
      backgroundBlurAmount: getSliderNumber(settings.backgroundBlurAmount, getSliderNumber(defaults.backgroundBlurAmount, 10)),
      alertSoundEnabled: settings.alertSoundEnabled ?? defaults.alertSoundEnabled,
      alertSound: settings.alertSound ?? defaults.alertSound,
      customCss: settings.customCss ?? defaults.customCss,
      maxEntries: getSliderNumber(settings.maxEntries, getSliderNumber(defaults.maxEntries, 5)),
      showName: settings.showName ?? defaults.showName,
      showAmount: settings.showAmount ?? defaults.showAmount,
      showTime: settings.showTime ?? defaults.showTime,
      showMessage: settings.showMessage ?? defaults.showMessage,
      autoScroll: settings.autoScroll ?? defaults.autoScroll,
      scrollSpeed: getSliderNumber(settings.scrollSpeed, getSliderNumber(defaults.scrollSpeed, 3)),
      accentColor: settings.accentColor ?? defaults.accentColor,
      backgroundColor: settings.backgroundColor ?? defaults.backgroundColor,
      textColor: settings.textColor ?? defaults.textColor,
      fontSize: getSliderNumber(settings.fontSize, getSliderNumber(defaults.fontSize, 14)),
      amount: createTextStyle(settings, 'amount', amountFallback),
      startAt: settings.isUseStartAt ? toTimestampOrNull(settings.startAt) : null,
      alignment: settings.alignment ?? 'flex-row',
      isUseEndAt: settings.isUseEndAt ?? false,
      lastDonator: createTextStyle(settings, 'lastDonator', lastDonatorFallback),
      isUseStartAt: settings.isUseStartAt ?? false,
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
      layoutStyle: source.layoutStyle ?? fallbackSettings.layoutStyle,
      themePreset: source.themePreset ?? fallbackSettings.themePreset,
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
      shadowBlur: normalizeSliderValue(source.shadowBlur, fallbackSettings.shadowBlur),
      backgroundBlur: source.backgroundBlur ?? fallbackSettings.backgroundBlur,
      backgroundBlurAmount: normalizeSliderValue(source.backgroundBlurAmount, fallbackSettings.backgroundBlurAmount),
      alertSoundEnabled: source.alertSoundEnabled ?? fallbackSettings.alertSoundEnabled,
      alertSound: source.alertSound ?? fallbackSettings.alertSound,
      customCss: source.customCss ?? fallbackSettings.customCss,
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
      amountFontFamily: amount.fontFamily ?? DEFAULT_TEXT_STYLE.fontFamily,
      amountFontWeight: amount.fontWeight ?? DEFAULT_TEXT_STYLE.fontWeight,
      amountStrokeColor: amount.strokeColor ?? DEFAULT_TEXT_STYLE.strokeColor,
      amountStrokeWidth: normalizeSliderValue(amount.strokeWidth, [DEFAULT_TEXT_STYLE.strokeWidth]),
      lastDonatorFallback: lastDonator,
      lastDonatorColor: lastDonator.color ?? DEFAULT_TEXT_STYLE.color,
      lastDonatorFontSize: normalizeSliderValue(lastDonator.fontSize, [DEFAULT_TEXT_STYLE.fontSize]),
      lastDonatorAlignment: lastDonator.alignment ?? DEFAULT_TEXT_STYLE.alignment,
      lastDonatorFontFamily: lastDonator.fontFamily ?? DEFAULT_TEXT_STYLE.fontFamily,
      lastDonatorFontWeight: lastDonator.fontWeight ?? DEFAULT_TEXT_STYLE.fontWeight,
      lastDonatorStrokeColor: lastDonator.strokeColor ?? DEFAULT_TEXT_STYLE.strokeColor,
      lastDonatorStrokeWidth: normalizeSliderValue(lastDonator.strokeWidth, [DEFAULT_TEXT_STYLE.strokeWidth]),
    },
    donations,
  };
};
