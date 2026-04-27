"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Gift, Check, Pencil, X } from "lucide-react";

const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
};

const FIELDS = [
  {
    key: "intro",
    label: "แนะนำตัวเอง",
    icon: User,
    emoji: "👋",
    placeholder: "เขียนแนะนำตัวเองที่นี่ เช่น ชื่อ สิ่งที่ชอบสตรีม สไตล์การเล่น...",
    maxLength: 300,
    rows: 4,
  },
  {
    key: "donate",
    label: "ข้อความขอบคุณโดเนท",
    icon: Gift,
    emoji: "💙",
    placeholder: "เขียนข้อความขอบคุณผู้โดเนท เช่น ขอบคุณมากๆ นะครับ ที่ซัพพอร์ต...",
    maxLength: 200,
    rows: 3,
  },
];

function TextCard({ field, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(value);
  const Icon = field.icon;

  const handleSave = () => {
    onSave(input.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInput(value);
    setIsEditing(false);
  };

  return (
    <div
      className="rounded-xl p-4 space-y-3 border border-white/8 transition-all"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(${theme.primary},0.12)` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: `rgb(${theme.primary})` }} />
          </div>
          <span className="text-xs font-medium text-white/70">
            {field.emoji} {field.label}
          </span>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-white/25 hover:text-white/70 hover:bg-white/8 transition-all"
          >
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows}
              maxLength={field.maxLength}
              autoFocus
              className="w-full bg-white/8 border border-white/12 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-sky-300/40 transition-all resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/25 font-mono">
                {input.length}/{field.maxLength}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-white/40 hover:text-white hover:bg-white/8 transition-all"
                >
                  <X className="w-3 h-3" />
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                  style={{ background: `rgb(${theme.primary})`, color: "#0c1a2e" }}
                >
                  <Check className="w-3 h-3" />
                  บันทึก
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {value ? (
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {value}
              </p>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-4 flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-white/10 hover:border-white/20 text-white/25 hover:text-white/50 transition-all"
              >
                <Pencil className="w-4 h-4" />
                <span className="text-[11px]">คลิกเพื่อเพิ่ม{field.label}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfileTextManager({ onSave }) {
  const [texts, setTexts] = useState({ intro: "", donate: "" });

  const handleSave = (key, value) => {
    const next = { ...texts, [key]: value };
    setTexts(next);
    onSave?.(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-4 rounded-2xl"
    >
      {/* Glass */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))", backdropFilter: "blur(18px)" }}
      />

      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
        <div className="w-full h-full rounded-2xl" style={{
          background: `linear-gradient(120deg, rgba(${theme.primary},0.6), rgba(${theme.secondary},0.6), rgba(255,255,255,0.4))`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }} />
      </div>

      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${theme.primary},0.2)` }} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${theme.secondary},0.2)` }} />

      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `rgba(${theme.primary},0.12)` }}>
            <Pencil className="w-3.5 h-3.5" style={{ color: `rgb(${theme.primary})` }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">ข้อความโปรไฟล์</h3>
            <p className="text-[10px] text-white/40">แนะนำตัวและตั้งข้อความโดเนท</p>
          </div>
        </div>

        {FIELDS.map((field) => (
          <TextCard
            key={field.key}
            field={field}
            value={texts[field.key]}
            onSave={(val) => handleSave(field.key, val)}
          />
        ))}
      </div>
    </motion.div>
  );
}