import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { About } from '@/components/sections/About'
import { Hero } from '@/components/sections/Hero'
import { Lab } from '@/components/sections/Lab'
import { Takes } from '@/components/sections/Takes'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Skills } from '@/components/sections/Skills'
import { RevealController } from '@/components/ui/RevealController'
import { getPortfolioData } from '@/lib/portfolio-data'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

const Contact = dynamic(
  () => import('@/components/sections/Contact').then((mod) => mod.Contact),
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
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/images/profile-portrait.jpg'],
  },
}

export default async function HomePage() {
  const data = await getPortfolioData()
  const sameAs = data.socialLinks
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url && /^https?:\/\//.test(url)))
  const knowsAbout = data.skillGroups
    .filter((group) => !group.isPlaceholder)
    .flatMap((group) => group.skills)
  const portraitUrl = data.profile.portraitUrl || '/images/profile-portrait.jpg'

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}#person`,
        name: siteConfig.fullName,
        alternateName: siteConfig.alternateNames,
        url: siteConfig.url,
        image: absoluteUrl(portraitUrl),
        jobTitle: data.profile.roles[0] || 'Developer',
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
        publisher: { '@id': `${siteConfig.url}#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteConfig.url}#profilepage`,
        url: siteConfig.url,
        name: siteConfig.title,
        mainEntity: { '@id': `${siteConfig.url}#person` },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <RevealController />
      <main>
        <Hero profile={data.profile} />
        <About />
        <Takes />
        <Projects projects={data.projects} />
        <Skills skillGroups={data.skillGroups} />
        <Services />
        <Lab />
        <Contact socialLinks={data.socialLinks} />
      </main>
    </>
  )
}
