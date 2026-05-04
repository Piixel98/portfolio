import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

export default function Hero({ hero, profile }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef(null)
  const phrases = hero.phrases
  const displayedText = prefersReducedMotion ? phrases[0] : text

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    const phrase = phrases[phraseIdx]
    if (!deleting) {
      if (charIdx < phrase.length) {
        timeoutRef.current = setTimeout(() => {
          setText(phrase.slice(0, charIdx + 1))
          setCharIdx((c) => c + 1)
        }, 75)
      } else {
        timeoutRef.current = setTimeout(() => setDeleting(true), 1800)
      }
    } else if (charIdx > 0) {
      timeoutRef.current = setTimeout(() => {
        setText(phrase.slice(0, charIdx - 1))
        setCharIdx((c) => c - 1)
      }, 38)
    } else {
      timeoutRef.current = setTimeout(() => {
        setDeleting(false)
        setPhraseIdx((i) => (i + 1) % phrases.length)
      }, 0)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [charIdx, deleting, phraseIdx, phrases, prefersReducedMotion])

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
          src="/profile_character.png"
          alt=""
          className="hero-character__image"
          width="785"
          height="1102"
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

        <div className="font-mono text-[clamp(15px,2vw,20px)] text-[#5A6478] font-light mb-8 min-h-[30px]">
          <span className="text-emerald-400">{displayedText}</span>
          <span className="tw-cursor text-blue-400" aria-hidden="true">
            |
          </span>
        </div>

        <p className="max-w-[540px] text-[#5A6478] text-[16px] leading-[1.75] mb-11">
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
            <span aria-hidden="true" className="text-[15px] leading-none">
              ✉
            </span>
            {hero.secondaryCta.label}
          </a>
        </div>

        <div className="flex gap-3 flex-wrap">
          {hero.badges.map((badge) => (
            <span
              key={badge}
              className="font-mono text-[11px] border border-white/[0.07] px-3 py-1.5 rounded-full text-[#5A6478] tracking-[0.05em]"
            >
              {badge}
            </span>
          ))}
          <span className="font-mono text-[11px] border border-emerald-500/40 px-3 py-1.5 rounded-full text-emerald-400 tracking-[0.05em]">
            * {hero.availability}
          </span>
        </div>
      </div>
    </section>
  )
}
