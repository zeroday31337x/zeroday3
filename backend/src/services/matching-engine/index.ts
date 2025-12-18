/**
 * Core Matching Engine
 * Combines the 65% Structural Logic with 35% Precision Filtering
 */

import StructuralMatcher from './structural-matcher';
import PrecisionFilter from './precision-filter';
import { query } from '../../../config/database';

export interface MatchResult {
  id: string;
  entityType: 'company' | 'user';
  entityId: string;
  targetType: 'workflow' | 'product';
  targetId: string;
  structuralScore: number;
  precisionScore: number;
  confidenceScore: number;
  explanation: string;
  scoreBreakdown: {
    structural: any;
    precision: any;
  };
}

export class MatchingEngine {
  private structuralMatcher: StructuralMatcher;
  private precisionFilter: PrecisionFilter;
  private minConfidenceThreshold: number;

  constructor() {
    this.structuralMatcher = new StructuralMatcher();
    this.precisionFilter = new PrecisionFilter();
    this.minConfidenceThreshold = parseFloat(
      process.env.MIN_CONFIDENCE_THRESHOLD || '0.6'
    );
  }

  /**
   * Find matches for a company's workflows
   */
  async findWorkflowMatches(companyId: string): Promise<MatchResult[]> {
    try {
      // Get company details
      const companyResult = await query(
        'SELECT * FROM companies WHERE id = $1',
        [companyId]
      );

      if (companyResult.rows.length === 0) {
        throw new Error('Company not found');
      }

      const company = companyResult.rows[0];

      // Get all available workflows
      const workflowsResult = await query(
        'SELECT * FROM workflows ORDER BY created_at DESC LIMIT 100'
      );

      const workflows = workflowsResult.rows;
      const matches: MatchResult[] = [];

      // Score each workflow
      for (const workflow of workflows) {
        const match = await this.scoreWorkflowMatch(workflow, company);
        
        if (match.confidenceScore >= this.minConfidenceThreshold) {
          matches.push(match);
        }
      }

      // Sort by confidence score (descending)
      matches.sort((a, b) => b.confidenceScore - a.confidenceScore);

      // Save matches to database
      await this.saveMatches(matches);

      return matches;
    } catch (error) {
      console.error('Error finding workflow matches:', error);
      throw error;
    }
  }

  /**
   * Find matches for a user's product preferences
   */
  async findProductMatches(userId: string): Promise<MatchResult[]> {
    try {
      // Get user details
      const userResult = await query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];

      // Get all available products
      const productsResult = await query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT 100'
      );

      const products = productsResult.rows;
      const matches: MatchResult[] = [];

      // Score each product
      for (const product of products) {
        const match = await this.scoreProductMatch(product, user);
        
        if (match.confidenceScore >= this.minConfidenceThreshold) {
          matches.push(match);
        }
      }

      // Sort by confidence score (descending)
      matches.sort((a, b) => b.confidenceScore - a.confidenceScore);

      // Save matches to database
      await this.saveMatches(matches);

