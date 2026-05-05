import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import portfolio from '../../data/portfolio'
import Projects from './Projects'

describe('Projects', () => {
  it('renders validated portfolio project data', () => {
    render(<Projects projects={portfolio.projects} skills={portfolio.skillsSection} />)

    expect(screen.getByRole('heading', { name: portfolio.projects.title })).toBeInTheDocument()

    for (const project of portfolio.projects.items) {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    }
  })

  it('opens a modal with project details', async () => {
    const user = userEvent.setup()

    render(<Projects projects={portfolio.projects} skills={portfolio.skillsSection} />)

    await user.click(screen.getByRole('button', { name: /free-flow tolling platform/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Technical focus')).toBeInTheDocument()
    expect(screen.getByText('Related technologies')).toBeInTheDocument()
  })
})
