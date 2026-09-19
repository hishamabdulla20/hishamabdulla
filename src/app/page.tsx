import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { About } from '../components/sections/About'
import { BeyondCode } from '../components/sections/BeyondCode'
import { Hero } from '../components/sections/Hero'
import { Journey } from '../components/sections/Journey'
import { Projects } from '../components/sections/Projects'
import { Services } from '../components/sections/Services'
import { Skills } from '../components/sections/Skills'
import { Writing } from '../components/sections/Writing'
import { RevealController } from '../components/ui/RevealController'
import { getPortfolioData } from '../lib/portfolio-data'
import { siteConfig } from '../lib/site-config'
import { getWritingArticleMeta } from '../lib/writing'

const FluidBackground = dynamic(
  () => import('../components/ui/FluidBackground').then((mod) => mod.FluidBackground),
)
const Contact = dynamic(
  () => import('../components/sections/Contact').then((mod) => mod.Contact),
)

export const revalidate = 300

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.openGraphDescription,
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
  },
}

export default async function HomePage() {
  const data = await getPortfolioData()
  const recentWriting = getWritingArticleMeta().slice(0, 3)
  const sameAs = data.socialLinks
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url && /^https?:\/\//.test(url)))
  const knowsAbout = data.skillGroups
    .filter((group) => !group.isPlaceholder)
    .flatMap((group) => group.skills)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}#person`,
        name: siteConfig.fullName,
        alternateName: siteConfig.alternateNames,
        url: siteConfig.url,
        ...(data.profile.roles[0] ? { jobTitle: data.profile.roles[0] } : {}),
        ...(knowsAbout.length ? { knowsAbout } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: 'en',
        author: { '@id': `${siteConfig.url}#person` },
      },
    ],
  }

  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <FluidBackground />
      <RevealController />
      <Navbar />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Skills skillGroups={data.skillGroups} />
        <Projects projects={data.projects} />
        <Services />
        <Journey journey={data.journey} currentFocus={data.currentFocus} />
        <Writing articles={recentWriting} />
        <BeyondCode />
        <Contact socialLinks={data.socialLinks} />
      </main>
      <Footer />
    </div>
  )
}
