import { useEffect, useRef } from 'react'

export default function SkillMarquee({ children, groupIndex, groupTitle, prefersReducedMotion }) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    pointerId: null,
  })
  const motionRef = useRef({
    offset: 0,
    setWidth: 0,
    direction: groupIndex % 2 === 0 ? 1 : -1,
    rafId: 0,
    lastTs: 0,
    paused: false,
  })

  useEffect(() => {
    const track = trackRef.current

    if (!track) {
      return undefined
    }

    const motion = motionRef.current
    motion.direction = groupIndex % 2 === 0 ? 1 : -1

    function normalizeOffset() {
      const { setWidth } = motion

      if (setWidth <= 0) {
        motion.offset = 0
        return
      }

      motion.offset %= setWidth

      if (motion.offset < 0) {
        motion.offset += setWidth
      }
    }

    function applyTransform() {
      track.style.transform = `translate3d(${-motion.offset}px, 0, 0)`
    }

    function syncLoopMetrics() {
      motion.setWidth = prefersReducedMotion ? 0 : track.scrollWidth / 2

      if (prefersReducedMotion) {
        motion.offset = 0
      } else {
        normalizeOffset()
      }

      applyTransform()
    }

    syncLoopMetrics()
    const resizeObserver = new ResizeObserver(() => {
      syncLoopMetrics()
    })
    resizeObserver.observe(track)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    if (prefersReducedMotion) {
      return () => {
        resizeObserver.disconnect()
      }
    }

    const speed = 36

    function step(timestamp) {
      if (!track.isConnected) {
        return
      }

      if (!motion.lastTs) {
        motion.lastTs = timestamp
      }

      const delta = timestamp - motion.lastTs
      motion.lastTs = timestamp

      if (!motion.paused && !dragRef.current.isDragging && motion.setWidth > 0) {
        motion.offset += motion.direction * (speed * delta) / 1000
        normalizeOffset()
        applyTransform()
      }

      motion.rafId = window.requestAnimationFrame(step)
    }

    motion.rafId = window.requestAnimationFrame(step)

    return () => {
      resizeObserver.disconnect()
      window.cancelAnimationFrame(motion.rafId)
      motion.rafId = 0
      motion.lastTs = 0
    }
  }, [groupIndex, prefersReducedMotion])

  function setPaused(value) {
    motionRef.current.paused = value
  }

  function handlePointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    const container = event.currentTarget
    dragRef.current = {
      isDragging: true,
      startX: event.clientX,
      pointerId: event.pointerId,
    }
    container.classList.add('skill-marquee--dragging')
    container.setPointerCapture(event.pointerId)
    setPaused(true)
  }

  function handlePointerMove(event) {
    const dragState = dragRef.current

    if (!dragState.isDragging) {
      return
    }

    const motion = motionRef.current
    const deltaX = event.clientX - dragState.startX

    event.preventDefault()
    dragRef.current.startX = event.clientX

    if (motion.setWidth > 0) {
      motion.offset -= deltaX
      motion.offset %= motion.setWidth

      if (motion.offset < 0) {
        motion.offset += motion.setWidth
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-motion.offset}px, 0, 0)`
      }
    }
  }

  function handlePointerEnd(event) {
    const container = event.currentTarget

    if (dragRef.current.pointerId !== event.pointerId) {
      return
    }

    dragRef.current = {
      isDragging: false,
      startX: 0,
      pointerId: null,
    }
    container.classList.remove('skill-marquee--dragging')
    setPaused(false)

    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      ref={containerRef}
      className="skill-marquee"
      tabIndex={0}
      aria-label={`Scrollable technologies for ${groupTitle}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div
        ref={trackRef}
        className={`skill-marquee__track ${prefersReducedMotion ? 'skill-marquee__track--static' : 'skill-marquee__track--loop'}`}
      >
        {children}
      </div>
    </div>
  )
}
