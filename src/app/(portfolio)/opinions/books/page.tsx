import type { Metadata } from 'next'
import { RevealController } from '@/components/ui/RevealController'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

const description = 'Book reviews and reflections from Hisham Abdulla.'

export const metadata: Metadata = {
  title: 'Books | Opinions',
  description,
  alternates: { canonical: absoluteUrl('/opinions/books') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/opinions/books'),
    siteName: siteConfig.name,
    title: `Books | Opinions | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: 'summary',
    title: `Books | Opinions | ${siteConfig.name}`,
    description,
  },
}

export default function BooksOpinionsPage() {
  return (
    <>
      <RevealController />
      <main className="writing-page opinions-page" id="top">
        <header className="writing-hero opinions-hero grid-field" data-reveal>
          <p className="writing-hero__eyebrow technical-label">Opinions</p>
          <h1>Books</h1>
          <p>Book reviews and reflections are coming soon.</p>
        </header>
      </main>
    </>
  )
}

