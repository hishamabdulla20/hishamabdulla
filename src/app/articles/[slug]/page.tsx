/* oxlint-disable react/only-export-components -- Next.js pages export metadata and cache configuration. */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TechTag } from '@/components/ui/TechTag'
import { getPublishedArticle } from '@/lib/portfolio-data'

export const revalidate = 300

type ArticlePageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  return article ? { title: `${article.title} — Hisham Abdulla`, description: article.description } : {}
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()

  return (
    <main className="article-page">
      <a className="article-page__back" href="/#writing">← Back to writing</a>
      <article>
        <header>
          <p className="technical-label">{article.date} — {article.category}</p>
          <h1>{article.title}</h1>
          <p className="article-page__description">{article.description}</p>
          {article.coverImageUrl && <img className="article-page__cover" src={article.coverImageUrl} alt="" />}
        </header>
        <div className="article-page__body">{article.content}</div>
        {article.tags.length > 0 && <div className="article-page__tags">{article.tags.map((tag) => <TechTag key={tag}>{tag}</TechTag>)}</div>}
      </article>
    </main>
  )
}
