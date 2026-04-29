import { useEffect, useRef } from 'react'

export default function useCustomCursor(enabled) {
  const cursorRef = useRef(null)
  const cursorRingRef = useRef(null)
  const ringX = useRef(0)
  const ringY = useRef(0)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useEffect(() => {
    if (!enabled) return undefined

    let animationFrameId

    const moveCursor = (event) => {
      mouseX.current = event.clientX
      mouseY.current = event.clientY

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`
      }
    }

    const animateRing = () => {
      ringX.current += (mouseX.current - ringX.current) * 0.12
      ringY.current += (mouseY.current - ringY.current) * 0.12

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringX.current}px, ${ringY.current}px) translate(-50%, -50%)`
      }

      animationFrameId = requestAnimationFrame(animateRing)
    }

    document.addEventListener('mousemove', moveCursor)
    animationFrameId = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [enabled])

  return { cursorRef, cursorRingRef }
}
