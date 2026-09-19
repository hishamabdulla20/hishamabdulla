import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
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
  getWritingArticle,
  getWritingArticles,
} from '@/lib/writing'

type WritingArticlePageProps = { params: Promise<{ slug: string }> }

// oxlint-disable-next-line react/only-export-components -- Next.js route files require this named export.
export function generateStaticParams() {
  return getWritingArticles().map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: WritingArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getWritingArticle(slug)
  const canonical = absoluteUrl(`/writing/${slug}`)

  if (!article) {
    return {
      title: 'Writing not found',
      alternates: { canonical },
      robots: { index: false, follow: false },
    }
  }

  const title = `${article.title} | ${siteConfig.name}`
  const socialImage = article.image
    ? { url: absoluteUrl(article.image), alt: article.imageAlt ?? article.title }
    : null

  return {
    title: article.title,
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

  const articles = getWritingArticles()
  const articleIndex = articles.findIndex((candidate) => candidate.slug === slug)
  const newerArticle = articleIndex > 0 ? articles[articleIndex - 1] : null
  const olderArticle = articleIndex < articles.length - 1 ? articles[articleIndex + 1] : null
  const category = formatWritingCategory(article.category)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    mainEntityOfPage: absoluteUrl(`/writing/${article.slug}`),
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
          <a className="writing-back technical-label" href="/writing">← Back to Thoughts</a>
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

          <MarkdownContent source={article.body} />

          <nav className="writing-article-nav" aria-label="More thoughts">
            {newerArticle ? (
              <a href={`/writing/${newerArticle.slug}`}>
                <span className="technical-label">← Newer</span>
                <strong>{newerArticle.title}</strong>
              </a>
            ) : <span />}
            {olderArticle ? (
              <a href={`/writing/${olderArticle.slug}`}>
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
