import { getRedisClient } from '#common/config/redis.config'
import { userAgents, type Endpoints } from '#common/constants'
import type { ApiContextEnum } from '#common/enums'

type EndpointValue = (typeof Endpoints)[keyof typeof Endpoints]

interface FetchParams {
  endpoint: EndpointValue
  params: Record<string, string | number>
  context?: ApiContextEnum
}

interface FetchResponse<T> {
  data: T
  ok: Response['ok']
}

export const useFetch = async <T>({ endpoint, params, context }: FetchParams): Promise<FetchResponse<T>> => {
  // Build cache key
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {})

  const cacheKey = `saavn:${endpoint.toString()}:${JSON.stringify(sortedParams)}`
  const redis = getRedisClient()

  // 1. Try Cache Hit
  try {
    const cachedData = await redis.get<T>(cacheKey)
    if (cachedData) {
      return { data: cachedData, ok: true }
    }
  } catch (err) {
    console.warn('[Redis] Read error in fetch.helper:', err)
  }

  // 2. Fetch from JioSaavn upstream
  const url = new URL('https://www.jiosaavn.com/api.php')

  url.searchParams.append('__call', endpoint.toString())
  url.searchParams.append('_format', 'json')
  url.searchParams.append('_marker', '0')
  url.searchParams.append('api_version', '4')
  url.searchParams.append('ctx', context || 'web6dot0')

  Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])))

  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': randomUserAgent,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'L=english; gdpr_acceptance=true; DL=english'
      },
      signal: controller.signal
    })

    const data = (await response.json()) as T

    // 3. Write to Redis Cache on success (TTL 30 minutes = 1800s)
    if (response.ok && data) {
      const ttl = endpoint.toString().includes('search') ? 300 : 1800
      redis.setex(cacheKey, ttl, JSON.stringify(data)).catch((err) => {
        console.warn('[Redis] Write error in fetch.helper:', err)
      })
    }

    return { data, ok: response.ok }
  } finally {
    clearTimeout(timeoutId)
  }
}
