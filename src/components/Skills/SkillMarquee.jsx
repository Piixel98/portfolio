import { useEffect, useRef } from 'react'

const AUTO_SCROLL_SPEED = 36
const INERTIA_DECAY_MS = 520
const MIN_INERTIA_SPEED = 6

function normalizeMotionOffset(motion) {
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

function applyTrackTransform(track, offset) {
  if (track) {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`
  }
}

export default function SkillMarquee({ children, groupIndex, groupTitle, prefersReducedMotion }) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    pointerId: null,
    lastMoveTs: 0,
  })
  const motionRef = useRef({
    offset: 0,
    setWidth: 0,
    direction: groupIndex % 2 === 0 ? 1 : -1,
    rafId: 0,
    lastTs: 0,
    paused: false,
    inertiaVelocity: 0,
  })

  useEffect(() => {
    const track = trackRef.current

    if (!track) {
      return undefined
    }

    const motion = motionRef.current
    motion.direction = groupIndex % 2 === 0 ? 1 : -1

    function syncLoopMetrics() {
      motion.setWidth = prefersReducedMotion ? 0 : track.scrollWidth / 2

      if (prefersReducedMotion) {
        motion.offset = 0
        motion.inertiaVelocity = 0
      } else {
        normalizeMotionOffset(motion)
      }

      applyTrackTransform(track, motion.offset)
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

    function step(timestamp) {
      if (!track.isConnected) {
        return
      }

      if (!motion.lastTs) {
        motion.lastTs = timestamp
      }

      const delta = timestamp - motion.lastTs
      motion.lastTs = timestamp

      if (!dragRef.current.isDragging && motion.setWidth > 0) {
        if (Math.abs(motion.inertiaVelocity) > 0) {
          motion.offset += (motion.inertiaVelocity * delta) / 1000
          motion.inertiaVelocity *= Math.exp(-delta / INERTIA_DECAY_MS)

          if (Math.abs(motion.inertiaVelocity) < MIN_INERTIA_SPEED) {
            motion.inertiaVelocity = 0
            motion.paused = false
          }

          normalizeMotionOffset(motion)
          applyTrackTransform(track, motion.offset)
        } else if (!motion.paused) {
          motion.offset += (motion.direction * (AUTO_SCROLL_SPEED * delta)) / 1000
          normalizeMotionOffset(motion)
          applyTrackTransform(track, motion.offset)
        }
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
      lastMoveTs: event.timeStamp,
    }

    motionRef.current.inertiaVelocity = 0
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
    const deltaTs = Math.max(1, event.timeStamp - dragState.lastMoveTs)

    event.preventDefault()
    dragRef.current.startX = event.clientX
    dragRef.current.lastMoveTs = event.timeStamp

    if (motion.setWidth > 0) {
      motion.offset -= deltaX
      motion.inertiaVelocity = (-deltaX / deltaTs) * 1000
      normalizeMotionOffset(motion)
      applyTrackTransform(trackRef.current, motion.offset)
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
      lastMoveTs: 0,
    }

    container.classList.remove('skill-marquee--dragging')

    if (Math.abs(motionRef.current.inertiaVelocity) < MIN_INERTIA_SPEED) {
      motionRef.current.inertiaVelocity = 0
      setPaused(false)
    }

    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId)
    }
  }

  function handleKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return
    }

    const motion = motionRef.current

    if (motion.setWidth <= 0 || !trackRef.current) {
      return
    }

    event.preventDefault()
    setPaused(true)

    if (event.key === 'Home') {
      motion.offset = 0
      motion.inertiaVelocity = 0
    } else if (event.key === 'End') {
      motion.offset = motion.setWidth - 1
      motion.inertiaVelocity = 0
    } else {
      motion.offset += event.key === 'ArrowRight' ? 48 : -48
      motion.inertiaVelocity = 0
      normalizeMotionOffset(motion)
    }

    applyTrackTransform(trackRef.current, motion.offset)
  }

  // The marquee is intentionally focusable so keyboard users can pan hidden items.
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={containerRef}
      className="skill-marquee"
      role="region"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex="0"
      aria-label={`Scrollable technologies for ${groupTitle}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div
        ref={trackRef}
        className={`skill-marquee__track ${
          prefersReducedMotion ? 'skill-marquee__track--static' : 'skill-marquee__track--loop'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
