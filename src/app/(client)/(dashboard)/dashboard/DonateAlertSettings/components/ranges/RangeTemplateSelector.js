// ==================== RangeTemplateSelector.js ====================
// Quick Templates — แต่ละ template มี config ของตัวเองครบ ไม่ทับกัน
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, Check, Zap } from "lucide-react";
import { fetchAlertRangeThemes } from "@/actions/DonateAlertapi/donateSettingsApi";
import { normalizeFlatSettings } from "../utils/settingsUtils";

/* ─────────────────────────────────────────────
   TEMPLATE DEFINITIONS
   แต่ละ template มี config ครบทุก field
   ใช้ emoji เป็น "รูป" เพื่อไม่ต้องพึ่ง external URL
───────────────────────────────────────────── */
const RAW_RANGE_TEMPLATES = [
  /* ── 1. น้อยใจน่ารัก (1–99฿) ── */
  {
    id: "cute_small",
    name: "น้อยใจน่ารัก",
    emoji: "🐱",
    badge: "1–99฿",
    badgeColor: "#94a3b8",
    desc: "ขอบคุณทุกยอด ไม่ว่าเล็กน้อย",
    color: "#94a3b8",
    preview: {
      bg: "from-slate-600/40 to-slate-700/40",
      border: "border-slate-500/40",
      text: "text-slate-200",
      accent: "text-slate-300",
    },
    config: {
      name: "น้อยใจน่ารัก (1–99฿)",
      minAmount: 1,
      maxAmount: 99,
      priority: 1,
      color: "#94a3b8",
      // sound
      notificationSound: "chime",
      notificationVolume: [55],
      notificationUseCustom: false,
      ttsVoice: "female",
      ttsRate: 1.0,
      ttsPitch: 1.1,
      ttsTitleEnabled: true,
      ttsMessageEnabled: false,
      ttsVolume: 45,
      // animation
      animationEnterType: "fadeInUp",
      animationEnterDuration: 0.6,
      animationExitType: "fadeOut",
      animationExitDuration: 0.5,
      animationDisplayDuration: 3,
      // image
      image: "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif",
      imageGlow: false,
      // text
      titleFontFamily: "Sarabun",
      titleFontWeight: "500",
      titleFontSize: [28],
      titleMainColor: "#e2e8f0",
      titleUsernameColor: "#94a3b8",
      titleAmountColor: "#64748b",
      titleStrokeWidth: 1.5,
      titleStrokeColor: "#1e293b",
      titleText: "{{user}} ",
      titleSuffixText: "ขอบคุณนะ~",
      titleAmountText: "{{amount}}฿",
      titleAmountShine: false,
      // message
      messageFontFamily: "Sarabun",
      messageFontWeight: "400",
      messageFontSize: 18,
      messageColor: "#94a3b8",
      messageStrokeWidth: 1,
      messageStrokeColor: "#0f172a",
      titleShowName: true,
      titleShowAmount: true,
      messageShowMessage: true,
      // effects
      effect: "none",
      showConfetti: false,
      confettiEffect: "fountain",
      backgroundColor: "transparent",
    },
  },

  /* ── 2. สายฟ้า (100–499฿) ── */
  {
    id: "lightning",
    name: "สายฟ้า",
    emoji: "⚡",
    badge: "100–499฿",
    badgeColor: "#facc15",
    desc: "พลังงานสูง animate เร็วแรง",
    color: "#facc15",
    preview: {
      bg: "from-yellow-500/20 to-amber-600/20",
      border: "border-yellow-500/40",
      text: "text-yellow-100",
      accent: "text-yellow-300",
    },
    config: {
      name: "สายฟ้า (100–499฿)",
      minAmount: 100,
      maxAmount: 499,
      priority: 2,
      color: "#facc15",
      notificationSound: "bell",
      notificationVolume: [70],
      notificationUseCustom: false,
      ttsVoice: "female",
      ttsRate: 1.1,
      ttsPitch: 1.0,
      ttsTitleEnabled: true,
      ttsMessageEnabled: true,
      ttsVolume: 60,
      animationEnterType: "bounceIn",
      animationEnterDuration: 0.5,
      animationExitType: "fadeOutUp",
      animationExitDuration: 0.6,
      animationDisplayDuration: 4,
      image: "https://media.tenor.com/WpM1PGKIFRYAAAAM/lightning-thunder.gif",
      imageGlow: true,
      titleFontFamily: "Kanit",
      titleFontWeight: "700",
      titleFontSize: [34],
      titleMainColor: "#fef9c3",
      titleUsernameColor: "#fbbf24",
      titleAmountColor: "#facc15",
      titleStrokeWidth: 2,
      titleStrokeColor: "#78350f",
      titleText: "⚡ {{user}} ",
      titleSuffixText: "ปล่อยสายฟ้า!",
      titleAmountText: "{{amount}}฿",
      titleAmountShine: true,
      messageFontFamily: "Kanit",
      messageFontWeight: "500",
      messageFontSize: 20,
      messageColor: "#fef08a",
      messageStrokeWidth: 1.5,
      messageStrokeColor: "#451a03",
      titleShowName: true,
      titleShowAmount: true,
      messageShowMessage: true,
      effect: "glow",
      showConfetti: false,
      confettiEffect: "blast",
      backgroundColor: "transparent",
    },
  },

  /* ── 3. ราชาไฟ (500–999฿) ── */
  {
    id: "fire_king",
    name: "ราชาไฟ",
    emoji: "🔥",
    badge: "500–999฿",
    badgeColor: "#f97316",
    desc: "ลุกโชนสวย เอฟเฟกต์เต็ม",
    color: "#f97316",
    preview: {
      bg: "from-orange-500/20 to-red-600/20",
      border: "border-orange-500/40",
      text: "text-orange-100",
      accent: "text-orange-300",
    },
    config: {
      name: "ราชาไฟ (500–999฿)",
      minAmount: 500,
      maxAmount: 999,
      priority: 3,
      color: "#f97316",
      notificationSound: "fanfare",
      notificationVolume: [80],
      notificationUseCustom: false,
      ttsVoice: "male",
      ttsRate: 0.9,
      ttsPitch: 0.85,
      ttsTitleEnabled: true,
      ttsMessageEnabled: true,
      ttsVolume: 70,
      animationEnterType: "zoomIn",
      animationEnterDuration: 0.7,
      animationExitType: "bounceOut",
      animationExitDuration: 0.8,
      animationDisplayDuration: 5,
      image: "https://media.tenor.com/BBFNpMM-RUEAAAAM/fire-flame.gif",
      imageGlow: true,
      titleFontFamily: "Prompt",
      titleFontWeight: "800",
      titleFontSize: [38],
      titleMainColor: "#fff7ed",
      titleUsernameColor: "#fb923c",
      titleAmountColor: "#ef4444",
      titleStrokeWidth: 2.5,
      titleStrokeColor: "#7f1d1d",
      titleText: "🔥 {{user}} ",
      titleSuffixText: "จุดไฟแล้ว!",
      titleAmountText: "{{amount}}฿",
      titleAmountShine: true,
      messageFontFamily: "Prompt",
      messageFontWeight: "600",
      messageFontSize: 22,
      messageColor: "#fed7aa",
      messageStrokeWidth: 2,
      messageStrokeColor: "#450a0a",
      titleShowName: true,
      titleShowAmount: true,
      messageShowMessage: true,
      effect: "neon",
      showConfetti: true,
      confettiEffect: "blast",
      backgroundColor: "transparent",
    },
  },

  /* ── 4. Diamond VIP (1000–4999฿) ── */
  {
    id: "diamond_vip",
    name: "Diamond VIP",
    emoji: "💎",
    badge: "1,000–4,999฿",
    badgeColor: "#22d3ee",
    desc: "หรูหรา premium เต็มรูปแบบ",
    color: "#22d3ee",
    preview: {
      bg: "from-cyan-500/20 to-blue-600/20",
      border: "border-cyan-400/50",
      text: "text-cyan-50",
      accent: "text-cyan-300",
    },
    config: {
      name: "Diamond VIP (1K–4.9K฿)",
      minAmount: 1000,
      maxAmount: 4999,
      priority: 4,
      color: "#22d3ee",
      notificationSound: "cash",
      notificationVolume: [85],
      notificationUseCustom: false,
      ttsVoice: "female",
      ttsRate: 0.85,
      ttsPitch: 0.9,
      ttsTitleEnabled: true,
      ttsMessageEnabled: true,
      ttsVolume: 75,
      animationEnterType: "slideInLeft",
      animationEnterDuration: 0.8,
      animationExitType: "fadeOutUp",
      animationExitDuration: 1.0,
      animationDisplayDuration: 6,
      image: "https://media.tenor.com/h9OGbxBqkMEAAAAM/diamond-spinning.gif",
      imageGlow: true,
      titleFontFamily: "IBM Plex Sans Thai",
      titleFontWeight: "700",
      titleFontSize: [40],
      titleMainColor: "#ecfeff",
      titleUsernameColor: "#22d3ee",
      titleAmountColor: "#67e8f9",
      titleStrokeWidth: 2,
      titleStrokeColor: "#083344",
      titleText: "💎 {{user}} ",
      titleSuffixText: "VIP Donation!",
      titleAmountText: "{{amount}}฿",
      titleAmountShine: true,
      messageFontFamily: "IBM Plex Sans Thai",
      messageFontWeight: "500",
      messageFontSize: 22,
      messageColor: "#a5f3fc",
      messageStrokeWidth: 1.5,
      messageStrokeColor: "#0c4a6e",
      titleShowName: true,
      titleShowAmount: true,
      messageShowMessage: true,
      effect: "glow",
      showConfetti: true,
      confettiEffect: "rain",
      backgroundColor: "transparent",
    },
  },

  /* ── 5. LEGENDARY (5000฿+) ── */
  {
    id: "legendary",
    name: "LEGENDARY",
    emoji: "👑",
    badge: "5,000฿+",
    badgeColor: "#a855f7",
    desc: "ระเบิดทุกอย่าง — เต็มสเปก",
    color: "#a855f7",
    preview: {
      bg: "from-purple-600/30 to-pink-600/30",
      border: "border-purple-400/60",
      text: "text-purple-50",
      accent: "text-purple-300",
    },
    config: {
      name: "LEGENDARY (5K+฿)",
      minAmount: 5000,
      maxAmount: null,
      priority: 5,
      color: "#a855f7",
      notificationSound: "fanfare",
      notificationVolume: [100],
      notificationUseCustom: false,
      ttsVoice: "male",
      ttsRate: 0.8,
      ttsPitch: 0.75,
      ttsTitleEnabled: true,
      ttsMessageEnabled: true,
      ttsVolume: 90,
      animationEnterType: "zoomIn",
      animationEnterDuration: 1.0,
      animationExitType: "zoomOut",
      animationExitDuration: 1.0,
      animationDisplayDuration: 8,
      image: "https://media.tenor.com/RR1VXCGW3GYAAAAM/crown-king.gif",
      imageGlow: true,
      titleFontFamily: "Mitr",
      titleFontWeight: "900",
      titleFontSize: [46],
      titleMainColor: "#faf5ff",
      titleUsernameColor: "#c084fc",
      titleAmountColor: "#f0abfc",
      titleStrokeWidth: 3,
      titleStrokeColor: "#3b0764",
      titleText: "👑 {{user}} ",
      titleSuffixText: "LEGENDARY!",
      titleAmountText: "{{amount}}฿",
      titleAmountShine: true,
      messageFontFamily: "Mitr",
      messageFontWeight: "700",
      messageFontSize: 24,
      messageColor: "#e9d5ff",
      messageStrokeWidth: 2.5,
      messageStrokeColor: "#1e0531",
      titleShowName: true,
      titleShowAmount: true,
      messageShowMessage: true,
      effect: "neon",
      showConfetti: true,
      confettiEffect: "spiral",
      backgroundColor: "transparent",
    },
  },

  /* ── 6. Chill Vibes (custom / no limit) ── */
  {
    id: "chill",
    name: "Chill Vibes",
    emoji: "🌊",
    badge: "Custom",
    badgeColor: "#34d399",
    desc: "สบาย ๆ ชิล ๆ ทุกยอด",
    color: "#34d399",
    preview: {
      bg: "from-emerald-500/20 to-teal-600/20",
      border: "border-emerald-400/40",
      text: "text-emerald-50",
      accent: "text-emerald-300",
    },
    config: {
      name: "Chill Vibes",
      minAmount: 0,
      maxAmount: null,
      priority: 10,
      color: "#34d399",
      notificationSound: "chime",
      notificationVolume: [60],
      notificationUseCustom: false,
      ttsVoice: "female",
      ttsRate: 0.9,
      ttsPitch: 1.05,
      ttsTitleEnabled: true,
      ttsMessageEnabled: false,
      ttsVolume: 50,
      animationEnterType: "fadeInDown",
      animationEnterDuration: 1.2,
      animationExitType: "fadeOut",
      animationExitDuration: 1.0,
      animationDisplayDuration: 5,
      image: "https://media.tenor.com/tJn0bA0xgQAAAAAM/wave-ocean.gif",
      imageGlow: false,
      titleFontFamily: "Sarabun",
      titleFontWeight: "400",
      titleFontSize: [30],
      titleMainColor: "#ecfdf5",
      titleUsernameColor: "#6ee7b7",
      titleAmountColor: "#34d399",
      titleStrokeWidth: 1,
      titleStrokeColor: "#064e3b",
      titleText: "🌊 {{user}} ",
      titleSuffixText: "ขอบคุณจ้า",
      titleAmountText: "{{amount}}฿",
      titleAmountShine: false,
      messageFontFamily: "Sarabun",
      messageFontWeight: "300",
      messageFontSize: 19,
      messageColor: "#a7f3d0",
      messageStrokeWidth: 1,
      messageStrokeColor: "#022c22",
      titleShowName: true,
      titleShowAmount: true,
      messageShowMessage: true,
      effect: "shadow",
      showConfetti: false,
      confettiEffect: "fountain",
      backgroundColor: "transparent",
    },
  },
];

