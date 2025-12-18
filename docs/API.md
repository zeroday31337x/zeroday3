# ZDX3 API Documentation

## Base URL

```
Development: http://localhost:3001
Production: https://api.zdx3.com
```

## Authentication

Currently, the API endpoints are open. JWT authentication is ready for implementation.

Future authentication will use Bearer tokens:
```
Authorization: Bearer <token>
```

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response on Limit**: 429 Too Many Requests

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-18T10:30:00.000Z",
  "service": "ZDX3 Matching AI"
}
```

---

## Companies API

### List Companies

#### GET /api/companies

Get all companies.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "industry": "Technology",
      "size": "medium",
      "description": "Enterprise software company",
      "requirements": ["API integration", "Scalability"],
      "created_at": "2024-12-18T10:30:00.000Z",
      "updated_at": "2024-12-18T10:30:00.000Z"
    }
  ]
}
```

### Get Company

#### GET /api/companies/:id

Get specific company by ID.

**Parameters:**
- `id` (path): Company UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "industry": "Technology",
    "size": "medium",
    "description": "Enterprise software company",
    "requirements": ["API integration", "Scalability"],
    "created_at": "2024-12-18T10:30:00.000Z",
    "updated_at": "2024-12-18T10:30:00.000Z"
  }
}
```

### Create Company

#### POST /api/companies

Create a new company profile.

**Request Body:**
```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "size": "medium",
  "description": "Enterprise software company",
  "requirements": ["API integration", "Scalability", "Security"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    ...
  }
}
```

### Update Company

#### PUT /api/companies/:id

Update existing company.

**Parameters:**
- `id` (path): Company UUID

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "industry": "Technology",
  "size": "large",
  "description": "Updated description",
  "requirements": ["API integration", "Scalability", "Security", "Compliance"]
}
```

### Delete Company

#### DELETE /api/companies/:id

Delete a company.

**Parameters:**
- `id` (path): Company UUID

**Response:**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

---

## Workflows API

### List Workflows

#### GET /api/workflows

Get all workflows.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_id": "uuid",
      "name": "Customer Service Automation",
      "description": "AI-powered customer support workflow",
      "category": "Customer Support",
      "requirements": {
        "features": ["NLP", "Integration", "Analytics"]
      },
      "structural_skeleton": {
        "targetIndustries": ["Technology", "Retail"],
        "companySizes": ["medium", "large"],
        "technicalRequirements": ["API", "Cloud"]
      },
      "success_pattern": {
        "optimalCompanySize": "medium",
        "industrySuccessRates": {
          "Technology": 0.85,
          "Retail": 0.78
        }
      },
      "created_at": "2024-12-18T10:30:00.000Z",
      "updated_at": "2024-12-18T10:30:00.000Z"
    }
  ]
}
```

### Get Workflow

#### GET /api/workflows/:id

Get specific workflow by ID.

### Create Workflow

#### POST /api/workflows

Create a new workflow.

**Request Body:**
```json
{
  "company_id": "uuid",
  "name": "Customer Service Automation",
  "description": "AI-powered customer support workflow",
  "category": "Customer Support",
  "requirements": {
    "features": ["NLP", "Integration", "Analytics"]
  },
  "structural_skeleton": {
    "targetIndustries": ["Technology", "Retail"],
    "companySizes": ["medium", "large"],
    "technicalRequirements": ["API", "Cloud"]
  },
  "success_pattern": {
    "optimalCompanySize": "medium",
    "industrySuccessRates": {
      "Technology": 0.85,
      "Retail": 0.78
    }
  }
}
```

### Update Workflow

#### PUT /api/workflows/:id

Update existing workflow.

### Delete Workflow

#### DELETE /api/workflows/:id

Delete a workflow.

---

## Products API

### List Products

#### GET /api/products

Get all products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "AI Assistant Pro",
      "category": "Productivity",
      "description": "Advanced AI-powered productivity tool",
      "technical_specs": {
        "requiredSkills": ["JavaScript", "React"],
        "complexity": "medium"
      },
      "market_data": {
        "pricing": "subscription",
        "userBase": "enterprise"
      },
      "verified_features": ["API Access", "Cloud Sync", "Team Collaboration"],
      "created_at": "2024-12-18T10:30:00.000Z",
      "updated_at": "2024-12-18T10:30:00.000Z"
    }
  ]
}
```

### Get Product

#### GET /api/products/:id

Get specific product by ID.

### Create Product

#### POST /api/products

Create a new product.

