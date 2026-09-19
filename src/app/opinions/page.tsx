import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

const FluidBackground = dynamic(
  () => import('@/components/ui/FluidBackground').then((mod) => mod.FluidBackground),
)
import { RevealController } from '@/components/ui/RevealController'
import { WritingIndex } from '@/components/writing/WritingIndex'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import { getOpinionsMeta } from '@/lib/writing'
import { writingCategories, type WritingCategory } from '@/types/writing'

const description = 'Personal opinions, reviews and perspectives from Hisham Abdulla on movies, books, technology, AI, and culture.'

export const metadata: Metadata = {
  title: 'Opinions',
  description,
  alternates: { canonical: absoluteUrl('/opinions') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/opinions'),
    siteName: siteConfig.name,
    title: `Opinions | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: 'summary',
    title: `Opinions | ${siteConfig.name}`,
    description,
  },
}

type OpinionsPageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export default async function OpinionsPage({ searchParams }: OpinionsPageProps) {
  const { category: categoryValue } = await searchParams
  const requestedCategory = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue
  const initialCategory: 'all' | WritingCategory = writingCategories.includes(requestedCategory as WritingCategory)
    ? requestedCategory as WritingCategory
    : 'all'
  const opinions = getOpinionsMeta()

  return (
    <div className="site-shell">
      <FluidBackground />
      <RevealController />
      <Navbar />
      <main className="writing-page opinions-page" id="top">
        <header className="writing-hero opinions-hero grid-field" data-reveal>
          <p className="writing-hero__eyebrow technical-label">Opinions</p>
          <h1>Direct takes <span>&amp; perspectives.</span></h1>
          <p>Personal opinions and reviews on films, books, technology, AI, and culture.</p>
        </header>
        <section className="writing-collection opinions-collection" aria-label="Published opinions" data-reveal>
          <WritingIndex articles={opinions} initialCategory={initialCategory} />
        </section>
      </main>
      <Footer />
    </div>
  )
}

