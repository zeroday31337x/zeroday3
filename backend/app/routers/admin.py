"""
Admin endpoints for managing the system with Gemini AI
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from app.services.gemini_admin import get_gemini_service
from config import get_settings

router = APIRouter(prefix="/admin", tags=["admin"])
settings = get_settings()


class AdminCommandRequest(BaseModel):
    """Admin command request model"""
    message: str


class AdminCommandResponse(BaseModel):
    """Admin command response model"""
    success: bool
    command: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    reasoning: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    output: Optional[str] = None
    error: Optional[str] = None
    timestamp: str


class ChatMessage(BaseModel):
    """Chat message model"""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: str


class ChatHistory(BaseModel):
    """Chat history model"""
    messages: List[ChatMessage]


# Simple authentication check
def verify_admin_token(x_admin_token: Optional[str] = Header(None)):
    """Verify admin authentication token"""
    if not x_admin_token:
        raise HTTPException(status_code=401, detail="Admin token required")
    
    # In production, implement proper JWT token verification
    # For now, simple token check
    if x_admin_token != settings.admin_secret_key:
        raise HTTPException(status_code=403, detail="Invalid admin token")
    
    return True


@router.post("/execute", response_model=AdminCommandResponse)
async def execute_admin_command(
    request: AdminCommandRequest,
    authenticated: bool = Depends(verify_admin_token)
):
    """
    Execute admin command via Gemini AI
    
    Natural language command examples:
    - "Show me all products in the catalog"
    - "Add a new product: Dell XPS 15 for developers"
    - "What's the system status?"
    - "Run the tests"
    - "Show recent git commits"
    """
    try:
        gemini_service = get_gemini_service()
        result = await gemini_service.execute_command(request.message)
        
        return AdminCommandResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Command execution failed: {str(e)}")


@router.get("/status")
async def admin_status(authenticated: bool = Depends(verify_admin_token)):
    """
    Get admin dashboard status
    """
    gemini_service = get_gemini_service()
    
    # Check if Gemini is configured
    gemini_configured = gemini_service.model is not None
    
    return {
        "status": "operational",
        "gemini_configured": gemini_configured,
        "version": settings.app_version,
        "features": {
            "natural_language_commands": gemini_configured,
            "catalog_management": True,
            "system_monitoring": True,
            "git_integration": True
        }
    }


@router.get("/commands")
async def list_available_commands(authenticated: bool = Depends(verify_admin_token)):
    """
    List all available admin commands
    """
    return {
        "commands": [
            {
                "name": "catalog_info",
                "description": "Get information about products and AI tools",
                "example": "Show me all products"
            },
            {
                "name": "add_product",
                "description": "Add a new product to the catalog",
                "example": "Add a new product called Dell XPS 15"
            },
            {
                "name": "add_ai_tool",
                "description": "Add a new AI tool to the catalog",
                "example": "Add Google Gemini as an AI tool"
            },
            {
                "name": "update_product",
                "description": "Update existing product",
                "example": "Update MacBook Pro price"
            },
            {
                "name": "update_ai_tool",
                "description": "Update existing AI tool",
                "example": "Update GPT-4 capabilities"
            },
            {
                "name": "delete_product",
                "description": "Remove a product",
                "example": "Delete Galaxy Book4 Ultra"
            },
            {
                "name": "delete_ai_tool",
                "description": "Remove an AI tool",
                "example": "Remove Zapier AI"
            },
            {
                "name": "system_status",
                "description": "Get system health and statistics",
                "example": "What's the system status?"
            },
            {
                "name": "run_tests",
                "description": "Execute API tests",
                "example": "Run the tests"
            },
            {
                "name": "git_status",
                "description": "Check repository status",
                "example": "Show git status"
            },
            {
                "name": "git_log",
                "description": "View recent commits",
                "example": "Show last 10 commits"
            }
        ]
    }
