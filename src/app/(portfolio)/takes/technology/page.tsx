import type { Metadata } from 'next'
import { RevealController } from '@/components/ui/RevealController'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

const description = 'Technology notes and perspectives from Hisham Abdulla.'

export const metadata: Metadata = {
  title: 'Technology | Takes',
  description,
  alternates: { canonical: absoluteUrl('/takes/technology') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/takes/technology'),
    siteName: siteConfig.name,
    title: `Technology | Takes | ${siteConfig.name}`,
    description,
    images: [
      {
        url: '/images/profile-portrait.jpg',
        width: 1254,
        height: 1254,
        alt: `Portrait of ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: `Technology | Takes | ${siteConfig.name}`,
    description,
    images: ['/images/profile-portrait.jpg'],
  },
}

export default function TechnologyTakesPage() {
  return (
    <>
      <RevealController />
      <main className="writing-page opinions-page" id="top">
        <header className="writing-hero opinions-hero grid-field" data-reveal>
          <p className="writing-hero__eyebrow technical-label">Takes</p>
          <h1>Technology</h1>
          <p>Technology notes and perspectives are coming soon.</p>
        </header>
      </main>
    </>
  )
}

