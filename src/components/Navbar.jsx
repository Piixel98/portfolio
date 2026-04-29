import { useEffect, useState } from 'react'

export default function Navbar({ nav, profile }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-16 transition-all duration-300 ${
      scrolled ? 'bg-[#080C12]/85 backdrop-blur-md border-b border-white/[0.07]' : ''
    }`}>
      <div className="font-mono text-[18px] font-bold tracking-tight">
        <span className="text-blue-400">{profile.initials}</span>.dev
      </div>
      <ul className="hidden md:flex gap-8 list-none">
        {nav.links.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className="nav-link after:absolute after:bottom-[-2px] after:left-1/2 after:right-1/2 after:h-px after:bg-blue-400 after:transition-all after:duration-300 hover:after:left-0 hover:after:right-0"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href={profile.githubUrl}
        target="_blank"
        rel="noreferrer"
        className="font-mono text-[12px] text-[#5A6478] border border-white/[0.07] px-3.5 py-1.5 rounded transition-all duration-200 hover:border-blue-500 hover:text-blue-400"
      >
        {profile.githubLabel} ↗
      </a>
    </nav>
  )
}
