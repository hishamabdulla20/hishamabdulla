type ExternalOrPlaceholderProps = {
  label: string
  url: string | null
}

export function ExternalOrPlaceholder({ label, url }: ExternalOrPlaceholderProps) {
  if (!url) {
    return (
      <span className="text-link text-link--disabled" aria-disabled="true" title="URL needed">
        {label} <span className="text-link__arrow" aria-hidden="true">↗</span><small>URL needed</small>
      </span>
    )
  }

  return (
    <a className="text-link" href={url} target="_blank" rel="noopener noreferrer">
      {label} <span className="text-link__arrow" aria-hidden="true">↗</span>
    </a>
  )
}
