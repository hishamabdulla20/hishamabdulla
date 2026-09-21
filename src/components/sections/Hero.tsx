import Image from 'next/image'
import type { Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'

export function Hero({ profile }: { profile: Profile }) {
  const darkPortraitUrl = profile.portraitUrl || '/images/profile-portrait-dark.webp'
  const lightPortraitUrl = profile.portraitUrl || '/images/profile-portrait-light.webp'

  return (
    <section className="hero-section grid-field" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow__line" />{profile.eyebrow}</p>
        <h1 id="hero-title">
          <span>{profile.firstName}</span>
          <em>{profile.lastName}</em>
        </h1>
        <div className="hero-roles" aria-label={profile.roles.join(', ')}>
          {profile.roles.map((role, index) => (
            <span key={role}>
              {role}
              {index < profile.roles.length - 1 && <i aria-hidden="true">•</i>}
            </span>
          ))}
        </div>
        <div className="hero-intro">
          <p>
            I’m Hisham Abdulla—a developer and a curious mind exploring ideas, technology, movies, books, and life beyond the screen.
          </p>
          <p>
            This is my little corner of the internet, where I share what I build, learn, experience, and think about.
          </p>
          <p>
            <em>Look around. Maybe something here will stay with you.</em>
          </p>
          <p>
            Have something to share? <a href="#contact">Let’s connect.</a>
          </p>
        </div>
        <div className="hero-actions">
          <ButtonLink href="#work">View my work</ButtonLink>
          <ButtonLink href="#contact" variant="secondary">Contact me</ButtonLink>
        </div>
      </div>
      <div className="hero-portrait">
        <div
          className="hero-portrait__frame"
          role="img"
          aria-label={`Portrait of ${profile.name}`}
        >
          <Image
            src={darkPortraitUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 512px"
            className="hero-portrait__image hero-portrait__image--dark"
          />
          <Image
            src={lightPortraitUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 512px"
            className="hero-portrait__image hero-portrait__image--light"
          />
        </div>
      </div>
      <a className="scroll-cue technical-label" href="#about">
        Scroll to explore <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
