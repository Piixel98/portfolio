import { useEffect, useRef, useState } from 'react'
import { safeExternalLinkProps } from '../../utils/links'
import './Navbar.css'

export default function Navbar({ nav, profile }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const buttonRef = useRef(null)
  const firstMobileLinkRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined

    firstMobileLinkRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    setMenuOpen(false)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav
        aria-label="Primary navigation"
        className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}
      >
        <a
          href="#hero"
          aria-label={`${profile.name} ${profile.role} home`}
          className="site-nav__brand focus-visible"
        >
          <span>{profile.initials}</span>.dev
        </a>

        <ul className="site-nav__links">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.githubUrl}
          aria-label={`${profile.name} GitHub profile`}
          {...safeExternalLinkProps}
          className="site-nav__github focus-visible"
        >
          <img src="/icons/github.svg" alt="" aria-hidden="true" loading="lazy" />
          {profile.githubLabel} <span aria-hidden="true">-&gt;</span>
        </a>

        <button
          ref={buttonRef}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="site-nav__toggle focus-visible"
        >
          <span className="sr-only">Menu</span>
          <span
            aria-hidden="true"
            className={`site-nav__toggle-bars ${menuOpen ? 'site-nav__toggle-bars--open' : ''}`}
          >
            <span />
            <span />
            <span />
          </span>
        </button>

        <div
          id="mobile-navigation"
          aria-hidden={!menuOpen}
          className={`site-nav__mobile ${menuOpen ? 'site-nav__mobile--open' : ''}`}
        >
          <ul className="site-nav__mobile-links">
            {nav.links.map((link, index) => (
              <li key={link.href}>
                <a
                  ref={index === 0 ? firstMobileLinkRef : null}
                  href={link.href}
                  onClick={closeMenu}
                  className="nav-link nav-link--mobile focus-visible"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={profile.githubUrl}
            aria-label={`${profile.name} GitHub profile`}
            onClick={closeMenu}
            {...safeExternalLinkProps}
            className="site-nav__mobile-github focus-visible"
          >
            <img src="/icons/github.svg" alt="" aria-hidden="true" loading="lazy" />
            {profile.githubLabel} <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </nav>
    </>
  )
}
