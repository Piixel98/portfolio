import './Languages.css'
const LEVEL_COLOR = {
  Advanced: 'text-blue-400 border-blue-500/30',
  Basic: 'text-blue-300 border-blue-400/25',
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
    <section id="languages" className="section-backdrop px-[5%] py-24">
      <div className="section-shell">
        <header className="section-heading section-heading--centered">
          <span className="tag">{languages.tag}</span>
          <h2 className="section-title">{languages.title}</h2>
        </header>

        <div className="languages-shell">
          <div className="languages-row" aria-label="Languages list">
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

                  <div className="font-mono text-[17px] font-medium text-text mb-1">
                    {lang.name}
                  </div>
                  <div className="text-[12px] text-text-muted mb-5 min-h-8 leading-5">
                    {lang.desc}
                  </div>

                  <div className="language-progress" aria-hidden="true">
                    <div
                      className="language-progress__bar"
                      style={{ transform: `scaleX(${lang.bar / 100})` }}
                    />
                  </div>
                  <div className="mt-3 font-mono text-[10px] text-text-muted">{lang.bar}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
