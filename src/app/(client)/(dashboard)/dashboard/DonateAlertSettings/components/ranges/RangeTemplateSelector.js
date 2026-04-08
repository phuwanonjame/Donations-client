// ==================== RangeTemplateSelector.js ====================
// Quick Templates — แต่ละ template มี config ของตัวเองครบ ไม่ทับกัน
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, Check, Zap } from "lucide-react";

/* ─────────────────────────────────────────────
   TEMPLATE DEFINITIONS
   แต่ละ template มี config ครบทุก field
   ใช้ emoji เป็น "รูป" เพื่อไม่ต้องพึ่ง external URL
───────────────────────────────────────────── */
export const RANGE_TEMPLATES = [
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
      alertSound: "chime",
      volume: [55],
      useCustomSound: false,
      ttsVoice: "female",
      ttsRate: 1.0,
      ttsPitch: 1.1,
      ttsTitleEnabled: true,
      ttsMessageEnabledField: false,
      ttsVolume: 45,
      // animation
      inAnimation: "fadeInUp",
      inDuration: 0.6,
      outAnimation: "fadeOut",
      outDuration: 0.5,
      displayDuration: 3,
      // image
      alertImage: "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif",
      image: "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif",
      imageGlow: false,
      // text
      font: "Sarabun",
      fontWeight: "500",
      textSize: [28],
      textColor: "#e2e8f0",
      donorNameColor: "#94a3b8",
      amountColor: "#64748b",
      borderWidth: 1.5,
      borderColor: "#1e293b",
      prefixText: "{{user}} ",
      suffixText: "ขอบคุณนะ~",
      amountText: "{{amount}}฿",
      amountSuffix: "฿",
      amountShine: false,
      // message
      messageFont: "Sarabun",
      messageFontWeight: "400",
      messageFontSize: 18,
      messageColor: "#94a3b8",
      messageBorderWidth: 1,
      messageBorderColor: "#0f172a",
      showName: true,
      showAmount: true,
      showMessage: true,
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
      alertSound: "bell",
      volume: [70],
      useCustomSound: false,
      ttsVoice: "female",
      ttsRate: 1.1,
      ttsPitch: 1.0,
      ttsTitleEnabled: true,
      ttsMessageEnabledField: true,
      ttsVolume: 60,
      inAnimation: "bounceIn",
      inDuration: 0.5,
      outAnimation: "fadeOutUp",
      outDuration: 0.6,
      displayDuration: 4,
      alertImage: "https://media.tenor.com/WpM1PGKIFRYAAAAM/lightning-thunder.gif",
      image: "https://media.tenor.com/WpM1PGKIFRYAAAAM/lightning-thunder.gif",
      imageGlow: true,
      font: "Kanit",
      fontWeight: "700",
      textSize: [34],
      textColor: "#fef9c3",
      donorNameColor: "#fbbf24",
      amountColor: "#facc15",
      borderWidth: 2,
      borderColor: "#78350f",
      prefixText: "⚡ {{user}} ",
      suffixText: "ปล่อยสายฟ้า!",
      amountText: "{{amount}}฿",
      amountSuffix: "฿",
      amountShine: true,
      messageFont: "Kanit",
      messageFontWeight: "500",
      messageFontSize: 20,
      messageColor: "#fef08a",
      messageBorderWidth: 1.5,
      messageBorderColor: "#451a03",
      showName: true,
      showAmount: true,
      showMessage: true,
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
      alertSound: "fanfare",
      volume: [80],
      useCustomSound: false,
      ttsVoice: "male",
      ttsRate: 0.9,
      ttsPitch: 0.85,
      ttsTitleEnabled: true,
      ttsMessageEnabledField: true,
      ttsVolume: 70,
      inAnimation: "zoomIn",
      inDuration: 0.7,
      outAnimation: "bounceOut",
      outDuration: 0.8,
      displayDuration: 5,
      alertImage: "https://media.tenor.com/BBFNpMM-RUEAAAAM/fire-flame.gif",
      image: "https://media.tenor.com/BBFNpMM-RUEAAAAM/fire-flame.gif",
      imageGlow: true,
      font: "Prompt",
      fontWeight: "800",
      textSize: [38],
      textColor: "#fff7ed",
      donorNameColor: "#fb923c",
      amountColor: "#ef4444",
      borderWidth: 2.5,
      borderColor: "#7f1d1d",
      prefixText: "🔥 {{user}} ",
      suffixText: "จุดไฟแล้ว!",
      amountText: "{{amount}}฿",
      amountSuffix: "฿",
      amountShine: true,
      messageFont: "Prompt",
      messageFontWeight: "600",
      messageFontSize: 22,
      messageColor: "#fed7aa",
      messageBorderWidth: 2,
      messageBorderColor: "#450a0a",
      showName: true,
      showAmount: true,
      showMessage: true,
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
      alertSound: "cash",
      volume: [85],
      useCustomSound: false,
      ttsVoice: "female",
      ttsRate: 0.85,
      ttsPitch: 0.9,
      ttsTitleEnabled: true,
      ttsMessageEnabledField: true,
      ttsVolume: 75,
      inAnimation: "slideInLeft",
      inDuration: 0.8,
      outAnimation: "fadeOutUp",
      outDuration: 1.0,
      displayDuration: 6,
      alertImage: "https://media.tenor.com/h9OGbxBqkMEAAAAM/diamond-spinning.gif",
      image: "https://media.tenor.com/h9OGbxBqkMEAAAAM/diamond-spinning.gif",
      imageGlow: true,
      font: "IBM Plex Sans Thai",
      fontWeight: "700",
      textSize: [40],
      textColor: "#ecfeff",
      donorNameColor: "#22d3ee",
      amountColor: "#67e8f9",
      borderWidth: 2,
      borderColor: "#083344",
      prefixText: "💎 {{user}} ",
      suffixText: "VIP Donation!",
      amountText: "{{amount}}฿",
      amountSuffix: "฿",
      amountShine: true,
      messageFont: "IBM Plex Sans Thai",
      messageFontWeight: "500",
      messageFontSize: 22,
      messageColor: "#a5f3fc",
      messageBorderWidth: 1.5,
      messageBorderColor: "#0c4a6e",
      showName: true,
      showAmount: true,
      showMessage: true,
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
      alertSound: "fanfare",
      volume: [100],
      useCustomSound: false,
      ttsVoice: "male",
      ttsRate: 0.8,
      ttsPitch: 0.75,
      ttsTitleEnabled: true,
      ttsMessageEnabledField: true,
      ttsVolume: 90,
      inAnimation: "zoomIn",
      inDuration: 1.0,
      outAnimation: "zoomOut",
      outDuration: 1.0,
      displayDuration: 8,
      alertImage: "https://media.tenor.com/RR1VXCGW3GYAAAAM/crown-king.gif",
      image: "https://media.tenor.com/RR1VXCGW3GYAAAAM/crown-king.gif",
      imageGlow: true,
      font: "Mitr",
      fontWeight: "900",
      textSize: [46],
      textColor: "#faf5ff",
      donorNameColor: "#c084fc",
      amountColor: "#f0abfc",
      borderWidth: 3,
      borderColor: "#3b0764",
      prefixText: "👑 {{user}} ",
      suffixText: "LEGENDARY!",
      amountText: "{{amount}}฿",
      amountSuffix: "฿",
      amountShine: true,
      messageFont: "Mitr",
      messageFontWeight: "700",
      messageFontSize: 24,
      messageColor: "#e9d5ff",
      messageBorderWidth: 2.5,
      messageBorderColor: "#1e0531",
      showName: true,
      showAmount: true,
      showMessage: true,
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
      alertSound: "chime",
      volume: [60],
      useCustomSound: false,
      ttsVoice: "female",
      ttsRate: 0.9,
      ttsPitch: 1.05,
      ttsTitleEnabled: true,
      ttsMessageEnabledField: false,
      ttsVolume: 50,
      inAnimation: "fadeInDown",
      inDuration: 1.2,
      outAnimation: "fadeOut",
      outDuration: 1.0,
      displayDuration: 5,
      alertImage: "https://media.tenor.com/tJn0bA0xgQAAAAAM/wave-ocean.gif",
      image: "https://media.tenor.com/tJn0bA0xgQAAAAAM/wave-ocean.gif",
      imageGlow: false,
      font: "Sarabun",
      fontWeight: "400",
      textSize: [30],
      textColor: "#ecfdf5",
      donorNameColor: "#6ee7b7",
      amountColor: "#34d399",
      borderWidth: 1,
      borderColor: "#064e3b",
      prefixText: "🌊 {{user}} ",
      suffixText: "ขอบคุณจ้า",
      amountText: "{{amount}}฿",
      amountSuffix: "฿",
      amountShine: false,
      messageFont: "Sarabun",
      messageFontWeight: "300",
      messageFontSize: 19,
      messageColor: "#a7f3d0",
      messageBorderWidth: 1,
      messageBorderColor: "#022c22",
      showName: true,
      showAmount: true,
      showMessage: true,
      effect: "shadow",
      showConfetti: false,
      confettiEffect: "fountain",
      backgroundColor: "transparent",
    },
  },
];

/* ─────────────────────────────────────────────
   TEMPLATE CARD
───────────────────────────────────────────── */
function TemplateCard({ template, onSelect, isAdded }) {
  const { preview } = template;
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isAdded && onSelect(template.config)}
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
            { label: template.config.alertSound,    icon: "🔊" },
            { label: template.config.inAnimation,   icon: "▶" },
            { label: template.config.effect,        icon: "✨" },
            { label: template.config.showConfetti ? "confetti" : "no confetti", icon: "🎊" },
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
            template.config.textColor,
            template.config.donorNameColor,
            template.config.amountColor,
            template.config.messageColor,
          ].map((c, i) => (
            <div key={i}
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ background: c }}
              title={c}
            />
          ))}
          <span className="ml-auto text-[10px] text-white/40 font-mono">
            {template.config.font}
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

  const isAdded = (templateId) =>
    existingRanges.some(r => r._templateId === templateId);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Quick Templates</p>
            <p className="text-[11px] text-slate-400">เพิ่ม Range จาก template สำเร็จรูป — {RANGE_TEMPLATES.length} แบบ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {RANGE_TEMPLATES.length} templates
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
            <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RANGE_TEMPLATES.map(template => (
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