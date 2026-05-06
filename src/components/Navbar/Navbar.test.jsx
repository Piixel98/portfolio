import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import portfolio from '../../data/portfolio'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('opens, focuses, and closes the mobile menu accessibly', async () => {
    const user = userEvent.setup()
    render(<Navbar nav={portfolio.nav} profile={portfolio.profile} />)

    const button = screen.getByRole('button', { name: /open navigation menu/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)

    expect(button).toHaveAccessibleName(/close navigation menu/i)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('link', { name: /about/i })[1]).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
  })

  it('has labelled navigation landmarks and controls', () => {
    render(<Navbar nav={portfolio.nav} profile={portfolio.profile} />)

    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute(
      'href',
      '#main-content',
    )
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveAttribute(
      'aria-controls',
      'mobile-navigation',
    )
  })
})
