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

    case 'Next.js':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45">
          <circle cx="12" cy="12" r="9" />
          <path d="M7.5 16.5v-9l9 11M16.5 7.5v7" strokeLinecap="round" strokeLinejoin="round" />
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

    case 'Three.js':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round">
          <path d="m12 3 9 16H3L12 3Z" /><path d="m12 3-3 16M12 3l3 16M3 19l13-8M21 19 8 11" />
        </svg>
      )

    case 'Node.js':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round">
          <path d="m12 2.8 8 4.6v9.2l-8 4.6-8-4.6V7.4l8-4.6Z" /><path d="M8.2 15.7V8.3l7.6 7.4V8.3" />
        </svg>
      )

    case 'Express.js':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round">
          <path d="M3.5 7.5h7M3.5 12h6M3.5 16.5h7M12 8l8 8M20 8l-8 8" />
        </svg>
      )

    case 'Django':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 3.5v13H9.8a4.5 4.5 0 0 1 0-9h4.7M19 7.5v10.7c0 1.5-.8 2.3-2.3 2.3M19 3.7v.1" />
        </svg>
      )

    case 'REST API':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5V9l-2 3 2 3v3.5A1.5 1.5 0 0 0 5.5 20H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V9l2 3-2 3v3.5a1.5 1.5 0 0 1-1.5 1.5H16M9 12h6" />
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

    case 'MongoDB':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.5c4 4 6 7.3 5.2 10.3-.7 2.6-2.5 4.6-5.2 6.2-2.7-1.6-4.5-3.6-5.2-6.2C6 9.8 8 6.5 12 2.5Z" /><path d="M12 6v15.5" />
        </svg>
      )

    case 'Python':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3H8.5C6.6 3 6 4.2 6 6v3h6v2H5.5C3.8 11 3 12.4 3 14s.8 3 2.5 3H8" /><path d="M12 21h3.5c1.9 0 2.5-1.2 2.5-3v-3h-6v-2h6.5c1.7 0 2.5-1.4 2.5-3s-.8-3-2.5-3H16M9 6h.01M15 18h.01" />
        </svg>
      )

    case 'NumPy':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round">
          <path d="m4 7 4-2 4 2-4 2-4-2Zm8 0 4-2 4 2-4 2-4-2ZM4 13l4-2 4 2-4 2-4-2Zm8 0 4-2 4 2-4 2-4-2ZM8 9v6M16 9v6M4 7v6M12 7v12M20 7v6M8 15v4l4 2 4-2v-4" />
        </svg>
      )

    case 'Pandas':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3h3v8H5V3Zm0 11h3v7H5v-7Zm5-7h3v8h-3V7Zm0 11h3v3h-3v-3Zm5-15h3v5h-3V3Zm0 8h3v10h-3V11Z" />
        </svg>
      )

    case 'Matplotlib':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3v17h17" /><path d="m7 16 3.5-4 3 2 4.5-7" /><circle cx="7" cy="16" r="1" fill="currentColor" /><circle cx="10.5" cy="12" r="1" fill="currentColor" /><circle cx="13.5" cy="14" r="1" fill="currentColor" /><circle cx="18" cy="7" r="1" fill="currentColor" />
        </svg>
      )

    case 'scikit-learn':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35">
          <circle cx="7" cy="8" r="2.2" /><circle cx="17" cy="7" r="2.2" /><circle cx="12" cy="17" r="2.2" /><path d="m8.9 9.2 2.2 5.8M15.2 8.5l-2.1 6.4M9.2 7.8l5.6-.5" />
        </svg>
      )

    case 'Git':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.8 21.2 12 12 21.2 2.8 12 12 2.8Z" /><circle cx="9" cy="9" r="1.3" /><circle cx="15" cy="15" r="1.3" /><circle cx="15" cy="9" r="1.3" /><path d="m10 10 4 4M10.3 9H13.7" />
        </svg>
      )

    case 'GitHub':
      return (
        <svg {...iconProps} viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
      )

    case 'Docker':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h14.5c1.7 0 2.8-.5 3.5-1.5-.2 4.7-3.3 8-8.5 8H8c-2.7 0-4.2-2.2-5-6.5Z" /><path d="M6 9h3v3H6V9Zm3-3h3v3H9V6Zm0 3h3v3H9V9Zm3-6h3v3h-3V3Zm0 3h3v3h-3V6Zm0 3h3v3h-3V9Zm3 0h3v3h-3V9Z" />
        </svg>
      )

    case 'Vercel':
      return (
        <svg {...iconProps} viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 22 20H2L12 3Z" /></svg>
      )

    default:
      return null
  }
}
