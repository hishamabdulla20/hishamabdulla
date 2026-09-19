import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { About } from '@/components/sections/About'
import { BeyondCode } from '@/components/sections/BeyondCode'
import { Hero } from '@/components/sections/Hero'
import { Journey } from '@/components/sections/Journey'
import { Opinions } from '@/components/sections/Opinions'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Skills } from '@/components/sections/Skills'
import { RevealController } from '@/components/ui/RevealController'
import { getPortfolioData } from '@/lib/portfolio-data'
import { siteConfig } from '@/lib/site-config'

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
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <RevealController />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Opinions />
        <Projects projects={data.projects} />
        <Skills skillGroups={data.skillGroups} />
        <Services />
        <Journey journey={data.journey} currentFocus={data.currentFocus} />
        <BeyondCode />
        <Contact socialLinks={data.socialLinks} />
      </main>
    </>
  )
}
