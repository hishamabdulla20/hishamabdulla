import { services } from '../../data/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

export function Services() {
  return (
    <section className="section-block" id="services" aria-labelledby="services-title">
      <SectionHeader id="services-title" number="04" eyebrow="What I do" title="From first idea to" italic="working system." />
      <div className="services-list">
        {services.map((service) => (
          <article className="service-row" key={service.title}>
            <span className="technical-label">{service.number}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span className="service-row__arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  )
}
