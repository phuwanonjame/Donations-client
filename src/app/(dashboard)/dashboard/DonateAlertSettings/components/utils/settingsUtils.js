// ในไฟล์: ./components/utils/settingsUtils.js

// ★ ไม่มี id↔family mapping อีกต่อไป
//   font และ messageFont เก็บเป็น family string ตลอด เช่น "IBM Plex Sans Thai"
//   ทั้งใน flat structure และ grouped structure (metadata.title.fontFamily)

export const defaultSettings = {
  type: "ALERT",
  metadata: {
    type: "main",
    title: {
      text: "{{user}} โดเนทมา",
      amountText: "{{amount}}฿",
      amountShine: true,
      fontFamily: "IBM Plex Sans Thai",   // ★ family string
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
      fontFamily: "IBM Plex Sans Thai",   // ★ family string
      fontWeight: "500",
      fontSize: 24,
      color: "#FFFFFF",
      strokeWidth: 2.5,
      strokeColor: "#000000",
      showMessage: true,
    },
    animation: {
      enter:   { type: "fadeInUp",   duration: 1000 },
      display: { duration: 3000 },
      exit:    { type: "fadeOutUp",  duration: 1000 },
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
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// transformToGroupedStructure  (flat → grouped, สำหรับ save)
// ─────────────────────────────────────────────────────────────────────────────
export const transformToGroupedStructure = (flatSettings) => {
  return {
    type: flatSettings.type || "ALERT",
    metadata: {
      type: "main",
      title: {
        text:         flatSettings.prefixText     ?? "{{user}} โดเนทมา",
        amountText:   flatSettings.amountText      ?? "{{amount}}฿",
        amountShine:  flatSettings.amountShine     ?? true,
        // ★ font คือ family string แล้ว — ส่งตรงๆ
        fontFamily:   flatSettings.font            ?? "IBM Plex Sans Thai",
        fontWeight:   flatSettings.fontWeight      ?? "700",
        fontSize:     getNumVal(flatSettings.textSize, 36),
        mainColor:    flatSettings.textColor       ?? "#FFFFFF",
        usernameColor: flatSettings.donorNameColor ?? "#FF9500",
        amountColor:  flatSettings.amountColor     ?? "#0EA5E9",
        strokeWidth:  flatSettings.borderWidth     ?? 2.5,
        strokeColor:  flatSettings.borderColor     ?? "#000000",
        showName:     flatSettings.showName        ?? true,
        showAmount:   flatSettings.showAmount      ?? true,
      },
      message: {
        // ★ messageFont คือ family string แล้ว — ส่งตรงๆ
        fontFamily:   flatSettings.messageFont        ?? "IBM Plex Sans Thai",
        fontWeight:   flatSettings.messageFontWeight  ?? "500",
        fontSize:     getNumVal(flatSettings.messageFontSize, 24),
        color:        flatSettings.messageColor       ?? "#FFFFFF",
        strokeWidth:  flatSettings.messageBorderWidth ?? 2.5,
        strokeColor:  flatSettings.messageBorderColor ?? "#000000",
        showMessage:  flatSettings.showMessage        ?? true,
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
          voice: flatSettings.ttsVoice ?? "female",
          rate:  flatSettings.ttsRate  ?? 0.5,
          pitch: flatSettings.ttsPitch ?? 0.5,
          title:   { enabled: flatSettings.ttsTitleEnabled        ?? true },
          message: { enabled: flatSettings.ttsMessageEnabledField ?? false },
          volume:  getNumVal(flatSettings.ttsVolume, 50),
        },
      },
      ranges: {
        useRanges: flatSettings.useRanges ?? false,
        items:     transformRanges(flatSettings.ranges ?? []),
      },
      effect:            flatSettings.effect           ?? "realistic_look",
      minimumDonation:   flatSettings.minAmountForAlert ?? 10,
      // ★ pass-through เพิ่มเติม
      imageGlow:         flatSettings.imageGlow         ?? false,
      showConfetti:      flatSettings.showConfetti      ?? false,
      confettiEffect:    flatSettings.confettiEffect    ?? "fountain",
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
    // ★ font = family string โดยตรง (ไม่แปลงเป็น id)
    font:           title.fontFamily   || "IBM Plex Sans Thai",
    fontWeight:     title.fontWeight   || "700",
    textColor:      title.mainColor    || "#FFFFFF",
    donorNameColor: title.usernameColor || "#FF9500",
    amountColor:    title.amountColor  || "#0EA5E9",
    borderWidth:    title.strokeWidth  || 2.5,
    borderColor:    title.strokeColor  || "#000000",
    prefixText:     title.text         || "{{user}} โดเนทมา",
    amountText:     title.amountText   || "{{amount}}฿",
    amountSuffix:   "฿",
    amountShine:    title.amountShine  ?? true,
    showName:       title.showName     ?? true,
    showAmount:     title.showAmount   ?? true,

    // ── message ────────────────────────────────────────────────────────────
    // ★ messageFont = family string โดยตรง
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

    // ── ranges ─────────────────────────────────────────────────────────────
    useRanges: ranges.useRanges || false,
    ranges:    ranges.items     || [],

    // ── misc ───────────────────────────────────────────────────────────────
    minAmountForAlert: metadata.minimumDonation || 10,
    animation:         "slide",
    ttsMessageEnabled: false,
    duration:          [5],
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/** อ่านค่าตัวเลขจาก number | number[] */
function getNumVal(raw, fallback) {
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") return parseInt(raw, 10) || fallback;
  return fallback;
}

/** แปลง ranges flat → grouped (เก็บ family string ตรงๆ) */
const transformRanges = (ranges) => {
  if (!Array.isArray(ranges)) return [];

  return ranges.map((range) => ({
    id:    range.id,
    start: range.start || 0,
    end:   range.end   || 10,
    title: {
      text:          range.prefixText        || range.title?.text          || "{{user}} โดเนทมา",
      amountText:    range.amountText        || range.title?.amountText    || "{{amount}}฿",
      amountShine:   range.amountShine       ?? range.title?.amountShine   ?? true,
      // ★ family string ตรงๆ
      fontFamily:    range.font              || range.title?.fontFamily    || "IBM Plex Sans Thai",
      fontWeight:    range.fontWeight        || range.title?.fontWeight    || "700",
      fontSize:      getNumVal(range.textSize, range.title?.fontSize || 36),
      mainColor:     range.textColor         || range.title?.mainColor     || "#FFFFFF",
      usernameColor: range.donorNameColor    || range.title?.usernameColor || "#FF9500",
      amountColor:   range.amountColor       || range.title?.amountColor   || "#0EA5E9",
      strokeWidth:   range.borderWidth       || range.title?.strokeWidth   || 2.5,
      strokeColor:   range.borderColor       || range.title?.strokeColor   || "#000000",
      showName:      range.showName          ?? range.title?.showName      ?? true,
      showAmount:    range.showAmount        ?? range.title?.showAmount    ?? true,
    },
    message: {
      // ★ family string ตรงๆ
      fontFamily:  range.messageFont         || range.message?.fontFamily  || "IBM Plex Sans Thai",
      fontWeight:  range.messageFontWeight   || range.message?.fontWeight  || "500",
      fontSize:    range.messageFontSize     || range.message?.fontSize    || 24,
      color:       range.messageColor        || range.message?.color       || "#FFFFFF",
      strokeWidth: range.messageBorderWidth  || range.message?.strokeWidth || 2.5,
      strokeColor: range.messageBorderColor  || range.message?.strokeColor || "#000000",
      showMessage: range.showMessage         ?? range.message?.showMessage  ?? true,
    },
    animation: {
      enter:   { type: range.inAnimation  || range.animation?.enter?.type  || "fadeInUp",  duration: (range.inDuration      || (range.animation?.enter?.duration   || 1000) / 1000) * 1000 },
      display: { duration: (range.displayDuration  || (range.animation?.display?.duration  || 3000) / 1000) * 1000 },
      exit:    { type: range.outAnimation || range.animation?.exit?.type   || "fadeOutUp", duration: (range.outDuration     || (range.animation?.exit?.duration    || 1000) / 1000) * 1000 },
    },
    image: range.alertImage || range.image,
    audio: {
      notification: {
        sound:       range.alertSound     || range.audio?.notification?.sound       || "bb_spirit",
        useCustom:   range.useCustomSound || range.audio?.notification?.useCustom   || false,
        customSound: range.customSound    || range.audio?.notification?.customSound || null,
        volume:      getNumVal(range.volume, range.audio?.notification?.volume      || 75),
      },
      tts: {
        voice:   range.ttsVoice  || range.audio?.tts?.voice  || "female",
        rate:    range.ttsRate   || range.audio?.tts?.rate   || 0.5,
        pitch:   range.ttsPitch  || range.audio?.tts?.pitch  || 0.5,
        title:   { enabled: range.ttsTitleEnabled        ?? range.audio?.tts?.title?.enabled   ?? true },
        message: { enabled: range.ttsMessageEnabledField ?? range.audio?.tts?.message?.enabled ?? false },
        volume:  range.ttsVolume || range.audio?.tts?.volume || 50,
      },
    },
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports (คงไว้เพื่อ backward-compat กับไฟล์ที่ import อยู่)
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

// ★ fontOptions เปลี่ยนเป็น family string เป็น id (เพื่อ backward-compat)
//   แต่ถ้าไฟล์อื่นใช้ fontOptions ให้ระวัง — ค่า id ตอนนี้คือ family string
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