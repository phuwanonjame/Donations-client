// ==================== settingsUtils.js ====================

export const defaultSettings = {
  type: "ALERT",
  metadata: {
    type: "main",
    title: {
      text: "{{user}}",
      amountText: "{{amount}}฿",
      amountShine: true,
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
    image:
      "https://i0.wp.com/images.onwardstate.com/uploads/2015/05/oie_14175751vZSQRLEn.gif?fit=650%2C408&ssl=1",
    audio: {
      notification: {
        sound: "bb_spirit",
        useCustom: false,
        customSound: null,
        volume: 75,
      },
      tts: {
        voice: "female",
        rate: 0.5,
        pitch: 0.5,
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

/**
 * แปลง flat range object → grouped structure (เหมือน global metadata แต่มี metadata ของ range เพิ่ม)
 */
function flatRangeToGrouped(range) {
  return {
    // ── Range metadata ────────────────────────────────────
    id:          range.id,
    name:        range.name        ?? `Range #${range.id}`,
    minAmount:   range.minAmount   ?? 0,
    maxAmount:   range.maxAmount   ?? null,
    priority:    range.priority    ?? 0,
    color:       range.color       ?? "#00e5ff",
    isCustomized: range.isCustomized ?? false,

    // ── เหมือน global metadata ────────────────────────────
    title: {
      text:          range.prefixText     ?? "{{user}}",
      amountText:    range.amountText     ?? "{{amount}}฿",
      amountShine:   range.amountShine    ?? true,
      fontFamily:    range.font           ?? "IBM Plex Sans Thai",
      fontWeight:    range.fontWeight     ?? "700",
      fontSize:      getNumVal(range.textSize, 36),
      mainColor:     range.textColor      ?? "#FFFFFF",
      usernameColor: range.donorNameColor ?? "#FF9500",
      amountColor:   range.amountColor    ?? "#0EA5E9",
      strokeWidth:   range.borderWidth    ?? 2.5,
      strokeColor:   range.borderColor    ?? "#000000",
      showName:      range.showName       ?? true,
      showAmount:    range.showAmount     ?? true,
    },
    message: {
      fontFamily:  range.messageFont        ?? "IBM Plex Sans Thai",
      fontWeight:  range.messageFontWeight  ?? "500",
      fontSize:    getNumVal(range.messageFontSize, 24),
      color:       range.messageColor       ?? "#FFFFFF",
      strokeWidth: range.messageBorderWidth ?? 2.5,
      strokeColor: range.messageBorderColor ?? "#000000",
      showMessage: range.showMessage        ?? true,
    },
    animation: {
      enter:   { type: range.inAnimation  ?? "fadeInUp",  duration: (range.inDuration      ?? 1) * 1000 },
      display: { duration: (range.displayDuration ?? 3) * 1000 },
      exit:    { type: range.outAnimation ?? "fadeOutUp", duration: (range.outDuration     ?? 1) * 1000 },
    },
    image: range.alertImage ?? range.image ?? null,
    audio: {
      notification: {
        sound:       range.alertSound     ?? "bb_spirit",
        useCustom:   range.useCustomSound ?? false,
        customSound: range.customSound    ?? null,
        volume:      getNumVal(range.volume, 75),
      },
      tts: {
        voice:   range.ttsVoice  ?? "female",
        rate:    range.ttsRate   ?? 0.5,
        pitch:   range.ttsPitch  ?? 0.5,
        title:   { enabled: range.ttsTitleEnabled        ?? true },
        message: { enabled: range.ttsMessageEnabledField ?? false },
        volume:  getNumVal(range.ttsVolume, 50),
      },
    },
    effect:         range.effect         ?? "realistic_look",
    imageGlow:      range.imageGlow      ?? false,
    showConfetti:   range.showConfetti   ?? false,
    confettiEffect: range.confettiEffect ?? "fountain",
  };
}

/**
 * แปลง grouped range → flat (สำหรับ UI)
 */
function groupedRangeToFlat(r) {
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
    prefixText:     title.text          ?? "{{user}}",
    amountText:     title.amountText    ?? "{{amount}}฿",
    amountShine:    title.amountShine   ?? true,
    font:           title.fontFamily    ?? "IBM Plex Sans Thai",
    fontWeight:     title.fontWeight    ?? "700",
    textSize:       [title.fontSize     ?? 36],
    textColor:      title.mainColor     ?? "#FFFFFF",
    donorNameColor: title.usernameColor ?? "#FF9500",
    amountColor:    title.amountColor   ?? "#0EA5E9",
    borderWidth:    title.strokeWidth   ?? 2.5,
    borderColor:    title.strokeColor   ?? "#000000",
    showName:       title.showName      ?? true,
    showAmount:     title.showAmount    ?? true,

    messageFont:        message.fontFamily  ?? "IBM Plex Sans Thai",
    messageFontWeight:  message.fontWeight  ?? "500",
    messageFontSize:    message.fontSize    ?? 24,
    messageColor:       message.color       ?? "#FFFFFF",
    messageBorderWidth: message.strokeWidth ?? 2.5,
    messageBorderColor: message.strokeColor ?? "#000000",
    showMessage:        message.showMessage ?? true,

    inAnimation:     anim.enter?.type    ?? "fadeInUp",
    inDuration:      (anim.enter?.duration  ?? 1000) / 1000,
    outAnimation:    anim.exit?.type     ?? "fadeOutUp",
    outDuration:     (anim.exit?.duration   ?? 1000) / 1000,
    displayDuration: (anim.display?.duration ?? 3000) / 1000,

    alertImage: r.image ?? null,
    image:      r.image ?? null,
    effect:         r.effect         ?? "realistic_look",
    imageGlow:      r.imageGlow      ?? false,
    showConfetti:   r.showConfetti   ?? false,
    confettiEffect: r.confettiEffect ?? "fountain",

    alertSound:    notif.sound       ?? "bb_spirit",
    volume:        [notif.volume     ?? 75],
    useCustomSound: notif.useCustom  ?? false,
    customSound:   notif.customSound ?? null,

    ttsTitleEnabled:        tts.title?.enabled   ?? true,
    ttsMessageEnabledField: tts.message?.enabled ?? false,
    ttsVoice:  tts.voice ?? "female",
    ttsRate:   tts.rate  ?? 0.5,
    ttsPitch:  tts.pitch ?? 0.5,
    ttsVolume: tts.volume ?? 50,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// transformToGroupedStructure  (flat → grouped, สำหรับ save)
// ─────────────────────────────────────────────────────────────────────────────
export const transformToGroupedStructure = (flatSettings) => {
  // donationRanges ใน flat คือ array ของ flat range objects
  // → แปลงแต่ละ range เป็น grouped structure
  const rangeItems = (flatSettings.donationRanges ?? []).map(flatRangeToGrouped);

  return {
    type: flatSettings.type || "ALERT",
    metadata: {
      type: "main",
      title: {
        text:          flatSettings.prefixText     ?? "{{user}}",
        amountText:    flatSettings.amountText     ?? "{{amount}}฿",
        amountShine:   flatSettings.amountShine    ?? true,
        fontFamily:    flatSettings.font           ?? "IBM Plex Sans Thai",
        fontWeight:    flatSettings.fontWeight     ?? "700",
        fontSize:      getNumVal(flatSettings.textSize, 36),
        mainColor:     flatSettings.textColor      ?? "#FFFFFF",
        usernameColor: flatSettings.donorNameColor ?? "#FF9500",
        amountColor:   flatSettings.amountColor    ?? "#0EA5E9",
        strokeWidth:   flatSettings.borderWidth    ?? 2.5,
        strokeColor:   flatSettings.borderColor    ?? "#000000",
        showName:      flatSettings.showName       ?? true,
        showAmount:    flatSettings.showAmount     ?? true,
      },
      message: {
        fontFamily:  flatSettings.messageFont        ?? "IBM Plex Sans Thai",
        fontWeight:  flatSettings.messageFontWeight  ?? "500",
        fontSize:    getNumVal(flatSettings.messageFontSize, 24),
        color:       flatSettings.messageColor       ?? "#FFFFFF",
        strokeWidth: flatSettings.messageBorderWidth ?? 2.5,
        strokeColor: flatSettings.messageBorderColor ?? "#000000",
        showMessage: flatSettings.showMessage        ?? true,
      },
      animation: {
        enter:   { type: flatSettings.inAnimation  ?? "fadeInUp",  duration: (flatSettings.inDuration      ?? 1) * 1000 },
        display: { duration: (flatSettings.displayDuration ?? 3) * 1000 },
        exit:    { type: flatSettings.outAnimation ?? "fadeOutUp", duration: (flatSettings.outDuration     ?? 1) * 1000 },
      },
      image: flatSettings.alertImage ?? flatSettings.image
        ?? "https://i0.wp.com/images.onwardstate.com/uploads/2015/05/oie_14175751vZSQRLEn.gif?fit=650%2C408&ssl=1",
      audio: {
        notification: {
          sound:       flatSettings.alertSound     ?? "bb_spirit",
          useCustom:   flatSettings.useCustomSound ?? false,
          customSound: flatSettings.customSound    ?? null,
          volume:      getNumVal(flatSettings.volume, 75),
        },
        tts: {
          voice:   flatSettings.ttsVoice ?? "female",
          rate:    flatSettings.ttsRate  ?? 0.5,
          pitch:   flatSettings.ttsPitch ?? 0.5,
          title:   { enabled: flatSettings.ttsTitleEnabled        ?? true },
          message: { enabled: flatSettings.ttsMessageEnabledField ?? false },
          volume:  getNumVal(flatSettings.ttsVolume, 50),
        },
      },
      // ✅ ranges อยู่ใน metadata เหมือนเดิม ไม่แยกออกมา
      ranges: {
        useRanges: flatSettings.useRanges ?? false,
        items:     rangeItems,
      },
      effect:         flatSettings.effect           ?? "realistic_look",
      minimumDonation: flatSettings.minAmountForAlert ?? 10,
      imageGlow:      flatSettings.imageGlow         ?? false,
      showConfetti:   flatSettings.showConfetti      ?? false,
      confettiEffect: flatSettings.confettiEffect    ?? "fountain",
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// transformToFlatStructure  (grouped → flat, สำหรับ load / UI)
// ─────────────────────────────────────────────────────────────────────────────
export const transformToFlatStructure = (groupedSettings) => {
  const metadata     = groupedSettings.metadata    || {};
  const title        = metadata.title              || {};
  const message      = metadata.message            || {};
  const animation    = metadata.animation          || {};
  const audio        = metadata.audio              || {};
  const notification = audio.notification          || {};
  const tts          = audio.tts                   || {};
  const ranges       = metadata.ranges             || {};

  // ✅ แปลง grouped range items → flat range objects
  const flatRanges = (ranges.items ?? []).map(groupedRangeToFlat);

  return {
    id:        groupedSettings.id,
    userId:    groupedSettings.userId,
    type:      groupedSettings.type    || "ALERT",
    createdAt: groupedSettings.createdAt,
    updatedAt: groupedSettings.updatedAt,
    token:     groupedSettings.token,

    enabled: true,

    // ── title ──────────────────────────────────────────────────────────────
    textSize:       [title.fontSize    || 36],
    font:           title.fontFamily   || "IBM Plex Sans Thai",
    fontWeight:     title.fontWeight   || "700",
    textColor:      title.mainColor    || "#FFFFFF",
    donorNameColor: title.usernameColor || "#FF9500",
    amountColor:    title.amountColor  || "#0EA5E9",
    borderWidth:    title.strokeWidth  || 2.5,
    borderColor:    title.strokeColor  || "#000000",
    prefixText:     title.text         || "{{user}}",
    amountText:     title.amountText   || "{{amount}}฿",
    amountSuffix:   "฿",
    amountShine:    title.amountShine  ?? true,
    showName:       title.showName     ?? true,
    showAmount:     title.showAmount   ?? true,

    // ── message ────────────────────────────────────────────────────────────
    messageFont:        message.fontFamily  || "IBM Plex Sans Thai",
    messageFontWeight:  message.fontWeight  || "500",
    messageFontSize:    message.fontSize    || 24,
    messageColor:       message.color       || "#FFFFFF",
    messageBorderWidth: message.strokeWidth || 2.5,
    messageBorderColor: message.strokeColor || "#000000",
    showMessage:        message.showMessage ?? true,

    // ── animation ──────────────────────────────────────────────────────────
    inAnimation:     animation.enter?.type   || "fadeInUp",
    inDuration:      (animation.enter?.duration  || 1000) / 1000,
    outAnimation:    animation.exit?.type    || "fadeOutUp",
    outDuration:     (animation.exit?.duration   || 1000) / 1000,
    displayDuration: (animation.display?.duration || 3000) / 1000,

    // ── image / effect ─────────────────────────────────────────────────────
    alertImage:     metadata.image          || "https://i0.wp.com/images.onwardstate.com/uploads/2015/05/oie_14175751vZSQRLEn.gif?fit=650%2C408&ssl=1",
    image:          metadata.image          || "https://i0.wp.com/images.onwardstate.com/uploads/2015/05/oie_14175751vZSQRLEn.gif?fit=650%2C408&ssl=1",
    effect:         metadata.effect         || "realistic_look",
    imageGlow:      metadata.imageGlow      ?? false,
    showConfetti:   metadata.showConfetti   ?? false,
    confettiEffect: metadata.confettiEffect ?? "fountain",

    // ── audio ──────────────────────────────────────────────────────────────
    alertSound:    notification.sound      || "bb_spirit",
    volume:        [notification.volume    || 75],
    useCustomSound: notification.useCustom || false,
    customSound:   notification.customSound || null,

    ttsEnabled:              tts.title?.enabled ?? true,
    ttsTitleEnabled:         tts.title?.enabled ?? true,
    ttsMessageEnabledField:  tts.message?.enabled ?? false,
    ttsVoice:  tts.voice || "female",
    ttsRate:   tts.rate  || 0.5,
    ttsPitch:  tts.pitch || 0.5,
    ttsVolume: tts.volume || 50,

    // ✅ ranges: useRanges + donationRanges (flat) อยู่ที่ root ของ flat structure
    useRanges:      ranges.useRanges ?? false,
    donationRanges: flatRanges,

    // ── misc ───────────────────────────────────────────────────────────────
    minAmountForAlert: metadata.minimumDonation || 10,
    animation:         "slide",
    ttsMessageEnabled: false,
    duration:          [5],
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
export const alertSounds = [
  { id: "chime",     name: "Chime" },
  { id: "cash",      name: "Cash Register" },
  { id: "bell",      name: "Bell Ring" },
  { id: "fanfare",   name: "Fanfare" },
  { id: "magic",     name: "Magic Sparkle" },
  { id: "bb_spirit", name: "BB Spirit" },
  { id: "custom",    name: "Custom Upload" },
];

export const fontOptions = [
  { id: "Kanit",              name: "Kanit" },
  { id: "Prompt",             name: "Prompt" },
  { id: "Sarabun",            name: "Sarabun" },
  { id: "Noto Sans Thai",     name: "Noto Sans Thai" },
  { id: "IBM Plex Sans Thai", name: "IBM Plex Sans Thai" },
];

export const animationOptions = [
  { id: "fadeIn",       name: "Fade In" },
  { id: "fadeInUp",     name: "Fade In Up" },
  { id: "fadeInDown",   name: "Fade In Down" },
  { id: "slideInLeft",  name: "Slide In Left" },
  { id: "slideInRight", name: "Slide In Right" },
  { id: "zoomIn",       name: "Zoom In" },
  { id: "bounceIn",     name: "Bounce In" },
];

export const effectOptions = [
  { id: "realistic_look", name: "Realistic Look" },
  { id: "cartoon",        name: "Cartoon" },
  { id: "neon",           name: "Neon" },
  { id: "glow",           name: "Glow" },
];

export const voiceOptions = [
  { id: "female", name: "Female" },
  { id: "male",   name: "Male" },
];