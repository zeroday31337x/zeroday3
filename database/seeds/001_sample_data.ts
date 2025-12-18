import { query } from '../../backend/config/database';

export const seedData = async () => {
  try {
    console.log('Seeding database...');

    // Seed sample companies
    const companies = [
      {
        name: 'TechCorp Solutions',
        industry: 'Technology',
        size: 'medium',
        description: 'Enterprise software development company specializing in cloud solutions',
        requirements: ['API integration', 'Scalability', 'Cloud deployment', 'Security'],
      },
      {
        name: 'HealthCare Innovations',
        industry: 'Healthcare',
        size: 'large',
        description: 'Medical technology company focused on patient care automation',
        requirements: ['Compliance', 'Data security', 'Integration', 'Analytics'],
      },
      {
        name: 'RetailMax',
        industry: 'Retail',
        size: 'enterprise',
        description: 'E-commerce platform serving millions of customers',
        requirements: ['E-commerce', 'Payment processing', 'Inventory management', 'Analytics'],
      },
    ];

    for (const company of companies) {
      await query(
        `INSERT INTO companies (name, industry, size, description, requirements)
         VALUES ($1, $2, $3, $4, $5)`,
        [company.name, company.industry, company.size, company.description, JSON.stringify(company.requirements)]
      );
    }
    console.log('✓ Companies seeded');

    // Seed sample workflows
    const workflows = [
      {
        name: 'Customer Service AI Automation',
        description: 'AI-powered customer support with natural language processing and automated ticket routing',
        category: 'Customer Support',
        requirements: {
          features: ['NLP', 'Integration', 'Analytics', 'Automation'],
          capabilities: ['Multi-channel support', 'AI chat', 'Ticket management'],
          technologies: ['Machine Learning', 'API', 'Cloud'],
        },
        structural_skeleton: {
          targetIndustries: ['Technology', 'Retail', 'Healthcare'],
          companySizes: ['medium', 'large', 'enterprise'],
          technicalRequirements: ['API', 'Cloud', 'Database'],
        },
        success_pattern: {
          optimalCompanySize: 'medium',
          industrySuccessRates: {
            Technology: 0.85,
            Retail: 0.78,
            Healthcare: 0.72,
          },
        },
      },
      {
        name: 'Predictive Analytics Platform',
        description: 'Advanced analytics and forecasting using machine learning algorithms',
        category: 'Analytics',
        requirements: {
          features: ['Predictive modeling', 'Data visualization', 'Real-time processing'],
          capabilities: ['Big data processing', 'Custom models', 'Integration'],
          technologies: ['Python', 'TensorFlow', 'API'],
        },
        structural_skeleton: {
          targetIndustries: ['Technology', 'Finance', 'Retail'],
          companySizes: ['large', 'enterprise'],
          technicalRequirements: ['Big data', 'Cloud', 'ML infrastructure'],
        },
        success_pattern: {
          optimalCompanySize: 'large',
          industrySuccessRates: {
            Technology: 0.88,
            Finance: 0.82,
            Retail: 0.75,
          },
        },
      },
    ];

    const companyResult = await query('SELECT id FROM companies LIMIT 1');
    const companyId = companyResult.rows[0]?.id;

    for (const workflow of workflows) {
      await query(
        `INSERT INTO workflows (company_id, name, description, category, requirements, structural_skeleton, success_pattern)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          companyId,
          workflow.name,
          workflow.description,
          workflow.category,
          JSON.stringify(workflow.requirements),
          JSON.stringify(workflow.structural_skeleton),
          JSON.stringify(workflow.success_pattern),
        ]
      );
    }
    console.log('✓ Workflows seeded');

    // Seed sample products
    const products = [
      {
        name: 'CodeAssist Pro',
        category: 'Development Tools',
        description: 'AI-powered code completion and refactoring tool with support for multiple languages',
        technical_specs: {
          requiredSkills: ['JavaScript', 'Python', 'TypeScript'],
          complexity: 'medium',
          platforms: ['Web', 'Desktop', 'IDE Plugin'],
          apiAccess: true,
        },
        market_data: {
          pricing: 'subscription',
          userBase: 'developers',
          integration: ['VS Code', 'IntelliJ', 'Sublime'],
        },
        verified_features: ['Code completion', 'Refactoring', 'Multi-language support', 'API access'],
      },
      {
        name: 'DataViz Analytics',
        category: 'Analytics',
        description: 'Interactive data visualization and business intelligence platform with real-time capabilities',
        technical_specs: {
          requiredSkills: ['SQL', 'JavaScript'],
          complexity: 'medium',
          platforms: ['Web', 'Mobile'],
          apiAccess: true,
        },
        market_data: {
          pricing: 'subscription',
          userBase: 'enterprise',
          integration: ['Databases', 'Cloud platforms', 'BI tools'],
        },
        verified_features: ['Real-time dashboards', 'Custom charts', 'SQL integration', 'Export capabilities'],
      },
      {
        name: 'SecureAuth Gateway',
        category: 'Security',
        description: 'Enterprise authentication and authorization platform with OAuth2 and SAML support',
        technical_specs: {
          requiredSkills: ['Security', 'OAuth', 'SAML'],
          complexity: 'high',
          platforms: ['Cloud', 'On-premise'],
          compliance: ['SOC2', 'GDPR', 'HIPAA'],
        },
        market_data: {
          pricing: 'enterprise',
          userBase: 'enterprise',
          integration: ['SSO', 'LDAP', 'Active Directory'],
        },
        verified_features: ['OAuth2', 'SAML', 'MFA', 'SSO', 'Audit logs'],
      },
    ];

    for (const product of products) {
      await query(
        `INSERT INTO products (name, category, description, technical_specs, market_data, verified_features)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          product.name,
          product.category,
          product.description,
          JSON.stringify(product.technical_specs),
          JSON.stringify(product.market_data),
          JSON.stringify(product.verified_features),
        ]
      );
    }
    console.log('✓ Products seeded');

    // Seed technical truth rules
    const truthRules = [
      {
        category: 'API',
        rule_type: 'required_presence',
        pattern: 'api',
        validation_logic: { requiredFields: ['technical_specs.apiAccess'] },
        weight: 1.0,
      },
      {
        category: 'Marketing',
        rule_type: 'forbidden_term',
        pattern: 'revolutionary',
        validation_logic: {},
        weight: 0.8,
      },
      {
        category: 'Compliance',
        rule_type: 'technical_verification',
        pattern: 'compliance',
        validation_logic: { requiredFields: ['technical_specs.compliance'] },
        weight: 1.2,
      },
    ];

    for (const rule of truthRules) {
      await query(
        `INSERT INTO technical_truth (category, rule_type, pattern, validation_logic, weight, active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [rule.category, rule.rule_type, rule.pattern, JSON.stringify(rule.validation_logic), rule.weight, true]
      );
    }
    console.log('✓ Technical truth rules seeded');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedData;
