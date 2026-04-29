import { describe, expect, it } from 'vitest'
import { getPreferredLocale, normalizeLocale } from './locales'

describe('locales', () => {
  it('normalizes regional language tags', () => {
    expect(normalizeLocale('es-ES')).toBe('es')
    expect(normalizeLocale('en-US')).toBe('en')
  })

  it('falls back to English for unsupported languages', () => {
    expect(normalizeLocale('fr-FR')).toBe('en')
    expect(getPreferredLocale(['fr-FR', 'de-DE'])).toBe('en')
  })

  it('selects the first supported preferred language', () => {
    expect(getPreferredLocale(['fr-FR', 'es-ES', 'en-US'])).toBe('es')
  })
})
