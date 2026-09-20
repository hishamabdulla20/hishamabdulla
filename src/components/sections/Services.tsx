import type { ComponentType, SVGProps } from 'react'
import { services } from '../../data/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

function LayersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 12 10 5 10-5" />
      <path d="m2 17 10 5 10-5" />
    </svg>
  )
}

function BrowserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M2 9.5h20" />
      <path d="M6 6.75h.01" />
      <path d="M9.5 6.75h.01" />
      <path d="M13 6.75h.01" />
    </svg>
  )
}

function ServerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="8" x="2" y="3" rx="2" />
      <rect width="20" height="8" x="2" y="13" rx="2" />
      <line x1="6" y1="7" x2="6.01" y2="7" />
      <line x1="6" y1="17" x2="6.01" y2="17" />
      <line x1="10" y1="7" x2="14" y2="7" />
      <line x1="10" y1="17" x2="14" y2="17" />
    </svg>
  )
}

function ApiNodesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  )
}

function DatabaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  )
}

function CloudIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}

const serviceIcons: Record<string, IconComponent> = {
  '01': LayersIcon,
  '02': BrowserIcon,
  '03': ServerIcon,
  '04': ApiNodesIcon,
  '05': DatabaseIcon,
  '06': CloudIcon,
}

export function Services() {
  return (
    <section className="section-block" id="services" aria-labelledby="services-title" data-reveal>
      <SectionHeader id="services-title" number="05" eyebrow="What I do" title="From first idea to" italic="working system." />
      <div className="services-list">
        {services.map((service) => {
          const Icon = serviceIcons[service.number]
          return (
            <article className="service-row" key={service.title}>
              <span className="technical-label service-row__number">{service.number}</span>
              {Icon && (
                <span className="service-row__icon-wrap" aria-hidden="true">
                  <Icon className="service-row__icon" />
                </span>
              )}
              <h3 className="service-row__title">{service.title}</h3>
              <p className="service-row__description">{service.description}</p>
              <span className="service-row__arrow" aria-hidden="true">↗</span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
