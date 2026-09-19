import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

const FluidBackground = dynamic(
  () => import('@/components/ui/FluidBackground').then((mod) => mod.FluidBackground),
)

export default function PortfolioLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="site-shell">
      <FluidBackground />
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
