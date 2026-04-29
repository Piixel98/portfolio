import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Languages from './components/Languages'
import Projects from './components/Projects'
import AiProjects from './components/AiProjects'
import Contact from './components/Contact'
import portfolio from './data/portfolio.json'

export default function App() {
  const cursorRef = useRef(null)
  const cursorRingRef = useRef(null)
  const ringX = useRef(0)
  const ringY = useRef(0)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }
    document.addEventListener('mousemove', moveCursor)

    const animRing = () => {
      ringX.current += (mouseX.current - ringX.current) * 0.12
      ringY.current += (mouseY.current - ringY.current) * 0.12
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringX.current}px, ${ringY.current}px) translate(-50%, -50%)`
      }
      requestAnimationFrame(animRing)
    }
    animRing()

    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      const el = document.getElementById('scroll-progress')
      if (el) el.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll)

    const fadeObserver = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.js-fade').forEach(el => fadeObserver.observe(el))

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('scroll', onScroll)
      fadeObserver.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={cursorRingRef} />
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
    </>
  )
}
