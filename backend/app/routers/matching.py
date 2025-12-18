"""
Matching endpoints for company and individual tracks
"""
from fastapi import APIRouter, HTTPException
from typing import List

from app.models import (
    CompanyMatchRequest,
    IndividualMatchRequest,
    CompanyMatchResponse,
    IndividualMatchResponse,
    AIToolRecommendation,
    ProductRecommendation,
    TechnicalBreakdown
)
from app.services.analyze_intent import get_intent_analyzer
from app.services.cross_reference import get_cross_reference_engine
from app.services.generate_instructions import get_instruction_generator
from app.database import get_data_loader

router = APIRouter(prefix="/match", tags=["matching"])


@router.post("/company", response_model=CompanyMatchResponse)
async def match_company_workflow(request: CompanyMatchRequest):
    """
    Match company workflow to AI tools
    
    Workflow A: For Companies
    1. Submission: Company inputs a specific friction point
    2. Mapping: System identifies the best LLM or Agentic Workflow
    3. Instruction: Generates deployment guide
    """
    try:
        # Step 1: Analyze Intent
        intent_analyzer = get_intent_analyzer()
        intent_analysis = intent_analyzer.analyze_company_intent(
            request.friction_point,
            company_size=request.company_size,
            industry=request.industry,
            technical_constraints=request.technical_constraints
        )
        
        # Step 2: Cross-reference with AI tools catalog
        data_loader = get_data_loader()
        ai_tools = data_loader.load_ai_tools_catalog()
        
        cross_ref_engine = get_cross_reference_engine()
        matches = cross_ref_engine.match_ai_tools(intent_analysis, ai_tools)
        
        # Step 3: Generate deployment instructions
        instruction_generator = get_instruction_generator()
        
        # Take top 3 matches
        top_matches = matches[:3]
        recommendations = []
        
        for tool, score in top_matches:
            deployment_info = instruction_generator.generate_deployment_guide(
                tool, intent_analysis, score
            )
            
            recommendations.append(
                AIToolRecommendation(
                    tool_id=deployment_info['tool_id'],
                    tool_name=deployment_info['tool_name'],
                    category=deployment_info['category'],
                    match_score=deployment_info['match_score'],
                    reasoning=deployment_info['reasoning'],
                    deployment_guide=deployment_info['deployment_guide'],
                    technical_truth=TechnicalBreakdown(**deployment_info['technical_truth'])
                )
            )
        
        # Generate overall strategy
        deployment_strategy = instruction_generator.generate_deployment_strategy(
            [rec.dict() for rec in recommendations],
            intent_analysis
        )
        
        # Estimate impact
        estimated_impact = instruction_generator.estimate_impact(
            intent_analysis,
            [rec.dict() for rec in recommendations]
        )
        
        return CompanyMatchResponse(
            intent_analysis=intent_analysis,
            recommendations=recommendations,
            deployment_strategy=deployment_strategy,
            estimated_impact=estimated_impact
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching error: {str(e)}")


@router.post("/individual", response_model=IndividualMatchResponse)
async def match_individual_product(request: IndividualMatchRequest):
    """
    Match individual to products
    
    Workflow B: For People
    1. Submission: Individual inputs a need
    2. Evaluation: System bypasses marketing hype
    3. Selection: Provides specific recommendation with technical breakdown
    """
    try:
        # Step 1: Analyze Intent
        intent_analyzer = get_intent_analyzer()
        intent_analysis = intent_analyzer.analyze_individual_intent(
            request.need,
            budget_range=request.budget_range,
            ecosystem_preference=request.ecosystem_preference,
            primary_use_cases=request.primary_use_cases
        )
        
        # Step 2: Cross-reference with product catalog
        data_loader = get_data_loader()
        products = data_loader.load_product_catalog()
        
        cross_ref_engine = get_cross_reference_engine()
        matches = cross_ref_engine.match_products(intent_analysis, products)
        
        # Step 3: Generate product recommendations
        instruction_generator = get_instruction_generator()
        
        # Take top 3 matches
        top_matches = matches[:3]
        recommendations = []
        
        for product, score in top_matches:
            product_info = instruction_generator.generate_product_recommendation(
                product, intent_analysis, score
            )
            
            recommendations.append(
                ProductRecommendation(
                    product_id=product_info['product_id'],
                    product_name=product_info['product_name'],
                    category=product_info['category'],
                    match_score=product_info['match_score'],
                    reasoning=product_info['reasoning'],
                    technical_specs=product_info['technical_specs'],
                    technical_truth=TechnicalBreakdown(**product_info['technical_truth'])
                )
            )
        
        # Generate buying guide
        buying_guide = instruction_generator.generate_buying_guide(
            [rec.dict() for rec in recommendations],
            intent_analysis
        )
        
        # Create comparison matrix if multiple recommendations
        comparison_matrix = None
        if len(recommendations) > 1:
            comparison_matrix = {
                'products': [rec.product_name for rec in recommendations],
                'categories': [rec.category for rec in recommendations],
                'match_scores': [rec.match_score for rec in recommendations]
            }
        
        return IndividualMatchResponse(
            intent_analysis=intent_analysis,
            recommendations=recommendations,
            comparison_matrix=comparison_matrix,
            buying_guide=buying_guide
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching error: {str(e)}")
