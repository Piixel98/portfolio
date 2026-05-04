import { useId, useState } from 'react'
import { getLinkSecurityProps } from '../../utils/links'

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024
const MAX_ATTACHMENT_MB = MAX_ATTACHMENT_BYTES / 1024 / 1024
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result || '')
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = () => reject(new Error('Unable to read attachment.'))
    reader.readAsDataURL(file)
  })
}

export default function Contact({ contact }) {
  const formId = useId()
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const [attachmentName, setAttachmentName] = useState('')

  const validateAttachment = (file) => {
    if (!file || file.size === 0) return ''
    if (file.type !== 'application/pdf') return 'Only PDF files are accepted.'
    if (file.size > MAX_ATTACHMENT_BYTES)
      return `The PDF must be ${MAX_ATTACHMENT_MB}MB or smaller.`
    return ''
  }

  const handleAttachmentChange = (event) => {
    const file = event.currentTarget.files?.[0]
    const error = validateAttachment(file)

    setAttachmentName(file?.name || '')
    setFeedback(error)
    setStatus(error ? 'error' : 'idle')

    if (error) {
      event.currentTarget.value = ''
      setAttachmentName('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('pending')
    setFeedback('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const fullName = String(formData.get('fullName') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const company = String(formData.get('company') || '').trim()
    const file = formData.get('attachment')

    if (company) {
      setStatus('success')
      setFeedback(contact.form.success)
      form.reset()
      setAttachmentName('')
      return
    }

    if (!fullName || !email || !message) {
      setStatus('error')
      setFeedback('Please complete all required fields.')
      return
    }

    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      setFeedback('Please enter a valid email address.')
      return
    }

    const attachmentError = validateAttachment(file)
    if (attachmentError) {
      setStatus('error')
      setFeedback(attachmentError)
      return
    }

    try {
      const attachment =
        file && file.size > 0
          ? {
              content: await readFileAsBase64(file),
              filename: file.name,
              size: file.size,
              type: file.type,
            }
          : null

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachment, email, fullName, message, phone }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.message || 'Unable to send message.')
      }

      setStatus('success')
      setFeedback(contact.form.success)
      form.reset()
      setAttachmentName('')
    } catch {
      setStatus('error')
      setFeedback(contact.form.error)
    }
  }

  return (
    <section id="contact" className="px-[5%] py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <span className="tag">{contact.tag}</span>

          <h2 className="font-mono text-[clamp(28px,5vw,52px)] font-medium tracking-tight mb-4">
            {contact.title[0]}
            <br />
            <span className="text-blue-400">{contact.title[1]}</span>
          </h2>
          <p className="text-[#5A6478] max-w-md mb-10 text-[15px] leading-7">{contact.intro}</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contact.items.map((item) => {
              const linkProps = item.href ? getLinkSecurityProps(item.href) : {}

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  {...linkProps}
                  className="contact-item text-left no-underline focus-visible"
                >
                  <span className="font-mono text-[10px] text-blue-400 tracking-[0.1em] block mb-1.5">
                    {item.label}
                  </span>
                  <div className="font-mono text-[12px] text-[#5A6478] break-all">{item.value}</div>
                </a>
              ) : (
                <div key={item.label} className="contact-item text-left">
                  <span className="font-mono text-[10px] text-blue-400 tracking-[0.1em] block mb-1.5">
                    {item.label}
                  </span>
                  <div className="font-mono text-[12px] text-[#5A6478]">{item.value}</div>
                </div>
              )
            })}
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__header">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-400">
              Contact form
            </span>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor={`${formId}-company`}>Company</label>
            <input id={`${formId}-company`} name="company" tabIndex="-1" autoComplete="off" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="contact-field">
              <span>{contact.form.fullName}</span>
              <input name="fullName" type="text" autoComplete="name" required />
            </label>

            <label className="contact-field">
              <span>{contact.form.email}</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>

            <label className="contact-field sm:col-span-2">
              <span>{contact.form.phone}</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="Optional" />
            </label>

            <label className="contact-field sm:col-span-2">
              <span>{contact.form.message}</span>
              <textarea name="message" rows="6" required />
            </label>

            <label className="contact-upload sm:col-span-2">
              <span className="contact-upload__icon" aria-hidden="true">
                PDF
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-blue-400">
                  {contact.form.attachment}
                </span>
                <span className="mt-2 block truncate text-[13px] text-[#5A6478]">
                  {attachmentName || contact.form.attachmentHint}
                </span>
              </span>
              <input
                name="attachment"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleAttachmentChange}
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <p
              className={`min-h-5 text-center font-mono text-[11px] ${
                status === 'success'
                  ? 'text-emerald-400'
                  : status === 'error'
                    ? 'text-red-300'
                    : 'text-[#5A6478]'
              }`}
              aria-live="polite"
            >
              {feedback}
            </p>

            <button
              type="submit"
              disabled={status === 'pending'}
              className={`btn-primary contact-submit justify-center disabled:cursor-not-allowed disabled:opacity-80 ${
                status === 'success' ? '!bg-emerald-500' : status === 'error' ? '!bg-red-500' : ''
              }`}
            >
              {status === 'pending' && (
                <span className="contact-submit__spinner" aria-hidden="true" />
              )}
              <span>{status === 'pending' ? contact.form.sending : contact.form.submit}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
