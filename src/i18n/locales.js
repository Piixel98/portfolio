export const defaultLocale = 'en'

export const supportedLocales = {
  en: {
    code: 'en',
    label: 'English',
    path: '/',
  },
  es: {
    code: 'es',
    label: 'Espanol',
    path: '/es/',
  },
}

export function isSupportedLocale(locale) {
  return Object.prototype.hasOwnProperty.call(supportedLocales, locale)
}

export function normalizeLocale(locale) {
  if (!locale) return defaultLocale

  const [language] = locale.toLowerCase().split('-')

  return isSupportedLocale(language) ? language : defaultLocale
}

export function getPreferredLocale(languages = []) {
  const preferredLocale = languages
    .map((locale) => locale?.toLowerCase().split('-')[0])
    .find(isSupportedLocale)

  return preferredLocale || defaultLocale
}
