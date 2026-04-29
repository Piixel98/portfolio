import * as Sentry from '@sentry/react'

export function initObservability() {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
    beforeSend(event, hint) {
      const message = hint?.originalException?.message || event.message || ''

      if (/ResizeObserver loop/i.test(message)) {
        return null
      }

      return event
    },
  })
}
