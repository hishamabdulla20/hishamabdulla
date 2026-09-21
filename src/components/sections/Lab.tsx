import type { ComponentType, SVGProps } from 'react'
import { labCategories } from '../../data/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

function FlaskIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10 2v7.3L4.9 18a2.7 2.7 0 0 0 2.3 4h9.6a2.7 2.7 0 0 0 2.3-4L14 9.3V2" />
      <path d="M8.5 2h7" />
      <path d="M7.4 15h9.2" />
    </svg>
  )
}

function LightbulbIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.7 14.5C8.3 13.2 6 11.8 6 8.5a6 6 0 0 1 12 0c0 3.3-2.3 4.7-2.7 6-.2.8-.7 1.5-1.5 1.5h-3.6c-.8 0-1.3-.7-1.5-1.5Z" />
    </svg>
  )
}

function BugIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m8 2 2 2" />
      <path d="m14 4 2-2" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
      <rect width="12" height="13" x="6" y="7" rx="6" />
      <path d="M12 11v9" />
      <path d="M6.5 9.5 3 7" />
      <path d="M6 13H2" />
      <path d="m6.5 17.5-3 2.5" />
      <path d="M17.5 9.5 21 7" />
      <path d="M18 13h4" />
      <path d="m17.5 17.5 3 2.5" />
    </svg>
  )
}

const categoryIcons: Record<string, IconComponent> = {
  '01': FlaskIcon,
  '02': LightbulbIcon,
  '03': BugIcon,
}

export function Lab() {
  return (
    <section className="section-block section-block--surface" id="lab" aria-labelledby="lab-title" data-reveal>
      <SectionHeader id="lab-title" number="06" eyebrow="The lab" title="Where ideas get" italic="messy." />
      <div className="lab-layout">
        <div className="lab-statement">
          <p>Not everything needs to become a finished project.</p>
        </div>
        <div className="lab-categories">
          {labCategories.map((category) => {
            const Icon = categoryIcons[category.number]
            return (
              <article className="lab-category" key={category.number}>
                <span className="technical-label">{category.number}</span>
                <h3>
                  {Icon && <Icon className="lab-category__icon" />}
                  {category.title}
                </h3>
                <p>{category.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
