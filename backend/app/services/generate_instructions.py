"""
GenerateInstructions Service - Create deployment guides and recommendations
"""
from typing import Dict, List, Any


class InstructionGenerator:
    """Generate deployment guides and product recommendations"""
    
    def generate_deployment_guide(
        self,
        tool: Dict,
        intent_analysis: Dict[str, Any],
        match_score: float
    ) -> Dict[str, Any]:
        """
        Generate deployment guide for an AI tool
        
        Args:
            tool: Selected AI tool
            intent_analysis: User's intent analysis
            match_score: Matching score
        
        Returns:
            Comprehensive deployment guide
        """
        tool_name = tool.get('name', 'Unknown Tool')
        deployment_guide = tool.get('deployment_guide', {})
        technical_truth = tool.get('technical_truth', {})
        
        # Generate reasoning
        reasoning = self._generate_tool_reasoning(tool, intent_analysis, match_score)
        
        # Create custom instruction set
        custom_instructions = self._create_custom_instructions(
            tool,
            intent_analysis
        )
        
        return {
            'tool_id': tool.get('id'),
            'tool_name': tool_name,
            'category': tool.get('category'),
            'match_score': match_score,
            'reasoning': reasoning,
            'deployment_guide': {
                'setup_steps': deployment_guide.get('setup_steps', []),
                'best_practices': deployment_guide.get('best_practices', []),
                'custom_instructions': custom_instructions
            },
            'technical_truth': {
                'strength': technical_truth.get('strength', ''),
                'limitation': technical_truth.get('limitation', ''),
                'ideal_for': technical_truth.get('ideal_for', '')
            }
        }
    
    def generate_product_recommendation(
        self,
        product: Dict,
        intent_analysis: Dict[str, Any],
        match_score: float
    ) -> Dict[str, Any]:
        """
        Generate product recommendation
        
        Args:
            product: Selected product
            intent_analysis: User's intent analysis
            match_score: Matching score
        
        Returns:
            Detailed product recommendation
        """
        product_name = product.get('name', 'Unknown Product')
        technical_truth = product.get('technical_truth', {})
        
        # Generate reasoning
        reasoning = self._generate_product_reasoning(product, intent_analysis, match_score)
        
        return {
            'product_id': product.get('id'),
            'product_name': product_name,
            'category': product.get('category'),
            'match_score': match_score,
            'reasoning': reasoning,
            'technical_specs': product.get('technical_specs', {}),
            'technical_truth': {
                'strength': technical_truth.get('strength', ''),
                'limitation': technical_truth.get('limitation', ''),
                'ideal_for': technical_truth.get('ideal_for', '')
            }
        }
    
    def generate_deployment_strategy(
        self,
        recommendations: List[Dict],
        intent_analysis: Dict[str, Any]
    ) -> str:
        """
        Generate overall deployment strategy for company
        
        Args:
            recommendations: List of tool recommendations
            intent_analysis: Intent analysis
        
        Returns:
            Deployment strategy text
        """
        if not recommendations:
            return "No suitable tools found for this use case."
        
        top_tool = recommendations[0]
        problem_domain = intent_analysis.get('problem_domain', 'general')
        automation_potential = intent_analysis.get('automation_potential', 'moderate')
        company_size = intent_analysis.get('company_context', {}).get('size', 'unknown')
        
        strategy_parts = []
        
        # Introduction
        strategy_parts.append(
            f"Recommended solution for {problem_domain} optimization using {top_tool['tool_name']}."
        )
        
        # Deployment approach
        if automation_potential == 'high':
            strategy_parts.append(
                "Deploy with full automation pipeline including monitoring, fallback handling, "
                "and continuous improvement loops."
            )
        elif automation_potential == 'moderate':
            strategy_parts.append(
                "Deploy in human-in-the-loop mode with AI assistance. "
                "Gradually increase automation as confidence and metrics improve."
            )
        else:
            strategy_parts.append(
                "Deploy as an assistant tool with human oversight. "
                "Focus on augmenting rather than replacing existing processes."
            )
        
        # Scale considerations
        if company_size in ['enterprise', 'large']:
            strategy_parts.append(
                "For enterprise deployment: Start with pilot team, measure impact, "
                "then roll out incrementally with proper change management."
            )
        elif company_size in ['medium', 'small']:
            strategy_parts.append(
                "Quick deployment recommended: Low overhead setup, fast iteration, "
                "measure ROI early and often."
            )
        
        # Integration notes
        if len(recommendations) > 1:
            strategy_parts.append(
                f"Consider supplementing with {recommendations[1]['tool_name']} "
                f"for {recommendations[1]['category']} capabilities."
            )
        
        return " ".join(strategy_parts)
    
    def generate_buying_guide(
        self,
        recommendations: List[Dict],
        intent_analysis: Dict[str, Any]
    ) -> str:
        """
        Generate buying guide for individual
        
        Args:
            recommendations: List of product recommendations
            intent_analysis: Intent analysis
        
        Returns:
            Buying guide text
        """
        if not recommendations:
            return "No suitable products found matching your criteria."
        
        top_product = recommendations[0]
        use_case = intent_analysis.get('use_case', 'general_use')
        sophistication = intent_analysis.get('sophistication_level', 'intermediate')
        
        guide_parts = []
        
        # Primary recommendation
        guide_parts.append(
            f"Top recommendation: {top_product['product_name']} "
            f"({top_product['category']})"
        )
        
        # Why this product
        guide_parts.append(
            f"This device excels at {use_case.replace('_', ' ')} with "
            f"{top_product['technical_truth']['strength']}"
        )
        
        # Key considerations
        guide_parts.append(
            f"Important to know: {top_product['technical_truth']['limitation']}"
        )
        
        # Alternatives
        if len(recommendations) > 1:
            alt_product = recommendations[1]
            guide_parts.append(
                f"Alternative option: {alt_product['product_name']} offers "
                f"{alt_product['category']} if you need "
                f"different trade-offs."
            )
        
        # Final advice
        if sophistication == 'expert':
            guide_parts.append(
                "As an expert user, you'll appreciate the technical capabilities "
                "and be able to leverage advanced features."
            )
        elif sophistication == 'beginner':
            guide_parts.append(
                "This recommendation prioritizes ease of use while still providing "
                "room to grow into advanced features."
            )
        
        return " ".join(guide_parts)
    
    def estimate_impact(
        self,
        intent_analysis: Dict[str, Any],
        recommendations: List[Dict]
    ) -> str:
        """
        Estimate business impact of implementing recommendation
        
        Args:
            intent_analysis: Intent analysis
            recommendations: Tool recommendations
        
        Returns:
            Impact estimation text
        """
        if not recommendations:
            return "Unable to estimate impact without suitable tools."
        
        automation_potential = intent_analysis.get('automation_potential', 'moderate')
        problem_domain = intent_analysis.get('problem_domain', 'general')
        
        impact_estimates = {
            'customer_support': {
                'high': 'Expected 60-80% reduction in response time, 40-60% reduction in support costs',
                'moderate': 'Expected 30-50% improvement in response quality, 20-30% efficiency gain',
                'low': 'Expected 15-25% time savings for support agents'
            },
            'content_creation': {
                'high': 'Expected 70-85% reduction in content creation time, 50-70% increase in output',
                'moderate': 'Expected 40-60% faster content production, improved consistency',
                'low': 'Expected 20-30% time savings, better ideation support'
            },
            'workflow_automation': {
                'high': 'Expected 80-95% automation of repetitive tasks, significant error reduction',
                'moderate': 'Expected 50-70% time savings on automated workflows',
                'low': 'Expected 25-40% efficiency improvement in selected processes'
            }
        }
        
        domain_estimates = impact_estimates.get(
            problem_domain,
            {
                'high': 'Expected 50-70% efficiency improvement',
                'moderate': 'Expected 30-50% productivity gain',
                'low': 'Expected 15-30% time savings'
            }
        )
        
        return domain_estimates.get(automation_potential, 'Impact varies by implementation')
    
    def _generate_tool_reasoning(
        self,
        tool: Dict,
        intent_analysis: Dict[str, Any],
        match_score: float
    ) -> str:
        """Generate reasoning for tool selection"""
        reasons = []
        
        # Score explanation
        score_pct = int(match_score * 100)
        reasons.append(f"Match confidence: {score_pct}%")
        
        # Domain alignment
        problem_domain = intent_analysis.get('problem_domain', 'general')
        reasons.append(
            f"Specialized for {problem_domain} with {tool.get('category')} capabilities"
        )
        
        # Key strength
        strength = tool.get('technical_truth', {}).get('strength', '')
        if strength:
            reasons.append(f"Key advantage: {strength}")
        
        # Automation fit
        automation_potential = intent_analysis.get('automation_potential', 'moderate')
        tool_automation = tool.get('matching_criteria', {}).get('automation_potential', 'moderate')
        if tool_automation in ['excellent', 'high']:
            reasons.append(f"Strong automation capabilities matching {automation_potential} needs")
        
        return ". ".join(reasons) + "."
    
    def _generate_product_reasoning(
        self,
        product: Dict,
        intent_analysis: Dict[str, Any],
        match_score: float
    ) -> str:
        """Generate reasoning for product selection"""
        reasons = []
        
        # Score explanation
        score_pct = int(match_score * 100)
        reasons.append(f"Match confidence: {score_pct}%")
        
        # Use case alignment
        use_case = intent_analysis.get('use_case', 'general_use')
        reasons.append(
            f"Optimized for {use_case.replace('_', ' ')} in {product.get('category')} category"
        )
        
        # Key strength
        strength = product.get('technical_truth', {}).get('strength', '')
        if strength:
            reasons.append(f"Technical advantage: {strength}")
        
        # Priority match
        priorities = intent_analysis.get('priorities', [])
        criteria = product.get('matching_criteria', {})
        
        if 'performance' in priorities and criteria.get('performance_tier') in ['extreme', 'high']:
            reasons.append("Delivers extreme performance as prioritized")
        elif 'portability' in priorities and criteria.get('portability') in ['excellent', 'good']:
            reasons.append("Offers excellent portability as needed")
        
        return ". ".join(reasons) + "."
    
    def _create_custom_instructions(
        self,
        tool: Dict,
        intent_analysis: Dict[str, Any]
    ) -> List[str]:
        """Create custom deployment instructions based on specific use case"""
        base_steps = tool.get('deployment_guide', {}).get('setup_steps', [])
        custom_steps = []
        
        problem_domain = intent_analysis.get('problem_domain', 'general')
        
        # Add domain-specific instructions
        if problem_domain == 'customer_support':
            custom_steps.append(
                "Configure response templates aligned with your brand voice"
            )
            custom_steps.append(
                "Set up escalation paths for complex queries the AI cannot handle"
            )
        elif problem_domain == 'content_creation':
            custom_steps.append(
                "Create style guide prompts for consistent content output"
            )
            custom_steps.append(
                "Implement review workflow for AI-generated content"
            )
        elif problem_domain == 'workflow_automation':
            custom_steps.append(
                "Map existing workflow steps and identify automation points"
            )
            custom_steps.append(
                "Set up monitoring for automated task success rates"
            )
        
        # Add company size considerations
        company_size = intent_analysis.get('company_context', {}).get('size', 'unknown')
        if company_size == 'enterprise':
            custom_steps.append(
                "Coordinate with IT security for enterprise policy compliance"
            )
            custom_steps.append(
                "Plan phased rollout with pilot groups before full deployment"
            )
        
        return custom_steps


# Singleton instance
_instruction_generator = None


def get_instruction_generator() -> InstructionGenerator:
    """Get singleton instruction generator instance"""
    global _instruction_generator
    if _instruction_generator is None:
        _instruction_generator = InstructionGenerator()
    return _instruction_generator
