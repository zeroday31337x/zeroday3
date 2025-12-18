# ZDX3 Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Option 1: Docker (Recommended)

1. **Prerequisites:**
   - Docker and Docker Compose installed
   - Git

2. **Clone and Start:**
   ```bash
   git clone https://github.com/zeroday31337x/zeroday3.git
   cd zeroday3
   cp .env.example .env
   docker-compose up -d
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Option 2: Manual Setup

1. **Prerequisites:**
   - Node.js 20+
   - PostgreSQL 16+
   - Redis 7+ (optional)

2. **Database Setup:**
   ```bash
   # Create PostgreSQL database
   createdb zdx3_db
   
   # Update .env with your database credentials
   cp .env.example .env
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

4. **Frontend Setup (in new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📊 Quick Test

### Test the API:
```bash
# Check health
curl http://localhost:3001/health

# Get companies
curl http://localhost:3001/api/companies

# Get workflows
curl http://localhost:3001/api/workflows

# Get products
curl http://localhost:3001/api/products
```

### Create a Company:
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Corp",
    "industry": "Technology",
    "size": "medium",
    "description": "Test company",
    "requirements": ["API", "Scalability"]
  }'
```

### Create a Workflow:
```bash
curl -X POST http://localhost:3001/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "YOUR_COMPANY_ID",
    "name": "AI Automation",
    "description": "Automated workflow",
    "category": "Automation",
    "requirements": {},
    "structural_skeleton": {
      "targetIndustries": ["Technology"],
      "companySizes": ["medium"]
    },
    "success_pattern": {}
  }'
```

### Find Matches:
```bash
# Replace YOUR_COMPANY_ID with actual company ID
curl http://localhost:3001/api/matching/company/YOUR_COMPANY_ID/workflows
```

## 🎯 Using the UI

1. **Visit http://localhost:3000**
   - Beautiful landing page explaining the 65/35 framework

2. **Company Dashboard** (http://localhost:3000/company)
   - Create company profiles
   - Add requirements
   - Find workflow matches

3. **User Dashboard** (http://localhost:3000/user)
   - Browse products
   - Get personalized recommendations

4. **View Matches**
   - See confidence scores
   - Review structural and precision breakdowns
   - Read detailed explanations

## 🔧 Development

### Run in Development Mode:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

### Run Tests:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Seed Sample Data:
```bash
cd backend
npm run build
node dist/database/seeds/001_sample_data.js
```

## 📚 Next Steps

- Read [API Documentation](../docs/API.md)
- Understand [Architecture](../docs/ARCHITECTURE.md)
- Learn about [Matching Algorithm](../docs/MATCHING_ALGORITHM.md)
- Customize environment variables in `.env`
- Add your own technical truth rules
- Integrate authentication (JWT ready)

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Change ports in .env
API_PORT=3002
# And in frontend/.env
REACT_APP_API_URL=http://localhost:3002/api
```

**Database connection error:**
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

**Docker issues:**
```bash
# Reset everything
docker-compose down -v
docker-compose up -d --build
```

## 🎉 You're Ready!

Your ZDX3 Matching AI platform is now running with:
- ✅ 65/35 hybrid matching engine
- ✅ RESTful API
- ✅ Modern React UI
- ✅ PostgreSQL database
- ✅ Docker containerization
- ✅ Full documentation

Explore the features and start matching!
