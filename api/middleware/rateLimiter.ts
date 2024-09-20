import rateLimit from 'express-rate-limit';
import { RateLimitConfig } from '../interfaces/RateLimitConfig';
type EnvironmentConfig = {
  [key in 'development' | 'production']: RateLimitConfig;
};

const config: EnvironmentConfig = {
  development: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
  production: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
  },
};

const env = (process.env.NODE_ENV as keyof EnvironmentConfig) || 'development';

const rateLimiter = rateLimit({
  ...config[env],
  message: 'Too many requests from this IP, please try again after a minute',
});

export default rateLimiter;
