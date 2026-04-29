import { safeExternalLinkProps } from '../../utils/links'

export default function AiProjects({ aiProjects }) {
  return (
    <section id="ai-projects" className="px-[5%] py-24">
      <span className="tag">{aiProjects.tag}</span>
      <h2 className="section-title mb-3">{aiProjects.title}</h2>
      <p className="text-[#5A6478] max-w-xl mb-14 text-[15px]">{aiProjects.intro}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl">
        {aiProjects.items.map((project, i) => (
          <article
            key={project.title}
            className="js-fade relative bg-[#141B28] border border-white/[0.07] border-l-[3px] border-l-emerald-500 rounded-xl p-7 overflow-hidden transition-colors duration-200 hover:border-white/[0.12]"
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <div className="absolute right-6 bottom-6 font-mono text-[56px] font-bold leading-none text-emerald-500/[0.04] pointer-events-none select-none">
              {project.icon}
            </div>

            <div className="relative z-10 flex flex-col min-h-full">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pr-12">
                <div className="flex flex-col gap-2 max-w-[70%]">
                  <span className="font-mono text-[11px] text-emerald-400 tracking-[0.1em]">
                    {project.context}
                  </span>
                  <span className="inline-flex w-fit font-mono text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1 rounded-sm tracking-[0.08em]">
                    Personal Project
                  </span>
                </div>
                <span className="inline-flex w-fit font-mono text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-sm whitespace-nowrap">
                  {project.badge}
                </span>
              </div>

              <h3 className="text-[21px] font-medium mb-4 text-[#E8EAF0] leading-tight">
                {project.title}
              </h3>
              <p className="text-[14px] text-[#5A6478] leading-[1.75] mb-5">{project.desc}</p>

              <ul className="font-mono text-[11px] text-[#5A6478] leading-relaxed space-y-2 mb-6">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="text-emerald-400" aria-hidden="true">
                      *
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.stack.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={project.githubUrl}
                {...safeExternalLinkProps}
                className="font-mono text-[11px] text-[#5A6478] hover:text-blue-400 transition-colors mt-auto rounded focus-visible"
              >
                {project.github} <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
