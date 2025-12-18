from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    app_name: str = "ZeroDay3 Matching AI"
    app_version: str = "1.0.0"
    
    # API Configuration
    api_prefix: str = "/api"
    
    # CORS Configuration
    cors_origins: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Database Configuration
    database_url: str = "sqlite+aiosqlite:///./zeroday3.db"
    
    # Data paths
    product_catalog_path: str = "../data/product_catalog.json"
    ai_tools_catalog_path: str = "../data/ai_tools_catalog.json"
    
    # Matching Algorithm Parameters (65/35 Framework)
    structural_logic_weight: float = 0.65  # Structural logic weight
    precision_weight: float = 0.35  # Original precision weight
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
