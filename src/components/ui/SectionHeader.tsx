type SectionHeaderProps = {
  id: string
  number: string
  eyebrow: string
  title: string
  italic?: string
}

export function SectionHeader({ id, number, eyebrow, title, italic }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <p className="section-header__eyebrow technical-label"><span>{number}</span> — {eyebrow}</p>
      <h2 id={id}>{title}{italic && <> <em>{italic}</em></>}</h2>
    </header>
  )
}
