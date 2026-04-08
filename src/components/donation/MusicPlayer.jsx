import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const PLAYLIST = [
  { title: "Neon Dreams", artist: "Synthwave Mix", duration: "3:42" },
  { title: "Midnight City", artist: "Lo-fi Beats", duration: "4:15" },
  { title: "Purple Rain", artist: "Chill Vibes", duration: "3:58" },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);

  const track = PLAYLIST[currentTrack];

  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 neon-border relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

      <div className="flex items-center gap-2 mb-3">
        <Music className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          🎵 เพลงประจำโปรไฟล์
        </h3>
      </div>

      {/* Track info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0 glow-primary">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="bars"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-0.5 h-5"
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{ height: ["8px", "18px", "8px"] }}
                    transition={{
                      duration: 0.5 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <Music className="w-5 h-5 text-primary" />
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        </div>
        <span className="text-xs text-muted-foreground">{track.duration}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <Slider
          value={[progress]}
          onValueChange={(v) => setProgress(v[0])}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={prevTrack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 transition-all glow-primary"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={nextTrack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="w-16">
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(v) => { setVolume(v[0]); setIsMuted(v[0] === 0); }}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}