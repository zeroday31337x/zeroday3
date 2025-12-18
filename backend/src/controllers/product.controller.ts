import { Request, Response } from 'express';
import { query } from '../../config/database';

export class ProductController {
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const result = await query('SELECT * FROM products ORDER BY created_at DESC');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM products WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        category,
        description,
        technical_specs,
        market_data,
        verified_features,
      } = req.body;
      
      const result = await query(
        `INSERT INTO products (
          name, category, description, technical_specs,
          market_data, verified_features
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          name,
          category,
          description,
          JSON.stringify(technical_specs || {}),
          JSON.stringify(market_data || {}),
          JSON.stringify(verified_features || []),
        ]
      );
      
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ success: false, error: 'Failed to create product' });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name,
        category,
        description,
        technical_specs,
        market_data,
        verified_features,
      } = req.body;
      
      const result = await query(
        `UPDATE products 
         SET name = $1, category = $2, description = $3,
             technical_specs = $4, market_data = $5,
             verified_features = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [
          name,
          category,
          description,
          JSON.stringify(technical_specs),
          JSON.stringify(market_data),
          JSON.stringify(verified_features),
          id,
        ]
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }
      
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  }
}

export default new ProductController();
