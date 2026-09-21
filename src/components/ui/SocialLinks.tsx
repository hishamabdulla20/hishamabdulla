import type { SocialLink } from '../../types/portfolio'

function SocialIcon({ label }: { label: string }) {
  const commonProps = {
    className: 'social-link__icon',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  switch (label.toLowerCase()) {
    case 'github':
      return <svg {...commonProps}><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
    case 'linkedin':
      return <svg {...commonProps}><path fill="currentColor" d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.69c0-3.84-2.05-5.63-4.79-5.63-2.2 0-3.19 1.21-3.74 2.06V8.25H9.22V21h3.25v-6.31c0-1.66.31-3.27 2.37-3.27 2.03 0 2.06 1.9 2.06 3.38V21H21v-7.31Z" /></svg>
    case 'email':
      return <svg {...commonProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg>
    case 'instagram':
      return <svg {...commonProps} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg>
    default:
      return null
  }
}

function SocialLinkItem({
  label,
  url,
  iconsOnly,
  onClick,
}: SocialLink & { iconsOnly: boolean; onClick?: () => void }) {
  if (!url) return null
  const isExternal = /^https?:\/\//.test(url)

  return (
    <a
      className="text-link social-link"
      href={url}
      aria-label={iconsOnly ? label : undefined}
      title={iconsOnly ? label : undefined}
      onClick={onClick}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <SocialIcon label={label} />
      {!iconsOnly && (
        <>
          <span>{label}</span>
          <span className="text-link__arrow" aria-hidden="true">↗</span>
        </>
      )}
    </a>
  )
}

type SocialLinksProps = {
  links: SocialLink[]
  iconsOnly?: boolean
  className?: string
  onLinkClick?: () => void
}

export function SocialLinks({ links, iconsOnly = false, className, onLinkClick }: SocialLinksProps) {
  const classes = [
    'social-list',
    iconsOnly ? 'social-list--icons' : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {links.map((link) => (
        <SocialLinkItem
          key={link.label}
          {...link}
          iconsOnly={iconsOnly}
          onClick={onLinkClick}
        />
      ))}
    </div>
  )
}
