import { useEffect, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function useFadeInElement() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [node, setNode] = useState(null)

  useEffect(() => {
    if (!node) return undefined

    if (prefersReducedMotion) {
      node.classList.add('visible')
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [node, prefersReducedMotion])

  return setNode
}
