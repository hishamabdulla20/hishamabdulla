import { interests } from '../../data/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

export function BeyondCode() {
  return (
    <section className="section-block beyond-section grid-field" id="beyond" aria-labelledby="beyond-title">
      <SectionHeader id="beyond-title" number="06" eyebrow="Beyond code" title="A person beyond" italic="the screen." />
      <p className="section-intro">A growing index of the ideas, images, places and stories that shape how I see the world.</p>
      <div className="interest-grid">
        {interests.map((interest) => (
          <article className="interest-item" key={interest.slug}>
            <span className="technical-label">{interest.number}</span>
            <h3>{interest.title}</h3>
            <span className="interest-item__status technical-label">Page ready later</span>
            <span aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  )
}
