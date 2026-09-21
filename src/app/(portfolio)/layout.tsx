import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getPortfolioData } from '@/lib/portfolio-data'

const FluidBackground = dynamic(
  () => import('@/components/ui/FluidBackground').then((mod) => mod.FluidBackground),
)

export default async function PortfolioLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { socialLinks } = await getPortfolioData()

  return (
    <div className="site-shell">
      <FluidBackground />
      <Navbar socialLinks={socialLinks} />
      {children}
      <Footer />
    </div>
  )
}
