import { useMemo } from 'react'
import FadeIn from '../shared/FadeIn'
import SkillLogo from '../shared/SkillLogo'
import SkillMarquee from './SkillMarquee'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import './Skills.css'

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
    <section id="skills" className="skills-section section-backdrop">
      <div className="skills-ambient section-backdrop__ambient" aria-hidden="true" />

      <div className="skills-shell">
        <header className="section-heading section-heading--centered">
          <span className="tag">{skills.tag}</span>
          <h2 className="section-title">{skills.title}</h2>

          <div className="skills-metrics">
            {skills.metrics.map((metric) => (
              <div key={metric.label} className="skills-metric">
                <span className="skills-metric__value">{metric.value}</span>
                <span className="skills-metric__label">{metric.label}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="skills-groups">
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
                      <div className="skill-card__body">
                        <h4 className="skill-card__name">{skill.name}</h4>
                        <p className="skill-card__category">{skill.category}</p>
                      </div>
                      <div className="skill-card__progress" aria-hidden="true">
                        <div className="skill-card__progress-bar" style={{ width: skill.level }} />
                      </div>
                      <span className="skill-card__level">{skill.levelLabel}</span>
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
