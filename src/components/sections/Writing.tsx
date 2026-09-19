import { formatWritingCategory, formatWritingDate } from '../../lib/writing'
import type { WritingArticleMeta } from '../../types/writing'
import { SectionHeader } from '../ui/SectionHeader'

export function Writing({ articles }: { articles: WritingArticleMeta[] }) {
  return (
    <section className="section-block" id="thoughts" aria-labelledby="thoughts-title" data-reveal>
      <span id="writing" className="sr-only" aria-hidden="true" />
      <SectionHeader id="thoughts-title" number="06" eyebrow="Thoughts" title="Perspectives &" italic="reflections." />
      {articles.length > 0 ? (
        <div className="article-list">
          {articles.map((article, index) => (
            <article className="article-row" key={article.slug}>
              <span className="article-row__number technical-label">{String(index + 1).padStart(2, '0')}</span>
              <div className="article-row__body">
                <p className="article-row__meta technical-label">
                  <span>{formatWritingCategory(article.category)}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={article.date}>{formatWritingDate(article.date)}</time>
                </p>
                <h3><a href={`/writing/${article.slug}`}>{article.title}</a></h3>
                <p>{article.excerpt}</p>
              </div>
              <a className="article-row__read technical-label" href={`/writing/${article.slug}`}>
                {article.readingTime} <span aria-hidden="true">↗</span>
                <span className="sr-only">: Read {article.title}</span>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="homepage-writing-empty">
          <p className="technical-label">The first entry is in progress</p>
          <p>Soon, this space will hold thoughts, reviews, and reflections on films, books, technology, AI, and ideas worth exploring.</p>
        </div>
      )}
      <div className="writing-section-footer">
        <a className="writing-section-link text-link" href="/writing">
          View all thoughts <span className="text-link__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
