import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function ProjectDetail({ project, projectTechnologies, onClose }) {
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusableElements = Array.from(panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR))
      if (focusableElements.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="project-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        type="button"
        className="project-modal__backdrop"
        aria-label="Close project details"
        onClick={onClose}
      />

      <div ref={panelRef} className="project-modal__panel" tabIndex="-1">
        <button
          ref={closeButtonRef}
          type="button"
          className="project-modal__close"
          aria-label="Close project details"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6 18 18" />
            <path d="M18 6 6 18" />
          </svg>
        </button>

        <div className="project-modal__hero">
          <div className="project-modal__hero-copy">
            <span className="project-modal__context">{project.context}</span>
            <h3 id="project-modal-title" className="project-modal__title">
              {project.title}
            </h3>
            <p className="project-modal__lead">{project.desc}</p>
          </div>

          <div className="project-modal__hero-side">
            <div className="project-modal__hero-number">{project.num}</div>
          </div>

          <div className="project-modal__signals">
            {project.badges.map((badge) => (
              <span key={badge} className="impact-badge">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="project-modal__grid">
          <div className="project-modal__main">
            <section className="project-modal__section project-modal__section--feature">
              <span className="project-modal__label">Technical focus</span>
              <div className="project-modal__details">
                {project.details.map((detail, index) => (
                  <div key={detail} className="project-modal__detail-item">
                    <span className="project-modal__detail-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p>{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {projectTechnologies.length > 0 && (
              <section className="project-modal__section project-modal__section--related">
                <div className="project-modal__section-head">
                  <span className="project-modal__label">Related technologies</span>
                  <p className="project-modal__section-copy">
                    Technologies explicitly used in this project, based on the project stack defined
                    in the portfolio data.
                  </p>
                </div>
                <div className="project-modal__related">
                  {projectTechnologies.map((item) => (
                    <div key={item.name} className="project-modal__related-card">
                      <div
                        className="project-modal__related-logo"
                        style={{ '--skill-color': item.color }}
                      >
                        {item.logo ? (
                          <img src={item.logo} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <span className="project-modal__related-fallback" aria-hidden="true">
                            {item.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="project-modal__related-name">{item.name}</div>
                        <div className="project-modal__related-meta">
                          {item.category} / {item.levelLabel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
