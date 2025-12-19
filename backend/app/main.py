"""
ZeroDay3 Matching AI - FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from app.models import HealthCheck
from app.routers import matching, catalog, admin


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print("Loading data catalogs...")
    
    # Pre-load catalogs
    from app.database import get_data_loader
    data_loader = get_data_loader()
    products = data_loader.load_product_catalog()
    tools = data_loader.load_ai_tools_catalog()
    print(f"Loaded {len(products)} products and {len(tools)} AI tools")
    
    # Initialize Gemini service
    from app.services.gemini_admin import get_gemini_service
    gemini_service = get_gemini_service()
    if gemini_service.model:
        print("Gemini AI service initialized")
    else:
        print("Warning: Gemini AI service not configured (GEMINI_API_KEY not set)")
    
    yield
    
    # Shutdown
    print("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="ZeroDay3 Matching AI - Matching Companies to AI Workflows and People to Products",
    version=settings.app_version,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(matching.router, prefix=settings.api_prefix)
app.include_router(catalog.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)


@app.get("/", response_model=HealthCheck)
async def health_check():
    """
    Health check endpoint
    """
    return HealthCheck(
        status="operational",
        version=settings.app_version,
        framework="65/35 Logic Framework (Structural + Precision)"
    )


@app.get("/api/health", response_model=HealthCheck)
async def api_health_check():
    """
    API health check endpoint
    """
    return HealthCheck(
        status="operational",
        version=settings.app_version,
        framework="65/35 Logic Framework (Structural + Precision)"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
