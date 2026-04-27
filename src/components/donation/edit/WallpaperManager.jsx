"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Trash2, Check, X, Upload, Eye } from "lucide-react";

const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
};

// ── Props ──────────────────────────────────────────────────────────────────────
// onSave(url: string | null) — callback เมื่อ save หรือลบภาพ
// currentBg — URL ภาพพื้นหลังปัจจุบัน (optional)

export default function WallpaperManager({ onSave, currentBg = null }) {
  const [saved, setSaved] = useState(currentBg);         // URL ที่ save แล้ว
  const [preview, setPreview] = useState(null);          // blob URL ตอน browse
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileRef = useRef(null);

  const loadFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setShowDeleteConfirm(false);
  };

  const handleFileChange = (e) => { loadFile(e.target.files?.[0]); e.target.value = ""; };

  // Drag & drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  }, [preview]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleSave = () => {
    if (saved?.startsWith("blob:") && saved !== preview) URL.revokeObjectURL(saved);
    setSaved(preview);
    setPreview(null);
    onSave?.(preview);
  };

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleDelete = () => {
    if (saved?.startsWith("blob:")) URL.revokeObjectURL(saved);
    setSaved(null);
    setPreview(null);
    setShowDeleteConfirm(false);
    onSave?.(null);
  };

  const displayBg = preview || saved;
  const isPreviewMode = !!preview;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-5 rounded-2xl"
      style={{ maxWidth: 420 }}
    >
      {/* Glass bg */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))", backdropFilter: "blur(20px)" }}
      />
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
        <div className="w-full h-full rounded-2xl" style={{
          background: `linear-gradient(120deg, rgba(${theme.primary},0.5), rgba(${theme.secondary},0.5), rgba(255,255,255,0.4))`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }} />
      </div>
      {/* Glows */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${theme.primary},0.2)` }} />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${theme.secondary},0.2)` }} />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `rgba(${theme.primary},0.15)` }}>
            <ImagePlus className="w-3.5 h-3.5" style={{ color: `rgb(${theme.primary})` }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">ภาพพื้นหลัง</h3>
            <p className="text-[10px] text-white/40">อัพเดทภาพพื้นหลังของหน้าเว็บ</p>
          </div>
        </div>

        {/* ── Preview area ── */}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative rounded-xl overflow-hidden transition-all duration-200"
          style={{
            height: 200,
            border: isDragging
              ? `2px dashed rgba(${theme.primary},0.8)`
              : displayBg ? "none" : `2px dashed rgba(${theme.primary},0.25)`,
            background: isDragging ? `rgba(${theme.primary},0.08)` : "rgba(0,0,0,0.2)",
          }}
        >
          {/* Background preview */}
          <AnimatePresence mode="wait">
            {displayBg && (
              <motion.img
                key={displayBg}
                src={displayBg}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>

          {/* Overlay on preview image */}
          {displayBg && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          )}

          {/* Preview badge */}
          {isPreviewMode && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <Eye className="w-3 h-3" style={{ color: `rgb(${theme.primary})` }} />
              <span className="text-[10px] text-white/80 font-medium">ตัวอย่าง</span>
            </div>
          )}

          {/* Empty / drag state */}
          {!displayBg && (
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: `rgba(${theme.primary},0.1)`, border: `1px dashed rgba(${theme.primary},0.3)` }}
              >
                <Upload className="w-5 h-5" style={{ color: `rgba(${theme.primary},0.6)` }} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium" style={{ color: `rgba(${theme.primary},0.7)` }}>
                  {isDragging ? "วางรูปที่นี่เลย!" : "คลิกหรือลากรูปมาวาง"}
                </p>
                <p className="text-[10px] text-white/25 mt-0.5">JPG, PNG, WEBP</p>
              </div>
            </button>
          )}

          {/* Change button (when image exists, not in preview) */}
          {saved && !isPreviewMode && (
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white bg-black/55 hover:bg-black/75 backdrop-blur-sm border border-white/10 transition-all"
            >
              <ImagePlus className="w-3 h-3" />
              เปลี่ยนภาพ
            </button>
          )}
        </div>

        {/* ── Action buttons ── */}
        <AnimatePresence mode="wait">
          {isPreviewMode ? (
            // Save / Cancel
            <motion.div
              key="preview-actions"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex gap-2"
            >
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: `rgb(${theme.primary})`, color: "#0c1a2e", boxShadow: `0 0 16px rgba(${theme.primary},0.4)` }}
              >
                <Check className="w-3.5 h-3.5" />
                บันทึกภาพพื้นหลัง
              </button>
            </motion.div>
          ) : saved ? (
            // Delete confirm flow
            <motion.div
              key="saved-actions"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
            >
              <AnimatePresence mode="wait">
                {showDeleteConfirm ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20"
                    style={{ background: "rgba(239,68,68,0.08)" }}
                  >
                    <p className="text-xs text-white/70 flex-1">ยืนยันลบภาพพื้นหลัง?</p>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 rounded-lg text-[11px] text-white/50 hover:bg-white/10 transition-all"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-red-400 bg-red-500/15 hover:bg-red-500/25 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      ลบเลย
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="delete-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-red-400/70 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    ลบภาพพื้นหลัง
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            // No image state — show browse button
            <motion.button
              key="browse-btn"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: `rgba(${theme.primary},0.12)`,
                color: `rgb(${theme.primary})`,
                border: `1px solid rgba(${theme.primary},0.25)`,
              }}
            >
              <Upload className="w-3.5 h-3.5" />
              Browse ภาพพื้นหลัง
            </motion.button>
          )}
        </AnimatePresence>

        {/* Status */}
        <p className="text-center text-[10px] text-white/25">
          {isPreviewMode
            ? "กด 'บันทึก' เพื่อใช้ภาพนี้เป็นพื้นหลัง"
            : saved
            ? "✓ มีภาพพื้นหลังอยู่แล้ว — กด 'เปลี่ยนภาพ' เพื่ออัพเดท"
            : "ยังไม่มีภาพพื้นหลัง"}
        </p>
      </div>
    </motion.div>
  );
}