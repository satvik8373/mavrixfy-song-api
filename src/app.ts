import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { Home } from './pages/home'
import type { Routes } from '#common/types'
import type { HTTPException } from 'hono/http-exception'

export class App {
  private app: OpenAPIHono

  constructor(routes: Routes[]) {
    this.app = new OpenAPIHono()

    this.initializeGlobalMiddlewares()
    this.initializeRoutes(routes)
    this.initializeSwaggerUI()
    this.initializeRouteFallback()
    this.initializeErrorHandler()
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      route.initRoutes()
      this.app.route('/api', route.controller)
    })

    // Proxy recommendations requests to the main backend to support legacy app installations
    this.app.all('/api/recommendations/*', async (c) => {
      const targetUrl = new URL(c.req.url)
      targetUrl.host = 'mavrixfy-api-drab.vercel.app'
      targetUrl.protocol = 'https'
      targetUrl.port = ''
      
      const headers = new Headers(c.req.header())
      
      try {
        const response = await fetch(targetUrl.toString(), {
          method: c.req.method,
          headers,
          body: ['POST', 'PUT', 'PATCH'].includes(c.req.method) ? await c.req.blob() : undefined
        })
        
        return new Response(response.body, {
          status: response.status,
          headers: response.headers
        })
      } catch (err: any) {
        return c.json({ success: false, message: `Proxy failed: ${err.message}` }, 502)
      }
    })

    this.app.route('/', Home)
  }

  private initializeGlobalMiddlewares() {
    this.app.use(logger())
    this.app.use(prettyJSON())
    this.app.use(cors())
  }

  private initializeSwaggerUI() {
    this.app.doc31('/swagger', (c) => {
      const { protocol: urlProtocol, hostname, port } = new URL(c.req.url)
      const protocol = c.req.header('x-forwarded-proto') ? `${c.req.header('x-forwarded-proto')}:` : urlProtocol

      return {
        openapi: '3.1.0',

        info: {
          version: '1.0.0',
          title: 'JioSaavn API',
          description: `# Introduction 
        \nJioSaavn API, accessible at [saavn.dev](https://saavn.dev), is an unofficial API that allows users to download high-quality songs from [JioSaavn](https://jiosaavn.com). 
        It offers a fast, reliable, and easy-to-use API for developers. \n`
        },
        servers: [{ url: `${protocol}//${hostname}${port ? `:${port}` : ''}`, description: 'Current environment' }]
      }
    })

    this.app.get(
      '/docs',
      apiReference({
        pageTitle: 'JioSaavn API Documentation',
        theme: 'deepSpace',
        isEditable: false,
        layout: 'modern',
        darkMode: true,
        metaData: {
          applicationName: 'JioSaavn API',
          author: 'Sumit Kolhe',
          creator: 'Sumit Kolhe',
          publisher: 'Sumit Kolhe',
          robots: 'index, follow',
          description:
            'JioSaavn API is an unofficial wrapper written in TypeScript for jiosaavn.com providing programmatic access to a vast library of songs, albums, artists, playlists, and more.'
        },
        url: '/swagger'
      })
    )
  }

  private initializeRouteFallback() {
    this.app.notFound((ctx) => {
      return ctx.json({ success: false, message: 'route not found, check docs at https://saavn.dev/docs' }, 404)
    })
  }

  private initializeErrorHandler() {
    this.app.onError((err, ctx) => {
      console.error('API Error:', err)
      const error = err as HTTPException
      return ctx.json({ success: false, message: error.message || String(err) }, error.status || 500)
    })
  }

  public getApp() {
    return this.app
  }
}
