import { useEffect, useRef, useState } from 'react'
import './Education.css'

function DotGrid() {
  return (
    <svg className="edu-dotgrid" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="edu-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#edu-dots)" />
    </svg>
  )
}

function Corner({ pos = 'tl' }) {
  const rotations = {
    tl: 'translate(0,0)',
    tr: 'rotate(90 12 12)',
    br: 'rotate(180 12 12)',
    bl: 'rotate(270 12 12)',
  }

  return (
    <svg
      className={`edu-corner edu-corner--${pos}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <g transform={rotations[pos]}>
        <path d="M2 10 L2 2 L10 2" />
      </g>
    </svg>
  )
}

function EduCard({ item, index, seen }) {
  const year = item.dates?.match(/\d{4}/g)?.pop() ?? ''

  return (
    <article
      className={['edu-card', seen ? 'edu-card--visible' : ''].filter(Boolean).join(' ')}
      style={{ '--i': index }}
    >
      <span className="edu-card__year" aria-hidden="true">
        {year}
      </span>

      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="br" />
      <Corner pos="bl" />

      <div className="edu-card__glow" aria-hidden="true" />

      <div className="edu-card__head">
        <span className="edu-card__dates">{item.dates}</span>

        <div className="edu-card__icon-wrap">
          {item.icon?.startsWith('/') ? (
            <img src={item.icon} alt="" loading="lazy" decoding="async" className="edu-card__img" />
          ) : (
            <span className="edu-card__icon-text">{item.icon}</span>
          )}
        </div>
      </div>

      <div className="edu-card__body">
        <h3 className="edu-card__degree">{item.degree}</h3>
        <p className="edu-card__institution">
          <span className="edu-card__inst-line" aria-hidden="true" />
          {item.institution}
        </p>
        <p className="edu-card__desc">{item.description}</p>
      </div>

      <footer className="edu-card__footer">
        <div className="edu-card__divider" aria-hidden="true" />
        <div className="edu-card__highlights">
          {item.highlights.map((highlight, highlightIndex) => (
            <span key={highlight} className="edu-highlight" style={{ '--hi': highlightIndex }}>
              {highlight}
            </span>
          ))}
        </div>
      </footer>
    </article>
  )
}

export default function Education({ education }) {
  const cardRefs = useRef([])
  const [seenSet, setSeenSet] = useState(new Set())

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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    cardRefs.current.forEach((element) => element && observer.observe(element))
    return () => observer.disconnect()
  }, [education.items])

  return (
    <section id="education" className="edu-section">
      <DotGrid />

      <div className="edu-shell">
        <header className="section-heading section-heading--centered edu-heading">
          <span className="tag">{education.tag}</span>
          <h2 className="section-title">{education.title}</h2>
        </header>

        <div className="edu-grid">
          {education.items.map((item, index) => (
            <div
              key={`${item.degree}-${item.dates}`}
              ref={(element) => (cardRefs.current[index] = element)}
              data-idx={index}
            >
              <EduCard item={item} index={index} seen={seenSet.has(index)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
