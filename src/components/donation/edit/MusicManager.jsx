"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Plus,
  Trash2,
  Link,
  X,
  Loader2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatSeconds(sec) {
  if (!isFinite(sec) || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function MusicPlayer() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Add-track panel
  const [showAdd, setShowAdd] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [addError, setAddError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const progressInterval = useRef(null);
  const apiReady = useRef(false);

  // ── Load YouTube IFrame API ────────────────────────────────────────────────
  useEffect(() => {
    if (window.YT) { apiReady.current = true; return; }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => { apiReady.current = true; };
  }, []);

  // ── Create / replace player when track changes ─────────────────────────────
  const initPlayer = useCallback((videoId) => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const container = playerContainerRef.current;
    if (!container || !apiReady.current) return;

    const div = document.createElement("div");
    container.innerHTML = "";
    container.appendChild(div);

    playerRef.current = new window.YT.Player(div, {
      height: "1",
      width: "1",
      videoId,
      playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1 },
      events: {
        onReady: (e) => {
          e.target.setVolume(volume);
          if (isMuted) e.target.mute();
          setDuration(e.target.getDuration());
          setIsPlaying(true);
          startProgressTick();
        },
        onStateChange: (e) => {
          const { PLAYING, ENDED } = window.YT.PlayerState;
          if (e.data === PLAYING) {
            setIsPlaying(true);
            setDuration(e.target.getDuration());
            startProgressTick();
          } else {
            setIsPlaying(false);
            stopProgressTick();
          }
          if (e.data === ENDED) {
            setCurrentTrack((prev) =>
              playlist.length > 1 ? (prev + 1) % playlist.length : prev
            );
          }
        },
      },
    });
  }, [volume, isMuted, playlist.length]); // eslint-disable-line

  useEffect(() => {
    if (playlist[currentTrack]) {
      const waitForApi = () => {
        if (apiReady.current) {
          initPlayer(playlist[currentTrack].youtubeId);
        } else {
          setTimeout(waitForApi, 200);
        }
      };
      waitForApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, playlist]);

  // ── Progress ticker ────────────────────────────────────────────────────────
  const startProgressTick = () => {
    stopProgressTick();
    progressInterval.current = setInterval(() => {
      if (playerRef.current) {
        const cur = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        if (dur > 0) setProgress((cur / dur) * 100);
      }
    }, 500);
  };

  const stopProgressTick = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  useEffect(() => () => stopProgressTick(), []);

  // ── Controls ──────────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) { playerRef.current.pauseVideo(); }
    else { playerRef.current.playVideo(); }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () =>
    setCurrentTrack((p) => (p + 1) % playlist.length);
  const prevTrack = () =>
    setCurrentTrack((p) => (p - 1 + playlist.length) % playlist.length);

  const handleVolumeChange = (val) => {
    setVolume(val);
    setIsMuted(val === 0);
    playerRef.current?.setVolume(val);
    if (val === 0) playerRef.current?.mute();
    else playerRef.current?.unMute();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) { playerRef.current.unMute(); playerRef.current.setVolume(volume); }
    else { playerRef.current.mute(); }
    setIsMuted(!isMuted);
  };

  const handleSeek = (val) => {
    if (!playerRef.current) return;
    const dur = playerRef.current.getDuration();
    playerRef.current.seekTo((val / 100) * dur, true);
    setProgress(val);
  };

  // ── Add track ─────────────────────────────────────────────────────────────
  const handleAddTrack = async () => {
    setAddError("");
    const ytId = extractYouTubeId(urlInput.trim());
    if (!ytId) { setAddError("ลิงค์ไม่ถูกต้อง ลองใหม่นะ 🧊"); return; }
    if (playlist.find((t) => t.youtubeId === ytId)) {
      setAddError("เพลงนี้อยู่ใน playlist แล้ว"); return;
    }
    if (playlist.length >= 3) { setAddError("playlist เต็มแล้ว (สูงสุด 3 เพลง)"); return; }

    setIsLoading(true);
    try {
      // Fetch video title via noembed (no API key needed)
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
      const data = await res.json();
      const title = data.title ?? "Unknown Title";
      const author = data.author_name ?? "Unknown Artist";
      const thumbnail = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;

      const newTrack = {
        id: `${ytId}-${Date.now()}`,
        title,
        artist: author,
        duration: "--:--",
        youtubeId: ytId,
        thumbnail,
      };
      setPlaylist((prev) => [...prev, newTrack]);
      setCurrentTrack(playlist.length); // index ของเพลงใหม่ = ความยาวก่อนเพิ่ม
      setProgress(0);
      setUrlInput("");
      setShowAdd(false);
    } catch {
      setAddError("โหลดข้อมูลไม่ได้ ลองใหม่นะ");
    } finally {
      setIsLoading(false);
    }
  };

  const removeTrack = (index) => {
    setPlaylist((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (currentTrack >= next.length) setCurrentTrack(Math.max(0, next.length - 1));
      return next;
    });
    if (playlist.length === 1) {
      playerRef.current?.stopVideo();
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const track = playlist[currentTrack];
  const currentTime = playerRef.current
    ? formatSeconds((progress / 100) * playerRef.current.getDuration())
    : "0:00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={
        {
          "--primary": theme.primary,
          "--secondary": theme.secondary,
          "--accent": theme.accent,
        }
      }
      className="relative overflow-hidden p-4 rounded-2xl backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-[1.02] max-w-sm w-full"
    >
      {/* Hidden YouTube player */}
      <div ref={playerContainerRef} className="absolute w-0 h-0 overflow-hidden pointer-events-none" />


      {/* Glass background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      />

      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
        <div
          className="w-full h-full rounded-2xl"
          style={{
            background: `linear-gradient(120deg, rgba(${theme.primary},0.6), rgba(${theme.secondary},0.6), rgba(${theme.accent},0.6))`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      </div>

      {/* Glow BG */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.primary},0.25)` }} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.secondary},0.25)` }} />

      {/* ── Content ── */}
      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" style={{ color: `rgb(${theme.primary})` }} />
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Now Playing</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Counter */}
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i < playlist.length
                      ? `rgb(${theme.primary})`
                      : `rgba(${theme.primary},0.2)`,
                    boxShadow: i < playlist.length
                      ? `0 0 4px rgba(${theme.primary},0.8)`
                      : "none",
                  }}
                />
              ))}
              <span className="text-[10px] text-white/40 ml-1 font-mono">
                {playlist.length}/3
              </span>
            </div>
            {playlist.length < 3 && (
              <button
                onClick={() => { setShowAdd(!showAdd); setAddError(""); setUrlInput(""); }}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                {showAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* ── Add track panel ── */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div
                className="rounded-xl p-3 border border-white/10"
                style={{ background: "rgba(186,230,253,0.08)" }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Link className="w-3 h-3 text-white/50" />
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">วาง YouTube URL</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTrack()}
                    placeholder="https://youtu.be/..."
                    className="flex-1 bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-300/50 transition-all"
                  />
                  <button
                    onClick={handleAddTrack}
                    disabled={isLoading || !urlInput.trim()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                    style={{
                      background: `rgb(${theme.primary})`,
                      color: "#0c1a2e",
                      boxShadow: `0 0 10px rgba(${theme.primary},0.6)`,
                    }}
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "เพิ่ม"}
                  </button>
                </div>
                {addError && (
                  <p className="text-[10px] text-red-400 mt-1.5 ml-0.5">{addError}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {playlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 flex flex-col items-center gap-3 text-white/40"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `rgba(${theme.primary},0.1)` }}
            >
              <Music className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-xs text-center">
              ยังไม่มีเพลงเลย<br />
              <span className="opacity-60">กด + เพื่อเพิ่มเพลงจาก YouTube</span>
            </p>
          </motion.div>
        ) : (
          <>
            {/* ── Player ── */}
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="relative w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden">
                {track?.thumbnail ? (
                  <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, rgba(${theme.primary},0.4), rgba(${theme.accent},0.4))` }}
                  >
                    <Music className="w-5 h-5 text-white/70" />
                  </div>
                )}
                {/* Playing bars overlay */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 mx-px bg-white rounded-full"
                        animate={{ height: [3, 12, 6, 10, 3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info + Progress */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{track?.title ?? "—"}</p>
                <p className="text-xs text-white/60 truncate">{track?.artist ?? "—"}</p>
                <div className="mt-2">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={([v]) => handleSeek(v)}
                  />
                  <div className="flex justify-between mt-1 text-[10px] text-white/50">
                    <span>{currentTime}</span>
                    <span>{track?.duration ?? "--:--"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Transport controls ── */}
            <div className="flex items-center justify-between mt-3">
              {/* Volume */}
              <div className="flex items-center gap-1">
                <button onClick={toggleMute} className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="w-16">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={([v]) => handleVolumeChange(v)}
                  />
                </div>
              </div>

              {/* Prev / Play / Next */}
              <div className="flex items-center gap-1">
                <button onClick={prevTrack} disabled={playlist.length < 2} className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full text-white transition-all"
                  style={{
                    background: `rgb(${theme.primary})`,
                    boxShadow: `0 0 10px rgba(${theme.primary},0.8), 0 0 20px rgba(${theme.primary},0.6), 0 0 40px rgba(${theme.primary},0.4)`,
                  }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button onClick={nextTrack} disabled={playlist.length < 2} className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="w-[72px]" />
            </div>

            {/* ── Playlist ── */}
            <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
              <AnimatePresence initial={false}>
                {playlist.map((t, i) => {
                  const isActive = i === currentTrack;
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`group flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all ${isActive ? "scale-[1.02]" : ""}`}
                      style={{
                        background: isActive
                          ? `linear-gradient(90deg, rgba(${theme.primary},0.35), rgba(${theme.primary},0.15))`
                          : "transparent",
                        boxShadow: isActive ? `0 0 12px rgba(${theme.primary},0.5)` : "none",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {/* Play on click */}
                      <button
                        onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        {isActive && (
                          <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: `rgb(${theme.primary})` }} />
                        )}
                        <span className="text-[10px] w-4 text-center font-mono flex-shrink-0">{i + 1}</span>
                        {/* Mini thumbnail */}
                        <img src={t.thumbnail} alt={t.title} className="w-7 h-7 rounded-md object-cover flex-shrink-0 opacity-80" />
                        <span className="text-xs flex-1 truncate">{t.title}</span>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeTrack(i); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/40 hover:text-red-400 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Slot indicators */}
              {playlist.length < 3 && (
                <div className="flex gap-1 mt-2 justify-center">
                  {Array.from({ length: 3 - playlist.length }).map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-1 rounded-full"
                      style={{ background: `rgba(${theme.primary},0.15)` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}