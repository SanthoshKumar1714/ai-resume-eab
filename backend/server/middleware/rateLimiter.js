import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for AI enhancement endpoints
 * Limits: 15 requests per minute per IP (Gemini Free Tier constraint)
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 requests per minute
  message: {
    error: 'Rate limit exceeded',
    message: 'Please wait before making more requests',
    retryAfter: 60
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Please wait before making more requests',
      retryAfter
    });
  }
});

/**
 * General API rate limiter
 * More lenient for non-AI endpoints
 */
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too many requests',
    message: 'Please slow down'
  }
});
