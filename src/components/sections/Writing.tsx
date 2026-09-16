import type { Article } from '../../types/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

export function Writing({ articles }: { articles: Article[] }) {
  return (
    <section className="section-block" id="writing" aria-labelledby="writing-title" data-reveal>
      <SectionHeader id="writing-title" number="07" eyebrow="Writing & thoughts" title="Notes from the" italic="workbench." />
      <div className="article-list">
        {articles.map((article, index) => (
          <article className="article-row" key={article.slug}>
            <div className="article-row__meta technical-label"><span>{article.date}</span><span>{article.category}</span></div>
            <div>
              <h3>
                <span>{String(index + 1).padStart(2, '0')}.</span>{' '}
                {article.date === 'Unpublished' ? article.title : <a href={`/articles/${article.slug}`}>{article.title}</a>}
              </h3>
              <p>{article.description}</p>
            </div>
            <span className="article-row__status technical-label">
              {article.date === 'Unpublished' ? 'Unpublished' : 'Published'}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
