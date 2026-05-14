// ==================== settingsUtils.js ====================

import { FALLBACK_TTS_VOICES, resolveTtsVoiceId } from "@/utils/ttsService";
import { SOUND_OPTIONS } from "@/utils/audioSources";

function firstDefined(...values) {
  return values.find((value) => value !== undefined);
}

export const DEFAULT_ALERT_IMAGE =
  "https://i0.wp.com/images.onwardstate.com/uploads/2015/05/oie_14175751vZSQRLEn.gif?fit=650%2C408&ssl=1";
export const DEFAULT_ALERT_MESSAGE = "เล็กพาฟร้องไปไหน เพื่อนรอเล่นเกม";
export const DEFAULT_TITLE_SUFFIX_TEXT = "โดเนทมา";

export const confettiPresets = {
  fountain: {
    count: 56,
    size: [16, 32],
    origin: "center",
    emojis: ["✨","⭐","💎","🎉","🎊","💖","🔥","⚡","🌟","🍬","🍭","👑"],
  },
  rain: {
    count: 60,
    size: [16, 30],
    origin: "top",
    emojis: ["✨","⭐","💎","🎉","🎊","💖","🌟","🍬","🍭"],
  },
  spiral: {
    count: 58,
    size: [16, 31],
    origin: "top",
    emojis: ["✨","⭐","💎","🎊","💖","⚡","🌟","👑"],
  },
  blast: {
    count: 68,
    size: [18, 36],
    origin: "center",
    emojis: ["✨","⭐","💎","🎉","🎊","💖","🔥","⚡","🌟","👑"],
  },
  fireworks: {
    count: 84,
    size: [14, 30],
    origin: "center",
    emojis: ["✨","💥","🎆","🎇","⭐","🌟","⚡","🔥"],
  },
  heart_burst: {
    count: 62,
    size: [18, 34],
    origin: "center",
    emojis: ["💖","💗","💘","💕","💞","✨","⭐"],
  },
  money_rain: {
    count: 72,
    size: [18, 34],
    origin: "top",
    emojis: ["💸","💰","🪙","💵","✨","👑"],
  },
  starfall: {
    count: 76,
    size: [14, 28],
    origin: "top",
    emojis: ["✨","⭐","🌟","💫","✦","✧"],
  },
  portal: {
    count: 70,
    size: [14, 30],
    origin: "center",
    emojis: ["✨","🔮","💫","⭐","🌟","⚡"],
  },
  shockwave: {
    count: 64,
    size: [16, 32],
    origin: "center",
    emojis: ["⚡","✨","💥","🔥","⭐","🌟"],
  },
  snow: {
    count: 70,
    size: [14, 28],
    origin: "top",
    emojis: ["❄️","✦","✨","⭐"],
  },
  bubbles: {
    count: 60,
    size: [16, 34],
    origin: "bottom",
    emojis: ["🫧","○","◌","✨","💎"],
  },
  meteors: {
    count: 58,
    size: [16, 32],
    origin: "top",
    emojis: ["☄️","🔥","⚡","✨","💫"],
  },
  comet: {
    count: 54,
    size: [18, 36],
    origin: "top",
    emojis: ["💫","☄️","✨","⭐","⚡"],
  },
};

