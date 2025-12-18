# ZDX3 Architecture

## System Overview

ZDX3 is a full-stack web application built with a modern microservices-inspired architecture, featuring:
- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL for persistent storage
- **Cache**: Redis for performance optimization
- **Deployment**: Docker containerization

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Frontend (TypeScript + Tailwind CSS)           │ │
│  │  - Landing Page                                        │ │
│  │  - Company Dashboard                                   │ │
│  │  - User Dashboard                                      │ │
│  │  - Matching Results View                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js API Server                                │ │
│  │  - CORS & Security (Helmet)                           │ │
│  │  - Rate Limiting                                       │ │
│  │  - Request Validation                                  │ │
│  │  - Error Handling                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
┌──────────────────────────┐ ┌──────────────────────────┐
│   Business Logic Layer   │ │    Matching Engine       │
│  ┌────────────────────┐  │ │  ┌────────────────────┐  │
│  │ Company Controller │  │ │  │ Structural Matcher │  │
│  │ Workflow Controller│  │ │  │    (65% Logic)     │  │
│  │ Product Controller │  │ │  └────────────────────┘  │
│  │ Matching Controller│  │ │  ┌────────────────────┐  │
│  └────────────────────┘  │ │  │ Precision Filter   │  │
└──────────────────────────┘ │  │    (35% Logic)     │  │
                            │  └────────────────────┘  │
                            └──────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
         ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
         │   PostgreSQL DB  │ │  Redis Cache │ │ Tech Truth DB│
         │  - Companies     │ │  - Sessions  │ │  - Rules     │
         │  - Users         │ │  - Patterns  │ │  - Patterns  │
         │  - Workflows     │ └──────────────┘ └──────────────┘
         │  - Products      │
         │  - Matches       │
         └──────────────────┘
```

## Component Architecture

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── [Future: Header, Footer, MatchCard, etc.]
│   ├── pages/              # Page-level components
│   │   ├── LandingPage.tsx
│   │   ├── CompanyDashboard.tsx
│   │   ├── UserDashboard.tsx
│   │   └── MatchingResults.tsx
│   ├── services/           # API integration
│   │   └── [Future: api.ts, matching.ts]
│   ├── utils/              # Helper functions
│   │   └── [Future: formatters, validators]
│   └── styles/             # Styling
│       └── index.css       # Tailwind configuration
└── public/                 # Static assets
```

**Key Technologies:**
- React 18 with functional components and hooks
- TypeScript for type safety
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

### Backend Architecture

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── company.controller.ts
│   │   ├── workflow.controller.ts
│   │   ├── product.controller.ts
│   │   └── matching.controller.ts
│   ├── models/             # Data models
│   │   └── types.ts
│   ├── routes/             # API routes
│   │   ├── companies.ts
│   │   ├── workflows.ts
│   │   ├── products.ts
│   │   └── matching.ts
│   ├── services/           # Business logic
│   │   └── matching-engine/
│   │       ├── index.ts
│   │       ├── structural-matcher.ts
│   │       └── precision-filter.ts
│   ├── middleware/         # Express middleware
│   │   └── [Future: auth, validation]
│   └── utils/              # Utilities
│       └── [Future: logger, helpers]
└── config/                 # Configuration
    └── database.ts
