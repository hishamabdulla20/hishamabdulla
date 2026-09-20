import type { Project } from '../../types/portfolio'
import { ExternalOrPlaceholder } from '../ui/ExternalOrPlaceholder'
import { SectionHeader } from '../ui/SectionHeader'
import { TechTag } from '../ui/TechTag'

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section className="section-block projects-section grid-field" id="work" aria-labelledby="work-title" data-reveal>
      <SectionHeader id="work-title" number="03" eyebrow="Selected projects" title="Work with" italic="purpose." />
      <div className="projects-list">
        {projects.map((project) => (
          <article className={`project-card${project.liveUrl ? ' project-card--clickable' : ''}`} key={project.name}>
            {project.liveUrl && (
              <a
                className="project-card__overlay-link"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.name} website`}
              />
            )}
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
              {project.technologies.length > 0 && (
                <div className="skill-tags">
                  {project.technologies.map((technology) => <TechTag key={technology}>{technology}</TechTag>)}
                </div>
              )}
              <div className="project-links">
                <ExternalOrPlaceholder label="Live site" url={project.liveUrl} />
                <ExternalOrPlaceholder label="GitHub repo" url={project.githubUrl} />
                {project.caseStudyUrl && <ExternalOrPlaceholder label="View case study" url={project.caseStudyUrl} />}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
