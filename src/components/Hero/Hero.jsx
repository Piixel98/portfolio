import { useEffect, useReducer, useRef } from 'react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

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
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-[5%] overflow-hidden"
    >
      <div className="grid-bg" />

      <pre className="absolute bottom-0 right-0 w-[52%] opacity-[0.04] font-mono text-[13px] leading-loose text-blue-400 pointer-events-none p-10 whitespace-pre hidden lg:block">
        {hero.codeBackground}
      </pre>

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

      <div className="max-w-3xl lg:max-w-[58rem] xl:max-w-3xl relative z-10">
        <div className="flex items-center gap-2.5 font-mono text-[12px] text-emerald-400 tracking-[0.15em] mb-6">
          <span className="w-6 h-px bg-emerald-400 inline-block" />
          {hero.label}
        </div>

        <h1 className="font-mono font-bold text-[clamp(44px,7vw,80px)] leading-[1.03] tracking-[-3px] mb-4">
          {profile.name}
          <br />
          <span className="text-blue-400">{profile.surname}</span>
        </h1>

        <div className="font-mono text-[clamp(15px,2vw,20px)] text-text-muted font-light mb-8 min-h-[30px]">
          <span
            className="typewriter-line"
            aria-label={prefersReducedMotion ? phrases[0] : phrase}
            style={{ '--typewriter-chars': displayedText.length }}
          >
            <span className="typewriter-line__sizer" aria-hidden="true">
              {longestPhrase}
            </span>
            <span className="typewriter-line__text" aria-hidden="true">
              {displayedText}
            </span>
          </span>
        </div>

        <p className="max-w-[540px] text-text-muted text-[16px] leading-[1.75] mb-11">
          {hero.description}
        </p>

        <div className="flex gap-4 flex-wrap mb-12">
          <a href={hero.primaryCta.href} className="btn-primary">
            <span aria-hidden="true" className="font-mono">
              &lt;/&gt;
            </span>
            {hero.primaryCta.label}
          </a>
          <a href={hero.secondaryCta.href} className="btn-secondary">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[15px] w-[15px]"
              focusable="false"
            >
              <rect x="4" y="6" width="16" height="12" rx="2" />
              <path d="m5 8 7 5 7-5" />
            </svg>
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
