/**
 * Structural Matcher - 65% Logic Component
 * 
 * Analyzes workflow skeletons and patterns from successful implementations
 * to match companies with appropriate workflows and users with products.
 */

export interface StructuralScore {
  score: number;
  factors: {
    patternMatch: number;
    categoryAlignment: number;
    requirementsFit: number;
    successProbability: number;
  };
  reasoning: string[];
}

export class StructuralMatcher {
  private readonly weight: number = 0.65;

  /**
   * Match a workflow to a company based on structural patterns
   */
  async matchWorkflowToCompany(
    workflow: any,
    company: any
  ): Promise<StructuralScore> {
    const factors = {
      patternMatch: this.calculatePatternMatch(workflow, company),
      categoryAlignment: this.calculateCategoryAlignment(workflow, company),
      requirementsFit: this.calculateRequirementsFit(workflow, company),
      successProbability: this.calculateSuccessProbability(workflow, company),
    };

    const score = Object.values(factors).reduce((sum, val) => sum + val, 0) / 4;
    
    const reasoning = this.generateReasoning(factors, workflow, company);

    return { score, factors, reasoning };
  }

  /**
   * Match a product to a user based on structural compatibility
   */
  async matchProductToUser(
    product: any,
    user: any
  ): Promise<StructuralScore> {
    const factors = {
      patternMatch: this.calculateUserProductPatternMatch(product, user),
      categoryAlignment: this.calculateUserCategoryAlignment(product, user),
      requirementsFit: this.calculateUserRequirementsFit(product, user),
      successProbability: this.calculateUserSuccessProbability(product, user),
    };

    const score = Object.values(factors).reduce((sum, val) => sum + val, 0) / 4;
    
    const reasoning = this.generateUserReasoning(factors, product, user);

    return { score, factors, reasoning };
  }

  /**
   * Calculate pattern match based on structural skeleton analysis
   */
  private calculatePatternMatch(workflow: any, company: any): number {
    if (!workflow.structural_skeleton || !company.requirements) {
      return 0.5; // Neutral score if data is missing
    }

    const skeleton = workflow.structural_skeleton;
    const requirements = company.requirements;

    // Check for industry-specific patterns
    let matchScore = 0;
    let totalChecks = 0;

    // Pattern 1: Industry alignment
    if (skeleton.targetIndustries?.includes(company.industry)) {
      matchScore += 1;
    }
    totalChecks++;

    // Pattern 2: Company size compatibility
    if (skeleton.companySizes?.includes(company.size)) {
      matchScore += 1;
    }
    totalChecks++;

    // Pattern 3: Technical requirements overlap
    const techOverlap = this.calculateOverlap(
      skeleton.technicalRequirements || [],
      requirements
    );
    matchScore += techOverlap;
    totalChecks++;

    return totalChecks > 0 ? matchScore / totalChecks : 0.5;
  }

  /**
   * Calculate category alignment score
   */
  private calculateCategoryAlignment(workflow: any, company: any): number {
    const workflowCategory = workflow.category?.toLowerCase() || '';
    const companyIndustry = company.industry?.toLowerCase() || '';

    // Direct category match
    if (workflowCategory === companyIndustry) {
      return 1.0;
    }

    // Related categories (simplified mapping)
    const categoryMappings: Record<string, string[]> = {
      'enterprise': ['technology', 'software', 'saas'],
      'healthcare': ['medical', 'biotech', 'pharmaceutical'],
      'finance': ['banking', 'fintech', 'insurance'],
      'retail': ['ecommerce', 'consumer', 'marketplace'],
    };

    for (const [key, related] of Object.entries(categoryMappings)) {
      if (
        (workflowCategory.includes(key) && related.some(r => companyIndustry.includes(r))) ||
        (companyIndustry.includes(key) && related.some(r => workflowCategory.includes(r)))
      ) {
        return 0.75;
      }
    }

    return 0.4; // Low but not zero for unrelated categories
  }

  /**
   * Calculate requirements fit
   */
  private calculateRequirementsFit(workflow: any, company: any): number {
    const workflowReqs = workflow.requirements || {};
    const companyReqs = company.requirements || [];

    if (companyReqs.length === 0) {
      return 0.5; // Neutral if no requirements specified
    }

    let matchedReqs = 0;
    for (const req of companyReqs) {
      if (this.requirementMet(req, workflowReqs)) {
        matchedReqs++;
      }
    }

    return companyReqs.length > 0 ? matchedReqs / companyReqs.length : 0.5;
  }

