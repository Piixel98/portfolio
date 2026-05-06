import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import portfolio from '../../data/portfolio'
import { resolveProjectTechnologies } from './projectTech'
import ProjectDetail from './ProjectDetail'

describe('ProjectDetail', () => {
  it('exposes an accessible dialog name and traps keyboard focus', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const project = portfolio.projects.items[0]

    render(
      <ProjectDetail
        project={project}
        projectTechnologies={resolveProjectTechnologies(project, portfolio.skillsSection)}
        onClose={onClose}
      />,
    )

    const dialog = screen.getByRole('dialog', { name: project.title })
    const closeButton = document.querySelector('.project-modal__close')

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(closeButton).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
