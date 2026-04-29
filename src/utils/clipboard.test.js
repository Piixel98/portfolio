import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyTextToClipboard } from './clipboard'

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the async Clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue()
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    await copyTextToClipboard('hello')

    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('throws when no clipboard strategy succeeds', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    })

    await expect(copyTextToClipboard('hello')).rejects.toThrow(/Clipboard API/)
  })
})
