import { describe, expect, it } from 'vitest'
import { getLinkSecurityProps, isExternalHref, safeExternalLinkProps } from './links'

describe('link utilities', () => {
  it('detects http and https links as external', () => {
    expect(isExternalHref('https://example.com')).toBe(true)
    expect(isExternalHref('http://example.com')).toBe(true)
  })

  it('does not treat mailto or hash links as external browser tabs', () => {
    expect(isExternalHref('mailto:test@example.com')).toBe(false)
    expect(isExternalHref('#contact')).toBe(false)
  })

  it('returns safe tab isolation props only for external links', () => {
    expect(getLinkSecurityProps('https://example.com')).toEqual(safeExternalLinkProps)
    expect(getLinkSecurityProps('mailto:test@example.com')).toEqual({})
  })
})
