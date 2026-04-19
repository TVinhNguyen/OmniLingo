import type { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';

export async function cacheService(redis: FastifyInstance['redis']) {
  // ─── Key builders ──────────────────────────────────────────────────────────
  const keys = {
    languages: () => 'content:lang:all',
    tracks: (language: string) => `content:track:${language}`,
    course: (id: string) => `content:course:${id}`,
    unit: (id: string) => `content:unit:${id}`,
    lessonLatest: (id: string) => `content:lesson:${id}:latest`,
    lessonVersion: (id: string, version: number) => `content:lesson:${id}:v:${version}`,
    exercise: (id: string) => `content:exercise:${id}`,
  };

  // ─── Generic helpers ───────────────────────────────────────────────────────
  async function get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null; // fail-open
    }
  }

  async function set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      // fail-open — Redis unavailable, skip caching
    }
  }

  async function del(...keyList: string[]): Promise<void> {
    try {
      await redis.del(...keyList);
    } catch {
      // ignore
    }
  }

  return { keys, get, set, del };
}

export type CacheService = Awaited<ReturnType<typeof cacheService>>;
