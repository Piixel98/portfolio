import { useState } from 'react'
import './SkillLogo.css'

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function SkillLogo({ className, logo, name, ...props }) {
  const [failed, setFailed] = useState(false)
  const initials = getInitials(name)

  return (
    <div className={className} {...props}>
      {logo && !failed ? (
        <img src={logo} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <span className="skill-logo-fallback" aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  )
}