      return matches;
    } catch (error) {
      console.error('Error finding product matches:', error);
      throw error;
    }
  }

  /**
   * Score a workflow-company match using 65/35 framework
   */
  private async scoreWorkflowMatch(
    workflow: any,
    company: any
  ): Promise<MatchResult> {
    // Step 1: Structural matching (65%)
    const structuralResult = await this.structuralMatcher.matchWorkflowToCompany(
      workflow,
      company
    );

    // Step 2: Precision filtering (35%)
    const precisionResult = await this.precisionFilter.filterWorkflowMatch(
      workflow,
      company,
      structuralResult.score
    );

    // Step 3: Calculate weighted confidence score
    const structuralWeight = this.structuralMatcher.getWeight();
    const precisionWeight = this.precisionFilter.getWeight();

    const confidenceScore = 
      structuralResult.score * structuralWeight +
      precisionResult.score * precisionWeight;

    // Step 4: Generate explanation
    const explanation = this.generateExplanation(
      structuralResult,
      precisionResult,
      confidenceScore
    );

    return {
      id: '', // Will be set when saved
      entityType: 'company',
      entityId: company.id,
      targetType: 'workflow',
      targetId: workflow.id,
      structuralScore: structuralResult.score,
      precisionScore: precisionResult.score,
      confidenceScore: confidenceScore,
      explanation: explanation,
      scoreBreakdown: {
        structural: structuralResult,
        precision: precisionResult,
      },
    };
  }

  /**
   * Score a product-user match using 65/35 framework
   */
  private async scoreProductMatch(
    product: any,
    user: any
  ): Promise<MatchResult> {
    // Step 1: Structural matching (65%)
    const structuralResult = await this.structuralMatcher.matchProductToUser(
      product,
      user
    );

    // Step 2: Precision filtering (35%)
    const precisionResult = await this.precisionFilter.filterProductMatch(
      product,
      user,
      structuralResult.score
    );

    // Step 3: Calculate weighted confidence score
    const structuralWeight = this.structuralMatcher.getWeight();
    const precisionWeight = this.precisionFilter.getWeight();

    const confidenceScore = 
      structuralResult.score * structuralWeight +
      precisionResult.score * precisionWeight;

    // Step 4: Generate explanation
    const explanation = this.generateExplanation(
      structuralResult,
      precisionResult,
      confidenceScore
    );

    return {
      id: '',
      entityType: 'user',
      entityId: user.id,
      targetType: 'product',
      targetId: product.id,
      structuralScore: structuralResult.score,
      precisionScore: precisionResult.score,
      confidenceScore: confidenceScore,
      explanation: explanation,
      scoreBreakdown: {
        structural: structuralResult,
        precision: precisionResult,
      },
    };
  }

  /**
   * Generate human-readable explanation for the match
   */
  private generateExplanation(
    structural: any,
    precision: any,
    confidence: number
  ): string {
    const parts: string[] = [];

    // Overall confidence
    if (confidence >= 0.8) {
      parts.push('EXCELLENT MATCH (80%+):');
    } else if (confidence >= 0.7) {
      parts.push('STRONG MATCH (70-80%):');
    } else if (confidence >= 0.6) {
      parts.push('GOOD MATCH (60-70%):');
    } else {
      parts.push('POTENTIAL MATCH:');
    }

    // Structural reasoning
    parts.push('\n\nStructural Analysis (65% weight):');
    if (structural.reasoning && structural.reasoning.length > 0) {
      structural.reasoning.forEach((reason: string) => {
        parts.push(`• ${reason}`);
      });
    } else {
      parts.push(`• Score: ${(structural.score * 100).toFixed(1)}%`);
    }

    // Precision analysis
    parts.push('\n\nPrecision Filtering (35% weight):');
    if (precision.verified && precision.verified.length > 0) {
      parts.push('• Verified technical claims:');
      precision.verified.slice(0, 2).forEach((claim: string) => {
        parts.push(`  - ${claim}`);
      });
    }
    if (precision.flagged && precision.flagged.length > 0) {
      parts.push('• Marketing noise detected (filtered):');
      precision.flagged.slice(0, 2).forEach((flag: string) => {
        parts.push(`  - ${flag}`);
      });
    }

    // Overall recommendation
    parts.push(`\n\nFinal Confidence Score: ${(confidence * 100).toFixed(1)}%`);

    return parts.join('\n');
  }

  /**
   * Save matches to database
   */
  private async saveMatches(matches: MatchResult[]): Promise<void> {
    try {
      for (const match of matches) {
        await query(
          `INSERT INTO matches (
            entity_type, entity_id, target_type, target_id,
            structural_score, precision_score, confidence_score,
            explanation, score_breakdown
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id`,
          [
            match.entityType,
            match.entityId,
            match.targetType,
            match.targetId,
            match.structuralScore,
            match.precisionScore,
            match.confidenceScore,
            match.explanation,
            JSON.stringify(match.scoreBreakdown),
          ]
        );
      }
    } catch (error) {
      console.error('Error saving matches:', error);
      // Don't throw - we still want to return matches even if save fails
    }
  }

  /**
   * Get existing matches for an entity
   */
  async getMatches(
    entityType: 'company' | 'user',
    entityId: string
  ): Promise<any[]> {
    try {
      const result = await query(
        `SELECT * FROM matches 
         WHERE entity_type = $1 AND entity_id = $2 
         ORDER BY confidence_score DESC`,
        [entityType, entityId]
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting matches:', error);
      throw error;
    }
  }
}

export default MatchingEngine;
