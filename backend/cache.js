import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const enableCache = process.env.ENABLE_CACHE !== 'false'; // Enabled by default unless explicitly false

export const redisClient = createClient({
  url: redisUrl
});

let isConnected = false;

if (enableCache) {
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.on('connect', () => {
    console.log('Connected to Redis');
    isConnected = true;
  });

  // Initialize Redis connection
  redisClient.connect().catch(console.error);
} else {
  console.log('Redis cache is disabled locally (ENABLE_CACHE=false)');
}

const DEFAULT_TTL = 300; // 5 minutes in seconds

export const getCache = async (key) => {
  if (!isConnected || !enableCache) return null;
  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (err) {
    console.error('Redis getCache Error:', err);
    return null; // Fail gracefully so DB can be queried
  }
};

export const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  if (!isConnected || !enableCache) return;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error('Redis setCache Error:', err);
  }
};

export const clearCache = async (key) => {
  if (!isConnected || !enableCache) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis clearCache Error:', err);
  }
};
