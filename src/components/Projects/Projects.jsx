export default function Projects({ projects }) {
  return (
    <section id="projects" className="bg-[#0E1420] px-[5%] py-24">
      <span className="tag">{projects.tag}</span>
      <h2 className="section-title mb-3">{projects.title}</h2>
      <p className="text-[#5A6478] max-w-xl mb-14 text-[15px]">{projects.intro}</p>

      <div className="flex flex-col gap-4 max-w-5xl">
        {projects.items.map((project, i) => (
          <div
            key={project.num}
            className="project-card js-fade"
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <div className="absolute right-10 top-7 font-mono text-[88px] font-bold text-white/[0.03] leading-none pointer-events-none select-none hidden md:block">
              {project.num}
            </div>

            <div className="relative z-10">
              <span className="font-mono text-[11px] text-emerald-400 tracking-[0.1em] block mb-2">
                {project.context}
              </span>
              <h3 className="text-[21px] font-medium mb-4 text-[#E8EAF0]">{project.title}</h3>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <p className="text-[14px] text-[#5A6478] leading-[1.75] max-w-[560px] mb-5">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {project.badges.map((badge) => (
                    <span key={badge} className="impact-badge">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
