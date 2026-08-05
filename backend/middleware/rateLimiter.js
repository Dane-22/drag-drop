import rateLimit from 'express-rate-limit';

// 1. Strict Authentication Limiter (5 attempts per 15 minutes per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 429,
    message: 'Rate Limit Exceeded: Too many login attempts. Please wait 15 minutes before trying again.'
  }
});

// 2. Field Operations & Data Mutation Limiter (150 requests per 1 minute per IP)
export const mutationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return token && process.env.SERVICE_API_KEY && token === process.env.SERVICE_API_KEY;
  },
  message: {
    status: 'error',
    code: 429,
    message: 'Rate Limit Exceeded: Rapid field mutation requests detected. Please wait 1 minute.'
  }
});

// 3. Global API Read Limiter (200 requests per 15 minutes per IP)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return token && process.env.SERVICE_API_KEY && token === process.env.SERVICE_API_KEY;
  },
  message: {
    status: 'error',
    code: 429,
    message: 'Rate Limit Exceeded: Too many API read requests. Please slow down.'
  }
});
