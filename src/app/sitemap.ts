import type { MetadataRoute } from 'next'
import { getPortfolioData } from '@/lib/portfolio-data'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import { getOpinionsMeta, getWritingArticleMeta } from '@/lib/writing'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles } = await getPortfolioData()
  const writingArticles = getWritingArticleMeta()
  const opinions = getOpinionsMeta()
  const articleEntries = articles
    .filter((article) => !article.isPlaceholder && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug))
    .map((article) => ({ url: absoluteUrl(`/articles/${article.slug}`) }))

  const writingEntries = writingArticles.map((article) => ({
    url: absoluteUrl(`/writing/${article.slug}`),
    lastModified: new Date(`${article.date}T00:00:00Z`),
  }))

  const opinionEntries = opinions.map((opinion) => ({
    url: absoluteUrl(`/opinions/${opinion.slug}`),
    lastModified: new Date(`${opinion.date}T00:00:00Z`),
  }))

  return [
    { url: siteConfig.url },
    { url: absoluteUrl('/opinions') },
    ...writingEntries,
    ...opinionEntries,
    ...articleEntries,
  ]
}
