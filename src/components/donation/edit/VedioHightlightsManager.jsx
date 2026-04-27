"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, Film, Plus, Trash2, Link, X, Loader2, Volume2, VolumeX } from "lucide-react";

const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
};

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

let _vid = 0;
const vid = () => `v-${++_vid}`;

// ── YouTube Modal Player ───────────────────────────────────────────────────────
function VideoModal({ video, onClose }) {
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef(null);

  // ปิดด้วย Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&${muted ? "mute=1" : "mute=0"}&rel=0&modestbranding=1`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ paddingBottom: "56.25%" }}>
          <iframe
            ref={iframeRef}
            key={`${video.youtubeId}-${muted}`} // re-mount เมื่อ mute toggle
            src={src}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Info bar */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{video.title}</p>
            <p className="text-xs text-white/50 truncate">{video.channel}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VideoHighlightsManager() {
  const [videos, setVideos] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [addError, setAddError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);

  const isFull = videos.length >= 4;

  const handleAdd = async () => {
    setAddError("");
    const ytId = extractYouTubeId(urlInput.trim());
    if (!ytId) { setAddError("ลิงค์ไม่ถูกต้อง รองรับเฉพาะ YouTube"); return; }
    if (videos.find((v) => v.youtubeId === ytId)) { setAddError("คลิปนี้มีอยู่แล้ว"); return; }
    if (isFull) { setAddError("เต็มแล้ว (สูงสุด 4 คลิป)"); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
      const data = await res.json();
      if (!data.title) throw new Error("not found");

      setVideos((prev) => [
        ...prev,
        {
          id: vid(),
          youtubeId: ytId,
          title: data.title,
          channel: data.author_name ?? "",
          thumbnail: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
          views: "—",
        },
      ]);
      setUrlInput("");
      setShowAdd(false);
    } catch {
      setAddError("โหลดข้อมูลไม่ได้ ลองใหม่นะ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (playingVideo?.id === id) setPlayingVideo(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" style={{ color: `rgb(${theme.accent})` }} />
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">🎬 Highlight คลิปสั้น</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Counter */}
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i < videos.length ? `rgb(${theme.primary})` : `rgba(${theme.primary},0.2)`,
                      boxShadow: i < videos.length ? `0 0 4px rgba(${theme.primary},0.8)` : "none",
                    }}
                  />
                ))}
                <span className="text-[10px] text-white/40 ml-1 font-mono">{videos.length}/4</span>
              </div>
              {!isFull && (
                <button
                  onClick={() => { setShowAdd(!showAdd); setAddError(""); setUrlInput(""); }}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  {showAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Add panel */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="rounded-xl p-3 border border-white/10 space-y-2" style={{ background: `rgba(${theme.primary},0.06)` }}>
                  <div className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-white/40" />
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">วาง YouTube URL</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                      placeholder="https://youtu.be/..."
                      className="flex-1 bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-300/50 transition-all"
                    />
                    <button
                      onClick={handleAdd}
                      disabled={isLoading || !urlInput.trim()}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 flex items-center gap-1"
                      style={{ background: `rgb(${theme.primary})`, color: "#0c1a2e" }}
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "เพิ่ม"}
                    </button>
                  </div>
                  {addError && <p className="text-[10px] text-red-400">{addError}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {videos.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex flex-col items-center gap-3 text-white/40">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `rgba(${theme.primary},0.1)` }}>
                <Film className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-xs text-center">
                ยังไม่มีคลิปเลย<br />
                <span className="opacity-60">กด + เพื่อเพิ่มจาก YouTube (สูงสุด 4 คลิป)</span>
              </p>
            </motion.div>
          )}

          {/* Video grid */}
          {videos.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
              <AnimatePresence initial={false}>
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-40 group relative"
                  >
                    {/* Thumbnail */}
                    <motion.div
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPlayingVideo(video)}
                      className="relative aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Delete btn — top right corner */}
                    <button
                      onClick={() => handleRemove(video.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Info */}
                    <p className="text-xs font-medium text-white mt-2 truncate">{video.title}</p>
                    <p className="text-[11px] text-white/50 truncate">{video.channel}</p>
                  </motion.div>
                ))}

                {/* Empty slot */}
                {!isFull && videos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowAdd(true)}
                    className="flex-shrink-0 w-40 aspect-video rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 self-start"
                    style={{ background: `rgba(${theme.primary},0.06)`, border: `1.5px dashed rgba(${theme.primary},0.2)` }}
                  >
                    <Plus className="w-5 h-5" style={{ color: `rgba(${theme.primary},0.4)` }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal player */}
      <AnimatePresence>
        {playingVideo && <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />}
      </AnimatePresence>
    </>
  );
}