/* oxlint-disable react/only-export-components -- Next.js layouts export metadata alongside the layout component. */

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../index.css'
import '../App.css'

const title = 'Hisham Abdulla — Full-Stack Developer'
const description =
  'Personal portfolio of Hisham Abdulla, showcasing software development projects, technical skills, learning, writing and interests.'

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
  title,
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    title,
    description,
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
