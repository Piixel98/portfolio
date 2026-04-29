import { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function Experience({ experience }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const lineRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion && lineRef.current && sectionRef.current) {
      lineRef.current.style.height = `${sectionRef.current.offsetHeight}px`
      return undefined
    }

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && lineRef.current) {
          lineRef.current.style.height = sectionRef.current.offsetHeight + 'px'
        }
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section id="experience" className="px-[5%] py-24">
      <span className="tag">{experience.tag}</span>
      <h2 className="section-title mb-14">{experience.title}</h2>

      <div ref={sectionRef} className="relative pl-8 max-w-3xl">
        <div className="absolute left-0 top-2 bottom-0 w-px bg-white/[0.07]" />
        <div ref={lineRef} className="tl-progress" style={{ transition: 'height 1.4s ease' }} />

        {experience.jobs.map((job, i) => (
          <div
            key={`${job.company}-${job.dates}`}
            className="js-fade relative mb-14 group"
            style={{ transitionDelay: `${i * 0.15}s` }}
          >
            <div className="absolute -left-[38px] top-1.5 w-3 h-3 rounded-full border-2 border-blue-400 bg-[#080C12] transition-all duration-200 group-hover:bg-blue-400" />

            <div className="font-mono text-[11px] text-emerald-400 tracking-[0.1em] mb-1.5">
              {job.dates}
            </div>
            <div className="text-[19px] font-medium mb-1">{job.title}</div>
            <div className="font-mono text-[13px] text-[#5A6478] mb-4">
              {job.company} · <span className="text-[#3A4255]">{job.location}</span>
            </div>

            <ul className="text-[14px] text-[#5A6478] leading-[1.75] space-y-1.5 mb-5">
              {job.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="pl-4 relative before:content-['-'] before:absolute before:left-0 before:text-blue-400"
                >
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5">
              {job.stack.map((tag) => (
                <span key={tag} className="tl-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
