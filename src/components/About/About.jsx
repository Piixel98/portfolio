import { useEffect, useReducer, useRef } from 'react'
import FadeIn from '../shared/FadeIn'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './About.css'

function numberReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return Math.min(state + action.step, action.target)
    case 'complete':
      return action.target
    default:
      return state
  }
}

function AnimatedNumber({ target }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [value, dispatch] = useReducer(numberReducer, 0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    let animationFrameId

    if (prefersReducedMotion) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const step = () => {
            const increment = Math.ceil(target / 40)
            start += increment
            if (start >= target) {
              dispatch({ type: 'complete', target })
              return
            }
            dispatch({ type: 'increment', step: increment, target })
            animationFrameId = requestAnimationFrame(step)
          }
          animationFrameId = requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [prefersReducedMotion, target])

  return <span ref={ref}>{prefersReducedMotion ? target : value}</span>
}

function AboutStat({ stat }) {
  return (
    <article className="about-stat">
      <div className="about-stat__value">
        <AnimatedNumber target={stat.num} />
        <span>{stat.suffix}</span>
      </div>
      <p>{stat.label}</p>
    </article>
  )
}

function SkillCluster({ group, index }) {
  return (
    <FadeIn
      as="article"
      className="about-skill"
      style={{ transitionDelay: `${Math.min(index * 0.05, 0.3)}s` }}
    >
      <span className="about-skill__label">{group.label}</span>
      <div className="about-skill__pills">
        {group.pills.map((pill) => (
          <span key={pill}>{pill}</span>
        ))}
      </div>
    </FadeIn>
  )
}

function AboutTerminal({ terminal }) {
  return (
    <div className="about-terminal">
      <div className="about-terminal__bar">
        <div className="about-terminal__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>{terminal.title ?? 'jordi@platform ~ zsh'}</span>
      </div>

      <div className="about-terminal__body">
        <div className="about-terminal__command">
          <span aria-hidden="true">›</span>
          <span>whoami</span>
        </div>
        <p>{terminal.whoami}</p>

        <div className="about-terminal__divider" />

        <div className="about-terminal__command">
          <span aria-hidden="true">›</span>
          <span>skills --list</span>
        </div>
        <div className="about-terminal__skills">
          {terminal.skills?.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        <div className="about-terminal__divider" />

        <div className="about-terminal__status">
          <span aria-hidden="true" />
          <span>
            {terminal.statusHighlight && <strong>{terminal.statusHighlight} </strong>}
            {terminal.status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function About({ about }) {
  return (
    <section id="about" className="about-section">
      <div className="about-shell">
        <header className="section-heading section-heading--centered">
          <span className="tag">{about.tag}</span>
          <h2 className="section-title">
            {about.title.map((line, index) => (
              <span key={line}>
                <span className={index === about.title.length - 1 ? 'text-blue-400' : ''}>
                  {line}
                </span>
                <br />
              </span>
            ))}
          </h2>
        </header>

        <div className="about-layout">
          <FadeIn className="about-copy-panel">
            <div className="about-copy-panel__rail" aria-hidden="true" />
            <div className="about-copy-panel__kicker">
              <span>Production profile</span>
              <span>Backend · Cloud · Data</span>
            </div>

            <div className="about-copy-panel__body">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="about-skills">
              {about.skills.map((group, index) => (
                <SkillCluster key={group.label} group={group} index={index} />
              ))}
            </div>
          </FadeIn>

          <FadeIn className="about-side-panel">
            <div className="about-stats">
              {about.stats.map((stat) => (
                <AboutStat key={stat.label} stat={stat} />
              ))}
            </div>

            <AboutTerminal terminal={about.terminal} />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
