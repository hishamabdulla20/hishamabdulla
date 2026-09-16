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

export default function HomePage() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Journey />
        <BeyondCode />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
