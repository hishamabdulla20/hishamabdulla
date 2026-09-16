import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { About } from '../components/sections/About'
import { BeyondCode } from '../components/sections/BeyondCode'
import { Contact } from '../components/sections/Contact'
import { Hero } from '../components/sections/Hero'
import { Journey } from '../components/sections/Journey'
import { Projects } from '../components/sections/Projects'
import { Services } from '../components/sections/Services'
import { Skills } from '../components/sections/Skills'
import { Writing } from '../components/sections/Writing'
import { RevealController } from '../components/ui/RevealController'
import { getPortfolioData } from '../lib/portfolio-data'

export const revalidate = 300

export default async function HomePage() {
  const data = await getPortfolioData()

  return (
    <div className="site-shell">
      <RevealController />
      <Navbar />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Skills skillGroups={data.skillGroups} />
        <Projects projects={data.projects} />
        <Services />
        <Journey journey={data.journey} currentFocus={data.currentFocus} />
        <BeyondCode />
        <Writing articles={data.articles} />
        <Contact socialLinks={data.socialLinks} />
      </main>
      <Footer />
    </div>
  )
}
