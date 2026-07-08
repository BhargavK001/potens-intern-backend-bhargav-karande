import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './utils/apiResponse.js';

const app = express();

// 1. Request logging (Must run first to capture all entries)
app.use(requestLogger);

// 2. Helmet security headers
app.use(helmet());

// 3. CORS configuration mapping
app.use(cors({
  origin: config.FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-API-Key', 'x-request-id'],
}));

// 4. Global Rate Limiter
app.use(globalLimiter);

// 5. Ingress body parsing
app.use(express.json());

// 6. Health check Endpoint
app.get('/', (req, res) => {
  ApiResponse.success(res, null, 'API is running');
});

// 7. Not Found Router Handler
app.use(notFoundHandler);

// 8. Centralized Global Error Handler
app.use(errorHandler);

export default app;
