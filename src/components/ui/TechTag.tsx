import { TechnologyIcon } from './TechnologyIcon'

type TechTagProps = { children: string; muted?: boolean; showIcon?: boolean }

export function TechTag({ children, muted = false, showIcon = false }: TechTagProps) {
  return (
    <span className={`tech-tag${muted ? ' tech-tag--muted' : ''}`}>
      {showIcon && !muted ? <TechnologyIcon name={children} /> : null}
      {children}
    </span>
  )
}
