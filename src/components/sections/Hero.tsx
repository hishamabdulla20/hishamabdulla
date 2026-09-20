import Image from 'next/image'
import type { Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'

export function Hero({ profile }: { profile: Profile }) {
  const darkPortraitUrl = profile.portraitUrl || '/images/hisham-portrait-dark.webp'
  const lightPortraitUrl = profile.portraitUrl || '/images/hisham-portrait-light.webp'

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
            I’m Hisham Abdulla—a curious mind who loves exploring ideas, building useful things, and occasionally getting lost in movies, books, and thoughts about life.
          </p>
          <p>
            I’m a developer, but code is only part of the story. This little corner of the internet is where I share what I build, learn, experience, and think about.
          </p>
          <p>
            Since you’ve already made it this far, you might as well look around. <em>Who knows? You might find something interesting.</em>
          </p>
          <p>
            And if you have an idea, a story, a different perspective, or simply something worth sharing, <a href="#contact">let’s connect</a>. <em>I’d love to hear it.</em>
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
