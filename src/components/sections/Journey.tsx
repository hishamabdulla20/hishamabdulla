import { currentFocus, journey } from '../../data/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

export function Journey() {
  return (
    <section className="section-block section-block--surface" id="journey" aria-labelledby="journey-title">
      <SectionHeader id="journey-title" number="05" eyebrow="My journey" title="Still learning." italic="Always moving." />
      <div className="journey-layout">
        <div className="timeline">
          {journey.map((item) => (
            <article className="timeline-item" key={item.title}>
              <span className="timeline-item__dot" aria-hidden="true" />
              <p className="technical-label">{item.period}</p>
              <h3>{item.title}</h3>
              <p className={item.isPlaceholder ? 'placeholder-copy' : ''}>{item.description}</p>
            </article>
          ))}
        </div>
        <div className="current-focus">
          {currentFocus.map((item) => (
            <article key={item.label}>
              <span className="technical-label">{item.number}</span>
              <h3>{item.label}</h3>
              <p className="placeholder-copy">{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
