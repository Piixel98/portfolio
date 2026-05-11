import { useEffect, useReducer, useRef } from 'react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './Hero.css'

const initialTypeState = {
  phraseIdx: 0,
  charIdx: 0,
  deleting: false,
}

function typeReducer(state, action) {
  switch (action.type) {
    case 'type/forward':
      return { ...state, charIdx: state.charIdx + 1 }
    case 'type/backward':
      return { ...state, charIdx: Math.max(state.charIdx - 1, 0) }
    case 'type/startDeleting':
      return { ...state, deleting: true }
    case 'type/nextPhrase':
      return {
        phraseIdx: (state.phraseIdx + 1) % action.totalPhrases,
        charIdx: 0,
        deleting: false,
      }
    default:
      return state
  }
}

export default function Hero({ hero, profile }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [{ phraseIdx, charIdx, deleting }, dispatch] = useReducer(typeReducer, initialTypeState)
  const timeoutRef = useRef(null)
  const phrases = hero.phrases
  const phrase = phrases[phraseIdx] || ''
  const longestPhrase = phrases.reduce((longest, current) => {
    return current.length > longest.length ? current : longest
  }, '')
  const displayedText = prefersReducedMotion ? phrases[0] : phrase.slice(0, charIdx)

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    let action
    let delay

    if (!deleting) {
      if (charIdx < phrase.length) {
        action = { type: 'type/forward' }
        delay = 75
      } else {
        action = { type: 'type/startDeleting' }
        delay = 1800
      }
    } else if (charIdx > 0) {
      action = { type: 'type/backward' }
      delay = 38
    } else {
      action = { type: 'type/nextPhrase', totalPhrases: phrases.length }
      delay = 0
    }

    timeoutRef.current = setTimeout(() => dispatch(action), delay)
    return () => clearTimeout(timeoutRef.current)
  }, [charIdx, deleting, phrase.length, phrases.length, prefersReducedMotion])

  return (
    <section id="hero" className="hero-section">
      <div className="grid-bg" />

      <pre className="hero-code-bg">{hero.codeBackground}</pre>

      <div className="hero-character" aria-hidden="true">
        <div className="hero-character__glow" />
        <div className="hero-character__arm-blur" />
        <img
          src="/profile_character.webp"
          srcSet="/profile_character.webp 785w"
          sizes="(max-width: 640px) 23rem, (max-width: 767px) 82vw, min(44vw, 38rem)"
          alt=""
          className="hero-character__image"
          width="785"
          height="1102"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="hero-content">
        <div className="hero-label">
          <span />
          {hero.label}
        </div>

        <h1 className="hero-title">
          {profile.name}
          <br />
          <span>{profile.surname}</span>
        </h1>

        <div className="hero-typewriter">
          <span className="typewriter-line" style={{ '--typewriter-chars': displayedText.length }}>
            <span className="sr-only">{prefersReducedMotion ? phrases[0] : phrase}</span>
            <span className="typewriter-line__sizer" aria-hidden="true">
              {longestPhrase}
            </span>
            <span className="typewriter-line__text" aria-hidden="true">
              {displayedText}
            </span>
          </span>
        </div>

        <p className="hero-description">{hero.description}</p>

        <div className="hero-actions">
          <a href={hero.primaryCta.href} className="btn-primary">
            <span aria-hidden="true">&lt;/&gt;</span>
            {hero.primaryCta.label}
          </a>
          <a href={hero.secondaryCta.href} className="btn-secondary">
            <img src="/icons/mail.svg" alt="" aria-hidden="true" loading="lazy" />
            {hero.secondaryCta.label}
          </a>
        </div>

        <div className="hero-badges">
          {hero.badges.map((badge) => (
            <span key={badge} className="hero-badge">
              {badge}
            </span>
          ))}
          <span className="hero-badge hero-badge--availability">* {hero.availability}</span>
        </div>
      </div>
    </section>
  )
}
