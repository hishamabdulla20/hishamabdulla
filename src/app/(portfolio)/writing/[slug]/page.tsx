import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MarkdownContent } from '@/components/writing/MarkdownContent'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import {
  formatWritingCategory,
  formatWritingDate,
  getOpinions,
  getWritingArticle,
  getWritingArticles,
} from '@/lib/writing'

type WritingArticlePageProps = { params: Promise<{ slug: string }> }

// oxlint-disable-next-line react/only-export-components -- Next.js route files require this named export.
export function generateStaticParams() {
  const writings = getWritingArticles().map((article) => ({ slug: article.slug }))
  const opinions = getOpinions().map((article) => ({ slug: article.slug }))
  return [...writings, ...opinions]
}

export async function generateMetadata({ params }: WritingArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getWritingArticle(slug)
  const canonicalPath = article?.type === 'opinion' ? `/opinions/${slug}` : `/writing/${slug}`
  const canonical = absoluteUrl(canonicalPath)

  if (!article) {
    return {
      title: 'Not found',
      alternates: { canonical },
      robots: { index: false, follow: false },
    }
  }

  const categoryLabel = formatWritingCategory(article.category)
  const isOpinion = article.type === 'opinion'
  const title = isOpinion && article.category === 'movies'
    ? article.movieYear
      ? `${article.title} (${article.movieYear}) — My Opinion`
      : `${article.title} — Movie Opinion`
    : isOpinion
      ? `${article.title} — ${categoryLabel} Opinion`
      : article.title
  const fullTitle = `${title} | ${siteConfig.name}`
  const socialImage = article.image
    ? { url: absoluteUrl(article.image), alt: article.imageAlt ?? article.title }
    : null

  return {
    title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: siteConfig.name,
      title: fullTitle,
      description: article.excerpt,
      publishedTime: `${article.date}T00:00:00Z`,
      authors: [siteConfig.name],
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    twitter: {
      card: socialImage ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description: article.excerpt,
      ...(socialImage ? { images: [socialImage.url] } : {}),
    },
  }
}

