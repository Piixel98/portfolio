import { describe, expect, it } from 'vitest'
import rawPortfolio from './portfolio.json'
import { parsePortfolio } from './portfolioSchema'

describe('portfolio schema', () => {
  it('validates the portfolio content before rendering', () => {
    expect(parsePortfolio(rawPortfolio).profile.name).toBe('Jordi')
  })

  it('rejects malformed content', () => {
    expect(() => parsePortfolio({ ...rawPortfolio, nav: { links: [] } })).toThrow(
      /Invalid portfolio data/,
    )
  })
})
