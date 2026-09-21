import type { MetadataRoute } from 'next'
import { getPortfolioData } from '@/lib/portfolio-data'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import { getTakesMeta, getWritingArticleMeta } from '@/lib/writing'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles } = await getPortfolioData()
  const writingArticles = getWritingArticleMeta()
  const opinions = getTakesMeta()
  const articleEntries = articles
    .filter((article) => !article.isPlaceholder && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug))
    .map((article) => ({ url: absoluteUrl(`/articles/${article.slug}`) }))

  const writingEntries = writingArticles
    .filter((article) => !article.isPlaceholder)
    .map((article) => ({
      url: absoluteUrl(`/writing/${article.slug}`),
      lastModified: new Date(`${article.date}T00:00:00Z`),
    }))

  const opinionEntries = opinions
    .filter((opinion) => !opinion.isPlaceholder)
    .map((opinion) => ({
      url: absoluteUrl(`/takes/${opinion.slug}`),
      lastModified: new Date(`${opinion.date}T00:00:00Z`),
    }))

  return [
    { url: siteConfig.url },
    { url: absoluteUrl('/takes') },
    { url: absoluteUrl('/takes/books') },
    { url: absoluteUrl('/takes/technology') },
    ...writingEntries,
    ...opinionEntries,
    ...articleEntries,
  ]
}
