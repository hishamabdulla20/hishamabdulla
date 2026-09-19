import type { Metadata } from 'next'
import { RevealController } from '@/components/ui/RevealController'
import { MovieGridWithSort } from '@/components/opinions/MovieGridWithSort'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import { getOpinionsMeta } from '@/lib/writing'

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

export default function OpinionsPage() {
  const movies = getOpinionsMeta().filter((opinion) => opinion.category === 'movies')

  return (
    <>
      <RevealController />
      <main className="writing-page opinions-page" id="top">
        <header className="writing-hero opinions-hero grid-field" data-reveal>
          <p className="writing-hero__eyebrow technical-label">Opinions</p>
          <h1>Movies</h1>
          <p>My personal opinions about movies.</p>
        </header>
        <section className="writing-collection opinions-collection" aria-label="Published opinions" data-reveal>
          <MovieGridWithSort movies={movies} />
        </section>
      </main>
    </>
  )
}
