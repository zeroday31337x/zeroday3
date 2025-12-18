# ZDX3: ZeroDay3 Matching AI

## The Honesty Vector for the Synthetic Age

ZDX3 is a specialized enterprise workflow and product matching service powered by our proprietary 65/35 hybrid logic framework. We match companies with AI workflows and individuals with products using a unique combination of structural pattern recognition and precision filtering.

## 🎯 Core Concept: The 65/35 Framework

### 65% Structural Logic
High-fidelity skeletons of successful enterprise AI implementations and market-leading product data. This component analyzes:
- Proven workflow patterns from successful deployments
- Industry-specific structural requirements
- Historical success probabilities
- Technical compatibility matrices

### 35% Original Precision
Proprietary technical truth filtering to eliminate marketing noise and hallucinations. This component provides:
- Marketing language detection and filtering
- Technical claim validation
- Hallucination detection
- Truth verification against verified databases

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL 16+
- Redis 7+ (optional, for caching)
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/zeroday31337x/zeroday3.git
cd zeroday3
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Using Docker (Recommended)**
```bash
docker-compose up -d
```

4. **Manual Setup**

**Backend:**
```bash
cd backend
npm install
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/

## 🔌 API Endpoints

See [API Documentation](docs/API.md) for complete details.

### Key Endpoints
- `/api/companies` - Company management
- `/api/workflows` - Workflow management
- `/api/products` - Product catalog
- `/api/matching` - Core matching engine

## 🎨 Features

### For Companies
- Workflow submission and management
- AI-powered matching with confidence scoring
- Integration recommendations

### For Individuals  
- Product discovery without marketing noise
- Personalized recommendations
- Technical truth verification

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Matching Algorithm Details](docs/MATCHING_ALGORITHM.md)

## 📄 License

See LICENSE file. This project uses the ZeroDay3 Private Audit & Observation License (ZD3-PAOL).

---

**"We don't patch the past; we optimize the drive."**

© 2024 ZeroDay3. All rights reserved.
