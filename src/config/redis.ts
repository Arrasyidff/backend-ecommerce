import { Redis } from 'ioredis';

const isLocal = process.env.NODE_ENV === 'development' && !process.env.DOCKER_ENV;
const redisConfig = {
  host: isLocal ? 'localhost' : 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null
};
export const redis = new Redis(redisConfig);

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected');
});