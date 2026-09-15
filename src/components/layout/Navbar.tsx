import { useEffect, useState } from 'react'
import { navigation } from '../../data/portfolio'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.dataset.menuOpen = isOpen ? 'true' : 'false'
    return () => {
      delete document.body.dataset.menuOpen
    }
  }, [isOpen])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Hisham Abdulla, home">
        HA<span className="wordmark__dot">.</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{isOpen ? 'Close' : 'Menu'}</span>
        <span className="menu-toggle__mark" aria-hidden="true" />
      </button>
      <nav
        id="primary-navigation"
        className={`primary-nav${isOpen ? ' primary-nav--open' : ''}`}
        aria-label="Primary navigation"
      >
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setIsOpen(false)}>
                <span>{item.number}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="header-contact" href="#contact">
        Let’s talk <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
