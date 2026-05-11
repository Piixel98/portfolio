import './Languages.css'
const LEVEL_COLOR = {
  Advanced: 'language-level--advanced',
  Basic: 'language-level--basic',
  Native: 'language-level--native',
}

const FLAGS = {
  CA: { src: '/flags/ca.svg', country: 'Catalonia' },
  EN: { src: '/flags/gb.svg', country: 'United Kingdom' },
  ES: { src: '/flags/es.svg', country: 'Spain' },
  FR: { src: '/flags/fr.svg', country: 'France' },
}

export default function Languages({ languages }) {
  return (
    <section id="languages" className="languages-section section-backdrop">
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
                  <div className="language-card__head">
                    <div className="language-flag">
                      <img
                        src={flag?.src}
                        alt={`${flag?.country || lang.name} flag`}
                        width="48"
                        height="48"
                        loading="lazy"
                        decoding="async"
                        className="language-flag__img"
                      />
                    </div>

                    <div
                      className={`language-level ${LEVEL_COLOR[lang.level] || LEVEL_COLOR.Advanced}`}
                    >
                      {lang.level}
                    </div>
                  </div>

                  <div className="language-name">{lang.name}</div>
                  <div className="language-desc">{lang.desc}</div>

                  <div className="language-progress" aria-hidden="true">
                    <div
                      className="language-progress__bar"
                      style={{ transform: `scaleX(${lang.bar / 100})` }}
                    />
                  </div>
                  <div className="language-percent">{lang.bar}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
