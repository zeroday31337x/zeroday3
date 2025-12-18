import StructuralMatcher from '../services/matching-engine/structural-matcher';

describe('StructuralMatcher', () => {
  let matcher: StructuralMatcher;

  beforeEach(() => {
    matcher = new StructuralMatcher();
  });

  describe('matchWorkflowToCompany', () => {
    it('should return high score for well-matched workflow and company', async () => {
      const workflow = {
        id: 'test-workflow',
        category: 'Enterprise AI',
        structural_skeleton: {
          targetIndustries: ['Technology', 'Software'],
          companySizes: ['medium', 'large'],
          technicalRequirements: ['API', 'Cloud', 'Scalability'],
        },
        requirements: {
          features: ['API integration', 'Scalability'],
          capabilities: ['Cloud deployment'],
        },
        success_pattern: {
          optimalCompanySize: 'medium',
          industrySuccessRates: {
            Technology: 0.85,
            Software: 0.82,
          },
        },
      };

      const company = {
        id: 'test-company',
        industry: 'Technology',
        size: 'medium',
        requirements: ['API integration', 'Scalability', 'Cloud deployment'],
      };

      const result = await matcher.matchWorkflowToCompany(workflow, company);

      expect(result.score).toBeGreaterThan(0.7);
      expect(result.factors).toBeDefined();
      expect(result.factors.patternMatch).toBeGreaterThan(0);
      expect(result.factors.categoryAlignment).toBeGreaterThan(0);
      expect(result.reasoning).toBeInstanceOf(Array);
      expect(result.reasoning.length).toBeGreaterThan(0);
    });

    it('should return lower score for poorly matched workflow and company', async () => {
      const workflow = {
        id: 'test-workflow',
        category: 'Healthcare',
        structural_skeleton: {
          targetIndustries: ['Healthcare', 'Medical'],
          companySizes: ['small'],
          technicalRequirements: ['Compliance', 'Security'],
        },
        requirements: {},
        success_pattern: {},
      };

      const company = {
        id: 'test-company',
        industry: 'Retail',
        size: 'enterprise',
        requirements: ['E-commerce', 'Payment processing'],
      };

      const result = await matcher.matchWorkflowToCompany(workflow, company);

      expect(result.score).toBeLessThan(0.7);
    });
  });

  describe('matchProductToUser', () => {
    it('should return high score for well-matched product and user', async () => {
      const product = {
        id: 'test-product',
        category: 'Productivity',
        technical_specs: {
          requiredSkills: ['JavaScript', 'React'],
          complexity: 'medium',
        },
        verified_features: ['API Access', 'Cloud Sync'],
      };

      const user = {
        id: 'test-user',
        skills: ['JavaScript', 'React', 'TypeScript'],
        preferences: {
          categories: ['Productivity', 'Development'],
          needs: ['API Access', 'Cloud Sync'],
          experienceLevel: 'intermediate',
        },
      };

      const result = await matcher.matchProductToUser(product, user);

      expect(result.score).toBeGreaterThan(0.6);
      expect(result.factors).toBeDefined();
      expect(result.reasoning).toBeInstanceOf(Array);
    });
  });

  describe('getWeight', () => {
    it('should return 0.65 as the structural matcher weight', () => {
      expect(matcher.getWeight()).toBe(0.65);
    });
  });
});
