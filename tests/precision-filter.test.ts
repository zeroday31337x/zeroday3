import PrecisionFilter from '../services/matching-engine/precision-filter';

describe('PrecisionFilter', () => {
  let filter: PrecisionFilter;

  beforeEach(() => {
    filter = new PrecisionFilter();
  });

  describe('filterWorkflowMatch', () => {
    it('should penalize heavy marketing language', async () => {
      const workflow = {
        id: 'test-workflow',
        name: 'Revolutionary Game-Changing Solution',
        description: 'Best-in-class cutting-edge next-generation seamless effortless platform',
        requirements: {},
      };

      const company = {
        id: 'test-company',
      };

      const result = await filter.filterWorkflowMatch(workflow, company, 0.8);

      expect(result.filters.marketingNoiseReduction).toBeLessThan(0.7);
      expect(result.flagged.length).toBeGreaterThan(0);
    });

    it('should reward technical content', async () => {
      const workflow = {
        id: 'test-workflow',
        name: 'Enterprise API Integration',
        description: 'RESTful API with OAuth authentication, horizontal scalability, and comprehensive SDK',
        technical_specs: {
          api: 'REST',
          authentication: 'OAuth 2.0',
          deployment: 'Kubernetes',
        },
        requirements: {},
      };

      const company = {
        id: 'test-company',
      };

      const result = await filter.filterWorkflowMatch(workflow, company, 0.8);

      expect(result.filters.technicalValidation).toBeGreaterThan(0.6);
      expect(result.verified.length).toBeGreaterThan(0);
    });

    it('should detect impossible claims', async () => {
      const workflow = {
        id: 'test-workflow',
        description: 'Provides zero downtime with 100% accurate results and infinite scale',
        requirements: {},
      };

      const company = {
        id: 'test-company',
      };

      const result = await filter.filterWorkflowMatch(workflow, company, 0.8);

      expect(result.filters.hallucinationDetection).toBeLessThan(1.0);
    });
  });

  describe('filterProductMatch', () => {
    it('should filter marketing noise in products', async () => {
      const product = {
        id: 'test-product',
        name: 'Ultimate Revolutionary Tool',
        description: 'Industry-leading synergy-driven paradigm shift',
      };

      const user = {
        id: 'test-user',
      };

      const result = await filter.filterProductMatch(product, user, 0.7);

      expect(result.filters.marketingNoiseReduction).toBeLessThan(0.7);
    });
  });

  describe('getWeight', () => {
    it('should return 0.35 as the precision filter weight', () => {
      expect(filter.getWeight()).toBe(0.35);
    });
  });
});
