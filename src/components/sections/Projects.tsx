import { projects } from '../../data/portfolio'
import { ExternalOrPlaceholder } from '../ui/ExternalOrPlaceholder'
import { SectionHeader } from '../ui/SectionHeader'
import { TechTag } from '../ui/TechTag'

export function Projects() {
  return (
    <section className="section-block projects-section grid-field" id="work" aria-labelledby="work-title">
      <SectionHeader id="work-title" number="03" eyebrow="Selected projects" title="Work with" italic="purpose." />
      <div className="projects-list">
        {projects.map((project) => (
          <article className="project-card" key={project.name}>
            <div className="project-card__meta">
              <span className="technical-label">Project / {project.number}</span>
              <span className="technical-label">{project.status}</span>
            </div>
            <div className="project-card__body">
              <div>
                <p className="project-card__type technical-label">{project.type}</p>
                <h3>{project.name}</h3>
              </div>
              <p className="project-card__description">{project.description}</p>
            </div>
            <div className="project-card__footer">
              <div className="skill-tags">
                {project.technologies.map((technology) => <TechTag key={technology}>{technology}</TechTag>)}
              </div>
              <div className="project-links">
                <ExternalOrPlaceholder label="Live site" url={project.liveUrl} />
                <ExternalOrPlaceholder label="GitHub repo" url={project.githubUrl} />
                <ExternalOrPlaceholder label="View case study" url={project.caseStudyUrl} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
