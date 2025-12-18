import { pool } from '../../config/database';

export const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        size VARCHAR(50),
        description TEXT,
        requirements JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        skills JSONB DEFAULT '[]',
        preferences JSONB DEFAULT '{}',
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Workflows table
    await client.query(`
      CREATE TABLE IF NOT EXISTS workflows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        requirements JSONB DEFAULT '{}',
        structural_skeleton JSONB DEFAULT '{}',
        success_pattern JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        technical_specs JSONB DEFAULT '{}',
        market_data JSONB DEFAULT '{}',
        verified_features JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Matches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(20) NOT NULL,
        entity_id UUID NOT NULL,
        target_type VARCHAR(20) NOT NULL,
        target_id UUID NOT NULL,
        structural_score DECIMAL(5,4) NOT NULL,
        precision_score DECIMAL(5,4) NOT NULL,
        confidence_score DECIMAL(5,4) NOT NULL,
        explanation TEXT,
        score_breakdown JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Technical Truth table
    await client.query(`
      CREATE TABLE IF NOT EXISTS technical_truth (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category VARCHAR(100) NOT NULL,
        rule_type VARCHAR(50) NOT NULL,
        pattern VARCHAR(255) NOT NULL,
        validation_logic JSONB DEFAULT '{}',
        weight DECIMAL(3,2) DEFAULT 1.0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_workflows_company ON workflows(company_id);
      CREATE INDEX IF NOT EXISTS idx_matches_entity ON matches(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_matches_target ON matches(target_type, target_id);
      CREATE INDEX IF NOT EXISTS idx_matches_confidence ON matches(confidence_score);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_workflows_category ON workflows(category);
    `);

    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default initDatabase;