export default async function WritingArticlePage({ params }: WritingArticlePageProps) {
  const { slug } = await params
  const article = getWritingArticle(slug)
  if (!article) notFound()

  const isOpinion = article.type === 'opinion'
  const isMovieOpinion = article.category === 'movies' && Boolean(article.director || article.image)
  const movieOpinionBody = article.body.replace(/^## My Opinion\r?$/m, '## My Take')
  const articles = isOpinion ? getOpinions() : getWritingArticles()
  const navigableArticles = isMovieOpinion
    ? articles.filter((candidate) => candidate.category === 'movies' && !candidate.isPlaceholder)
    : articles
  const articleIndex = navigableArticles.findIndex((candidate) => candidate.slug === slug)
  const newerArticle = articleIndex > 0 ? navigableArticles[articleIndex - 1] : null
  const olderArticle = articleIndex < navigableArticles.length - 1 ? navigableArticles[articleIndex + 1] : null
  const category = formatWritingCategory(article.category)
  const basePath = isOpinion ? '/opinions' : '/writing'
  const genresList = article.genres
    ? article.genres.split(',').map((g) => g.trim()).filter(Boolean)
    : []
  const movieSummary = [article.releaseYear, article.rating, article.runtime].filter(Boolean)
  const movieFacts = [
    { label: 'Release Year', value: article.releaseYear },
    { label: 'IMDb Rating', value: article.imdbRating },
    { label: 'Language', value: article.language },
    { label: 'Director', value: article.director },
    { label: 'Co-Director', value: article.coDirector },
    { label: 'Writer', value: article.writer },
    { label: 'Writers', value: article.writers },
    { label: 'Writer / Screenplay', value: article.screenplay },
    { label: 'Based On', value: article.basedOn },
    { label: 'Story', value: article.story },
    { label: 'Producer', value: article.producer },
    { label: 'Producers', value: article.producers },
    { label: 'Starring', value: article.starring, full: true },
    { label: 'Cinematography', value: article.cinematography },
    { label: 'Editing', value: article.editing },
    { label: 'Music', value: article.music },
  ].filter((fact) => Boolean(fact.value))

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    mainEntityOfPage: absoluteUrl(`${basePath}/${article.slug}`),
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.name,
      alternateName: siteConfig.fullName,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(article.image ? { image: absoluteUrl(article.image) } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <main className="writing-article-page" id="top">
        <article>
          <Link
            className="writing-back technical-label"
            href={isOpinion ? (article.category === 'books' ? '/opinions/books' : article.category === 'technology' ? '/opinions/technology' : '/opinions') : '/'}
            prefetch={isMovieOpinion ? true : undefined}
          >
            {isOpinion ? '← Back to Opinions' : '← Back home'}
          </Link>

          {isMovieOpinion ? (
            <>
              <header className="opinion-movie-header">
                <div className="opinion-movie-poster-col">
                  <figure className="opinion-movie-poster">
                    <Image
                      src={article.image!}
                      alt={article.imageAlt || `Theatrical poster for ${article.title}`}
                      width={455}
                      height={674}
                      priority
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 34vw, 360px"
                      className="opinion-movie-poster__img"
                    />
                  </figure>
                </div>

                <div className="opinion-movie-info-col">
                  <p className="writing-article-header__meta technical-label">
                    {movieSummary.length > 0 ? (
                      movieSummary.map((item, index) => (
                        <span key={item}>
                          {index > 0 && <span aria-hidden="true"> · </span>}
                          {item}
                        </span>
                      ))
                    ) : (
                      <>
                        <span>{category}</span><span aria-hidden="true">·</span>
                        <time dateTime={article.date}>{formatWritingDate(article.date)}</time><span aria-hidden="true">·</span>
                        <span>{article.readingTime}</span>
                      </>
                    )}
                  </p>

                  <h1 className="opinion-movie-title">{article.title}</h1>
                  <div className="opinion-movie-title-details">
                    {article.originalTitle && (
                      <p className="opinion-movie-original-title">
                        <span className="technical-label">Original Title</span>
                        <span className="opinion-movie-original-title__name">{article.originalTitle}</span>
                      </p>
                    )}
                    {article.romanizedTitle && (
                      <p className="opinion-movie-original-title">
                        <span className="technical-label">Romanized Title</span>
                        <span className="opinion-movie-original-title__name">{article.romanizedTitle}</span>
                      </p>
                    )}
                  </div>
                  {article.language && (
                    <p className="opinion-movie-language">
                      <span className="technical-label">Language</span>
                      <span>{article.language}</span>
                    </p>
                  )}
                  {article.synopsis && (
                    <div className="opinion-movie-synopsis">
                      <span className="technical-label opinion-block-label">Synopsis</span>
                      <p className="opinion-movie-synopsis__text">{article.synopsis}</p>
                    </div>
                  )}
                </div>
              </header>

              <section className="opinion-movie-details-block" aria-labelledby="movie-information-title">
                <h2 id="movie-information-title" className="technical-label opinion-block-label">Movie Information</h2>
                <dl className="opinion-movie-facts" aria-label="Movie production details">
                  {movieFacts.map((fact) => (
                    <div className={`opinion-movie-fact${fact.full ? ' opinion-movie-fact--full' : ''}`} key={fact.label}>
                      <dt className="technical-label">{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {genresList.length > 0 && (
                <section className="opinion-movie-genres" aria-labelledby="movie-genres-title">
                  <h2 id="movie-genres-title" className="technical-label opinion-block-label">Genres</h2>
                  <div className="opinion-movie-genres__tags">
                    {genresList.map((genre) => <span key={genre} className="opinion-movie-genre-tag technical-label">{genre}</span>)}
                  </div>
                </section>
              )}
            </>
          ) : (
            <>
              <header className="writing-article-header">
                <p className="writing-article-header__meta technical-label">
                  <span>{category}</span><span aria-hidden="true">·</span>
                  <time dateTime={article.date}>{formatWritingDate(article.date)}</time><span aria-hidden="true">·</span>
                  <span>{article.readingTime}</span>
                </p>
                <h1>{article.title}</h1>
                {article.subtitle && <p className="writing-article-header__subtitle">{article.subtitle}</p>}
              </header>

              {article.image && (
                <figure className="writing-article-hero">
                  <img src={article.image} alt={article.imageAlt} />
                </figure>
              )}

              {(article.mediaTitle || article.mediaCreator || article.mediaYear) && (
                <dl className="writing-media-info" aria-label="About the subject">
                  {article.mediaTitle && <div><dt>Title</dt><dd>{article.mediaTitle}</dd></div>}
                  {article.mediaCreator && <div><dt>By</dt><dd>{article.mediaCreator}</dd></div>}
                  {article.mediaYear && <div><dt>Year</dt><dd>{article.mediaYear}</dd></div>}
                </dl>
              )}
            </>
          )}

          {isMovieOpinion && (
            <div className="opinion-section-divider">
              <span className="technical-label">Personal Perspective</span>
            </div>
          )}

          {isMovieOpinion ? (
            <div className="opinion-movie-perspective">
              <MarkdownContent source={movieOpinionBody} />
            </div>
          ) : (
            <MarkdownContent source={article.body} />
          )}

          <nav className={`writing-article-nav${isMovieOpinion ? ' opinion-movie-nav' : ''}`} aria-label={isOpinion ? 'More opinions' : 'More thoughts'}>
            {newerArticle ? (
              <Link href={`${basePath}/${newerArticle.slug}`}>
                <span className="technical-label">← Newer</span>
                <strong>{newerArticle.title}</strong>
              </Link>
            ) : <span />}
            {olderArticle ? (
              <Link href={`${basePath}/${olderArticle.slug}`}>
                <span className="technical-label">Older →</span>
                <strong>{olderArticle.title}</strong>
              </Link>
            ) : <span />}
          </nav>
        </article>
      </main>
    </>
  )
}
