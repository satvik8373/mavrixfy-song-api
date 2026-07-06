import { Redis as UpstashRedis } from '@upstash/redis'
import Redis from 'ioredis'

export interface RedisClient {
  get: <T>(key: string) => Promise<T | null>
  set: (key: string, value: string, options?: { ex?: number }) => Promise<string | null>
  setex: (key: string, seconds: number, value: string) => Promise<string | null>
  del: (...keys: string[]) => Promise<number>
  status: string
}

// In-memory cache fallback for local/serverless environments without Redis credentials
class MemoryCache implements RedisClient {
  private cache = new Map<string, { value: string; expiresAt?: number }>()
  public status = 'memory'

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    try {
      return JSON.parse(entry.value) as T
    } catch {
      return entry.value as unknown as T
    }
  }

  async set(key: string, value: string, options?: { ex?: number }): Promise<string | null> {
    const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : undefined
    this.cache.set(key, { value, expiresAt })
    return 'OK'
  }

  async setex(key: string, seconds: number, value: string): Promise<string | null> {
    return this.set(key, value, { ex: seconds })
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0
    for (const key of keys) {
      if (this.cache.delete(key)) deleted++
    }
    return deleted
  }
}

let redisClient: RedisClient | null = null

export function getRedisClient(): RedisClient {
  if (redisClient) return redisClient

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashUrl && upstashToken) {
    try {
      const upstash = new UpstashRedis({
        url: upstashUrl.replace(/^"|"$/g, ''),
        token: upstashToken.replace(/^"|"$/g, '')
      })

      redisClient = {
        get: async <T>(key: string): Promise<T | null> => {
          const res = await upstash.get(key)
          if (!res) return null
          if (typeof res === 'string') {
            try { return JSON.parse(res) as T } catch { return res as unknown as T }
          }
          return res as T
        },
        set: async (key: string, value: string, options?: { ex?: number }) => {
          if (options?.ex) {
            return (await upstash.set(key, value, { ex: options.ex })) as string
          }
          return (await upstash.set(key, value)) as string
        },
        setex: async (key: string, seconds: number, value: string) => {
          return (await upstash.setex(key, seconds, value)) as string
        },
        del: async (...keys: string[]) => {
          return await upstash.del(...keys)
        },
        status: 'upstash-rest'
      }
      console.log('[Redis] Initialized Upstash REST client')
      return redisClient
    } catch (err) {
      console.warn('[Redis] Failed to initialize Upstash Redis:', err)
    }
  }

  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL
  if (redisUrl) {
    try {
      const io = new Redis(redisUrl, {
        maxRetriesPerRequest: 2,
        lazyConnect: true,
        connectTimeout: 5000
      })
      redisClient = {
        get: async <T>(key: string): Promise<T | null> => {
          const res = await io.get(key)
          if (!res) return null
          try { return JSON.parse(res) as T } catch { return res as unknown as T }
        },
        set: async (key: string, value: string, options?: { ex?: number }) => {
          if (options?.ex) {
            return await io.set(key, value, 'EX', options.ex)
          }
          return await io.set(key, value)
        },
        setex: async (key: string, seconds: number, value: string) => {
          return await io.setex(key, seconds, value)
        },
        del: async (...keys: string[]) => {
          return await io.del(...keys)
        },
        status: 'ioredis'
      }
      console.log('[Redis] Initialized ioredis client')
      return redisClient
    } catch (err) {
      console.warn('[Redis] Failed to initialize ioredis client:', err)
    }
  }

  console.log('[Redis] No Redis credentials found, using MemoryCache stub')
  redisClient = new MemoryCache()
  return redisClient
}
