import { useCallback, useEffect, useRef, useState } from 'react'
import './Experience.css'

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

function ExperienceEntry({ job, index, isActive, isSeen }) {
  const isCurrent = job.dates.includes('Present')
  const isEven = index % 2 === 0

  return (
    <article
      className={[
        'exp-entry',
        isEven ? 'exp-entry--left' : 'exp-entry--right',
        isCurrent ? 'exp-entry--current' : '',
        isSeen ? 'exp-entry--visible' : '',
        isActive ? 'exp-entry--active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--delay': `${index * 0.05}s` }}
    >
      <div className="exp-dot" aria-hidden="true">
        <span className="exp-dot__ring" />
        <span className="exp-dot__icon">
          <WorkIcon
            current={isCurrent}
            systems={job.title.toLowerCase().includes('administrator')}
          />
        </span>
      </div>

      <div className="exp-date">
        <span>{job.dates}</span>
      </div>

      <div className="exp-card">
        <div className="exp-card__glow" aria-hidden="true" />
        <header className="exp-card__header">
          <div className="exp-card__meta">
            <h3 className="exp-card__title">{job.title}</h3>
            <p className="exp-card__company">
              {job.company}
              <span className="exp-card__sep" aria-hidden="true">
                ·
              </span>
              <span className="exp-card__location">{job.location}</span>
            </p>
          </div>
          {isCurrent && <span className="exp-badge">Now</span>}
        </header>

        <ul className="exp-card__bullets">
          {job.bullets.map((bullet, bulletIndex) => (
            <li key={bullet} style={{ '--bi': bulletIndex }}>
              {bullet}
            </li>
          ))}
        </ul>

        <footer className="exp-card__stack">
          {job.stack.map((tag) => (
            <span key={tag} className="exp-tag">
              {tag}
            </span>
          ))}
        </footer>
      </div>
    </article>
  )
}

export default function Experience({ experience }) {
  const sectionRef = useRef(null)
  const entryRefs = useRef([])
  const [seenSet, setSeenSet] = useState(new Set())
  const [activeIndex, setActiveIndex] = useState(-1)
  const [progress, setProgress] = useState(0)

  const onScroll = useCallback(() => {
    if (!sectionRef.current) return

    const { top, height } = sectionRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const nextProgress = Math.min(
      1,
      Math.max(0, (viewportHeight * 0.6 - top) / (height - viewportHeight * 0.4)),
    )
    setProgress(nextProgress)

    let closest = -1
    let closestDistance = Infinity
    entryRefs.current.forEach((element, index) => {
      if (!element) return
      const rect = element.getBoundingClientRect()
      const distance = Math.abs(rect.top + rect.height / 2 - viewportHeight * 0.5)
      if (distance < closestDistance) {
        closestDistance = distance
        closest = index
      }
    })
    setActiveIndex(closest)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.idx)
            setSeenSet((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )

    entryRefs.current.forEach((element) => element && observer.observe(element))
    return () => observer.disconnect()
  }, [experience.jobs])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <section id="experience" className="exp-section" ref={sectionRef}>
      <div className="exp-shell">
        <header className="section-heading section-heading--centered exp-heading">
          <span className="tag">{experience.tag}</span>
          <h2 className="section-title">{experience.title}</h2>
        </header>

        <div className="exp-timeline">
          <div className="exp-rail" aria-hidden="true" />
          <div className="exp-rail__fill" aria-hidden="true" style={{ '--progress': progress }} />

          {experience.jobs.map((job, index) => (
            <div
              key={`${job.company}-${job.dates}`}
              ref={(element) => (entryRefs.current[index] = element)}
              data-idx={index}
            >
              <ExperienceEntry
                job={job}
                index={index}
                isActive={activeIndex === index}
                isSeen={seenSet.has(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
