import { useMemo } from 'react'
import FadeIn from '../FadeIn'
import SkillLogo from '../SkillLogo'
import SkillMarquee from './SkillMarquee'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

export default function Skills({ skills }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const marqueeItems = useMemo(
    () =>
      skills.groups.map((group) => ({
        ...group,
        renderItems: prefersReducedMotion ? group.items : [...group.items, ...group.items],
      })),
    [prefersReducedMotion, skills.groups],
  )

  return (
    <section id="skills" className="section-backdrop px-[5%] py-24">
      <div
        className="section-backdrop__ambient absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16, 185, 129, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px)',
          backgroundSize: '92px 92px',
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="section-heading section-heading--centered">
          <span className="tag">{skills.tag}</span>
          <h2 className="section-title">{skills.title}</h2>

          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 overflow-hidden rounded-lg border border-white/[0.07] bg-bg-2/80">
            {skills.metrics.map((metric) => (
              <div key={metric.label} className="border-r border-white/[0.07] p-5 last:border-r-0">
                <span className="block font-mono text-[26px] text-text">{metric.value}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        <div className="space-y-5">
          {marqueeItems.map((group, groupIndex) => {
            return (
              <FadeIn
                as="article"
                key={group.title}
                className="skill-group"
                style={{ transitionDelay: `${Math.min(groupIndex * 0.08, 0.5)}s` }}
              >
                <div className="skill-group__header">
                  <div>
                    <div className="skill-group__eyebrow">
                      <span>{String(groupIndex + 1).padStart(2, '0')}</span>
                      <span>{group.title}</span>
                    </div>
                    <h3 className="skill-group__title">{group.title}</h3>
                    <p className="skill-group__description">{group.description}</p>
                  </div>
                  <div className="skill-group__meta">
                    <span>{group.items.length} tools</span>
                  </div>
                </div>

                <SkillMarquee
                  groupIndex={groupIndex}
                  groupTitle={group.title}
                  prefersReducedMotion={prefersReducedMotion}
                >
                  {group.renderItems.map((skill, skillIndex) => (
                    <article
                      key={`${skill.name}-${skillIndex}`}
                      className="skill-card"
                      aria-hidden={!prefersReducedMotion && skillIndex >= group.items.length}
                      style={{
                        '--skill-color': skill.color,
                      }}
                    >
                      <div className="skill-card__scanline" aria-hidden="true" />
                      <SkillLogo className="skill-card__logo" logo={skill.logo} name={skill.name} />
                      <div className="min-w-0">
                        <h4 className="truncate text-[15px] font-medium text-text">{skill.name}</h4>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">
                          {skill.category}
                        </p>
                      </div>
                      <div
                        className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-full bg-[var(--skill-color)]"
                          style={{ width: skill.level }}
                        />
                      </div>
                      <span className="mt-3 block font-mono text-[10px] text-[var(--skill-color)]">
                        {skill.levelLabel}
                      </span>
                    </article>
                  ))}
                </SkillMarquee>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
