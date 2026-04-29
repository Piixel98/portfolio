const LEVEL_COLOR = {
  Native: 'text-emerald-400 border-emerald-500/30',
  Advanced: 'text-blue-400 border-blue-500/30',
}

export default function Languages({ languages }) {
  return (
    <section id="languages" className="px-[5%] py-24">
      <span className="tag">{languages.tag}</span>
      <h2 className="section-title mb-14">{languages.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
        {languages.items.map((lang, i) => (
          <div
            key={lang.name}
            className="js-fade bg-[#141B28] border border-white/[0.07] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-200"
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono text-[13px] font-bold text-blue-400 mb-5">
              {lang.flag}
            </div>

            <div className="font-mono text-[17px] font-medium text-[#E8EAF0] mb-1">{lang.name}</div>
            <div
              className={`font-mono text-[11px] tracking-wide border inline-block px-2.5 py-0.5 rounded-sm mb-4 ${LEVEL_COLOR[lang.level] || LEVEL_COLOR.Advanced}`}
            >
              {lang.level}
            </div>
            <div className="text-[12px] text-[#5A6478] mb-4">{lang.desc}</div>

            <div className="w-full h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${lang.bar}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
