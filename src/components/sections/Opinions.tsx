import Link from 'next/link'
import { SectionHeader } from '../ui/SectionHeader'

function MoviesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="opinion-card__icon"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M17 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  )
}

function BooksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="opinion-card__icon"
    >
      <path d="M2 4.5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-2.5H2z" />
      <path d="M22 4.5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-2.5H22z" />
    </svg>
  )
}

function TechnologyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="opinion-card__icon"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <polyline points="7 8 10 11 7 14" />
      <line x1="12" y1="14" x2="16" y2="14" />
    </svg>
  )
}

const opinionCategories = [
  {
    key: 'movies',
    title: 'Movies',
    href: '/opinions',
    icon: MoviesIcon,
  },
  {
    key: 'books',
    title: 'Books',
    href: '/opinions/books',
    icon: BooksIcon,
  },
  {
    key: 'technology',
    title: 'Technology',
    href: '/opinions/technology',
    icon: TechnologyIcon,
  },
] as const

export function Opinions() {
  return (
    <section className="section-block opinions-section grid-field" id="opinions" aria-labelledby="opinions-title" data-reveal>
      <SectionHeader id="opinions-title" number="02" eyebrow="Opinions" title="From my" italic="point of view." />
      <p className="section-intro">Personal takes on films, books, technology, culture, and everything in between.</p>
      <div className="opinion-grid">
        {opinionCategories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              className="opinion-card"
              href={category.href}
              key={category.key}
              aria-label={`Explore ${category.title} opinions`}
            >
              <div className="opinion-card__icon-wrap">
                <Icon />
              </div>
              <div className="opinion-card__body">
                <h3 className="opinion-card__title">{category.title}</h3>
              </div>
              <div className="opinion-card__footer">
                <span className="opinion-card__action technical-label">
                  Explore opinions <span className="opinion-card__arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="opinions-section-footer writing-section-footer">
        <Link className="opinions-section-link writing-section-link text-link" href="/opinions">
          View all opinions <span className="text-link__arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
