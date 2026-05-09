from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Donation TTS Service"
    api_prefix: str = ""
    default_voice: str = Field(default="th-TH-PremwadeeNeural")
    default_rate: str = Field(default="+0%")
    default_pitch: str = Field(default="+0Hz")
    default_volume: str = Field(default="+0%")
    ffmpeg_path: str = Field(default="ffmpeg")
    cors_origins: list[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3003",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:3002",
            "http://127.0.0.1:3003",
        ]
    )

    model_config = SettingsConfigDict(
        env_prefix="TTS_",
        case_sensitive=False,
    )


settings = Settings()
