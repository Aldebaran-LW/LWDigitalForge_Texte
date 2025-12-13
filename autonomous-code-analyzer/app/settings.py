from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str | None = None
    supabase_service_role_key: str | None = None

    github_token: str | None = None

    google_application_credentials_json: str | None = None
    google_application_credentials: str | None = None

    cron_shared_secret: str | None = None

    analysis_max_files: int = 2000
    analysis_max_bytes: int = 5_000_000


settings = Settings()
