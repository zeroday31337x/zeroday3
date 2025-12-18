/**
 * Precision Filter - 35% Logic Component
 * 
 * Proprietary technical truth filtering to eliminate marketing noise
 * and hallucinations from matching results.
 */

import { query } from '../../../config/database';

export interface PrecisionScore {
  score: number;
  filters: {
    marketingNoiseReduction: number;
    technicalValidation: number;
    hallucinationDetection: number;
    truthVerification: number;
  };
  flagged: string[];
  verified: string[];
}

export class PrecisionFilter {
  private readonly weight: number = 0.35;
  private marketingKeywords: Set<string>;
  private technicalIndicators: Set<string>;

  constructor() {
    // Marketing noise keywords to filter out
    this.marketingKeywords = new Set([
      'revolutionary', 'game-changing', 'best-in-class', 'world-class',
      'cutting-edge', 'next-generation', 'industry-leading', 'innovative',
      'seamless', 'effortless', 'guaranteed', 'unlimited', 'synergy',
      'disruptive', 'paradigm', 'leverage', 'ecosystem', 'holistic'
    ]);

    // Technical indicators that suggest real substance
    this.technicalIndicators = new Set([
      'api', 'sdk', 'benchmark', 'latency', 'throughput', 'scalability',
      'architecture', 'protocol', 'algorithm', 'compliance', 'encryption',
      'authentication', 'authorization', 'integration', 'deployment'
    ]);
  }

  /**
   * Apply precision filtering to workflow-company match
   */
  async filterWorkflowMatch(
    workflow: any,
    company: any,
    structuralScore: number
  ): Promise<PrecisionScore> {
    const filters = {
      marketingNoiseReduction: await this.reduceMarketingNoise(workflow),
      technicalValidation: await this.validateTechnicalClaims(workflow),
      hallucinationDetection: await this.detectHallucinations(workflow, company),
      truthVerification: await this.verifyTechnicalTruth(workflow),
    };

    const score = Object.values(filters).reduce((sum, val) => sum + val, 0) / 4;
    
    const { flagged, verified } = this.analyzeClaims(workflow);

    return { score, filters, flagged, verified };
  }

  /**
   * Apply precision filtering to product-user match
   */
  async filterProductMatch(
    product: any,
    user: any,
    structuralScore: number
  ): Promise<PrecisionScore> {
    const filters = {
      marketingNoiseReduction: await this.reduceMarketingNoise(product),
      technicalValidation: await this.validateTechnicalClaims(product),
      hallucinationDetection: await this.detectProductHallucinations(product, user),
      truthVerification: await this.verifyTechnicalTruth(product),
    };

    const score = Object.values(filters).reduce((sum, val) => sum + val, 0) / 4;
    
    const { flagged, verified } = this.analyzeClaims(product);

    return { score, filters, flagged, verified };
  }

  /**
   * Reduce marketing noise - penalize excessive marketing language
   */
  private async reduceMarketingNoise(entity: any): Promise<number> {
    const text = this.extractTextContent(entity);
    const words = text.toLowerCase().split(/\s+/);
    
    let marketingWordCount = 0;
    for (const word of words) {
      if (this.marketingKeywords.has(word)) {
        marketingWordCount++;
      }
    }

    // Higher marketing word count = lower score
    const marketingRatio = words.length > 0 ? marketingWordCount / words.length : 0;
    
    if (marketingRatio > 0.1) {
      return 0.3; // Heavy marketing presence
    } else if (marketingRatio > 0.05) {
      return 0.6; // Moderate marketing
    } else {
      return 0.95; // Minimal marketing noise
    }
  }

