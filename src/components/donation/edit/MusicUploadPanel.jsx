"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Trash2,
  Plus,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const MAX_TRACKS = 3;

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

const rgba = (rgb, opacity) => `rgba(${rgb},${opacity})`;

function getVideoId(url) {
  const reg = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

export default function MusicUploadPanel({ visualTheme = defaultTheme }) {
  const ytRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const theme = { ...defaultTheme, ...visualTheme };

  useEffect(() => {
    if (window.YT) {
      setReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      setReady(true);
    };
  }, []);

  useEffect(() => {
    if (!ready || ytRef.current) return;

    ytRef.current = new window.YT.Player("yt-player", {
      height: "0",
      width: "0",
      videoId: "",
      playerVars: { autoplay: 0 },
      events: {
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.ENDED) {
            nextTrack();
          }
        },
      },
    });
  }, [ready]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!ytRef.current || !isPlaying) return;

      const current = ytRef.current.getCurrentTime?.() || 0;
      const dur = ytRef.current.getDuration?.() || 0;

      setProgress(current);
      setDuration(dur);
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const addTrack = () => {
    if (playlist.length >= MAX_TRACKS) return;

    const id = getVideoId(urlInput);
    if (!id) return;

    setPlaylist([
      ...playlist,
      {
        id,
        title: "YouTube Track",
        thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`,
      },
    ]);

    setUrlInput("");
  };

  const playTrack = (index) => {
    const track = playlist[index];
    if (!track || !ytRef.current) return;

    ytRef.current.loadVideoById(track.id);
    ytRef.current.setVolume(volume);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!ytRef.current) return;

    if (isPlaying) {
      ytRef.current.pauseVideo();
    } else {
      ytRef.current.playVideo();
    }

    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (playlist.length === 0 || currentIndex === null) return;
    const next = (currentIndex + 1) % playlist.length;
    playTrack(next);
  };

  const prevTrack = () => {
    if (playlist.length === 0 || currentIndex === null) return;
    const prev = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  };

  const removeTrack = (index) => {
    const isCurrent = index === currentIndex;
    const newList = playlist.filter((_, i) => i !== index);
    setPlaylist(newList);

    if (isCurrent) {
      ytRef.current?.stopVideo();
      setIsPlaying(false);
      setCurrentIndex(null);
    }
  };

  const handleSeek = ([v]) => {
    ytRef.current?.seekTo(v, true);
    setProgress(v);
  };

  const handleVolume = ([v]) => {
    setVolume(v);
    ytRef.current?.setVolume(v);
    setIsMuted(v === 0);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 p-4">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${rgba(theme.base, 0.82)}, ${rgba(
            theme.baseSecondary,
            0.68
          )})`,
          backdropFilter: "blur(18px)",
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
        style={{ background: rgba(theme.primary, 0.18) }}
      />
      <div
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: rgba(theme.secondary, 0.18) }}
      />

      <div className="relative z-10">
        <div className="mb-3 flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste YouTube link..."
            className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs outline-none"
            style={{
              background: rgba(theme.baseSecondary, 0.45),
              color: `rgb(${theme.text})`,
            }}
          />
          <button
            onClick={addTrack}
            className="rounded-lg p-2"
            style={{ color: `rgb(${theme.text})` }}
          >
            <Plus />
          </button>
        </div>

        {currentIndex !== null && playlist[currentIndex] && (
          <div className="mb-3">
            <img
              src={playlist[currentIndex].thumbnail}
              className="mb-2 h-16 w-16 rounded"
            />

            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />

            <div
              className="flex justify-between text-xs"
              style={{ color: rgba(theme.mutedText, 0.5) }}
            >
              <span>{Math.floor(progress)}s</span>
              <span>{Math.floor(duration)}s</span>
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={prevTrack} style={{ color: `rgb(${theme.text})` }}>
              <SkipBack />
            </button>

            <button onClick={togglePlay} style={{ color: `rgb(${theme.text})` }}>
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button onClick={nextTrack} style={{ color: `rgb(${theme.text})` }}>
              <SkipForward />
            </button>
          </div>

          <div className="flex w-32 items-center gap-2">
            <span style={{ color: `rgb(${theme.text})` }}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </span>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolume}
            />
          </div>
        </div>

        <div className="space-y-2">
          {playlist.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded p-2"
              style={{ background: rgba(theme.baseSecondary, 0.42) }}
            >
              <img src={t.thumbnail} className="h-10 w-10 rounded" />

              <button
                onClick={() => playTrack(i)}
                className="flex-1 text-left text-sm"
                style={{ color: `rgb(${theme.text})` }}
              >
                Track {i + 1}
              </button>

              <button onClick={() => removeTrack(i)}>
                <Trash2 className="text-red-400" />
              </button>
            </div>
          ))}
        </div>

        <div id="yt-player" />
      </div>
    </div>
  );
}