export const defaultSettings = {
  type: "ALERT",
  metadata: {
    type: "main",
    title: {
      text: "{{user}}",
      amountText: "{{amount}}฿",
      amountShine: true,
      amountEffect: "sweep",
      fontFamily: "IBM Plex Sans Thai",
      fontWeight: "700",
      fontSize: 36,
      mainColor: "#FFFFFF",
      usernameColor: "#FF9500",
      amountColor: "#0EA5E9",
      strokeWidth: 2.5,
      strokeColor: "#000000",
      showName: true,
      showAmount: true,
    },
    message: {
      fontFamily: "IBM Plex Sans Thai",
      fontWeight: "500",
      fontSize: 24,
      color: "#FFFFFF",
      strokeWidth: 2.5,
      strokeColor: "#000000",
      showMessage: true,
    },
    animation: {
      enter:   { type: "fadeInUp",  duration: 1000 },
      display: { duration: 3000 },
      exit:    { type: "fadeOutUp", duration: 1000 },
    },
    image: DEFAULT_ALERT_IMAGE,
    audio: {
      notification: {
        sound: "bb_spirit",
        useCustom: false,
        customSound: null,
        volume: 75,
      },
      tts: {
        voice: FALLBACK_TTS_VOICES[0].id,
        rate: 0.95,
        pitch: 1.05,
        title:   { enabled: true },
        message: { enabled: false },
        volume: 50,
      },
    },
    ranges: { useRanges: false, items: [] },
    effect: "realistic_look",
    minimumDonation: 10,
    imageGlow: false,
    showConfetti: false,
    confettiEffect: "fountain",
    confettiMode: "classic",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getNumVal(raw, fallback) {
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") return parseInt(raw, 10) || fallback;
  return fallback;
}

const USER_TOKEN = "{{user}}";

function combineTitleText(titleText, titleSuffixText) {
  const base = String(titleText ?? USER_TOKEN);
  const suffix = String(titleSuffixText ?? "").trim();

  if (!suffix) return base;
  if (!base.includes(USER_TOKEN)) return base;
  if (!base.trimEnd().endsWith(USER_TOKEN)) return base;

  return `${base.trimEnd()} ${suffix}`.trim();
}

function splitTitleText(combinedText, fallbackSuffix = "โดเนทมา") {
  const raw = String(combinedText ?? USER_TOKEN);
  const tokenIndex = raw.indexOf(USER_TOKEN);

  if (tokenIndex === -1) {
    return {
      titleText: raw || USER_TOKEN,
      titleSuffixText: fallbackSuffix,
    };
  }

  const splitIndex = tokenIndex + USER_TOKEN.length;
  const prefix = raw.slice(0, splitIndex);
  const suffix = raw.slice(splitIndex).trim();

  return {
    titleText: prefix || USER_TOKEN,
    titleSuffixText: suffix || fallbackSuffix,
  };
}

function normalizeFlatRange(range = {}) {
  const titleParts = splitTitleText(
    firstDefined(range.titleText, range.prefixText, range.title?.text, USER_TOKEN),
    firstDefined(range.titleSuffixText, range.suffixText, range.title?.suffixText, "โดเนทมา")
  );

  return {
    ...range,
    name: range.name,
    minAmount: range.minAmount ?? 0,
    maxAmount: range.maxAmount ?? null,
    priority: range.priority ?? 0,
    color: range.color ?? "#00e5ff",
    isCustomized: range.isCustomized ?? false,

    titleText: titleParts.titleText,
    titleSuffixText: titleParts.titleSuffixText,
    titleAmountText: firstDefined(range.titleAmountText, range.amountText, "{{amount}}฿"),
    titleAmountShine: firstDefined(range.titleAmountShine, range.amountShine, true),
    titleAmountEffect: firstDefined(range.titleAmountEffect, range.amountEffect, (firstDefined(range.titleAmountShine, range.amountShine, true) ? "sweep" : "none")),
    titleTextEffect: firstDefined(range.titleTextEffect, range.effect, "realistic_look"),
    titleFontFamily: firstDefined(range.titleFontFamily, range.font, "IBM Plex Sans Thai"),
    titleFontWeight: firstDefined(range.titleFontWeight, range.fontWeight, "700"),
    titleFontSize: firstDefined(range.titleFontSize, range.textSize, [36]),
    titleMainColor: firstDefined(range.titleMainColor, range.textColor, "#FFFFFF"),
    titleUsernameColor: firstDefined(range.titleUsernameColor, range.donorNameColor, "#FF9500"),
    titleAmountColor: firstDefined(range.titleAmountColor, range.amountColor, "#0EA5E9"),
    titleStrokeWidth: firstDefined(range.titleStrokeWidth, range.borderWidth, 2.5),
    titleStrokeColor: firstDefined(range.titleStrokeColor, range.borderColor, "#000000"),
    titleShowName: firstDefined(range.titleShowName, range.showName, true),
    titleShowAmount: firstDefined(range.titleShowAmount, range.showAmount, true),

    messageText: firstDefined(range.messageText, range.message?.text, ""),
    messageFontFamily: firstDefined(range.messageFontFamily, range.messageFont, "IBM Plex Sans Thai"),
    messageFontWeight: firstDefined(range.messageFontWeight, range.messageFontWeight, "500"),
    messageFontSize: firstDefined(range.messageFontSize, range.messageFontSize, 24),
    messageColor: firstDefined(range.messageColor, range.messageColor, "#FFFFFF"),
    messageStrokeWidth: firstDefined(range.messageStrokeWidth, range.messageBorderWidth, 2.5),
    messageStrokeColor: firstDefined(range.messageStrokeColor, range.messageBorderColor, "#000000"),
    messageShowMessage: firstDefined(range.messageShowMessage, range.showMessage, true),

    animationEnterType: firstDefined(range.animationEnterType, range.inAnimation, "fadeInUp"),
    animationEnterDuration: firstDefined(range.animationEnterDuration, range.inDuration, 1),
    animationExitType: firstDefined(range.animationExitType, range.outAnimation, "fadeOutUp"),
    animationExitDuration: firstDefined(range.animationExitDuration, range.outDuration, 1),
    animationDisplayDuration: firstDefined(range.animationDisplayDuration, range.displayDuration, 3),

    image: firstDefined(range.image, range.alertImage, null),
    notificationSound: firstDefined(range.notificationSound, range.alertSound, "bb_spirit"),
    notificationVolume: firstDefined(range.notificationVolume, range.volume, [75]),
    notificationUseCustom: firstDefined(range.notificationUseCustom, range.useCustomSound, false),
    notificationCustomSound: firstDefined(range.notificationCustomSound, range.customSound, null),

    ttsVoice: firstDefined(range.ttsVoice, resolveTtsVoiceId(range.ttsVoice), FALLBACK_TTS_VOICES[0].id),
    ttsStyleId: range.ttsStyleId ?? null,
    ttsRate: firstDefined(range.ttsRate, 0.95),
    ttsPitch: firstDefined(range.ttsPitch, 1.05),
    ttsTitleEnabled: firstDefined(range.ttsTitleEnabled, true),
    ttsMessageEnabled: firstDefined(range.ttsMessageEnabled, range.ttsMessageEnabledField, false),
    ttsVolume: firstDefined(range.ttsVolume, 50),

    effect: range.effect ?? firstDefined(range.titleTextEffect, "realistic_look"),
    imageGlow: range.imageGlow ?? false,
    showConfetti: range.showConfetti ?? false,
    confettiEffect: range.confettiEffect ?? "fountain",
    confettiMode: range.confettiMode ?? "classic",
    backgroundColor: range.backgroundColor ?? "transparent",
    amountSuffix: range.amountSuffix ?? "฿",
  };
}

export function normalizeFlatSettings(settings = {}) {
  const donationRanges = settings.rangesItems ?? settings.donationRanges ?? [];
  const titleParts = splitTitleText(
    firstDefined(settings.titleText, settings.prefixText, USER_TOKEN),
    firstDefined(settings.titleSuffixText, settings.suffixText, "โดเนทมา")
  );

  return {
    ...settings,
    titleText: titleParts.titleText,
    titleSuffixText: titleParts.titleSuffixText,
    titleAmountText: firstDefined(settings.titleAmountText, settings.amountText, "{{amount}}฿"),
    titleAmountShine: firstDefined(settings.titleAmountShine, settings.amountShine, true),
    titleAmountEffect: firstDefined(settings.titleAmountEffect, settings.amountEffect, (firstDefined(settings.titleAmountShine, settings.amountShine, true) ? "sweep" : "none")),
    titleTextEffect: firstDefined(settings.titleTextEffect, settings.effect, "realistic_look"),
    titleFontFamily: firstDefined(settings.titleFontFamily, settings.font, "IBM Plex Sans Thai"),
    titleFontWeight: firstDefined(settings.titleFontWeight, settings.fontWeight, "700"),
    titleFontSize: firstDefined(settings.titleFontSize, settings.textSize, [36]),
    titleMainColor: firstDefined(settings.titleMainColor, settings.textColor, "#FFFFFF"),
    titleUsernameColor: firstDefined(settings.titleUsernameColor, settings.donorNameColor, "#FF9500"),
    titleAmountColor: firstDefined(settings.titleAmountColor, settings.amountColor, "#0EA5E9"),
    titleStrokeWidth: firstDefined(settings.titleStrokeWidth, settings.borderWidth, 2.5),
    titleStrokeColor: firstDefined(settings.titleStrokeColor, settings.borderColor, "#000000"),
    titleShowName: firstDefined(settings.titleShowName, settings.showName, true),
    titleShowAmount: firstDefined(settings.titleShowAmount, settings.showAmount, true),

    messageText: firstDefined(settings.messageText, ""),
    messageFontFamily: firstDefined(settings.messageFontFamily, settings.messageFont, "IBM Plex Sans Thai"),
    messageFontWeight: firstDefined(settings.messageFontWeight, settings.messageFontWeight, "500"),
    messageFontSize: firstDefined(settings.messageFontSize, 24),
    messageColor: firstDefined(settings.messageColor, "#FFFFFF"),
    messageStrokeWidth: firstDefined(settings.messageStrokeWidth, settings.messageBorderWidth, 2.5),
    messageStrokeColor: firstDefined(settings.messageStrokeColor, settings.messageBorderColor, "#000000"),
    messageShowMessage: firstDefined(settings.messageShowMessage, settings.showMessage, true),

    animationEnterType: firstDefined(settings.animationEnterType, settings.inAnimation, "fadeInUp"),
    animationEnterDuration: firstDefined(settings.animationEnterDuration, settings.inDuration, 1),
    animationExitType: firstDefined(settings.animationExitType, settings.outAnimation, "fadeOutUp"),
    animationExitDuration: firstDefined(settings.animationExitDuration, settings.outDuration, 1),
    animationDisplayDuration: firstDefined(settings.animationDisplayDuration, settings.displayDuration, 3),

    image: firstDefined(settings.image, settings.alertImage, DEFAULT_ALERT_IMAGE),
    notificationSound: firstDefined(settings.notificationSound, settings.alertSound, "bb_spirit"),
    notificationVolume: firstDefined(settings.notificationVolume, settings.volume, [75]),
    notificationUseCustom: firstDefined(settings.notificationUseCustom, settings.useCustomSound, false),
    notificationCustomSound: firstDefined(settings.notificationCustomSound, settings.customSound, null),

    ttsVoice: firstDefined(resolveTtsVoiceId(settings.ttsVoice), settings.ttsVoice, FALLBACK_TTS_VOICES[0].id),
    ttsStyleId: settings.ttsStyleId ?? null,
    ttsRate: firstDefined(settings.ttsRate, 0.95),
    ttsPitch: firstDefined(settings.ttsPitch, 1.05),
    ttsTitleEnabled: firstDefined(settings.ttsTitleEnabled, true),
    ttsMessageEnabled: firstDefined(settings.ttsMessageEnabled, settings.ttsMessageEnabledField, false),
    ttsVolume: firstDefined(settings.ttsVolume, 50),

    rangesUseRanges: firstDefined(settings.rangesUseRanges, settings.useRanges, false),
    rangesItems: donationRanges.map(normalizeFlatRange),

    minimumDonation: firstDefined(settings.minimumDonation, settings.minAmountForAlert, 10),
    effect: settings.effect ?? firstDefined(settings.titleTextEffect, "realistic_look"),
    imageGlow: settings.imageGlow ?? false,
    showConfetti: settings.showConfetti ?? false,
    confettiEffect: settings.confettiEffect ?? "fountain",
    confettiMode: settings.confettiMode ?? "classic",
    backgroundColor: settings.backgroundColor ?? "transparent",
    amountSuffix: settings.amountSuffix ?? "฿",
  };
}

/**
 * แปลง flat range object → grouped structure (เหมือน global metadata แต่มี metadata ของ range เพิ่ม)
 */
function flatRangeToGrouped(range) {
  const normalized = normalizeFlatRange(range);
  return {
    // ── Range metadata ────────────────────────────────────
    id:          normalized.id,
    name:        normalized.name        ?? `Range #${normalized.id}`,
    minAmount:   normalized.minAmount   ?? 0,
    maxAmount:   normalized.maxAmount   ?? null,
    priority:    normalized.priority    ?? 0,
    color:       normalized.color       ?? "#00e5ff",
    isCustomized: normalized.isCustomized ?? false,

    // ── เหมือน global metadata ────────────────────────────
    title: {
      text:          combineTitleText(normalized.titleText, normalized.titleSuffixText),
      amountText:    normalized.titleAmountText,
      amountShine:   normalized.titleAmountShine,
      amountEffect:  normalized.titleAmountEffect,
      fontFamily:    normalized.titleFontFamily,
      fontWeight:    normalized.titleFontWeight,
      fontSize:      getNumVal(normalized.titleFontSize, 36),
      mainColor:     normalized.titleMainColor,
      usernameColor: normalized.titleUsernameColor,
      amountColor:   normalized.titleAmountColor,
      strokeWidth:   normalized.titleStrokeWidth,
      strokeColor:   normalized.titleStrokeColor,
      showName:      normalized.titleShowName,
      showAmount:    normalized.titleShowAmount,
    },
    message: {
      fontFamily:  normalized.messageFontFamily,
      fontWeight:  normalized.messageFontWeight,
      fontSize:    getNumVal(normalized.messageFontSize, 24),
      color:       normalized.messageColor,
      strokeWidth: normalized.messageStrokeWidth,
      strokeColor: normalized.messageStrokeColor,
      showMessage: normalized.messageShowMessage,
    },
    animation: {
      enter:   { type: normalized.animationEnterType,  duration: normalized.animationEnterDuration * 1000 },
      display: { duration: normalized.animationDisplayDuration * 1000 },
      exit:    { type: normalized.animationExitType, duration: normalized.animationExitDuration * 1000 },
    },
    image: normalized.image ?? null,
    audio: {
      notification: {
        sound:       normalized.notificationSound,
        useCustom:   normalized.notificationUseCustom,
        customSound: normalized.notificationCustomSound,
        volume:      getNumVal(normalized.notificationVolume, 75),
      },
      tts: {
        voice:   resolveTtsVoiceId(normalized.ttsVoice) ?? FALLBACK_TTS_VOICES[0].id,
        rate:    normalized.ttsRate,
        pitch:   normalized.ttsPitch,
        title:   { enabled: normalized.ttsTitleEnabled },
        message: { enabled: normalized.ttsMessageEnabled },
        volume:  getNumVal(normalized.ttsVolume, 50),
      },
    },
    effect:         normalized.titleTextEffect,
    imageGlow:      normalized.imageGlow,
    showConfetti:   normalized.showConfetti,
    confettiEffect: normalized.confettiEffect,
    confettiMode:   normalized.confettiMode,
  };
}

/**
 * แปลง grouped range → flat (สำหรับ UI)
 */
function groupedRangeToFlat(r, uiRange = {}) {
  const title   = r.title   || {};
  const message = r.message || {};
  const anim    = r.animation || {};
  const audio   = r.audio   || {};
  const notif   = audio.notification || {};
  const tts     = audio.tts || {};

  return {
    // metadata ของ range
    id:          r.id,
    name:        r.name,
    minAmount:   r.minAmount   ?? 0,
    maxAmount:   r.maxAmount   ?? null,
    priority:    r.priority    ?? 0,
    color:       r.color       ?? "#00e5ff",
    isCustomized: r.isCustomized ?? false,

    // config (เหมือน global flat)
    ...splitTitleText(title.text, title.suffixText ?? "โดเนทมา"),
    titleAmountText:    title.amountText    ?? "{{amount}}฿",
    titleAmountShine:   title.amountShine   ?? true,
    titleAmountEffect:  title.amountEffect ?? uiRange.titleAmountEffect ?? r.titleAmountEffect ?? ((title.amountShine ?? true) ? "sweep" : "none"),
    titleTextEffect:    uiRange.titleTextEffect   ?? r.titleTextEffect   ?? r.effect ?? "realistic_look",
    titleFontFamily:    title.fontFamily    ?? "IBM Plex Sans Thai",
    titleFontWeight:    title.fontWeight    ?? "700",
    titleFontSize:      [title.fontSize     ?? 36],
    titleMainColor:     title.mainColor     ?? "#FFFFFF",
    titleUsernameColor: title.usernameColor ?? "#FF9500",
    titleAmountColor:   title.amountColor   ?? "#0EA5E9",
    titleStrokeWidth:   title.strokeWidth   ?? 2.5,
    titleStrokeColor:   title.strokeColor   ?? "#000000",
    titleShowName:      title.showName      ?? true,
    titleShowAmount:    title.showAmount    ?? true,

    messageText:        message.text        ?? "",
    messageFontFamily:  message.fontFamily  ?? "IBM Plex Sans Thai",
    messageFontWeight:  message.fontWeight  ?? "500",
    messageFontSize:    message.fontSize    ?? 24,
    messageColor:       message.color       ?? "#FFFFFF",
    messageStrokeWidth: message.strokeWidth ?? 2.5,
    messageStrokeColor: message.strokeColor ?? "#000000",
    messageShowMessage: message.showMessage ?? true,

    animationEnterType:     anim.enter?.type    ?? "fadeInUp",
    animationEnterDuration: (anim.enter?.duration  ?? 1000) / 1000,
    animationExitType:      anim.exit?.type     ?? "fadeOutUp",
    animationExitDuration:  (anim.exit?.duration   ?? 1000) / 1000,
    animationDisplayDuration: (anim.display?.duration ?? 3000) / 1000,

    effect:         r.effect         ?? r.titleTextEffect ?? "realistic_look",
    imageGlow:      r.imageGlow      ?? false,
    showConfetti:   r.showConfetti   ?? false,
    confettiEffect: r.confettiEffect ?? "fountain",
    confettiMode:   r.confettiMode   ?? "classic",

    image:        r.image ?? null,
    notificationSound: notif.sound       ?? "bb_spirit",
    notificationVolume: [notif.volume     ?? 75],
    notificationUseCustom: notif.useCustom  ?? false,
    notificationCustomSound: notif.customSound ?? null,

    ttsTitleEnabled:        tts.title?.enabled   ?? true,
    ttsMessageEnabled: tts.message?.enabled ?? false,
    ttsVoice:  resolveTtsVoiceId(tts.voice) ?? FALLBACK_TTS_VOICES[0].id,
    ttsRate:   tts.rate  ?? 0.95,
    ttsPitch:  tts.pitch ?? 1.05,
    ttsVolume: tts.volume ?? 50,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// transformToGroupedStructure  (flat → grouped, สำหรับ save)
// ─────────────────────────────────────────────────────────────────────────────
export const transformToGroupedStructure = (flatSettings) => {
  const normalized = normalizeFlatSettings(flatSettings);
  // donationRanges ใน flat คือ array ของ flat range objects
  // → แปลงแต่ละ range เป็น grouped structure
  const rangeItems = (normalized.rangesItems ?? []).map(flatRangeToGrouped);

  return {
    type: normalized.type || "ALERT",
    metadata: {
      type: "main",
      title: {
        text:          combineTitleText(normalized.titleText, normalized.titleSuffixText),
        amountText:    normalized.titleAmountText,
        amountShine:   normalized.titleAmountShine,
        amountEffect:  normalized.titleAmountEffect,
        fontFamily:    normalized.titleFontFamily,
        fontWeight:    normalized.titleFontWeight,
        fontSize:      getNumVal(normalized.titleFontSize, 36),
        mainColor:     normalized.titleMainColor,
        usernameColor: normalized.titleUsernameColor,
        amountColor:   normalized.titleAmountColor,
        strokeWidth:   normalized.titleStrokeWidth,
        strokeColor:   normalized.titleStrokeColor,
        showName:      normalized.titleShowName,
        showAmount:    normalized.titleShowAmount,
      },
      message: {
        fontFamily:  normalized.messageFontFamily,
        fontWeight:  normalized.messageFontWeight,
        fontSize:    getNumVal(normalized.messageFontSize, 24),
        color:       normalized.messageColor,
        strokeWidth: normalized.messageStrokeWidth,
        strokeColor: normalized.messageStrokeColor,
        showMessage: normalized.messageShowMessage,
      },
      animation: {
        enter:   { type: normalized.animationEnterType,  duration: normalized.animationEnterDuration * 1000 },
        display: { duration: normalized.animationDisplayDuration * 1000 },
        exit:    { type: normalized.animationExitType, duration: normalized.animationExitDuration * 1000 },
      },
      image: normalized.image ?? DEFAULT_ALERT_IMAGE,
      audio: {
        notification: {
          sound:       normalized.notificationSound,
          useCustom:   normalized.notificationUseCustom,
          customSound: normalized.notificationCustomSound,
          volume:      getNumVal(normalized.notificationVolume, 75),
        },
        tts: {
          voice:   resolveTtsVoiceId(normalized.ttsVoice) ?? FALLBACK_TTS_VOICES[0].id,
          rate:    normalized.ttsRate,
          pitch:   normalized.ttsPitch,
          title:   { enabled: normalized.ttsTitleEnabled },
          message: { enabled: normalized.ttsMessageEnabled },
          volume:  getNumVal(normalized.ttsVolume, 50),
        },
      },
      // ✅ ranges อยู่ใน metadata เหมือนเดิม ไม่แยกออกมา
      ranges: {
        useRanges: normalized.rangesUseRanges ?? false,
        items:     rangeItems,
      },
      effect:         normalized.titleTextEffect,
      minimumDonation: normalized.minimumDonation,
      imageGlow:      normalized.imageGlow,
      showConfetti:   normalized.showConfetti,
      confettiEffect: normalized.confettiEffect,
      confettiMode:   normalized.confettiMode,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// transformToFlatStructure  (grouped → flat, สำหรับ load / UI)
// ─────────────────────────────────────────────────────────────────────────────
export const transformToFlatStructure = (groupedSettings) => {
  const ui           = groupedSettings.ui          || {};
  const metadata     = groupedSettings.metadata    || {};
  const title        = metadata.title              || {};
  const message      = metadata.message            || {};
  const animation    = metadata.animation          || {};
  const audio        = metadata.audio              || {};
  const notification = audio.notification          || {};
  const tts          = audio.tts                   || {};
  const ranges       = metadata.ranges             || {};
  const uiRanges     = ui.ranges?.items            || [];
  const uiRangeMap   = new Map(uiRanges.filter((item) => item?.id).map((item) => [item.id, item]));

  // ✅ แปลง grouped range items → flat range objects
  const flatRanges = (ranges.items ?? []).map((rangeItem) =>
    groupedRangeToFlat(rangeItem, uiRangeMap.get(rangeItem?.id) || {})
  );

  return normalizeFlatSettings({
    id:        groupedSettings.id,
    userId:    groupedSettings.userId,
    type:      groupedSettings.type    || "ALERT",
    createdAt: groupedSettings.createdAt,
    updatedAt: groupedSettings.updatedAt,
    token:     groupedSettings.token,

    enabled: true,

    // ── title ──────────────────────────────────────────────────────────────
    ...splitTitleText(title.text, title.suffixText ?? "โดเนทมา"),
    titleAmountText: title.amountText   ?? "{{amount}}฿",
    amountSuffix:   "฿",
    titleAmountShine:    title.amountShine  ?? true,
    titleAmountEffect:   title.amountEffect ?? ui.titleAmountEffect ?? groupedSettings.titleAmountEffect ?? ((title.amountShine ?? true) ? "sweep" : "none"),
    titleTextEffect:     metadata.effect ?? ui.titleTextEffect ?? groupedSettings.titleTextEffect ?? "realistic_look",
    titleFontSize:       [title.fontSize    ?? 36],
    titleFontFamily:           title.fontFamily   ?? "IBM Plex Sans Thai",
    titleFontWeight:     title.fontWeight   ?? "700",
    titleMainColor:      title.mainColor    ?? "#FFFFFF",
    titleUsernameColor: title.usernameColor ?? "#FF9500",
    titleAmountColor:    title.amountColor  ?? "#0EA5E9",
    titleStrokeWidth:    title.strokeWidth  ?? 2.5,
    titleStrokeColor:    title.strokeColor  ?? "#000000",
    titleShowName:       title.showName     ?? true,
    titleShowAmount:     title.showAmount   ?? true,

    // ── message ────────────────────────────────────────────────────────────
    messageText:        message.text        ?? "",
    messageFontFamily:        message.fontFamily  ?? "IBM Plex Sans Thai",
    messageFontWeight:  message.fontWeight  ?? "500",
    messageFontSize:    message.fontSize    ?? 24,
    messageColor:       message.color       ?? "#FFFFFF",
    messageStrokeWidth: message.strokeWidth ?? 2.5,
    messageStrokeColor: message.strokeColor ?? "#000000",
    messageShowMessage:        message.showMessage ?? true,

    // ── animation ──────────────────────────────────────────────────────────
    animationEnterType:     animation.enter?.type   ?? "fadeInUp",
    animationEnterDuration:      (animation.enter?.duration  ?? 1000) / 1000,
    animationExitType:    animation.exit?.type    ?? "fadeOutUp",
    animationExitDuration:     (animation.exit?.duration   ?? 1000) / 1000,
    animationDisplayDuration: (animation.display?.duration ?? 3000) / 1000,

    // ── image / effect ─────────────────────────────────────────────────────
    image:          metadata.image          ?? DEFAULT_ALERT_IMAGE,
    effect:         metadata.effect         ?? "realistic_look",
    imageGlow:      metadata.imageGlow      ?? false,
    showConfetti:   metadata.showConfetti   ?? false,
    confettiEffect: metadata.confettiEffect ?? "fountain",
    confettiMode:   metadata.confettiMode   ?? "classic",

    // ── audio ──────────────────────────────────────────────────────────────
    notificationSound:    notification.sound      ?? "bb_spirit",
    notificationVolume:        [notification.volume    ?? 75],
    notificationUseCustom: notification.useCustom ?? false,
    notificationCustomSound:   notification.customSound ?? null,

    ttsEnabled:              tts.title?.enabled ?? true,
    ttsTitleEnabled:         tts.title?.enabled ?? true,
    ttsMessageEnabled:  tts.message?.enabled ?? false,
    ttsVoice:  resolveTtsVoiceId(tts.voice) ?? FALLBACK_TTS_VOICES[0].id,
    ttsRate:   tts.rate  ?? 0.95,
    ttsPitch:  tts.pitch ?? 1.05,
    ttsVolume: tts.volume ?? 50,

    // ✅ ranges: useRanges + donationRanges (flat) อยู่ที่ root ของ flat structure
    rangesUseRanges:      ranges.useRanges ?? false,
    rangesItems: flatRanges,

    // ── misc ───────────────────────────────────────────────────────────────
    minimumDonation: metadata.minimumDonation ?? 10,
    animation:         "slide",
    duration:          [5],
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
export const alertSounds = SOUND_OPTIONS;

export const fontOptions = [
  { id: "Kanit",              name: "Kanit" },
  { id: "Prompt",             name: "Prompt" },
  { id: "Sarabun",            name: "Sarabun" },
  { id: "Noto Sans Thai",     name: "Noto Sans Thai" },
  { id: "IBM Plex Sans Thai", name: "IBM Plex Sans Thai" },
];

export const enterAnimationOptions = [
  { id: "fadeIn",       name: "Fade In" },
  { id: "fadeInUp",     name: "Fade In Up" },
  { id: "fadeInDown",   name: "Fade In Down" },
  { id: "slideInLeft",  name: "Slide In Left" },
  { id: "slideInRight", name: "Slide In Right" },
  { id: "zoomIn",       name: "Zoom In" },
  { id: "bounceIn",     name: "Bounce In" },
];

export const exitAnimationOptions = [
  { id: "fadeOut",     name: "Fade Out" },
  { id: "fadeOutUp",   name: "Fade Out Up" },
  { id: "fadeOutDown", name: "Fade Out Down" },
  { id: "bounceOut",   name: "Bounce Out" },
  { id: "zoomOut",     name: "Zoom Out" },
];

export const animationOptions = enterAnimationOptions;

export const effectOptions = [
  { id: "realistic_look", name: "Realistic Look", description: "Natural look with subtle depth" },
  { id: "glow",           name: "Glow Effect",    description: "Soft glow around text" },
  { id: "shadow",         name: "Shadow Effect",  description: "Drop shadow for depth" },
  { id: "neon",           name: "Neon Effect",    description: "Bright neon light effect" },
  { id: "none",           name: "No Effect",      description: "No text effect applied" },
];

export const amountEffectOptions = [
  { id: "sweep",   name: "Sweep Shine", description: "A highlight bar sweeps across the amount" },
  { id: "pulse",   name: "Pulse Glow",  description: "Soft bright pulse around the amount" },
  { id: "sparkle", name: "Sparkle Burst", description: "Small sparkles twinkle around the amount" },
  { id: "pop",     name: "Pop Bounce", description: "Subtle bounce and emphasis on the amount" },
  { id: "none",    name: "No Extra Effect", description: "Only base amount styling without extra animation" },
];

export const confettiModeOptions = [
  { id: "classic", name: "Classic (Original animation)" },
  { id: "physics", name: "Physics (Bounce & collision)" },
];

export const confettiEffectOptions = [
  { id: "fountain",    name: "Fountain (Shooting upward)" },
  { id: "rain",        name: "Rain (Falling from top)" },
  { id: "spiral",      name: "Spiral (Spinning around)" },
  { id: "blast",       name: "Blast (Explosive burst)" },
  { id: "fireworks",   name: "Fireworks (Multi burst)" },
  { id: "heart_burst", name: "Heart Burst (Love explosion)" },
  { id: "money_rain",  name: "Money Rain (Coins & cash)" },
  { id: "starfall",    name: "Starfall (Twinkling shower)" },
  { id: "portal",      name: "Portal (Magic vortex)" },
  { id: "shockwave",   name: "Shockwave (Energy ring)" },
  { id: "snow",        name: "Snow Drift (Soft falling)" },
  { id: "bubbles",     name: "Bubbles (Floating upward)" },
  { id: "meteors",     name: "Meteor Shower (Fast diagonal)" },
  { id: "comet",       name: "Comet Trails (Arc streaks)" },
];

export const voiceOptions = [
  ...FALLBACK_TTS_VOICES.map((voice) => ({
    id: voice.id,
    name: `${voice.name} (${voice.locale})`,
  })),
];

export const rangeModalFontOptions = [
  { id: "Inter",      name: "Inter" },
  { id: "Poppins",    name: "Poppins" },
  { id: "Roboto",     name: "Roboto" },
  { id: "Montserrat", name: "Montserrat" },
  { id: "Prompt",     name: "Prompt" },
];

export const fontSizePresetOptions = [
  { id: "text-sm",   name: "Small" },
  { id: "text-base", name: "Medium" },
  { id: "text-xl",   name: "Large" },
  { id: "text-2xl",  name: "Extra Large" },
  { id: "text-4xl",  name: "Huge" },
];

export const gradientOptions = [
  { id: "from-purple-500 to-pink-500",   name: "Purple to Pink" },
  { id: "from-blue-500 to-cyan-500",     name: "Blue to Cyan" },
  { id: "from-green-500 to-emerald-500", name: "Green to Emerald" },
  { id: "from-orange-500 to-red-500",    name: "Orange to Red" },
  { id: "from-yellow-500 to-amber-500",  name: "Yellow to Amber" },
  { id: "from-indigo-500 to-purple-500", name: "Indigo to Purple" },
];

export const animationStyleOptions = [
  { id: "slide-up",   name: "Slide Up" },
  { id: "slide-down", name: "Slide Down" },
  { id: "fade-in",    name: "Fade In" },
  { id: "scale",      name: "Scale" },
  { id: "bounce",     name: "Bounce" },
  { id: "flip",       name: "Flip" },
];

export const positionOptions = [
  { id: "top-center",    name: "Top Center" },
  { id: "top-right",     name: "Top Right" },
  { id: "top-left",      name: "Top Left" },
  { id: "center",        name: "Center" },
  { id: "bottom-center", name: "Bottom Center" },
];

export const imageSizeOptions = [
  { id: "sm", name: "Small (40px)" },
  { id: "md", name: "Medium (60px)" },
  { id: "lg", name: "Large (80px)" },
  { id: "xl", name: "Extra Large (100px)" },
];

export const imageShapeOptions = [
  { id: "circle",  name: "Circle" },
  { id: "rounded", name: "Rounded" },
  { id: "square",  name: "Square" },
];

export const blurOptions = [
  { id: "backdrop-blur-none", name: "No Blur" },
  { id: "backdrop-blur-sm",   name: "Light Blur" },
  { id: "backdrop-blur-md",   name: "Medium Blur" },
  { id: "backdrop-blur-lg",   name: "Heavy Blur" },
];

export function toValueLabelOptions(options = []) {
  return options.map(({ id, name, description }) => ({
    value: id,
    label: name,
    description,
  }));
}

export function buildAlertRenderSettings(settings = {}) {
  const normalized = normalizeFlatSettings(settings);

  return {
    ...normalized,
    titleFontSize: getNumVal(normalized.titleFontSize, 36),
    messageFontSize: getNumVal(normalized.messageFontSize, 24),
    notificationVolume: getNumVal(normalized.notificationVolume, 75),
    titleText: normalized.titleText ?? "{{user}} ",
    titleAmountText: normalized.titleAmountText ?? "{{amount}}฿",
    titleSuffixText: normalized.titleSuffixText ?? DEFAULT_TITLE_SUFFIX_TEXT,
    titleAmountEffect: normalized.titleAmountEffect ?? ((normalized.titleAmountShine ?? true) ? "sweep" : "none"),
    titleTextEffect: normalized.titleTextEffect ?? normalized.effect ?? "realistic_look",
    messageText: normalized.messageText ?? DEFAULT_ALERT_MESSAGE,
    image: normalized.image ?? DEFAULT_ALERT_IMAGE,
    effect: normalized.effect ?? normalized.titleTextEffect ?? "realistic_look",
    confettiEffect: normalized.confettiEffect ?? "fountain",
    confettiMode: normalized.confettiMode ?? "classic",
    showConfetti: normalized.showConfetti ?? false,
    minimumDonation: normalized.minimumDonation ?? 10,
  };
}

export const masterRangeSettingKeys = [
  "notificationSound",
  "notificationVolume",
  "notificationUseCustom",
  "notificationCustomSound",
  "ttsVoice",
  "ttsStyleId",
  "ttsRate",
  "ttsPitch",
  "ttsTitleEnabled",
  "ttsMessageEnabled",
  "ttsVolume",
  "image",
  "animationEnterType",
  "animationEnterDuration",
  "animationExitType",
  "animationExitDuration",
  "animationDisplayDuration",
  "titleFontFamily",
  "titleFontWeight",
  "titleFontSize",
  "titleMainColor",
  "titleUsernameColor",
  "titleAmountColor",
  "titleStrokeWidth",
  "titleStrokeColor",
  "titleText",
  "titleSuffixText",
  "titleAmountText",
  "amountSuffix",
  "titleAmountShine",
  "titleAmountEffect",
  "titleTextEffect",
  "titleShowName",
  "titleShowAmount",
  "messageText",
  "messageFontFamily",
  "messageFontWeight",
  "messageFontSize",
  "messageColor",
  "messageStrokeWidth",
  "messageStrokeColor",
  "messageShowMessage",
  "effect",
  "imageGlow",
  "showConfetti",
  "confettiEffect",
  "confettiMode",
  "backgroundColor",
];

export function buildMasterSettingsSnapshot(settings = {}) {
  const normalized = normalizeFlatSettings(settings);

  return masterRangeSettingKeys.reduce((snapshot, key) => {
    snapshot[key] = normalized[key];
    return snapshot;
  }, {});
}

export function createRangeSettingsFromMaster(settings = {}, overrides = {}) {
  return {
    ...buildMasterSettingsSnapshot(settings),
    isCustomized: false,
    ...overrides,
  };
}
