"use client";
import { useState } from "react";
import { Play, Pause, Music } from "lucide-react";

function getVideoId(url) {
  const reg =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

export default function YouTubeAudioPlayer() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLoad = () => {
    const id = getVideoId(url);
    if (id) setVideoId(id);
  };

  return (
    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
      {/* INPUT */}
      <div className="flex gap-2 mb-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube link..."
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
        <button
          onClick={handleLoad}
          className="px-3 py-2 text-xs rounded-lg bg-white/10 text-white"
        >
          Load
        </button>
      </div>

      {/* PLAYER UI */}
      {videoId && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-white/60" />
          </div>

          <div className="flex-1 text-xs text-white/70">
            Playing from YouTube
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-white/20"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* HIDDEN YOUTUBE */}
      {videoId && (
        <iframe
          className="w-0 h-0 opacity-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${
            isPlaying ? 1 : 0
          }`}
          allow="autoplay"
        />
      )}
    </div>
  );
}