**Request Body:**
```json
{
  "name": "AI Assistant Pro",
  "category": "Productivity",
  "description": "Advanced AI-powered productivity tool",
  "technical_specs": {
    "requiredSkills": ["JavaScript", "React"],
    "complexity": "medium",
    "platforms": ["Web", "Mobile"]
  },
  "market_data": {
    "pricing": "subscription",
    "userBase": "enterprise"
  },
  "verified_features": ["API Access", "Cloud Sync", "Team Collaboration"]
}
```

### Update Product

#### PUT /api/products/:id

Update existing product.

### Delete Product

#### DELETE /api/products/:id

Delete a product.

---

## Matching API

### Find Workflow Matches for Company

#### GET /api/matching/company/:companyId/workflows

Find optimal workflow matches for a company using the 65/35 framework.

**Parameters:**
- `companyId` (path): Company UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "companyId": "uuid",
    "matchCount": 5,
    "matches": [
      {
        "workflowId": "uuid",
        "confidenceScore": 0.853,
        "structuralScore": 0.867,
        "precisionScore": 0.825,
        "explanation": "EXCELLENT MATCH (85%+):\n\nStructural Analysis (65% weight):\n• Strong pattern match: Workflow aligns well with company's structural requirements\n• Excellent category alignment: Enterprise AI matches Technology\n• High requirements fit: Workflow meets most company requirements\n• High success probability based on historical patterns\n\nPrecision Filtering (35% weight):\n• Verified technical claims:\n  - API integration with RESTful architecture\n  - Scalability tested to 10M requests/day\n• Marketing noise detected (filtered):\n  - Revolutionary approach to enterprise AI\n\nFinal Confidence Score: 85.3%"
      }
    ]
  }
}
```

### Find Product Matches for User

#### GET /api/matching/user/:userId/products

Find personalized product recommendations for a user.

**Parameters:**
- `userId` (path): User UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "matchCount": 3,
    "matches": [
      {
        "productId": "uuid",
        "confidenceScore": 0.782,
        "structuralScore": 0.795,
        "precisionScore": 0.755,
        "explanation": "STRONG MATCH (70-80%):\n\n..."
      }
    ]
  }
}
```

### Get Existing Matches

#### GET /api/matching/:entityType/:entityId

Retrieve previously calculated matches.

**Parameters:**
- `entityType` (path): "company" or "user"
- `entityId` (path): Entity UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "entityType": "company",
    "entityId": "uuid",
    "matchCount": 5,
    "matches": [
      {
        "id": "uuid",
        "entity_type": "company",
        "entity_id": "uuid",
        "target_type": "workflow",
        "target_id": "uuid",
        "structural_score": 0.867,
        "precision_score": 0.825,
        "confidence_score": 0.853,
        "explanation": "...",
        "score_breakdown": { ... },
        "created_at": "2024-12-18T10:30:00.000Z"
      }
    ]
  }
}
```

### Get Match Analytics

#### GET /api/matching/analytics

Get analytics about matching performance.

**Response:**
```json
{
  "success": true,
  "data": {
    "averageScores": [
      {
        "entity_type": "company",
        "target_type": "workflow",
        "avg_confidence": 0.742,
        "avg_structural": 0.758,
        "avg_precision": 0.712,
        "total_matches": 150
      }
    ],
    "scoreDistribution": [
      { "score_category": "excellent", "count": 45 },
      { "score_category": "strong", "count": 62 },
      { "score_category": "good", "count": 38 },
      { "score_category": "moderate", "count": 5 }
    ]
  }
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Common Error Examples

### 404 Not Found
```json
{
  "success": false,
  "error": "Company not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid entity type. Must be 'company' or 'user'"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch companies"
}
```

---

## Request Examples

### cURL Examples

**Get all companies:**
```bash
curl http://localhost:3001/api/companies
```

**Create a company:**
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "industry": "Technology",
    "size": "medium",
    "description": "Enterprise software company",
    "requirements": ["API integration", "Scalability"]
  }'
```

**Find workflow matches:**
```bash
curl http://localhost:3001/api/matching/company/{companyId}/workflows
```

### JavaScript/Axios Examples

```javascript
// Get companies
const companies = await axios.get('http://localhost:3001/api/companies');

// Create company
const newCompany = await axios.post('http://localhost:3001/api/companies', {
  name: 'Acme Corp',
  industry: 'Technology',
  size: 'medium',
  description: 'Enterprise software company',
  requirements: ['API integration', 'Scalability']
});

// Find matches
const matches = await axios.get(
  `http://localhost:3001/api/matching/company/${companyId}/workflows`
);
```

---

For more information about the matching algorithm, see [MATCHING_ALGORITHM.md](MATCHING_ALGORITHM.md).
