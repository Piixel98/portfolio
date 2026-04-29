import { useEffect } from 'react'

export default function useFadeInSections(enabled) {
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.js-fade')

    if (!enabled) {
      fadeElements.forEach((element) => element.classList.add('visible'))
      return undefined
    }

    const fadeObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        }),
      { threshold: 0.1 },
    )

    fadeElements.forEach((element) => fadeObserver.observe(element))

    return () => fadeObserver.disconnect()
  }, [enabled])
}
