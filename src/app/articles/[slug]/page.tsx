import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TechTag } from '@/components/ui/TechTag'
import { getPublishedArticle } from '@/lib/portfolio-data'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

export const revalidate = 300

type ArticlePageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  const canonical = absoluteUrl(`/articles/${slug}`)

  if (!article) {
    return {
      title: 'Article not found',
      alternates: { canonical },
      robots: { index: false, follow: false },
    }
  }

  const socialTitle = `${article.title} | ${siteConfig.name}`
  const socialImage = article.coverImageUrl
    ? { url: article.coverImageUrl, alt: `Cover image for ${article.title}` }
    : { url: '/images/profile-portrait.jpg', alt: `Portrait of ${siteConfig.fullName}` }

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: siteConfig.name,
      title: socialTitle,
      description: article.description,
      authors: [siteConfig.fullName],
      images: [socialImage],
    },
    twitter: {
      card: article.coverImageUrl ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description: article.description,
      images: [socialImage.url],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()

  return (
    <main className="article-page">
      <Link className="article-page__back" href="/">← Back home</Link>
      <article>
        <header>
          <p className="technical-label">{article.date} — {article.category}</p>
          <h1>{article.title}</h1>
          <p className="article-page__description">{article.description}</p>
          {article.coverImageUrl && (
            <img className="article-page__cover" src={article.coverImageUrl} alt={`Cover image for ${article.title}`} />
          )}
        </header>
        <div className="article-page__body">{article.content}</div>
        {article.tags.length > 0 && <div className="article-page__tags">{article.tags.map((tag) => <TechTag key={tag}>{tag}</TechTag>)}</div>}
      </article>
    </main>
  )
}
