import type { SkillGroup } from '../../types/portfolio'
import { SectionHeader } from '../ui/SectionHeader'
import { TechTag } from '../ui/TechTag'

export function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section className="section-block section-block--surface" id="skills" aria-labelledby="skills-title" data-reveal>
      <SectionHeader id="skills-title" number="02" eyebrow="Skills & technologies" title="Tools for the" italic="whole build." />
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article className="skill-group" key={group.category}>
            <div className="skill-group__heading">
              <span className="technical-label">{group.number}</span>
              <h3>{group.category}</h3>
            </div>
            <div className="skill-tags">
              {group.skills.map((skill) => (
                <TechTag key={skill} muted={Boolean(group.isPlaceholder)} showIcon={!group.isPlaceholder}>
                  {skill}
                </TechTag>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
