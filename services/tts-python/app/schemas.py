from pydantic import BaseModel, Field


class SynthesizeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    voice: str | None = None
    style_id: str | None = None
    rate: str | None = None
    pitch: str | None = None
    volume: str | None = None


class VoiceItem(BaseModel):
    name: str
    short_name: str
    gender: str
    locale: str
    friendly_name: str | None = None


class TtsStyleItem(BaseModel):
    id: str
    name: str
    description: str
    rate: float
    pitch: float
    recommended_voice: str | None = None
