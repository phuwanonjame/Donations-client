# Python TTS Service

Standalone Python service for donation-alert text-to-speech.

This service is intentionally isolated from the Next.js app so the source stays easy to find and maintain.

## Location

`services/tts-python/`

## Features

- Free TTS via `edge-tts`
- List available voices
- Synthesize text to MP3
- Simple HTTP API for frontend or backend integration

## Project Structure

```text
services/tts-python/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── main.py
│   └── schemas.py
├── requirements.txt
└── README.md
```

## Setup

Create a virtual environment and install dependencies:

```powershell
cd services/tts-python
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
cd services/tts-python
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8010
```

## Endpoints

### Health check

```http
GET /health
```

### List voices

Optional query params:

- `locale`
- `gender`
- `search`

```http
GET /voices
GET /voices?locale=th-TH
GET /voices?locale=en-US&gender=Female
GET /voices?search=Jenny
```

### Synthesize speech

```http
POST /synthesize
Content-Type: application/json
```

Example body:

```json
{
  "text": "ขอบคุณสำหรับโดเนท 100 บาท",
  "voice": "th-TH-PremwadeeNeural",
  "rate": "+0%",
  "pitch": "+0Hz",
  "volume": "+0%"
}
```

The response is streamed as `audio/mpeg`.

## Suggested frontend usage

1. Call `GET /voices` once and cache the list.
2. Store the selected `voice` id in widget settings.
3. When previewing or playing alerts, call `POST /synthesize`.

## Notes

- `edge-tts` uses Microsoft online voices, so the Python service needs internet access.
- If you later want a fully offline version, create a second isolated service such as `services/tts-offline/` with Piper.
