import { thaiGoogleFonts } from "../../DonateAlertSettings/components/utils/fontUtils";

const FONT_WEIGHT_TO_API = {
  normal: "400",
  medium: "500",
  bold: "700",
  extrabold: "800",
};

const FONT_WEIGHT_FROM_API = {
  "400": "normal",
  "500": "medium",
  "700": "bold",
  "800": "extrabold",
};

const resolveFontName = (fontValue, fallback = "IBM Plex Sans Thai") => {
  if (!fontValue) return fallback;
  const matchedById = thaiGoogleFonts.find((font) => font.id === fontValue);
  return matchedById?.name || fontValue;
};

export const resolveFontCssFamily = (fontValue, fallback = "'IBM Plex Sans Thai', sans-serif") => {
  if (!fontValue) return fallback;

  const normalized = String(fontValue).trim().toLowerCase();
  const matched = thaiGoogleFonts.find((font) =>
    font.id.toLowerCase() === normalized ||
    font.name.toLowerCase() === normalized ||
    font.cssFamily.toLowerCase() === normalized
  );

  return matched?.cssFamily || fontValue || fallback;
};

export const resolveFontLoadFamily = (fontValue, fallback = "IBM Plex Sans Thai") => {
  if (!fontValue) return fallback;

  const normalized = String(fontValue).trim().toLowerCase();
  const matched = thaiGoogleFonts.find((font) =>
    font.id.toLowerCase() === normalized ||
    font.name.toLowerCase() === normalized ||
    font.cssFamily.toLowerCase() === normalized
  );

  return matched?.name || fontValue || fallback;
};

const resolveFontId = (fontValue, fallback = "ibmplex") => {
  if (!fontValue) return fallback;
  const normalized = String(fontValue).trim().toLowerCase();
  const matched = thaiGoogleFonts.find((font) =>
    font.id.toLowerCase() === normalized || font.name.toLowerCase() === normalized
  );
  return matched?.id || fallback;
};

const resolveWeightForApi = (weight, fallback = "700") => {
  if (!weight) return fallback;
  return FONT_WEIGHT_TO_API[weight] || String(weight);
};

const resolveWeightForSettings = (weight, fallback = "bold") => {
  if (!weight) return fallback;
  return FONT_WEIGHT_FROM_API[String(weight)] || String(weight);
};

const toPxString = (value, fallback) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? `${parsed}px` : fallback;
};

