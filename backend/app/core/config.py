from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = 'More Advisor Sales API'
    api_prefix: str = '/api/v1'
    database_url: str = f"sqlite:///{(BASE_DIR / 'advisor_sales.db').as_posix()}"
    allowed_origins: str = 'http://localhost:5173,http://127.0.0.1:5173'

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(',') if origin.strip()]


settings = Settings()