const LEVEL_COLOR = {
  Advanced: 'text-blue-400 border-blue-500/30',
  Basic: 'text-amber-300 border-amber-400/30',
  Native: 'text-emerald-400 border-emerald-500/30',
}

const FLAGS = {
  CA: { src: '/flags/ca.svg', country: 'Catalonia' },
  EN: { src: '/flags/gb.svg', country: 'United Kingdom' },
  ES: { src: '/flags/es.svg', country: 'Spain' },
  FR: { src: '/flags/fr.svg', country: 'France' },
}

export default function Languages({ languages }) {
  return (
    <section id="languages" className="px-[5%] py-24">
      <div className="section-shell">
        <div className="section-heading">
          <span className="tag">{languages.tag}</span>
          <h2 className="section-title mb-14">{languages.title}</h2>
        </div>

        <div className="languages-shell">
        {/* Required so Safari keyboard users can focus and scroll the horizontal language list. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="languages-row" role="region" tabIndex="0" aria-label="Languages list">
          {languages.items.map((lang) => {
            const flag = FLAGS[lang.flag]

            return (
              <div key={lang.name} className="language-card">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="language-flag">
                    <img
                      src={flag?.src}
                      alt={`${flag?.country || lang.name} flag`}
                      width="48"
                      height="48"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div
                    className={`font-mono text-[10px] tracking-wide border inline-block px-2.5 py-1 rounded-sm ${LEVEL_COLOR[lang.level] || LEVEL_COLOR.Advanced}`}
                  >
                    {lang.level}
                  </div>
                </div>

                <div className="font-mono text-[17px] font-medium text-[#E8EAF0] mb-1">
                  {lang.name}
                </div>
                <div className="text-[12px] text-[#5A6478] mb-5 min-h-8 leading-5">{lang.desc}</div>

                <div className="language-progress" aria-hidden="true">
                  <div className="language-progress__bar" style={{ width: `${lang.bar}%` }} />
                </div>
                <div className="mt-3 font-mono text-[10px] text-[#5A6478]">{lang.bar}%</div>
              </div>
            )
          })}
        </div>
        </div>
      </div>
    </section>
  )
}
