'use client'

import { useEffect, useRef, useState } from 'react'
import { navigation } from '../../data/portfolio'

type Theme = 'dark' | 'light'

const themeStorageKey = 'portfolio-theme'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#F3EFE5' : '#000000')
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')
  const [themeReady, setThemeReady] = useState(false)
  const [activeHref, setActiveHref] = useState('')
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

  useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting)
        if (activeEntry) setActiveHref(`#${activeEntry.target.id}`)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // The inline pre-hydration script owns the initial DOM theme; mirror it once on mount.
    // oxlint-disable-next-line react/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
    setThemeReady(true)
  }, [])

  useEffect(() => {
    if (!themeReady) return
    applyTheme(theme)
  }, [theme, themeReady])

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)')
    const followSystemTheme = (event: MediaQueryListEvent) => {
      let savedTheme: string | null = null
      try {
        savedTheme = localStorage.getItem(themeStorageKey)
      } catch {
        // System preference remains the safe fallback when storage is unavailable.
      }

      if (savedTheme !== 'dark' && savedTheme !== 'light') {
        setTheme(event.matches ? 'light' : 'dark')
      }
    }

    systemTheme.addEventListener('change', followSystemTheme)
    return () => systemTheme.removeEventListener('change', followSystemTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(nextTheme)
    setTheme(nextTheme)
    try {
      localStorage.setItem(themeStorageKey, nextTheme)
    } catch {
      // The theme still works for this session when storage is unavailable.
    }
  }

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
      <div className="header-actions">
        <button
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3.5" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.5 15.1A8 8 0 0 1 8.9 4.5 8 8 0 1 0 19.5 15.1Z" />
            </svg>
          )}
        </button>
        <a className="header-contact" href="#contact">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
      </div>
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
                aria-current={activeHref === item.href ? 'location' : undefined}
                onClick={() => setIsOpen(false)}
              >
                <span>{item.number}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
