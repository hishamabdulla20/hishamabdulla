import type { MetadataRoute } from 'next'
import { getPortfolioData } from '@/lib/portfolio-data'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles } = await getPortfolioData()
  const articleEntries = articles
    .filter((article) => !article.isPlaceholder && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug))
    .map((article) => ({ url: absoluteUrl(`/articles/${article.slug}`) }))

  return [{ url: siteConfig.url }, ...articleEntries]
}
