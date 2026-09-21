import type { Metadata } from 'next'
import { RevealController } from '@/components/ui/RevealController'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

const description = 'Book reviews and reflections from Hisham Abdulla.'

export const metadata: Metadata = {
  title: 'Books | Takes',
  description,
  alternates: { canonical: absoluteUrl('/takes/books') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/takes/books'),
    siteName: siteConfig.name,
    title: `Books | Takes | ${siteConfig.name}`,
    description,
    images: [
      {
        url: '/images/hisham-portrait.png',
        width: 1254,
        height: 1254,
        alt: `Portrait of ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: `Books | Takes | ${siteConfig.name}`,
    description,
    images: ['/images/hisham-portrait.png'],
  },
}

export default function BooksTakesPage() {
  return (
    <>
      <RevealController />
      <main className="writing-page opinions-page" id="top">
        <header className="writing-hero opinions-hero grid-field" data-reveal>
          <p className="writing-hero__eyebrow technical-label">Takes</p>
          <h1>Books</h1>
          <p>Book reviews and reflections are coming soon.</p>
        </header>
      </main>
    </>
  )
}

