export default function Skills({ skills }) {
  return (
    <section id="skills" className="relative overflow-hidden border-y border-white/[0.07] px-[5%] py-24">
      <div
        className="absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16, 185, 129, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px)',
          backgroundSize: '92px 92px',
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div>
            <span className="tag">{skills.tag}</span>
            <h2 className="section-title mb-4">{skills.title}</h2>
            <p className="max-w-2xl text-[15px] leading-7 text-[#5A6478]">{skills.intro}</p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/[0.07] bg-[#0E1420]/80">
            {skills.metrics.map((metric) => (
              <div key={metric.label} className="border-r border-white/[0.07] p-5 last:border-r-0">
                <span className="block font-mono text-[26px] text-[#E8EAF0]">{metric.value}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[#5A6478]">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {skills.items.map((skill, index) => (
            <article
              key={skill.name}
              className="skill-card js-fade"
              style={{
                '--skill-color': skill.color,
                transitionDelay: `${Math.min(index * 0.045, 0.45)}s`,
              }}
            >
              <div className="skill-card__scanline" aria-hidden="true" />
              <div className="skill-card__logo">
                <img src={skill.logo} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-medium text-[#E8EAF0]">{skill.name}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#5A6478]">
                  {skill.category}
                </p>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                <div className="h-full rounded-full bg-[var(--skill-color)]" style={{ width: skill.level }} />
              </div>
              <span className="mt-3 block font-mono text-[10px] text-[var(--skill-color)]">
                {skill.levelLabel}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
