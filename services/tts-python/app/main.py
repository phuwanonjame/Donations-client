from io import BytesIO
import shutil
import subprocess

import edge_tts
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from gtts import gTTS

from .config import settings
from .schemas import SynthesizeRequest, TtsStyleItem, VoiceItem


app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TTS_STYLES = [
    TtsStyleItem(
        id="soft_female",
        name="ผู้หญิงนุ่มนวล",
        description="น้ำเสียงสุภาพ ฟังง่าย เหมาะกับโดเนททั่วไป",
        rate=0.95,
        pitch=1.05,
        recommended_voice="th-TH-PremwadeeNeural",
    ),
    TtsStyleItem(
        id="bright_kid",
        name="เด็กสดใส",
        description="พูดเร็วขึ้นและเสียงสูงขึ้น ให้ความรู้สึกสดใส",
        rate=1.18,
        pitch=1.3,
        recommended_voice="th-TH-PremwadeeNeural",
    ),
    TtsStyleItem(
        id="teen_streamer",
        name="วัยรุ่นสตรีมเมอร์",
        description="จังหวะคล่องตัว สนุกขึ้นเล็กน้อย",
        rate=1.08,
        pitch=1.12,
        recommended_voice="th-TH-PremwadeeNeural",
    ),
    TtsStyleItem(
        id="deep_male",
        name="ผู้ชายทุ้ม",
        description="ช้าลงเล็กน้อยและโทนต่ำลง",
        rate=0.9,
        pitch=0.78,
        recommended_voice="th-TH-NiwatNeural",
    ),
    TtsStyleItem(
        id="elder_male",
        name="ผู้ชายสูงอายุ",
        description="ชัดถ้อยชัดคำ ช้าลงและทุ้มขึ้นอีกระดับ",
        rate=1.08,
        pitch=0.68,
        recommended_voice="th-TH-NiwatNeural",
    ),
]
TTS_STYLE_MAP = {style.id: style for style in TTS_STYLES}


def _voice_to_gtts_lang(voice: str) -> str:
    locale = (voice or settings.default_voice).split("-")
    if len(locale) >= 1 and locale[0]:
        return locale[0].lower()
    return "th"


def _style_to_edge_rate(value: float) -> str:
    percent = round((value - 1) * 100)
    return f"{percent:+d}%"


def _style_to_edge_pitch(value: float) -> str:
    hz = round((value - 1) * 50)
    return f"{hz:+d}Hz"


def _apply_ffmpeg_voice_style(
    audio_bytes: bytes,
    *,
    target_rate: float,
    target_pitch: float,
) -> bytes:
    ffmpeg_path = shutil.which(settings.ffmpeg_path)
    if not ffmpeg_path:
        try:
            import imageio_ffmpeg

            ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            ffmpeg_path = None

    if not ffmpeg_path:
        raise FileNotFoundError("ffmpeg is not installed or not available in PATH")

    tempo = max(0.5, min(2.0, target_rate / max(target_pitch, 0.1)))
    filters = [
        f"asetrate=24000*{target_pitch}",
        "aresample=24000",
        f"atempo={tempo}",
    ]

    proc = subprocess.run(
        [
            ffmpeg_path,
            "-y",
            "-i",
            "pipe:0",
            "-af",
            ",".join(filters),
            "-f",
            "wav",
            "pipe:1",
        ],
        input=audio_bytes,
        capture_output=True,
        check=False,
    )

    if proc.returncode != 0 or not proc.stdout:
        raise RuntimeError(proc.stderr.decode("utf-8", errors="ignore") or "ffmpeg failed")

    return proc.stdout


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/voices")
async def list_voices(
    locale: str | None = Query(default=None),
    gender: str | None = Query(default=None),
    search: str | None = Query(default=None),
) -> JSONResponse:
    voices = await edge_tts.list_voices()
    filtered: list[VoiceItem] = []

    for voice in voices:
        item = VoiceItem(
            name=voice["Name"],
            short_name=voice["ShortName"],
            gender=voice["Gender"],
            locale=voice["Locale"],
            friendly_name=voice.get("FriendlyName"),
        )

        if locale and item.locale.lower() != locale.lower():
            continue
        if gender and item.gender.lower() != gender.lower():
            continue
        if search:
            haystack = " ".join(
                [
                    item.name,
                    item.short_name,
                    item.locale,
                    item.friendly_name or "",
                ]
            ).lower()
            if search.lower() not in haystack:
                continue

        filtered.append(item)

    filtered.sort(key=lambda item: (item.locale, item.short_name))
    return JSONResponse([item.model_dump() for item in filtered])


@app.get("/styles")
async def list_styles() -> JSONResponse:
    return JSONResponse([style.model_dump() for style in TTS_STYLES])


@app.post("/synthesize")
async def synthesize(payload: SynthesizeRequest) -> StreamingResponse:
    style = TTS_STYLE_MAP.get(payload.style_id or "")
    voice = payload.voice or style.recommended_voice if style and not payload.voice else payload.voice
    voice = voice or settings.default_voice
    rate = payload.rate or ( _style_to_edge_rate(style.rate) if style else settings.default_rate)
    pitch = payload.pitch or ( _style_to_edge_pitch(style.pitch) if style else settings.default_pitch)
    volume = payload.volume or settings.default_volume

    audio_buffer = BytesIO()
    media_type = "audio/mpeg"
    filename = "tts.mp3"

    try:
        communicator = edge_tts.Communicate(
            text=payload.text,
            voice=voice,
            rate=rate,
            pitch=pitch,
            volume=volume,
        )
        async for chunk in communicator.stream():
            if chunk["type"] == "audio":
                audio_buffer.write(chunk["data"])
    except Exception as exc:
        try:
            fallback = gTTS(text=payload.text, lang=_voice_to_gtts_lang(voice))
            fallback.write_to_fp(audio_buffer)
            if style:
                try:
                    processed = _apply_ffmpeg_voice_style(
                        audio_buffer.getvalue(),
                        target_rate=style.rate,
                        target_pitch=style.pitch,
                    )
                    audio_buffer = BytesIO(processed)
                    media_type = "audio/wav"
                    filename = "tts.wav"
                except FileNotFoundError:
                    audio_buffer.seek(0)
        except Exception as fallback_exc:
            raise HTTPException(
                status_code=400,
                detail=f"TTS synthesis failed: {exc}; fallback failed: {fallback_exc}",
            ) from fallback_exc

    if audio_buffer.getbuffer().nbytes == 0:
        raise HTTPException(status_code=400, detail="TTS synthesis returned empty audio")

    audio_buffer.seek(0)
    headers = {"Content-Disposition": f'inline; filename="{filename}"'}
    return StreamingResponse(audio_buffer, media_type=media_type, headers=headers)
