"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const PLAYLIST = [
  { title: "Chill Vibes Lo-fi", artist: "StudyBeats", duration: "3:24" },
  { title: "Neon Dreams", artist: "SynthWave", duration: "4:12" },
  { title: "Midnight Rain", artist: "ChillHop", duration: "2:58" },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);

  const theme = {
  primary: "186, 230, 253",   // ฟ้าน้ำแข็งอ่อน (icy blue)
  secondary: "147, 197, 253", // ฟ้าเย็น
  accent: "255, 255, 255",    // ขาวหิมะ
};

  const track = PLAYLIST[currentTrack];

  const nextTrack = () =>
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  const prevTrack = () =>
    setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
      className="relative overflow-hidden p-4 rounded-2xl backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-[1.02]"
    >
      

      {/* ❄️ ICE CORNER LEFT */}
      <img
        src="/imgs/ice.png"
        alt="ice-left"
        className="pointer-events-none absolute -top-1 left-0 w-10 z-20 opacity-90"
      />

      {/* ❄️ ICE CORNER RIGHT (mirror) */}
      <img
        src="/imgs/ice.png"
        alt="ice-right"
        className="pointer-events-none absolute -top-2 -right-2 w-30 scale-x-[-1] z-20 opacity-90"
      />

      {/* Glass background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(0,0,0,0.55),
              rgba(0,0,0,0.35)
            )
          `,
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
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      </div>

      {/* Glow BG */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
        style={{ background: `rgba(${theme.primary},0.25)` }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl"
        style={{ background: `rgba(${theme.secondary},0.25)` }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Music
            className="w-4 h-4"
            style={{ color: `rgb(${theme.primary})` }}
          />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Now Playing
          </span>
        </div>

        {/* Player */}
        <div className="flex items-center gap-4">
          {/* Album */}
          <div
            className="relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${theme.primary},0.4), rgba(${theme.accent},0.4))`,
            }}
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    animate={{ height: [4, 16, 8, 14, 4] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music className="w-5 h-5 text-white/70" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {track.title}
            </p>
            <p className="text-xs text-white/60 truncate">{track.artist}</p>

            <div className="mt-2">
              <Slider
                value={[progress]}
                max={100}
                step={1}
                onValueChange={([v]) => setProgress(v)}
              />
              <div className="flex justify-between mt-1 text-[10px] text-white/50">
                <span>1:12</span>
                <span>{track.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <div className="w-16">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={([v]) => {
                  setVolume(v);
                  setIsMuted(v === 0);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevTrack}
              className="p-2 text-white/60 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full text-white"
              style={{
                background: `rgb(${theme.primary})`,
                boxShadow: `
                  0 0 10px rgba(${theme.primary},0.8),
                  0 0 20px rgba(${theme.primary},0.6),
                  0 0 40px rgba(${theme.primary},0.4)
                `,
              }}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 text-white/60 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[72px]" />
        </div>

        {/* Playlist */}
        <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
          {PLAYLIST.map((t, i) => {
            const isActive = i === currentTrack;

            return (
              <motion.button
                key={i}
                onClick={() => {
                  setCurrentTrack(i);
                  setIsPlaying(true);
                }}
                animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-left transition-all"
                style={{
                  background: isActive
                    ? `linear-gradient(90deg, rgba(${theme.primary},0.35), rgba(${theme.primary},0.15))`
                    : "transparent",
                  boxShadow: isActive
                    ? `0 0 12px rgba(${theme.primary},0.5)`
                    : "none",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                {isActive && (
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{ background: `rgb(${theme.primary})` }}
                  />
                )}

                <span className="text-[10px] w-4 text-center font-mono">
                  {i + 1}
                </span>
                <span className="text-xs flex-1 truncate">{t.title}</span>
                <span className="text-[10px] opacity-60">{t.duration}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}