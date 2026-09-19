import type { Metadata } from 'next'
import { RevealController } from '@/components/ui/RevealController'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

const description = 'Technology notes and perspectives from Hisham Abdulla.'

export const metadata: Metadata = {
  title: 'Technology | Opinions',
  description,
  alternates: { canonical: absoluteUrl('/opinions/technology') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/opinions/technology'),
    siteName: siteConfig.name,
    title: `Technology | Opinions | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: 'summary',
    title: `Technology | Opinions | ${siteConfig.name}`,
    description,
  },
}

export default function TechnologyOpinionsPage() {
  return (
    <>
      <RevealController />
      <main className="writing-page opinions-page" id="top">
        <header className="writing-hero opinions-hero grid-field" data-reveal>
          <p className="writing-hero__eyebrow technical-label">Opinions</p>
          <h1>Technology</h1>
          <p>Technology notes and perspectives are coming soon.</p>
        </header>
      </main>
    </>
  )
}

