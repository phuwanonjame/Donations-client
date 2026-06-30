import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Film } from "lucide-react";
import { getVideoEmbedData } from "@/components/donation/shared/videoEmbed";

const VIDEOS = [
  {
    title: "YouTube Highlight",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    title: "TikTok Highlight",
    url: "https://www.tiktok.com/@scout2015/video/6718335390845095173",
  },
];

const defaultTheme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
  base: "4, 15, 30",
  baseSecondary: "12, 28, 48",
  text: "255, 255, 255",
  mutedText: "255, 255, 255",
};

const rgba = (rgb, opacity) => `rgba(${rgb},${opacity})`;

export default function VideoHighlights({
  videos = VIDEOS,
  visualTheme = defaultTheme,
}) {
  const [playingIndex, setPlayingIndex] = useState(null);
  const theme = { ...defaultTheme, ...visualTheme };
  const normalizedVideos = videos
    .map((video, index) => {
      const embed = getVideoEmbedData(video.url || "");

      return {
        ...video,
        title: video.title || `${embed.platformLabel || "Highlight"} ${index + 1}`,
        platform: embed.platform || video.platform || "",
        platformLabel: embed.platformLabel || "วิดีโอ",
        embedUrl: embed.embedUrl || video.embedUrl || "",
        thumbnail: embed.thumbnailUrl || video.thumbnail || "",
      };
    })
    .filter((video) => video.url || video.embedUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl p-4"
    >
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
        style={{ background: rgba(theme.primary, 0.25) }}
      />
      <div
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: rgba(theme.secondary, 0.25) }}
      />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <Film className="h-4 w-4" style={{ color: `rgb(${theme.accent})` }} />
          <h3
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: rgba(theme.mutedText, 0.6) }}
          >
            Highlight คลิปสั้น
          </h3>
        </div>

        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {normalizedVideos.map((video, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPlayingIndex(i === playingIndex ? null : i)}
              className="group w-40 flex-shrink-0 cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                {playingIndex === i && video.embedUrl ? (
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br text-white"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${rgba(theme.primary, 0.45)}, ${rgba(
                        theme.secondary,
                        0.4
                      )})`,
                    }}
                  >
                    <span className="text-sm font-semibold">{video.platformLabel}</span>
                  </div>
                )}

                {playingIndex !== i ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/20">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md"
                    >
                      <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                    </motion.div>
                  </div>
                ) : null}
              </div>

              <p
                className="mt-2 truncate text-xs font-medium"
                style={{ color: `rgb(${theme.text})` }}
              >
                {video.title}
              </p>
              <p
                className="flex items-center gap-1 text-[11px]"
                style={{ color: rgba(theme.mutedText, 0.6) }}
              >
                {video.platformLabel}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
