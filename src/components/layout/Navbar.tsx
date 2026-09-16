import { useEffect, useRef, useState } from 'react'
import { navigation } from '../../data/portfolio'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    if (isOpen) {
      root.dataset.menuOpen = 'true'
      body.dataset.menuOpen = 'true'
      const focusFrame = window.requestAnimationFrame(() => firstLinkRef.current?.focus())

      return () => {
        window.cancelAnimationFrame(focusFrame)
        delete root.dataset.menuOpen
        delete body.dataset.menuOpen
      }
    }

    delete root.dataset.menuOpen
    delete body.dataset.menuOpen
    return () => {
      delete root.dataset.menuOpen
      delete body.dataset.menuOpen
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        window.requestAnimationFrame(() => toggleRef.current?.focus())
        return
      }

      if (event.key !== 'Tab' || !headerRef.current) return

      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.getClientRects().length > 0)

      const first = focusable[0]
      const last = focusable.at(-1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [isOpen])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 821px)')
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false)
    }

    desktopQuery.addEventListener('change', closeAtDesktop)
    return () => desktopQuery.removeEventListener('change', closeAtDesktop)
  }, [])

  return (
    <header
      ref={headerRef}
      className={`site-header${isOpen ? ' site-header--menu-open' : ''}`}
    >
      <a
        className="wordmark"
        href="#top"
        aria-label="Hisham Abdulla, home"
        onClick={() => setIsOpen(false)}
      >
        HA<span className="wordmark__dot">.</span>
      </a>
      <button
        ref={toggleRef}
        className="menu-toggle"
        type="button"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
          {navigation.map((item, index) => (
            <li key={item.href}>
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
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
