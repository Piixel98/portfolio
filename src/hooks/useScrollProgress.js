import { useEffect } from 'react'

export default function useScrollProgress(elementId = 'scroll-progress') {
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      )
      const pct = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0
      const progressElement = document.getElementById(elementId)

      if (progressElement) {
        progressElement.style.width = `${Math.min(Math.max(pct, 0), 100)}%`
      }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [elementId])
}
