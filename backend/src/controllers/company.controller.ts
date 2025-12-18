import { Request, Response } from 'express';
import { query } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class CompanyController {
  /**
   * Get all companies
   */
  async getCompanies(req: Request, res: Response): Promise<void> {
    try {
      const result = await query('SELECT * FROM companies ORDER BY created_at DESC');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch companies' });
    }
  }

  /**
   * Get company by ID
   */
  async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM companies WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Company not found' });
        return;
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch company' });
    }
  }

  /**
   * Create new company
   */
  async createCompany(req: Request, res: Response): Promise<void> {
    try {
      const { name, industry, size, description, requirements } = req.body;
      
      const result = await query(
        `INSERT INTO companies (name, industry, size, description, requirements)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, industry, size, description, JSON.stringify(requirements || [])]
      );
      
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ success: false, error: 'Failed to create company' });
    }
  }

  /**
   * Update company
   */
  async updateCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, industry, size, description, requirements } = req.body;
      
      const result = await query(
        `UPDATE companies 
         SET name = $1, industry = $2, size = $3, description = $4, 
             requirements = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [name, industry, size, description, JSON.stringify(requirements), id]
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Company not found' });
        return;
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ success: false, error: 'Failed to update company' });
    }
  }

  /**
   * Delete company
   */
  async deleteCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM companies WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Company not found' });
        return;
      }
      
      res.json({ success: true, message: 'Company deleted successfully' });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ success: false, error: 'Failed to delete company' });
    }
  }
}

export default new CompanyController();
