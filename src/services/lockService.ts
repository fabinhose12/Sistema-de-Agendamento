import { redis } from '../config/redis.js';

export async function acquireLock(lockKey: string, ttlMs: number = 5000): Promise<boolean> {
  const result = await redis.set(`lock:${lockKey}`, 'LOCKED', 'PX', ttlMs, 'NX');
  return result === 'OK';
}

export async function releaseLock(lockKey: string): Promise<void> {
  await redis.del(`lock:${lockKey}`);
}