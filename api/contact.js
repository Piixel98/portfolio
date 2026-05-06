const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_API_URL = 'https://api.resend.com/emails'
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TURNSTILE_TOKEN_MAX_LENGTH = 2048
const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const rateLimitStore = globalThis.__portfolioContactRateLimit || new Map()

globalThis.__portfolioContactRateLimit = rateLimitStore

function json(res, status, payload) {
  res.status(status).json(payload)
}

function sanitize(value, maxLength = 2000) {
  return String(value || '')
    .trim()
    .slice(0, maxLength)
}

function escapeHtml(value) {
  return sanitize(value, 5000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function logContactError(reason, error) {
  const message = error instanceof Error ? error.message : String(error || 'unknown error')
  console.error('contact endpoint error', { message, reason })
}

function getClientKey(req) {
  const cloudflareIp = sanitize(req.headers?.['cf-connecting-ip'], 120)
  if (cloudflareIp) return cloudflareIp

  const forwardedFor = sanitize(req.headers?.['x-forwarded-for'], 300)
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return sanitize(req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown', 120)
}

function isRateLimited(key, now = Date.now()) {
  for (const [storedKey, bucket] of rateLimitStore.entries()) {
    if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(storedKey)
    }
  }

  const bucket = rateLimitStore.get(key)
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { count: 1, windowStart: now })
    return false
  }

  bucket.count += 1
  return bucket.count > RATE_LIMIT_MAX_REQUESTS
}

function getAttachmentByteLength(content) {
  const normalized = sanitize(content, 4_000_000).replace(/\s/g, '')
  if (!normalized || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) return 0
  return Buffer.byteLength(normalized, 'base64')
}

async function verifyTurnstile(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  const expectedHostname = sanitize(process.env.TURNSTILE_EXPECTED_HOSTNAME, 253).toLowerCase()
  if (!secret) return true
  if (!token) return false

  const formData = new URLSearchParams({
    remoteip: remoteIp,
    response: token,
    secret,
  })

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    body: formData,
    method: 'POST',
  })

  if (!response.ok) return false

  const result = await response.json().catch(() => null)
  if (!result?.success) {
    logContactError('turnstile_rejected_token', new Error(result?.['error-codes']?.join(', ')))
    return false
  }

  if (expectedHostname && sanitize(result.hostname, 253).toLowerCase() !== expectedHostname) {
    logContactError('turnstile_hostname_mismatch', new Error('hostname mismatch'))
    return false
  }

  return true
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { message: 'Method not allowed.' })
  }

  const clientKey = getClientKey(req)
  if (isRateLimited(clientKey)) {
    return json(res, 429, { message: 'Too many requests. Please try again later.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !toEmail || !fromEmail) {
    return json(res, 500, { message: 'Email service is not configured.' })
  }

  const fullName = sanitize(req.body?.fullName, 140)
  const email = sanitize(req.body?.email, 254).toLowerCase()
  const phone = sanitize(req.body?.phone, 50)
  const message = sanitize(req.body?.message, 5000)
  const attachment = req.body?.attachment || null
  const company = sanitize(req.body?.company, 120)
  const turnstileToken = sanitize(req.body?.turnstileToken, TURNSTILE_TOKEN_MAX_LENGTH)

  if (company) {
    return json(res, 200, { ok: true })
  }

  if (!fullName || !email || !message) {
    return json(res, 400, { message: 'Missing required fields.' })
  }

  if (!EMAIL_RE.test(email)) {
    return json(res, 400, { message: 'Invalid email address.' })
  }

  try {
    const turnstileOk = await verifyTurnstile(turnstileToken, clientKey)
    if (!turnstileOk) {
      return json(res, 400, { message: 'Spam protection failed.' })
    }
  } catch (error) {
    logContactError('turnstile_verification_failed', error)
    return json(res, 502, { message: 'Spam protection is temporarily unavailable.' })
  }

  const attachments = []
  if (attachment) {
    const filename = sanitize(attachment.filename, 180)
    const content = sanitize(attachment.content, 4_000_000)
    const type = sanitize(attachment.type, 80)
    const byteLength = getAttachmentByteLength(content)

    if (!filename.toLowerCase().endsWith('.pdf') || type !== 'application/pdf') {
      return json(res, 400, { message: 'Only PDF attachments are accepted.' })
    }

    if (!content || byteLength === 0 || byteLength > MAX_ATTACHMENT_BYTES) {
      return json(res, 400, { message: 'The PDF must be 2MB or smaller.' })
    }

    attachments.push({ content, filename })
  }

  const html = `
    <h2>New portfolio contact</h2>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>
  `

  let resendResponse
  try {
    resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attachments,
        from: fromEmail,
        html,
        reply_to: email,
        subject: `Portfolio contact - ${fullName}`,
        text: `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\n${message}`,
        to: [toEmail],
      }),
    })
  } catch (error) {
    logContactError('resend_request_failed', error)
    return json(res, 502, { message: 'Email provider is temporarily unavailable.' })
  }

  if (!resendResponse.ok) {
    logContactError('resend_rejected_request', new Error(`status ${resendResponse.status}`))
    return json(res, 502, { message: 'Email provider rejected the request.' })
  }

  return json(res, 200, { ok: true })
}
