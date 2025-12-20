"""
CrossReferenceVault Service - Query logic vault and product ledger
Implements the 65/35 framework for matching
"""
from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


class CrossReferenceEngine:
    """
    Cross-reference engine implementing 65/35 framework:
    - 65% Structural Logic: Pattern matching from successful implementations
    - 35% Original Precision: Technical truth filtering
    """
    
    def __init__(self, structural_weight: float = 0.65, precision_weight: float = 0.35):
        self.structural_weight = structural_weight
        self.precision_weight = precision_weight
    
    def match_ai_tools(
        self,
        intent_analysis: Dict[str, Any],
        tools_catalog: List[Dict]
    ) -> List[Tuple[Dict, float]]:
        """
        Match AI tools to company requirements
        
        Args:
            intent_analysis: Analyzed intent from AnalyzeIntent service
            tools_catalog: Available AI tools
        
        Returns:
            List of (tool, score) tuples sorted by match score
        """
        matches = []
        
        for tool in tools_catalog:
            # Calculate structural logic score (65%)
            structural_score = self._calculate_structural_match(
                intent_analysis,
                tool
            )
            
            # Calculate precision score (35%)
            precision_score = self._calculate_precision_match(
                intent_analysis,
                tool
            )
            
            # Combine scores using 65/35 framework
            final_score = (
                structural_score * self.structural_weight +
                precision_score * self.precision_weight
            )
            
            matches.append((tool, final_score))
        
        # Sort by score descending
        matches.sort(key=lambda x: x[1], reverse=True)
        
        return matches
    
    def match_products(
        self,
        intent_analysis: Dict[str, Any],
        products_catalog: List[Dict]
    ) -> List[Tuple[Dict, float]]:
        """
        Match products to individual requirements
        
        Args:
            intent_analysis: Analyzed intent from AnalyzeIntent service
            products_catalog: Available products
        
        Returns:
            List of (product, score) tuples sorted by match score
        """
        matches = []
        
        for product in products_catalog:
            # Calculate structural logic score (65%)
            structural_score = self._calculate_product_structural_match(
                intent_analysis,
                product
            )
            
            # Calculate precision score (35%)
            precision_score = self._calculate_product_precision_match(
                intent_analysis,
                product
            )
            
            # Combine scores using 65/35 framework
            final_score = (
                structural_score * self.structural_weight +
                precision_score * self.precision_weight
            )
            
            matches.append((product, final_score))
        
        # Sort by score descending
        matches.sort(key=lambda x: x[1], reverse=True)
        
        return matches
    
    def _calculate_structural_match(
        self,
        intent: Dict[str, Any],
        tool: Dict
    ) -> float:
        """
        Calculate structural logic match (65% component)
        Based on pattern matching from successful implementations
        """
        score = 0.0
        weights_sum = 0.0
        
        # Match problem domain to tool specialization (weight: 0.4)
        domain_weight = 0.4
        problem_domain = intent.get('problem_domain', 'general')
        tool_category = tool.get('category', '').lower()
        
        # Domain compatibility matrix
        domain_compat = {
            'customer_support': ['general purpose llm', 'safety-focused llm'],
            'content_creation': ['general purpose llm'],
            'data_analysis': ['general purpose llm', 'safety-focused llm'],
            'code_automation': ['agentic workflow', 'general purpose llm'],
            'workflow_automation': ['agentic workflow', 'no-code integration'],
            'communication': ['general purpose llm', 'no-code integration']
        }
        
        compatible_categories = domain_compat.get(problem_domain, [tool_category])
        if tool_category in compatible_categories:
            score += domain_weight
        weights_sum += domain_weight
        
        # Match automation potential (weight: 0.3)
        automation_weight = 0.3
        automation_potential = intent.get('automation_potential', 'moderate')
        tool_automation = tool.get('matching_criteria', {}).get('automation_potential', 'moderate')
        
        automation_scores = {
            ('high', 'excellent'): 1.0,
            ('high', 'high'): 0.9,
            ('moderate', 'high'): 0.8,
            ('moderate', 'good'): 0.9,
            ('low', 'moderate'): 0.8,
            ('low', 'good'): 0.7
        }
        
        automation_score = automation_scores.get(
            (automation_potential, tool_automation),
            0.5
        )
        score += automation_score * automation_weight
        weights_sum += automation_weight
        
        # Match scalability requirement (weight: 0.3)
        scalability_weight = 0.3
        requirements = intent.get('requirements', [])
        tool_scalability = tool.get('matching_criteria', {}).get('scalability', 'moderate')
        
        if 'Scalability' in requirements:
            if tool_scalability in ['excellent', 'high']:
                score += scalability_weight
            elif tool_scalability == 'good':
                score += scalability_weight * 0.7
        else:
            # Still give partial credit
            score += scalability_weight * 0.5
        weights_sum += scalability_weight
        
        return score / weights_sum if weights_sum > 0 else 0.0
    
    def _calculate_precision_match(
        self,
        intent: Dict[str, Any],
        tool: Dict
    ) -> float:
        """
        Calculate precision match (35% component)
        Based on technical truth filtering
        """
        score = 0.0
        weights_sum = 0.0
        
        # Cost efficiency check (weight: 0.4)
        cost_weight = 0.4
        requirements = intent.get('requirements', [])
        tool_cost = tool.get('matching_criteria', {}).get('cost_efficiency', 'moderate')
        
        if 'Cost_Efficiency' in requirements:
            if tool_cost in ['excellent', 'good']:
                score += cost_weight
            elif tool_cost == 'moderate':
                score += cost_weight * 0.5
        else:
            # Neutral if cost not a concern
            score += cost_weight * 0.5
        weights_sum += cost_weight
        
        # API compatibility (weight: 0.3)
        api_weight = 0.3
        if 'API_Compatibility' in requirements:
            api_compat = tool.get('matching_criteria', {}).get('api_compatibility', '')
            if 'API' in api_compat or 'REST' in api_compat:
                score += api_weight
        else:
            score += api_weight * 0.5
        weights_sum += api_weight
        
        # Technical truth alignment (weight: 0.3)
        truth_weight = 0.3
        technical_truth = tool.get('technical_truth', {})
        
        # Check if limitations are acceptable
        limitations = technical_truth.get('limitation', '').lower()
        constraints = intent.get('constraints', [])
        
        # Penalize if tool has conflicting limitations
        has_conflict = False
        if 'cloud-only' in limitations and 'on-premise' in str(constraints).lower():
            has_conflict = True
        
        if not has_conflict:
            score += truth_weight
        weights_sum += truth_weight
        
        return score / weights_sum if weights_sum > 0 else 0.0
    
    def _calculate_product_structural_match(
        self,
        intent: Dict[str, Any],
        product: Dict
    ) -> float:
        """
        Calculate structural logic match for products (65% component)
        """
        score = 0.0
        weights_sum = 0.0
        
        # Match use case (weight: 0.4)
        use_case_weight = 0.4
        user_use_case = intent.get('use_case', 'general_use')
        product_category = product.get('category', '').lower()
        
        # Use case to category mapping
        use_case_mapping = {
            'ml_development': ['extreme performance'],
            'video_editing': ['extreme performance', 'precision creativity'],
            'creative_work': ['precision creativity'],
            'software_development': ['extreme performance', 'ecosystem synergy'],
            'gaming': ['extreme performance'],
            'general_productivity': ['ecosystem synergy', 'precision creativity']
        }
        
        suitable_categories = use_case_mapping.get(user_use_case, [])
        if any(cat in product_category for cat in suitable_categories):
            score += use_case_weight
        else:
            score += use_case_weight * 0.5
        weights_sum += use_case_weight
        
        # Match technical requirements (weight: 0.4)
        tech_req_weight = 0.4
        tech_requirements = intent.get('technical_requirements', {})
        product_criteria = product.get('matching_criteria', {})
        
        tech_score = 0.0
        tech_checks = 0
        
        # Performance check
        if tech_requirements.get('performance', False):
            perf_tier = product_criteria.get('performance_tier', 'moderate')
            if perf_tier in ['extreme', 'high']:
                tech_score += 1.0
            tech_checks += 1
        
        # GPU/Graphics check
        if tech_requirements.get('graphics', False) or tech_requirements.get('ml_ai', False):
            gpu_power = product_criteria.get('gpu_power', 'moderate')
            if gpu_power == 'high':
                tech_score += 1.0
            tech_checks += 1
        
        # Portability check
        if tech_requirements.get('portability', False):
            portability = product_criteria.get('portability', 'moderate')
            if portability in ['excellent', 'good']:
                tech_score += 1.0
            tech_checks += 1
        
        if tech_checks > 0:
            score += (tech_score / tech_checks) * tech_req_weight
        else:
            score += tech_req_weight * 0.5
        weights_sum += tech_req_weight
        
        # Match ecosystem preference (weight: 0.2)
        ecosystem_weight = 0.2
        user_context = intent.get('user_context', {})
        ecosystem_pref = user_context.get('ecosystem_preference', 'agnostic')
        product_ecosystem = product_criteria.get('ecosystem', 'agnostic')
        
        if ecosystem_pref == 'agnostic' or ecosystem_pref == product_ecosystem:
            score += ecosystem_weight
        elif ecosystem_pref != product_ecosystem:
            score += ecosystem_weight * 0.3  # Penalty for mismatch
        weights_sum += ecosystem_weight
        
        return score / weights_sum if weights_sum > 0 else 0.0
    
    def _calculate_product_precision_match(
        self,
        intent: Dict[str, Any],
        product: Dict
    ) -> float:
        """
        Calculate precision match for products (35% component)
        Technical truth filtering
        """
        score = 0.0
        weights_sum = 0.0
        
        # Budget alignment (weight: 0.4)
        budget_weight = 0.4
        user_context = intent.get('user_context', {})
        budget_range = user_context.get('budget_range', 'unknown')
        product_price = product.get('matching_criteria', {}).get('price_range', 'premium')
        
        budget_compat = {
            'budget': ['budget', 'mid-range'],
            'mid-range': ['budget', 'mid-range', 'premium'],
            'premium': ['mid-range', 'premium'],
            'unlimited': ['budget', 'mid-range', 'premium']
        }
        
        compatible_prices = budget_compat.get(budget_range, ['premium'])
        if product_price in compatible_prices:
            score += budget_weight
        else:
            score += budget_weight * 0.3
        weights_sum += budget_weight
        
        # Priority alignment (weight: 0.3)
        priority_weight = 0.3
        priorities = intent.get('priorities', [])
        
        if 'performance' in priorities:
            perf_tier = product.get('matching_criteria', {}).get('performance_tier', 'moderate')
            if perf_tier in ['extreme', 'high']:
                score += priority_weight
        elif 'portability' in priorities:
            portability = product.get('matching_criteria', {}).get('portability', 'moderate')
            if portability in ['excellent', 'good']:
                score += priority_weight
        else:
            score += priority_weight * 0.5
        weights_sum += priority_weight
        
        # Technical truth verification (weight: 0.3)
        truth_weight = 0.3
        technical_truth = product.get('technical_truth', {})
        
        # Verify that strengths align with needs
        strength = technical_truth.get('strength', '').lower()
        ideal_for = technical_truth.get('ideal_for', '').lower()
        
        user_use_case = intent.get('use_case', '').lower()
        
        # Check if product is ideal for this use case
        if any(term in ideal_for for term in user_use_case.split('_')):
            score += truth_weight
        else:
            score += truth_weight * 0.5
        weights_sum += truth_weight
        
        return score / weights_sum if weights_sum > 0 else 0.0


# Singleton instance
_cross_reference_engine = None


def get_cross_reference_engine() -> CrossReferenceEngine:
    """Get singleton cross-reference engine instance"""
    global _cross_reference_engine
    if _cross_reference_engine is None:
        _cross_reference_engine = CrossReferenceEngine()
    return _cross_reference_engine
