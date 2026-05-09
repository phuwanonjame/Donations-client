from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Donation TTS Service"
    api_prefix: str = ""
    default_voice: str = Field(default="th-TH-PremwadeeNeural")
    default_rate: str = Field(default="+0%")
    default_pitch: str = Field(default="+0Hz")
    default_volume: str = Field(default="+0%")
    ffmpeg_path: str = Field(
        default=(
            "C:\\Users\\Phuwanon.K\\AppData\\Local\\Microsoft\\WinGet\\Packages\\"
            "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\"
            "ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe"
        )
    )
    cors_origins: list[str] = Field(
        default=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )

    model_config = SettingsConfigDict(
        env_prefix="TTS_",
        case_sensitive=False,
    )


settings = Settings()
