import { useMemo, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'
import ProjectDetail from './ProjectDetail'
import { resolveProjectTechnologies } from './projectTech'

export default function Projects({ projects, skills }) {
  const [activeProject, setActiveProject] = useState(null)
  const openerRef = useRef(null)
  const projectTechnologies = useMemo(
    () => (activeProject ? resolveProjectTechnologies(activeProject, skills) : []),
    [activeProject, skills],
  )

  return (
    <>
      <section id="projects" className="section-backdrop px-[5%] py-24">
        <div className="mx-auto max-w-7xl">
          <header className="section-heading section-heading--centered">
            <span className="tag">{projects.tag}</span>
            <h2 className="section-title">{projects.title}</h2>
          </header>

          <div className="grid gap-5 xl:grid-cols-3">
            {projects.items.map((project, index) => (
              <ProjectCard
                key={project.num}
                project={project}
                index={index}
                onOpen={(projectNum) => {
                  openerRef.current = document.activeElement
                  setActiveProject(
                    projects.items.find((project) => project.num === projectNum) ?? null,
                  )
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {activeProject && (
        <ProjectDetail
          project={activeProject}
          projectTechnologies={projectTechnologies}
          onClose={() => {
            setActiveProject(null)
            window.requestAnimationFrame(() => openerRef.current?.focus())
          }}
        />
      )}
    </>
  )
}
