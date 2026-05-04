import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

function serveLocal404() {
  const notFoundPath = path.resolve(process.cwd(), 'public', '404.html')

  const shouldServe404 = (req) => {
    if (!req.url || !['GET', 'HEAD'].includes(req.method)) return false

    const url = new URL(req.url, 'http://localhost')
    const acceptsHtml = req.headers.accept?.includes('text/html')
    const hasFileExtension = Boolean(path.extname(url.pathname))

    return acceptsHtml && url.pathname !== '/' && !url.pathname.startsWith('/api/') && !hasFileExtension
  }

  const handler = (req, res, next) => {
    if (!shouldServe404(req)) {
      next()
      return
    }

    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(fs.readFileSync(notFoundPath, 'utf8'))
  }

  return {
    name: 'serve-local-404',
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
    configureServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig({
  plugins: [serveLocal404(), react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
