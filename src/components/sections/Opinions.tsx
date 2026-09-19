import { formatWritingCategory, formatWritingDate } from '../../lib/writing'
import type { WritingArticleMeta } from '../../types/writing'
import { SectionHeader } from '../ui/SectionHeader'

export function Opinions({ opinions }: { opinions: WritingArticleMeta[] }) {
  return (
    <section className="section-block opinions-section grid-field" id="opinions" aria-labelledby="opinions-title" data-reveal>
      <SectionHeader id="opinions-title" number="02" eyebrow="Opinions" title="Direct takes &" italic="perspectives." />
      <p className="section-intro">Personal takes on films, books, technology, culture, and everything in between.</p>
      {opinions.length > 0 ? (
        <div className="opinion-grid">
          {opinions.map((opinion) => (
            <article className="opinion-card" key={opinion.slug}>
              <div className="opinion-card__meta">
                <span className="opinion-card__category technical-label">
                  {formatWritingCategory(opinion.category)}
                </span>
                <time className="technical-label" dateTime={opinion.date}>
                  {formatWritingDate(opinion.date)}
                </time>
              </div>
              <div className="opinion-card__body">
                <h3>
                  <a href={`/opinions/${opinion.slug}`}>{opinion.title}</a>
                </h3>
                <p>{opinion.excerpt}</p>
              </div>
              <div className="opinion-card__footer">
                <a className="opinion-card__read technical-label" href={`/opinions/${opinion.slug}`}>
                  Read opinion <span aria-hidden="true">↗</span>
                  <span className="sr-only">: {opinion.title}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="homepage-opinions-empty homepage-writing-empty">
          <p className="technical-label">First entries in progress</p>
          <p>Soon, this space will hold personal takes and reviews on films, books, TV series, technology, AI, and culture.</p>
        </div>
      )}
      <div className="opinions-section-footer writing-section-footer">
        <a className="opinions-section-link writing-section-link text-link" href="/opinions">
          View all opinions <span className="text-link__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}

