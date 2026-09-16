import type { Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="hero-section grid-field" id="top" aria-labelledby="hero-title">
      <div className="hero-section__index technical-label" aria-hidden="true">
        Portfolio / 2026
      </div>
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
        {profile.portraitUrl ? (
          <div className="hero-portrait__frame">
            <img src={profile.portraitUrl} alt={`Portrait of ${profile.name}`} />
          </div>
        ) : (
          <div
            className="hero-portrait__frame hero-portrait__frame--empty"
            role="img"
            aria-label={`Reserved space for a future portrait of ${profile.name}`}
          />
        )}
      </div>
      <a className="scroll-cue technical-label" href="#about">
        Scroll to explore <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
