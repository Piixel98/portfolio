import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import {
  About,
  Contact,
  Education,
  Experience,
  Footer,
  Hero,
  Languages,
  Navbar,
  Projects,
  Skills,
} from './components'
import useCustomCursor from './hooks/useCustomCursor'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import useScrollProgress from './hooks/useScrollProgress'
import portfolio from './data/portfolio'

const shouldLoadAnalytics = import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { cursorRef, cursorRingRef } = useCustomCursor(!prefersReducedMotion)

  useScrollProgress()

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
        <Projects projects={portfolio.projects} skills={portfolio.skillsSection} />
        <Skills skills={portfolio.skillsSection} />
        <Contact contact={portfolio.contact} />
      </main>

      <Footer profile={portfolio.profile} contact={portfolio.contact} />

      {shouldLoadAnalytics && (
        <>
          <SpeedInsights />
          <Analytics />
        </>
      )}
    </>
  )
}
