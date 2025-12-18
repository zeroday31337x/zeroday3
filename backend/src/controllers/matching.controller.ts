import { Request, Response } from 'express';
import MatchingEngine from '../services/matching-engine';

const matchingEngine = new MatchingEngine();

export class MatchingController {
  /**
   * Find workflow matches for a company
   */
  async findWorkflowMatches(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      
      const matches = await matchingEngine.findWorkflowMatches(companyId);
      
      res.json({
        success: true,
        data: {
          companyId,
          matchCount: matches.length,
          matches: matches.map(m => ({
            workflowId: m.targetId,
            confidenceScore: m.confidenceScore,
            structuralScore: m.structuralScore,
            precisionScore: m.precisionScore,
            explanation: m.explanation,
          })),
        },
      });
    } catch (error) {
      console.error('Error finding workflow matches:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find matches',
      });
    }
  }

  /**
   * Find product matches for a user
   */
  async findProductMatches(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      const matches = await matchingEngine.findProductMatches(userId);
      
      res.json({
        success: true,
        data: {
          userId,
          matchCount: matches.length,
          matches: matches.map(m => ({
            productId: m.targetId,
            confidenceScore: m.confidenceScore,
            structuralScore: m.structuralScore,
            precisionScore: m.precisionScore,
            explanation: m.explanation,
          })),
        },
      });
    } catch (error) {
      console.error('Error finding product matches:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find matches',
      });
    }
  }

  /**
   * Get existing matches for an entity
   */
  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const { entityType, entityId } = req.params;
      
      if (entityType !== 'company' && entityType !== 'user') {
        res.status(400).json({
          success: false,
          error: 'Invalid entity type. Must be "company" or "user"',
        });
        return;
      }
      
      const matches = await matchingEngine.getMatches(entityType, entityId);
      
      res.json({
        success: true,
        data: {
          entityType,
          entityId,
          matchCount: matches.length,
          matches,
        },
      });
    } catch (error) {
      console.error('Error getting matches:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve matches',
      });
    }
  }

  /**
   * Get match analytics
   */
  async getMatchAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { query } = await import('../../config/database');
      
      // Get average confidence scores
      const avgScores = await query(`
        SELECT 
          entity_type,
          target_type,
          AVG(confidence_score) as avg_confidence,
          AVG(structural_score) as avg_structural,
          AVG(precision_score) as avg_precision,
          COUNT(*) as total_matches
        FROM matches
        GROUP BY entity_type, target_type
      `);
      
      // Get score distribution
      const distribution = await query(`
        SELECT 
          CASE 
            WHEN confidence_score >= 0.9 THEN 'excellent'
            WHEN confidence_score >= 0.8 THEN 'strong'
            WHEN confidence_score >= 0.7 THEN 'good'
            WHEN confidence_score >= 0.6 THEN 'moderate'
            ELSE 'low'
          END as score_category,
          COUNT(*) as count
        FROM matches
        GROUP BY score_category
        ORDER BY 
          CASE score_category
            WHEN 'excellent' THEN 1
            WHEN 'strong' THEN 2
            WHEN 'good' THEN 3
            WHEN 'moderate' THEN 4
            ELSE 5
          END
      `);
      
      res.json({
        success: true,
        data: {
          averageScores: avgScores.rows,
          scoreDistribution: distribution.rows,
        },
      });
    } catch (error) {
      console.error('Error getting analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve analytics',
      });
    }
  }
}

export default new MatchingController();
