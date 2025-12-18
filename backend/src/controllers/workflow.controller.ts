import { Request, Response } from 'express';
import { query } from '../../config/database';

export class WorkflowController {
  async getWorkflows(req: Request, res: Response): Promise<void> {
    try {
      const result = await query('SELECT * FROM workflows ORDER BY created_at DESC');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching workflows:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch workflows' });
    }
  }

  async getWorkflowById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM workflows WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Workflow not found' });
        return;
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error fetching workflow:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch workflow' });
    }
  }

  async createWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const {
        company_id,
        name,
        description,
        category,
        requirements,
        structural_skeleton,
        success_pattern,
      } = req.body;
      
      const result = await query(
        `INSERT INTO workflows (
          company_id, name, description, category, requirements,
          structural_skeleton, success_pattern
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          company_id,
          name,
          description,
          category,
          JSON.stringify(requirements || {}),
          JSON.stringify(structural_skeleton || {}),
          JSON.stringify(success_pattern || {}),
        ]
      );
      
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error creating workflow:', error);
      res.status(500).json({ success: false, error: 'Failed to create workflow' });
    }
  }

  async updateWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        category,
        requirements,
        structural_skeleton,
        success_pattern,
      } = req.body;
      
      const result = await query(
        `UPDATE workflows 
         SET name = $1, description = $2, category = $3,
             requirements = $4, structural_skeleton = $5,
             success_pattern = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [
          name,
          description,
          category,
          JSON.stringify(requirements),
          JSON.stringify(structural_skeleton),
          JSON.stringify(success_pattern),
          id,
        ]
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Workflow not found' });
        return;
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error updating workflow:', error);
      res.status(500).json({ success: false, error: 'Failed to update workflow' });
    }
  }

  async deleteWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM workflows WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Workflow not found' });
        return;
      }
      
      res.json({ success: true, message: 'Workflow deleted successfully' });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      res.status(500).json({ success: false, error: 'Failed to delete workflow' });
    }
  }
}

export default new WorkflowController();
