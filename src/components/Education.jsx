export default function Education({ education }) {
  return (
    <section id="education" className="bg-[#0E1420] px-[5%] py-24">
      <span className="tag">{education.tag}</span>
      <h2 className="section-title mb-14">{education.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {education.items.map((item, i) => (
          <div
            key={`${item.degree}-${item.dates}`}
            className="js-fade bg-[#141B28] border border-white/[0.07] rounded-xl p-8 hover:border-blue-500/30 transition-all duration-200 group"
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-5">
              <span className="font-mono text-[11px] text-emerald-400 tracking-[0.1em]">{item.dates}</span>
              <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-[14px] font-mono font-bold group-hover:bg-blue-500/20 transition-colors">
                {item.icon}
              </div>
            </div>

            <h3 className="font-mono text-[16px] font-medium leading-snug mb-1.5 text-[#E8EAF0]">
              {item.degree}
            </h3>
            <div className="font-mono text-[12px] text-[#5A6478] mb-4">{item.institution}</div>
            <p className="text-[13px] text-[#5A6478] leading-[1.7] mb-5">{item.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {item.highlights.map(highlight => (
                <span
                  key={highlight}
                  className="font-mono text-[10px] bg-white/[0.04] border border-white/[0.07] text-[#5A6478] px-2 py-1 rounded-sm"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