  /**
   * Validate technical claims against database of verified technical truths
   */
  private async validateTechnicalClaims(entity: any): Promise<number> {
    const text = this.extractTextContent(entity);
    const words = text.toLowerCase().split(/\s+/);
    
    let technicalWordCount = 0;
    for (const word of words) {
      if (this.technicalIndicators.has(word)) {
        technicalWordCount++;
      }
    }

    // Check technical specs existence
    const hasTechnicalSpecs = entity.technical_specs && 
      Object.keys(entity.technical_specs).length > 0;

    const technicalRatio = words.length > 0 ? technicalWordCount / words.length : 0;
    
    let score = 0.5; // Base score

    if (hasTechnicalSpecs) {
      score += 0.3;
    }

    if (technicalRatio > 0.05) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Detect hallucinations - claims that don't match reality
   */
  private async detectHallucinations(workflow: any, company: any): Promise<number> {
    let hallucinationScore = 1.0; // Start with perfect score

    // Check for impossible claims
    const impossibleClaims = [
      'zero downtime',
      '100% accurate',
      'infinite scale',
      'instant results',
      'no maintenance'
    ];

    const text = this.extractTextContent(workflow).toLowerCase();
    
    for (const claim of impossibleClaims) {
      if (text.includes(claim)) {
        hallucinationScore -= 0.2;
      }
    }

    // Check for contradictory requirements
    if (workflow.requirements) {
      const reqs = workflow.requirements;
      
      // Example: Can't be both "simple" and "enterprise-grade"
      if (reqs.complexity === 'simple' && reqs.scale === 'enterprise') {
        hallucinationScore -= 0.15;
      }
    }

    return Math.max(hallucinationScore, 0);
  }

  /**
   * Detect product hallucinations
   */
  private async detectProductHallucinations(product: any, user: any): Promise<number> {
    let hallucinationScore = 1.0;

    const text = this.extractTextContent(product).toLowerCase();
    
    // Check for unrealistic feature claims
    const unrealisticClaims = [
      'solves all problems',
      'works for everyone',
      'no learning curve',
      'perfect for any use case'
    ];

    for (const claim of unrealisticClaims) {
      if (text.includes(claim)) {
        hallucinationScore -= 0.2;
      }
    }

    return Math.max(hallucinationScore, 0);
  }

  /**
   * Verify against technical truth database
   */
  private async verifyTechnicalTruth(entity: any): Promise<number> {
    try {
      // Get active technical truth rules
      const result = await query(
        'SELECT * FROM technical_truth WHERE active = true'
      );

      const rules = result.rows;
      
      if (rules.length === 0) {
        return 0.7; // Neutral score if no rules defined
      }

      let validationScore = 0;
      let totalWeight = 0;

      for (const rule of rules) {
        const ruleScore = this.applyTruthRule(entity, rule);
        validationScore += ruleScore * rule.weight;
        totalWeight += rule.weight;
      }

      return totalWeight > 0 ? validationScore / totalWeight : 0.7;
    } catch (error) {
      console.error('Error verifying technical truth:', error);
      return 0.7; // Neutral score on error
    }
  }

  /**
   * Apply a single technical truth rule
   */
  private applyTruthRule(entity: any, rule: any): number {
    const text = this.extractTextContent(entity).toLowerCase();
    const pattern = rule.pattern.toLowerCase();

    switch (rule.rule_type) {
      case 'required_presence':
        return text.includes(pattern) ? 1.0 : 0.5;
      
      case 'forbidden_term':
        return text.includes(pattern) ? 0.0 : 1.0;
      
      case 'technical_verification':
        return this.verifyTechnicalPattern(entity, rule.validation_logic);
      
      default:
        return 0.7; // Neutral for unknown rule types
    }
  }

  /**
   * Verify technical patterns based on validation logic
   */
  private verifyTechnicalPattern(entity: any, validationLogic: any): number {
    if (!validationLogic) return 0.5;

    let score = 0.5;

    // Check for required fields
    if (validationLogic.requiredFields) {
      const fields = validationLogic.requiredFields;
      let presentFields = 0;
      
      for (const field of fields) {
        if (this.hasField(entity, field)) {
          presentFields++;
        }
      }
      
      score = fields.length > 0 ? presentFields / fields.length : 0.5;
    }

    return score;
  }

  /**
   * Check if entity has a specific field
   */
  private hasField(entity: any, fieldPath: string): boolean {
    const parts = fieldPath.split('.');
    let current = entity;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return false;
      }
    }

    return current !== null && current !== undefined;
  }

  /**
   * Extract text content from entity for analysis
   */
  private extractTextContent(entity: any): string {
    const texts: string[] = [];

    if (entity.name) texts.push(entity.name);
    if (entity.description) texts.push(entity.description);
    
    // Extract from nested objects
    if (entity.requirements && typeof entity.requirements === 'object') {
      texts.push(JSON.stringify(entity.requirements));
    }
    
    if (entity.technical_specs && typeof entity.technical_specs === 'object') {
      texts.push(JSON.stringify(entity.technical_specs));
    }

    return texts.join(' ');
  }

  /**
   * Analyze and categorize claims
   */
  private analyzeClaims(entity: any): { flagged: string[], verified: string[] } {
    const flagged: string[] = [];
    const verified: string[] = [];

    const text = this.extractTextContent(entity).toLowerCase();
    const sentences = text.split(/[.!?]+/);

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      // Check for marketing keywords
      let hasMarketingNoise = false;
      for (const keyword of this.marketingKeywords) {
        if (trimmed.includes(keyword)) {
          hasMarketingNoise = true;
          break;
        }
      }

      if (hasMarketingNoise) {
        flagged.push(trimmed.substring(0, 100)); // First 100 chars
      }

      // Check for technical indicators
      let hasTechnicalContent = false;
      for (const indicator of this.technicalIndicators) {
        if (trimmed.includes(indicator)) {
          hasTechnicalContent = true;
          break;
        }
      }

      if (hasTechnicalContent && !hasMarketingNoise) {
        verified.push(trimmed.substring(0, 100));
      }
    }

    return {
      flagged: flagged.slice(0, 5), // Limit to 5 examples
      verified: verified.slice(0, 5)
    };
  }

  public getWeight(): number {
    return this.weight;
  }
}

export default PrecisionFilter;
