import { useEffect, useId, useRef, useState } from 'react'

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile)

  const existingScript = document.querySelector(`script[src="${TURNSTILE_SCRIPT_SRC}"]`)
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.turnstile), { once: true })
      existingScript.addEventListener('error', reject, { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.turnstile)
    script.onerror = reject
    document.head.append(script)
  })
}

export default function TurnstileField({ onTokenChange, resetSignal, siteKey }) {
  const widgetIdRef = useRef(null)
  const containerRef = useRef(null)
  const statusId = useId()
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined

    let cancelled = false

    loadTurnstileScript()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          size: 'flexible',
          callback(token) {
            setStatus('verified')
            onTokenChange(token)
          },
          'expired-callback'() {
            setStatus('expired')
            onTokenChange('')
          },
          'error-callback'() {
            setStatus('error')
            onTokenChange('')
          },
        })
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error')
          onTokenChange('')
        }
      })

    return () => {
      cancelled = true
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
    }
  }, [onTokenChange, resetSignal, siteKey])

  if (!siteKey) return null

  return (
    <div className="contact-turnstile">
      <div ref={containerRef} aria-describedby={statusId} />
      <p id={statusId} className="sr-only" aria-live="polite">
        {status === 'verified'
          ? 'Spam protection verified.'
          : status === 'expired'
            ? 'Spam protection expired. Please verify again.'
            : status === 'error'
              ? 'Spam protection could not load.'
              : 'Spam protection loading.'}
      </p>
    </div>
  )
}
