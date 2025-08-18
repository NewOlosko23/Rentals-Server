import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 200, // requests
  duration: 60, // per 60 seconds
});

export async function rateLimiter(req, res, next){
  try {
    await limiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ message: 'Too many requests' });
  }
}
