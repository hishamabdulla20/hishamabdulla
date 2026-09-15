type TechTagProps = { children: string; muted?: boolean }

export function TechTag({ children, muted = false }: TechTagProps) {
  return <span className={`tech-tag${muted ? ' tech-tag--muted' : ''}`}>{children}</span>
}
