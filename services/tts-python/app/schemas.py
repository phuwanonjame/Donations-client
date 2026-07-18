from pydantic import AliasChoices, BaseModel, ConfigDict, Field, model_validator


class SynthesizeRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="allow")

    text: str | None = Field(
        default=None,
        min_length=1,
        max_length=5000,
        validation_alias=AliasChoices("text", "message", "content", "input", "messageText", "ttsText"),
    )
    voice: str | None = Field(
        default=None,
        validation_alias=AliasChoices("voice", "voiceId", "ttsVoice"),
    )
    style_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("style_id", "styleId", "ttsStyleId"),
    )
    rate: str | None = Field(
        default=None,
        validation_alias=AliasChoices("rate", "ttsRate"),
    )
    pitch: str | None = Field(
        default=None,
        validation_alias=AliasChoices("pitch", "ttsPitch"),
    )
    volume: str | None = Field(
        default=None,
        validation_alias=AliasChoices("volume", "ttsVolume"),
    )

    @model_validator(mode="after")
    def ensure_text(self):
        if self.text and str(self.text).strip():
            self.text = str(self.text).strip()
            return self

        raise ValueError("text is required")


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
