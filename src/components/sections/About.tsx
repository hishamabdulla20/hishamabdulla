import type { Profile } from '../../types/portfolio'
import { SectionHeader } from '../ui/SectionHeader'

export function About({ profile }: { profile: Profile }) {
  return (
    <section className="section-block about-section" id="about" aria-labelledby="about-title" data-reveal>
      <SectionHeader id="about-title" number="01" eyebrow="About me" title="Discover. Develop." italic="Deploy." />
      <div className="about-layout">
        <div className="about-statement">
          <p>{profile.about}</p>
          <p className="about-statement__note">Curiosity leads the work. Clarity keeps it useful.</p>
        </div>
        <dl className="profile-details">
          {profile.details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd className={detail.isPlaceholder ? 'placeholder-copy' : ''}>{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="resume-action">
        {profile.resumeUrl ? (
          <a className="button-link" href={profile.resumeUrl} download>Download resume <span className="button-link__arrow" aria-hidden="true">↓</span></a>
        ) : (
          <span className="button-link button-link--disabled" aria-disabled="true">Download resume <small>PDF needed</small></span>
        )}
      </div>
    </section>
  )
}
