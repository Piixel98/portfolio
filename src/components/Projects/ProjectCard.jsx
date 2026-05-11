import FadeIn from '../shared/FadeIn'

export default function ProjectCard({ project, index, onOpen }) {
  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
  }

  return (
    <FadeIn
      as="button"
      type="button"
      className="project-card project-card--interactive"
      aria-label={`Open project details for ${project.title}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
      onClick={() => onOpen(project.num)}
      onPointerMove={handlePointerMove}
    >
      <div className="project-card__glow" aria-hidden="true" />
      <div className="project-card__spotlight" aria-hidden="true" />
      <div className="project-card__scan" aria-hidden="true" />
      <div className="project-card__number" aria-hidden="true">
        {project.num}
      </div>
      <div className="project-card__arrow" aria-hidden="true">
        <img src="/icons/arrow-up-right.svg" alt="" loading="lazy" />
      </div>

      <div className="project-card__content">
        <div className="project-card__topline" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="project-card__header">
          <span className="project-card__context">{project.context}</span>
          <h3 className="project-card__title">{project.title}</h3>
        </div>

        <div className="project-card__summaryBlock">
          <p className="project-card__summary">{project.desc}</p>
        </div>

        <div className="project-card__signalsBlock">
          <div className="project-card__signals">
            {project.badges.map((badge) => (
              <span key={badge} className="impact-badge">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="project-card__stackPreview" aria-label="Project stack">
          {project.stack.slice(0, 5).map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>

        <div className="project-card__footer">
          <div className="project-card__details">
            {project.details.slice(0, 2).map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
