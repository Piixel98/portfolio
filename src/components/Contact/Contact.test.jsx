import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import portfolio from '../../data/portfolio'
import Contact from './Contact'

describe('Contact', () => {
  beforeEach(() => {
    vi.useRealTimers()
    Object.defineProperty(window, 'isSecureContext', {
      configurable: true,
      value: true,
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('copies the configured email and shows success feedback', async () => {
    const copyToClipboard = vi.fn().mockResolvedValue()
    const user = userEvent.setup()

    render(<Contact contact={portfolio.contact} copyToClipboard={copyToClipboard} />)

    await user.click(screen.getByRole('button', { name: /copy email address/i }))

    expect(copyToClipboard).toHaveBeenCalledWith('jordisanchezmora98@gmail.com')
    expect(await screen.findByRole('button', { name: /email copied/i })).toBeInTheDocument()
  })

  it('shows failure feedback when clipboard copy fails', async () => {
    const copyToClipboard = vi.fn().mockRejectedValue(new Error('blocked'))
    const user = userEvent.setup()

    render(<Contact contact={portfolio.contact} copyToClipboard={copyToClipboard} />)

    await user.click(screen.getByRole('button', { name: /copy email address/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copy failed/i })).toBeInTheDocument()
    })
  })
})
