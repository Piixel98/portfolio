import { useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import {
  About,
  AiProjects,
  Contact,
  Education,
  Experience,
  Hero,
  Languages,
  Navbar,
  Projects,
} from './components'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import portfolio from './data/portfolio'

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const cursorRef = useRef(null)
  const cursorRingRef = useRef(null)
  const ringX = useRef(0)
  const ringY = useRef(0)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useEffect(() => {
    let animationFrameId

    const moveCursor = (e) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }
    const animRing = () => {
      ringX.current += (mouseX.current - ringX.current) * 0.12
      ringY.current += (mouseY.current - ringY.current) * 0.12
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringX.current}px, ${ringY.current}px) translate(-50%, -50%)`
      }
      animationFrameId = requestAnimationFrame(animRing)
    }

    if (!prefersReducedMotion) {
      document.addEventListener('mousemove', moveCursor)
      animationFrameId = requestAnimationFrame(animRing)
    }

    const onScroll = () => {
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      )
      const pct = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0
      const width = `${Math.min(Math.max(pct, 0), 100)}%`
      const el = document.getElementById('scroll-progress')
      if (el) el.style.width = width
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const fadeElements = document.querySelectorAll('.js-fade')
    let fadeObserver

    if (prefersReducedMotion) {
      fadeElements.forEach((el) => el.classList.add('visible'))
    } else {
      fadeObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('visible')
          }),
        { threshold: 0.1 },
      )
      fadeElements.forEach((el) => fadeObserver.observe(el))
    }

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('scroll', onScroll)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      fadeObserver?.disconnect()
    }
  }, [prefersReducedMotion])

  return (
    <>
      {!prefersReducedMotion && (
        <>
          <div id="cursor" ref={cursorRef} aria-hidden="true" />
          <div id="cursor-ring" ref={cursorRingRef} aria-hidden="true" />
        </>
      )}
      <div id="scroll-progress" />

      <Navbar nav={portfolio.nav} profile={portfolio.profile} />

      <main>
        <Hero hero={portfolio.hero} profile={portfolio.profile} />
        <About about={portfolio.about} />
        <Experience experience={portfolio.experience} />
        <Education education={portfolio.education} />
        <Languages languages={portfolio.languages} />
        <Projects projects={portfolio.projects} />
        <AiProjects aiProjects={portfolio.aiProjects} />
        <Contact contact={portfolio.contact} />
      </main>

      <footer className="border-t border-white/[0.07] px-[5%] py-8 flex justify-between items-center">
        <p className="font-mono text-[11px] text-[#5A6478]">{portfolio.profile.footerText}</p>
        <p className="font-mono text-[10px] text-blue-400 tracking-[0.1em]">
          {portfolio.profile.githubLabel}
        </p>
      </footer>

      <SpeedInsights />
      <Analytics />
    </>
  )
}
