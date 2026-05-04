const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_API_URL = 'https://api.resend.com/emails'

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { message: 'Method not allowed.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL || 'test@gmail.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

  if (!apiKey) {
    return json(res, 500, { message: 'Email service is not configured.' })
  }

  const fullName = sanitize(req.body?.fullName, 140)
  const email = sanitize(req.body?.email, 254).toLowerCase()
  const phone = sanitize(req.body?.phone, 50)
  const message = sanitize(req.body?.message, 5000)
  const attachment = req.body?.attachment || null

  if (!fullName || !email || !message) {
    return json(res, 400, { message: 'Missing required fields.' })
  }

  if (!EMAIL_RE.test(email)) {
    return json(res, 400, { message: 'Invalid email address.' })
  }

  const attachments = []
  if (attachment) {
    const filename = sanitize(attachment.filename, 180)
    const content = sanitize(attachment.content, 4_000_000)
    const size = Number(attachment.size || 0)
    const type = sanitize(attachment.type, 80)

    if (!filename.toLowerCase().endsWith('.pdf') || type !== 'application/pdf') {
      return json(res, 400, { message: 'Only PDF attachments are accepted.' })
    }

    if (!content || size > MAX_ATTACHMENT_BYTES) {
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

  const resendResponse = await fetch(RESEND_API_URL, {
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

  if (!resendResponse.ok) {
    return json(res, 502, { message: 'Email provider rejected the request.' })
  }

  return json(res, 200, { ok: true })
}
