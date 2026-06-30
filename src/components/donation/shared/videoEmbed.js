const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const TIKTOK_HOSTS = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
  "vm.tiktok.com",
]);

function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function extractYoutubeVideoId(url) {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl || !YOUTUBE_HOSTS.has(parsedUrl.hostname)) {
    return "";
  }

  if (parsedUrl.hostname.includes("youtu.be")) {
    return parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
  }

  if (parsedUrl.searchParams.get("v")) {
    return parsedUrl.searchParams.get("v") || "";
  }

  const parts = parsedUrl.pathname.split("/").filter(Boolean);
  const markerIndex = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
  if (markerIndex !== -1) {
    return parts[markerIndex + 1] || "";
  }

  return "";
}

function extractTikTokVideoId(url) {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl || !TIKTOK_HOSTS.has(parsedUrl.hostname)) {
    return "";
  }

  const match = parsedUrl.pathname.match(/\/video\/(\d+)/);
  return match?.[1] || "";
}

export function getVideoEmbedData(url) {
  const normalizedUrl = String(url || "").trim();
  if (!normalizedUrl) {
    return {
      platform: "",
      platformLabel: "",
      videoId: "",
      embedUrl: "",
      thumbnailUrl: "",
      isValid: false,
    };
  }

  const youtubeId = extractYoutubeVideoId(normalizedUrl);
  if (youtubeId) {
    return {
      platform: "youtube",
      platformLabel: "YouTube",
      videoId: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      isValid: true,
    };
  }

  const tiktokId = extractTikTokVideoId(normalizedUrl);
  if (tiktokId) {
    return {
      platform: "tiktok",
      platformLabel: "TikTok",
      videoId: tiktokId,
      embedUrl: `https://www.tiktok.com/player/v1/${tiktokId}?controls=1&music_info=0&description=0`,
      thumbnailUrl: "",
      isValid: true,
    };
  }

  return {
    platform: "unknown",
    platformLabel: "ลิงก์ไม่รองรับ",
    videoId: "",
    embedUrl: "",
    thumbnailUrl: "",
    isValid: false,
  };
}
