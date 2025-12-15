// ในไฟล์: ./components/utils/settingsUtils.js

export const defaultSettings = {
    // ⭐️ System/Root Level Properties (ตาม JSON ตัวอย่าง) ⭐️
    id: "kztqy39d2ojc0qigxzirwgxb",
    userId: "b71ntfee5us5b4p8543jyq5j",
    type: "ALERT",
    createdAt: "2025-12-09T09:27:40.449Z",
    updatedAt: "2025-12-10T12:34:18.530Z",
    token: "9c571d842998b68bade0883fbfc615ab",
    
    // ⭐️ Flat Properties ที่ใช้ใน UI และถูกแปลงใน handleSave ⭐️
    enabled: true,
    volume: [75],
    duration: [5],
    textSize: [24],
    alertSound: "bb_spirit",
    animation: "slide",
    font: "ibmplex",
    fontWeight: "700", // ปรับเป็น 700 ตาม JSON ตัวอย่าง
    textColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: "#000000",
    donorNameColor: "#FF9500",
    amountColor: "#0EA5E9",
    backgroundColor: "transparent",
    showAmount: true,
    showMessage: true,
    showName: true,
    prefixText: "{{user}}",
    suffixText: "โดเนทมา",
    amountText: "{{amount}}฿",
    amountSuffix: "฿",
    minAmountForAlert: 10,
    inAnimation: "fadeInUp",
    inDuration: 1, // วินาที
    outAnimation: "fadeOutUp",
    outDuration: 1, // วินาที
    displayDuration: 3, // วินาที
    ttsVoice: "female",
    ttsRate: 0.5,
    ttsPitch: 0.5,
    ttsEnabled: true, // ปรับเป็น true ตาม JSON ตัวอย่าง
    ttsMessageEnabled: false, // ใช้ key ใหม่ด้านล่างแทน
    ttsVolume: 50,
    useCustomSound: false,
    customSound: null,
    alertImage: "https://i0.wp.com/images.onwardstate.com/uploads/2015/05/oie_14175751vZSQRLEn.gif?fit=650%2C408&ssl=1",
    effect: "realistic_look",
    useRanges: false,
    ranges: [],
    amountShine: true,
    messageFont: "ibmplex",
    messageFontWeight: "500",
    messageFontSize: 24,
    messageColor: "#FFFFFF",
    messageBorderWidth: 2.5,
    messageBorderColor: "#000000",
    ttsTitleEnabled: true,
    ttsMessageEnabledField: true, // Key นี้จะถูกใช้ใน transformSettings
};

export const alertSounds = [
    { id: "chime", name: "Chime" },
    { id: "cash", name: "Cash Register" },
    { id: "bell", name: "Bell Ring" },
    { id: "fanfare", name: "Fanfare" },
    { id: "magic", name: "Magic Sparkle" },
    { id: "custom", name: "Custom Upload" },
];

export const fontOptions = [
    { id: "default", name: "Kanit" },
    { id: "prompt", name: "Prompt" },
    { id: "sarabun", name: "Sarabun" },
    { id: "noto", name: "Noto Sans Thai" },
    { id: "ibmplex", name: "IBM Plex Sans Thai" },
];