const TTS_SERVICE_URL =
  process.env.NEXT_PUBLIC_TTS_SERVICE_URL || "http://127.0.0.1:8010";

const LEGACY_VOICE_ALIASES = {
  female: "th-TH-PremwadeeNeural",
  male: "th-TH-NiwatNeural",
};

export const FALLBACK_TTS_VOICES = [
  { id: "th-TH-PremwadeeNeural", name: "Premwadee", locale: "th-TH", gender: "Female" },
  { id: "th-TH-NiwatNeural", name: "Niwat", locale: "th-TH", gender: "Male" },
  { id: "th-TH-AcharaNeural", name: "Achara", locale: "th-TH", gender: "Female" },
  { id: "en-US-JennyNeural", name: "Jenny", locale: "en-US", gender: "Female" },
  { id: "en-US-GuyNeural", name: "Guy", locale: "en-US", gender: "Male" },
];

export const FALLBACK_TTS_STYLES = [
  {
    id: "soft_female",
    name: "ผู้หญิงนุ่มนวล",
    description: "น้ำเสียงสุภาพ ฟังง่าย เหมาะกับโดเนททั่วไป",
    rate: 0.95,
    pitch: 1.05,
    recommended_voice: "th-TH-PremwadeeNeural",
  },
  {
    id: "bright_kid",
    name: "เด็กสดใส",
    description: "พูดเร็วขึ้นและเสียงสูงขึ้น ให้ความรู้สึกสดใส",
    rate: 1.18,
    pitch: 1.3,
    recommended_voice: "th-TH-PremwadeeNeural",
  },
  {
    id: "teen_streamer",
    name: "วัยรุ่นสตรีมเมอร์",
    description: "จังหวะคล่องตัว สนุกขึ้นเล็กน้อย",
    rate: 1.08,
    pitch: 1.12,
    recommended_voice: "th-TH-PremwadeeNeural",
  },
  {
    id: "deep_male",
    name: "ผู้ชายทุ้ม",
    description: "ช้าลงเล็กน้อยและโทนต่ำลง",
    rate: 0.9,
    pitch: 0.78,
    recommended_voice: "th-TH-NiwatNeural",
  },
  {
    id: "elder_male",
    name: "ผู้ชายสูงอายุ",
    description: "ชัดถ้อยชัดคำ ช้าลงและทุ้มขึ้นอีกระดับ",
    rate: 0.8,
    pitch: 0.68,
    recommended_voice: "th-TH-NiwatNeural",
  },
];

export function resolveTtsVoiceId(voice) {
  if (!voice) return FALLBACK_TTS_VOICES[0].id;
  return LEGACY_VOICE_ALIASES[voice] || voice;
}

export function buildTtsRateValue(rate = 1) {
  const percent = Math.round((Number(rate) - 1) * 100);
  return `${percent >= 0 ? "+" : ""}${percent}%`;
}

export function buildTtsPitchValue(pitch = 1) {
  const hz = Math.round((Number(pitch) - 1) * 50);
  return `${hz >= 0 ? "+" : ""}${hz}Hz`;
}

export function buildTtsVolumeValue(volume = 50) {
  const normalized = Math.max(0, Math.min(100, Number(volume)));
  const percent = Math.round(normalized - 50);
  return `${percent >= 0 ? "+" : ""}${percent}%`;
}

export async function fetchTtsVoices() {
  const res = await fetch(`${TTS_SERVICE_URL}/voices`);
  if (!res.ok) {
    throw new Error(`Failed to load voices: ${res.status}`);
  }

  const data = await res.json();
  return data.map((voice) => ({
    id: voice.short_name || voice.name,
    name: voice.friendly_name || voice.short_name || voice.name,
    locale: voice.locale,
    gender: voice.gender,
  }));
}

export async function fetchTtsStyles() {
  const res = await fetch(`${TTS_SERVICE_URL}/styles`);
  if (!res.ok) {
    throw new Error(`Failed to load styles: ${res.status}`);
  }
  return await res.json();
}

export function findMatchingTtsStyleId(rate = 1, pitch = 1) {
  let best = FALLBACK_TTS_STYLES[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const style of FALLBACK_TTS_STYLES) {
    const score = Math.abs(Number(rate) - style.rate) + Math.abs(Number(pitch) - style.pitch);
    if (score < bestScore) {
      best = style;
      bestScore = score;
    }
  }

  return best.id;
}

export async function synthesizeTtsAudio({
  text,
  voice,
  styleId,
  rate,
  pitch,
  volume,
}) {
  const res = await fetch(`${TTS_SERVICE_URL}/synthesize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voice: resolveTtsVoiceId(voice),
      style_id: styleId || null,
      rate: buildTtsRateValue(rate),
      pitch: buildTtsPitchValue(pitch),
      volume: buildTtsVolumeValue(volume),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Failed to synthesize speech: ${res.status}`);
  }

  return await res.blob();
}

export function getReadableVoiceLabel(voiceId) {
  const resolvedId = resolveTtsVoiceId(voiceId);
  const fallback = FALLBACK_TTS_VOICES.find((voice) => voice.id === resolvedId);
  if (fallback) {
    return `${fallback.name} (${fallback.locale})`;
  }
  return resolvedId;
}
