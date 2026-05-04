import { useEffect } from 'react'

export default function useScrollProgress(elementId = 'scroll-progress') {
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      )
      const pct = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      const progressElement = document.getElementById(elementId)

      if (progressElement) {
        progressElement.style.transform = `scaleX(${Math.min(Math.max(pct, 0), 1)})`
      }
    }

    let frameId = null
    const scheduleUpdate = () => {
      if (frameId !== null) return

      frameId = window.requestAnimationFrame(() => {
        frameId = null
        updateScrollProgress()
      })
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [elementId])
}
