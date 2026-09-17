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
        <p className="hero-intro">{profile.introduction}</p>
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
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 40vw"
            className="hero-portrait__image hero-portrait__image--dark"
            loading="eager"
          />
          <Image
            src={lightPortraitUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 40vw"
            className="hero-portrait__image hero-portrait__image--light"
            loading="eager"
          />
        </div>
      </div>
      <a className="scroll-cue technical-label" href="#about">
        Scroll to explore <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