```

**Key Technologies:**
- Node.js 20+ runtime
- Express.js web framework
- TypeScript for type safety
- PostgreSQL with pg driver
- Redis for caching
- Helmet for security
- Express Rate Limit for API protection

## Data Flow

### Company Workflow Matching Flow

1. **User Action**: Company submits workflow requirements via frontend
2. **API Request**: POST to `/api/companies` creates company profile
3. **Database**: Company data stored in PostgreSQL
4. **Matching Request**: GET to `/api/matching/company/:id/workflows`
5. **Matching Engine**:
   - Retrieves company and all workflows from database
   - Runs Structural Matcher (65% logic)
   - Runs Precision Filter (35% logic)
   - Calculates weighted confidence scores
   - Generates explanations
6. **Storage**: Matches saved to database
7. **Response**: Ranked matches returned to frontend
8. **Display**: Results visualized with confidence scores and explanations

### User Product Matching Flow

1. **User Action**: User requests product recommendations
2. **API Request**: GET to `/api/matching/user/:id/products`
3. **Matching Engine**:
   - Retrieves user profile and products
   - Applies 65/35 matching framework
   - Filters by confidence threshold
4. **Response**: Personalized recommendations returned
5. **Display**: Products shown with match scores

## Database Schema

### Core Tables

**companies**
```sql
- id: UUID (PK)
- name: VARCHAR
- industry: VARCHAR
- size: VARCHAR
- description: TEXT
- requirements: JSONB
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**workflows**
```sql
- id: UUID (PK)
- company_id: UUID (FK)
- name: VARCHAR
- description: TEXT
- category: VARCHAR
- requirements: JSONB
- structural_skeleton: JSONB
- success_pattern: JSONB
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**products**
```sql
- id: UUID (PK)
- name: VARCHAR
- category: VARCHAR
- description: TEXT
- technical_specs: JSONB
- market_data: JSONB
- verified_features: JSONB
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**matches**
```sql
- id: UUID (PK)
- entity_type: VARCHAR
- entity_id: UUID
- target_type: VARCHAR
- target_id: UUID
- structural_score: DECIMAL
- precision_score: DECIMAL
- confidence_score: DECIMAL
- explanation: TEXT
- score_breakdown: JSONB
- created_at: TIMESTAMP
```

**technical_truth**
```sql
- id: UUID (PK)
- category: VARCHAR
- rule_type: VARCHAR
- pattern: VARCHAR
- validation_logic: JSONB
- weight: DECIMAL
- active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Security Architecture

### Layers of Protection

1. **Network Layer**
   - CORS with whitelist
   - Rate limiting per IP
   - Helmet.js security headers

2. **Application Layer**
   - Input validation
   - SQL injection prevention (parameterized queries)
   - XSS protection
   - CSRF protection (ready for implementation)

3. **Data Layer**
   - Environment-based secrets
   - Encrypted connections
   - Database access controls

### Authentication Flow (Ready for Implementation)

```
User Login → JWT Token → Token Storage → 
API Request with Token → Token Validation → 
Authorized Access
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless API**: Each request is independent
- **Load Balancing**: Multiple backend instances
- **Database Connection Pooling**: Efficient resource usage
- **Redis Caching**: Reduced database load

### Performance Optimization

1. **Database Indexes**: On frequently queried fields
2. **Query Optimization**: Efficient SQL queries
3. **Caching Strategy**: Cache matching patterns and results
4. **Batch Processing**: Process multiple matches in parallel

## Deployment Architecture

### Docker Containerization

```yaml
Services:
- postgres: Database service
- redis: Cache service
- backend: API server
- frontend: React application served via Nginx
```

### Environment Configuration

- Development: Local Docker Compose
- Staging: Cloud deployment with same containers
- Production: Multi-region deployment with CDN

## Monitoring and Logging

### Key Metrics

- API response times
- Match confidence distribution
- Database query performance
- Error rates
- Cache hit rates

### Logging Strategy

- Structured logging with Winston
- Request/response logging
- Error tracking
- Performance monitoring

## Future Architecture Enhancements

1. **Microservices**: Split matching engine into separate service
2. **Message Queue**: RabbitMQ for async processing
3. **GraphQL**: Alternative API interface
4. **WebSockets**: Real-time match updates
5. **ML Pipeline**: Separate service for model training
6. **CDN**: Static asset optimization
7. **Multi-tenancy**: Support for multiple organizations

---

This architecture provides a solid foundation for a scalable, maintainable, and secure matching platform while maintaining the core 65/35 logic framework.
