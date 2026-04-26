import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Heart, MessageCircle, Share2, Clock, Plus, Pencil, Trash2, Check, X, Image } from "lucide-react";

const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "เมื่อกี้";
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชม.ที่แล้ว`;
  if (diff < 172800) return "เมื่อวาน";
  return `${Math.floor(diff / 86400)} วันที่แล้ว`;
}

let _pid = 0;
const pid = () => `post-${++_pid}`;

// ── DraftForm อยู่นอก component หลัก ไม่ re-create ทุก render ──────────────
function DraftForm({ draft, onTextChange, onImagePick, onImageRemove, onSave, onCancel, isNew }) {
  const fileRef = useRef(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl p-3 border border-white/10 space-y-2.5 mb-4"
      style={{ background: `rgba(${theme.primary},0.06)` }}
    >
      <textarea
        value={draft.text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="พิมพ์ content ที่นี่..."
        rows={3}
        autoFocus
        className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-sky-300/50 transition-all resize-none"
      />

      {draft.image && (
        <div className="relative">
          <img src={draft.image} alt="" className="w-full rounded-lg border border-white/10 object-contain max-h-40" style={{ background: "rgba(0,0,0,0.2)" }} />
          <button
            onClick={onImageRemove}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { onImagePick(e.target.files?.[0]); e.target.value = ""; }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] transition-all"
            style={{ color: `rgba(${theme.primary},0.8)`, background: `rgba(${theme.primary},0.1)`, border: `1px solid rgba(${theme.primary},0.2)` }}
          >
            <Image className="w-3 h-3" />
            รูปภาพ
          </button>
        </div>
        <div className="flex gap-1.5">
          <button onClick={onCancel} className="px-2.5 py-1 rounded-lg text-[10px] text-white/50 hover:text-white hover:bg-white/10 transition-all">
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            disabled={!draft.text.trim()}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-40"
            style={{ background: `rgb(${theme.primary})`, color: "#0c1a2e" }}
          >
            <Check className="w-3 h-3" />
            {isNew ? "โพสต์" : "บันทึก"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="" className="w-full rounded-2xl h-auto object-contain max-h-[80vh]" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DailyContentManager() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null); // null | "new" | post.id
  const [draft, setDraft] = useState({ text: "", image: null });
  const [likedIds, setLikedIds] = useState(new Set());
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const isFull = posts.length >= 3;

  const setDraftText = (text) => setDraft((d) => ({ ...d, text }));
  const setDraftImage = (image) => setDraft((d) => ({ ...d, image }));

  const handleImagePick = (file) => {
    if (!file) return;
    setDraftImage(URL.createObjectURL(file));
  };

  const openNew = () => { setDraft({ text: "", image: null }); setEditingId("new"); };
  const openEdit = (post) => { setDraft({ text: post.text, image: post.image }); setEditingId(post.id); };

  const handleSave = () => {
    if (!draft.text.trim()) return;
    if (editingId === "new") {
      setPosts((prev) => [
        { id: pid(), text: draft.text.trim(), image: draft.image, ts: Date.now(), likes: 0, comments: 0 },
        ...prev,
      ]);
    } else {
      setPosts((prev) =>
        prev.map((p) => p.id === editingId ? { ...p, text: draft.text.trim(), image: draft.image } : p)
      );
    }
    setEditingId(null);
    setDraft({ text: "", image: null });
  };

  const handleCancel = () => { setEditingId(null); setDraft({ text: "", image: null }); };

  const handleDelete = (id) => {
    setPosts((prev) => {
      const post = prev.find((p) => p.id === id);
      if (post?.image?.startsWith("blob:")) URL.revokeObjectURL(post.image);
      return prev.filter((p) => p.id !== id);
    });
    if (editingId === id) setEditingId(null);
  };

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setPosts((p) => p.map((x) => x.id === id ? { ...x, likes: x.likes - 1 } : x));
      } else {
        next.add(id);
        setPosts((p) => p.map((x) => x.id === id ? { ...x, likes: x.likes + 1 } : x));
      }
      return next;
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden p-4 rounded-2xl"
      >
        {/* Glass */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))", backdropFilter: "blur(18px)" }} />

        {/* Gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
          <div className="w-full h-full rounded-2xl" style={{
            background: `linear-gradient(120deg, rgba(${theme.primary},0.6), rgba(${theme.secondary},0.6), rgba(${theme.accent},0.6))`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }} />
        </div>

        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.primary},0.25)` }} />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.secondary},0.25)` }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" style={{ color: `rgb(${theme.secondary})` }} />
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">📝 Content ประจำวัน</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i < posts.length ? `rgb(${theme.primary})` : `rgba(${theme.primary},0.2)`,
                      boxShadow: i < posts.length ? `0 0 4px rgba(${theme.primary},0.8)` : "none",
                    }}
                  />
                ))}
                <span className="text-[10px] text-white/40 ml-1 font-mono">{posts.length}/3</span>
              </div>
              {!isFull && editingId !== "new" && (
                <button onClick={openNew} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* New post form */}
          <AnimatePresence>
            {editingId === "new" && (
              <DraftForm
                draft={draft}
                onTextChange={setDraftText}
                onImagePick={handleImagePick}
                onImageRemove={() => setDraftImage(null)}
                onSave={handleSave}
                onCancel={handleCancel}
                isNew={true}
              />
            )}
          </AnimatePresence>

          {/* Empty state */}
          {posts.length === 0 && editingId !== "new" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex flex-col items-center gap-3 text-white/40">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `rgba(${theme.primary},0.1)` }}>
                <Newspaper className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-xs text-center">
                ยังไม่มี content เลย<br />
                <span className="opacity-60">กด + เพื่อเพิ่ม (สูงสุด 3 โพสต์)</span>
              </p>
            </motion.div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="group"
                >
                  {/* Inline edit form */}
                  <AnimatePresence>
                    {editingId === post.id && (
                      <DraftForm
                        draft={draft}
                        onTextChange={setDraftText}
                        onImagePick={handleImagePick}
                        onImageRemove={() => setDraftImage(null)}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isNew={false}
                      />
                    )}
                  </AnimatePresence>

                  {editingId !== post.id && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                          style={{ background: `linear-gradient(135deg, rgba(${theme.primary},0.4), rgba(${theme.accent},0.4))`, color: "#fff" }}
                        >
                          x8
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white leading-relaxed">{post.text}</p>

                          {/* รูป — สัดส่วนจริง + กดดูขยายได้ */}
                          {post.image && (
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setLightboxSrc(post.image)}
                              className="mt-2 rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                              style={{ background: "rgba(0,0,0,0.2)" }}
                            >
                              <img
                                src={post.image}
                                alt=""
                                className="w-full h-auto block"
                                style={{ maxHeight: "200px", objectFit: "contain" }}
                              />
                            </motion.div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-white/40">
                              <Clock className="w-3 h-3" />{timeAgo(post.ts)}
                            </span>
                            <button
                              onClick={() => toggleLike(post.id)}
                              className="flex items-center gap-1 text-xs transition-all"
                              style={{ color: likedIds.has(post.id) ? "rgb(251,113,133)" : "rgba(255,255,255,0.4)" }}
                            >
                              <Heart className={`w-3 h-3 ${likedIds.has(post.id) ? "fill-current" : ""}`} />
                              {post.likes}
                            </button>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                              <MessageCircle className="w-3 h-3" />{post.comments}
                            </span>
                            <button className="flex items-center gap-1 text-xs text-white/40 hover:text-sky-400 transition-colors">
                              <Share2 className="w-3 h-3" />
                            </button>
                            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => openEdit(post)} className="p-1 rounded text-white/30 hover:text-white hover:bg-white/10 transition-all">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => handleDelete(post.id)} className="p-1 rounded text-white/30 hover:text-red-400 transition-all">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {i < posts.length - 1 && <div className="mt-4 h-px bg-white/10" />}
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      </AnimatePresence>
    </>
  );
}