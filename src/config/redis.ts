import 'dotenv/config';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null, 
});

redis.on('connect', () => {
  console.log('⚡ Conectado ao Redis com sucesso!');
});

redis.on('error', (err) => {
  console.error('❌ Erro na conexão com o Redis:', err);
});