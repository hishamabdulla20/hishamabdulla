import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { FluidBackground } from '@/components/ui/FluidBackground'
import { RevealController } from '@/components/ui/RevealController'
import { WritingIndex } from '@/components/writing/WritingIndex'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import { getWritingArticleMeta } from '@/lib/writing'
import { writingCategories, type WritingCategory } from '@/types/writing'

const description = 'Thoughts, stories, reviews and perspectives from Hisham Abdulla on films, books, technology, AI and life.'

export const metadata: Metadata = {
  title: 'Writing',
  description,
  alternates: { canonical: absoluteUrl('/writing') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/writing'),
    siteName: siteConfig.name,
    title: `Writing | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: 'summary',
    title: `Writing | ${siteConfig.name}`,
    description,
  },
}

type WritingPageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export default async function WritingPage({ searchParams }: WritingPageProps) {
  const { category: categoryValue } = await searchParams
  const requestedCategory = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue
  const initialCategory: 'all' | WritingCategory = writingCategories.includes(requestedCategory as WritingCategory)
    ? requestedCategory as WritingCategory
    : 'all'
  const articles = getWritingArticleMeta()

  return (
    <div className="site-shell">
      <FluidBackground />
      <RevealController />
      <Navbar />
      <main className="writing-page" id="top">
        <header className="writing-hero grid-field" data-reveal>
          <p className="writing-hero__eyebrow technical-label">Writing</p>
          <h1>Thoughts, stories <span>&amp; perspectives.</span></h1>
          <p>A collection of things I&apos;ve watched, read, learned, questioned, experienced and wanted to write about.</p>
        </header>
        <section className="writing-collection" aria-label="Published writing" data-reveal>
          <WritingIndex articles={articles} initialCategory={initialCategory} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