const toNumber = (value, fallback) => {
  const parsed = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildDefaultGoalDateRange = () => {
  const startAt = Date.now();
  const endAt = startAt + (30 * 24 * 60 * 60 * 1000);
  return { startAt, endAt };
};

export const createDefaultGoalMetadata = () => {
  const { startAt, endAt } = buildDefaultGoalDateRange();

  return {
    type: "large",
    goal: {
      name: "à¸„à¹ˆà¸²à¸­à¸²à¸«à¸²à¸£à¸«à¸¡à¸²",
      amount: 100,
      showAmount: true,
      color: "#FFFFFF",
      fontSize: 36,
      fontFamily: "IBM Plex Sans Thai",
      fontWeight: "700",
      strokeColor: "#000000",
      strokeWidth: 2.5,
    },
    progress: {
      text: "{{amount}}à¸¿ ({{percentage}}%)",
      color: "#0EA5E9",
      shine: true,
      shineEffect: "sweep",
      skin: "custom",
      gradientFrom: "#38BDF8",
      gradientVia: "#818CF8",
      gradientTo: "#F472B6",
      fontFamily: "IBM Plex Sans Thai",
      barHeight: 32,
      largeTopFontSize: 30,
      largeTopRightText: "{{amount}}à¸¿/{{goal}}à¸¿",
      largeBottomFontSize: 20,
      largeBottomLeftText: "à¸ªà¸´à¹‰à¸™à¸ªà¸¸à¸”à¹ƒà¸™ {{days}} à¸§à¸±à¸™",
      largeBottomRightText: "{{percentage}}%",
    },
    description: {
      color: "#FFFFFF",
      fontSize: 24,
      leftText: "à¸ˆà¸²à¸à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢ {{amount}}à¸¿",
      rightText: "à¸ªà¸´à¹‰à¸™à¸ªà¸¸à¸”à¹ƒà¸™ {{days}} à¸§à¸±à¸™",
      fontFamily: "IBM Plex Sans Thai",
      fontWeight: "500",
      strokeColor: "#000000",
      strokeWidth: 2.5,
    },
    isUseStartAt: true,
    startAt,
    isUseEndAt: true,
    endAt,
  };
};

export const createDefaultGoalWidgetPayload = () => ({
  type: "GOAL",
  metadata: createDefaultGoalMetadata(),
});

export const toThaiDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear() + 543;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const fromThaiDate = (thaiDateString) => {
  if (!thaiDateString) return "";
  const parts = thaiDateString.trim().split(" ");
  const datePart = parts[0];
  const timePart = parts[1] || "00:00";
  const [day, month, thaiYear] = datePart.split("/");
  if (!day || !month || !thaiYear) return "";

  const year = parseInt(thaiYear, 10) - 543;
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}T${timePart}`;
};

export const resolveText = (template, data) => {
  if (!template) return "";

  return template
    .replace(/{{amount}}/g, data.amount?.toString() || "0")
    .replace(/{{goal}}/g, data.goal?.toString() || "0")
    .replace(/{{percentage}}/g, data.percentage?.toFixed(1) || "0")
    .replace(/{{days}}/g, data.days?.toString() || "0");
};

export const calculatePercentage = (current, goal) => {
  if (!goal || goal <= 0) return 0;
  return Math.min((current / goal) * 100, 100);
};

export const toMetadata = (settings) => ({
  type: "GOAL",
  metadata: {
    type: settings.type,
    goal: {
      name: settings.goalName,
      color: settings.goalColor,
      amount: toNumber(settings.goalAmount, 0),
      fontSize: toNumber(settings.goalFontSize, 36),
      fontFamily: resolveFontName(settings.goalFontFamily),
      fontWeight: resolveWeightForApi(settings.goalFontWeight),
      showAmount: settings.showGoalAmount ?? true,
      strokeColor: settings.goalStrokeColor,
      strokeWidth: toNumber(settings.goalStrokeWidth, 2.5),
    },
    progress: {
      text: settings.progressText,
      color: settings.progressColor,
      shine: settings.progressShine,
      shineEffect: settings.progressShineEffect || "sweep",
      skin: settings.progressSkin || "custom",
      gradientFrom: settings.progressGradientFrom || "#38BDF8",
      gradientVia: settings.progressGradientVia || "#818CF8",
      gradientTo: settings.progressGradientTo || "#F472B6",
      fontFamily: resolveFontName(settings.progressFontFamily),
      barHeight: toNumber(settings.progressBarHeight, 32),
      largeTopFontSize: toNumber(settings.largeTopFontSize, 30),
      largeTopRightText: settings.largeTopRightText,
      largeBottomFontSize: toNumber(settings.largeBottomFontSize, 20),
      largeBottomLeftText: settings.largeBottomLeftText,
      largeBottomRightText: settings.largeBottomRightText,
    },
    isUseEndAt: settings.isUseEndAt,
    description: {
      color: settings.descriptionColor,
      fontSize: toNumber(settings.descriptionFontSize, 24),
      leftText: settings.descriptionLeftText,
      rightText: settings.descriptionRightText,
      fontFamily: resolveFontName(settings.descriptionFontFamily),
      fontWeight: resolveWeightForApi(settings.descriptionFontWeight, "500"),
      strokeColor: settings.descriptionStrokeColor,
      strokeWidth: toNumber(settings.descriptionStrokeWidth, 2.5),
    },
    isUseStartAt: settings.isUseStartAt,
    startAt: new Date(settings.startAt).getTime(),
    endAt: new Date(settings.endAt).getTime(),
  },
});

export const fromMetadata = (metadata, fallbackSettings = {}) => {
  const goal = metadata?.goal || {};
  const progress = metadata?.progress || {};
  const description = metadata?.description || {};

  return {
    ...fallbackSettings,
    type: metadata?.type ?? fallbackSettings.type,
    goalName: goal.name ?? fallbackSettings.goalName,
    goalAmount: toNumber(goal.amount, fallbackSettings.goalAmount),
    showGoalAmount: goal.showAmount ?? fallbackSettings.showGoalAmount,
    goalFontFamily: resolveFontId(goal.fontFamily, fallbackSettings.goalFontFamily || "ibmplex"),
    goalFontWeight: resolveWeightForSettings(goal.fontWeight, fallbackSettings.goalFontWeight || "bold"),
    goalFontSize: toPxString(goal.fontSize, fallbackSettings.goalFontSize),
    goalColor: goal.color ?? fallbackSettings.goalColor,
    goalStrokeWidth: toPxString(goal.strokeWidth, fallbackSettings.goalStrokeWidth),
    goalStrokeColor: goal.strokeColor ?? fallbackSettings.goalStrokeColor,
    progressText: progress.text ?? fallbackSettings.progressText,
    progressColor: progress.color ?? fallbackSettings.progressColor,
    progressFontFamily: resolveFontId(progress.fontFamily, fallbackSettings.progressFontFamily || "ibmplex"),
    progressShine: progress.shine ?? fallbackSettings.progressShine,
    progressShineEffect: progress.shineEffect ?? fallbackSettings.progressShineEffect ?? "sweep",
    progressSkin: progress.skin ?? fallbackSettings.progressSkin ?? "custom",
    progressGradientFrom: progress.gradientFrom ?? fallbackSettings.progressGradientFrom ?? "#38BDF8",
    progressGradientVia: progress.gradientVia ?? fallbackSettings.progressGradientVia ?? "#818CF8",
    progressGradientTo: progress.gradientTo ?? fallbackSettings.progressGradientTo ?? "#F472B6",
    progressBarHeight: toNumber(progress.barHeight, fallbackSettings.progressBarHeight ?? 32),
    largeTopFontSize: toPxString(progress.largeTopFontSize, fallbackSettings.largeTopFontSize),
    largeBottomFontSize: toPxString(progress.largeBottomFontSize, fallbackSettings.largeBottomFontSize),
    largeTopRightText: progress.largeTopRightText ?? fallbackSettings.largeTopRightText,
    largeBottomLeftText: progress.largeBottomLeftText ?? fallbackSettings.largeBottomLeftText,
    largeBottomRightText: progress.largeBottomRightText ?? fallbackSettings.largeBottomRightText,
    descriptionLeftText: description.leftText ?? fallbackSettings.descriptionLeftText,
    descriptionRightText: description.rightText ?? fallbackSettings.descriptionRightText,
    descriptionFontFamily: resolveFontId(description.fontFamily, fallbackSettings.descriptionFontFamily || "sarabun"),
    descriptionFontWeight: resolveWeightForSettings(description.fontWeight, fallbackSettings.descriptionFontWeight || "medium"),
    descriptionFontSize: toPxString(description.fontSize, fallbackSettings.descriptionFontSize),
    descriptionColor: description.color ?? fallbackSettings.descriptionColor,
    descriptionStrokeWidth: toPxString(description.strokeWidth, fallbackSettings.descriptionStrokeWidth),
    descriptionStrokeColor: description.strokeColor ?? fallbackSettings.descriptionStrokeColor,
    isUseStartAt: metadata?.isUseStartAt ?? fallbackSettings.isUseStartAt,
    startAt: metadata?.startAt ? new Date(metadata.startAt).toISOString().slice(0, 16) : fallbackSettings.startAt,
    isUseEndAt: metadata?.isUseEndAt ?? fallbackSettings.isUseEndAt,
    endAt: metadata?.endAt ? new Date(metadata.endAt).toISOString().slice(0, 16) : fallbackSettings.endAt,
    currentAmount: fallbackSettings.currentAmount,
  };
};

export const getResetDates = () => {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    startAt: now.toISOString().slice(0, 16),
    endAt: end.toISOString().slice(0, 16),
  };
};

export const calculateDaysRemaining = (endDate, isUseEndAt) => {
  if (!isUseEndAt) return 0;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

