'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MovieCard } from '@/components/writing/MovieCard'
import {
  writingCategories,
  type WritingArticleMeta,
  type WritingCategory,
} from '@/types/writing'

type CategoryFilter = 'all' | WritingCategory

const categoryLabels: Record<CategoryFilter, string> = {
  all: 'All',
  movies: 'Movies',
  books: 'Books',
  'tv-series': 'TV & Series',
  novels: 'Novels',
  technology: 'Technology',
  development: 'Development',
  ai: 'AI',
  ideas: 'Ideas',
  experiences: 'Experiences',
  culture: 'Culture',
  personal: 'Personal',
  essays: 'Essays',
  other: 'Other',
}

function isCategoryFilter(value: string | null): value is CategoryFilter {
  return value === 'all' || writingCategories.includes(value as WritingCategory)
}

function displayDate(date: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function WritingIndex({
  articles,
  initialCategory,
}: {
  articles: WritingArticleMeta[]
  initialCategory: CategoryFilter
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory)

  useEffect(() => {
    const handlePopState = () => {
      const value = new URL(window.location.href).searchParams.get('category')
      setActiveCategory(isCategoryFilter(value) ? value : 'all')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const chooseCategory = (category: CategoryFilter) => {
    setActiveCategory(category)
    const url = new URL(window.location.href)
    if (category === 'all') url.searchParams.delete('category')
    else url.searchParams.set('category', category)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const visibleArticles = activeCategory === 'all'
    ? articles
    : articles.filter((article) => article.category === activeCategory)

  return (
    <>
      <div className="writing-filters" aria-label="Filter thoughts by category">
        {(['all', ...writingCategories] as const).map((category) => (
          <button
            type="button"
            key={category}
            className="writing-filter technical-label"
            aria-pressed={activeCategory === category}
            onClick={() => chooseCategory(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {activeCategory === 'movies' ? (
        <div className="movie-poster-grid" aria-live="polite">
          {visibleArticles.length > 0 ? (
            visibleArticles.map((article) => (
              <MovieCard key={article.slug} movie={article} />
            ))
          ) : (
            <div className="writing-empty">
              <p className="technical-label">No entries yet</p>
              <p>There are no movie opinions yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="writing-index" aria-live="polite">
          {visibleArticles.length > 0 ? visibleArticles.map((article, index) => {
            const articleHref = article.type === 'opinion' ? `/opinions/${article.slug}` : `/writing/${article.slug}`
            return (
              <article className="writing-entry" key={article.slug}>
                <span className="writing-entry__number technical-label">{String(index + 1).padStart(2, '0')}</span>
                <div className="writing-entry__body">
                  <p className="writing-entry__meta technical-label">
                    <span>{categoryLabels[article.category]}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.date}>{displayDate(article.date)}</time>
                  </p>
                  <h2><Link href={articleHref}>{article.title}</Link></h2>
                  <p className="writing-entry__excerpt">{article.excerpt}</p>
                  <Link className="writing-entry__link technical-label" href={articleHref}>
                    {article.readingTime} <span aria-hidden="true">↗</span>
                    <span className="sr-only">: Read {article.title}</span>
                  </Link>
                </div>
                {article.image && (
                  <Link className="writing-entry__image" href={articleHref} tabIndex={-1} aria-hidden="true">
                    <img src={article.image} alt="" loading="lazy" />
                  </Link>
                )}
              </article>
            )
          }) : (
            <div className="writing-empty">
              <p className="technical-label">No entries yet</p>
              <p>{activeCategory === 'all' ? 'The first entry is being written.' : `There are no ${categoryLabels[activeCategory].toLowerCase()} entries yet.`}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
