"""
AnalyzeIntent Service - Parse and categorize user input
Determines whether request is Company or Individual track
"""
from typing import Dict, List, Any
import re


class IntentAnalyzer:
    """Analyze user intent and categorize requests"""
    
    # Keywords for company track identification
    COMPANY_KEYWORDS = [
        'company', 'business', 'enterprise', 'organization', 'team',
        'customer support', 'workflow', 'automation', 'scale', 'deployment',
        'api', 'integration', 'productivity', 'efficiency', 'operations',
        'staff', 'employees', 'clients', 'customers'
    ]
    
    # Keywords for individual track identification
    INDIVIDUAL_KEYWORDS = [
        'laptop', 'computer', 'device', 'hardware', 'personal', 'buy',
        'purchase', 'need', 'want', 'looking for', 'recommend',
        'best', 'gaming', 'video editing', 'development', 'creative work',
        'portable', 'performance'
    ]
    
    # Technical requirement indicators
    TECHNICAL_INDICATORS = {
        'performance': ['fast', 'powerful', 'high-end', 'performance', 'speed'],
        'portability': ['portable', 'lightweight', 'travel', 'mobile'],
        'graphics': ['gpu', 'graphics', 'rendering', 'video', 'gaming', '3d'],
        'ml_ai': ['machine learning', 'ai', 'ml', 'model training', 'deep learning'],
        'battery': ['battery', 'battery life', 'unplugged'],
        'display': ['display', 'screen', 'monitor', '4k', '8k', 'color accuracy'],
        'ecosystem': ['apple', 'windows', 'samsung', 'ecosystem', 'integration']
    }
    
    def analyze_company_intent(self, friction_point: str, **kwargs) -> Dict[str, Any]:
        """
        Analyze company workflow friction point
        
        Args:
            friction_point: Description of the business problem
            **kwargs: Additional context (company_size, industry, etc.)
        
        Returns:
            Dictionary with intent analysis
        """
        text_lower = friction_point.lower()
        
        # Identify problem domain
        problem_domain = self._identify_problem_domain(text_lower)
        
        # Extract key requirements
        requirements = self._extract_requirements(text_lower)
        
        # Determine automation potential
        automation_level = self._assess_automation_potential(text_lower)
        
        # Identify technical constraints
        constraints = kwargs.get('technical_constraints', [])
        
        return {
            'track_type': 'company',
            'problem_domain': problem_domain,
            'requirements': requirements,
            'automation_potential': automation_level,
            'constraints': constraints,
            'company_context': {
                'size': kwargs.get('company_size', 'unknown'),
                'industry': kwargs.get('industry', 'unknown')
            },
            'complexity_score': self._calculate_complexity(text_lower)
        }
    
    def analyze_individual_intent(self, need: str, **kwargs) -> Dict[str, Any]:
        """
        Analyze individual product need
        
        Args:
            need: Description of what the individual needs
            **kwargs: Additional context (budget, ecosystem, etc.)
        
        Returns:
            Dictionary with intent analysis
        """
        text_lower = need.lower()
        
        # Identify use case category
        use_case = self._identify_use_case(text_lower)
        
        # Extract technical requirements
        tech_requirements = self._extract_technical_requirements(text_lower)
        
        # Determine priority factors
        priorities = self._determine_priorities(text_lower)
        
        return {
            'track_type': 'individual',
            'use_case': use_case,
            'technical_requirements': tech_requirements,
            'priorities': priorities,
            'user_context': {
                'budget_range': kwargs.get('budget_range', 'unknown'),
                'ecosystem_preference': kwargs.get('ecosystem_preference', 'agnostic'),
                'primary_use_cases': kwargs.get('primary_use_cases', [])
            },
            'sophistication_level': self._assess_user_sophistication(text_lower)
        }
    
    def _identify_problem_domain(self, text: str) -> str:
        """Identify the business problem domain"""
        domains = {
            'customer_support': ['customer support', 'support ticket', 'help desk', 'customer service'],
            'content_creation': ['content', 'writing', 'blog', 'marketing copy', 'social media'],
            'data_analysis': ['data analysis', 'analytics', 'insights', 'reporting', 'dashboard'],
            'code_automation': ['code', 'development', 'programming', 'testing', 'devops'],
            'workflow_automation': ['workflow', 'process', 'automation', 'task'],
            'communication': ['communication', 'email', 'messaging', 'collaboration']
        }
        
        for domain, keywords in domains.items():
            if any(keyword in text for keyword in keywords):
                return domain
        
        return 'general'
    
    def _extract_requirements(self, text: str) -> List[str]:
        """Extract key requirements from text"""
        requirements = []
        
        if any(word in text for word in ['api', 'integration', 'connect']):
            requirements.append('API_Compatibility')
        
        if any(word in text for word in ['automate', 'automation', 'automatic']):
            requirements.append('Task_Automation_Potential')
        
        if any(word in text for word in ['scale', 'growth', 'volume', 'many']):
            requirements.append('Scalability')
        
        if any(word in text for word in ['custom', 'specific', 'tailored']):
            requirements.append('Customization')
        
        if any(word in text for word in ['cost', 'budget', 'affordable', 'cheap']):
            requirements.append('Cost_Efficiency')
        
        return requirements if requirements else ['General_Purpose']
    
    def _assess_automation_potential(self, text: str) -> str:
        """Assess how much automation is needed"""
        if any(word in text for word in ['fully automate', 'completely automate', 'no human']):
            return 'high'
        elif any(word in text for word in ['help', 'assist', 'support', 'augment']):
            return 'moderate'
        else:
            return 'low'
    
    def _calculate_complexity(self, text: str) -> float:
        """Calculate problem complexity score (0-1)"""
        complexity_indicators = [
            'multiple', 'complex', 'advanced', 'sophisticated',
            'integration', 'custom', 'enterprise', 'large-scale'
        ]
        
        matches = sum(1 for indicator in complexity_indicators if indicator in text)
        return min(matches / len(complexity_indicators), 1.0)
    
    def _identify_use_case(self, text: str) -> str:
        """Identify primary use case for individual"""
        use_cases = {
            'ml_development': ['machine learning', 'ai development', 'model training', 'data science'],
            'video_editing': ['video editing', '8k', '4k', 'video production', 'premiere'],
            'creative_work': ['design', 'creative', 'photoshop', 'illustration', 'art'],
            'software_development': ['coding', 'programming', 'development', 'developer', 'ide'],
            'gaming': ['gaming', 'games', 'gamer'],
            'general_productivity': ['productivity', 'office', 'work', 'email', 'documents']
        }
        
        for use_case, keywords in use_cases.items():
            if any(keyword in text for keyword in keywords):
                return use_case
        
        return 'general_use'
    
    def _extract_technical_requirements(self, text: str) -> Dict[str, bool]:
        """Extract technical requirements"""
        requirements = {}
        
        for req_type, keywords in self.TECHNICAL_INDICATORS.items():
            requirements[req_type] = any(keyword in text for keyword in keywords)
        
        return requirements
    
    def _determine_priorities(self, text: str) -> List[str]:
        """Determine what's most important to the user"""
        priorities = []
        
        # Check for explicit priorities
        if 'most important' in text or 'priority' in text:
            # Extract what comes after these phrases
            pass
        
        # Infer from emphasis
        if any(word in text for word in ['best', 'top', 'highest', 'maximum']):
            priorities.append('performance')
        
        if any(word in text for word in ['portable', 'light', 'travel']):
            priorities.append('portability')
        
        if any(word in text for word in ['budget', 'affordable', 'cheap', 'value']):
            priorities.append('cost')
        
        if any(word in text for word in ['battery', 'unplugged', 'battery life']):
            priorities.append('battery_life')
        
        return priorities if priorities else ['balanced']
    
    def _assess_user_sophistication(self, text: str) -> str:
        """Assess user's technical sophistication"""
        technical_terms = [
            'gpu', 'cpu', 'vram', 'cuda', 'thunderbolt', 'pcie',
            'ml', 'tensorflow', 'pytorch', 'llm', 'api'
        ]
        
        matches = sum(1 for term in technical_terms if term in text)
        
        if matches >= 3:
            return 'expert'
        elif matches >= 1:
            return 'intermediate'
        else:
            return 'beginner'


# Singleton instance
_intent_analyzer = None


def get_intent_analyzer() -> IntentAnalyzer:
    """Get singleton intent analyzer instance"""
    global _intent_analyzer
    if _intent_analyzer is None:
        _intent_analyzer = IntentAnalyzer()
    return _intent_analyzer
