import FadeIn from '../FadeIn'

export default function Education({ education }) {
  return (
    <section id="education" className="bg-bg-2 px-[5%] py-24">
      <div className="section-shell">
        <div className="section-heading">
          <span className="tag">{education.tag}</span>
          <h2 className="section-title mb-14">{education.title}</h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {education.items.map((item, i) => (
            <FadeIn
              as="article"
              key={`${item.degree}-${item.dates}`}
              className="bg-bg-3 border border-white/[0.07] rounded-xl p-8 hover:border-blue-500/30 transition-all duration-200 group"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-5">
                <span className="font-mono text-[11px] text-emerald-400 tracking-[0.1em]">
                  {item.dates}
                </span>
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                  {item.icon.startsWith('/') ? (
                    <img
                      src={item.icon}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-[22px] w-[22px] object-contain"
                    />
                  ) : (
                    <span className="font-mono text-[14px] font-bold">{item.icon}</span>
                  )}
                </div>
              </div>

              <h3 className="font-mono text-[16px] font-medium leading-snug mb-1.5 text-text">
                {item.degree}
              </h3>
              <div className="font-mono text-[12px] text-text-muted mb-4">{item.institution}</div>
              <p className="text-[13px] text-text-muted leading-[1.7] mb-5">{item.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {item.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="font-mono text-[10px] bg-white/[0.04] border border-white/[0.07] text-text-muted px-2 py-1 rounded-sm"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
