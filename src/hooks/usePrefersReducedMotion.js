import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function getPrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion)

  useEffect(() => {
    if (!window.matchMedia) return undefined

    const mediaQuery = window.matchMedia(QUERY)
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches)

    onChange()
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return prefersReducedMotion
}
