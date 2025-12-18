"""
Catalog endpoints for retrieving products and AI tools
"""
from fastapi import APIRouter, HTTPException
from typing import List

from app.models import Product, AITool
from app.database import get_data_loader

router = APIRouter(prefix="/catalog", tags=["catalog"])


@router.get("/products", response_model=List[Product])
async def get_products():
    """
    Get all products from catalog
    """
    try:
        data_loader = get_data_loader()
        products = data_loader.load_product_catalog()
        
        return [Product(**product) for product in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading products: {str(e)}")


@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """
    Get a specific product by ID
    """
    try:
        data_loader = get_data_loader()
        product = data_loader.get_product_by_id(product_id)
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
        
        return Product(**product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading product: {str(e)}")


@router.get("/tools", response_model=List[AITool])
async def get_ai_tools():
    """
    Get all AI tools from catalog
    """
    try:
        data_loader = get_data_loader()
        tools = data_loader.load_ai_tools_catalog()
        
        return [AITool(**tool) for tool in tools]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading AI tools: {str(e)}")


@router.get("/tools/{tool_id}", response_model=AITool)
async def get_ai_tool(tool_id: str):
    """
    Get a specific AI tool by ID
    """
    try:
        data_loader = get_data_loader()
        tool = data_loader.get_tool_by_id(tool_id)
        
        if not tool:
            raise HTTPException(status_code=404, detail=f"Tool {tool_id} not found")
        
        return AITool(**tool)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading tool: {str(e)}")
