import { useEffect, useRef, useState } from 'react'
import { safeExternalLinkProps } from '../../utils/links'

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

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav
        aria-label="Primary navigation"
        className={`fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-[5%] transition-all duration-300 ${
          scrolled ? 'bg-[#080C12]/85 backdrop-blur-md border-b border-white/[0.07]' : ''
        }`}
      >
        <a
          href="#hero"
          aria-label={`${profile.name} ${profile.role} home`}
          className="rounded font-mono text-[18px] font-bold tracking-tight focus-visible"
        >
          <span className="text-blue-400">{profile.initials}</span>.dev
        </a>

        <ul className="hidden list-none gap-8 md:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link after:absolute after:bottom-[-2px] after:left-1/2 after:right-1/2 after:h-px after:bg-blue-400 after:transition-all after:duration-300 hover:after:left-0 hover:after:right-0 focus-visible:after:left-0 focus-visible:after:right-0"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.githubUrl}
          aria-label={`${profile.name} GitHub profile`}
          {...safeExternalLinkProps}
          className="hidden rounded border border-white/[0.07] px-3.5 py-1.5 font-mono text-[12px] text-[#5A6478] transition-all duration-200 hover:border-blue-500 hover:text-blue-400 focus-visible sm:inline-flex"
        >
          {profile.githubLabel} <span aria-hidden="true">-&gt;</span>
        </a>

        <button
          ref={buttonRef}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/[0.07] text-[#E8EAF0] transition-colors hover:border-blue-500 hover:text-blue-400 focus-visible md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true" className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </span>
        </button>

        <div
          id="mobile-navigation"
          aria-hidden={!menuOpen}
          className={`absolute left-0 right-0 top-16 border-y border-white/[0.07] bg-[#080C12]/95 px-[5%] py-5 backdrop-blur-md md:hidden ${
            menuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex list-none flex-col gap-4">
            {nav.links.map((link, index) => (
              <li key={link.href}>
                <a
                  ref={index === 0 ? firstMobileLinkRef : null}
                  href={link.href}
                  onClick={closeMenu}
                  className="nav-link inline-flex min-h-10 items-center rounded focus-visible"
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
            className="mt-4 inline-flex rounded border border-white/[0.07] px-3.5 py-2 font-mono text-[12px] text-[#5A6478] transition-all duration-200 hover:border-blue-500 hover:text-blue-400 focus-visible"
          >
            {profile.githubLabel} <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </nav>
    </>
  )
}
