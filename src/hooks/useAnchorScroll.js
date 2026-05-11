function getHashTarget(hash) {
  if (!hash || hash === '#') return null

  const id = decodeURIComponent(hash.slice(1))
  return document.getElementById(id)
}

function getScrollTopForTarget(target) {
  const nav = document.querySelector('nav[aria-label="Primary navigation"]')
  const navHeight = nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 0

  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - navHeight)
}

function shouldHandleClick(event, anchor) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    anchor.origin === window.location.origin &&
    anchor.pathname === window.location.pathname &&
    anchor.hash
  )
}

export function scrollToHash(hash) {
  const target = getHashTarget(hash)
  if (!target) return false

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior = prefersReducedMotion ? 'auto' : 'smooth'

  window.history.pushState(null, '', hash)
  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: getScrollTopForTarget(target),
      behavior,
    })

    window.setTimeout(
      () => {
        const correctedTop = getScrollTopForTarget(target)

        if (Math.abs(window.scrollY - correctedTop) > 2) {
          window.scrollTo({ top: correctedTop, behavior: 'auto' })
        }
      },
      prefersReducedMotion ? 0 : 520,
    )
  })

  return true
}

export default function useAnchorScroll() {
  useEffect(() => {
    const handleClick = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null

      if (!(anchor instanceof HTMLAnchorElement) || !shouldHandleClick(event, anchor)) return

      if (scrollToHash(anchor.hash)) {
        event.preventDefault()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
import { useEffect } from 'react'
