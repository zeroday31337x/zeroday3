export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  requirements: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Workflow {
  id: string;
  company_id: string;
  name: string;
  description: string;
  category: string;
  requirements: Record<string, any>;
  structural_skeleton: Record<string, any>;
  success_pattern: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  skills: string[];
  preferences: Record<string, any>;
  role: 'user' | 'company' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  technical_specs: Record<string, any>;
  market_data: Record<string, any>;
  verified_features: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Match {
  id: string;
  entity_type: 'company' | 'user';
  entity_id: string;
  target_type: 'workflow' | 'product';
  target_id: string;
  structural_score: number;
  precision_score: number;
  confidence_score: number;
  explanation: string;
  score_breakdown: Record<string, any>;
  created_at: Date;
}

export interface TechnicalTruth {
  id: string;
  category: string;
  rule_type: string;
  pattern: string;
  validation_logic: Record<string, any>;
  weight: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
