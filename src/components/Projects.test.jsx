import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import portfolio from '../data/portfolio'
import Projects from './Projects'

describe('Projects', () => {
  it('renders validated portfolio project data', () => {
    render(<Projects projects={portfolio.projects} />)

    expect(screen.getByRole('heading', { name: portfolio.projects.title })).toBeInTheDocument()

    for (const project of portfolio.projects.items) {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    }
  })
})
