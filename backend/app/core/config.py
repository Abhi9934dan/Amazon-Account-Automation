from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://adpilot:adpilot@localhost:5432/adpilot"
    redis_url: str = "redis://localhost:6379/0"
    cors_origins: str = "http://localhost:3000"
    demo_mode: bool = True

    amazon_ads_client_id: str = ""
    amazon_ads_client_secret: str = ""
    amazon_ads_redirect_uri: str = "http://localhost:8000/api/amazon/oauth/callback"
    amazon_ads_region: str = "NA"

    amazon_sp_client_id: str = ""
    amazon_sp_client_secret: str = ""
    amazon_sp_redirect_uri: str = "http://localhost:8000/api/amazon/sp/oauth/callback"
    amazon_sp_api_region: str = "NA"

    token_encryption_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
