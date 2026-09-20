import { SectionHeader } from '../ui/SectionHeader'

export function About() {
  return (
    <section className="section-block about-section" id="about" aria-labelledby="about-title" data-reveal>
      <SectionHeader id="about-title" number="01" eyebrow="About me" title="Discover. Develop." italic="Deploy." />
      <div className="about-layout">
        <div className="about-statement">
          <p>
            I enjoy turning ideas into working digital products—from the interface people see to the systems working behind it. I explore, experiment, solve problems, and keep improving until an idea becomes something real and useful.
          </p>
          <p>
            Need a website, an app, or something built from scratch? <em>Let’s make it happen.</em> I work with a passionate team of developers ready to turn your idea into a working product.
          </p>
          <div className="about-action">
            <a className="text-link" href="#contact">
              <span>Let’s talk</span>
              <span className="text-link__arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <p className="about-statement__note">Curiosity leads the work. Clarity keeps it useful.</p>
        </div>
      </div>
    </section>
  )
}
