import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Routes
import companiesRouter from './routes/companies';
import matchingRouter from './routes/matching';
import workflowsRouter from './routes/workflows';
import productsRouter from './routes/products';

dotenv.config();

const app: Express = express();
const PORT = process.env.API_PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ZDX3 Matching AI',
  });
});

// API routes
app.use('/api/companies', companiesRouter);
app.use('/api/matching', matchingRouter);
app.use('/api/workflows', workflowsRouter);
app.use('/api/products', productsRouter);

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'ZDX3: ZeroDay3 Matching AI',
    description: 'Enterprise workflow and product matching service',
    version: '1.0.0',
    framework: '65/35 Hybrid Logic (Structural + Precision)',
    endpoints: {
      health: '/health',
      companies: '/api/companies',
      workflows: '/api/workflows',
      products: '/api/products',
      matching: '/api/matching',
    },
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    const { initDatabase } = await import('../database/migrations/001_init');
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 ZDX3 Matching AI Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔍 API Documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

export default app;
