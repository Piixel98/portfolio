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
import useCustomCursor from './hooks/useCustomCursor'
import useFadeInSections from './hooks/useFadeInSections'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import useScrollProgress from './hooks/useScrollProgress'
import portfolio from './data/portfolio'

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { cursorRef, cursorRingRef } = useCustomCursor(!prefersReducedMotion)

  useScrollProgress()
  useFadeInSections(!prefersReducedMotion)

  return (
    <>
      {!prefersReducedMotion && (
        <>
          <div id="cursor" ref={cursorRef} aria-hidden="true" />
          <div id="cursor-ring" ref={cursorRingRef} aria-hidden="true" />
        </>
      )}
      <div id="scroll-progress" aria-hidden="true" />

      <Navbar nav={portfolio.nav} profile={portfolio.profile} />

      <main id="main-content" tabIndex="-1">
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
