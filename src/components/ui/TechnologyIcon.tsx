type TechnologyIconProps = {
  name: string
}

const iconProps = {
  className: 'tech-tag__icon',
  'aria-hidden': true,
  focusable: false,
} as const

export function TechnologyIcon({ name }: TechnologyIconProps) {
  switch (name) {
    case 'React':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="10" ry="4.15" fill="none" stroke="currentColor" strokeWidth="1.35" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4.15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            transform="rotate(120 12 12)"
          />
        </svg>
      )

    case 'TypeScript':
      return (
        <svg
          {...iconProps}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2.5" y="2.5" width="19" height="19" rx="1.5" strokeWidth="1.5" />
          <path d="M5.8 8.4h6.1M8.85 8.4v7.5" strokeWidth="1.65" />
          <path
            d="M18.45 9.5c-.55-.75-1.35-1.15-2.35-1.15-1.2 0-2.05.6-2.05 1.55 0 2.4 4.65 1.35 4.65 3.95 0 1.15-.95 2.05-2.55 2.05-1.1 0-2.05-.42-2.7-1.25"
            strokeWidth="1.65"
          />
        </svg>
      )

    case 'Tailwind CSS':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.57.89 2.29 1.62C13.47 10.42 15.12 11 18 11c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.57-.89-2.29-1.62C16.53 5.38 14.88 4.8 12 4.8ZM6 13c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.57.89 2.29 1.62C7.47 18.62 9.12 19.2 12 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.57-.89-2.29-1.62C10.53 13.58 8.88 13 6 13Z"
          />
        </svg>
      )

    case 'Supabase':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path fill="currentColor" d="M13.15 2.45c-.48-.61-1.46-.27-1.47.5l-.16 8.58h8.01c.75 0 1.17-.87.7-1.46l-7.08-7.62Z" />
          <path fill="currentColor" fillOpacity="0.55" d="M10.85 21.55c.48.61 1.46.27 1.47-.5l.16-8.58H4.47c-.75 0-1.17.87-.7 1.46l7.08 7.62Z" />
        </svg>
      )

    case 'PostgreSQL':
      return (
        <svg
          {...iconProps}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4.35C9.9 2.7 6.7 3.1 5.15 5.2c-1.35 1.82-.95 4.73.65 6.2-.45 2.28.78 4.27 3.05 4.65" strokeWidth="1.45" />
          <path d="M12 4.35c2.1-1.65 5.3-1.25 6.85.85 1.35 1.82.95 4.73-.65 6.2.45 2.28-.78 4.27-3.05 4.65" strokeWidth="1.45" />
          <path d="M9.15 8.2c0-1.7 1.18-2.85 2.85-2.85s2.85 1.15 2.85 2.85v7.35c0 3.15-1.45 5.1-3.95 5.1-1.28 0-2.3-.57-2.83-1.5 1.92.48 3.5-.43 3.5-2.45v-5.35" strokeWidth="1.55" />
          <circle cx="9.65" cy="8.65" r="0.72" fill="currentColor" stroke="none" />
          <circle cx="14.35" cy="8.65" r="0.72" fill="currentColor" stroke="none" />
        </svg>
      )

    default:
      return null
  }
}
