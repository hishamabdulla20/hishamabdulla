import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import { siteConfig } from '../lib/site-config'
import '../index.css'
import '../App.css'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--nf-display',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--nf-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--nf-mono',
})

const themeInitializer = `
(() => {
  let theme = 'dark'
  try {
    const savedTheme = localStorage.getItem('portfolio-theme')
    theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  } catch {
    theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'light' ? '#F3EFE5' : '#000000',
  )
})()
`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: `${siteConfig.name} Portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
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
        url: '/images/hisham-portrait.png',
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
    images: ['/images/hisham-portrait.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorantGaramond.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
