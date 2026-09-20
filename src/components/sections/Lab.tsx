import { labCategories } from '../../data/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

export function Lab() {
  return (
    <section className="section-block section-block--surface" id="lab" aria-labelledby="lab-title" data-reveal>
      <SectionHeader id="lab-title" number="06" eyebrow="The lab" title="Where ideas get" italic="messy." />
      <div className="lab-layout">
        <div className="lab-statement">
          <p>Not everything needs to become a finished project.</p>
        </div>
        <div className="lab-categories">
          {labCategories.map((category) => (
            <article className="lab-category" key={category.number}>
              <span className="technical-label">{category.number}</span>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