export const RANGE_TEMPLATES = RAW_RANGE_TEMPLATES.map((template) => ({
  ...template,
  config: normalizeFlatSettings(template.config),
}));

/* ─────────────────────────────────────────────
   TEMPLATE CARD
───────────────────────────────────────────── */
function normalizeRangeThemeItem(item) {
  const themeConfig = item?.themeConfig || item || {};
  const id = themeConfig.id || item?.name || item?.id;

  if (!id || !themeConfig.config) return null;

  return {
    id,
    name: themeConfig.name || item?.name || id,
    emoji: themeConfig.emoji || "✨",
    badge: themeConfig.badge || "Custom",
    badgeColor: themeConfig.badgeColor || themeConfig.color || "#a855f7",
    desc: themeConfig.desc || "",
    color: themeConfig.color || "#a855f7",
    preview: {
      bg: themeConfig.preview?.bg || "from-purple-600/30 to-pink-600/30",
      border: themeConfig.preview?.border || "border-purple-400/60",
      text: themeConfig.preview?.text || "text-purple-50",
      accent: themeConfig.preview?.accent || "text-purple-300",
    },
    config: themeConfig.config,
  };
}

function buildRangeTemplates(themeItems) {
  return themeItems
    .map(normalizeRangeThemeItem)
    .filter(Boolean)
    .sort((a, b) => {
      const priorityA = Number(a.config?.priority ?? Number.MAX_SAFE_INTEGER);
      const priorityB = Number(b.config?.priority ?? Number.MAX_SAFE_INTEGER);
      return priorityA - priorityB;
    });
}

