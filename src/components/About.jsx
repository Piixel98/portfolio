import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

function AnimatedNumber({ target, suffix = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  const displayedValue = prefersReducedMotion ? target : val

  useEffect(() => {
    let animationFrameId

    if (prefersReducedMotion) return undefined

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const step = () => {
            start += Math.ceil(target / 40)
            if (start >= target) {
              setVal(target)
              return
            }
            setVal(start)
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
      {displayedValue}
      {suffix}
    </span>
  )
}

export default function About({ about }) {
  return (
    <section id="about" className="bg-[#0E1420] px-[5%] py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
        <div className="js-fade">
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
            <p key={paragraph} className="text-[#5A6478] mb-5 leading-[1.75]">
              {paragraph}
            </p>
          ))}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-9">
            {about.skills.map((group) => (
              <div key={group.label} className="js-fade">
                <label className="font-mono text-[10px] tracking-[0.15em] text-blue-400 uppercase block mb-2.5">
                  {group.label}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {group.pills.map((pill) => (
                    <span key={pill} className="pill">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 js-fade">
          {about.stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="font-mono text-[44px] font-light leading-none mb-1.5 text-[#E8EAF0]">
                <AnimatedNumber target={stat.num} suffix={stat.suffix} />
              </div>
              <div className="text-[13px] text-[#5A6478]">{stat.label}</div>
            </div>
          ))}

          <div className="bg-[#0A0E18] border border-white/[0.07] rounded-lg p-5 font-mono text-[12px]">
            <div className="flex gap-1.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="text-emerald-400">$ whoami</div>
            <div className="text-[#5A6478] mt-1">{about.terminal.whoami}</div>
            <div className="text-emerald-400 mt-2">$ skills --list</div>
            {about.terminal.skills.map((skill) => (
              <div key={skill} className="text-blue-400 mt-1">
                {skill}
              </div>
            ))}
            <div className="text-emerald-400 mt-2">$ status</div>
            <div className="text-[#5A6478] mt-1">
              <span className="text-emerald-400">●</span> {about.terminal.status}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
