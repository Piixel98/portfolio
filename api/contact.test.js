import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from './contact'

function createResponse() {
  return {
    headers: {},
    json: vi.fn(function json(payload) {
      this.payload = payload
      return this
    }),
    setHeader: vi.fn(function setHeader(name, value) {
      this.headers[name] = value
    }),
    status: vi.fn(function status(code) {
      this.statusCode = code
      return this
    }),
  }
}

function createRequest({ body = {}, headers = {}, method = 'POST' } = {}) {
  return {
    body,
    headers: {
      'x-forwarded-for': `192.0.2.${Math.floor(Math.random() * 200) + 1}`,
      ...headers,
    },
    method,
    socket: { remoteAddress: '127.0.0.1' },
  }
}

const validBody = {
  email: 'jordi@example.com',
  fullName: 'Jordi Test',
  message: 'Hello from tests.',
  phone: '',
}

describe('api/contact', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.CONTACT_TO_EMAIL = 'owner@example.com'
    process.env.CONTACT_FROM_EMAIL = 'Portfolio <portfolio@example.com>'
    process.env.TURNSTILE_ENABLED = 'false'
    delete process.env.TURNSTILE_SECRET_KEY
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_TO_EMAIL
    delete process.env.CONTACT_FROM_EMAIL
    delete process.env.TURNSTILE_ENABLED
    delete process.env.TURNSTILE_SECRET_KEY
  })

  it('rejects unsupported methods', async () => {
    const res = createResponse()

    await handler(createRequest({ method: 'GET' }), res)

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST')
    expect(res.statusCode).toBe(405)
    expect(res.payload).toEqual({ message: 'Method not allowed.' })
  })

  it('requires explicit email service configuration', async () => {
    delete process.env.CONTACT_TO_EMAIL
    const res = createResponse()

    await handler(createRequest({ body: validBody }), res)

    expect(res.statusCode).toBe(500)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends a sanitized contact payload to Resend', async () => {
    const res = createResponse()

    await handler(
      createRequest({
        body: {
          ...validBody,
          fullName: ' <Jordi> ',
          message: 'Hello <script>alert(1)</script>',
        },
      }),
      res,
    )

    expect(res.statusCode).toBe(200)
    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
      }),
    )

    const resendPayload = JSON.parse(fetch.mock.calls[0][1].body)
    expect(resendPayload.html).toContain('&lt;script&gt;')
    expect(resendPayload.to).toEqual(['owner@example.com'])
  })

  it('validates decoded attachment size instead of trusting client metadata', async () => {
    const res = createResponse()
    const oversizedPdf = Buffer.alloc(2 * 1024 * 1024 + 1).toString('base64')

    await handler(
      createRequest({
        body: {
          ...validBody,
          attachment: {
            content: oversizedPdf,
            filename: 'cv.pdf',
            size: 1,
            type: 'application/pdf',
          },
        },
      }),
      res,
    )

    expect(res.statusCode).toBe(400)
    expect(res.payload.message).toMatch(/2MB or smaller/i)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rate limits repeated requests from the same client', async () => {
    const headers = { 'x-forwarded-for': '198.51.100.42' }

    for (let index = 0; index < 5; index += 1) {
      const res = createResponse()
      await handler(createRequest({ body: validBody, headers }), res)
      expect(res.statusCode).toBe(200)
    }

    const limitedRes = createResponse()
    await handler(createRequest({ body: validBody, headers }), limitedRes)

    expect(limitedRes.statusCode).toBe(429)
  })

  it('verifies Turnstile when the secret is configured', async () => {
    process.env.TURNSTILE_ENABLED = 'true'
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret'
    fetch.mockImplementation((url) => {
      if (String(url).includes('turnstile')) {
        return Promise.resolve({ json: () => Promise.resolve({ success: true }), ok: true })
      }
      return Promise.resolve({ ok: true, status: 200 })
    })
    const res = createResponse()

    await handler(
      createRequest({
        body: {
          ...validBody,
          turnstileToken: 'token',
        },
      }),
      res,
    )

    expect(res.statusCode).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('rejects Turnstile tokens from unexpected hostnames', async () => {
    process.env.TURNSTILE_ENABLED = 'true'
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret'
    process.env.TURNSTILE_EXPECTED_HOSTNAME = 'portfolio.example.com'
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ hostname: 'attacker.example.com', success: true }),
      ok: true,
    })
    const res = createResponse()

    await handler(
      createRequest({
        body: {
          ...validBody,
          turnstileToken: 'token',
        },
      }),
      res,
    )

    expect(res.statusCode).toBe(400)
    expect(res.payload.message).toMatch(/spam protection failed/i)
  })
})
