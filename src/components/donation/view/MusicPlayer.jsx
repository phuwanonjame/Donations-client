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

const defaultTheme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
  base: "4, 15, 30",
  baseSecondary: "12, 28, 48",
  text: "255, 255, 255",
  mutedText: "255, 255, 255",
  buttonText: "13, 42, 58",
  buttonBackground:
    "linear-gradient(120deg, rgb(186, 230, 253), rgb(255, 255, 255))",
};

const defaultDecorations = {
  panelLeft: {
    src: "/imgs/ice.png",
    alt: "section-left",
    className:
      "pointer-events-none absolute -top-1 left-0 w-10 z-20 opacity-90",
  },
  panelRight: {
    src: "/imgs/ice.png",
    alt: "section-right",
    className:
      "pointer-events-none absolute -top-2 -right-2 w-30 scale-x-[-1] z-20 opacity-90",
  },
};

const rgba = (rgb, opacity) => `rgba(${rgb},${opacity})`;

function DecorationImage({ decoration }) {
  if (!decoration?.src) return null;

  return (
    <img
      src={decoration.src}
      alt={decoration.alt || "decoration"}
      className={decoration.className}
    />
  );
}

export default function MusicPlayer({
  playlist = PLAYLIST,
  visualTheme = defaultTheme,
  decorations = defaultDecorations,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const theme = { ...defaultTheme, ...visualTheme };

  const safePlaylist = playlist.length ? playlist : PLAYLIST;
  const track = safePlaylist[currentTrack] || safePlaylist[0];

  const nextTrack = () =>
    setCurrentTrack((prev) => (prev + 1) % safePlaylist.length);
  const prevTrack = () =>
    setCurrentTrack(
      (prev) => (prev - 1 + safePlaylist.length) % safePlaylist.length
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <DecorationImage decoration={decorations.panelLeft} />
      <DecorationImage decoration={decorations.panelRight} />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${rgba(theme.base, 0.82)}, ${rgba(
            theme.baseSecondary,
            0.68
          )})`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]">
        <div
          className="h-full w-full rounded-2xl"
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

      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: rgba(theme.primary, 0.25) }}
      />
      <div
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: rgba(theme.secondary, 0.25) }}
      />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <Music className="h-4 w-4" style={{ color: `rgb(${theme.primary})` }} />
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: rgba(theme.mutedText, 0.6) }}
          >
            Now Playing
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${rgba(
                theme.primary,
                0.4
              )}, ${rgba(theme.accent, 0.4)})`,
            }}
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-white"
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
              <Music className="h-5 w-5 text-white/70" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-semibold"
              style={{ color: `rgb(${theme.text})` }}
            >
              {track.title}
            </p>
            <p
              className="truncate text-xs"
              style={{ color: rgba(theme.mutedText, 0.6) }}
            >
              {track.artist}
            </p>

            <div className="mt-2">
              <Slider
                value={[progress]}
                max={100}
                step={1}
                onValueChange={([v]) => setProgress(v)}
              />
              <div
                className="mt-1 flex justify-between text-[10px]"
                style={{ color: rgba(theme.mutedText, 0.5) }}
              >
                <span>1:12</span>
                <span>{track.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-lg p-1.5 hover:text-white"
              style={{ color: rgba(theme.mutedText, 0.6) }}
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
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
              className="p-2 hover:text-white"
              style={{ color: rgba(theme.mutedText, 0.6) }}
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full p-2.5"
              style={{
                background: theme.buttonBackground,
                color: `rgb(${theme.buttonText})`,
                boxShadow: `
                  0 0 10px rgba(${theme.primary},0.8),
                  0 0 20px rgba(${theme.primary},0.6),
                  0 0 40px rgba(${theme.primary},0.4)
                `,
              }}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="ml-0.5 h-4 w-4" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 hover:text-white"
              style={{ color: rgba(theme.mutedText, 0.6) }}
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <div className="w-[72px]" />
        </div>

        <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
          {safePlaylist.map((t, i) => {
            const isActive = i === currentTrack;

            return (
              <motion.button
                key={i}
                onClick={() => {
                  setCurrentTrack(i);
                  setIsPlaying(true);
                }}
                animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-all"
                style={{
                  background: isActive
                    ? `linear-gradient(90deg, rgba(${theme.primary},0.35), rgba(${theme.primary},0.15))`
                    : "transparent",
                  boxShadow: isActive
                    ? `0 0 12px rgba(${theme.primary},0.5)`
                    : "none",
                  color: isActive
                    ? `rgb(${theme.text})`
                    : rgba(theme.mutedText, 0.6),
                }}
              >
                {isActive && (
                  <div
                    className="h-5 w-1 rounded-full"
                    style={{ background: `rgb(${theme.primary})` }}
                  />
                )}

                <span className="w-4 text-center font-mono text-[10px]">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-xs">{t.title}</span>
                <span className="text-[10px] opacity-60">{t.duration}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
