import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import portfolio from '../../data/portfolio'
import Contact from './Contact'

describe('Contact', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('submits the contact form payload', async () => {
    const user = userEvent.setup()

    render(<Contact contact={portfolio.contact} />)

    await user.type(screen.getByLabelText(/full name/i), 'Jordi Test')
    await user.type(screen.getByLabelText(/^email$/i), 'jordi@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello from the portfolio form.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          body: expect.stringContaining('"fullName":"Jordi Test"'),
          method: 'POST',
        }),
      )
    })
    expect(await screen.findByText(/message sent successfully/i)).toBeInTheDocument()
  })

  it('rejects oversized pdf attachments before submit', async () => {
    const user = userEvent.setup()
    const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'cv.pdf', {
      type: 'application/pdf',
    })

    render(<Contact contact={portfolio.contact} />)

    await user.upload(screen.getByLabelText(/attach pdf/i), file)

    expect(screen.getByText(/2MB or smaller/i)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })
})
