import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

const FluidBackground = dynamic(
  () => import('@/components/ui/FluidBackground').then((mod) => mod.FluidBackground),
)
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
      ? `${article.title} (${article.movieYear}) — My Opinion | ${siteConfig.name}`
      : `${article.title} — Movie Opinion | ${siteConfig.name}`
    : isOpinion
      ? `${article.title} — ${categoryLabel} Opinion | ${siteConfig.name}`
      : `${article.title} | ${siteConfig.name}`
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
      title,
      description: article.excerpt,
      publishedTime: `${article.date}T00:00:00Z`,
      authors: [siteConfig.fullName],
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    twitter: {
      card: socialImage ? 'summary_large_image' : 'summary',
      title,
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
  const articles = isOpinion ? getOpinions() : getWritingArticles()
  const articleIndex = articles.findIndex((candidate) => candidate.slug === slug)
  const newerArticle = articleIndex > 0 ? articles[articleIndex - 1] : null
  const olderArticle = articleIndex < articles.length - 1 ? articles[articleIndex + 1] : null
  const category = formatWritingCategory(article.category)
  const basePath = isOpinion ? '/opinions' : '/writing'
  const genresList = article.genres
    ? article.genres.split(',').map((g) => g.trim()).filter(Boolean)
    : []
  const movieSummary = [article.movieYear, article.rating, article.runtime].filter(Boolean)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    mainEntityOfPage: absoluteUrl(`${basePath}/${article.slug}`),
    author: { '@type': 'Person', name: siteConfig.fullName, url: siteConfig.url },
    ...(article.image ? { image: absoluteUrl(article.image) } : {}),
  }

  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <FluidBackground />
      <Navbar />
      <main className="writing-article-page" id="top">
        <article>
          <a
            className="writing-back technical-label"
            href={isOpinion ? (article.category === 'movies' ? '/opinions?category=movies' : '/opinions') : '/writing'}
          >
            {isOpinion ? '← Back to Opinions' : '← Back to Thoughts'}
          </a>

          {isMovieOpinion ? (
            <div className="opinion-movie-header">
              <div className="opinion-movie-poster-col">
                <figure className="opinion-movie-poster">
                  <Image
                    src={article.image!}
                    alt={article.imageAlt || `Theatrical poster for ${article.title}`}
                    width={455}
                    height={674}
                    priority
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 340px, 380px"
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
                {article.originalTitle && (
                  <p className="opinion-movie-original-title">
                    <span className="technical-label">Original Title</span>
                    <span className="opinion-movie-original-title__name">{article.originalTitle}</span>
                  </p>
                )}
                {article.language && (
                  <p className="technical-label">{article.language}</p>
                )}

                <div className="opinion-movie-details-block">
                  <h2 className="technical-label opinion-block-label">Movie Information</h2>
                  <dl className="opinion-movie-facts" aria-label="Movie production details">
                    {article.director && (
                      <div className="opinion-movie-fact">
                        <dt className="technical-label">Director</dt>
                        <dd>{article.director}</dd>
                      </div>
                    )}
                    {article.writer && (
                      <div className="opinion-movie-fact">
                        <dt className="technical-label">Writer</dt>
                        <dd>{article.writer}</dd>
                      </div>
                    )}
                    {article.producers && (
                      <div className="opinion-movie-fact">
                        <dt className="technical-label">Producers</dt>
                        <dd>{article.producers}</dd>
                      </div>
                    )}
                    {article.starring && (
                      <div className="opinion-movie-fact opinion-movie-fact--full">
                        <dt className="technical-label">Starring</dt>
                        <dd>{article.starring}</dd>
                      </div>
                    )}
                    {article.cinematography && (
                      <div className="opinion-movie-fact">
                        <dt className="technical-label">Cinematography</dt>
                        <dd>{article.cinematography}</dd>
                      </div>
                    )}
                    {article.editing && (
                      <div className="opinion-movie-fact">
                        <dt className="technical-label">Editing</dt>
                        <dd>{article.editing}</dd>
                      </div>
                    )}
                    {article.music && (
                      <div className="opinion-movie-fact">
                        <dt className="technical-label">Music</dt>
                        <dd>{article.music}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {genresList.length > 0 && (
                  <div className="opinion-movie-genres">
                    <span className="technical-label opinion-block-label">Genres</span>
                    <div className="opinion-movie-genres__tags">
                      {genresList.map((genre) => (
                        <span key={genre} className="opinion-movie-genre-tag technical-label">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {article.synopsis && (
                  <div className="opinion-movie-synopsis">
                    <span className="technical-label opinion-block-label">Synopsis</span>
                    <p className="opinion-movie-synopsis__text">{article.synopsis}</p>
                  </div>
                )}
              </div>
            </div>
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

          <MarkdownContent source={article.body} />

          <nav className="writing-article-nav" aria-label={isOpinion ? 'More opinions' : 'More thoughts'}>
            {newerArticle ? (
              <a href={`${basePath}/${newerArticle.slug}`}>
                <span className="technical-label">← Newer</span>
                <strong>{newerArticle.title}</strong>
              </a>
            ) : <span />}
            {olderArticle ? (
              <a href={`${basePath}/${olderArticle.slug}`}>
                <span className="technical-label">Older →</span>
                <strong>{olderArticle.title}</strong>
              </a>
            ) : <span />}
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  )
}