  /**
   * Calculate success probability based on historical patterns
   */
  private calculateSuccessProbability(workflow: any, company: any): number {
    const successPattern = workflow.success_pattern || {};
    
    // Base probability
    let probability = 0.5;

    // Adjust based on company size alignment
    if (successPattern.optimalCompanySize === company.size) {
      probability += 0.2;
    }

    // Adjust based on industry success rate
    if (successPattern.industrySuccessRates?.[company.industry]) {
      const industryRate = successPattern.industrySuccessRates[company.industry];
      probability = (probability + industryRate) / 2;
    }

    return Math.min(probability, 1.0);
  }

  /**
   * Helper: Calculate overlap between two arrays
   */
  private calculateOverlap(arr1: any[], arr2: any[]): number {
    if (arr1.length === 0 || arr2.length === 0) return 0;
    
    const set1 = new Set(arr1.map(item => typeof item === 'string' ? item.toLowerCase() : item));
    const set2 = new Set(arr2.map(item => typeof item === 'string' ? item.toLowerCase() : item));
    
    let overlap = 0;
    for (const item of set1) {
      if (set2.has(item)) overlap++;
    }
    
    return overlap / Math.max(set1.size, set2.size);
  }

  /**
   * Helper: Check if requirement is met
   */
  private requirementMet(requirement: string, workflowReqs: any): boolean {
    const reqLower = requirement.toLowerCase();
    
    // Check in various workflow requirement fields
    const checkFields = ['features', 'capabilities', 'technologies', 'integrations'];
    
    for (const field of checkFields) {
      if (workflowReqs[field]) {
        const values = Array.isArray(workflowReqs[field]) 
          ? workflowReqs[field] 
          : [workflowReqs[field]];
        
        if (values.some((v: any) => 
          typeof v === 'string' && v.toLowerCase().includes(reqLower)
        )) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Generate reasoning for the match
   */
  private generateReasoning(factors: any, workflow: any, company: any): string[] {
    const reasoning: string[] = [];

    if (factors.patternMatch > 0.7) {
      reasoning.push(`Strong pattern match: Workflow aligns well with company's structural requirements`);
    } else if (factors.patternMatch > 0.4) {
      reasoning.push(`Moderate pattern match: Some structural alignment present`);
    }

    if (factors.categoryAlignment > 0.8) {
      reasoning.push(`Excellent category alignment: ${workflow.category} matches ${company.industry}`);
    }

    if (factors.requirementsFit > 0.7) {
      reasoning.push(`High requirements fit: Workflow meets most company requirements`);
    }

    if (factors.successProbability > 0.7) {
      reasoning.push(`High success probability based on historical patterns`);
    }

    return reasoning;
  }

  // User-Product matching methods
  private calculateUserProductPatternMatch(product: any, user: any): number {
    const userSkills = user.skills || [];
    const productReqs = product.technical_specs?.requiredSkills || [];

    return this.calculateOverlap(userSkills, productReqs);
  }

  private calculateUserCategoryAlignment(product: any, user: any): number {
    const userPreferences = user.preferences?.categories || [];
    const productCategory = product.category;

    if (userPreferences.includes(productCategory)) {
      return 1.0;
    }

    return 0.4;
  }

  private calculateUserRequirementsFit(product: any, user: any): number {
    const userNeeds = user.preferences?.needs || [];
    const productFeatures = product.verified_features || [];

    return this.calculateOverlap(userNeeds, productFeatures);
  }

  private calculateUserSuccessProbability(product: any, user: any): number {
    // Simple success probability based on user experience level
    const userLevel = user.preferences?.experienceLevel || 'intermediate';
    const productComplexity = product.technical_specs?.complexity || 'medium';

    const compatibilityMatrix: Record<string, Record<string, number>> = {
      'beginner': { 'low': 0.9, 'medium': 0.6, 'high': 0.3 },
      'intermediate': { 'low': 0.8, 'medium': 0.8, 'high': 0.6 },
      'advanced': { 'low': 0.7, 'medium': 0.8, 'high': 0.9 },
    };

    return compatibilityMatrix[userLevel]?.[productComplexity] || 0.5;
  }

  private generateUserReasoning(factors: any, product: any, user: any): string[] {
    const reasoning: string[] = [];

    if (factors.patternMatch > 0.7) {
      reasoning.push(`Strong skill match: User skills align well with product requirements`);
    }

    if (factors.categoryAlignment > 0.8) {
      reasoning.push(`Category preference match: Product aligns with user interests`);
    }

    if (factors.requirementsFit > 0.7) {
      reasoning.push(`High needs fit: Product features match user requirements`);
    }

    if (factors.successProbability > 0.7) {
      reasoning.push(`High adoption probability based on user experience level`);
    }

    return reasoning;
  }

  public getWeight(): number {
    return this.weight;
  }
}

export default StructuralMatcher;
