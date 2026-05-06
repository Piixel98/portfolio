import { useEffect, useRef } from 'react'
import FadeIn from '../FadeIn'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

function WorkIcon({ current = false, systems = false }) {
  if (current) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m5.6 5.6 2.8 2.8" />
        <path d="m15.6 15.6 2.8 2.8" />
        <path d="m15.6 8.4 2.8-2.8" />
        <path d="m5.6 18.4 2.8-2.8" />
        <circle cx="12" cy="12" r="3.25" />
      </svg>
    )
  }

  if (systems) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="4" y="5" width="16" height="6" rx="1.5" />
        <rect x="4" y="13" width="16" height="6" rx="1.5" />
        <path d="M8 8h.01" />
        <path d="M8 16h.01" />
        <path d="M12 8h4" />
        <path d="M12 16h4" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 6V4.75A1.75 1.75 0 0 1 10.75 3h2.5A1.75 1.75 0 0 1 15 4.75V6" />
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 11.5h18" />
      <path d="M10 11.5v1.5h4v-1.5" />
    </svg>
  )
}

export default function Experience({ experience }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const lineRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const revealLine = () => {
      if (!lineRef.current || !sectionRef.current) return
      lineRef.current.style.height = `${sectionRef.current.offsetHeight}px`
      lineRef.current.style.transform = 'scaleY(1)'
    }

    if (prefersReducedMotion && lineRef.current && sectionRef.current) {
      revealLine()
      return undefined
    }

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && lineRef.current) {
          revealLine()
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section id="experience" className="px-[5%] py-24">
      <div className="section-shell">
        <div className="section-heading">
          <span className="tag">{experience.tag}</span>
          <h2 className="section-title mb-14">{experience.title}</h2>
        </div>

        <div ref={sectionRef} className="experience-timeline">
          <div className="experience-timeline__rail" aria-hidden="true" />
          <div ref={lineRef} className="tl-progress" />

          {experience.jobs.map((job, i) => (
            <FadeIn
              as="article"
              key={`${job.company}-${job.dates}`}
              className={`experience-entry group ${job.dates.includes('Present') ? 'experience-entry--current' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="experience-entry__marker" aria-hidden="true">
                <span className="experience-entry__marker-icon">
                  <WorkIcon
                    current={job.dates.includes('Present')}
                    systems={job.title.toLowerCase().includes('administrator')}
                  />
                </span>
              </div>

              <div className="experience-entry__time">
                <span className="experience-entry__dates">{job.dates}</span>
              </div>

              <div className="experience-entry__card">
                <div className="experience-entry__header">
                  <div>
                    <h3 className="experience-entry__title">{job.title}</h3>
                    <div className="experience-entry__company">
                      {job.company} / <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                <ul className="experience-entry__bullets">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                <div className="experience-entry__stack">
                  {job.stack.map((tag) => (
                    <span key={tag} className="tl-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
