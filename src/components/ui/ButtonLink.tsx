import type { ReactNode } from 'react'

type ButtonLinkProps = {
  children: ReactNode
  href: string
  variant?: 'primary' | 'secondary'
  external?: boolean
}

export function ButtonLink({
  children,
  href,
  variant = 'primary',
  external = false,
}: ButtonLinkProps) {
  return (
    <a
      className={`button-link button-link--${variant}`}
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span>{children}</span>
      <span className="button-link__arrow" aria-hidden="true">
        {external ? '↗' : '→'}
      </span>
    </a>
  )
}
