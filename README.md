# ZeroDay3 Matching AI

**The Honesty Vector for the Synthetic Age**

ZeroDay3 is a specialized matching service that connects:
- **Companies** to AI Workflows and Tools
- **Individuals** to Products (Hardware/Software)

Using a unique **65/35 Framework**:
- 65% Structural Logic (high-fidelity patterns from successful implementations)
- 35% Original Precision (technical truth filtering, no marketing noise)

---

## 🎯 Core Philosophy

- **Zero Ads:** Low-entropy zone. No ad-model trap.
- **Zero Data Retention:** We don't want your data. We want your Efficiency.
- **Gravitational Truth:** Decisions based on Merit alone.
- **Technical Truth Over Marketing Hype:** We cut through the noise.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (optional)

### Local Development

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Docker Deployment
```bash
docker-compose up --build
```

This will start both backend (port 8000) and frontend (port 3000).

---

## 📋 API Documentation

### Matching Endpoints

#### POST /api/match/company
Match companies to AI workflows and tools.

**Request:**
```json
{
  "friction_point": "Customer support latency issues",
  "company_size": "medium",
  "industry": "SaaS",
  "technical_constraints": []
}
```

**Response:**
```json
{
  "intent_analysis": { ... },
  "recommendations": [
    {
      "tool_name": "OpenAI GPT-4",
      "match_score": 0.87,
      "reasoning": "...",
      "deployment_guide": { ... },
      "technical_truth": { ... }
    }
  ],
  "deployment_strategy": "...",
  "estimated_impact": "..."
}
```

#### POST /api/match/individual
Match individuals to products.

**Request:**
```json
{
  "need": "Best laptop for high-end AI development",
  "budget_range": "premium",
  "ecosystem_preference": "agnostic",
  "primary_use_cases": ["ml_development", "video_editing"]
}
```

**Response:**
```json
{
  "intent_analysis": { ... },
  "recommendations": [
    {
      "product_name": "MacBook Pro 16\" (M4 Max)",
      "match_score": 0.92,
      "reasoning": "...",
      "technical_specs": { ... },
      "technical_truth": { ... }
    }
  ],
  "buying_guide": "..."
}
```

### Catalog Endpoints

- **GET /api/catalog/products** - List all products
- **GET /api/catalog/products/{id}** - Get specific product
- **GET /api/catalog/tools** - List all AI tools
- **GET /api/catalog/tools/{id}** - Get specific AI tool

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- FastAPI (Python)
- Pydantic for data validation
- Async/await support
- RESTful API design

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

**Data:**
- JSON-based catalogs
- Vector similarity matching (scikit-learn)
- 65/35 matching algorithm

### Project Structure

```
/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models/              # Pydantic models
│   │   ├── routers/             # API endpoints
│   │   │   ├── matching.py      # Matching endpoints
│   │   │   └── catalog.py       # Catalog endpoints
│   │   ├── services/            # Core business logic
│   │   │   ├── analyze_intent.py       # Intent analysis
│   │   │   ├── cross_reference.py      # 65/35 matching
│   │   │   └── generate_instructions.py # Guide generation
│   │   └── database/            # Data loading
│   ├── requirements.txt
│   ├── config.py
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── CompanyForm.tsx      # Company submission form
│   │   ├── IndividualForm.tsx   # Individual submission form
│   │   └── ResultsDisplay.tsx   # Results display
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── types.ts             # TypeScript types
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── data/
│   ├── product_catalog.json     # Gold Standard products
│   └── ai_tools_catalog.json    # AI tools/workflows
├── docker-compose.yml
└── README.md
```

---

## 🎨 Features

### For Companies (Workflow A)
1. **Submission:** Describe business friction point
2. **Mapping:** AI identifies optimal LLM or workflow
3. **Instruction:** Receive deployment guide with custom instructions

### For Individuals (Workflow B)
1. **Submission:** Describe product need
2. **Evaluation:** System bypasses marketing hype
3. **Selection:** Get technically superior recommendation

### 65/35 Matching Framework

**Structural Logic (65%):**
- Pattern matching from proven implementations
- Domain-to-category alignment
- Automation potential assessment
- Scalability requirements

**Original Precision (35%):**
- Cost efficiency analysis
- Technical constraint validation
- Truth verification (strengths vs limitations)
- Priority alignment

---

## 📊 Initial Data Seeds

### Gold Standard Hardware
1. **MacBook Pro 16" (M4 Max)** - Extreme Performance
2. **Asus ProArt PX13** - Precision Creativity
3. **Galaxy Book4 Ultra** - Ecosystem Synergy

### AI Tools/Workflows
1. **OpenAI GPT-4** - General Purpose LLM
2. **Anthropic Claude** - Safety-Focused LLM
3. **LangChain Agents** - Agentic Workflows
4. **Local LLaMA** - Self-Hosted Solutions
5. **Zapier AI** - No-Code Integration

---

## 🔧 Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Environment Variables

Create `.env` file in backend directory:
```
APP_NAME=ZeroDay3 Matching AI
API_PREFIX=/api
DATABASE_URL=sqlite+aiosqlite:///./zeroday3.db
```

Frontend environment (optional):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🛡️ Security

- No personal data stored
- Stateless API design
- CORS configuration for allowed origins
- Input validation with Pydantic
- Type safety with TypeScript

---

## 📝 License

See LICENSE file for details.

---

## 🤝 Contributing

This is a production-ready implementation of the ZeroDay3 philosophy. Contributions should align with:
- Technical truth over marketing
- Minimal, precise changes
- No-nonsense approach
- 65/35 framework principles

---

**"We don't patch the past; we optimize the drive."**
