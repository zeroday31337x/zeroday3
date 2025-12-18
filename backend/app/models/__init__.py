from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum


class TrackType(str, Enum):
    """Type of matching track"""
    COMPANY = "company"
    INDIVIDUAL = "individual"


class CompanyMatchRequest(BaseModel):
    """Request model for company workflow matching"""
    friction_point: str = Field(
        ..., 
        description="Specific business problem or friction point",
        min_length=10
    )
    company_size: Optional[str] = Field(
        None,
        description="Company size (startup, small, medium, enterprise)"
    )
    industry: Optional[str] = Field(
        None,
        description="Industry sector"
    )
    technical_constraints: Optional[List[str]] = Field(
        default_factory=list,
        description="Any technical constraints or requirements"
    )


class IndividualMatchRequest(BaseModel):
    """Request model for individual product matching"""
    need: str = Field(
        ...,
        description="Specific need or use case",
        min_length=10
    )
    budget_range: Optional[str] = Field(
        None,
        description="Budget range (budget, mid-range, premium, unlimited)"
    )
    ecosystem_preference: Optional[str] = Field(
        None,
        description="Ecosystem preference (apple, windows, linux, samsung, agnostic)"
    )
    primary_use_cases: Optional[List[str]] = Field(
        default_factory=list,
        description="Primary use cases"
    )


class TechnicalBreakdown(BaseModel):
    """Technical breakdown of a recommendation"""
    strength: str
    limitation: str
    ideal_for: str


class AIToolRecommendation(BaseModel):
    """AI tool recommendation model"""
    tool_id: str
    tool_name: str
    category: str
    match_score: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    deployment_guide: Dict[str, Any]
    technical_truth: TechnicalBreakdown


class ProductRecommendation(BaseModel):
    """Product recommendation model"""
    product_id: str
    product_name: str
    category: str
    match_score: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    technical_specs: Dict[str, Any]
    technical_truth: TechnicalBreakdown


class CompanyMatchResponse(BaseModel):
    """Response model for company workflow matching"""
    intent_analysis: Dict[str, Any]
    recommendations: List[AIToolRecommendation]
    deployment_strategy: str
    estimated_impact: str


class IndividualMatchResponse(BaseModel):
    """Response model for individual product matching"""
    intent_analysis: Dict[str, Any]
    recommendations: List[ProductRecommendation]
    comparison_matrix: Optional[Dict[str, Any]] = None
    buying_guide: str


class Product(BaseModel):
    """Product catalog model"""
    id: str
    name: str
    category: str
    use_case: str
    technical_specs: Dict[str, Any]
    matching_criteria: Dict[str, Any]
    technical_truth: Dict[str, str]


class AITool(BaseModel):
    """AI tool catalog model"""
    id: str
    name: str
    category: str
    use_cases: List[str]
    technical_specs: Dict[str, Any]
    matching_criteria: Dict[str, Any]
    deployment_guide: Dict[str, Any]
    technical_truth: Dict[str, str]


class HealthCheck(BaseModel):
    """Health check response"""
    status: str
    version: str
    framework: str