function TemplateCard({ template, onSelect, isAdded }) {
  const { preview } = template;
  const config = normalizeFlatSettings(template.config);
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isAdded && onSelect(config)}
      className={`
        relative w-full text-left rounded-2xl border overflow-hidden
        bg-gradient-to-br ${preview.bg} ${preview.border}
        transition-all duration-200 group
        ${isAdded ? "opacity-60 cursor-default" : "cursor-pointer hover:shadow-lg hover:shadow-black/30"}
      `}
    >
      {/* Added badge */}
      {isAdded && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full
                        bg-black/50 backdrop-blur-sm text-[10px] text-slate-300">
          <Check className="w-3 h-3" /> Added
        </div>
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Emoji badge */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0
                          bg-black/30 border border-white/10">
            {template.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-bold ${preview.text}`}>{template.name}</span>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/20"
                style={{ background: template.color + "30", color: template.color }}
              >
                {template.badge}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${preview.accent} opacity-80`}>{template.desc}</p>
          </div>
        </div>

        {/* Config preview pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: config.notificationSound,    icon: "🔊" },
            { label: config.animationEnterType,   icon: "▶" },
            { label: config.effect,        icon: "✨" },
            { label: config.showConfetti ? "confetti" : "no confetti", icon: "🎊" },
          ].map((item, i) => (
            <span key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-white/60 flex items-center gap-1">
              <span>{item.icon}</span>
              <span className="font-mono">{item.label}</span>
            </span>
          ))}
        </div>

        {/* Color swatch row */}
        <div className="flex items-center gap-1.5 mt-3">
          {[
            config.titleMainColor,
            config.titleUsernameColor,
            config.titleAmountColor,
            config.messageColor,
          ].map((c, i) => (
            <div key={i}
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ background: c }}
              title={c}
            />
          ))}
          <span className="ml-auto text-[10px] text-white/40 font-mono">
            {config.titleFontFamily}
          </span>
        </div>
      </div>

      {/* Hover CTA */}
      {!isAdded && (
        <div className="absolute inset-x-0 bottom-0 h-8 flex items-center justify-center
                        bg-gradient-to-t from-black/60 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1">
            <Zap className="w-3 h-3" /> ใช้ Template นี้
          </span>
        </div>
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function RangeTemplateSelector({ onSelectTemplate, existingRanges = [] }) {
  const [open, setOpen] = useState(false);
  const [apiTemplates, setApiTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState("");

  const availableTemplates = apiTemplates.length > 0 ? apiTemplates : RANGE_TEMPLATES;

  useEffect(() => {
    let active = true;

    const loadThemes = async () => {
      setTemplatesLoading(true);
      setTemplatesError("");

      const payload = await fetchAlertRangeThemes();
      if (!active) return;

      const templates = buildRangeTemplates(payload?.data || []);
      if (templates.length > 0) {
        setApiTemplates(templates);
      } else {
        setTemplatesError("โหลด Quick Template จาก API ไม่สำเร็จ กำลังใช้ค่า fallback");
      }

      setTemplatesLoading(false);
    };

    loadThemes();

    return () => {
      active = false;
    };
  }, []);

  const isAdded = (templateId) =>
    existingRanges.some(r => r._templateId === templateId);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start sm:items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold text-white">Quick Templates</p>
            <p className="text-[11px] text-slate-400">เพิ่ม Range จาก template สำเร็จรูป — {availableTemplates.length} แบบ</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {templatesLoading ? "loading..." : `${availableTemplates.length} templates`}
          </span>
          {open
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />
          }
        </div>
      </button>

      {/* Template grid */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {templatesError && (
              <div className="mx-3 mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                {templatesError}
              </div>
            )}

            <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templatesLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-36 rounded-2xl border border-slate-700/50 bg-slate-800/40 animate-pulse"
                    />
                  ))
                : availableTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isAdded={isAdded(template.id)}
                      onSelect={(config) => {
                        onSelectTemplate({ ...config, _templateId: template.id });
                        setOpen(false);
                      }}
                    />
                  ))}
            </div>

            <div className="px-4 pb-3 text-[10px] text-slate-600 text-center">
              Template จะถูกเพิ่มเป็น Range ใหม่ — สามารถแก้ไขได้ภายหลัง
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
