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

function getVideoId(url) {
  const reg =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

export default function MusicPlayer() {
  const playerRef = useRef(null);
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

  // 🔥 โหลด YouTube API
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

  // 🎧 create player
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

  // ⏱ sync progress
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

  // 🎵 add track
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

  // ▶️ play track
  const playTrack = (index) => {
    const track = playlist[index];
    if (!track || !ytRef.current) return;

    ytRef.current.loadVideoById(track.id);
    ytRef.current.setVolume(volume);

    setCurrentIndex(index);
    setIsPlaying(true);
  };

  // ⏯ play pause
  const togglePlay = () => {
    if (!ytRef.current) return;

    if (isPlaying) {
      ytRef.current.pauseVideo();
    } else {
      ytRef.current.playVideo();
    }

    setIsPlaying(!isPlaying);
  };

  // ⏩ next
  const nextTrack = () => {
    if (playlist.length === 0) return;
    const next = (currentIndex + 1) % playlist.length;
    playTrack(next);
  };

  // ⏪ prev
  const prevTrack = () => {
    if (playlist.length === 0) return;
    const prev =
      (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  };

  // 🧹 remove track
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

  // 🎚 seek
  const handleSeek = ([v]) => {
    ytRef.current?.seekTo(v, true);
    setProgress(v);
  };

  // 🔊 volume
  const handleVolume = ([v]) => {
    setVolume(v);
    ytRef.current?.setVolume(v);
    setIsMuted(v === 0);
  };

  return (
    <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
      {/* INPUT */}
      <div className="flex gap-2 mb-3">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste YouTube link..."
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-white/5 text-white"
        />
        <button onClick={addTrack}>
          <Plus />
        </button>
      </div>

      {/* PLAYER */}
      {currentIndex !== null && playlist[currentIndex] && (
        <div className="mb-3">
          <img
            src={playlist[currentIndex].thumbnail}
            className="w-16 h-16 rounded mb-2"
          />

          <Slider
            value={[progress]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
          />

          <div className="flex justify-between text-xs text-white/50">
            <span>{Math.floor(progress)}s</span>
            <span>{Math.floor(duration)}s</span>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button onClick={prevTrack}>
            <SkipBack />
          </button>

          <button onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button onClick={nextTrack}>
            <SkipForward />
          </button>
        </div>

        <div className="flex items-center gap-2 w-32">
          {isMuted ? <VolumeX /> : <Volume2 />}
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={handleVolume}
          />
        </div>
      </div>

      {/* PLAYLIST */}
      <div className="space-y-2">
        {playlist.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 bg-white/5 rounded"
          >
            <img
              src={t.thumbnail}
              className="w-10 h-10 rounded"
            />

            <button
              onClick={() => playTrack(i)}
              className="flex-1 text-left text-white text-sm"
            >
              Track {i + 1}
            </button>

            <button onClick={() => removeTrack(i)}>
              <Trash2 className="text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {/* HIDDEN PLAYER */}
      <div id="yt-player" />
    </div>
  );
}