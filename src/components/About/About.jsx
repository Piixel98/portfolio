import { useEffect, useReducer, useRef } from 'react'
import FadeIn from '../FadeIn'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

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

function AnimatedNumber({ target, suffix = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [value, dispatch] = useReducer(numberReducer, 0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    let animationFrameId

    if (prefersReducedMotion) return undefined

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
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

  return (
    <span ref={ref}>
      {prefersReducedMotion ? target : value}
      {suffix}
    </span>
  )
}

export default function About({ about }) {
  return (
    <section id="about" className="bg-bg-2 px-[5%] py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
        <FadeIn>
          <span className="tag">{about.tag}</span>
          <h2 className="section-title mb-7">
            {about.title.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h2>

          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-text-muted mb-5 leading-[1.75]">
              {paragraph}
            </p>
          ))}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-9">
            {about.skills.map((group) => (
              <FadeIn key={group.label}>
                <span className="font-mono text-[10px] tracking-[0.15em] text-blue-400 uppercase block mb-2.5">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.pills.map((pill) => (
                    <span key={pill} className="pill">
                      {pill}
                    </span>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="flex flex-col gap-5">
          {about.stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="font-mono text-[44px] font-light leading-none mb-1.5 text-text">
                <AnimatedNumber target={stat.num} suffix={stat.suffix} />
              </div>
              <div className="text-[13px] text-text-muted">{stat.label}</div>
            </div>
          ))}

          <div className="rounded-lg border border-white/[0.07] bg-[var(--color-bg-5)] p-5 font-mono text-[12px]">
            <div className="flex gap-1.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="text-emerald-400">$ whoami</div>
            <div className="text-text-muted mt-1">{about.terminal.whoami}</div>
            <div className="text-emerald-400 mt-2">$ skills --list</div>
            {about.terminal.skills.map((skill) => (
              <div key={skill} className="text-blue-400 mt-1">
                {skill}
              </div>
            ))}
            <div className="text-emerald-400 mt-2">$ status</div>
            <div className="text-text-muted mt-1">
              <span className="text-emerald-400" aria-hidden="true">
                *
              </span>{' '}
              {about.terminal.status}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
