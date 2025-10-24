import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { attachGeminiClient } from './middleware/geminiClient.js';
import { aiRateLimiter, generalRateLimiter } from './middleware/rateLimiter.js';
import aiEnhanceRoutes from './routes/ai-enhance.js';
import resumeSaveRoutes from './routes/resume-save.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach Gemini client to requests
app.use(attachGeminiClient);

// Apply general rate limiter to all API routes
app.use('/api', generalRateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResumeCraft API is running' });
});

// Routes with specific rate limiters
app.use('/api', aiRateLimiter, aiEnhanceRoutes);
app.use('/api', resumeSaveRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ ResumeCraft API server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
